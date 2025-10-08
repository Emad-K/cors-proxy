import { Buffer } from 'node:buffer';
import process from 'node:process';
import { URL } from 'node:url';

import { serve } from '@hono/node-server';
import { RedisStore } from '@hono-rate-limiter/redis';
import axios from 'axios';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from 'hono-rate-limiter';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import Redis from 'ioredis';

import env from './env.js';
import { catchAsync, createRedisWrapper, clientIp } from './helpers.js';
import { logger, loggerMiddleware } from './logger.js';

const app = new Hono();

app.use('*', loggerMiddleware());

// Initialize ioredis client
const redisClient = new Redis(env.REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 50, 2000),
  commandTimeout: 1000,
});

// Create wrapped Redis client
const redis = createRedisWrapper(redisClient);

// Log Redis connection errors
redisClient.on('error', (error) => {
  logger.error(`Redis connection error: ${error.message}`);
});

// Rate limiting middleware
app.use(async (c, next) => {
  const ip = clientIp(c);
  // It's docker traffic
  const isInternal = ip.startsWith('172.');
  if (isInternal) {
    return next();
  }
  return rateLimiter({
    limit: env.RATE_LIMIT_MAX,
    windowMs: env.RATE_LIMIT_WINDOW * 1000, // Convert seconds to milliseconds
    store: new RedisStore({ client: redis }),
    keyGenerator: (_c) => `rl-ip-${ip}`,
    message: ReasonPhrases.TOO_MANY_REQUESTS,
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
  })(c, next);
});

// Enable CORS for all routes
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// Health check endpoint
app.get('/health', async (c) => {
  const [redisError] = await catchAsync(redis.ping());
  return c.json({ redis: redisError ? 'disconnected' : 'connected' });
});

// Main proxy route
app.get('*', async (c) => {
  // Extract the target URL from the path
  const targetUrl = c.req.path.slice(1);

  if (!targetUrl) {
    return c.json({ error: 'No URL provided' }, 400);
  }

  // Validate URL
  const [urlError, parsedUrl] = await catchAsync(Promise.resolve(new URL(targetUrl)));
  if (urlError) {
    return c.json({ error: 'Invalid URL provided' }, 400);
  }

  // Check Redis cache
  const cacheKey = `image:${targetUrl}`;
  const [cacheError, cachedData] = await catchAsync(redis.getBuffer(cacheKey));

  if (!cacheError && cachedData) {
    // Retrieve cached headers
    const [headerError, cachedHeaders] = await catchAsync(
      redis.get(`${cacheKey}:headers`).then(JSON.parse),
    );

    if (!headerError && cachedHeaders) {
      logger.info(`Serving cached image for ${targetUrl}`);
      return c.body(cachedData, 200, cachedHeaders);
    }
  }

  // Prepare headers for the request
  const headers = {
    'User-Agent': env.USER_AGENT,
    'Origin': `${parsedUrl.protocol}//${parsedUrl.host}`,
    'Referer': `${parsedUrl.protocol}//${parsedUrl.host}/`,
    'X-Forwarded-For': clientIp(c),
    'X-Forwarded-Host': parsedUrl.host,
    'X-Forwarded-Proto': parsedUrl.protocol.replace(':', ''),
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
  };

  // Fetch the image with axios
  const [fetchError, response] = await catchAsync(
    axios.get(targetUrl, {
      headers,
      responseType: 'arraybuffer',
      timeout: env.TIMEOUT,
      maxRedirects: 5,
      validateStatus: (status) => status < 400,
    }),
  );

  if (fetchError) {
    logger.error(`Proxy error: ${fetchError.message}`);

    if (fetchError.code === 'ECONNABORTED') {
      return c.json({ error: 'Request timeout' }, 504);
    }

    if (fetchError.response) {
      return c.json(
        { error: `Upstream error: ${fetchError.response.statusText}` },
        fetchError.response.status,
      );
    }

    return c.json({ error: 'Internal server error' }, 500);
  }

  // Verify the response is valid and cacheable
  const contentType = response.headers['content-type'] || '';
  const isImage = contentType.startsWith('image/');
  const hasData = response.data && response.data.length > 0;

  // Set response headers
  const responseHeaders = {};

  if (contentType) {
    responseHeaders['Content-Type'] = contentType;
  }

  if (response.headers['cache-control']) {
    responseHeaders['Cache-Control'] = response.headers['cache-control'];
  }

  if (response.headers['etag']) {
    responseHeaders['ETag'] = response.headers['etag'];
  }

  // Cache the response in Redis if conditions are met
  if (!fetchError && isImage && hasData) {
    const [setCacheError] = await catchAsync(Promise.all([
      redis.set(cacheKey, Buffer.from(response.data), 'EX', env.CACHE_DURATION),
      redis.set(`${cacheKey}:headers`, JSON.stringify(responseHeaders), 'EX', env.CACHE_DURATION),
    ]));

    if (setCacheError) {
      logger.error(`Redis cache error: ${setCacheError.message}`);
    }
  }

  // Log successful proxy
  logger.info(`Proxied image from ${targetUrl}`);

  // Return the image data
  return c.body(response.data, 200, responseHeaders);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Shutting down server...');
  await redis.quit();
  process.exit(0);
});

// Start the server
serve({
  fetch: app.fetch,
  port: env.PORT,
  hostname: '0.0.0.0',
});

logger.info(`CORS proxy server running on port ${env.PORT}`);
logger.info(`Usage: http://0.0.0.0:${env.PORT}/https://example.com/image.png`);

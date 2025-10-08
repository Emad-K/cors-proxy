import crypto from 'node:crypto';

import { pinoLogger } from 'hono-pino';
import pino from 'pino';

import env from './env.js';

// Initialize logger
const logger = pino(
  {
    level: env.LOG_LEVEL || 'info',
  },
);

// Logger middleware
function loggerMiddleware() {
  const excludedPaths = [
    '/favicon.ico',
    '/health',
  ];

  return (c, next) => {
    const path = c.req.path;

    // Skip logger for excluded paths
    if (excludedPaths.includes(path)) {
      return next();
    }

    // Use pinoLogger for all other paths
    return pinoLogger({
      pino: logger,
      http: {
        reqId: () => crypto.randomUUID(),
      },
    })(c, next);
  };
}

export { logger, loggerMiddleware };

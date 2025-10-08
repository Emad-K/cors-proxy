export function clientIp(c) {
  // 1. Check Cloudflare header first
  const cloudFlareIp = c.req.header('cf-connecting-ip');
  if (cloudFlareIp) {
    return cloudFlareIp.trim();
  }

  // 2. Check X-Forwarded-For header next
  const xForwardedFor = c.req.header('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim(); // Take the first IP in the list
  }

  // 3. Fallback to the socket's remote address
  const socketRemoteAddress = c.env?.incoming?.socket?.remoteAddress;
  if (socketRemoteAddress && typeof socketRemoteAddress === 'string') {
    return socketRemoteAddress;
  }

  // 4. Fallback to an empty string
  return '';
}

// Helper function to catch errors in [error, result] format
export async function catchAsync(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}

// Helper function to create a compatibility wrapper for ioredis
export function createRedisWrapper(redisClient) {
  return {
    ...redisClient,
    scriptLoad: async (script) => {
      return redisClient.script('load', script);
    },
    evalsha: (sha, keys, args) => redisClient.evalsha(sha, keys.length, ...keys, ...args),
    get: redisClient.get.bind(redisClient),
    getBuffer: redisClient.getBuffer.bind(redisClient),
    set: redisClient.set.bind(redisClient),
    del: redisClient.del.bind(redisClient),
    decr: redisClient.decr.bind(redisClient),
    ping: redisClient.ping.bind(redisClient),
  };
}

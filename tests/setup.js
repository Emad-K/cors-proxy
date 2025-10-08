import process from 'node:process';

import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
  process.env.PORT = '3001';
  process.env.REDIS_URL = 'redis://localhost:6379';
  process.env.CACHE_DURATION = '300';
  process.env.TIMEOUT = '5000';
  process.env.RATE_LIMIT_WINDOW = '60';
  process.env.RATE_LIMIT_MAX = '100';
  process.env.USER_AGENT = 'CORS-Proxy-Test/1.0';

  // Mock Redis globally
  vi.mock('ioredis', () => ({
    default: vi.fn(() => ({
      ping: vi.fn().mockResolvedValue('PONG'),
      get: vi.fn().mockResolvedValue(null),
      getBuffer: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue('OK'),
      del: vi.fn().mockResolvedValue(1),
      decr: vi.fn().mockResolvedValue(1),
      quit: vi.fn().mockResolvedValue('OK'),
      on: vi.fn(),
      script: vi.fn().mockResolvedValue('sha123'),
      evalsha: vi.fn().mockResolvedValue([]),
    })),
  }));

  // Mock axios globally
  vi.mock('axios', () => ({
    default: {
      get: vi.fn(),
    },
  }));
});
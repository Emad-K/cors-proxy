import process from 'node:process';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('env', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should load all required environment variables', async () => {
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'info';
    process.env.PORT = '3000';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.CACHE_DURATION = '300';
    process.env.TIMEOUT = '5000';
    process.env.RATE_LIMIT_WINDOW = '60';
    process.env.RATE_LIMIT_MAX = '100';
    process.env.USER_AGENT = 'CORS-Proxy/1.0';

    const { default: env } = await import('../src/env.js');

    expect(env.NODE_ENV).toBe('test');
    expect(env.LOG_LEVEL).toBe('info');
    expect(env.PORT).toBe(3000);
    expect(env.REDIS_URL).toBe('redis://localhost:6379');
    expect(env.CACHE_DURATION).toBe(300);
    expect(env.TIMEOUT).toBe(5000);
    expect(env.RATE_LIMIT_WINDOW).toBe(60);
    expect(env.RATE_LIMIT_MAX).toBe(100);
    expect(env.USER_AGENT).toBe('CORS-Proxy/1.0');
  });

  it('should throw error for missing environment variables', async () => {
    delete process.env.NODE_ENV;

    await expect(import('../src/env.js')).rejects.toThrow(
      'Environment variable NODE_ENV is missing or empty',
    );
  });

  it('should throw error for invalid number environment variables', async () => {
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'info';
    process.env.PORT = 'invalid';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.CACHE_DURATION = '300';
    process.env.TIMEOUT = '5000';
    process.env.RATE_LIMIT_WINDOW = '60';
    process.env.RATE_LIMIT_MAX = '100';
    process.env.USER_AGENT = 'CORS-Proxy/1.0';

    await expect(import('../src/env.js')).rejects.toThrow(
      'Environment variable PORT must be a valid number, got "invalid"',
    );
  });
});
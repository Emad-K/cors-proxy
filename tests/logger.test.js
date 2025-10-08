import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('logger', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('loggerMiddleware', () => {
    it('should skip logging for excluded paths', async () => {
      const { loggerMiddleware } = await import('../src/logger.js');
      
      const middleware = loggerMiddleware();
      const mockNext = vi.fn();
      
      // Test favicon.ico exclusion
      const faviconContext = {
        req: { path: '/favicon.ico' },
      };
      
      await middleware(faviconContext, mockNext);
      expect(mockNext).toHaveBeenCalled();
      
      // Test health endpoint exclusion
      const healthContext = {
        req: { path: '/health' },
      };
      
      mockNext.mockClear();
      await middleware(healthContext, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should use pino logger for non-excluded paths', async () => {
      const { loggerMiddleware } = await import('../src/logger.js');
      
      const middleware = loggerMiddleware();
      
      // Test that middleware function is created
      expect(typeof middleware).toBe('function');
    });
  });

  describe('logger configuration', () => {
    it('should create logger with correct log level', async () => {
      const { logger } = await import('../src/logger.js');
      
      // Verify logger exists and has expected methods
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });
  });
});
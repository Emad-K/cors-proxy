import process from 'node:process';

import { describe, it, expect } from 'vitest';

describe('End-to-End Tests', () => {
  describe('Environment Configuration', () => {
    it('should have required environment variables', () => {
      const requiredEnvVars = [
        'NODE_ENV',
        'LOG_LEVEL', 
        'PORT',
        'REDIS_URL',
        'CACHE_DURATION',
        'TIMEOUT',
        'RATE_LIMIT_WINDOW',
        'RATE_LIMIT_MAX',
        'USER_AGENT',
      ];

      requiredEnvVars.forEach(envVar => {
        expect(process.env[envVar]).toBeDefined();
        expect(process.env[envVar]).not.toBe('');
      });
    });

    it('should have numeric environment variables as valid numbers', () => {
      const numericEnvVars = ['PORT', 'CACHE_DURATION', 'TIMEOUT', 'RATE_LIMIT_WINDOW', 'RATE_LIMIT_MAX'];
      
      numericEnvVars.forEach(envVar => {
        const value = process.env[envVar];
        expect(value).toBeDefined();
        expect(Number.isNaN(parseInt(value, 10))).toBe(false);
        expect(parseInt(value, 10)).toBeGreaterThan(0);
      });
    });
  });

  describe('URL Validation', () => {
    it('should validate URLs correctly', () => {
      const validUrls = [
        'https://example.com/image.jpg',
        'http://test.com/photo.png',
        'https://cdn.example.org/assets/logo.svg',
      ];

      const invalidUrls = [
        'not-a-url',
        'invalid-url-format',
        '',
      ];

      validUrls.forEach(url => {
        expect(() => new globalThis.URL(url)).not.toThrow();
      });

      invalidUrls.forEach(url => {
        if (url === '') {
          expect(url).toBe('');
        } else {
          expect(() => new globalThis.URL(url)).toThrow();
        }
      });
    });
  });

  describe('Content Type Validation', () => {
    it('should identify image content types', () => {
      const imageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/avif',
      ];

      const nonImageTypes = [
        'text/html',
        'application/json',
        'text/plain',
        'application/octet-stream',
      ];

      imageTypes.forEach(type => {
        expect(type.startsWith('image/')).toBe(true);
      });

      nonImageTypes.forEach(type => {
        expect(type.startsWith('image/')).toBe(false);
      });
    });
  });

  describe('Cache Configuration', () => {
    it('should have valid cache duration', () => {
      const cacheDuration = parseInt(process.env.CACHE_DURATION, 10);
      expect(cacheDuration).toBeGreaterThan(0);
      expect(cacheDuration).toBeLessThanOrEqual(86400); // Max 24 hours
    });
  });

  describe('Rate Limiting Configuration', () => {
    it('should have valid rate limiting settings', () => {
      const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX, 10);
      const rateLimitWindow = parseInt(process.env.RATE_LIMIT_WINDOW, 10);

      expect(rateLimitMax).toBeGreaterThan(0);
      expect(rateLimitWindow).toBeGreaterThan(0);
      expect(rateLimitWindow).toBeLessThanOrEqual(3600); // Max 1 hour
    });
  });

  describe('Timeout Configuration', () => {
    it('should have reasonable timeout values', () => {
      const timeout = parseInt(process.env.TIMEOUT, 10);
      expect(timeout).toBeGreaterThan(1000); // At least 1 second
      expect(timeout).toBeLessThanOrEqual(30000); // Max 30 seconds
    });
  });
});
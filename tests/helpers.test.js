import { describe, it, expect, vi } from 'vitest';

import { clientIp, catchAsync, createRedisWrapper } from '../src/helpers.js';

describe('helpers', () => {
  describe('clientIp', () => {
    it('should return Cloudflare IP when cf-connecting-ip header is present', () => {
      const mockContext = {
        req: {
          header: vi.fn((name) => {
            if (name === 'cf-connecting-ip') return '1.2.3.4';
            return null;
          }),
        },
      };

      const result = clientIp(mockContext);
      expect(result).toBe('1.2.3.4');
    });

    it('should return first IP from x-forwarded-for when cf-connecting-ip is not present', () => {
      const mockContext = {
        req: {
          header: vi.fn((name) => {
            if (name === 'cf-connecting-ip') return null;
            if (name === 'x-forwarded-for') return '5.6.7.8, 9.10.11.12';
            return null;
          }),
        },
      };

      const result = clientIp(mockContext);
      expect(result).toBe('5.6.7.8');
    });

    it('should return socket remote address when headers are not present', () => {
      const mockContext = {
        req: {
          header: vi.fn(() => null),
        },
        env: {
          incoming: {
            socket: {
              remoteAddress: '192.168.1.1',
            },
          },
        },
      };

      const result = clientIp(mockContext);
      expect(result).toBe('192.168.1.1');
    });

    it('should return empty string when no IP sources are available', () => {
      const mockContext = {
        req: {
          header: vi.fn(() => null),
        },
        env: {},
      };

      const result = clientIp(mockContext);
      expect(result).toBe('');
    });
  });

  describe('catchAsync', () => {
    it('should return [null, result] for successful promises', async () => {
      const promise = Promise.resolve('success');
      const [error, result] = await catchAsync(promise);
      
      expect(error).toBeNull();
      expect(result).toBe('success');
    });

    it('should return [error, null] for rejected promises', async () => {
      const testError = new Error('test error');
      const promise = Promise.reject(testError);
      const [error, result] = await catchAsync(promise);
      
      expect(error).toBe(testError);
      expect(result).toBeNull();
    });
  });

  describe('createRedisWrapper', () => {
    it('should create a wrapper with required methods', () => {
      const mockRedisClient = {
        script: vi.fn(),
        evalsha: vi.fn(),
        get: vi.fn(),
        getBuffer: vi.fn(),
        set: vi.fn(),
        del: vi.fn(),
        decr: vi.fn(),
        ping: vi.fn(),
      };

      const wrapper = createRedisWrapper(mockRedisClient);

      expect(wrapper).toHaveProperty('scriptLoad');
      expect(wrapper).toHaveProperty('evalsha');
      expect(wrapper).toHaveProperty('get');
      expect(wrapper).toHaveProperty('getBuffer');
      expect(wrapper).toHaveProperty('set');
      expect(wrapper).toHaveProperty('del');
      expect(wrapper).toHaveProperty('decr');
      expect(wrapper).toHaveProperty('ping');
    });

    it('should call script load correctly', async () => {
      const mockRedisClient = {
        script: vi.fn().mockResolvedValue('sha123'),
        get: vi.fn(),
        getBuffer: vi.fn(),
        set: vi.fn(),
        del: vi.fn(),
        decr: vi.fn(),
        ping: vi.fn(),
        evalsha: vi.fn(),
      };

      const wrapper = createRedisWrapper(mockRedisClient);
      await wrapper.scriptLoad('test script');

      expect(mockRedisClient.script).toHaveBeenCalledWith('load', 'test script');
    });
  });
});
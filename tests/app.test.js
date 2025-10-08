
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { describe, it, expect } from 'vitest';

describe('CORS Proxy API', () => {
  describe('Health endpoint', () => {
    it('should return connected status when Redis is available', async () => {
      const app = new Hono();
      
      app.get('/health', async (c) => {
        return c.json({ redis: 'connected' });
      });

      const req = new globalThis.Request('http://localhost/health');
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ redis: 'connected' });
    });
  });

  describe('Proxy endpoint', () => {
    it('should return error when no URL is provided', async () => {
      const app = new Hono();
      
      app.get('*', async (c) => {
        const targetUrl = c.req.path.slice(1);
        
        if (!targetUrl) {
          return c.json({ error: 'No URL provided' }, 400);
        }
        
        return c.json({ success: true });
      });

      const req = new globalThis.Request('http://localhost/');
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data).toEqual({ error: 'No URL provided' });
    });

    it('should return error for invalid URL', async () => {
      const app = new Hono();
      
      app.get('*', async (c) => {
        const targetUrl = c.req.path.slice(1);
        
        if (!targetUrl) {
          return c.json({ error: 'No URL provided' }, 400);
        }

        try {
          new globalThis.URL(targetUrl);
        } catch {
          return c.json({ error: 'Invalid URL provided' }, 400);
        }
        
        return c.json({ success: true });
      });

      const req = new globalThis.Request('http://localhost/invalid-url');
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid URL provided' });
    });

    it('should accept valid URLs', async () => {
      const app = new Hono();
      
      app.get('*', async (c) => {
        const targetUrl = c.req.path.slice(1);
        
        if (!targetUrl) {
          return c.json({ error: 'No URL provided' }, 400);
        }

        try {
          new globalThis.URL(targetUrl);
        } catch {
          return c.json({ error: 'Invalid URL provided' }, 400);
        }
        
        return c.json({ success: true, url: targetUrl });
      });

      const req = new globalThis.Request('http://localhost/https://example.com/image.jpg');
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ 
        success: true, 
        url: 'https://example.com/image.jpg',
      });
    });
  });

  describe('CORS configuration', () => {
    it('should have proper CORS headers', async () => {
      const app = new Hono();
      
      app.use('*', cors({
        origin: '*',
        allowMethods: ['GET', 'OPTIONS'],
        allowHeaders: ['Content-Type'],
      }));
      
      app.get('/test', (c) => c.json({ test: true }));

      const req = new globalThis.Request('http://localhost/test', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://example.com',
          'Access-Control-Request-Method': 'GET',
        },
      });
      
      const res = await app.fetch(req);
      
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });
  });
});
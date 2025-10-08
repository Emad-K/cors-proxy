# CORS Proxy

[![Test, Build and Deploy](https://github.com/Emad-K/cors-proxy/actions/workflows/docker-build.yml/badge.svg)](https://github.com/Emad-K/cors-proxy/actions/workflows/docker-build.yml)
[![CI](https://github.com/Emad-K/cors-proxy/actions/workflows/ci.yml/badge.svg)](https://github.com/Emad-K/cors-proxy/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance CORS proxy server built with Hono.js that enables cross-origin requests to any URL with intelligent caching, rate limiting, and comprehensive logging.

## ✨ Features

- 🚀 **High Performance** - Built with Hono.js for maximum speed
- 🔒 **Rate Limiting** - Redis-backed rate limiting with IP-based controls
- 💾 **Intelligent Caching** - Redis caching for improved response times
- 🌐 **CORS Enabled** - Handles cross-origin requests seamlessly
- 📊 **Comprehensive Logging** - Structured logging with Pino
- 🐳 **Docker Ready** - Containerized for easy deployment
- ✅ **Well Tested** - 33+ tests with comprehensive coverage
- 🔧 **Environment Configurable** - Flexible configuration via environment variables

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Pull and run the latest image
docker run -d \
  --name cors-proxy \
  -p 3000:3000 \
  -e REDIS_URL=redis://your-redis:6379 \
  -e NODE_ENV=production \
  -e LOG_LEVEL=info \
  -e CACHE_DURATION=300 \
  -e TIMEOUT=5000 \
  -e RATE_LIMIT_WINDOW=60 \
  -e RATE_LIMIT_MAX=100 \
  -e USER_AGENT="CORS-Proxy/1.0" \
  ghcr.io/emad-k/cors-proxy:latest
```

### Using Docker Compose

```bash
# Clone the repository
git clone https://github.com/Emad-K/cors-proxy.git
cd cors-proxy

# Start with Docker Compose
docker-compose up -d
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/Emad-K/cors-proxy.git
cd cors-proxy

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Start Redis (required)
docker run -d --name redis -p 6379:6379 redis:alpine

# Start the server
pnpm start
```

## 📖 Usage

### Basic Proxy Request

```bash
# Proxy any URL by appending it to your server
curl "http://localhost:3000/https://api.example.com/data"

# Proxy images
curl "http://localhost:3000/https://example.com/image.jpg"
```

### JavaScript/Frontend Usage

```javascript
// Instead of direct request (blocked by CORS)
// fetch('https://api.example.com/data') // ❌ CORS Error

// Use the proxy
fetch('http://localhost:3000/https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data)); // ✅ Works!
```

### Health Check

```bash
curl http://localhost:3000/health
# Response: {"redis":"connected"}
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production) | - | ✅ |
| `LOG_LEVEL` | Logging level (debug/info/warn/error) | - | ✅ |
| `PORT` | Server port | - | ✅ |
| `REDIS_URL` | Redis connection URL | - | ✅ |
| `CACHE_DURATION` | Cache TTL in seconds | - | ✅ |
| `TIMEOUT` | Request timeout in milliseconds | - | ✅ |
| `RATE_LIMIT_WINDOW` | Rate limit window in seconds | - | ✅ |
| `RATE_LIMIT_MAX` | Max requests per window | - | ✅ |
| `USER_AGENT` | User agent for upstream requests | - | ✅ |

### Example Configuration

```bash
NODE_ENV=production
LOG_LEVEL=info
PORT=3000
REDIS_URL=redis://localhost:6379
CACHE_DURATION=300
TIMEOUT=5000
RATE_LIMIT_WINDOW=60
RATE_LIMIT_MAX=100
USER_AGENT=CORS-Proxy/1.0
```

## 🏗️ Architecture

### Core Components

- **Hono.js** - Ultra-fast web framework
- **Redis** - Caching and rate limiting storage
- **Axios** - HTTP client for upstream requests
- **Pino** - High-performance logging

### Request Flow

1. **Rate Limiting** - Check IP-based limits (bypassed for internal Docker traffic)
2. **URL Validation** - Validate and parse target URL
3. **Cache Check** - Look for cached response in Redis
4. **Upstream Request** - Fetch from target URL if not cached
5. **Response Caching** - Cache valid image responses
6. **CORS Headers** - Add appropriate CORS headers
7. **Response** - Return proxied content

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run specific test suites
pnpm run test:unit        # Unit tests
pnpm run test:integration # Integration tests
pnpm run test:e2e        # End-to-end tests

# Run with coverage
pnpm run test:coverage
```

### Test Coverage
- ✅ 33+ tests across 6 test files
- ✅ Unit tests for utilities and helpers
- ✅ Integration tests for core functionality
- ✅ End-to-end tests for full workflows
- ✅ Mocked dependencies for reliable testing

## 🚀 Deployment

### GitHub Container Registry

Images are automatically built and pushed to GitHub Container Registry:

```bash
# Latest stable
docker pull ghcr.io/emad-k/cors-proxy:latest

# Specific commit
docker pull ghcr.io/emad-k/cors-proxy:main-abc1234
```

### Production Deployment

1. **Environment Setup** - Configure all required environment variables
2. **Redis Instance** - Ensure Redis is available and accessible
3. **Health Checks** - Monitor `/health` endpoint
4. **Scaling** - Run multiple instances behind a load balancer
5. **Monitoring** - Set up log aggregation and metrics

## 🔧 Development

### Prerequisites

- Node.js 20+
- pnpm
- Redis
- Docker (optional)

### Setup

```bash
# Install dependencies
pnpm install

# Run linting
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Run tests
pnpm test
```

### Project Structure

```
├── src/
│   ├── index.js      # Main application
│   ├── env.js        # Environment configuration
│   ├── helpers.js    # Utility functions
│   └── logger.js     # Logging setup
├── tests/            # Test files
├── .github/          # GitHub Actions workflows
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 📊 Performance

- **Response Time** - Sub-millisecond for cached requests
- **Throughput** - Handles thousands of requests per second
- **Memory Usage** - Optimized for low memory footprint
- **Caching** - Intelligent Redis caching reduces upstream load

## 🔒 Security

- **Rate Limiting** - Prevents abuse with configurable limits
- **Input Validation** - Validates all URLs before processing
- **Error Handling** - Graceful error handling prevents information leakage
- **Docker Security** - Runs as non-root user in container

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Run linting (`pnpm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hono.js](https://hono.dev/) - Ultra-fast web framework
- [Redis](https://redis.io/) - In-memory data structure store
- [Pino](https://getpino.io/) - Super fast logger

## 📞 Support

- 🐛 **Bug Reports** - [GitHub Issues](https://github.com/Emad-K/cors-proxy/issues)
- 💡 **Feature Requests** - [GitHub Discussions](https://github.com/Emad-K/cors-proxy/discussions)
- 📖 **Documentation** - [Wiki](https://github.com/Emad-K/cors-proxy/wiki)

---
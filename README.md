<div align="center">
  <a href="https://github.com/Emad-K/cors-proxy">
    <img src="https://raw.githubusercontent.com/Emad-K/cors-proxy/main/.github/assets/logo.svg" alt="CORS Proxy" width="150" height="150">
  </a>
  <h1 align="center">CORS Proxy</h1>
</div>

<div align="center">
  <a href="https://github.com/Emad-K/cors-proxy/actions/workflows/ci.yml">
    <img src="https://github.com/Emad-K/cors-proxy/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
  <a href="https://github.com/Emad-K/cors-proxy/actions/workflows/docker-build.yml">
    <img src="https://github.com/Emad-K/cors-proxy/actions/workflows/docker-build.yml/badge.svg" alt="Test, Build and Deploy">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  </a>
</div>

A high-performance CORS proxy server built with Hono.js that enables cross-origin requests to any URL with intelligent caching, rate limiting, and comprehensive logging.

## ✨ Features

| 🚀 Performance | 🔒 Security | 💻 Developer Experience |
| :--- | :--- | :--- |
| **High-Performance Core** | **IP-Based Rate Limiting** | **Seamless CORS Handling** |
| Built with [Hono.js](https://hono.dev/), one of the fastest web frameworks for Node.js. | Prevents abuse with Redis-backed rate limiting. | Automatically handles CORS headers for any proxied request. |
| **Intelligent Caching** | **URL Validation** | **Comprehensive Logging** |
| Redis caching for proxied responses reduces latency. | Ensures that only valid URLs are processed. | Structured logging with [Pino](https://getpino.io/) for easy monitoring. |
| **Low Memory Footprint** | **Error Handling** | **Docker Ready** |
| Optimized for minimal memory usage. | Graceful error handling prevents information leakage. | Containerized with Docker for easy deployment. |
| **High Throughput** | **Non-Root Docker User** | **Well-Tested** |
| Handles thousands of requests per second. | Runs as a non-root user in the Docker container. | 33+ tests with comprehensive coverage. |

## 🚀 Getting Started

There are three ways to get started with the CORS Proxy.

### 1. Docker (Recommended)

The easiest way to get started is by using the pre-built Docker image.

```bash
docker run -d \
  --name cors-proxy \
  -p 3000:3000 \
  -e REDIS_URL=redis://your-redis:6379 \
  -e NODE_ENV=production \
  ghcr.io/emad-k/cors-proxy:latest
```

### 2. Docker Compose

For a more integrated setup, you can use Docker Compose.

```bash
# 1. Clone the repository
git clone https://github.com/Emad-K/cors-proxy.git
cd cors-proxy

# 2. Start the services
docker-compose up -d
```

### 3. Local Development

To run the proxy locally for development, you'll need to have Node.js, pnpm, and Redis installed.

```bash
# 1. Clone the repository
git clone https://github.com/Emad-K/cors-proxy.git
cd cors-proxy

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env

# 4. Start Redis (if not already running)
docker run -d --name redis -p 6379:6379 redis:alpine

# 5. Start the server
pnpm start
```

## 📖 Usage

Once the proxy is running, you can use it to make requests to any URL.

### Command-Line Interface (CLI)

You can use `curl` to test the proxy from the command line.

```bash
# Proxy a JSON API
curl "http://localhost:3000/https://api.example.com/data"

# Proxy an image
curl "http://localhost:3000/https://example.com/image.jpg" > image.jpg
```

### Frontend JavaScript

To use the proxy in your frontend code, simply prepend the proxy URL to the target URL.

```javascript
// Before (CORS error)
// fetch('https://api.example.com/data');

// After (works!)
fetch('http://localhost:3000/https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

### Health Check

To verify that the proxy is running and connected to Redis, you can use the health check endpoint.

```bash
curl http://localhost:3000/health
# Expected response: {"redis":"connected"}
```

## ⚙️ Configuration

The proxy is configured using environment variables. You can set these variables in a `.env` file or directly in your deployment environment.

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | The environment the proxy is running in. | `production` | ✅ |
| `LOG_LEVEL` | The logging level. | `info` | ✅ |
| `PORT` | The port the proxy will listen on. | `3000` | ✅ |
| `REDIS_URL` | The URL for the Redis instance. | `redis://localhost:6379` | ✅ |
| `CACHE_DURATION` | The cache duration in seconds. | `300` | ✅ |
| `TIMEOUT` | The request timeout in milliseconds. | `5000` | ✅ |
| `RATE_LIMIT_WINDOW` | The rate limit window in seconds. | `60` | ✅ |
| `RATE_LIMIT_MAX` | The maximum number of requests per window. | `100` | ✅ |
| `USER_AGENT` | The user agent to use for requests. | `CORS-Proxy/1.0` | ✅ |

### Example `.env` File

```bash
NODE_ENV=production
LOG_LEVEL=info
PORT=3000
REDIS_URL=redis://localhost:6379
CACHE_DURATION=300
TIMEOUT=5000
RATE_LIMIT_WINDOW=60
RATE_LIMIT_MAX=100
USER_AGENT="CORS-Proxy/1.0"
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

The proxy is designed for easy deployment using Docker.

### Container Registry

The Docker images are automatically built and pushed to the GitHub Container Registry.

```bash
# Pull the latest image
docker pull ghcr.io/emad-k/cors-proxy:latest

# Pull a specific version
docker pull ghcr.io/emad-k/cors-proxy:1.0.0
```

### Production Deployment

For production deployments, you should consider the following:

- **Environment Variables**: Make sure to set all the required environment variables.
- **Redis**: For production, you should use a managed Redis service.
- **Health Checks**: The `/health` endpoint can be used to check the status of the proxy.
- **Scaling**: The proxy is stateless, so you can run multiple instances behind a load balancer.
- **Monitoring**: The proxy uses structured logging, so you can use a log management service to monitor the proxy.

## 📖 API Reference

### `GET /*`

This endpoint is used to proxy requests to the target URL.

- **URL**: `/*`
- **Method**: `GET`
- **Description**: Proxies a request to the specified URL.
- **Example**: `http://localhost:3000/https://api.example.com/data`

### `GET /health`

This endpoint is used to check the health of the proxy.

- **URL**: `/health`
- **Method**: `GET`
- **Description**: Checks the connection to Redis.
- **Example**: `http://localhost:3000/health`

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

Contributions are welcome! Please see the [Contributing Guide](CONTRIBUTING.md) for more information.

## 💖 Code of Conduct

This project has a [Code of Conduct](CODE_OF_CONDUCT.md) that all contributors are expected to follow.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🙏 Acknowledgments

- [Hono.js](https://hono.dev/) - Ultra-fast web framework
- [Redis](https://redis.io/) - In-memory data structure store
- [Pino](https://getpino.io/) - Super fast logger

## 📞 Support

- 🐛 **Bug Reports** - [GitHub Issues](https://github.com/Emad-K/cors-proxy/issues)
- 💡 **Feature Requests** - [GitHub Discussions](https://github.com/Emad-K/cors-proxy/discussions)
- 📖 **Documentation** - [Wiki](https://github.com/Emad-K/cors-proxy/wiki)

---

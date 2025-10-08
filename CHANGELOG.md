# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive test suite with 33+ tests
- GitHub Actions CI/CD pipeline
- Docker multi-stage builds for optimization
- Comprehensive documentation and best practices

### Changed
- Improved error handling and logging
- Enhanced Redis connection management
- Optimized Docker image size

### Security
- Added security policy and vulnerability reporting process
- Implemented proper input validation
- Enhanced rate limiting for security

## [1.0.0] - 2025-01-08

### Added
- Initial release of CORS Proxy
- High-performance proxy server built with Hono.js
- Redis-backed caching system
- IP-based rate limiting with Redis store
- Comprehensive logging with Pino
- CORS support for cross-origin requests
- Docker containerization
- Environment-based configuration
- Health check endpoint
- Graceful shutdown handling

### Features
- **Proxy Functionality**: Proxy any HTTP/HTTPS URL
- **Intelligent Caching**: Redis caching for improved performance
- **Rate Limiting**: Configurable rate limits with IP detection
- **Error Handling**: Comprehensive error handling and logging
- **Docker Support**: Ready-to-deploy Docker container
- **Health Monitoring**: Built-in health check endpoint

### Technical Details
- Built with Hono.js for maximum performance
- Uses ioredis for Redis connectivity
- Axios for upstream HTTP requests
- Pino for structured logging
- Comprehensive input validation
- Support for image proxying with proper headers

### Configuration
- Environment variable based configuration
- Configurable cache duration
- Adjustable rate limiting parameters
- Flexible timeout settings
- Custom user agent support

### Security
- Input validation for all URLs
- Rate limiting to prevent abuse
- Proper error handling to prevent information leakage
- Docker security best practices

---

## Release Notes Format

### Types of Changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Version Numbering
This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Links
- [Unreleased]: https://github.com/Emad-K/cors-proxy/compare/v1.0.0...HEAD
- [1.0.0]: https://github.com/Emad-K/cors-proxy/releases/tag/v1.0.0
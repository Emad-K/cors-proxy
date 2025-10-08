# Security Policy

## Supported Versions

We actively support the following versions of CORS Proxy with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in CORS Proxy, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing:
**[hello@emadkazemi.com](mailto:hello@emadkazemi.com)**

Include the following information in your report:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes (if available)

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours.

2. **Investigation**: We will investigate the issue and determine its severity and impact.

3. **Timeline**: We aim to provide an initial response within 5 business days, including:
   - Confirmation of the vulnerability (or explanation if it's not a vulnerability)
   - Estimated timeline for a fix
   - Any immediate mitigation steps

4. **Resolution**: We will work to resolve the issue as quickly as possible:
   - **Critical vulnerabilities**: Within 7 days
   - **High severity**: Within 14 days
   - **Medium/Low severity**: Within 30 days

5. **Disclosure**: After the vulnerability is fixed, we will:
   - Release a security update
   - Publish a security advisory
   - Credit you for the discovery (if desired)

## Security Best Practices

### For Users

1. **Keep Updated**: Always use the latest version of CORS Proxy
2. **Environment Variables**: Keep sensitive environment variables secure
3. **Network Security**: Run behind a reverse proxy (nginx, Cloudflare, etc.)
4. **Rate Limiting**: Configure appropriate rate limits for your use case
5. **Monitoring**: Monitor logs for suspicious activity

### For Deployment

1. **Container Security**:
   ```bash
   # Run as non-root user
   docker run --user 1000:1000 ghcr.io/emad-k/cors-proxy:latest
   
   # Limit resources
   docker run --memory=512m --cpus=1 ghcr.io/emad-k/cors-proxy:latest
   ```

2. **Network Security**:
   ```yaml
   # docker-compose.yml
   services:
     cors-proxy:
       networks:
         - internal
   networks:
     internal:
       driver: bridge
   ```

3. **Environment Security**:
   ```bash
   # Use secrets management
   docker run -e REDIS_URL_FILE=/run/secrets/redis_url ghcr.io/emad-k/cors-proxy:latest
   ```

### Configuration Security

1. **Redis Security**:
   - Use Redis AUTH
   - Enable TLS for Redis connections
   - Restrict Redis network access

2. **Rate Limiting**:
   ```env
   # Conservative rate limits
   RATE_LIMIT_MAX=50
   RATE_LIMIT_WINDOW=60
   ```

3. **Logging**:
   ```env
   # Avoid logging sensitive data
   LOG_LEVEL=info  # Not debug in production
   ```

## Known Security Considerations

### Rate Limiting Bypass
- **Issue**: Internal Docker traffic (172.x.x.x) bypasses rate limiting
- **Mitigation**: Ensure proper network segmentation in production
- **Status**: By design for container orchestration

### URL Validation
- **Protection**: All URLs are validated before processing
- **Limitation**: Only HTTP/HTTPS URLs are supported
- **Mitigation**: Input validation prevents malicious URLs

### Caching Security
- **Consideration**: Cached responses are stored in Redis
- **Mitigation**: Use Redis AUTH and network isolation
- **Recommendation**: Regular cache cleanup and monitoring

### Request Headers
- **Forwarding**: Client IP and headers are forwarded to upstream
- **Privacy**: Consider implications for user privacy
- **Control**: Configure USER_AGENT appropriately

## Security Updates

Security updates will be:
1. Released as patch versions (e.g., 1.0.1, 1.0.2)
2. Documented in release notes
3. Announced via GitHub Security Advisories
4. Tagged with security labels

## Vulnerability Disclosure Timeline

We follow responsible disclosure practices:

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Acknowledgment sent
3. **Day 3-5**: Initial assessment completed
4. **Day 7-30**: Fix developed and tested
5. **Day 30+**: Public disclosure (after fix is released)

## Security Resources

### External Security Tools

1. **Container Scanning**:
   ```bash
   # Scan Docker image for vulnerabilities
   docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
     aquasec/trivy image ghcr.io/emad-k/cors-proxy:latest
   ```

2. **Dependency Scanning**:
   ```bash
   # Check for vulnerable dependencies
   pnpm audit
   ```

3. **Static Analysis**:
   ```bash
   # ESLint security rules
   pnpm run lint
   ```

### Security Headers

When deploying behind a reverse proxy, consider adding security headers:

```nginx
# nginx configuration
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

## Contact

For security-related questions or concerns:
- **Email**: [hello@emadkazemi.com](mailto:hello@emadkazemi.com)
- **Subject**: [SECURITY] CORS Proxy - [Brief Description]

For general questions, please use GitHub Discussions or Issues.

---

Thank you for helping keep CORS Proxy secure! 🔒
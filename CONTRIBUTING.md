# Contributing to CORS Proxy

Thank you for your interest in contributing to CORS Proxy! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm (recommended package manager)
- Redis (for local development)
- Docker (optional, for containerized development)

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/cors-proxy.git
   cd cors-proxy
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start Redis**

   ```bash
   docker run -d --name redis -p 6379:6379 redis:alpine
   ```

5. **Run Tests**

   ```bash
   pnpm test
   ```

6. **Start Development Server**
   ```bash
   pnpm start
   ```

## 📋 Development Workflow

### Before Making Changes

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Run Tests**

   ```bash
   pnpm test
   ```

3. **Check Linting**
   ```bash
   pnpm run lint
   ```

### Making Changes

1. **Code Style**

   - Follow existing code patterns
   - Use ESLint configuration (runs automatically)
   - Write clear, descriptive commit messages

2. **Testing**

   - Add tests for new features
   - Update existing tests if needed
   - Ensure all tests pass: `pnpm test`

3. **Documentation**
   - Update README.md if needed
   - Add JSDoc comments for new functions
   - Update environment variable documentation

### Submitting Changes

1. **Pre-submission Checklist**

   ```bash
   # Run all checks
   pnpm run lint        # Fix any linting issues
   pnpm test           # Ensure all tests pass
   pnpm run lint:fix   # Auto-fix linting issues
   ```

2. **Commit Guidelines**

   ```bash
   # Use conventional commit format
   git commit -m "feat: add new caching strategy"
   git commit -m "fix: resolve rate limiting issue"
   git commit -m "docs: update API documentation"
   ```

3. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## 🧪 Testing Guidelines

### Test Structure

- **Unit Tests** - Test individual functions and modules
- **Integration Tests** - Test component interactions
- **End-to-End Tests** - Test complete workflows

### Writing Tests

```javascript
import { describe, it, expect, vi } from "vitest";

describe("Feature Name", () => {
  it("should do something specific", () => {
    // Arrange
    const input = "test input";

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe("expected output");
  });
});
```

### Test Commands

```bash
pnpm test              # Run all tests
pnpm run test:watch    # Watch mode
pnpm run test:unit     # Unit tests only
pnpm run test:integration # Integration tests
pnpm run test:e2e      # End-to-end tests
```

## 📝 Code Style Guidelines

### JavaScript/Node.js

- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use async/await over Promises when possible
- Follow existing naming conventions

### Error Handling

```javascript
// Use the catchAsync helper for consistent error handling
const [error, result] = await catchAsync(someAsyncOperation());
if (error) {
  logger.error(`Operation failed: ${error.message}`);
  return c.json({ error: "Internal server error" }, 500);
}
```

### Logging

```javascript
// Use structured logging
logger.info("Operation completed", {
  operation: "proxy-request",
  url: targetUrl,
  duration: Date.now() - startTime,
});
```

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Reproduce the bug
3. Test with latest version

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Send request to '...'
2. With headers '...'
3. See error

**Expected behavior**
What you expected to happen.

**Environment:**

- OS: [e.g. Ubuntu 20.04]
- Node.js version: [e.g. 20.10.0]
- Package version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Before Requesting

1. Check existing feature requests
2. Consider if it fits the project scope
3. Think about implementation complexity

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 🔄 Pull Request Process

### PR Requirements

- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm run lint`)
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow conventional format
- [ ] PR description explains the changes

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

## 📚 Resources

### Project Documentation

- [README.md](README.md) - Main project documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [TEST_SUMMARY.md](TEST_SUMMARY.md) - Testing overview

### External Resources

- [Hono.js Documentation](https://hono.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Redis Documentation](https://redis.io/docs/)

## 🤝 Community Guidelines

### Be Respectful

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully

### Be Collaborative

- Help others learn and grow
- Share knowledge and best practices
- Provide constructive feedback

### Be Professional

- Keep discussions focused and on-topic
- Avoid personal attacks or harassment
- Follow the project's code of conduct

## 📞 Getting Help

- **Questions** - Open a [GitHub Discussion](https://github.com/Emad-K/cors-proxy/discussions)
- **Issues** - Report bugs via [GitHub Issues](https://github.com/Emad-K/cors-proxy/issues)
- **Security** - Email security issues privately

## 🙏 Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes (for significant contributions)
- Project documentation (for major features)

Thank you for contributing to CORS Proxy! 🎉

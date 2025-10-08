---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Send request to '...'
2. With headers '...'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Request Details**
- Target URL: [e.g. https://api.example.com/data]
- Request method: [e.g. GET]
- Request headers: [if relevant]
- Request body: [if relevant]

**Error Response**
```json
{
  "error": "paste error response here"
}
```

**Environment:**
- OS: [e.g. Ubuntu 20.04]
- Node.js version: [e.g. 20.10.0]
- Package version: [e.g. 1.0.0]
- Deployment method: [e.g. Docker, npm start]
- Redis version: [e.g. 7.0]

**Configuration**
```env
# Relevant environment variables (remove sensitive data)
NODE_ENV=production
LOG_LEVEL=info
CACHE_DURATION=300
RATE_LIMIT_MAX=100
```

**Logs**
```
Paste relevant log entries here
```

**Additional context**
Add any other context about the problem here.
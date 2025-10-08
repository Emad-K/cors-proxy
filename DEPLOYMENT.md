# Deployment Guide

## GitHub Actions Workflows

### 🔄 CI Workflow (`ci.yml`)

**Triggers:** Pull requests and non-main branch pushes

- ✅ Lint code with ESLint
- ✅ Run all tests (33 tests)
- ✅ Type checking (if TypeScript)

### 🚀 Build & Deploy Workflow (`docker-build.yml`)

**Triggers:** Pushes to `main` branch

1. **Test Phase**

   - ✅ Lint code with ESLint
   - ✅ Run all tests (33 tests)
   - ❌ **Fails fast** - stops if tests fail

2. **Build & Deploy Phase** (only if tests pass)
   - 🐳 Build Docker image
   - 📦 Push to GitHub Container Registry
   - 🏷️ Tag with branch name, commit SHA, and `latest`

## Workflow Benefits

### ✅ **Quality Gates**

- No broken code gets deployed
- Linting ensures code style consistency
- All 33 tests must pass before building

### ⚡ **Fast Feedback**

- Tests run in ~1.3 seconds
- Fail fast principle saves CI minutes
- Parallel job execution when possible

### 🔒 **Security**

- Uses GitHub's built-in `GITHUB_TOKEN`
- No external secrets required
- Container registry authentication handled automatically

## Docker Image Tags

Images are tagged with:

- `latest` (for main branch)
- `main-<commit-sha>` (for traceability)
- `main` (branch name)

## Usage

### For Pull Requests

```bash
# CI runs automatically on PR creation/updates
# Checks: lint + tests
```

### For Main Branch

```bash
# Full pipeline runs on merge to main
# Steps: lint → test → build → deploy
```

## Local Testing Before Push

```bash
# Run the same checks locally
pnpm run lint
pnpm test

# Fix any issues before pushing
pnpm run lint:fix
```

## Monitoring

Check workflow status:

- GitHub Actions tab in repository
- Status badges in README (if added)
- Email notifications on failure

## Troubleshooting

### Tests Failing in CI

1. Run tests locally: `pnpm test`
2. Check for environment differences
3. Ensure all dependencies are in `package.json`

### Docker Build Failing

1. Tests must pass first
2. Check Dockerfile syntax
3. Verify build context includes necessary files

### Registry Push Failing

1. Check repository permissions
2. Verify `GITHUB_TOKEN` has package write access
3. Ensure registry URL is correct

# CI/CD Setup Documentation

This document describes the CI/CD pipeline setup for both the API and Web applications.

## Overview

The CI/CD pipeline follows a **Test → Lint → Build & Push** workflow to ensure code quality before deploying to GitHub Container Registry (GHCR).

## Pipeline Flow

```
┌─────────────┐
│  Git Push   │
│  to main/   │
│  develop    │
└──────┬──────┘
       │
       v
┌─────────────┐
│   1. TEST   │  ← Run all tests with coverage (must pass 80%)
└──────┬──────┘
       │
       v
┌─────────────┐
│   2. LINT   │  ← Run ESLint and TypeScript compiler
└──────┬──────┘
       │
       v
┌─────────────┐
│  3. BUILD   │  ← Build Docker image and push to GHCR
│  & PUSH     │    (only on main branch)
└─────────────┘
```

## Workflows

### API Workflow (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

1. **Test Job**
   - Runs on: `ubuntu-latest`
   - Steps:
     - Checkout code
     - Setup pnpm v10
     - Setup Node.js v20 with pnpm cache
     - Install dependencies
     - Run tests with coverage (`pnpm test:coverage`)
     - Upload coverage reports as artifacts (30-day retention)
   - Requirements: 80% code coverage threshold must pass

2. **Lint Job**
   - Runs after: Test job succeeds
   - Steps:
     - Checkout code
     - Setup pnpm and Node.js
     - Install dependencies
     - Run TypeScript compiler check (`pnpm build`)
   - Validates: TypeScript compilation and code quality

3. **Build and Push Job**
   - Runs after: Both Test and Lint jobs succeed
   - Runs only: On push to `main` branch (not on PRs)
   - Permissions: Read contents, write packages
   - Steps:
     - Checkout code
     - Setup Docker Buildx
     - Login to GitHub Container Registry
     - Extract metadata (tags, labels)
     - Build and push Docker image
     - Output image digest
   - Cache: Uses GitHub Actions cache for faster builds

**Image Tags:**
- `latest` - Latest commit on main branch
- `main-<sha>` - Specific commit SHA
- `main` - Branch reference

### Web Workflow (`.github/workflows/ci-cd.yml`)

Similar structure to API workflow with web-specific configurations:

**Test Job:**
- Working directory: `./web`
- Coverage artifact: `coverage-report-web`

**Lint Job:**
- Runs ESLint: `pnpm lint`
- Runs TypeScript check: `pnpm build`

**Build Job:**
- Context: `./web`
- Image name: `<repository>-web`
- Uses Nginx to serve built static files

## Docker Images

### API Image

**Base Image:** `node:20-alpine`

**Build Strategy:** Multi-stage build
1. **Builder stage:**
   - Install all dependencies
   - Build TypeScript to JavaScript
   - Output to `dist/` directory

2. **Production stage:**
   - Install only production dependencies
   - Copy built files from builder
   - Expose port 3000
   - Health check on `/health` endpoint

**Environment Variables:**
- `NODE_ENV=production`

**Health Check:**
```bash
http://localhost:3000/health
```
- Interval: 30s
- Timeout: 3s
- Start period: 5s
- Retries: 3

### Web Image

**Base Image:** `nginx:alpine`

**Build Strategy:** Multi-stage build
1. **Builder stage:**
   - Install all dependencies
   - Build React application with Vite
   - Output to `dist/` directory

2. **Production stage:**
   - Use Nginx to serve static files
   - Copy custom nginx configuration
   - Copy built files from builder
   - Expose port 80
   - Health check on `/health` endpoint

**Nginx Features:**
- Gzip compression enabled
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Client-side routing support (SPA fallback to index.html)
- Static asset caching (1 year for immutable assets)
- Health check endpoint

**Health Check:**
```bash
http://localhost/health
```

## GitHub Container Registry

**Registry:** `ghcr.io`

**Image Names:**
- API: `ghcr.io/<username>/keuzekompas:latest`
- Web: `ghcr.io/<username>/keuzekompas-web:latest`

**Authentication:**
- Uses `GITHUB_TOKEN` (automatically provided by GitHub Actions)
- Permissions: Requires `packages: write` permission

## Local Development

### Running Tests Locally

**API:**
```bash
cd api
pnpm install
pnpm test              # Watch mode
pnpm test:coverage     # With coverage report
```

**Web:**
```bash
cd web
pnpm install
pnpm test              # Watch mode
pnpm test:coverage     # With coverage report
```

### Building Docker Images Locally

**API:**
```bash
cd api
docker build -t keuzekompas-api:local .
docker run -p 3000:3000 keuzekompas-api:local
```

**Web:**
```bash
cd web
docker build -t keuzekompas-web:local .
docker run -p 8080:80 keuzekompas-web:local
```

### Testing Locally

**API:**
```bash
# Health check
curl http://localhost:3000/health

# API endpoints
curl http://localhost:3000/api/modules
```

**Web:**
```bash
# Health check
curl http://localhost:8080/health

# Web app
open http://localhost:8080
```

## CI/CD Requirements

### Repository Setup

1. **Enable GitHub Actions:**
   - Go to repository Settings → Actions
   - Allow actions and reusable workflows

2. **Enable GitHub Packages:**
   - Workflows automatically have access via `GITHUB_TOKEN`
   - No additional secrets required

3. **Branch Protection (Recommended):**
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
   - Required checks:
     - `test`
     - `lint`

### Environment Variables

**API (if needed):**
Set in GitHub repository secrets:
- `MONGODB_URI` - MongoDB connection string (for production)
- `JWT_SECRET` - JWT signing secret
- Any other production secrets

**Web (if needed):**
- `VITE_API_URL` - API endpoint URL

## Deployment

### Pulling Images

```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u <username> --password-stdin

# Pull API image
docker pull ghcr.io/<username>/keuzekompas:latest

# Pull Web image
docker pull ghcr.io/<username>/keuzekompas-web:latest
```

### Running in Production

**Using Docker Compose:**

```yaml
version: '3.8'

services:
  api:
    image: ghcr.io/<username>/keuzekompas:latest
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped

  web:
    image: ghcr.io/<username>/keuzekompas-web:latest
    ports:
      - "80:80"
    restart: unless-stopped
```

## Monitoring

### Coverage Reports

After each test run, coverage reports are uploaded as artifacts:
- Accessible from GitHub Actions run summary
- HTML reports available for download
- Retained for 30 days

### Build Cache

- Docker builds use GitHub Actions cache
- Significantly speeds up subsequent builds
- Cache is shared across workflow runs

### Health Checks

Both applications include health check endpoints:
- **API:** `GET /health` returns 200 OK
- **Web:** `GET /health` returns 200 with "healthy" message

Monitor these endpoints for application health.

## Troubleshooting

### Test Failures

If tests fail:
1. Check the test output in GitHub Actions logs
2. Run tests locally: `pnpm test:coverage`
3. Ensure all tests pass before pushing

### Build Failures

If Docker build fails:
1. Check for TypeScript compilation errors
2. Verify all dependencies are in package.json
3. Test build locally: `docker build .`

### Push Failures

If push to GHCR fails:
1. Verify `packages: write` permission is set
2. Check if GITHUB_TOKEN has expired
3. Ensure image name follows GHCR naming conventions

## Best Practices

1. **Always run tests before pushing:**
   ```bash
   pnpm test:coverage
   ```

2. **Keep dependencies up to date:**
   ```bash
   pnpm update
   ```

3. **Review coverage reports:**
   - Aim for >80% coverage
   - Focus on critical business logic

4. **Use feature branches:**
   - Create PR to main
   - CI runs on PR to catch issues early

5. **Monitor build times:**
   - Use caching effectively
   - Optimize Docker layer caching

## Security

- **Secrets:** Never commit secrets to repository
- **Dependencies:** Regularly update to patch vulnerabilities
- **Images:** Scan for vulnerabilities using tools like Trivy
- **Nginx:** Security headers are configured by default
- **Docker:** Images run as non-root where possible

## Future Enhancements

Potential improvements to the CI/CD pipeline:

- [ ] Add security scanning (Trivy, Snyk)
- [ ] Add performance testing
- [ ] Add deployment to staging environment
- [ ] Add automatic rollback on health check failure
- [ ] Add Slack/Discord notifications
- [ ] Add database migration automation
- [ ] Add E2E tests with Playwright/Cypress

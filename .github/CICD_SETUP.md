# Environment Variables for CI/CD

## Required GitHub Secrets

### Firebase Configuration (Public - safe to expose)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### Sentry Configuration (Optional)
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking
- `SENTRY_ORG` - Sentry organization name
- `SENTRY_PROJECT` - Sentry project name
- `SENTRY_AUTH_TOKEN` - Sentry authentication token for source maps upload

### VPS Deployment (Required for auto-deploy)
- `VPS_HOST` - VPS IP address (e.g., 87.106.143.64)
- `VPS_USERNAME` - SSH username (e.g., root)
- `VPS_SSH_KEY` - Private SSH key for authentication

### Optional
- `CODECOV_TOKEN` - Code coverage reporting token

## Setting Up GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with its corresponding value

## How to Get Values

### Firebase
Copy from `.env.local` file or Firebase Console → Project Settings → Your apps

### Sentry
1. Create account at https://sentry.io
2. Create new project
3. Get DSN from Project Settings
4. Generate auth token in User Settings → Auth Tokens

### VPS SSH Key
```bash
# Generate SSH key pair (if not exists)
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copy private key content (entire file)
cat ~/.ssh/id_rsa

# Add public key to VPS authorized_keys
ssh-copy-id root@87.106.143.64
```

## Testing Locally

To test the workflow locally (without pushing):
```bash
# Install act (GitHub Actions local runner)
# brew install act  # macOS
# choco install act-cli  # Windows

# Run all jobs
act push

# Run specific job
act -j test
```

## Workflow Triggers

### CI/CD Pipeline (`ci-cd.yml`)
- **Push to main/develop**: Runs full pipeline (test → build → e2e → deploy)
- **Pull requests**: Runs tests and build only (no deploy)

### Security Audit (`security-audit.yml`)
- **Schedule**: Every Monday at 9 AM
- **Manual**: Can be triggered manually from Actions tab

## Pipeline Stages

1. **Test**: ESLint + Unit tests + Coverage
2. **Build**: Next.js production build
3. **E2E**: Playwright browser tests
4. **Deploy**: SSH to VPS, pull, build, PM2 restart (main branch only)

## Artifacts

- **Build output**: Retained for 7 days
- **Playwright reports**: Retained for 30 days
- **Coverage reports**: Uploaded to Codecov (optional)

## Deployment Flow

```
main branch push → CI passes → Auto-deploy to VPS
                ↓
      Tests → Build → E2E → Deploy
                            ↓
                     VPS: git pull
                           npm ci
                           npm run build
                           pm2 restart all
```

## Status Badges

Add to README.md:
```markdown
![CI/CD](https://github.com/xerud2002/CP/actions/workflows/ci-cd.yml/badge.svg)
![Security](https://github.com/xerud2002/CP/actions/workflows/security-audit.yml/badge.svg)
```

## Troubleshooting

### Build fails on CI but works locally
- Check that all environment variables are set in GitHub Secrets
- Verify Node.js version matches (20.x)
- Check for OS-specific path issues (use `/` not `\`)

### E2E tests timeout
- Increase timeout in `playwright.config.ts`
- Check that `webServer` starts correctly
- Verify BASE_URL is correct

### Deployment fails
- Verify SSH key is correct (entire private key, including headers)
- Check VPS has Git, Node.js, npm, PM2 installed
- Ensure VPS user has permissions to `/root/curierul-perfect`
- Test SSH connection manually: `ssh -i key.pem root@87.106.143.64`

### Security audit creates too many issues
- Adjust `audit-level` in `security-audit.yml` (low/moderate/high/critical)
- Add `continue-on-error: true` to prevent blocking workflow

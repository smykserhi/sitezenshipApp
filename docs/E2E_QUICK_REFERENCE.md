# E2E Testing Quick Reference

## One-Minute Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Run tests
npm run test:e2e
```

## Run Options

| Command | Purpose |
|---------|---------|
| `npm run test:e2e` | Run tests (headless, CI mode) |
| `npm run test:e2e:ui` | Run with interactive UI (recommended) |
| `npm run test:e2e:headed` | See browser while running |
| `npm run test:e2e:debug` | Debug mode with Playwright Inspector |

## What Tests Do

✅ **Test 1:** Login page → Click "Create one" → Register page succeeds
✅ **Test 2:** Application loads, forms are visible and responsive

## CI/CD Behavior

1. **On push to `main`:**
   - Workflow triggers automatically
   - Waits 3 minutes (deployment time)
   - Runs tests
   - Retries every 2 minutes (up to 6 times)
   - Uploads reports
   - Comments on PRs with results

2. **Timing:**
   - First test: ~3 minutes after push
   - Max duration: ~15 minutes total
   - Results available in GitHub Actions artifacts

## View Results

```bash
# Local
npx playwright show-report

# GitHub
# Go to Actions → E2E Tests workflow → Latest run → Artifacts
```

## Files Overview

| File | Purpose |
|------|---------|
| `e2e/production.spec.ts` | Test cases |
| `playwright.config.ts` | Playwright settings |
| `.github/workflows/e2e-tests.yml` | GitHub Actions workflow |
| `E2E_TESTING_SETUP.md` | Full documentation |

## Troubleshooting

**Tests fail in CI but pass locally?**
→ Check GitHub Actions artifacts (videos/screenshots)

**Deployment not ready after 3 min?**
→ Increase wait time in workflow

**Need to debug a failure?**
→ Download video from GitHub Actions artifacts

## Get Help

Full documentation: `E2E_TESTING_SETUP.md`

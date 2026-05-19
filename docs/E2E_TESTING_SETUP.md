# E2E Testing Setup - Production Monitoring Guide

This guide covers end-to-end testing for the production deployment of the Citizenship Test Application at `https://sitezenshipapp.onrender.com/`.

## Overview

The E2E testing suite monitors the production application by:
1. Testing critical user flows (login → register navigation)
2. Verifying application accessibility and responsiveness
3. Running automatically on every push to `main` branch
4. Including intelligent retry logic to handle deployment timing issues

## 📋 Test Files

- **Playwright Test:** `e2e/production.spec.ts`
- **Playwright Config:** `playwright.config.ts`
- **GitHub Actions Workflow:** `.github/workflows/e2e-tests.yml`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (the project uses Node 18 in CI/CD)
- npm or yarn

### Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

   This installs Playwright and all dependencies.

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

### Running Tests Locally

**Run all tests:**
```bash
npm run test:e2e
```

**Run tests in UI mode (recommended for debugging):**
```bash
npm run test:e2e:ui
```
This opens an interactive Playwright inspector where you can see each step and interact with the application.

**Run tests in headed mode (see the browser):**
```bash
npm run test:e2e:headed
```

**Debug tests with inspector:**
```bash
npm run test:e2e:debug
```

**View test report:**
```bash
npx playwright show-report
```

## 📊 Test Structure

### Test 1: Navigation Flow
- **What it tests:** User can navigate from login page to register page
- **Steps:**
  1. Opens the production homepage
  2. Verifies login page loads
  3. Clicks "Create one" link
  4. Verifies redirect to register page
- **Timeout:** 30 seconds per test
- **Assertion timeout:** 10 seconds

### Test 2: Application Accessibility
- **What it tests:** Application is accessible and forms are responsive
- **Checks:**
  1. Login form is visible
  2. Email input field exists
  3. Password input field exists
  4. Sign In button is present

## ⚙️ Configuration Details

### Playwright Configuration (`playwright.config.ts`)

**Production-Safe Settings:**
- **Test Timeout:** 30 seconds (per test)
- **Global Timeout:** 5 minutes (entire run)
- **Assertion Timeout:** 10 seconds
- **No Retries:** Retries handled by GitHub Actions workflow
- **Screenshot on Failure:** Captured automatically
- **Video on Failure:** Recorded for debugging

**Browser:**
- Chromium (production-grade)

**Reporting:**
- HTML report (interactive)
- JSON report (for automation)
- JUnit XML (for CI/CD integration)

### GitHub Actions Workflow (`.github/workflows/e2e-tests.yml`)

**Trigger Events:**
- Automatically on `push` to `main` branch
- Manual trigger via `workflow_dispatch`

**Execution Flow:**

1. **Checkout code** (1 second)
2. **Setup Node.js 18** (10 seconds)
3. **Install dependencies** (~30 seconds)
4. **Install Playwright browsers** (~60 seconds)
5. **Wait 3 minutes** ⏳ (180 seconds) - *allows production deployment to complete*
6. **Run E2E tests with retry loop** (up to 10 minutes):
   - Attempt 1: immediate (0 minutes elapsed)
   - Attempt 2: after 2 minutes
   - Attempt 3: after 4 minutes
   - Attempt 4: after 6 minutes
   - Attempt 5: after 8 minutes
   - Attempt 6: after 10 minutes (final)

**Key Features:**
- ✅ Fails fast if tests pass
- ✅ Retries every 2 minutes up to 6 times
- ✅ Gives 3 minutes for deployment before first test
- ✅ Uploads test reports and artifacts
- ✅ Adds comment to PRs with results (if PR)
- ✅ Total timeout: 15 minutes

## 📈 Workflow Output

When tests run, the GitHub Actions workflow:

1. **Uploads Artifacts:**
   - `playwright-report/` - Interactive HTML report (7-day retention)
   - `test-results/` - JSON and JUnit XML results (7-day retention)

2. **On PR:** Automatically comments with summary:
   ```
   ## E2E Test Results
   ✅ Tests completed
   - **Passed:** 2
   - **Failed:** 0
   - **Duration:** 12.34s
   ```

3. **On Failure:**
   - Workflow fails (prevents merge of broken code)
   - Screenshots and videos available in artifacts
   - Detailed logs in GitHub Actions UI

## 🔍 Viewing Results

### Via GitHub UI
1. Go to **Actions** tab in your repository
2. Click on the **E2E Tests - Production Monitoring** workflow
3. Click on the latest run
4. Download artifacts or view logs

### Local HTML Report
```bash
npm run test:e2e
npx playwright show-report
```

Opens interactive report in browser showing:
- Test results
- Screenshots
- Videos (if failures occurred)
- Detailed execution timelines

## 🛠️ Customization

### Change Test Timeout
Edit `playwright.config.ts`:
```typescript
timeout: 45 * 1000, // 45 seconds instead of 30
```

### Modify Retry Delay
Edit `.github/workflows/e2e-tests.yml`:
```bash
sleep 180  # Change from 180 seconds (3 min) to desired value
sleep 120  # Change from 120 seconds (2 min) between retries
```

### Add More Tests
Create new test files in `e2e/` directory:
```bash
# e2e/auth.spec.ts
# e2e/dashboard.spec.ts
# etc.
```

### Change Retry Attempts
Edit `.github/workflows/e2e-tests.yml`:
```bash
MAX_ATTEMPTS=6  # Change to desired number of retry attempts
```

### Change Artifact Retention
Edit `.github/workflows/e2e-tests.yml`:
```yaml
retention-days: 7  # Change to desired days
```

## 📋 Troubleshooting

### Tests Pass Locally but Fail in CI/CD
- **Likely cause:** Network or environment differences
- **Solution:** Check GitHub Actions logs for specific error messages
- **Debug:** Playwright uploads videos/screenshots on failure

### Deployment Not Ready After 3 Minutes
- **Likely cause:** Render deployment takes longer than expected
- **Solution:** Increase the initial wait time in workflow:
  ```bash
  sleep 180  # Increase to 300 for 5 minutes
  ```

### Tests Timing Out
- **Likely cause:** Application loading slowly or network issues
- **Solution:** Check browser console in uploaded screenshots/videos
- **Review:** Increase timeouts in `playwright.config.ts`

### Playwright Browsers Not Installing
- **Likely cause:** CI/CD agent missing system dependencies
- **Solution:** Already handled in workflow with `--with-deps` flag

## 📝 Best Practices

1. **Keep Tests Fast:** Aim for <5 seconds per test
2. **Test Critical Paths:** Focus on user journeys that matter
3. **Avoid Hard Waits:** Use Playwright's `waitFor` helpers
4. **Monitor Reports:** Review artifacts after each run
5. **Update Selectors:** If UI changes, update test locators
6. **Environment Specific:** Production tests target deployed URL

## 🔐 Security Notes

- ✅ Tests only verify UI interactions, no credentials stored
- ✅ No sensitive data in test code
- ✅ Artifacts auto-delete after 7 days
- ✅ Tests run against production URL (no separate staging needed)

## 📞 Common Commands Reference

```bash
# Install & Setup
npm install                    # Install all dependencies
npx playwright install        # Install Playwright browsers

# Run Tests
npm run test:e2e              # Run tests headless
npm run test:e2e:ui           # Run with interactive UI
npm run test:e2e:headed       # See browser while running
npm run test:e2e:debug        # Debug mode with inspector

# View Results
npx playwright show-report    # View latest HTML report

# CI/CD
npm run test:e2e              # Same command used in GitHub Actions
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/writing-workflows)
- [Render Deployment Guide](https://render.com/docs)

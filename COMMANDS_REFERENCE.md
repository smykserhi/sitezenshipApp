# Commands Reference - E2E Testing

Copy-paste ready commands for all E2E testing tasks.

## 🚀 Initial Setup

```bash
# Install all dependencies
npm install

# Install Playwright browsers (required for tests)
npx playwright install

# Verify installation
npm run test:e2e --help
```

## 🧪 Running Tests

### Standard Test Run
```bash
npm run test:e2e
```
Runs tests in headless mode, same as GitHub Actions.

### Interactive UI Mode (Recommended for Debugging)
```bash
npm run test:e2e:ui
```
Opens interactive Playwright Inspector. Best for:
- Debugging test failures
- Understanding test execution
- Developing new tests
- Seeing step-by-step execution

### Headed Mode (See the Browser)
```bash
npm run test:e2e:headed
```
Runs tests with visible browser window. Good for:
- Watching test execution
- Verifying UI interactions
- Visual debugging

### Debug Mode with Inspector
```bash
npm run test:e2e:debug
```
Runs with Playwright Inspector paused at start. For:
- Step-by-step execution
- Setting breakpoints
- Advanced debugging

## 📊 Viewing Results

### View Latest HTML Report
```bash
npx playwright show-report
```
Opens interactive HTML report with:
- Test results
- Screenshots
- Videos (if failures)
- Execution timeline

### View Test Results Locally
```bash
cat test-results/results.json
```

### View Test Results as JUnit XML
```bash
cat test-results/junit.xml
```

## 🔍 Specific Test Execution

### Run Only a Specific Test
```bash
npx playwright test --grep "Navigation"
```

### Run Specific Test File
```bash
npx playwright test e2e/production.spec.ts
```

### Run Tests with Specific Project (Browser)
```bash
npx playwright test --project=chromium
```

## 🛠️ Advanced Testing

### Run Tests in Trace Mode
```bash
npx playwright test --trace on
npx playwright show-trace test-results/trace.zip
```

### Generate Coverage Report
```bash
npx playwright test --coverage
```

### Slow Down Tests (Debugging)
```bash
npx playwright test --headed --slow-mo=1000
```
(1000ms delay between actions)

### Verbose Output
```bash
npx playwright test --reporter=list
```

### Run Tests Multiple Times
```bash
npx playwright test --repeat=3
```

## 📁 File Management

### Clean Up Test Artifacts
```bash
rm -rf test-results
rm -rf playwright-report
rm -rf .playwright
```

### Re-install Playwright
```bash
rm -rf ~/.cache/ms-playwright
npx playwright install
```

## 🔄 GitHub Actions

### Manually Trigger Workflow (from GitHub UI)
1. Go to Actions tab
2. Select "E2E Tests - Production Monitoring"
3. Click "Run workflow"
4. Choose branch: main
5. Click "Run workflow"

### Check Workflow Status
```bash
gh workflow list
gh run list --workflow=e2e-tests.yml
```
(Requires GitHub CLI: `brew install gh`)

### Download Latest Artifacts
```bash
gh run list --workflow=e2e-tests.yml --limit=1 --json headBranch
gh run download --dir=./artifacts
```

## 📝 Adding New Tests

### Create New Test File
```bash
touch e2e/dashboard.spec.ts
```

### Example Test Template
```typescript
import { test, expect } from '@playwright/test';

test('should verify dashboard functionality', async ({ page }) => {
  await page.goto('https://sitezenshipapp.onrender.com/');
  
  // Your test steps here
  await expect(page).toHaveTitle(/dashboard/i);
});
```

## 🔧 Configuration Changes

### Increase Test Timeout (from 30s to 60s)
Edit `playwright.config.ts`:
```typescript
timeout: 60 * 1000,  // 60 seconds
```

### Change Initial Deployment Wait (from 3min to 5min)
Edit `.github/workflows/e2e-tests.yml`:
```bash
sleep 300  # 5 minutes instead of 180 (3 min)
```

### Change Retry Interval (from 2min to 1min)
Edit `.github/workflows/e2e-tests.yml`:
```bash
sleep 60  # 1 minute instead of 120 (2 min)
```

### Change Max Retry Attempts (from 6 to 10)
Edit `.github/workflows/e2e-tests.yml`:
```bash
MAX_ATTEMPTS=10  # Instead of 6
```

## 📦 Dependency Management

### Update Playwright to Latest
```bash
npm install @playwright/test@latest
```

### Check Playwright Version
```bash
npm list @playwright/test
```

### Install Specific Playwright Version
```bash
npm install @playwright/test@1.45.0
```

## 🐛 Troubleshooting Commands

### Check Node.js Version
```bash
node --version
# Required: v18 or higher
```

### Check npm Version
```bash
npm --version
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Verify Playwright Installation
```bash
npx playwright --version
```

### Test if Application is Accessible
```bash
curl -I https://sitezenshipapp.onrender.com/
# Should return 200 OK
```

### Get Detailed Test Output
```bash
npm run test:e2e -- --reporter=verbose
```

## 📊 Report Generation

### Generate HTML Report Only
```bash
npx playwright test --reporter=html
```

### Generate JSON Report Only
```bash
npx playwright test --reporter=json
```

### Generate Multiple Reports
```bash
npx playwright test --reporter=html --reporter=json --reporter=junit
```

### Open Report in VS Code
```bash
code playwright-report/index.html
```

## 🚀 Pre-Deployment Commands

### Run All Tests Locally
```bash
npm run test:e2e
```

### Stage All Changes
```bash
git add -A
```

### Verify What Will Be Committed
```bash
git status
```

### Commit with Message
```bash
git commit -m "Add Playwright E2E tests for production monitoring"
```

### Push to Main
```bash
git push origin main
```

### View Recent Commits
```bash
git log --oneline -5
```

## 🔐 Security

### List Sensitive Files (shouldn't exist)
```bash
grep -r "password\|token\|secret" e2e/ --include="*.ts"
```

### Verify No Credentials in Code
```bash
cat e2e/production.spec.ts | grep -i "email\|password"
# Should only show test assertions, not real credentials
```

## 📱 Alternative Test Runners

### Run with Specific Browser (Firefox)
```bash
npx playwright test --project=firefox
```

### Run with Specific Browser (WebKit)
```bash
npx playwright test --project=webkit
```

### Run All Tests, All Browsers
```bash
npx playwright test --project=chromium --project=firefox --project=webkit
```

## 📈 Performance

### Measure Test Performance
```bash
npx playwright test --reporter=list
# Shows each test duration
```

### Profile Test Execution
```bash
npm run test:e2e -- --reporter=html --reporter=json
```

## 🎯 Continuous Integration

### Local CI Simulation
```bash
npm ci
npm run test:e2e
```

### Pre-commit Hook (optional)
```bash
npm run test:e2e && git push
```

## 🆘 Emergency Commands

### Kill Stuck Playwright Processes
```bash
pkill -f playwright
```

### Reset Test Environment
```bash
npm run test:e2e -- --trace off
rm -rf test-results playwright-report
npm run test:e2e
```

### Full Reset
```bash
rm -rf node_modules
npm cache clean --force
npm install
npx playwright install
npm run test:e2e
```

## 📚 Documentation Commands

### View Complete Setup Guide
```bash
cat E2E_TESTING_SETUP.md | less
```

### View Quick Reference
```bash
cat E2E_QUICK_REFERENCE.md
```

### View All Documentation Files
```bash
ls -la E2E_*.md DEPLOYMENT_*.md WORKFLOW_*.md
```

## 🔗 Useful Links

```bash
# Open Playwright documentation
open https://playwright.dev

# Open GitHub Actions documentation
open https://docs.github.com/en/actions

# Open Render documentation
open https://render.com/docs

# View project on GitHub
open https://github.com/smykserhi/sitezenshipApp
```

## 📋 Command Cheat Sheet

| Task | Command |
|------|---------|
| Install | `npm install && npx playwright install` |
| Test (headless) | `npm run test:e2e` |
| Test (UI) | `npm run test:e2e:ui` |
| Test (visible) | `npm run test:e2e:headed` |
| Test (debug) | `npm run test:e2e:debug` |
| View report | `npx playwright show-report` |
| Clean up | `rm -rf test-results playwright-report` |
| Push | `git add -A && git commit -m "..." && git push` |
| Status | `git status` |
| Logs | `git log --oneline -5` |

## ⏱️ Typical Workflow

```bash
# 1. Make changes to tests or code
# (edit e2e/production.spec.ts or other files)

# 2. Run tests locally
npm run test:e2e:ui  # Or npm run test:e2e

# 3. If tests pass, commit
git add -A
git commit -m "Update E2E tests"

# 4. Push to main (triggers GitHub Actions)
git push origin main

# 5. Monitor GitHub Actions (5-15 minutes)
# (View at: https://github.com/smykserhi/sitezenshipApp/actions)

# 6. Check results
# • GitHub Actions UI
# • PR comment (if PR)
# • Download artifacts (if needed)
```

---

**Last Updated:** May 18, 2026  
**For:** Playwright E2E Testing  
**Target:** https://sitezenshipapp.onrender.com/

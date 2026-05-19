# E2E Testing for Production Monitoring

## 🎯 Overview

This project includes **Playwright end-to-end tests** that automatically monitor your production Citizenship Test Application deployed at **https://sitezenshipapp.onrender.com/**.

Tests are executed automatically on every push to the `main` branch via GitHub Actions, with intelligent retry logic to handle deployment timing issues.

## 🚀 Get Started in 2 Minutes

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Run tests
npm run test:e2e
```

Expected output: `✓ 2 passed (12.34s)`

## 📋 What Gets Tested

✅ **Test 1:** User can navigate from login page to register page by clicking "Create one"  
✅ **Test 2:** Application forms are visible and accessible

## 🎮 Test Scripts

```bash
npm run test:e2e              # Run tests (headless, like GitHub Actions)
npm run test:e2e:ui          # Interactive UI (recommended for debugging)
npm run test:e2e:headed      # See browser while running
npm run test:e2e:debug       # Debug mode with Playwright Inspector
```

## 🔄 Automatic CI/CD

Every push to `main`:

1. **Wait 3 minutes** ⏳ - Allow Render deployment to complete
2. **Run tests** 🧪 - Execute test suite
3. **If failed** - Retry every 2 minutes (up to 6 attempts)
4. **Upload reports** 📤 - Store results for 7 days
5. **Comment on PR** 💬 - Post results summary

**Timeline:** 5-15 minutes depending on test results

## 📊 View Results

**After first push:**
- Check **GitHub Actions** tab
- View **Artifacts** (playwright-report, test-results)
- See **PR Comments** with test summary

**Locally:**
```bash
npm run test:e2e
npx playwright show-report
```

## 📁 New Files

| File | Purpose |
|------|---------|
| `e2e/production.spec.ts` | Test cases |
| `playwright.config.ts` | Test configuration |
| `.github/workflows/e2e-tests.yml` | GitHub Actions workflow |
| `E2E_TESTING_SETUP.md` | Detailed setup guide |
| `E2E_QUICK_REFERENCE.md` | Quick reference card |
| `DEPLOYMENT_CHECKLIST.md` | Pre-deployment verification |
| `WORKFLOW_EXECUTION_FLOW.md` | Workflow timeline & execution |
| `E2E_ARCHITECTURE_DIAGRAMS.md` | System architecture & diagrams |

## ⚙️ Configuration

All settings are production-safe by default:

- **Test timeout:** 30 seconds
- **Assertion timeout:** 10 seconds
- **Retry attempts:** 6 (automatic, 2-min intervals)
- **Initial wait:** 3 minutes (deployment buffer)
- **Browser:** Chromium
- **Reports:** HTML, JSON, JUnit XML

## 🛠️ Customize

**Change deployment wait time** (3 minutes):
```yaml
# .github/workflows/e2e-tests.yml, line ~59
sleep 180  # Change to 300 for 5 minutes
```

**Change retry interval** (2 minutes):
```yaml
# .github/workflows/e2e-tests.yml, line ~77
sleep 120  # Change to 60 for 1 minute
```

**Add more tests:**
Create new test file in `e2e/` directory using Playwright syntax.

## 📞 Troubleshooting

**Tests fail in CI but pass locally?**  
→ Check GitHub Actions artifacts for screenshots/videos

**Workflow takes too long?**  
→ First test usually passes quickly; retries add 2 minutes each

**Need to debug a failure?**  
→ Download artifacts from GitHub Actions or run locally with `npm run test:e2e:ui`

## 📚 Full Documentation

- **Comprehensive Guide:** `E2E_TESTING_SETUP.md` (3000+ words)
- **Quick Ref:** `E2E_QUICK_REFERENCE.md` (one page)
- **Implementation:** `E2E_IMPLEMENTATION_SUMMARY.md` (overview)
- **Workflow Timeline:** `WORKFLOW_EXECUTION_FLOW.md` (execution details)
- **Architecture:** `E2E_ARCHITECTURE_DIAGRAMS.md` (system design)
- **Deployment:** `DEPLOYMENT_CHECKLIST.md` (verification steps)

## ✨ Next Steps

1. **Commit and push** these files
2. **Monitor GitHub Actions** for first workflow run
3. **Review test report** in artifacts
4. **Add more tests** as needed for critical flows

## 🔗 Links

- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Render Documentation](https://render.com/docs)

---

**Status:** ✅ Ready for Production Monitoring  
**Target App:** https://sitezenshipapp.onrender.com/  
**Setup Time:** ~2 minutes  
**Maintenance:** Minimal - tests run automatically

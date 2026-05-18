# E2E Testing Architecture & Diagrams

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         Your Local Development                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Code Editor (VS Code)                                                  │
│  ├─ e2e/production.spec.ts    (Playwright tests)                       │
│  ├─ playwright.config.ts       (Test configuration)                    │
│  └─ package.json               (Updated with @playwright/test)         │
│                                                                          │
│  Local Testing:                                                          │
│  $ npm install                                                           │
│  $ npx playwright install                                               │
│  $ npm run test:e2e                                                     │
│       ↓                                                                   │
│  Returns: ✅ 2 passed or ❌ 2 failed                                    │
│                                                                          │
└─────────────────────────────┬──────────────────────────────────────────┘
                              │
                              │ git push origin main
                              ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Main Branch (sitezenshipApp)                                           │
│  ├─ .github/workflows/e2e-tests.yml                                     │
│  ├─ e2e/production.spec.ts                                              │
│  ├─ playwright.config.ts                                                │
│  └─ package.json                                                        │
│                                                                          │
│  Push Event Triggers Workflow ↓                                         │
│                                                                          │
└──────────────────────┬───────────────────────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                    GitHub Actions CI/CD Pipeline                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Job: wait-and-test (runs-on: ubuntu-latest)                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ Step 1: Checkout & Setup        (~1 min)                          │ │
│  │ ├─ Checkout code from repository                                  │ │
│  │ ├─ Setup Node.js 18                                               │ │
│  │ └─ Cache npm dependencies                                         │ │
│  │                                                                   │ │
│  │ Step 2: Install & Prepare       (~2 min)                          │ │
│  │ ├─ npm ci (clean install)                                         │ │
│  │ └─ npx playwright install --with-deps                             │ │
│  │                                                                   │ │
│  │ Step 3: Deployment Buffer      (3 min) ⏳                        │ │
│  │ └─ sleep 180  # Wait for Render to deploy                        │ │
│  │                                                                   │ │
│  │ Step 4: Run Tests with Retries (up to 10 min)                    │ │
│  │ ├─ npm run test:e2e                                               │ │
│  │ │                                                                 │ │
│  │ │  if PASS → Upload artifacts → ✅ Success                       │ │
│  │ │  if FAIL → Wait 2 min → Retry (up to 6 attempts)              │ │
│  │ │                                                                 │ │
│  │ └─ Final result: ✅ or ❌                                         │ │
│  │                                                                   │ │
│  │ Step 5: Upload Reports         (~30 sec)                          │ │
│  │ ├─ playwright-report/  (HTML, 7-day retention)                   │ │
│  │ └─ test-results/       (JSON, 7-day retention)                   │ │
│  │                                                                   │ │
│  │ Step 6: PR Comment              (if PR)                           │ │
│  │ └─ Post test results summary                                      │ │
│  │                                                                   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Total Time: 5-15 minutes (depending on retries needed)                 │
│                                                                          │
└──────────────┬──────────────────────┬─────────────────┬─────────────────┘
               │                      │                 │
        if ✅ PASS         if ❌ FAIL or RETRY    if 🔄 IN PROGRESS
               │                      │                 │
               ↓                      ↓                 ↓
   ┌───────────────────┐  ┌──────────────────┐  ┌──────────────────┐
   │ ✅ Workflow Pass  │  │ ❌ Workflow Fail │  │  ⏳ In Progress   │
   ├───────────────────┤  ├──────────────────┤  ├──────────────────┤
   │ • Green checkmark │  │ • Red X          │  │ • Yellow dot     │
   │ • Show in GitHub  │  │ • Blocks PR merge │  │ • Still running  │
   │ • PR can merge    │  │ • Check logs     │  │                  │
   │ • Comment posted  │  │ • Check artifacts │  │                  │
   └───────────────────┘  └──────────────────┘  └──────────────────┘
               │                      │
               ↓                      ↓
   ┌───────────────────────────────────────────────────┐
   │   Artifacts Available on GitHub (7 days)         │
   ├───────────────────────────────────────────────────┤
   │ • playwright-report/index.html (interactive)     │
   │ • test-results/results.json (machine-readable)   │
   │ • test-results/junit.xml (CI integration)        │
   │ • Screenshots (on failure)                        │
   │ • Videos (on failure)                             │
   └───────────────────────────────────────────────────┘
```

## Test Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Each Test Execution                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Test Suite: "Production Application E2E Tests"                        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ Test 1: Navigation from Login to Register                       │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │                                                                 │  │
│  │  page.goto('https://sitezenshipapp.onrender.com/')            │  │
│  │       ↓                                                         │  │
│  │  ✓ Page loads [10s timeout]                                   │  │
│  │       ↓                                                         │  │
│  │  expect(page).toHaveTitle(/citizenship|login/i)              │  │
│  │       ↓                                                         │  │
│  │  ✓ Title contains "citizenship" or "login"                    │  │
│  │       ↓                                                         │  │
│  │  expect(page.locator('text=Sign in to continue')).toBeVisible │  │
│  │       ↓                                                         │  │
│  │  ✓ Sign-in text visible [10s timeout]                         │  │
│  │       ↓                                                         │  │
│  │  page.locator('a:has-text("Create one")').click()            │  │
│  │       ↓                                                         │  │
│  │  ✓ Link found and clicked                                     │  │
│  │       ↓                                                         │  │
│  │  expect(page).toHaveURL(/register/i)                          │  │
│  │       ↓                                                         │  │
│  │  ✓ URL changed to /register                                   │  │
│  │       ↓                                                         │  │
│  │  expect(page.locator('text=/create.*account|...')).toBeVisible │  │
│  │       ↓                                                         │  │
│  │  ✓ Register form visible [10s timeout]                        │  │
│  │       ↓                                                         │  │
│  │  ✅ TEST PASSED (~20 seconds)                                 │  │
│  │                                                                 │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ Test 2: Application Accessibility                              │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │                                                                 │  │
│  │  page.goto('https://sitezenshipapp.onrender.com/')            │  │
│  │       ↓                                                         │  │
│  │  ✓ Page loads [10s timeout]                                   │  │
│  │       ↓                                                         │  │
│  │  expect(page.locator('form')).toBeVisible([10s timeout])      │  │
│  │       ↓                                                         │  │
│  │  ✓ Login form visible                                         │  │
│  │       ↓                                                         │  │
│  │  expect(page.locator('input[type="email"]')).toBeVisible      │  │
│  │       ↓                                                         │  │
│  │  ✓ Email input visible                                        │  │
│  │       ↓                                                         │  │
│  │  expect(page.locator('input[type="password"]')).toBeVisible   │  │
│  │       ↓                                                         │  │
│  │  ✓ Password input visible                                     │  │
│  │       ↓                                                         │  │
│  │  expect(page.locator('button:has-text("Sign In")')).toBeVisible│  │
│  │       ↓                                                         │  │
│  │  ✓ Sign In button visible                                     │  │
│  │       ↓                                                         │  │
│  │  ✅ TEST PASSED (~15 seconds)                                 │  │
│  │                                                                 │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Summary: ✅ 2 passed in 35 seconds                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Retry Logic Flow Chart

```
                           Test Execution Starts
                                   │
                                   ↓
                    ┌──────────────────────────┐
                    │  Attempt #1 (Time: 5:41) │
                    └──────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ↓                             ↓
              ✅ PASSED                      ❌ FAILED
                    │                             │
                    │                    ┌────────────────────┐
                    │                    │ Wait 2 minutes     │
                    │                    └────────────────────┘
                    │                             │
                    │                    ┌────────────────────┐
                    │                    │ Attempt #2 (7:41)  │
                    │                    └────────────────────┘
                    │                             │
                    │                ┌────────────┴────────────┐
                    │                ↓                         ↓
                    │          ✅ PASSED               ❌ FAILED
                    │                │                         │
                    │                │                ┌────────────────────┐
                    │                │                │ Wait 2 minutes     │
                    │                │                └────────────────────┘
                    │                │                         │
                    │                │                ┌────────────────────┐
                    │                │                │ Attempt #3 (9:41)  │
                    │                │                └────────────────────┘
                    │                │                         │
                    │                │            ┌────────────┴────────────┐
                    │                │            ↓                         ↓
                    │                │      ✅ PASSED           ❌ FAILED (continue...)
                    │                │            │                         │
                    │                ↓            ↓                         ↓
                    │        ┌────────────────────────────────────────┐
                    │        │   Upload Artifacts & Complete          │
                    │        │   🎉 Workflow Success (1st pass or 2+) │
                    │        └────────────────────────────────────────┘
                    │
                    └──────────────────────────────┐
                                                   ↓
                        ┌──────────────────────────────────────┐
                        │  Final: ✅ Workflow Completed        │
                        │  Status: GREEN on GitHub             │
                        │  Result: PR can merge                │
                        │  Artifacts: Available for 7 days     │
                        └──────────────────────────────────────┘
```

## Deployment Timeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│ DEPLOYMENT TIMELINE - Git Push to Test Results                          │
└─────────────────────────────────────────────────────────────────────────┘

Time    │ Event                              │ Duration │ Cumulative
────────┼────────────────────────────────────┼──────────┼───────────
00:00   │ $ git push origin main             │   -      │  0:00
00:02   │ GitHub detects push & triggers WF  │   2s     │  0:02
00:03   │ Checkout code                      │   1s     │  0:03
00:13   │ Setup Node.js 18                   │  10s     │  0:13
00:43   │ npm ci (dependencies)              │  30s     │  0:43
01:43   │ npx playwright install --with-deps │  60s     │  1:43
02:43   │ ⏳ Deployment buffer begins        │   -      │  2:43
─────────┼────────────────────────────────────┼──────────┼───────────
         │ [Waiting 3 minutes]                │  180s    │
─────────┼────────────────────────────────────┼──────────┼───────────
05:43   │ ⏳ Deployment buffer ends          │   -      │  5:43
05:43   │ 🧪 Start Test Attempt #1           │   -      │  5:43
06:03   │ ✅ Tests passed!                   │  20s     │  6:03
06:33   │ 📤 Upload artifacts                │  30s     │  6:33
06:34   │ ✅ Workflow complete               │   -      │  6:34
────────┴────────────────────────────────────┴──────────┴───────────
         Total: ~6.5 minutes (if tests pass on first attempt)

─────────────────────────────────────────────────────────────────────

IF TESTS FAILED (Retry Example):

06:03   │ ❌ Tests failed (app not ready)     │   -      │  6:03
06:03   │ ⏳ Retry delay begins              │   -      │  6:03
─────────┼────────────────────────────────────┼──────────┼───────────
         │ [Waiting 2 minutes]                │  120s    │
─────────┼────────────────────────────────────┼──────────┼───────────
08:03   │ ⏳ Retry delay ends                │   -      │  8:03
08:03   │ 🧪 Start Test Attempt #2           │   -      │  8:03
08:23   │ ✅ Tests passed! (app ready now)    │  20s     │  8:23
08:53   │ 📤 Upload artifacts                │  30s     │  8:53
08:54   │ ✅ Workflow complete               │   -      │  8:54
────────┴────────────────────────────────────┴──────────┴───────────
         Total: ~8.5 minutes (with 1 retry)

─────────────────────────────────────────────────────────────────────

WORST CASE (All 6 attempts fail):

         Start with initial deployment buffer: 3 min
         + Setup: 2 min
         + 6 test attempts × 20s = 2 min
         + 5 waits × 2 min = 10 min
         + Upload: 1 min
         ────────────────────
         Total: ~18 minutes (❌ failure after max attempts)
         
Note: Configured max is 15 minutes, will timeout if exceeds limit
```

## File Structure

```
sitezenshipTest/
│
├─ 📦 Package Files
│  ├─ package.json                    ← UPDATED: Added @playwright/test
│  └─ .gitignore                      ← UPDATED: Added test artifacts
│
├─ 🧪 Test Files
│  ├─ playwright.config.ts            ← NEW: Playwright configuration
│  └─ e2e/
│     └─ production.spec.ts           ← NEW: Test cases
│
├─ 🔄 CI/CD Files
│  └─ .github/workflows/
│     └─ e2e-tests.yml               ← NEW: GitHub Actions workflow
│
├─ 📚 Documentation
│  ├─ E2E_TESTING_SETUP.md           ← Comprehensive guide
│  ├─ E2E_QUICK_REFERENCE.md         ← One-page reference
│  ├─ E2E_IMPLEMENTATION_SUMMARY.md  ← Overview & summary
│  ├─ WORKFLOW_EXECUTION_FLOW.md     ← Timeline & execution details
│  ├─ DEPLOYMENT_CHECKLIST.md        ← Pre/post deployment checklist
│  └─ E2E_ARCHITECTURE_DIAGRAMS.md   ← This file
│
├─ client/                            ← Your React app
├─ server/                            ← Your backend
└─ ...
```

## Technology Stack

```
                    Playwright Test Framework
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    Chromium         Firefox         Webkit
    (Used)          (Optional)      (Optional)
         │
         ├─ Page Navigation
         ├─ Element Interaction
         ├─ Assertion Validation
         ├─ Screenshot Capture
         └─ Video Recording
         
              ↓
         
        Playwright Config
        ├─ Timeout Settings
        ├─ Retry Strategy
        ├─ Reporter Setup
        └─ Browser Options
        
              ↓
         
        GitHub Actions
        ├─ Workflow Trigger (on push)
        ├─ Environment Setup
        ├─ Retry Logic
        └─ Artifact Management
        
              ↓
         
        Production Deployment
        └─ https://sitezenshipapp.onrender.com/
```

## Success Indicators

```
✅ LOCAL SUCCESS                    ✅ CI/CD SUCCESS

npm run test:e2e ✓                 GitHub Actions: ✅ Green
├─ Chromium ✓                      ├─ Workflow triggered ✓
├─ Test 1 ✓                        ├─ Tests executed ✓
├─ Test 2 ✓                        ├─ Artifacts uploaded ✓
└─ All passed ✓                    └─ PR comment posted ✓
```

---

**Created:** May 18, 2026  
**For:** Citizenship Test Application  
**Target:** https://sitezenshipapp.onrender.com/

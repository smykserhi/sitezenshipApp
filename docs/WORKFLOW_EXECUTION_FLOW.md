# GitHub Actions Workflow Execution Flow

This document shows the exact execution flow and timing of the E2E testing workflow.

## Complete Workflow Timeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│ EVENT: Push to main branch                                              │
│ Timestamp: 2024-05-18 10:00:00 UTC                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Checkout code                                          (~1 sec)  │
│ Action: actions/checkout@v4                                             │
│ Output: Repository files available in CI/CD environment                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Set up Node.js 18                                     (~10 sec) │
│ Action: actions/setup-node@v4                                           │
│ Config: Node 18, npm caching enabled                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Install dependencies                                  (~30 sec) │
│ Command: npm ci                                                         │
│ Packages: 50+ packages (express, react, playwright, etc)               │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Install Playwright browsers                          (~60 sec) │
│ Command: npx playwright install --with-deps                             │
│ Output: Chromium browser ready for testing                              │
└─────────────────────────────────────────────────────────────────────────┘
                              [~101 seconds elapsed]
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ 🔵 WAIT: 3 MINUTES for deployment to complete                          │
│ ⏳ 10:02:00 UTC → 10:05:00 UTC                                          │
│ Purpose: Allow Render to complete build and deployment                  │
│                                                                         │
│ This buffer ensures the app is fully deployed before tests start       │
└─────────────────────────────────────────────────────────────────────────┘
                              [~301 seconds elapsed]
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ 🧪 TEST LOOP: Retry Logic with 2-Minute Intervals                      │
│                                                                         │
│ MAX_ATTEMPTS=6  (configurable)                                          │
│ Each attempt includes:                                                  │
│   - Navigate to https://sitezenshipapp.onrender.com/                   │
│   - Verify login page loads                                             │
│   - Click "Create one" link                                             │
│   - Verify register page appears                                        │
│   - Check form accessibility                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

ATTEMPT #1 (10:05:00 UTC - ~301 seconds elapsed)
┌─────────────────────────────────────────────────────────────────────────┐
│ ✓ Test started                                                          │
│ ✓ Login page loads                                                      │
│ ✓ "Create one" link visible                                             │
│ ✓ Link clicked, navigation triggered                                    │
│ ✓ Register page loaded and verified                                     │
│                                                                         │
│ Result: PASSED ✅                                                       │
│ Duration: ~20 seconds                                                   │
│ Time: 10:05:20 UTC                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                    🎉 TESTS PASSED ON FIRST ATTEMPT!
                            Workflow succeeds.
                         No retries needed.
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP: Upload test results                                   (~30 sec)   │
│ Artifact: playwright-report/ (7-day retention)                          │
│ Artifact: test-results/     (7-day retention)                           │
│ JSON Report: Includes timing, browser info, results                     │
└─────────────────────────────────────────────────────────────────────────┘
                              [~351 seconds elapsed]
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ ✅ WORKFLOW COMPLETED SUCCESSFULLY                                      │
│ Total Time: ~5 minutes 51 seconds                                       │
│ Status: SUCCESS                                                         │
│ GitHub UI: Green checkmark on commit                                    │
│ PR Comment: "✅ Tests completed - Passed: 2, Failed: 0"               │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════

SCENARIO 2: Tests Fail on First Attempt (with Retries)

Attempt #1 fails (e.g., deployment not ready yet)
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ ❌ Test failed                                                          │
│ Error: "Timeout waiting for element"                                    │
│ Likely cause: App still initializing                                    │
│ Result: FAILED                                                          │
│ Action: Enter retry loop                                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ ⏳ WAIT: 2 minutes before Attempt 2                                     │
│ 10:05:20 UTC → 10:07:20 UTC                                             │
└─────────────────────────────────────────────────────────────────────────┘

Attempt #2 (10:07:20 UTC)
┌─────────────────────────────────────────────────────────────────────────┐
│ ✓ App now fully deployed                                                │
│ ✓ All tests pass                                                        │
│                                                                         │
│ Result: PASSED ✅                                                       │
│ Duration: ~20 seconds                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
            🎉 TESTS PASSED ON RETRY - WORKFLOW SUCCEEDS!
                         No further retries needed.
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ ✅ WORKFLOW COMPLETED SUCCESSFULLY                                      │
│ Total Time: ~7 minutes 51 seconds (including 1 retry)                  │
│ Status: SUCCESS                                                         │
│ GitHub UI: Green checkmark on commit                                    │
│ Note: Had to retry once due to deployment timing                        │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════

SCENARIO 3: Persistent Failure (All Retries Exhausted)

Attempt #1: Failed
Attempt #2: Failed (after 2-minute wait)
Attempt #3: Failed (after 2-minute wait)
Attempt #4: Failed (after 2-minute wait)
Attempt #5: Failed (after 2-minute wait)
Attempt #6: Failed (after 2-minute wait) ← FINAL ATTEMPT
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ 🚨 ALL TEST ATTEMPTS FAILED                                             │
│ Total attempts: 6                                                       │
│ Total time: ~13 minutes                                                 │
│ Likely cause: Application deployment failed                             │
│ Action: Exit with error                                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ ❌ WORKFLOW FAILED                                                      │
│ Status: FAILED                                                          │
│ GitHub UI: Red X on commit                                              │
│ PR Status: Blocks merge (if configured)                                 │
│ Developer Action: Check deployment logs, investigate errors             │
│ Artifacts Available: Screenshots, videos, detailed logs                 │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════

RETRY ATTEMPT TIMELINE (Visual)

Status  │ Time  │ Event                          │ Total Elapsed
────────┼───────┼────────────────────────────────┼──────────────
Setup   │ 0:00  │ Checkout, install deps         │ 1:41
Setup   │ 1:41  │ Install Playwright browsers    │ 2:41
Setup   │ 2:41  │ Deployment wait begins         │ 2:41
────────┼───────┼────────────────────────────────┼──────────────
Wait    │ 2:41  │ ⏳ Waiting for deployment      │ 5:41
────────┼───────┼────────────────────────────────┼──────────────
Attempt │ 5:41  │ 🧪 Test Attempt #1             │ 6:01 ✅ PASS
────────┼───────┼────────────────────────────────┼──────────────
        │ 6:01  │ 📤 Upload artifacts            │ 6:31
────────┼───────┼────────────────────────────────┼──────────────
        │ 6:31  │ ✅ Workflow complete           │ 6:31

If Attempt #1 Failed (example):
────────┼───────┼────────────────────────────────┼──────────────
Attempt │ 5:41  │ 🧪 Test Attempt #1             │ 6:01 ❌ FAIL
Wait    │ 6:01  │ ⏳ Waiting 2 minutes            │ 8:01
Attempt │ 8:01  │ 🧪 Test Attempt #2             │ 8:21 ✅ PASS
────────┼───────┼────────────────────────────────┼──────────────
        │ 8:21  │ 📤 Upload artifacts            │ 8:51
────────┼───────┼────────────────────────────────┼──────────────
        │ 8:51  │ ✅ Workflow complete (with 1)  │ 8:51


═══════════════════════════════════════════════════════════════════════════

CONFIGURATION OPTIONS (Adjustable)

Parameter                Value      What to Change      When to Change
────────────────────────────────────────────────────────────────────────
Initial deployment wait 180 sec    sleep 180           If deployment takes
                        (3 min)                        longer/shorter

Retry interval          120 sec    sleep 120           If you want faster/
                        (2 min)                        slower retries

Max retry attempts      6          MAX_ATTEMPTS=6      If you need more/fewer
                                                       attempts

Test timeout            30 sec     timeout: 30*1000    If tests need more time

Node.js version         18         node-version: 18    If compatibility needed

Artifact retention      7 days     retention-days: 7   If you need longer history


═══════════════════════════════════════════════════════════════════════════

GITHUB ACTIONS UI DISPLAY

Repository → Actions Tab
│
├─ E2E Tests - Production Monitoring (workflow name)
│   │
│   └─ Run #42
│       ├─ Status: ✅ Passed (or ❌ Failed)
│       ├─ Duration: 6m 31s
│       ├─ Commit: abc1234 "Add new feature"
│       ├─ Author: You <you@example.com>
│       │
│       └─ Jobs:
│           └─ wait-and-test (job name)
│               ├─ Checkout code ✅ 1s
│               ├─ Set up Node.js ✅ 10s
│               ├─ Install dependencies ✅ 30s
│               ├─ Install Playwright browsers ✅ 60s
│               ├─ Wait 3 minutes ✅ 180s
│               ├─ Run E2E tests ✅ 20s
│               └─ Upload test results ✅ 30s
│
│ Artifacts (available for 7 days):
│ ├─ playwright-report (HTML report, screenshots, videos)
│ └─ test-results-json (Machine-readable results)


═══════════════════════════════════════════════════════════════════════════

PR COMMENT EXAMPLE

When tests run on a pull request, GitHub automatically comments:

┌─────────────────────────────────────────────────────────────────────────┐
│ github-actions[bot] commented                                           │
│                                                                         │
│ ## E2E Test Results                                                     │
│                                                                         │
│ ✅ Tests completed                                                      │
│ - **Passed:** 2                                                         │
│ - **Failed:** 0                                                         │
│ - **Duration:** 12.34s                                                  │
│                                                                         │
│ [View full report in Actions artifacts]                                │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════

SUMMARY

✅ Push to main                      → Workflow triggers
⏳ 3-minute deployment buffer        → Ensures app is ready
🧪 Test attempt 1                   → Usually passes
⏳ 2-minute wait (if needed)         → Between retries
🧪 Test attempts 2-6 (if needed)    → Retry loop
📤 Upload reports                   → Available 7 days
✅ Workflow completes               → Green or red status

Average runtime: 5-10 minutes
Maximum runtime: 15 minutes
Artifact retention: 7 days

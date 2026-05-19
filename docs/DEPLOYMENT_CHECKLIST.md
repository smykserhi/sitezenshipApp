# Deployment Checklist - E2E Testing

Use this checklist to verify everything is properly set up before deploying.

## Pre-Deployment Verification

- [ ] **Playwright test file created**
  - Location: `e2e/production.spec.ts`
  - Contains: 2 test cases (navigation + accessibility)
  - Target URL: `https://sitezenshipapp.onrender.com/`

- [ ] **Playwright configuration created**
  - Location: `playwright.config.ts`
  - Settings: Production-safe timeouts (30s tests, 10s assertions)
  - Reporters: HTML, JSON, JUnit

- [ ] **GitHub Actions workflow created**
  - Location: `.github/workflows/e2e-tests.yml`
  - Trigger: On push to main
  - Initial wait: 3 minutes (deployment buffer)
  - Retry: 2-minute intervals, up to 6 attempts

- [ ] **Package.json updated**
  - [ ] Playwright dependency added: `@playwright/test@^1.44.0`
  - [ ] 4 test scripts added:
    - [ ] `test:e2e`
    - [ ] `test:e2e:ui`
    - [ ] `test:e2e:debug`
    - [ ] `test:e2e:headed`

- [ ] **.gitignore updated**
  - [ ] `test-results/` added
  - [ ] `playwright-report/` added
  - [ ] `.playwright/` added

## Local Testing Before Push

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Run tests locally
npm run test:e2e

# Expected output:
# ✓ 2 passed (12.34s)
```

- [ ] Tests pass locally
- [ ] HTML report generates correctly
  ```bash
  npx playwright show-report
  ```
- [ ] Report shows both tests passing

## Documentation Verification

- [ ] `E2E_TESTING_SETUP.md` exists (comprehensive guide)
- [ ] `E2E_QUICK_REFERENCE.md` exists (one-page reference)
- [ ] `E2E_IMPLEMENTATION_SUMMARY.md` exists (overview)
- [ ] `WORKFLOW_EXECUTION_FLOW.md` exists (timeline guide)

## Git Commit Preparation

```bash
# Stage all changes
git add -A

# Verify what will be committed
git status

# Should show these new/modified files:
# - playwright.config.ts
# - package.json
# - .gitignore
# - e2e/production.spec.ts
# - .github/workflows/e2e-tests.yml
# - E2E_TESTING_SETUP.md
# - E2E_QUICK_REFERENCE.md
# - E2E_IMPLEMENTATION_SUMMARY.md
# - WORKFLOW_EXECUTION_FLOW.md
```

- [ ] All files staged correctly
- [ ] No sensitive data in files
- [ ] No node_modules included

## First Deployment Steps

```bash
# 1. Commit changes
git commit -m "Add Playwright E2E tests for production monitoring

- Add Playwright test suite for production app
- Configure GitHub Actions workflow with 3-min deployment buffer
- Add intelligent retry logic (2-min intervals, 6 attempts)
- Include comprehensive documentation
- Update package.json with test scripts"

# 2. Push to main
git push origin main
```

- [ ] Commit message is descriptive
- [ ] Push succeeds without conflicts

## GitHub Actions Verification

After first push:

1. **Check GitHub Actions UI:**
   - [ ] Go to Actions tab
   - [ ] See "E2E Tests - Production Monitoring" workflow
   - [ ] Workflow shows as "In progress" (running)

2. **Monitor Execution:**
   - [ ] Checkout step completes (~1s)
   - [ ] Node.js setup completes (~10s)
   - [ ] Dependencies install (~30s)
   - [ ] Playwright browsers install (~60s)
   - [ ] 3-minute wait begins (~180s)
   - [ ] Tests execute (~20-30s)
   - [ ] Artifacts upload (~30s)

3. **Expected Duration:**
   - [ ] Total: 5-10 minutes (if tests pass on first attempt)
   - [ ] Maximum: 15 minutes (if retries needed)

4. **Check Results:**
   - [ ] Workflow completes with ✅ green checkmark
   - [ ] Status shows "success"
   - [ ] No error messages in logs

5. **Download Reports:**
   - [ ] Go to workflow run
   - [ ] Download "playwright-report" artifact
   - [ ] Open index.html in browser
   - [ ] Verify both tests show as passed
   - [ ] Screenshots/videos captured (if available)

## Post-Deployment Validation

- [ ] **Workflow runs on every push to main**
  - Make a test commit
  - Verify workflow triggers
  - Verify tests pass

- [ ] **PR Comments Work**
  - Create a pull request
  - Verify automatic comment appears with results
  - Comment shows test count and status

- [ ] **Artifacts Retention**
  - Check that artifacts are stored
  - Verify 7-day retention is set
  - Confirm old artifacts can be deleted

- [ ] **Team Notifications**
  - [ ] Team knows to check GitHub Actions
  - [ ] Team knows where test reports are
  - [ ] Team knows how to run tests locally

## Troubleshooting Checklist

If workflow fails on first run:

- [ ] Check workflow logs for specific error
- [ ] Common issues:
  - [ ] Deployment not ready → Increase initial wait time
  - [ ] Timeout waiting for elements → Increase assertion timeout
  - [ ] Browser installation failed → Manually run `npx playwright install`
  - [ ] Network error → Check if production URL is accessible

- [ ] Run locally to reproduce:
  ```bash
  npm run test:e2e:headed
  ```

- [ ] Check GitHub Actions artifacts:
  - [ ] Screenshots (if failure occurred)
  - [ ] Videos (if failure occurred)
  - [ ] Detailed logs

## Ongoing Maintenance

### Monthly

- [ ] Review test results
- [ ] Check if timeouts need adjustment
- [ ] Update Playwright if new version available

### When UI Changes

- [ ] Update selectors in `e2e/production.spec.ts`
- [ ] Run tests locally to verify
- [ ] Commit and push

### Scaling Tests

- [ ] Add more test files in `e2e/` directory
- [ ] Run full suite: `npm run test:e2e`
- [ ] Adjust workflow timeouts if needed

## Success Criteria

✅ You're done when:

1. **Local Testing Works**
   - `npm run test:e2e` passes
   - Report generates correctly

2. **GitHub Actions Works**
   - Workflow triggers on push
   - Tests execute within 15 minutes
   - Results show in GitHub Actions UI
   - Artifacts are available

3. **Documentation is Clear**
   - Team can follow setup instructions
   - Tests can be run locally
   - Issues can be debugged using guides

4. **Monitoring is Active**
   - Production app is being tested automatically
   - Team receives results
   - Issues are caught early

## Quick Reference

| What | Where | When |
|------|-------|------|
| Test code | `e2e/production.spec.ts` | Modify to add/change tests |
| Configuration | `playwright.config.ts` | Adjust timeouts/browsers |
| CI/CD workflow | `.github/workflows/e2e-tests.yml` | Modify retry/wait times |
| Documentation | `E2E_*.md` files | Reference for team |
| Run locally | `npm run test:e2e` | Before pushing |
| View results | GitHub Actions artifacts | After each push |

## Contact & Support

- Playwright docs: https://playwright.dev/
- GitHub Actions docs: https://docs.github.com/en/actions
- Render deployments: https://render.com/docs

---

**Last Updated:** May 18, 2026
**Status:** Ready for Deployment ✅

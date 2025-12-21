# Execution Report Template

Use this template for the final execution report.

---

```markdown
# Execution Report: {PLAN_NAME}

**Plan:** `docs/plans/{plan_file}`
**Status:** SUCCESS | PARTIAL | FAILED
**Executed:** {timestamp}
**Mode:** Autonomous | Interactive

---

## Summary

{2-3 sentence summary of execution results}

---

## Pre-Execution Checks

### Baseline Tests
- Status: PASS | FAIL
- Tests run: {N}
- Pre-existing failures: {N}

### Sanity Check
- Plan matches codebase: YES | NO
- Discrepancies found: {N}
- Resolution: {how addressed}

---

## Phase Execution

### Phase 1: {Phase Name}

**Status:** COMPLETE | PARTIAL | FAILED

| Task | Description | Status | Verification |
|------|-------------|--------|--------------|
| 1.1 | {description} | ✅ | Tests pass |
| 1.2 | {description} | ✅ | Manual check |
| 1.3 | {description} | ❌ | Failed: {reason} |

**Review Checkpoint:** PASS | NEEDS_REVISION | FAIL
**Issues Addressed:** {list any issues fixed}

**Commits:**
- `abc1234` - feat(scope): description

---

### Phase 2: {Phase Name}

{Same structure as Phase 1}

---

## Files Changed

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/new-file.ts` | {purpose} |
| MODIFY | `src/existing.ts` | {purpose} |
| DELETE | `src/obsolete.ts` | {purpose} |

**Summary:**
- Created: {N} files
- Modified: {N} files
- Deleted: {N} files

---

## Test Results

### Final Test Run
```
bun test
{output summary}
```

### Coverage
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Lines | 75% | 82% | +7% |
| Functions | 68% | 78% | +10% |
| Branches | 62% | 70% | +8% |

### Tests Added
- `tests/unit/new-module.test.ts` - {N} tests
- `tests/integration/feature.test.ts` - {N} tests

---

## Review Summary

### Phase Checkpoints
| Phase | Verdict | Issues Found | Issues Fixed |
|-------|---------|--------------|--------------|
| 1 | PASS | 0 | 0 |
| 2 | NEEDS_REVISION | 2 | 2 |
| 3 | PASS | 1 | 1 |

### Final Review
- **Verdict:** PASS
- **Reviewer notes:** {summary}

---

## Commits Created

```
{hash} feat(scope): message 1
{hash} feat(scope): message 2
{hash} test(scope): message 3
{hash} docs(scope): message 4
```

Total commits: {N}

---

## Rollback Information

If rollback needed:

```bash
# Commits in this execution
git log --oneline {first_commit}^..{last_commit}

# Revert all changes
git revert {first_commit}^..{last_commit}

# Or hard reset (destructive)
git reset --hard {commit_before_execution}
```

---

## Next Steps

{If SUCCESS:}
- [ ] Review commits for final approval
- [ ] Create PR if on feature branch
- [ ] Update related documentation

{If PARTIAL:}
- [ ] Address remaining failures
- [ ] Re-run failed phases
- [ ] Complete manual steps

{If FAILED:}
- [ ] Review failure reasons
- [ ] Consider plan revision
- [ ] Consult with user on approach

---

*Executed with plan-execute skill*
```

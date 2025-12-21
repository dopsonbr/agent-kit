---
name: review-implementation
description: Review implementation work at checkpoints during plan execution. Use when verifying phase completion, validating code changes, or performing final plan review.
license: MIT
metadata:
  author: agent-kit
  version: "2.0.0"
---

# Review Implementation

Validate implementation work at checkpoints during plan execution.

## Purpose

Provide quality gates during plan execution by:
- Verifying tasks completed as specified
- Checking code quality and patterns
- Validating tests are adequate
- Identifying issues before they compound

## When to Use

- After completing a phase during plan-execute
- At the end of plan execution (mandatory)
- When manually checking implementation progress
- Before merging implementation work

## CRITICAL: Third-Party Review Required

**This skill MUST delegate to Codex CLI.** The review cannot be performed by the agent that implemented the code - an independent third-party model must validate the work.

Why third-party review matters:
- Catches blind spots the implementer missed
- Validates implementation against plan specifications
- Provides independent verification of code quality
- Reduces confirmation bias in self-review

**If Codex CLI is not available, inform the user and do not proceed with a self-review.**

## Codex CLI Invocation

Use the dedicated `codex review` command for non-interactive code review:

```bash
# Review uncommitted changes
codex review --uncommitted --title "Review Title"

# Review changes against a base branch
codex review --base main --title "PR Review"

# Review a specific commit
codex review --commit abc123 --title "Commit Review"

# Review with custom instructions (no scope flags)
codex review "Check for security issues in the authentication code"

# Read custom instructions from stdin (no scope flags)
cat <<'PROMPT' | codex review -
<review instructions here>
PROMPT
```

**Key options:**
- `--uncommitted` - Review staged, unstaged, and untracked changes
- `--base <BRANCH>` - Review changes against a base branch
- `--commit <SHA>` - Review changes introduced by a specific commit
- `--title <TITLE>` - Optional title for the review summary

**IMPORTANT:** The `--base`, `--commit`, and `--uncommitted` flags **cannot** be combined with a `[PROMPT]` argument. Use either:
1. Scope flags (`--commit`, `--base`, `--uncommitted`) with optional `--title`
2. OR a custom `[PROMPT]` without scope flags

## Review Scopes

### Phase Review

Invoked after each phase completes:

```
/review-implementation --scope phase --phase {N}
```

Reviews:
- Tasks in the specified phase
- Files changed during this phase
- Verification commands ran successfully
- No regressions introduced

### Plan Review

Invoked at plan completion (mandatory):

```
/review-implementation --scope plan
```

Reviews:
- All phases completed
- Full test coverage
- Documentation updated
- Overall code quality

### Diff Review

Review specific changes:

```
/review-implementation --scope diff
```

Reviews:
- Current uncommitted changes
- Or changes since a specific commit

## Review Workflow

### Step 1: Gather Context

Collect information about what to review:

1. **Identify the plan** being executed
2. **Determine scope** (phase, plan, or diff)
3. **Get the changes:**
   - For phase: commits since phase start
   - For plan: all commits in execution
   - For diff: current uncommitted changes

```bash
# Get changes for review
git diff --stat HEAD~{N}
git log --oneline HEAD~{N}..HEAD
```

### Step 2: Load Plan Expectations

Read the plan to understand:
- What tasks should have been completed
- Expected file changes (CREATE/MODIFY/DELETE)
- Verification commands specified
- Testing strategy requirements

### Step 3: Verify Codex Available

**MANDATORY:** You must invoke Codex CLI. Do not perform the review yourself.

```bash
which codex || echo "Codex CLI not installed"
```

If not available, stop and inform the user they need to install Codex CLI.

### Step 4: Invoke Codex Review

Use `codex review` with the appropriate scope:

**For Phase Review (uncommitted changes):**

```bash
codex review --uncommitted --title "Phase {N}: {phase-name}"
```

**For Phase Review (committed changes):**

```bash
codex review --commit {phase-commit-sha} --title "Phase {N}: {phase-name}"
```

**For Plan Review (against base branch):**

```bash
codex review --base main --title "Plan Review: {plan-name}"
```

**Note:** Scope flags (`--commit`, `--base`, `--uncommitted`) cannot be combined with custom prompts. Codex will automatically analyze the changes and provide a structured review.

**Codex will:**
- Read the changed files and understand the context
- Examine the actual code changes
- Check for bugs, security issues, and code quality
- Provide a structured review with findings

### Step 5: Run Verification

Execute verification commands from the plan:

```bash
bun test
bun run typecheck
bun run lint
```

### Step 6: Compile Review Report

Output a structured review report:

```markdown
## Implementation Review: {scope}

**Plan:** {plan-name}
**Scope:** Phase {N} | Full Plan | Diff
**Reviewed by:** Codex (gpt-5.1-codex-max)
**Verdict:** PASS | NEEDS_REVISION | FAIL

### Summary

{2-3 sentence summary of findings}

### Tasks Verified

| Task | Expected | Actual | Status |
|------|----------|--------|--------|
| 1.1 Create auth module | `src/auth.ts` created | ✅ Created | PASS |
| 1.2 Add tests | 3+ tests | 4 tests | PASS |

### Code Quality

| Aspect | Finding | Severity |
|--------|---------|----------|
| Correctness | Logic matches spec | - |
| Patterns | Follows existing patterns | - |
| Edge cases | Missing null check in parser | MEDIUM |

### Issues Found

| Severity | Issue | Location | Recommendation |
|----------|-------|----------|----------------|
| HIGH | Missing error handler | `src/auth.ts:42` | Add try-catch |
| MEDIUM | Unused import | `src/index.ts:3` | Remove import |
| LOW | Variable could be const | `src/utils.ts:15` | Use const |

### Test Coverage

- New tests: {N}
- All tests passing: ✅ | ❌
- Coverage adequate: ✅ | ❌

### Recommendations

1. {Actionable recommendation}
2. {Actionable recommendation}

### Verdict Explanation

{Why this verdict was given}

**Next Steps:**
- PASS: Continue to next phase / Merge
- NEEDS_REVISION: Apply fixes listed above
- FAIL: Stop and consult user
```

## Verdicts

### PASS

Implementation meets all requirements:
- All expected tasks completed
- Tests passing and adequate
- No HIGH severity issues
- Code quality acceptable

**Action:** Proceed to next phase or merge.

### NEEDS_REVISION

Implementation mostly correct but has issues:
- Some tasks incomplete or incorrect
- MEDIUM severity issues found
- Tests incomplete

**Action:** Fix issues and re-run review.

### FAIL

Significant problems found:
- Major tasks missing or wrong
- HIGH severity issues
- Breaking changes
- Security concerns

**Action:** Stop execution, consult user.

## Critical Analysis

When analyzing findings, apply critical thinking:

### Do Apply Feedback When:
- Issue is clearly a bug or error
- Fix is straightforward and safe
- Pattern violation is obvious
- Security concern is valid

### Question Feedback When:
- Suggestion is stylistic preference
- Fix would require scope expansion
- Recommendation conflicts with plan
- Issue is a known trade-off

### Document Decisions

When choosing not to apply feedback:

```markdown
**Declined Recommendation:**
> "Add retry logic to API calls"

**Reason:** Out of scope for current phase. Will be addressed in Phase 4 as per plan.
```

## Integration with plan-execute

This skill is invoked automatically by plan-execute:

1. After each phase completes
2. Before proceeding to next phase
3. At plan completion (mandatory)

The plan-execute skill will:
- Pass the current scope and phase
- Wait for the verdict
- Act based on the verdict (continue, fix, or stop)

## Examples

### Example: Phase review passes

```
/review-implementation --scope phase --phase 1

Claude: I'll review Phase 1 using Codex CLI for independent validation.

[Runs: which codex]
/opt/homebrew/bin/codex

[Runs: codex review --commit abc123 --title "Phase 1: Database Schema"]

Codex returned:

## Implementation Review: Phase 1

**Plan:** 0042_user-auth
**Scope:** Phase 1
**Reviewed by:** Codex (gpt-5.1-codex-max)
**Verdict:** PASS

### Summary
All 3 tasks in Phase 1 completed successfully. Database schema
created, migrations added, and tests passing.

### Tasks Verified
| Task | Expected | Status |
|------|----------|--------|
| 1.1 Create schema | `src/db/schema.ts` | PASS |
| 1.2 Add migration | `migrations/001_users.ts` | PASS |
| 1.3 Write tests | 5+ tests | PASS (6 tests) |

### Verdict Explanation
All tasks complete, tests passing, no issues found.

**Next Steps:** Proceed to Phase 2
```

### Example: Review finds issues

```
/review-implementation --scope phase --phase 2

Claude: I'll review Phase 2 using Codex CLI.

[Runs: codex review --commit def456 --title "Phase 2: API Endpoints"]

Codex returned:

## Implementation Review: Phase 2

**Reviewed by:** Codex (gpt-5.1-codex-max)
**Verdict:** NEEDS_REVISION

### Issues Found
| Severity | Issue | Location | Recommendation |
|----------|-------|----------|----------------|
| HIGH | Missing validation | `src/api/users.ts:28` | Add input validation |
| MEDIUM | No error handling | `src/api/users.ts:35` | Add try-catch |

### Recommendations
1. Add Zod schema validation before processing request
2. Wrap database call in try-catch

**Next Steps:** Apply fixes and re-run review
```

### Example: Final plan review

```
/review-implementation --scope plan

Claude: I'll perform the final plan review using Codex CLI.

[Runs: codex review --base main --title "Plan Review: 0042_user-auth"]

Codex returned:

## Implementation Review: Full Plan

**Plan:** 0042_user-auth
**Reviewed by:** Codex (gpt-5.1-codex-max)
**Verdict:** PASS

### Summary
All 4 phases complete. 12 tasks implemented, 24 tests added,
all verification passing.

### Phases Verified
- [x] Phase 1: Database Schema (3/3 tasks)
- [x] Phase 2: API Endpoints (4/4 tasks)
- [x] Phase 3: Frontend Forms (3/3 tasks)
- [x] Phase 4: Integration Tests (2/2 tasks)

### Test Coverage
- Unit tests: 18
- Integration tests: 6
- All passing: ✅

### Final Checks
- [x] All tests pass
- [x] Type check clean
- [x] Lint clean
- [x] Documentation updated

**Ready to merge.**
```

### Example: Codex not available

```
/review-implementation --scope plan

Claude: I need to invoke Codex CLI for third-party review.

[Runs: which codex]
codex not found

I cannot proceed with the review. This skill requires Codex CLI
for independent third-party validation. Please install it:

  npm install -g @openai/codex

Then run /review-implementation again.
```

## Related Skills

- `plan-execute` - Invokes this skill at checkpoints
- `review-plan` - Reviews plans before execution
- `review-code` - General code review (not plan-specific)

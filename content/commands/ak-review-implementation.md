---
description: Review implementation work at checkpoints during plan execution
arguments:
  - name: scope
    description: "Review scope: phase, plan, or diff (default: diff)"
    required: false
  - name: phase
    description: Phase number to review (required if scope is phase)
    required: false
---

Use the review-implementation skill to validate implementation work.

Follow the review-implementation skill instructions in @skills/review-implementation/SKILL.md exactly.

Key steps:
1. Determine scope (phase, plan, or diff)
2. Gather context - plan expectations, file changes, commits
3. Analyze changes against plan requirements
4. Check code quality (correctness, patterns, security)
5. Run verification commands (tests, typecheck, lint)
6. Generate review report with verdict (PASS/NEEDS_REVISION/FAIL)
7. Provide specific actionable feedback

Review scopes:
- `phase --phase N`: Review specific phase completion
- `plan`: Review full plan implementation (mandatory at completion)
- `diff`: Review current uncommitted changes

Verdicts:
- **PASS**: Implementation meets requirements, proceed
- **NEEDS_REVISION**: Issues found, apply fixes and re-review
- **FAIL**: Significant problems, stop and consult user

ARGUMENTS: $ARGUMENTS

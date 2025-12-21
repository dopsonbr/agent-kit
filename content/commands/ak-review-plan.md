---
description: Critically review an implementation plan before execution using Codex CLI
arguments:
  - name: plan-path
    description: Path to the plan file to review (e.g., docs/plans/0042_feature.md)
    required: false
---

Use the review-plan skill to critically review an implementation plan.

Follow the review-plan skill instructions in @skills/review-plan/SKILL.md exactly.

Key steps:
1. Locate the plan (from argument, context, or docs/plans/)
2. Read the plan file completely
3. Load relevant standards (CLAUDE.md + content/standards/)
4. Explore codebase to validate plan assumptions
5. Invoke Codex CLI with `-m gpt-5.1-codex-max` for deep review
6. Compile review report with verdict (PASS/FAIL/NEEDS_REVISION)
7. Provide specific actionable feedback

Use the references from:
- @skills/review-plan/references/review-criteria.md - For complete review checklist

If a plan path was provided, use it. Otherwise, check the current context for a plan or ask the user which plan to review.

ARGUMENTS: $ARGUMENTS

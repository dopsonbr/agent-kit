---
description: Execute an implementation plan autonomously using subagent-driven development
arguments:
  - name: plan-path
    description: Path to the plan file to execute (e.g., docs/plans/0042_feature.md)
    required: false
  - name: mode
    description: "Execution mode: autonomous (default) or interactive"
    required: false
---

Use the plan-execute skill to execute an implementation plan.

Follow the plan-execute skill instructions in @skills/plan-execute/SKILL.md exactly.

Key steps:
1. Locate the plan (from argument, context, or docs/plans/)
2. Run baseline tests - STOP if tests fail and ask user how to proceed
3. Perform sanity check - validate plan against current codebase
4. Parse dependency graph from plan
5. Execute phases using subagent delegation
6. After EACH phase, invoke review-implementation for checkpoint
7. Apply review feedback critically (evaluate, don't blindly apply)
8. After ALL phases complete, invoke review-implementation for final review
9. Generate execution report
10. Invoke merge-archive-plan (prompt if on main, skip if on feature branch)

Use the references from:
- @skills/plan-execute/references/subagent-patterns.md - For subagent coordination patterns
- @skills/plan-execute/assets/execution-report-template.md - For final report format

Execution modes:
- `autonomous` (default): Execute continuously, pause only for blocking issues
- `interactive`: Pause after each phase for user approval

If a plan path was provided, use it. Otherwise, check the current context or ask the user which plan to execute.

ARGUMENTS: $ARGUMENTS

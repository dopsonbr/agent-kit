---
description: Create a detailed implementation plan with diagrams and dependency tracking
arguments:
  - name: feature
    description: Brief description of the feature to plan (3-10 sentences)
    required: false
---

Use the create-plan skill to help the user create a structured implementation plan.

Follow the create-plan skill instructions in @skills/plan-create/SKILL.md exactly.

Key steps:
1. Ask clarifying questions about scope, boundaries, dependencies, and success criteria
2. Explore the codebase to understand existing patterns and integration points
3. Design architecture with Mermaid or ASCII diagrams
4. Break work into phases and tasks (2-15 min each)
5. Check line count - split into subplans if > 500 lines (hard cap: 1000)
6. Create dependency graph showing parallel/sequential tasks
7. Write plan to `docs/plans/{NNNN}_{FEATURE_NAME}.md`
8. Validate with the plan validation script
9. Offer to create a git worktree for implementation

Use the templates from:
- @skills/plan-create/assets/plan-template.md - For plan structure
- @skills/plan-create/references/examples.md - For plan examples
- @skills/plan-create/references/worktree-setup.md - For worktree guidance

If a feature description was provided, use it as the starting point. Otherwise, ask the user what they want to plan.

ARGUMENTS: $ARGUMENTS

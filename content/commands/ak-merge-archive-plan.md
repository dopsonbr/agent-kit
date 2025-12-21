---
description: Archive a completed implementation plan after PR merge to main
arguments:
  - name: plan-path
    description: Path to the plan file to archive (e.g., docs/plans/0042_feature.md)
    required: false
---

Use the merge-archive-plan skill to archive a completed plan.

Follow the merge-archive-plan skill instructions in @skills/merge-archive-plan/SKILL.md exactly.

Key steps:
1. Identify the plan (from argument, context, or docs/plans/)
2. Verify the implementation is merged to main
3. Gather archive metadata (PR, commits, files changed)
4. Add archive header with full metadata to plan
5. Move plan to docs/plans/archive/
6. Commit the archive

Use the template from:
- @skills/merge-archive-plan/assets/archive-header-template.md - For archive header format

This command proceeds directly without double-confirmation since the user explicitly requested archiving.

If a plan path was provided, use it. Otherwise, check the current context or ask the user which plan to archive.

ARGUMENTS: $ARGUMENTS

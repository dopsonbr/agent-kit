---
name: create-plan
description: Create detailed implementation plans with TDD-style tasks. Use when planning features, refactoring, or any multi-step development work before writing code.
license: MIT
metadata:
  author: agent-kit
  version: "1.0.0"
---

# Create Implementation Plan

Generate structured, executable implementation plans that follow TDD principles.

## Purpose

Transform requirements into actionable task lists where each task:
- Takes 2-10 minutes to complete
- Is atomic and self-contained
- Follows RED-GREEN-REFACTOR pattern
- Includes verification steps
- Has a conventional commit message

## When to Use

- Before implementing a new feature
- When refactoring existing code
- For breaking down complex changes
- After brainstorming, before coding

## Plan Structure

Every plan follows this format (see [assets/plan-template.md](assets/plan-template.md)):

1. **Header** - Goal, design doc reference, estimates
2. **Architecture Overview** - How it fits together
3. **Tasks** - Numbered, sequential steps
4. **Integration Verification** - Final checks
5. **Rollback Plan** - How to undo if needed

## Task Format

Each task must include:

```markdown
## Task N: {Descriptive Title}

**Files:**
- Create: `path/to/new/file.ts`
- Modify: `path/to/existing/file.ts`
- Delete: `path/to/obsolete/file.ts`

**Step 1: Write the failing test (RED)**

\`\`\`typescript
// tests/feature.test.ts
describe("Feature", () => {
  it("should do the thing", () => {
    expect(doThing()).toBe(expected);
  });
});
\`\`\`

**Step 2: Implement the code (GREEN)**

\`\`\`typescript
// src/feature.ts
export function doThing() {
  return expected;
}
\`\`\`

**Step 3: Verify**

\`\`\`bash
bun test tests/feature.test.ts
# Expected: 1 test passing
\`\`\`

**Commit:** `feat(feature): add doThing function`
```

## Task Requirements

### Atomicity
Each task must be independently completable. No task should depend on uncommitted work from another task.

### Completeness
Provide **complete code**, not pseudocode or placeholders:
- ❌ `// TODO: implement validation`
- ❌ `// ... rest of implementation`
- ✅ Full, working code that passes tests

### Exact Paths
Use precise file paths, never vague references:
- ❌ "in the utils folder"
- ✅ `src/lib/utils/validation.ts`

### Verification
Every task ends with a verification command:
```bash
bun test tests/specific.test.ts
# Expected: N tests passing
```

## TDD Pattern

### RED Phase
Write a failing test first. The test defines the expected behavior.

### GREEN Phase  
Write the minimal code to make the test pass. No more, no less.

### REFACTOR Phase (if needed)
Clean up without changing behavior. Tests must still pass.

## Commit Messages

Use Conventional Commits format:

```
<type>(<scope>): <description>

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code change without feature/fix
- test: Adding tests
- docs: Documentation only
- chore: Maintenance tasks
```

## Output Location

Plans are saved to: `docs/plans/{feature-name}-plan.md`

## Example Usage

```
User: Create a plan for adding user authentication

Claude: [Reviews project structure]
[Identifies relevant files and patterns]
[Generates plan with 5-10 tasks]
[Saves to docs/plans/user-auth-plan.md]
```

## Template Reference

See [assets/plan-template.md](assets/plan-template.md) for the full template.

## Related Skills

- `brainstorm` - Use before planning to explore ideas
- `review-plan` - Review a plan before execution
- `implement-plan` - Execute a plan task by task
- `create-adr` - Document architectural decisions made during planning

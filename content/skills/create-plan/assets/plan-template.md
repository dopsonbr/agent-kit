# Implementation Plan Template

Use this template when generating implementation plans.

---

# {Feature Name} Implementation Plan

> **For Executor:** Use @implement-plan to execute this plan task-by-task.

**Goal:** {One sentence describing what this plan achieves}
**Design Doc:** {Link to brainstorm doc or design document, or "N/A"}
**Estimated Tasks:** {N} tasks, ~{M} minutes total
**Created:** {YYYY-MM-DD}
**Author:** {Author name}

---

## Architecture Overview

{2-3 paragraphs explaining:
- How this feature fits into the existing system
- Key design decisions
- Dependencies and integration points}

## Tech Stack

{List relevant technologies, frameworks, and tools for this implementation}

---

## Task 1: {Descriptive Title}

**Files:**
- Create: `{path/to/new/file}`
- Modify: `{path/to/existing/file}`

**Step 1: Write the failing test (RED)**

```{language}
// {test file path}
{Complete test code}
```

**Step 2: Implement the code (GREEN)**

```{language}
// {source file path}
{Complete implementation code}
```

**Step 3: Verify**

```bash
{test command}
# Expected: {expected result}
```

**Commit:** `{type}({scope}): {description}`

---

## Task 2: {Descriptive Title}

{Same structure as Task 1}

---

## Task N: {Final Task}

{Same structure as Task 1}

---

## Integration Verification

After all tasks complete:

```bash
{full test suite command}
# Expected: All tests pass

{type check command}
# Expected: No type errors

{lint command}
# Expected: No lint errors
```

## Rollback Plan

If issues arise:

```bash
{rollback commands}
```

{Additional rollback notes if needed}

---

*Plan created using agent-kit skills. Execute with @implement-plan.*

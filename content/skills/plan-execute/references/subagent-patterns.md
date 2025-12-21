# Subagent Patterns for Plan Execution

Guidelines for effective subagent delegation during plan execution.

## Core Principles

### 1. Parallel When Independent

Launch multiple Task agents simultaneously when tasks don't share dependencies:

```
Phase 1 Tasks:
- Task 1.1: Create schema file (no deps)
- Task 1.2: Write unit tests (no deps)
- Task 1.3: Update types (no deps)

→ Launch 3 Task agents in parallel
```

### 2. Sequential When Dependent

Execute in order when outputs feed into inputs:

```
Phase 2 Tasks:
- Task 2.1: Create API endpoint (depends on schema)
- Task 2.2: Add route handler (depends on endpoint)
- Task 2.3: Integration tests (depends on route)

→ Execute sequentially
```

### 3. Explore Before Implement

Use Explore agents to gather context before implementation:

```
Before implementing Task 3.1:
1. Explore: "Find existing patterns for API endpoints"
2. Explore: "Check how errors are handled in similar files"
3. Then: Implement with context
```

## Agent Type Selection

### Use Task Agent For:

| Scenario | Why |
|----------|-----|
| Implementing a single file | Focused, isolated work |
| Writing tests | Can parallelize with implementation |
| Documentation updates | Independent of code |
| Refactoring a module | Contained scope |

**Example prompt:**
```
Implement Task 1.2 from plan docs/plans/0042_feature.md

Requirements:
- Create file: src/auth/validator.ts
- Export validateToken function
- Follow existing patterns in src/auth/

Verification: bun test src/auth/validator.test.ts

Return the file content when complete.
```

### Use Explore Agent For:

| Scenario | Why |
|----------|-----|
| Understanding existing patterns | Gather context before implementing |
| Validating assumptions | Check if plan matches reality |
| Finding dependencies | Locate files that need updating |
| Learning project structure | Before making changes |

**Example prompt:**
```
Explore the codebase to find:
1. How are API endpoints currently structured?
2. What validation patterns are used?
3. Where are error handlers defined?

Return a summary of patterns found.
```

### Execute Directly When:

| Scenario | Why |
|----------|-----|
| Simple one-line changes | Overhead not worth it |
| File already in context | No exploration needed |
| Dependent on agent output | Need to process result first |

## Coordination Patterns

### Fan-Out / Fan-In

Start multiple agents, wait for all to complete:

```
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
   ┌───┴───┐
   ▼       ▼
┌─────┐ ┌─────┐
│ T1  │ │ T2  │  ← Fan-out (parallel)
└──┬──┘ └──┬──┘
   │       │
   └───┬───┘
       ▼
┌─────────────┐
│  Integrate  │  ← Fan-in (wait for all)
└─────────────┘
```

### Pipeline

Output of one feeds into next:

```
┌─────┐    ┌─────┐    ┌─────┐
│ T1  │ ──▶│ T2  │ ──▶│ T3  │
└─────┘    └─────┘    └─────┘

T1 output → T2 input → T3 input
```

### Conditional

Execute different agents based on results:

```
┌─────────┐
│ Explore │
└────┬────┘
     │
     ▼
  Pattern?
   /     \
  ▼       ▼
┌────┐  ┌────┐
│ T1 │  │ T2 │  ← Choose based on finding
└────┘  └────┘
```

## Best Practices

### 1. Keep Agent Prompts Focused

Bad:
```
Implement the authentication system including schema,
API endpoints, validation, tests, and documentation.
```

Good:
```
Implement the token validation function in src/auth/validator.ts

Requirements:
- Export: validateToken(token: string): Promise<TokenPayload>
- Use the existing jwt library
- Throw AuthError on invalid token

Reference: src/auth/types.ts for TokenPayload
```

### 2. Include Verification in Prompts

```
Task: Create user service tests

After completion, verify:
1. Run: bun test src/services/user.test.ts
2. Expect: All tests pass
3. Expect: Coverage > 80%

Report verification results.
```

### 3. Pass Context Between Agents

When agents need to share information:

```
# After Explore agent completes:
findings = "Found pattern X in file Y..."

# Pass to Task agent:
Task: Implement validation following the pattern described below

Pattern context:
{findings}

Create: src/auth/validator.ts
```

### 4. Handle Agent Failures

If a Task agent fails:

1. **Check the error** - Is it recoverable?
2. **Gather more context** - Launch Explore agent
3. **Retry with context** - Include error info in retry prompt
4. **Escalate** - If still failing, ask user

```
Task agent failed with: "Cannot find module 'jwt'"

Recovery:
1. Explore: "Find where jwt is imported in the project"
2. Finding: "jwt is aliased as jsonwebtoken"
3. Retry Task with corrected import
```

## Dependency Graph Execution

### Topological Sort

Execute in dependency order:

```
Given graph:
  A → B → D
  A → C → D

Execution order:
  Level 0: A (no deps)
  Level 1: B, C (deps on A, parallel)
  Level 2: D (deps on B and C, wait for both)
```

### Tracking Progress

Maintain execution state:

```typescript
interface TaskState {
  id: string
  status: 'pending' | 'running' | 'complete' | 'failed'
  dependencies: string[]
  result?: string
}

// Only start task when all deps complete
function canStart(task: TaskState, completed: Set<string>): boolean {
  return task.dependencies.every(d => completed.has(d))
}
```

### Handling Failures

When a task fails:

1. **Mark as failed**
2. **Block dependents** - Can't run if deps failed
3. **Continue parallel tasks** - Other branches may succeed
4. **Report at phase end** - Show what completed, what blocked

```
Phase 1 Results:
✅ Task 1.1: Schema created
❌ Task 1.2: Test creation failed (missing fixture)
⏸️ Task 1.3: Blocked (depends on 1.2)
✅ Task 1.4: Types updated

1 failure, 1 blocked. Fix Task 1.2 and re-run.
```

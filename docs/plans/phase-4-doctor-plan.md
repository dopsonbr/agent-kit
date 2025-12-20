# Phase 4: Doctor Command Implementation Plan

> **For Executor:** Use @implement-plan to execute this plan task-by-task.

**Goal:** Implement `ak doctor` command that diagnoses installation health
**Estimated Tasks:** 6 tasks, ~30 minutes total
**Created:** 2024-12-20

---

## Architecture Overview

The doctor command runs a series of health checks to verify the agent-kit installation is correct and complete. It checks for required files, validates configurations, and optionally checks for external tool availability (Codex CLI, Claude Code).

## Tasks Summary

### Task 1: Create Health Check Framework
```typescript
// src/lib/doctor.ts
export interface HealthCheck {
  name: string;
  check: () => Promise<CheckResult>;
}

export interface CheckResult {
  status: "pass" | "warn" | "fail";
  message: string;
  details?: string;
}

export async function runChecks(checks: HealthCheck[]): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  for (const check of checks) {
    results.push(await check.check());
  }
  return results;
}
```

### Task 2: Implement Directory Checks
Check for required directories:
- `.github/skills/`
- `.claude/skills/`
- `.claude/commands/`
- `docs/ideas/`, `docs/plans/`, `docs/adrs/`

### Task 3: Implement File Checks
Check for required files:
- `.ak/config.json`
- `.claude/settings.json`
- `AGENTS.md`

### Task 4: Implement Configuration Validation
Validate JSON schemas and required fields.

### Task 5: Implement External Tool Checks
Check availability of:
- `codex` CLI (optional)
- `claude` CLI (optional)

### Task 6: Wire Up Command and Format Output
```typescript
// src/cli/commands/doctor.ts
export async function doctorCommand(): Promise<void> {
  print(format.title(`agent-kit v${pkg.version}`));
  print();

  const checks = [
    ...directoryChecks,
    ...fileChecks,
    ...configChecks,
    ...toolChecks,
  ];

  const results = await runChecks(checks);
  
  let passed = 0, warned = 0, failed = 0;
  
  for (const result of results) {
    switch (result.status) {
      case "pass":
        print(`${symbols.check} ${result.message}`);
        passed++;
        break;
      case "warn":
        print(`${symbols.warning} ${result.message}`);
        if (result.details) print(colors.dim(`  ${result.details}`));
        warned++;
        break;
      case "fail":
        print(`${symbols.cross} ${result.message}`);
        if (result.details) print(colors.dim(`  ${result.details}`));
        failed++;
        break;
    }
  }

  print();
  if (failed > 0) {
    print(format.error(`${failed} check(s) failed`));
    process.exit(1);
  } else if (warned > 0) {
    print(format.warning(`${warned} warning(s)`));
  } else {
    print(format.success("All checks passed!"));
  }
}
```

---

## Expected Output

```
agent-kit v1.0.0

✓ .github/skills/ exists (7 skills)
✓ .claude/skills/ exists (symlinked)
✓ .claude/commands/ exists (7 commands)
✓ .claude/settings.json valid
✓ .ak/config.json valid
✓ AGENTS.md exists
✓ docs/ structure valid
⚠ Codex CLI not found (optional)
✓ Claude Code available (v2.0.0)

All checks passed!
```

---

*Plan created using agent-kit skills.*

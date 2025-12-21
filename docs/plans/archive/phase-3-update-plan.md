# Phase 3: Update Command Implementation Plan

> **For Executor:** Use @implement-plan to execute this plan task-by-task.

**Goal:** Implement `ak update` command that updates skills and/or CLI
**Estimated Tasks:** 5 tasks, ~25 minutes total
**Created:** 2024-12-20

---

## Architecture Overview

The update command checks for newer versions of both the CLI (npm package) and the content (skills, commands). It can update either or both, with flags for granular control.

## Tasks Summary

### Task 1: Version Comparison Utility
Create utility to compare semver versions for both CLI and content.

### Task 2: CLI Update Check
Check npm registry for newer CLI versions, compare with installed.

### Task 3: Content Update Check  
Check GitHub repo for newer content commits, compare with cached version.

### Task 4: Update Execution
Execute updates by re-fetching content and/or upgrading npm package.

### Task 5: Wire Up Command
Integrate into CLI router with proper flags:
- `--skills-only` - Only update skills
- `--cli-only` - Only update CLI  
- `--check` - Check without installing

---

## Key Implementation Details

```typescript
// src/cli/commands/update.ts
export async function updateCommand(args: ParsedArgs): Promise<void> {
  const checkOnly = args.flags.check || false;
  const skillsOnly = args.flags["skills-only"] || false;
  const cliOnly = args.flags["cli-only"] || false;

  print(format.title("Checking for updates..."));

  if (!cliOnly) {
    const contentUpdates = await checkContentUpdates();
    if (contentUpdates.available) {
      print(format.info(`New skills available: ${contentUpdates.count} updates`));
      if (!checkOnly) {
        await updateContent();
        print(format.success("Skills updated"));
      }
    } else {
      print(format.success("Skills are up to date"));
    }
  }

  if (!skillsOnly) {
    const cliUpdate = await checkCliUpdate();
    if (cliUpdate.available) {
      print(format.info(`New CLI version: ${cliUpdate.version}`));
      if (!checkOnly) {
        print(colors.dim("Run: npm update -g agent-kit"));
      }
    } else {
      print(format.success("CLI is up to date"));
    }
  }
}
```

---

*Plan created using agent-kit skills.*

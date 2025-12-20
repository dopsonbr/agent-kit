# Phase 5: Tool Delegation Implementation Plan

> **For Executor:** Use @implement-plan to execute this plan task-by-task.

**Goal:** Implement tool delegation system allowing skills to use external tools like Codex CLI
**Estimated Tasks:** 7 tasks, ~45 minutes total
**Created:** 2024-12-20

---

## Architecture Overview

The delegation system allows skills like `review-code` and `review-plan` to delegate execution to external tools (Codex CLI, Claude CLI) based on configuration. This provides flexibility to use the best tool for each task while maintaining a consistent interface.

## Design

```
User invokes skill → Skill checks delegation config → Delegates to tool OR executes natively
                            ↓
                    .ak/config.json
                    {
                      "defaults": {
                        "reviewTool": "codex"
                      },
                      "overrides": {
                        "review-code": { "tool": "claude" }
                      }
                    }
```

## Tasks Summary

### Task 1: Define Delegation Interface

```typescript
// src/types/delegation.ts
export interface DelegationConfig {
  tool: "codex" | "claude" | "native";
  model?: string;
  reasoning?: "low" | "medium" | "high";
  approvalMode?: "suggest" | "auto-edit" | "full-auto";
}

export interface DelegationResult {
  success: boolean;
  output: string;
  exitCode: number;
}

export interface Delegator {
  name: string;
  isAvailable(): Promise<boolean>;
  execute(prompt: string, config: DelegationConfig): Promise<DelegationResult>;
}
```

### Task 2: Implement Codex Delegator

```typescript
// src/lib/delegators/codex.ts
import { spawn } from "child_process";
import type { Delegator, DelegationConfig, DelegationResult } from "../../types/delegation";

export const codexDelegator: Delegator = {
  name: "codex",
  
  async isAvailable(): Promise<boolean> {
    try {
      const proc = Bun.spawn(["codex", "--version"]);
      await proc.exited;
      return proc.exitCode === 0;
    } catch {
      return false;
    }
  },
  
  async execute(prompt: string, config: DelegationConfig): Promise<DelegationResult> {
    const args = [
      "exec",
      "--model", config.model || "gpt-5",
      "--approval-mode", config.approvalMode || "read-only",
      "--quiet",
    ];
    
    if (config.reasoning) {
      args.push("--reasoning", config.reasoning);
    }
    
    args.push(prompt);
    
    const proc = Bun.spawn(["codex", ...args], {
      stdout: "pipe",
      stderr: "pipe",
    });
    
    const output = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;
    
    return {
      success: exitCode === 0,
      output,
      exitCode,
    };
  },
};
```

### Task 3: Implement Claude Delegator

```typescript
// src/lib/delegators/claude.ts
import type { Delegator, DelegationConfig, DelegationResult } from "../../types/delegation";

export const claudeDelegator: Delegator = {
  name: "claude",
  
  async isAvailable(): Promise<boolean> {
    try {
      const proc = Bun.spawn(["claude", "--version"]);
      await proc.exited;
      return proc.exitCode === 0;
    } catch {
      return false;
    }
  },
  
  async execute(prompt: string, config: DelegationConfig): Promise<DelegationResult> {
    const args = [
      "--print",
      "--model", config.model || "claude-sonnet-4-5-20250929",
    ];
    
    args.push(prompt);
    
    const proc = Bun.spawn(["claude", ...args], {
      stdout: "pipe",
      stderr: "pipe",
    });
    
    const output = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;
    
    return {
      success: exitCode === 0,
      output,
      exitCode,
    };
  },
};
```

### Task 4: Create Delegation Manager

```typescript
// src/lib/delegation.ts
import type { AkConfig } from "../types";
import type { DelegationConfig, DelegationResult, Delegator } from "../types/delegation";
import { codexDelegator } from "./delegators/codex";
import { claudeDelegator } from "./delegators/claude";

const delegators: Record<string, Delegator> = {
  codex: codexDelegator,
  claude: claudeDelegator,
};

export async function delegate(
  skillName: string,
  prompt: string,
  config: AkConfig
): Promise<DelegationResult> {
  // Check for skill-specific override
  const override = config.overrides[skillName];
  const delegationConfig: DelegationConfig = {
    tool: override?.tool || config.defaults.reviewTool,
    model: override?.model || config.defaults.reviewModel,
    reasoning: override?.reasoning || config.defaults.reviewReasoning,
  };

  // If native, return null to indicate skill should execute itself
  if (delegationConfig.tool === "native") {
    return {
      success: true,
      output: "",
      exitCode: 0,
    };
  }

  const delegator = delegators[delegationConfig.tool];
  if (!delegator) {
    throw new Error(`Unknown delegator: ${delegationConfig.tool}`);
  }

  const available = await delegator.isAvailable();
  if (!available) {
    throw new Error(`${delegator.name} is not available. Install it or change delegation config.`);
  }

  return delegator.execute(prompt, delegationConfig);
}
```

### Task 5: Update Skills to Use Delegation

Modify skill implementations to check delegation config and delegate when configured.

### Task 6: Add `ak delegate` Command (Optional)

```typescript
// src/cli/commands/delegate.ts
export async function delegateCommand(args: ParsedArgs): Promise<void> {
  const skillName = args.positional[0];
  if (!skillName) {
    print(format.error("Skill name required"));
    print(`Usage: ${format.command("ak delegate")} <skill> [options]`);
    return;
  }

  const config = loadConfig() || DEFAULT_CONFIG;
  const prompt = args.flags.prompt as string || args.positional.slice(1).join(" ");
  
  try {
    const result = await delegate(skillName, prompt, config);
    if (result.success) {
      print(result.output);
    } else {
      print(format.error("Delegation failed"));
      print(result.output);
      process.exit(result.exitCode);
    }
  } catch (error) {
    print(format.error(error instanceof Error ? error.message : "Unknown error"));
    process.exit(1);
  }
}
```

### Task 7: Tests and Documentation

Add comprehensive tests for delegation system.

---

## Configuration Example

```jsonc
// .ak/config.json
{
  "defaults": {
    "reviewTool": "codex",        // Use Codex by default
    "reviewModel": "gpt-5",
    "reviewReasoning": "high"
  },
  "overrides": {
    "review-code": {
      "tool": "claude",           // But use Claude for code review
      "model": "claude-sonnet-4-5-20250929"
    },
    "review-plan": {
      "tool": "codex",
      "reasoning": "high"
    }
  }
}
```

## Usage Examples

```bash
# Delegate code review to configured tool
ak delegate review-code --mode branch

# Override tool for single invocation
ak delegate review-code --tool codex --mode uncommitted

# Delegate with custom prompt
ak delegate review-plan --prompt "Review for security issues"
```

---

*Plan created using agent-kit skills.*

# Phase 1: CLI Core Implementation Plan

> **For Executor:** Use @implement-plan to execute this plan task-by-task.

**Goal:** Implement the core CLI with help and version commands
**Design Doc:** See README.md for CLI design
**Estimated Tasks:** 6 tasks, ~25 minutes total
**Created:** 2024-12-20
**Author:** Claude

---

## Architecture Overview

The CLI is built using a simple command pattern without heavy dependencies. Each command is a module that exports a handler function. The main entry point parses arguments and routes to the appropriate handler.

## Tech Stack

- Bun - Runtime
- process.argv - Argument parsing (no external deps)
- Chalk-like ANSI codes - Terminal colors (built-in)

---

## Task 1: Create CLI Argument Parser

**Files:**
- Create: `src/cli/parser.ts`
- Test: `tests/cli/parser.test.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/cli/parser.test.ts
import { describe, it, expect } from "bun:test";
import { parseArgs, type ParsedArgs } from "../../src/cli/parser";

describe("CLI Argument Parser", () => {
  it("parses command name", () => {
    const args = parseArgs(["node", "ak", "init"]);
    expect(args.command).toBe("init");
  });

  it("defaults to help when no command", () => {
    const args = parseArgs(["node", "ak"]);
    expect(args.command).toBe("help");
  });

  it("parses flags", () => {
    const args = parseArgs(["node", "ak", "init", "--yes", "--skip-agents-md"]);
    expect(args.flags.yes).toBe(true);
    expect(args.flags["skip-agents-md"]).toBe(true);
  });

  it("parses flag values", () => {
    const args = parseArgs(["node", "ak", "init", "--target", "claude"]);
    expect(args.flags.target).toBe("claude");
  });

  it("parses positional arguments", () => {
    const args = parseArgs(["node", "ak", "help", "init"]);
    expect(args.command).toBe("help");
    expect(args.positional).toEqual(["init"]);
  });

  it("handles --help flag as help command", () => {
    const args = parseArgs(["node", "ak", "--help"]);
    expect(args.command).toBe("help");
  });

  it("handles --version flag as version command", () => {
    const args = parseArgs(["node", "ak", "--version"]);
    expect(args.command).toBe("version");
  });
});
```

**Step 2: Implement the code (GREEN)**

```typescript
// src/cli/parser.ts

export interface ParsedArgs {
  command: string;
  flags: Record<string, string | boolean>;
  positional: string[];
}

export function parseArgs(argv: string[]): ParsedArgs {
  // Skip node and script path
  const args = argv.slice(2);
  
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];
  let command = "help";
  let commandSet = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      command = "help";
      commandSet = true;
      continue;
    }

    if (arg === "--version" || arg === "-v") {
      command = "version";
      commandSet = true;
      continue;
    }

    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      
      // Check if next arg is a value (not a flag)
      if (nextArg && !nextArg.startsWith("-")) {
        flags[key] = nextArg;
        i++; // Skip the value
      } else {
        flags[key] = true;
      }
      continue;
    }

    if (arg.startsWith("-")) {
      // Short flag
      const key = arg.slice(1);
      flags[key] = true;
      continue;
    }

    // First non-flag is the command
    if (!commandSet) {
      command = arg;
      commandSet = true;
    } else {
      positional.push(arg);
    }
  }

  return { command, flags, positional };
}
```

**Step 3: Verify**

```bash
bun test tests/cli/parser.test.ts
# Expected: 7 tests passing
```

**Commit:** `feat(cli): add argument parser`

---

## Task 2: Create Terminal Output Utilities

**Files:**
- Create: `src/cli/output.ts`
- Test: `tests/cli/output.test.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/cli/output.test.ts
import { describe, it, expect } from "bun:test";
import { colors, format, symbols } from "../../src/cli/output";

describe("Terminal Output", () => {
  it("has color functions", () => {
    expect(colors.green("text")).toContain("text");
    expect(colors.red("text")).toContain("text");
    expect(colors.yellow("text")).toContain("text");
    expect(colors.blue("text")).toContain("text");
    expect(colors.dim("text")).toContain("text");
    expect(colors.bold("text")).toContain("text");
  });

  it("has symbols", () => {
    expect(symbols.check).toBeDefined();
    expect(symbols.cross).toBeDefined();
    expect(symbols.warning).toBeDefined();
    expect(symbols.info).toBeDefined();
  });

  it("formats success message", () => {
    const msg = format.success("Done");
    expect(msg).toContain("Done");
  });

  it("formats error message", () => {
    const msg = format.error("Failed");
    expect(msg).toContain("Failed");
  });
});
```

**Step 2: Implement the code (GREEN)**

```typescript
// src/cli/output.ts

// ANSI escape codes
const ESC = "\x1b[";
const RESET = `${ESC}0m`;

export const colors = {
  green: (text: string) => `${ESC}32m${text}${RESET}`,
  red: (text: string) => `${ESC}31m${text}${RESET}`,
  yellow: (text: string) => `${ESC}33m${text}${RESET}`,
  blue: (text: string) => `${ESC}34m${text}${RESET}`,
  cyan: (text: string) => `${ESC}36m${text}${RESET}`,
  dim: (text: string) => `${ESC}2m${text}${RESET}`,
  bold: (text: string) => `${ESC}1m${text}${RESET}`,
};

export const symbols = {
  check: colors.green("✓"),
  cross: colors.red("✗"),
  warning: colors.yellow("⚠"),
  info: colors.blue("ℹ"),
  arrow: colors.cyan("→"),
};

export const format = {
  success: (message: string) => `${symbols.check} ${message}`,
  error: (message: string) => `${symbols.cross} ${colors.red(message)}`,
  warning: (message: string) => `${symbols.warning} ${colors.yellow(message)}`,
  info: (message: string) => `${symbols.info} ${message}`,
  title: (text: string) => colors.bold(colors.cyan(text)),
  command: (text: string) => colors.cyan(text),
  flag: (text: string) => colors.yellow(text),
};

export function print(...args: unknown[]): void {
  console.log(...args);
}

export function printError(...args: unknown[]): void {
  console.error(...args);
}

export function printBox(title: string, lines: string[]): void {
  const width = Math.max(title.length, ...lines.map(l => l.length)) + 4;
  const hr = "─".repeat(width);
  
  print(`╭${hr}╮`);
  print(`│  ${colors.bold(title)}${" ".repeat(width - title.length - 2)}│`);
  print(`├${hr}┤`);
  for (const line of lines) {
    print(`│  ${line}${" ".repeat(width - line.length - 2)}│`);
  }
  print(`╰${hr}╯`);
}
```

**Step 3: Verify**

```bash
bun test tests/cli/output.test.ts
# Expected: 4 tests passing
```

**Commit:** `feat(cli): add terminal output utilities`

---

## Task 3: Create Version Command

**Files:**
- Create: `src/cli/commands/version.ts`
- Test: `tests/cli/commands/version.test.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/cli/commands/version.test.ts
import { describe, it, expect, spyOn } from "bun:test";
import { versionCommand } from "../../../src/cli/commands/version";

describe("Version Command", () => {
  it("outputs version string", () => {
    const logs: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args) => {
      logs.push(args.join(" "));
    });

    versionCommand();

    expect(logs.some(log => log.includes("agent-kit"))).toBe(true);
    expect(logs.some(log => /\d+\.\d+\.\d+/.test(log))).toBe(true);

    spy.mockRestore();
  });
});
```

**Step 2: Implement the code (GREEN)**

```typescript
// src/cli/commands/version.ts
import { print } from "../output";
import pkg from "../../../package.json";

export function versionCommand(): void {
  print(`agent-kit v${pkg.version}`);
}
```

**Step 3: Verify**

```bash
bun test tests/cli/commands/version.test.ts
# Expected: 1 test passing
```

**Commit:** `feat(cli): add version command`

---

## Task 4: Create Help Command

**Files:**
- Create: `src/cli/commands/help.ts`
- Test: `tests/cli/commands/help.test.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/cli/commands/help.test.ts
import { describe, it, expect, spyOn } from "bun:test";
import { helpCommand } from "../../../src/cli/commands/help";

describe("Help Command", () => {
  it("shows general help when no topic", () => {
    const logs: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args) => {
      logs.push(args.join(" "));
    });

    helpCommand([]);

    const output = logs.join("\n");
    expect(output).toContain("agent-kit");
    expect(output).toContain("init");
    expect(output).toContain("update");
    expect(output).toContain("doctor");
    expect(output).toContain("help");
    expect(output).toContain("version");

    spy.mockRestore();
  });

  it("shows command-specific help", () => {
    const logs: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args) => {
      logs.push(args.join(" "));
    });

    helpCommand(["init"]);

    const output = logs.join("\n");
    expect(output).toContain("init");
    expect(output).toContain("--yes");

    spy.mockRestore();
  });

  it("shows skills list with 'skills' topic", () => {
    const logs: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args) => {
      logs.push(args.join(" "));
    });

    helpCommand(["skills"]);

    const output = logs.join("\n");
    expect(output).toContain("brainstorm");
    expect(output).toContain("create-plan");

    spy.mockRestore();
  });
});
```

**Step 2: Implement the code (GREEN)**

```typescript
// src/cli/commands/help.ts
import { print, colors, format } from "../output";
import pkg from "../../../package.json";

const COMMANDS = {
  init: {
    description: "Initialize agent-kit in your project",
    flags: {
      "--yes, -y": "Accept all defaults",
      "--skip-agents-md": "Don't create AGENTS.md",
      "--claude-only": "Only set up Claude Code",
      "--copilot-only": "Only set up GitHub Copilot",
    },
  },
  update: {
    description: "Update to the latest version",
    flags: {
      "--skills-only": "Only update skills",
      "--cli-only": "Only update CLI",
      "--check": "Check for updates without installing",
    },
  },
  doctor: {
    description: "Diagnose installation health",
    flags: {},
  },
  help: {
    description: "Show help information",
    flags: {},
  },
  version: {
    description: "Show version",
    flags: {},
  },
};

const SKILLS = [
  { name: "brainstorm", desc: "Interactive ideation with structured questioning" },
  { name: "create-plan", desc: "Create detailed TDD implementation plans" },
  { name: "create-adr", desc: "Generate Architectural Decision Records" },
  { name: "implement-plan", desc: "Autonomous plan execution with reviews" },
  { name: "review-plan", desc: "Review plans before execution" },
  { name: "review-code", desc: "Review code changes with high reasoning" },
  { name: "doc-contents", desc: "Generate project documentation" },
];

export function helpCommand(args: string[]): void {
  const topic = args[0];

  if (!topic) {
    showGeneralHelp();
    return;
  }

  if (topic === "skills") {
    showSkillsList();
    return;
  }

  if (topic in COMMANDS) {
    showCommandHelp(topic as keyof typeof COMMANDS);
    return;
  }

  print(format.error(`Unknown topic: ${topic}`));
  print(`Run ${format.command("ak help")} for general help`);
}

function showGeneralHelp(): void {
  print();
  print(format.title(`agent-kit v${pkg.version}`));
  print(colors.dim("CLI for managing AI coding agent configurations"));
  print();
  print(colors.bold("Usage:"));
  print(`  ${format.command("ak")} ${colors.dim("<command>")} ${colors.dim("[options]")}`);
  print();
  print(colors.bold("Commands:"));
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    print(`  ${format.command(name.padEnd(12))} ${cmd.description}`);
  }
  print();
  print(colors.bold("Examples:"));
  print(`  ${colors.dim("$")} ak init                 ${colors.dim("# Initialize with defaults")}`);
  print(`  ${colors.dim("$")} ak init --yes           ${colors.dim("# Skip prompts")}`);
  print(`  ${colors.dim("$")} ak doctor               ${colors.dim("# Check installation")}`);
  print(`  ${colors.dim("$")} ak help init            ${colors.dim("# Help for init command")}`);
  print(`  ${colors.dim("$")} ak help skills          ${colors.dim("# List available skills")}`);
  print();
}

function showCommandHelp(command: keyof typeof COMMANDS): void {
  const cmd = COMMANDS[command];
  print();
  print(format.title(`ak ${command}`));
  print(cmd.description);
  print();
  
  print(colors.bold("Usage:"));
  print(`  ${format.command("ak")} ${command} ${colors.dim("[options]")}`);
  print();

  const flags = Object.entries(cmd.flags);
  if (flags.length > 0) {
    print(colors.bold("Options:"));
    for (const [flag, desc] of flags) {
      print(`  ${format.flag(flag.padEnd(20))} ${desc}`);
    }
    print();
  }
}

function showSkillsList(): void {
  print();
  print(format.title("Available Skills"));
  print();
  for (const skill of SKILLS) {
    print(`  ${format.command(skill.name.padEnd(16))} ${skill.desc}`);
  }
  print();
  print(colors.dim("Skills are automatically invoked by AI agents when relevant."));
  print();
}
```

**Step 3: Verify**

```bash
bun test tests/cli/commands/help.test.ts
# Expected: 3 tests passing
```

**Commit:** `feat(cli): add help command`

---

## Task 5: Create Command Router

**Files:**
- Create: `src/cli/router.ts`
- Test: `tests/cli/router.test.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/cli/router.test.ts
import { describe, it, expect, spyOn, mock } from "bun:test";
import { route } from "../../src/cli/router";
import type { ParsedArgs } from "../../src/cli/parser";

describe("Command Router", () => {
  it("routes to help command", async () => {
    const logs: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args) => {
      logs.push(args.join(" "));
    });

    const args: ParsedArgs = { command: "help", flags: {}, positional: [] };
    await route(args);

    expect(logs.some(log => log.includes("agent-kit"))).toBe(true);
    spy.mockRestore();
  });

  it("routes to version command", async () => {
    const logs: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args) => {
      logs.push(args.join(" "));
    });

    const args: ParsedArgs = { command: "version", flags: {}, positional: [] };
    await route(args);

    expect(logs.some(log => /\d+\.\d+\.\d+/.test(log))).toBe(true);
    spy.mockRestore();
  });

  it("shows error for unknown command", async () => {
    const errors: string[] = [];
    const spy = spyOn(console, "error").mockImplementation((...args) => {
      errors.push(args.join(" "));
    });

    const args: ParsedArgs = { command: "unknown", flags: {}, positional: [] };
    await route(args);

    expect(errors.some(log => log.includes("unknown"))).toBe(true);
    spy.mockRestore();
  });
});
```

**Step 2: Implement the code (GREEN)**

```typescript
// src/cli/router.ts
import type { ParsedArgs } from "./parser";
import { helpCommand } from "./commands/help";
import { versionCommand } from "./commands/version";
import { printError, format } from "./output";

type CommandHandler = (args: ParsedArgs) => Promise<void> | void;

const commands: Record<string, CommandHandler> = {
  help: (args) => helpCommand(args.positional),
  version: () => versionCommand(),
  // Placeholders for future commands
  init: async () => {
    printError(format.warning("init command not yet implemented"));
  },
  update: async () => {
    printError(format.warning("update command not yet implemented"));
  },
  doctor: async () => {
    printError(format.warning("doctor command not yet implemented"));
  },
};

export async function route(args: ParsedArgs): Promise<void> {
  const handler = commands[args.command];

  if (!handler) {
    printError(format.error(`Unknown command: ${args.command}`));
    printError(`Run ${format.command("ak help")} for usage information`);
    process.exit(1);
  }

  try {
    await handler(args);
  } catch (error) {
    printError(format.error(`Command failed: ${args.command}`));
    if (error instanceof Error) {
      printError(error.message);
    }
    process.exit(1);
  }
}
```

**Step 3: Verify**

```bash
bun test tests/cli/router.test.ts
# Expected: 3 tests passing
```

**Commit:** `feat(cli): add command router`

---

## Task 6: Wire Up CLI Entry Point

**Files:**
- Modify: `src/cli/index.ts`
- Test: `tests/cli/index.test.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/cli/index.test.ts
import { describe, it, expect } from "bun:test";
import { execSync } from "child_process";

describe("CLI Entry Point", () => {
  it("runs with --version flag", () => {
    const output = execSync("bun run src/cli/index.ts --version", {
      encoding: "utf-8",
    });
    expect(output).toContain("agent-kit");
    expect(output).toMatch(/\d+\.\d+\.\d+/);
  });

  it("runs with help command", () => {
    const output = execSync("bun run src/cli/index.ts help", {
      encoding: "utf-8",
    });
    expect(output).toContain("agent-kit");
    expect(output).toContain("init");
  });

  it("shows help when no args", () => {
    const output = execSync("bun run src/cli/index.ts", {
      encoding: "utf-8",
    });
    expect(output).toContain("Usage:");
  });
});
```

**Step 2: Implement the code (GREEN)**

```typescript
// src/cli/index.ts
#!/usr/bin/env bun

/**
 * agent-kit CLI
 * 
 * Usage:
 *   ak <command> [options]
 * 
 * Commands:
 *   init      Initialize agent-kit in your project
 *   update    Update to the latest version
 *   doctor    Diagnose installation health
 *   help      Show help information
 *   version   Show version
 */

import { parseArgs } from "./parser";
import { route } from "./router";

async function main() {
  const args = parseArgs(process.argv);
  await route(args);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

**Step 3: Verify**

```bash
bun test tests/cli/index.test.ts
# Expected: 3 tests passing

# Also test manually
bun run src/cli/index.ts --version
bun run src/cli/index.ts help
bun run src/cli/index.ts help init
```

**Commit:** `feat(cli): wire up CLI entry point`

---

## Integration Verification

After all tasks complete:

```bash
# Run all tests
bun test
# Expected: All tests pass

# Type check
bun run typecheck
# Expected: No errors

# Test CLI directly
bun run src/cli/index.ts --version
bun run src/cli/index.ts help
bun run src/cli/index.ts help skills
```

## Rollback Plan

If issues arise:

```bash
git log --oneline -10
git revert HEAD~N  # Where N is number of commits
```

---

*Plan created using agent-kit skills. See [standards/plan-format.md](../standards/plan-format.md) for format guidelines.*

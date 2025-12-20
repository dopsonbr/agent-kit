# Phase 0: Bootstrap Implementation Plan

> **For Executor:** Use @implement-plan to execute this plan task-by-task.

**Goal:** Set up the project structure, tooling, and migrate content from agent-tool-kit
**Design Doc:** N/A - foundational setup
**Estimated Tasks:** 8 tasks, ~30 minutes total
**Created:** 2024-12-20
**Author:** Claude

---

## Architecture Overview

This phase establishes the Bun-based project structure, configures TypeScript, sets up testing, and migrates the skill content from the previous agent-tool-kit design into the new structure.

## Tech Stack

- Bun 1.0+ - Runtime and package manager
- TypeScript 5.x - Type safety
- bun:test - Built-in testing
- ESLint + Prettier - Code quality

---

## Task 1: Initialize Bun Project

**Files:**
- Create: `package.json`
- Create: `bunfig.toml`
- Create: `tsconfig.json`

**Step 1: Write the failing test (RED)**

```typescript
// tests/setup.test.ts
import { describe, it, expect } from "bun:test";
import { existsSync } from "fs";

describe("Project Setup", () => {
  it("has package.json with correct name", async () => {
    const pkg = await import("../package.json");
    expect(pkg.name).toBe("agent-kit");
  });

  it("has bun as runtime", () => {
    expect(existsSync("bunfig.toml")).toBe(true);
  });

  it("has TypeScript configured", () => {
    expect(existsSync("tsconfig.json")).toBe(true);
  });
});
```

**Step 2: Implement the code (GREEN)**

```json
// package.json
{
  "name": "agent-kit",
  "version": "0.1.0",
  "description": "CLI for managing AI coding agent configurations",
  "type": "module",
  "bin": {
    "ak": "./dist/cli/index.js"
  },
  "scripts": {
    "dev": "bun run --watch src/cli/index.ts",
    "build": "bun build src/cli/index.ts --outdir dist/cli --target node",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "lint": "eslint src tests",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit"
  },
  "keywords": ["cli", "ai", "agents", "claude", "copilot", "skills"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

```toml
# bunfig.toml
[install]
peer = false

[test]
coverage = true
coverageDir = "./coverage"
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "lib": ["ESNext"],
    "types": ["bun-types"],
    "paths": {
      "@/*": ["./src/*"]
    },
    "baseUrl": "."
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Verify**

```bash
bun install
bun test tests/setup.test.ts
# Expected: 3 tests passing
```

**Commit:** `chore: initialize bun project with TypeScript`

---

## Task 2: Create Source Directory Structure

**Files:**
- Create: `src/cli/index.ts`
- Create: `src/lib/index.ts`
- Create: `src/types/index.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/structure.test.ts
import { describe, it, expect } from "bun:test";
import { existsSync } from "fs";

describe("Source Structure", () => {
  it("has CLI entry point", () => {
    expect(existsSync("src/cli/index.ts")).toBe(true);
  });

  it("has lib directory", () => {
    expect(existsSync("src/lib/index.ts")).toBe(true);
  });

  it("has types directory", () => {
    expect(existsSync("src/types/index.ts")).toBe(true);
  });
});
```

**Step 2: Implement the code (GREEN)**

```typescript
// src/cli/index.ts
#!/usr/bin/env bun

/**
 * agent-kit CLI entry point
 * Run with: bun run src/cli/index.ts
 */

export const VERSION = "0.1.0";
export const NAME = "agent-kit";

async function main() {
  console.log(`${NAME} v${VERSION}`);
}

main().catch(console.error);
```

```typescript
// src/lib/index.ts
/**
 * Core library exports
 */

export * from "./config";
export * from "./fetcher";
export * from "./installer";
export * from "./generator";
```

```typescript
// src/types/index.ts
/**
 * Shared type definitions
 */

export interface AkConfig {
  version: string;
  source: {
    repo: string;
    branch: string;
    path: string;
  };
  targets: {
    claude: boolean;
    copilot: boolean;
    agentsMd: boolean;
  };
  defaults: {
    reviewTool: "codex" | "claude";
    reviewModel: string;
    reviewReasoning: "low" | "medium" | "high";
    planExecutionMode: "autonomous" | "checkpoint" | "manual";
    checkpointInterval: number;
  };
  overrides: Record<string, SkillOverride>;
  exclude: string[];
  include: string[];
}

export interface SkillOverride {
  tool?: "codex" | "claude";
  model?: string;
  reasoning?: "low" | "medium" | "high";
}

export interface Skill {
  name: string;
  description: string;
  license?: string;
  metadata?: Record<string, unknown>;
  content: string;
}

export interface Command {
  name: string;
  description: string;
  arguments?: CommandArgument[];
  content: string;
}

export interface CommandArgument {
  name: string;
  description: string;
  required: boolean;
}
```

**Step 3: Verify**

```bash
bun test tests/structure.test.ts
# Expected: 3 tests passing
```

**Commit:** `chore: create source directory structure`

---

## Task 3: Create Placeholder Library Modules

**Files:**
- Create: `src/lib/config.ts`
- Create: `src/lib/fetcher.ts`
- Create: `src/lib/installer.ts`
- Create: `src/lib/generator.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/lib/modules.test.ts
import { describe, it, expect } from "bun:test";

describe("Library Modules", () => {
  it("exports config module", async () => {
    const mod = await import("../../src/lib/config");
    expect(mod.loadConfig).toBeDefined();
    expect(mod.saveConfig).toBeDefined();
  });

  it("exports fetcher module", async () => {
    const mod = await import("../../src/lib/fetcher");
    expect(mod.fetchContent).toBeDefined();
  });

  it("exports installer module", async () => {
    const mod = await import("../../src/lib/installer");
    expect(mod.installSkills).toBeDefined();
  });

  it("exports generator module", async () => {
    const mod = await import("../../src/lib/generator");
    expect(mod.generateAgentsMd).toBeDefined();
  });
});
```

**Step 2: Implement the code (GREEN)**

```typescript
// src/lib/config.ts
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import type { AkConfig } from "../types";

const CONFIG_DIR = ".ak";
const CONFIG_FILE = "config.json";

export const DEFAULT_CONFIG: AkConfig = {
  version: "1.0.0",
  source: {
    repo: "github:YOUR_ORG/agent-kit",
    branch: "main",
    path: "content",
  },
  targets: {
    claude: true,
    copilot: true,
    agentsMd: true,
  },
  defaults: {
    reviewTool: "codex",
    reviewModel: "gpt-5",
    reviewReasoning: "high",
    planExecutionMode: "autonomous",
    checkpointInterval: 5,
  },
  overrides: {},
  exclude: [],
  include: [],
};

export function getConfigPath(cwd: string = process.cwd()): string {
  return join(cwd, CONFIG_DIR, CONFIG_FILE);
}

export function loadConfig(cwd: string = process.cwd()): AkConfig | null {
  const configPath = getConfigPath(cwd);
  if (!existsSync(configPath)) {
    return null;
  }
  const content = readFileSync(configPath, "utf-8");
  return JSON.parse(content) as AkConfig;
}

export function saveConfig(config: AkConfig, cwd: string = process.cwd()): void {
  const configPath = getConfigPath(cwd);
  const dir = dirname(configPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}
```

```typescript
// src/lib/fetcher.ts
import type { Skill, Command } from "../types";

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com";

export interface FetchOptions {
  repo: string;
  branch: string;
  path: string;
}

export async function fetchContent(options: FetchOptions): Promise<{
  skills: Skill[];
  commands: Command[];
}> {
  // Placeholder - will be implemented in Phase 2
  console.log("Fetching from:", options);
  return { skills: [], commands: [] };
}

export async function fetchFile(
  repo: string,
  branch: string,
  path: string
): Promise<string> {
  // Convert github:org/repo to raw URL
  const [, orgRepo] = repo.split("github:");
  const url = `${GITHUB_RAW_BASE}/${orgRepo}/${branch}/${path}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.text();
}
```

```typescript
// src/lib/installer.ts
import { mkdirSync, writeFileSync, symlinkSync, existsSync } from "fs";
import { join, dirname } from "path";
import type { Skill, Command, AkConfig } from "../types";

export interface InstallOptions {
  cwd: string;
  config: AkConfig;
  skills: Skill[];
  commands: Command[];
}

export async function installSkills(options: InstallOptions): Promise<void> {
  const { cwd, config, skills, commands } = options;

  // Create directories
  const dirs = [
    ".github/skills",
    ".claude/skills",
    ".claude/commands",
    "docs/ideas",
    "docs/plans",
    "docs/adrs",
  ];

  for (const dir of dirs) {
    const fullPath = join(cwd, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }

  // Install skills to .github/skills (canonical location)
  for (const skill of skills) {
    if (config.targets.copilot) {
      const skillDir = join(cwd, ".github/skills", skill.name);
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(join(skillDir, "SKILL.md"), skill.content);
    }
  }

  // Symlink to .claude/skills if Claude target enabled
  if (config.targets.claude) {
    // Create symlinks from .claude/skills to .github/skills
    for (const skill of skills) {
      const source = join(cwd, ".github/skills", skill.name);
      const target = join(cwd, ".claude/skills", skill.name);
      if (existsSync(source) && !existsSync(target)) {
        symlinkSync(source, target);
      }
    }
  }

  // Install commands
  if (config.targets.claude) {
    for (const command of commands) {
      const commandPath = join(cwd, ".claude/commands", `${command.name}.md`);
      writeFileSync(commandPath, command.content);
    }
  }
}

export function createClaudeSettings(cwd: string, config: AkConfig): void {
  const settingsPath = join(cwd, ".claude/settings.json");
  const settings = {
    "agent-kit": {
      version: config.version,
      installed: true,
    },
    "implement-plan": {
      mode: config.defaults.planExecutionMode,
      checkpointInterval: config.defaults.checkpointInterval,
      reviewTool: config.defaults.reviewTool,
      reviewModel: config.defaults.reviewModel,
      reviewReasoning: config.defaults.reviewReasoning,
    },
    "review-code": {
      tool: config.defaults.reviewTool,
      model: config.defaults.reviewModel,
      reasoning: config.defaults.reviewReasoning,
    },
  };
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}
```

```typescript
// src/lib/generator.ts
import { writeFileSync } from "fs";
import { join } from "path";
import type { Skill, AkConfig } from "../types";

export function generateAgentsMd(
  cwd: string,
  config: AkConfig,
  skills: Skill[]
): void {
  const lines: string[] = [
    "# AGENTS.md",
    "",
    "This project uses [agent-kit](https://github.com/YOUR_ORG/agent-kit) for AI agent configuration.",
    "",
    "## Available Skills",
    "",
    "The following skills are available to AI agents:",
    "",
  ];

  for (const skill of skills) {
    lines.push(`- **${skill.name}**: ${skill.description}`);
  }

  lines.push("");
  lines.push("## Project Structure");
  lines.push("");
  lines.push("```");
  lines.push("docs/");
  lines.push("├── ideas/     # Brainstorm outputs");
  lines.push("├── plans/     # Implementation plans");
  lines.push("└── adrs/      # Architectural Decision Records");
  lines.push("```");
  lines.push("");
  lines.push("## Commands");
  lines.push("");
  lines.push("Use `/help` in Claude Code to see available commands.");
  lines.push("");

  const content = lines.join("\n");
  writeFileSync(join(cwd, "AGENTS.md"), content);
}
```

**Step 3: Verify**

```bash
bun test tests/lib/modules.test.ts
# Expected: 4 tests passing
```

**Commit:** `feat(lib): add placeholder library modules`

---

## Task 4: Create Content Directory Structure

**Files:**
- Create: `content/skills/.gitkeep`
- Create: `content/commands/.gitkeep`
- Create: `content/standards/.gitkeep`
- Create: `content/templates/.gitkeep`

**Step 1: Write the failing test (RED)**

```typescript
// tests/content.test.ts
import { describe, it, expect } from "bun:test";
import { existsSync } from "fs";

describe("Content Structure", () => {
  it("has skills directory", () => {
    expect(existsSync("content/skills")).toBe(true);
  });

  it("has commands directory", () => {
    expect(existsSync("content/commands")).toBe(true);
  });

  it("has standards directory", () => {
    expect(existsSync("content/standards")).toBe(true);
  });

  it("has templates directory", () => {
    expect(existsSync("content/templates")).toBe(true);
  });
});
```

**Step 2: Implement the code (GREEN)**

```bash
mkdir -p content/skills content/commands content/standards content/templates
touch content/skills/.gitkeep
touch content/commands/.gitkeep
touch content/standards/.gitkeep
touch content/templates/.gitkeep
```

**Step 3: Verify**

```bash
bun test tests/content.test.ts
# Expected: 4 tests passing
```

**Commit:** `chore: create content directory structure`

---

## Task 5: Migrate Skills from Previous Design

**Files:**
- Create: `content/skills/brainstorm/SKILL.md`
- Create: `content/skills/create-plan/SKILL.md`
- Create: `content/skills/create-adr/SKILL.md`
- Create: `content/skills/implement-plan/SKILL.md`
- Create: `content/skills/review-plan/SKILL.md`
- Create: `content/skills/review-code/SKILL.md`
- Create: `content/skills/doc-contents/SKILL.md`

**Step 1: Write the failing test (RED)**

```typescript
// tests/content/skills.test.ts
import { describe, it, expect } from "bun:test";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const SKILL_NAMES = [
  "brainstorm",
  "create-plan",
  "create-adr",
  "implement-plan",
  "review-plan",
  "review-code",
  "doc-contents",
];

describe("Skills Content", () => {
  for (const skill of SKILL_NAMES) {
    it(`has ${skill} skill`, () => {
      const path = join("content/skills", skill, "SKILL.md");
      expect(existsSync(path)).toBe(true);
    });

    it(`${skill} skill has valid frontmatter`, () => {
      const path = join("content/skills", skill, "SKILL.md");
      const content = readFileSync(path, "utf-8");
      expect(content.startsWith("---")).toBe(true);
      expect(content).toContain("name:");
      expect(content).toContain("description:");
    });
  }
});
```

**Step 2: Implement the code (GREEN)**

Migrate each SKILL.md from the previous design, updating frontmatter to match Agent Skills spec.

Example (brainstorm):
```markdown
---
name: brainstorm
description: Interactive ideation and exploration. Use when creating, developing, or exploring ideas before writing code or plans.
license: MIT
metadata:
  author: agent-kit
  version: "1.0.0"
---

# Brainstorm

Turn rough ideas into fully-formed designs through natural, collaborative dialogue.

[... rest of skill content ...]
```

**Step 3: Verify**

```bash
bun test tests/content/skills.test.ts
# Expected: 14 tests passing (2 per skill)
```

**Commit:** `feat(content): migrate skills from previous design`

---

## Task 6: Migrate Commands

**Files:**
- Create: `content/commands/brainstorm.md`
- Create: `content/commands/create-plan.md`
- Create: `content/commands/create-adr.md`
- Create: `content/commands/implement-plan.md`
- Create: `content/commands/review-plan.md`
- Create: `content/commands/review-code.md`
- Create: `content/commands/doc-contents.md`

**Step 1: Write the failing test (RED)**

```typescript
// tests/content/commands.test.ts
import { describe, it, expect } from "bun:test";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const COMMAND_NAMES = [
  "brainstorm",
  "create-plan",
  "create-adr",
  "implement-plan",
  "review-plan",
  "review-code",
  "doc-contents",
];

describe("Commands Content", () => {
  for (const cmd of COMMAND_NAMES) {
    it(`has ${cmd} command`, () => {
      const path = join("content/commands", `${cmd}.md`);
      expect(existsSync(path)).toBe(true);
    });

    it(`${cmd} command has frontmatter`, () => {
      const path = join("content/commands", `${cmd}.md`);
      const content = readFileSync(path, "utf-8");
      expect(content.startsWith("---")).toBe(true);
      expect(content).toContain("description:");
    });
  }
});
```

**Step 2: Implement the code (GREEN)**

Example (brainstorm.md):
```markdown
---
description: Start an interactive brainstorming session to explore and refine ideas
---

Use and follow the brainstorm skill exactly as written in @skills/brainstorm/SKILL.md
```

**Step 3: Verify**

```bash
bun test tests/content/commands.test.ts
# Expected: 14 tests passing (2 per command)
```

**Commit:** `feat(content): add command definitions`

---

## Task 7: Migrate Standards and Templates

**Files:**
- Create: `content/standards/adr-format.md`
- Create: `content/standards/plan-format.md`
- Create: `content/standards/code-review.md`
- Create: `content/templates/adr-template.md`
- Create: `content/templates/plan-template.md`
- Create: `content/templates/review-template.md`

**Step 1: Write the failing test (RED)**

```typescript
// tests/content/standards-templates.test.ts
import { describe, it, expect } from "bun:test";
import { existsSync } from "fs";
import { join } from "path";

describe("Standards", () => {
  const standards = ["adr-format", "plan-format", "code-review"];
  for (const std of standards) {
    it(`has ${std} standard`, () => {
      expect(existsSync(join("content/standards", `${std}.md`))).toBe(true);
    });
  }
});

describe("Templates", () => {
  const templates = ["adr-template", "plan-template", "review-template"];
  for (const tmpl of templates) {
    it(`has ${tmpl} template`, () => {
      expect(existsSync(join("content/templates", `${tmpl}.md`))).toBe(true);
    });
  }
});
```

**Step 2: Implement the code (GREEN)**

Migrate content from previous design.

**Step 3: Verify**

```bash
bun test tests/content/standards-templates.test.ts
# Expected: 6 tests passing
```

**Commit:** `feat(content): add standards and templates`

---

## Task 8: Set Up Self-Hosting (Dogfooding)

**Files:**
- Create: `AGENTS.md`
- Create: `.claude/settings.json`
- Create: `.github/skills` (symlink to content/skills)

**Step 1: Write the failing test (RED)**

```typescript
// tests/dogfood.test.ts
import { describe, it, expect } from "bun:test";
import { existsSync, lstatSync } from "fs";

describe("Self-Hosting Setup", () => {
  it("has AGENTS.md for this project", () => {
    expect(existsSync("AGENTS.md")).toBe(true);
  });

  it("has .claude/settings.json", () => {
    expect(existsSync(".claude/settings.json")).toBe(true);
  });

  it("has .github/skills linked to content", () => {
    expect(existsSync(".github/skills")).toBe(true);
  });
});
```

**Step 2: Implement the code (GREEN)**

```markdown
<!-- AGENTS.md -->
# AGENTS.md

This is agent-kit - a CLI for managing AI coding agent configurations.

## Development

This project uses its own skills for development (dogfooding).

## Build Commands

- `bun install` - Install dependencies
- `bun test` - Run tests
- `bun run build` - Build CLI
- `bun run dev` - Development mode

## Code Style

- TypeScript strict mode
- ESLint + Prettier
- Conventional commits

## Available Skills

See `content/skills/` for available skills. Use them for development:

- `/brainstorm` - Explore new features
- `/create-plan` - Plan implementation
- `/implement-plan` - Execute plans
- `/review-code` - Review changes

## Testing

All code must have tests. Follow TDD:
1. Write failing test
2. Implement code
3. Verify tests pass
```

```json
// .claude/settings.json
{
  "agent-kit": {
    "version": "0.1.0",
    "installed": true,
    "dogfooding": true
  }
}
```

**Step 3: Verify**

```bash
bun test tests/dogfood.test.ts
# Expected: 3 tests passing
```

**Commit:** `chore: set up self-hosting for development`

---

## Integration Verification

After all tasks complete:

```bash
bun test
# Expected: All tests pass

bun run typecheck
# Expected: No type errors

bun run build
# Expected: Build succeeds
```

## Rollback Plan

If issues arise:

1. This is the initial setup, rollback = start over
2. Git history allows reverting any task

---

*Plan created using agent-kit skills. See [standards/plan-format.md](../standards/plan-format.md) for format guidelines.*

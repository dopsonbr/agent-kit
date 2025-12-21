# Phase 2: Init Command Implementation Plan

> **For Executor:** Use @implement-plan to execute this plan task-by-task.

**Goal:** Implement `ak init` command that initializes agent-kit in a project
**Design Doc:** See README.md
**Estimated Tasks:** 8 tasks, ~40 minutes total
**Created:** 2024-12-20
**Author:** Claude

---

## Architecture Overview

The init command fetches content from the GitHub repository, installs skills and commands locally, generates configuration files, and creates the AGENTS.md file. It supports multiple targets (Claude, Copilot) and allows customization via flags.

## Tech Stack

- Bun fetch - HTTP requests
- Bun fs - File system operations
- GitHub Raw API - Content fetching

---

## Task 1: Implement GitHub Content Fetcher

**Files:**
- Modify: `src/lib/fetcher.ts`
- Test: `tests/lib/fetcher.test.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/lib/fetcher.test.ts
import { describe, it, expect, mock } from "bun:test";
import { fetchSkillList, parseSkillMd, fetchSkill } from "../../src/lib/fetcher";

describe("GitHub Fetcher", () => {
  it("parses skill frontmatter", () => {
    const content = `---
name: test-skill
description: A test skill
license: MIT
metadata:
  author: test
  version: "1.0.0"
---

# Test Skill

Content here...`;

    const skill = parseSkillMd(content);
    expect(skill.name).toBe("test-skill");
    expect(skill.description).toBe("A test skill");
    expect(skill.license).toBe("MIT");
    expect(skill.content).toContain("# Test Skill");
  });

  it("handles missing optional fields", () => {
    const content = `---
name: minimal-skill
description: Minimal
---

Content`;

    const skill = parseSkillMd(content);
    expect(skill.name).toBe("minimal-skill");
    expect(skill.license).toBeUndefined();
  });
});
```

**Step 2: Implement the code (GREEN)**

```typescript
// src/lib/fetcher.ts
import type { Skill, Command } from "../types";
import { parse as parseYaml } from "yaml"; // or simple regex parsing

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com";
const GITHUB_API_BASE = "https://api.github.com";

export interface FetchOptions {
  repo: string;
  branch: string;
  path: string;
}

export function parseSkillMd(content: string): Skill {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    throw new Error("Invalid SKILL.md: missing frontmatter");
  }

  const [, yaml, body] = frontmatterMatch;
  
  // Simple YAML parsing (key: value format)
  const frontmatter: Record<string, unknown> = {};
  for (const line of yaml.split("\n")) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      let value: unknown = match[2].trim();
      // Handle quoted strings
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      frontmatter[match[1]] = value;
    }
  }

  return {
    name: frontmatter.name as string,
    description: frontmatter.description as string,
    license: frontmatter.license as string | undefined,
    metadata: frontmatter.metadata as Record<string, unknown> | undefined,
    content: content, // Include full content
  };
}

export async function fetchFile(
  repo: string,
  branch: string,
  path: string
): Promise<string> {
  // Convert github:org/repo to raw URL
  const orgRepo = repo.replace("github:", "");
  const url = `${GITHUB_RAW_BASE}/${orgRepo}/${branch}/${path}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.text();
}

export async function fetchSkillList(options: FetchOptions): Promise<string[]> {
  const orgRepo = options.repo.replace("github:", "");
  const url = `${GITHUB_API_BASE}/repos/${orgRepo}/contents/${options.path}/skills?ref=${options.branch}`;
  
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "agent-kit",
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch skill list: ${response.statusText}`);
  }
  
  const items = await response.json() as Array<{ name: string; type: string }>;
  return items
    .filter(item => item.type === "dir")
    .map(item => item.name);
}

export async function fetchSkill(
  options: FetchOptions,
  skillName: string
): Promise<Skill> {
  const path = `${options.path}/skills/${skillName}/SKILL.md`;
  const content = await fetchFile(options.repo, options.branch, path);
  return parseSkillMd(content);
}

export async function fetchContent(options: FetchOptions): Promise<{
  skills: Skill[];
  commands: Command[];
}> {
  const skillNames = await fetchSkillList(options);
  const skills: Skill[] = [];
  
  for (const name of skillNames) {
    try {
      const skill = await fetchSkill(options, name);
      skills.push(skill);
    } catch (error) {
      console.warn(`Failed to fetch skill ${name}:`, error);
    }
  }

  // TODO: Fetch commands similarly
  const commands: Command[] = [];

  return { skills, commands };
}
```

**Step 3: Verify**

```bash
bun test tests/lib/fetcher.test.ts
# Expected: 2 tests passing
```

**Commit:** `feat(lib): implement GitHub content fetcher`

---

## Task 2: Implement Skill Installer

**Files:**
- Modify: `src/lib/installer.ts`
- Test: `tests/lib/installer.test.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/lib/installer.test.ts
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";
import { installSkills, createClaudeSettings } from "../../src/lib/installer";
import { DEFAULT_CONFIG } from "../../src/lib/config";
import type { Skill } from "../../src/types";

const TEST_DIR = "./test-output";

describe("Skill Installer", () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
  });

  it("creates skill directories", async () => {
    const skills: Skill[] = [{
      name: "test-skill",
      description: "Test",
      content: "---\nname: test-skill\ndescription: Test\n---\n# Test",
    }];

    await installSkills({
      cwd: TEST_DIR,
      config: DEFAULT_CONFIG,
      skills,
      commands: [],
    });

    expect(existsSync(join(TEST_DIR, ".github/skills/test-skill"))).toBe(true);
  });

  it("writes SKILL.md files", async () => {
    const skills: Skill[] = [{
      name: "test-skill",
      description: "Test",
      content: "---\nname: test-skill\ndescription: Test\n---\n# Test Content",
    }];

    await installSkills({
      cwd: TEST_DIR,
      config: DEFAULT_CONFIG,
      skills,
      commands: [],
    });

    const content = readFileSync(
      join(TEST_DIR, ".github/skills/test-skill/SKILL.md"),
      "utf-8"
    );
    expect(content).toContain("# Test Content");
  });

  it("creates Claude settings", () => {
    createClaudeSettings(TEST_DIR, DEFAULT_CONFIG);
    
    expect(existsSync(join(TEST_DIR, ".claude/settings.json"))).toBe(true);
    
    const settings = JSON.parse(
      readFileSync(join(TEST_DIR, ".claude/settings.json"), "utf-8")
    );
    expect(settings["agent-kit"].installed).toBe(true);
  });
});
```

**Step 2: Implement the code (GREEN)**

Update `src/lib/installer.ts` with complete implementation (see previous task code, enhance with proper error handling).

**Step 3: Verify**

```bash
bun test tests/lib/installer.test.ts
# Expected: 3 tests passing
```

**Commit:** `feat(lib): implement skill installer`

---

## Task 3: Implement AGENTS.md Generator

**Files:**
- Modify: `src/lib/generator.ts`
- Test: `tests/lib/generator.test.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/lib/generator.test.ts
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync, mkdirSync, readFileSync } from "fs";
import { generateAgentsMd } from "../../src/lib/generator";
import { DEFAULT_CONFIG } from "../../src/lib/config";
import type { Skill } from "../../src/types";

const TEST_DIR = "./test-output";

describe("AGENTS.md Generator", () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
  });

  it("generates AGENTS.md", () => {
    const skills: Skill[] = [
      { name: "skill-a", description: "Description A", content: "" },
      { name: "skill-b", description: "Description B", content: "" },
    ];

    generateAgentsMd(TEST_DIR, DEFAULT_CONFIG, skills);

    expect(existsSync(`${TEST_DIR}/AGENTS.md`)).toBe(true);
  });

  it("includes skill list in AGENTS.md", () => {
    const skills: Skill[] = [
      { name: "brainstorm", description: "Interactive ideation", content: "" },
    ];

    generateAgentsMd(TEST_DIR, DEFAULT_CONFIG, skills);

    const content = readFileSync(`${TEST_DIR}/AGENTS.md`, "utf-8");
    expect(content).toContain("brainstorm");
    expect(content).toContain("Interactive ideation");
  });
});
```

**Step 2: Implement the code (GREEN)**

Complete the generator.ts implementation with proper formatting.

**Step 3: Verify**

```bash
bun test tests/lib/generator.test.ts
# Expected: 2 tests passing
```

**Commit:** `feat(lib): implement AGENTS.md generator`

---

## Task 4: Create Init Command Handler

**Files:**
- Create: `src/cli/commands/init.ts`
- Test: `tests/cli/commands/init.test.ts`

**Step 1: Write the failing test (RED)**

```typescript
// tests/cli/commands/init.test.ts
import { describe, it, expect, spyOn, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync, mkdirSync } from "fs";
import { initCommand } from "../../../src/cli/commands/init";
import type { ParsedArgs } from "../../../src/cli/parser";

const TEST_DIR = "./test-init-output";

describe("Init Command", () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
    mkdirSync(TEST_DIR, { recursive: true });
    process.chdir(TEST_DIR);
  });

  afterEach(() => {
    process.chdir("..");
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
  });

  it("shows initialization message", async () => {
    const logs: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args) => {
      logs.push(args.join(" "));
    });

    const args: ParsedArgs = {
      command: "init",
      flags: { yes: true },
      positional: [],
    };

    // Mock the fetch to avoid real network calls
    await initCommand(args);

    expect(logs.some(log => log.includes("Initializing"))).toBe(true);
    spy.mockRestore();
  });
});
```

**Step 2: Implement the code (GREEN)**

```typescript
// src/cli/commands/init.ts
import { existsSync } from "fs";
import { join } from "path";
import type { ParsedArgs } from "../parser";
import { print, format, colors, symbols, printBox } from "../output";
import { loadConfig, saveConfig, DEFAULT_CONFIG } from "../../lib/config";
import { fetchContent } from "../../lib/fetcher";
import { installSkills, createClaudeSettings } from "../../lib/installer";
import { generateAgentsMd } from "../../lib/generator";
import type { AkConfig } from "../../types";

export async function initCommand(args: ParsedArgs): Promise<void> {
  const cwd = process.cwd();
  const configPath = join(cwd, ".ak/config.json");
  
  // Check if already initialized
  if (existsSync(configPath) && !args.flags.force) {
    print(format.warning("agent-kit already initialized in this project"));
    print(`Use ${format.command("ak update")} to refresh content`);
    print(`Use ${format.flag("--force")} to reinitialize`);
    return;
  }

  print();
  print(format.title("Initializing agent-kit"));
  print();

  // Build config from flags
  const config: AkConfig = {
    ...DEFAULT_CONFIG,
    targets: {
      claude: !args.flags["copilot-only"],
      copilot: !args.flags["claude-only"],
      agentsMd: !args.flags["skip-agents-md"],
    },
  };

  print(`${symbols.info} Fetching content from repository...`);
  
  try {
    const { skills, commands } = await fetchContent({
      repo: config.source.repo,
      branch: config.source.branch,
      path: config.source.path,
    });

    print(format.success(`Found ${skills.length} skills`));

    print(`${symbols.info} Installing skills...`);
    await installSkills({ cwd, config, skills, commands });
    
    if (config.targets.claude) {
      print(`${symbols.check} Installed to .github/skills/`);
      print(`${symbols.check} Symlinked to .claude/skills/`);
    }

    if (config.targets.claude) {
      print(`${symbols.info} Creating Claude settings...`);
      createClaudeSettings(cwd, config);
      print(format.success("Created .claude/settings.json"));
    }

    if (config.targets.agentsMd) {
      print(`${symbols.info} Generating AGENTS.md...`);
      generateAgentsMd(cwd, config, skills);
      print(format.success("Created AGENTS.md"));
    }

    // Save config
    saveConfig(config, cwd);
    print(format.success("Created .ak/config.json"));

    print();
    printBox("agent-kit initialized!", [
      "",
      `Skills installed: ${skills.length}`,
      "",
      "Next steps:",
      `  ${colors.dim("•")} Use /brainstorm to explore ideas`,
      `  ${colors.dim("•")} Use /create-plan to plan work`,
      `  ${colors.dim("•")} Run ${format.command("ak doctor")} to verify`,
      "",
    ]);
  } catch (error) {
    print(format.error("Initialization failed"));
    if (error instanceof Error) {
      print(colors.dim(error.message));
    }
    process.exit(1);
  }
}
```

**Step 3: Verify**

```bash
bun test tests/cli/commands/init.test.ts
# Expected: 1 test passing
```

**Commit:** `feat(cli): implement init command`

---

## Task 5-8: Wire Up, Error Handling, Directory Creation

Continue with remaining tasks to:
- Wire init command into router
- Add comprehensive error handling
- Create output directories (docs/ideas, docs/plans, docs/adrs)
- Add progress indicators
- Handle offline/network errors gracefully

---

## Integration Verification

After all tasks complete:

```bash
# Run all tests
bun test

# Test init manually
mkdir test-project && cd test-project
bun run ../src/cli/index.ts init --yes
ls -la .github/skills/
ls -la .claude/
cat AGENTS.md
```

## Rollback Plan

```bash
git revert HEAD~N
```

---

*Plan created using agent-kit skills.*

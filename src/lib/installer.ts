/**
 * Local installation utilities
 * 
 * TODO: Implement following Phase 2 plan
 */

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
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
    ".ak",
  ];

  for (const dir of dirs) {
    const fullPath = join(cwd, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }

  // Install skills to .github/skills (canonical location for Agent Skills)
  if (config.targets.copilot) {
    for (const skill of skills) {
      const skillDir = join(cwd, ".github/skills", skill.name);
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(join(skillDir, "SKILL.md"), skill.content);
    }
  }

  // TODO: Create symlinks from .claude/skills to .github/skills
  // TODO: Install commands to .claude/commands

  console.log(`Installed ${skills.length} skills, ${commands.length} commands`);
}

export function createClaudeSettings(cwd: string, config: AkConfig): void {
  const settingsDir = join(cwd, ".claude");
  if (!existsSync(settingsDir)) {
    mkdirSync(settingsDir, { recursive: true });
  }
  
  const settingsPath = join(settingsDir, "settings.json");
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

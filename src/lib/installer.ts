/**
 * Local installation utilities
 *
 * Installs skills and commands to the project directory.
 */

import { mkdirSync, writeFileSync, existsSync, symlinkSync } from "fs";
import { join, relative, dirname } from "path";
import type { Skill, Command, AkConfig } from "../types";

export interface InstallOptions {
  cwd: string;
  config: AkConfig;
  skills: Skill[];
  commands: Command[];
}

export async function installSkills(options: InstallOptions): Promise<void> {
  const { cwd, config, skills, commands: _commands } = options;

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
  // Install if either copilot or claude target is enabled
  if (config.targets.copilot || config.targets.claude) {
    for (const skill of skills) {
      const skillDir = join(cwd, ".github/skills", skill.name);
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(join(skillDir, "SKILL.md"), skill.content);
    }
  }

  // Create symlinks from .claude/skills to .github/skills when claude is enabled
  if (config.targets.claude) {
    for (const skill of skills) {
      const claudeSkillPath = join(cwd, ".claude/skills", skill.name);
      const githubSkillPath = join(cwd, ".github/skills", skill.name);

      // Use relative path for symlink portability
      const relativePath = relative(dirname(claudeSkillPath), githubSkillPath);

      if (!existsSync(claudeSkillPath)) {
        symlinkSync(relativePath, claudeSkillPath);
      }
    }
  }

  // TODO: Install commands to .claude/commands
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

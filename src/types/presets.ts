/**
 * Initialization presets
 * 
 * Presets define which skills, commands, and configurations
 * to install based on project needs.
 */

import type { AkConfig } from "./index";

export interface Preset {
  name: string;
  description: string;
  skills: string[];
  commands: string[];
  targets: {
    claude: boolean;
    copilot: boolean;
    agentsMd: boolean;
  };
  defaults: Partial<AkConfig["defaults"]>;
  createDirs: string[];
}

export const PRESETS: Record<string, Preset> = {
  /**
   * Full installation with all skills and features
   */
  full: {
    name: "full",
    description: "Complete setup with all skills and integrations",
    skills: [
      "brainstorm",
      "create-plan",
      "create-adr",
      "implement-plan",
      "review-plan",
      "review-code",
      "doc-contents",
    ],
    commands: [
      "brainstorm",
      "create-plan",
      "create-adr",
      "implement-plan",
      "review-plan",
      "review-code",
      "doc-contents",
    ],
    targets: {
      claude: true,
      copilot: true,
      agentsMd: true,
    },
    defaults: {
      reviewTool: "codex",
      reviewReasoning: "high",
      planExecutionMode: "autonomous",
    },
    createDirs: ["docs/ideas", "docs/plans", "docs/adrs"],
  },

  /**
   * Standard setup - recommended for most projects
   */
  standard: {
    name: "standard",
    description: "Recommended setup with core skills (default)",
    skills: [
      "brainstorm",
      "create-plan",
      "implement-plan",
      "review-code",
      "doc-contents",
    ],
    commands: [
      "brainstorm",
      "create-plan",
      "implement-plan",
      "review-code",
      "doc-contents",
    ],
    targets: {
      claude: true,
      copilot: true,
      agentsMd: true,
    },
    defaults: {
      reviewTool: "codex",
      reviewReasoning: "high",
      planExecutionMode: "autonomous",
    },
    createDirs: ["docs/ideas", "docs/plans"],
  },

  /**
   * Minimal setup - just AGENTS.md and basic skills
   */
  minimal: {
    name: "minimal",
    description: "Lightweight setup with AGENTS.md only",
    skills: ["brainstorm", "doc-contents"],
    commands: ["brainstorm", "doc-contents"],
    targets: {
      claude: false,
      copilot: false,
      agentsMd: true,
    },
    defaults: {
      reviewTool: "native",
      planExecutionMode: "manual",
    },
    createDirs: [],
  },

  /**
   * Claude Code focused
   */
  claude: {
    name: "claude",
    description: "Optimized for Claude Code with full skill set",
    skills: [
      "brainstorm",
      "create-plan",
      "create-adr",
      "implement-plan",
      "review-plan",
      "review-code",
      "doc-contents",
    ],
    commands: [
      "brainstorm",
      "create-plan",
      "create-adr",
      "implement-plan",
      "review-plan",
      "review-code",
      "doc-contents",
    ],
    targets: {
      claude: true,
      copilot: false,
      agentsMd: true,
    },
    defaults: {
      reviewTool: "claude",
      reviewModel: "claude-sonnet-4-5-20250929",
      reviewReasoning: "high",
      planExecutionMode: "autonomous",
    },
    createDirs: ["docs/ideas", "docs/plans", "docs/adrs"],
  },

  /**
   * GitHub Copilot / VS Code focused
   */
  copilot: {
    name: "copilot",
    description: "Optimized for GitHub Copilot and VS Code",
    skills: [
      "brainstorm",
      "create-plan",
      "implement-plan",
      "review-code",
      "doc-contents",
    ],
    commands: [], // Copilot doesn't use slash commands the same way
    targets: {
      claude: false,
      copilot: true,
      agentsMd: true,
    },
    defaults: {
      reviewTool: "native",
      planExecutionMode: "checkpoint",
    },
    createDirs: ["docs/ideas", "docs/plans"],
  },

  /**
   * OpenAI Codex focused
   */
  codex: {
    name: "codex",
    description: "Optimized for OpenAI Codex CLI",
    skills: [
      "brainstorm",
      "create-plan",
      "implement-plan",
      "review-plan",
      "review-code",
      "doc-contents",
    ],
    commands: [],
    targets: {
      claude: false,
      copilot: true, // Uses Agent Skills format
      agentsMd: true,
    },
    defaults: {
      reviewTool: "codex",
      reviewModel: "gpt-5",
      reviewReasoning: "high",
      planExecutionMode: "autonomous",
    },
    createDirs: ["docs/ideas", "docs/plans", "docs/adrs"],
  },

  /**
   * Planning focused - for architecture and design work
   */
  planning: {
    name: "planning",
    description: "Focus on ideation, planning, and documentation",
    skills: [
      "brainstorm",
      "create-plan",
      "create-adr",
      "doc-contents",
    ],
    commands: [
      "brainstorm",
      "create-plan",
      "create-adr",
      "doc-contents",
    ],
    targets: {
      claude: true,
      copilot: true,
      agentsMd: true,
    },
    defaults: {
      reviewTool: "native",
      planExecutionMode: "manual",
    },
    createDirs: ["docs/ideas", "docs/plans", "docs/adrs"],
  },

  /**
   * Review focused - for code review workflows
   */
  review: {
    name: "review",
    description: "Focus on code review with Codex CLI delegation",
    skills: [
      "review-plan",
      "review-code",
    ],
    commands: [
      "review-plan",
      "review-code",
    ],
    targets: {
      claude: true,
      copilot: true,
      agentsMd: true,
    },
    defaults: {
      reviewTool: "codex",
      reviewModel: "gpt-5",
      reviewReasoning: "high",
    },
    createDirs: [],
  },

  /**
   * Execution focused - for autonomous implementation
   */
  execution: {
    name: "execution",
    description: "Focus on autonomous plan execution with reviews",
    skills: [
      "create-plan",
      "implement-plan",
      "review-plan",
      "review-code",
    ],
    commands: [
      "create-plan",
      "implement-plan",
      "review-plan",
      "review-code",
    ],
    targets: {
      claude: true,
      copilot: true,
      agentsMd: true,
    },
    defaults: {
      reviewTool: "codex",
      reviewReasoning: "high",
      planExecutionMode: "autonomous",
      checkpointInterval: 3,
    },
    createDirs: ["docs/plans"],
  },
};

export const DEFAULT_PRESET = "standard";

export function getPreset(name: string): Preset | undefined {
  return PRESETS[name];
}

export function listPresets(): Preset[] {
  return Object.values(PRESETS);
}

export function getPresetNames(): string[] {
  return Object.keys(PRESETS);
}

/**
 * Create a custom preset by extending an existing one
 */
export function createCustomPreset(
  base: string,
  overrides: Partial<Omit<Preset, "name">> & { name: string }
): Preset {
  const basePreset = getPreset(base);
  if (!basePreset) {
    throw new Error(`Unknown base preset: ${base}`);
  }

  return {
    ...basePreset,
    ...overrides,
    targets: { ...basePreset.targets, ...overrides.targets },
    defaults: { ...basePreset.defaults, ...overrides.defaults },
    skills: overrides.skills || basePreset.skills,
    commands: overrides.commands || basePreset.commands,
    createDirs: overrides.createDirs || basePreset.createDirs,
  };
}

/**
 * Validate that all skills in a preset exist
 */
export function validatePreset(preset: Preset, availableSkills: string[]): string[] {
  const missing: string[] = [];
  for (const skill of preset.skills) {
    if (!availableSkills.includes(skill)) {
      missing.push(skill);
    }
  }
  return missing;
}

/**
 * Custom preset definition for .ak/config.json
 */
export interface CustomPresetConfig {
  extends?: string;
  name: string;
  description: string;
  skills?: string[];
  addSkills?: string[];
  removeSkills?: string[];
  commands?: string[];
  addCommands?: string[];
  removeCommands?: string[];
  targets?: Partial<Preset["targets"]>;
  defaults?: Partial<Preset["defaults"]>;
  createDirs?: string[];
}

/**
 * Build a preset from custom config
 */
export function buildPresetFromConfig(config: CustomPresetConfig): Preset {
  const base = config.extends ? getPreset(config.extends) : PRESETS.standard;
  
  if (!base) {
    throw new Error(`Unknown base preset: ${config.extends}`);
  }

  let skills = config.skills || [...base.skills];
  if (config.addSkills) {
    skills = [...new Set([...skills, ...config.addSkills])];
  }
  if (config.removeSkills) {
    skills = skills.filter(s => !config.removeSkills!.includes(s));
  }

  let commands = config.commands || [...base.commands];
  if (config.addCommands) {
    commands = [...new Set([...commands, ...config.addCommands])];
  }
  if (config.removeCommands) {
    commands = commands.filter(c => !config.removeCommands!.includes(c));
  }

  return {
    name: config.name,
    description: config.description,
    skills,
    commands,
    targets: { ...base.targets, ...config.targets },
    defaults: { ...base.defaults, ...config.defaults },
    createDirs: config.createDirs || base.createDirs,
  };
}

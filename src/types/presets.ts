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

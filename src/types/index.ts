/**
 * Shared type definitions for agent-kit
 */

export * from "./presets";

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
    reviewTool: "codex" | "claude" | "native";
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
  tool?: "codex" | "claude" | "native";
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

export interface HealthCheck {
  name: string;
  check: () => Promise<CheckResult>;
}

export interface CheckResult {
  status: "pass" | "warn" | "fail";
  message: string;
  details?: string;
}

export interface ClaudePermissions {
  allow: string[];
  deny: string[];
  ask: string[];
}

export interface ClaudeSettingsLocal {
  permissions: ClaudePermissions;
}

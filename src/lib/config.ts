/**
 * Configuration management
 */

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

export function mergeConfig(base: AkConfig, overrides: Partial<AkConfig>): AkConfig {
  return {
    ...base,
    ...overrides,
    source: { ...base.source, ...overrides.source },
    targets: { ...base.targets, ...overrides.targets },
    defaults: { ...base.defaults, ...overrides.defaults },
    overrides: { ...base.overrides, ...overrides.overrides },
  };
}

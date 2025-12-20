/**
 * AGENTS.md and other file generators
 * 
 * TODO: Enhance following Phase 2 plan
 */

import { writeFileSync } from "fs";
import { join } from "path";
import type { Skill, AkConfig } from "../types";

export function generateAgentsMd(
  cwd: string,
  _config: AkConfig,
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
  lines.push("## Configuration");
  lines.push("");
  lines.push("See `.ak/config.json` for agent-kit configuration.");
  lines.push("");

  const content = lines.join("\n");
  writeFileSync(join(cwd, "AGENTS.md"), content);
}

export function generateReadmeSection(skills: Skill[]): string {
  const lines: string[] = [
    "## AI Agent Skills",
    "",
    "This project includes the following AI agent skills:",
    "",
  ];

  for (const skill of skills) {
    lines.push(`- **${skill.name}**: ${skill.description}`);
  }

  lines.push("");
  lines.push("Skills are automatically invoked by compatible AI coding agents.");
  lines.push("");

  return lines.join("\n");
}

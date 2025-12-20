/**
 * Init command - Initialize agent-kit in a project
 * 
 * Supports presets for different project needs:
 * - full: Complete setup with all skills
 * - standard: Recommended core skills (default)
 * - minimal: Lightweight AGENTS.md only
 * - claude: Optimized for Claude Code
 * - copilot: Optimized for GitHub Copilot
 * - codex: Optimized for OpenAI Codex
 * - planning: Focus on ideation and docs
 * - review: Focus on code review
 * - execution: Focus on autonomous execution
 */

import type { ParsedArgs } from "../parser";
import { print, format, colors, symbols, printBox } from "../output";
import { PRESETS, DEFAULT_PRESET, getPreset, listPresets, type Preset } from "../../types/presets";

export async function initCommand(args: ParsedArgs): Promise<void> {
  // Handle --list-presets flag
  if (args.flags["list-presets"] || args.flags.list) {
    showPresetList();
    return;
  }

  // Handle --preset-info flag
  if (args.flags["preset-info"]) {
    const presetName = args.flags["preset-info"] as string;
    showPresetDetails(presetName);
    return;
  }

  // Determine which preset to use
  const presetName = (args.flags.preset as string) || DEFAULT_PRESET;
  const preset = getPreset(presetName);

  if (!preset) {
    print(format.error(`Unknown preset: ${presetName}`));
    print();
    print("Available presets:");
    for (const p of listPresets()) {
      print(`  ${format.command(p.name.padEnd(12))} ${p.description}`);
    }
    print();
    print(`Use ${format.flag("--list-presets")} for details`);
    process.exit(1);
  }

  // Interactive mode (unless --yes flag)
  if (!args.flags.yes && !args.flags.y) {
    print();
    print(format.title("agent-kit initialization"));
    print();
    print(`Selected preset: ${format.command(preset.name)}`);
    print(colors.dim(preset.description));
    print();
    print("This will install:");
    print(`  ${symbols.info} ${preset.skills.length} skills: ${colors.dim(preset.skills.join(", "))}`);
    if (preset.commands.length > 0) {
      print(`  ${symbols.info} ${preset.commands.length} commands`);
    }
    if (preset.targets.claude) print(`  ${symbols.check} Claude Code integration`);
    if (preset.targets.copilot) print(`  ${symbols.check} GitHub Copilot integration`);
    if (preset.targets.agentsMd) print(`  ${symbols.check} AGENTS.md file`);
    if (preset.createDirs.length > 0) {
      print(`  ${symbols.info} Directories: ${colors.dim(preset.createDirs.join(", "))}`);
    }
    print();
    print(colors.dim("Use --yes to skip this confirmation"));
    print(colors.dim("Use --preset <name> to choose a different preset"));
    print();
    // TODO: Add actual confirmation prompt
  }

  print();
  print(format.title(`Initializing with "${preset.name}" preset`));
  print();

  // Show what will be done
  print(`${symbols.info} Preset: ${colors.bold(preset.name)} - ${preset.description}`);
  print();

  // Skills to install
  print(colors.bold("Skills:"));
  for (const skill of preset.skills) {
    print(`  ${symbols.arrow} ${skill}`);
  }
  print();

  // Targets
  print(colors.bold("Targets:"));
  if (preset.targets.claude) print(`  ${symbols.check} Claude Code (.claude/skills/, .claude/commands/)`);
  if (preset.targets.copilot) print(`  ${symbols.check} GitHub Copilot (.github/skills/)`);
  if (preset.targets.agentsMd) print(`  ${symbols.check} AGENTS.md`);
  print();

  // Defaults
  print(colors.bold("Configuration:"));
  if (preset.defaults.reviewTool) {
    print(`  ${symbols.info} Review tool: ${preset.defaults.reviewTool}`);
  }
  if (preset.defaults.planExecutionMode) {
    print(`  ${symbols.info} Execution mode: ${preset.defaults.planExecutionMode}`);
  }
  print();

  // Directories
  if (preset.createDirs.length > 0) {
    print(colors.bold("Directories:"));
    for (const dir of preset.createDirs) {
      print(`  ${symbols.arrow} ${dir}/`);
    }
    print();
  }

  print(format.warning("Full installation not yet implemented"));
  print();
  print(`See ${format.command("docs/plans/phase-2-init-plan.md")} for implementation details.`);
  print();
}

function showPresetList(): void {
  print();
  print(format.title("Available Presets"));
  print();
  
  const presets = listPresets();
  
  for (const preset of presets) {
    const isDefault = preset.name === DEFAULT_PRESET;
    const label = isDefault ? ` ${colors.dim("(default)")}` : "";
    print(`  ${format.command(preset.name.padEnd(12))}${label}`);
    print(`  ${colors.dim(preset.description)}`);
    print(`  ${colors.dim(`Skills: ${preset.skills.length} | Targets: ${formatTargets(preset)}`)}`);
    print();
  }

  print(colors.bold("Usage:"));
  print(`  ${colors.dim("$")} ak init --preset full`);
  print(`  ${colors.dim("$")} ak init --preset minimal --yes`);
  print(`  ${colors.dim("$")} ak init --preset-info claude`);
  print();
}

function showPresetDetails(name: string): void {
  const preset = getPreset(name);
  
  if (!preset) {
    print(format.error(`Unknown preset: ${name}`));
    print(`Use ${format.flag("--list-presets")} to see available presets`);
    return;
  }

  print();
  print(format.title(`Preset: ${preset.name}`));
  print(preset.description);
  print();

  print(colors.bold("Skills included:"));
  for (const skill of preset.skills) {
    print(`  ${symbols.check} ${skill}`);
  }
  print();

  if (preset.commands.length > 0) {
    print(colors.bold("Commands included:"));
    for (const cmd of preset.commands) {
      print(`  ${symbols.check} /${cmd}`);
    }
    print();
  }

  print(colors.bold("Target platforms:"));
  print(`  Claude Code:     ${preset.targets.claude ? colors.green("Yes") : colors.dim("No")}`);
  print(`  GitHub Copilot:  ${preset.targets.copilot ? colors.green("Yes") : colors.dim("No")}`);
  print(`  AGENTS.md:       ${preset.targets.agentsMd ? colors.green("Yes") : colors.dim("No")}`);
  print();

  print(colors.bold("Default configuration:"));
  print(`  Review tool:     ${preset.defaults.reviewTool || "native"}`);
  if (preset.defaults.reviewModel) {
    print(`  Review model:    ${preset.defaults.reviewModel}`);
  }
  print(`  Reasoning:       ${preset.defaults.reviewReasoning || "medium"}`);
  print(`  Execution mode:  ${preset.defaults.planExecutionMode || "manual"}`);
  print();

  if (preset.createDirs.length > 0) {
    print(colors.bold("Directories created:"));
    for (const dir of preset.createDirs) {
      print(`  ${symbols.arrow} ${dir}/`);
    }
    print();
  }

  print(colors.bold("Usage:"));
  print(`  ${colors.dim("$")} ak init --preset ${preset.name}`);
  print();
}

function formatTargets(preset: Preset): string {
  const targets: string[] = [];
  if (preset.targets.claude) targets.push("Claude");
  if (preset.targets.copilot) targets.push("Copilot");
  if (preset.targets.agentsMd) targets.push("AGENTS.md");
  return targets.join(", ");
}

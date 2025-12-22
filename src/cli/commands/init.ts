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
import { DEFAULT_PRESET, getPreset, listPresets, type Preset } from "../../types/presets";
import { fetchContent } from "../../lib/fetcher";
import { installSkills, createClaudeSettingsLocal, BUN_PERMISSIONS, NODE_PERMISSIONS, CODEX_PERMISSIONS } from "../../lib/installer";
import { generateAgentsMd } from "../../lib/generator";
import { saveConfig, DEFAULT_CONFIG } from "../../lib/config";
import type { AkConfig } from "../../types";

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

  const cwd = process.cwd();
  const useLocal = args.flags.local === true;

  // Build config from preset
  const config: AkConfig = {
    ...DEFAULT_CONFIG,
    targets: preset.targets,
    defaults: {
      ...DEFAULT_CONFIG.defaults,
      reviewTool: preset.defaults.reviewTool || DEFAULT_CONFIG.defaults.reviewTool,
      planExecutionMode: preset.defaults.planExecutionMode || DEFAULT_CONFIG.defaults.planExecutionMode,
    },
  };

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

  // Fetch skills
  print(`${symbols.info} Fetching skills...`);
  const { skills: allSkills } = await fetchContent({
    repo: config.source.repo,
    branch: config.source.branch,
    path: config.source.path,
    useLocal,
  });

  // Filter skills based on preset
  const skills = allSkills.filter((s) => preset.skills.includes(s.name));
  print(format.success(`Found ${skills.length} skills for preset '${presetName}'`));

  // Install skills
  print(`${symbols.info} Installing skills...`);
  await installSkills({ cwd, config, skills, commands: [] });
  print(format.success("Skills installed"));

  // Create Claude settings.local.json if claude target is enabled
  if (config.targets.claude) {
    print(`${symbols.info} Creating Claude permissions...`);

    // Detect package manager and add appropriate permissions
    const additionalAllow: string[] = [];

    // Add runtime-specific permissions based on project detection
    // For now, include common ones - could be smarter with package.json detection
    additionalAllow.push(...BUN_PERMISSIONS);
    additionalAllow.push(...NODE_PERMISSIONS);

    // Add codex permissions if using codex for reviews
    if (config.defaults.reviewTool === "codex") {
      additionalAllow.push(...CODEX_PERMISSIONS);
    }

    createClaudeSettingsLocal(cwd, {
      additionalAllow,
      skills: preset.skills,
    });
    print(format.success("Created .claude/settings.local.json"));
  }

  // Generate AGENTS.md if target is enabled
  if (config.targets.agentsMd) {
    print(`${symbols.info} Generating AGENTS.md...`);
    generateAgentsMd(cwd, config, skills);
    print(format.success("Created AGENTS.md"));
  }

  // Save configuration
  saveConfig(config, cwd);
  print(format.success("Created .ak/config.json"));

  // Summary
  print();
  printBox("agent-kit initialized!", [
    `Preset: ${preset.name}`,
    `Skills: ${skills.length}`,
    "",
    "Next steps:",
    "  ak doctor   - Check installation",
    "  ak help     - See available commands",
  ]);
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

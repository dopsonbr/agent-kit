/**
 * Help command
 */

import { print, colors, format } from "../output";

const VERSION = "0.1.0";

const COMMANDS = {
  init: {
    description: "Initialize agent-kit in your project",
    flags: {
      "--preset <name>": "Use a preset (standard, full, minimal, claude, copilot, codex, planning, review, execution)",
      "--list-presets": "Show all available presets with details",
      "--preset-info <name>": "Show detailed info about a specific preset",
      "--yes, -y": "Accept all defaults without prompting",
      "--force": "Reinitialize even if already set up",
    },
  },
  update: {
    description: "Update to the latest version",
    flags: {
      "--skills-only": "Only update skills",
      "--cli-only": "Only update CLI",
      "--check": "Check for updates without installing",
    },
  },
  doctor: {
    description: "Diagnose installation health",
    flags: {},
  },
  help: {
    description: "Show help information",
    flags: {},
  },
  version: {
    description: "Show version",
    flags: {},
  },
};

const SKILLS = [
  { name: "brainstorm", desc: "Interactive ideation with structured questioning" },
  { name: "create-plan", desc: "Create detailed TDD implementation plans" },
  { name: "create-adr", desc: "Generate Architectural Decision Records" },
  { name: "implement-plan", desc: "Autonomous plan execution with reviews" },
  { name: "review-plan", desc: "Review plans before execution" },
  { name: "review-code", desc: "Review code changes with high reasoning" },
  { name: "doc-contents", desc: "Generate project documentation" },
];

export function helpCommand(args: string[]): void {
  const topic = args[0];

  if (!topic) {
    showGeneralHelp();
    return;
  }

  if (topic === "skills") {
    showSkillsList();
    return;
  }

  if (topic in COMMANDS) {
    showCommandHelp(topic as keyof typeof COMMANDS);
    return;
  }

  print(format.error(`Unknown topic: ${topic}`));
  print(`Run ${format.command("ak help")} for general help`);
}

function showGeneralHelp(): void {
  print();
  print(format.title(`agent-kit v${VERSION}`));
  print(colors.dim("CLI for managing AI coding agent configurations"));
  print();
  print(colors.bold("Usage:"));
  print(`  ${format.command("ak")} ${colors.dim("<command>")} ${colors.dim("[options]")}`);
  print();
  print(colors.bold("Commands:"));
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    print(`  ${format.command(name.padEnd(12))} ${cmd.description}`);
  }
  print();
  print(colors.bold("Examples:"));
  print(`  ${colors.dim("$")} ak init                 ${colors.dim("# Initialize with defaults")}`);
  print(`  ${colors.dim("$")} ak init --yes           ${colors.dim("# Skip prompts")}`);
  print(`  ${colors.dim("$")} ak doctor               ${colors.dim("# Check installation")}`);
  print(`  ${colors.dim("$")} ak help init            ${colors.dim("# Help for init command")}`);
  print(`  ${colors.dim("$")} ak help skills          ${colors.dim("# List available skills")}`);
  print();
  print(colors.dim("Documentation: https://github.com/YOUR_ORG/agent-kit"));
  print();
}

function showCommandHelp(command: keyof typeof COMMANDS): void {
  const cmd = COMMANDS[command];
  print();
  print(format.title(`ak ${command}`));
  print(cmd.description);
  print();
  
  print(colors.bold("Usage:"));
  print(`  ${format.command("ak")} ${command} ${colors.dim("[options]")}`);
  print();

  const flags = Object.entries(cmd.flags);
  if (flags.length > 0) {
    print(colors.bold("Options:"));
    for (const [flag, desc] of flags) {
      print(`  ${format.flag(flag.padEnd(22))} ${desc}`);
    }
    print();
  }
}

function showSkillsList(): void {
  print();
  print(format.title("Available Skills"));
  print();
  for (const skill of SKILLS) {
    print(`  ${format.command(skill.name.padEnd(18))} ${skill.desc}`);
  }
  print();
  print(colors.dim("Skills are automatically invoked by AI agents when relevant."));
  print(colors.dim("See https://agentskills.io for more information."));
  print();
}

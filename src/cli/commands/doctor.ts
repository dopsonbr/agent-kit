/**
 * Doctor command - Diagnose installation health
 * 
 * TODO: Implement following Phase 4 plan
 */

import { existsSync } from "fs";
import { join } from "path";
import type { ParsedArgs } from "../parser";
import { print, format, colors, symbols } from "../output";

const VERSION = "0.1.0";

interface CheckResult {
  status: "pass" | "warn" | "fail";
  message: string;
  details?: string;
}

export async function doctorCommand(_args?: ParsedArgs): Promise<void> {
  const cwd = process.cwd();
  
  print();
  print(format.title(`agent-kit v${VERSION}`));
  print();

  const checks: CheckResult[] = [];

  // Directory checks
  const dirs = [
    { path: ".github/skills", name: ".github/skills/" },
    { path: ".claude/skills", name: ".claude/skills/" },
    { path: ".claude/commands", name: ".claude/commands/" },
    { path: "docs/ideas", name: "docs/ideas/" },
    { path: "docs/plans", name: "docs/plans/" },
    { path: "docs/adrs", name: "docs/adrs/" },
  ];

  for (const dir of dirs) {
    const fullPath = join(cwd, dir.path);
    if (existsSync(fullPath)) {
      checks.push({ status: "pass", message: `${dir.name} exists` });
    } else {
      checks.push({ status: "fail", message: `${dir.name} missing` });
    }
  }

  // File checks
  const files = [
    { path: ".ak/config.json", name: ".ak/config.json" },
    { path: ".claude/settings.json", name: ".claude/settings.json" },
    { path: "AGENTS.md", name: "AGENTS.md" },
  ];

  for (const file of files) {
    const fullPath = join(cwd, file.path);
    if (existsSync(fullPath)) {
      checks.push({ status: "pass", message: `${file.name} exists` });
    } else {
      checks.push({ status: "warn", message: `${file.name} missing`, details: "Run 'ak init' to create" });
    }
  }

  // External tool checks
  try {
    const codexProc = Bun.spawn(["codex", "--version"], { stdout: "pipe", stderr: "pipe" });
    await codexProc.exited;
    if (codexProc.exitCode === 0) {
      checks.push({ status: "pass", message: "Codex CLI available" });
    } else {
      checks.push({ status: "warn", message: "Codex CLI not found", details: "Optional for review delegation" });
    }
  } catch {
    checks.push({ status: "warn", message: "Codex CLI not found", details: "Optional for review delegation" });
  }

  // Print results
  let passed = 0, warned = 0, failed = 0;

  for (const check of checks) {
    switch (check.status) {
      case "pass":
        print(`${symbols.check} ${check.message}`);
        passed++;
        break;
      case "warn":
        print(`${symbols.warning} ${colors.yellow(check.message)}`);
        if (check.details) print(colors.dim(`  ${check.details}`));
        warned++;
        break;
      case "fail":
        print(`${symbols.cross} ${colors.red(check.message)}`);
        if (check.details) print(colors.dim(`  ${check.details}`));
        failed++;
        break;
    }
  }

  print();
  
  if (failed > 0) {
    print(format.error(`${failed} check(s) failed`));
    print();
    print(`Run ${format.command("ak init")} to set up agent-kit`);
    process.exit(1);
  } else if (warned > 0) {
    print(format.warning(`${warned} warning(s)`));
  } else {
    print(format.success("All checks passed!"));
  }
  print();
}

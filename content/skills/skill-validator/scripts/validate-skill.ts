#!/usr/bin/env bun
/**
 * Skill Validator Script
 * 
 * Validates Agent Skills against best practices and specification requirements.
 * 
 * Usage:
 *   bun run scripts/validate-skill.ts <skill-path>
 *   bun run scripts/validate-skill.ts content/skills/plan-create
 *   bun run scripts/validate-skill.ts --all content/skills
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve, dirname } from "path";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ValidationResult {
  skill: string;
  path: string;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  stats: {
    lines: number;
    tokens: number;
    files: string[];
  };
}

interface Frontmatter {
  name?: string;
  description?: string;
  license?: string;
  metadata?: {
    author?: string;
    version?: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Parsing
// ─────────────────────────────────────────────────────────────────────────────

function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const [, yaml, body] = match;
  const frontmatter: Frontmatter = {};

  // Simple YAML parsing (good enough for frontmatter)
  for (const line of yaml.split("\n")) {
    const nameMatch = line.match(/^name:\s*(.+)$/);
    if (nameMatch) frontmatter.name = nameMatch[1].trim().replace(/^["']|["']$/g, "");

    const descMatch = line.match(/^description:\s*(.+)$/);
    if (descMatch) frontmatter.description = descMatch[1].trim().replace(/^["']|["']$/g, "");

    const licenseMatch = line.match(/^license:\s*(.+)$/);
    if (licenseMatch) frontmatter.license = licenseMatch[1].trim();
  }

  // Handle multi-line description
  const descBlockMatch = yaml.match(/description:\s*[|>]-?\n((?:\s{2,}.+\n?)+)/);
  if (descBlockMatch) {
    frontmatter.description = descBlockMatch[1]
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .join(" ");
  }

  return { frontmatter, body };
}

function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation Rules
// ─────────────────────────────────────────────────────────────────────────────

function validateSkill(skillPath: string): ValidationResult {
  const result: ValidationResult = {
    skill: "",
    path: skillPath,
    errors: [],
    warnings: [],
    suggestions: [],
    stats: { lines: 0, tokens: 0, files: [] },
  };

  // Check SKILL.md exists
  const skillMdPath = join(skillPath, "SKILL.md");
  if (!existsSync(skillMdPath)) {
    result.errors.push("SKILL.md not found");
    return result;
  }

  result.stats.files.push("SKILL.md");

  // Read and parse
  const content = readFileSync(skillMdPath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(content);

  result.stats.lines = content.split("\n").length;
  result.stats.tokens = estimateTokens(body);

  // ─── Required Fields ───────────────────────────────────────────────────────

  // Name
  if (!frontmatter.name) {
    result.errors.push("Missing 'name' in frontmatter");
  } else {
    result.skill = frontmatter.name;

    // Name format
    if (frontmatter.name.length > 64) {
      result.errors.push(`Name exceeds 64 characters (${frontmatter.name.length})`);
    }

    if (!/^[a-z0-9-]+$/.test(frontmatter.name)) {
      result.errors.push("Name must be lowercase letters, numbers, and hyphens only");
    }

    if (frontmatter.name.includes("anthropic") || frontmatter.name.includes("claude")) {
      result.errors.push("Name cannot contain reserved words: 'anthropic', 'claude'");
    }

    if (/<[^>]+>/.test(frontmatter.name)) {
      result.errors.push("Name cannot contain XML tags");
    }
  }

  // Description
  if (!frontmatter.description) {
    result.errors.push("Missing 'description' in frontmatter");
  } else {
    if (frontmatter.description.length > 1024) {
      result.errors.push(`Description exceeds 1024 characters (${frontmatter.description.length})`);
    }

    if (/<[^>]+>/.test(frontmatter.description)) {
      result.errors.push("Description cannot contain XML tags");
    }

    // Trigger words check
    const hasTrigger = /use when|use for|when you|if you|use this/i.test(frontmatter.description);
    if (!hasTrigger) {
      result.warnings.push("Description should include trigger conditions (e.g., 'Use when...')");
    }
  }

  // ─── Structure Checks ──────────────────────────────────────────────────────

  // Token limit
  if (result.stats.tokens > 5000) {
    result.warnings.push(`SKILL.md body is ~${result.stats.tokens} tokens (recommended < 5000)`);
  }

  // Examples section
  if (!body.match(/##\s*(Example|Usage)/i)) {
    result.warnings.push("No examples or usage section found");
  }

  // Purpose section
  if (!body.match(/##\s*(Purpose|Overview|What|About)/i)) {
    result.suggestions.push("Consider adding a Purpose or Overview section");
  }

  // Related skills
  if (!body.match(/##\s*Related\s*Skills?/i)) {
    result.suggestions.push("Consider adding a Related Skills section");
  }

  // ─── Link Validation ───────────────────────────────────────────────────────

  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkPattern.exec(body)) !== null) {
    const [, linkText, linkPath] = match;

    // Skip external links
    if (linkPath.startsWith("http://") || linkPath.startsWith("https://")) {
      continue;
    }

    // Skip anchor links
    if (linkPath.startsWith("#")) {
      continue;
    }

    // Resolve relative path
    const fullPath = resolve(skillPath, linkPath);

    if (!existsSync(fullPath)) {
      result.errors.push(`Broken link: ${linkPath} (referenced as "${linkText}")`);
    } else {
      const relativePath = linkPath.replace(/^\.\//, "");
      if (!result.stats.files.includes(relativePath)) {
        result.stats.files.push(relativePath);
      }
    }
  }

  // ─── Command Validation ───────────────────────────────────────────────────

  const skillName = frontmatter.name;
  if (skillName) {
    // Determine if this is an agent-kit skill
    const isAgentKit = skillPath.includes("content/skills");

    // Determine expected command path
    const commandName = isAgentKit ? `ak-${skillName}` : skillName;
    const commandPath = skillPath
      .replace("/skills/", "/commands/")
      .replace(`/${skillName}`, `/${commandName}.md`);

    if (!existsSync(commandPath)) {
      if (isAgentKit) {
        result.warnings.push(
          `No slash command found. Expected: ${commandPath.split("/").pop()}`
        );
        result.warnings.push(
          "agent-kit commands must use 'ak-' prefix: ak-{skill-name}.md"
        );
      } else {
        result.warnings.push(
          `No slash command found at ${commandPath.split("/").pop()}`
        );
      }
    } else {
      // Verify command references the skill
      const commandContent = readFileSync(commandPath, "utf-8");
      if (!commandContent.includes(`@skills/${skillName}/SKILL.md`) &&
          !commandContent.includes(`skills/${skillName}/SKILL.md`)) {
        result.warnings.push("Command does not reference the skill's SKILL.md");
      }
      result.stats.files.push(`command: ${commandPath.split("/").pop()}`);
    }

    // Check for commands without ak- prefix in content/commands
    if (isAgentKit) {
      const commandsDir = skillPath.replace("/skills/" + skillName, "/commands");
      if (existsSync(commandsDir)) {
        const commandFiles = readdirSync(commandsDir);
        for (const file of commandFiles) {
          if (file.endsWith(".md") && !file.startsWith("ak-") && !file.startsWith(".")) {
            result.warnings.push(
              `Command '${file}' in content/commands/ should use 'ak-' prefix`
            );
          }
        }
      }
    }
  }

  // ─── Metadata Suggestions ──────────────────────────────────────────────────

  if (!frontmatter.license) {
    result.suggestions.push("Consider adding a license field");
  }

  if (!frontmatter.metadata?.version) {
    result.suggestions.push("Consider adding version to metadata");
  }

  // Check for common directories
  const dirs = ["assets", "references", "scripts"];
  for (const dir of dirs) {
    const dirPath = join(skillPath, dir);
    if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
      const files = readdirSync(dirPath);
      for (const file of files) {
        if (!file.startsWith(".")) {
          result.stats.files.push(`${dir}/${file}`);
        }
      }
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Output Formatting
// ─────────────────────────────────────────────────────────────────────────────

const colors = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

function formatResult(result: ValidationResult): string {
  const lines: string[] = [];
  const passed = result.errors.length === 0;

  // Header
  lines.push("");
  lines.push("╭" + "─".repeat(50) + "╮");
  lines.push("│  " + colors.bold(`Skill Validation: ${result.skill || "unknown"}`.padEnd(47)) + "│");
  lines.push("╰" + "─".repeat(50) + "╯");
  lines.push("");

  // Status
  if (passed) {
    lines.push(colors.green("✅ PASSED"));
  } else {
    lines.push(colors.red("❌ FAILED"));
  }
  lines.push("");

  // Summary
  lines.push(`Errors:   ${result.errors.length}`);
  lines.push(`Warnings: ${result.warnings.length}`);
  lines.push(`Info:     ${result.suggestions.length}`);
  lines.push("");

  // Errors
  if (result.errors.length > 0) {
    lines.push(colors.red("❌ Errors (must fix):"));
    for (const error of result.errors) {
      lines.push(`   • ${error}`);
    }
    lines.push("");
  }

  // Warnings
  if (result.warnings.length > 0) {
    lines.push(colors.yellow("⚠️  Warnings (should fix):"));
    for (const warning of result.warnings) {
      lines.push(`   • ${warning}`);
    }
    lines.push("");
  }

  // Suggestions
  if (result.suggestions.length > 0) {
    lines.push(colors.cyan("ℹ️  Suggestions:"));
    for (const suggestion of result.suggestions) {
      lines.push(`   • ${suggestion}`);
    }
    lines.push("");
  }

  // Stats
  lines.push(colors.dim("Files checked:"));
  lines.push(colors.dim(`   ✓ SKILL.md (${result.stats.lines} lines, ~${result.stats.tokens} tokens)`));
  for (const file of result.stats.files.slice(1)) {
    lines.push(colors.dim(`   ✓ ${file}`));
  }
  lines.push("");

  return lines.join("\n");
}

function formatSummary(results: ValidationResult[]): string {
  const lines: string[] = [];
  const passed = results.filter(r => r.errors.length === 0);
  const failed = results.filter(r => r.errors.length > 0);

  lines.push("");
  lines.push("╭" + "─".repeat(50) + "╮");
  lines.push("│  " + colors.bold("Skill Validation Summary".padEnd(47)) + "│");
  lines.push("╰" + "─".repeat(50) + "╯");
  lines.push("");
  lines.push(`Skills checked: ${results.length}`);
  lines.push("");

  for (const result of results) {
    const status = result.errors.length === 0 ? colors.green("✅") : colors.red("❌");
    const name = (result.skill || "unknown").padEnd(20);
    const counts = `${result.errors.length} errors, ${result.warnings.length} warnings`;
    lines.push(`${status} ${name} ${colors.dim(counts)}`);
  }

  lines.push("");
  lines.push(`Overall: ${colors.green(`${passed.length} passed`)}, ${failed.length > 0 ? colors.red(`${failed.length} failed`) : "0 failed"}`);
  lines.push("");

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: validate-skill.ts <skill-path>");
    console.log("       validate-skill.ts --all <skills-dir>");
    process.exit(1);
  }

  if (args[0] === "--all") {
    const skillsDir = args[1] || ".claude/skills";
    
    if (!existsSync(skillsDir)) {
      console.error(`Skills directory not found: ${skillsDir}`);
      process.exit(1);
    }

    const results: ValidationResult[] = [];
    const entries = readdirSync(skillsDir);

    for (const entry of entries) {
      const entryPath = join(skillsDir, entry);
      if (statSync(entryPath).isDirectory() && !entry.startsWith(".")) {
        results.push(validateSkill(entryPath));
      }
    }

    // Print individual results
    for (const result of results) {
      console.log(formatResult(result));
    }

    // Print summary
    console.log(formatSummary(results));

    // Exit with error if any failed
    const failed = results.some(r => r.errors.length > 0);
    process.exit(failed ? 1 : 0);

  } else {
    const skillPath = args[0];

    if (!existsSync(skillPath)) {
      console.error(`Skill path not found: ${skillPath}`);
      process.exit(1);
    }

    const result = validateSkill(skillPath);
    console.log(formatResult(result));

    process.exit(result.errors.length > 0 ? 1 : 0);
  }
}

main();
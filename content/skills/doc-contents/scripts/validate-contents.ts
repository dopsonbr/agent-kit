#!/usr/bin/env bun
/**
 * Validates that CONTENTS.md files include all files in their directory.
 *
 * Usage:
 *   bun run validate-contents.ts [path]
 *
 * Arguments:
 *   path - Directory to validate (default: current directory)
 *
 * Output (JSON):
 *   {
 *     "valid": boolean,
 *     "results": [
 *       {
 *         "contentsPath": string,
 *         "missing": string[],
 *         "extra": string[]
 *       }
 *     ]
 *   }
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname, basename } from "node:path";

interface ValidationResult {
  contentsPath: string;
  missing: string[];
  extra: string[];
}

interface Output {
  valid: boolean;
  results: ValidationResult[];
}

const IGNORED = new Set([
  "CONTENTS.md",
  ".git",
  ".DS_Store",
  "node_modules",
  ".claude",
]);

async function findContentsFiles(dir: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (IGNORED.has(entry.name)) continue;

      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name === "CONTENTS.md") {
        results.push(fullPath);
      }
    }
  }

  // Check root directory too
  try {
    await stat(join(dir, "CONTENTS.md"));
    results.push(join(dir, "CONTENTS.md"));
  } catch {}

  await walk(dir);
  return results;
}

function extractLinkedPaths(content: string): Set<string> {
  const links = new Set<string>();

  // Match markdown table links: | [name](./path) | or | [name/](./path/) |
  // Also match inline links: [name](./path)
  const linkRegex = /\[([^\]]+)\]\(\.\/([^)]+)\)/g;

  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    let path = match[2];
    // Normalize: remove trailing slash for directories
    path = path.replace(/\/$/, "");
    links.add(path);
  }

  return links;
}

async function getDirectoryEntries(dir: string): Promise<Set<string>> {
  const entries = new Set<string>();

  try {
    const items = await readdir(dir, { withFileTypes: true });

    for (const item of items) {
      if (IGNORED.has(item.name)) continue;
      entries.add(item.name);
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return entries;
}

async function validateContentsFile(
  contentsPath: string
): Promise<ValidationResult> {
  const dir = dirname(contentsPath);
  const content = await readFile(contentsPath, "utf-8");

  const linkedPaths = extractLinkedPaths(content);
  const actualEntries = await getDirectoryEntries(dir);

  const missing: string[] = [];
  const extra: string[] = [];

  // Find files/dirs in filesystem but not in CONTENTS.md
  for (const entry of actualEntries) {
    if (!linkedPaths.has(entry)) {
      missing.push(entry);
    }
  }

  // Find links in CONTENTS.md that don't exist in filesystem
  for (const link of linkedPaths) {
    // Only check top-level (not nested paths)
    const topLevel = link.split("/")[0];
    if (!actualEntries.has(topLevel)) {
      extra.push(link);
    }
  }

  return {
    contentsPath,
    missing: missing.sort(),
    extra: extra.sort(),
  };
}

async function main() {
  const targetDir = process.argv[2] || process.cwd();

  const contentsFiles = await findContentsFiles(targetDir);

  if (contentsFiles.length === 0) {
    const output: Output = {
      valid: true,
      results: [],
    };
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  const results: ValidationResult[] = [];

  for (const contentsPath of contentsFiles) {
    const result = await validateContentsFile(contentsPath);
    results.push(result);
  }

  const valid = results.every(
    (r) => r.missing.length === 0 && r.extra.length === 0
  );

  const output: Output = {
    valid,
    results,
  };

  console.log(JSON.stringify(output, null, 2));
  process.exit(valid ? 0 : 1);
}

main().catch((err) => {
  console.error(JSON.stringify({ error: err.message }));
  process.exit(1);
});

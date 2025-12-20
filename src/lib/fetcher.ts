/**
 * GitHub content fetcher
 * 
 * TODO: Implement following Phase 2 plan
 */

import type { Skill, Command } from "../types";

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com";

export interface FetchOptions {
  repo: string;
  branch: string;
  path: string;
}

export function parseSkillMd(content: string): Skill {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    throw new Error("Invalid SKILL.md: missing frontmatter");
  }

  const [, yaml, _body] = frontmatterMatch;
  
  // Simple YAML parsing (key: value format)
  const frontmatter: Record<string, unknown> = {};
  for (const line of yaml.split("\n")) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      let value: unknown = match[2].trim();
      // Handle quoted strings
      if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      frontmatter[match[1]] = value;
    }
  }

  return {
    name: frontmatter.name as string,
    description: frontmatter.description as string,
    license: frontmatter.license as string | undefined,
    metadata: frontmatter.metadata as Record<string, unknown> | undefined,
    content: content,
  };
}

export async function fetchFile(
  repo: string,
  branch: string,
  path: string
): Promise<string> {
  const orgRepo = repo.replace("github:", "");
  const url = `${GITHUB_RAW_BASE}/${orgRepo}/${branch}/${path}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.text();
}

export async function fetchContent(_options: FetchOptions): Promise<{
  skills: Skill[];
  commands: Command[];
}> {
  // TODO: Implement full fetching logic
  // See docs/plans/phase-2-init-plan.md
  
  console.log("Fetching content (not yet implemented)");
  return { skills: [], commands: [] };
}

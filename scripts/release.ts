#!/usr/bin/env bun
/**
 * scripts/release.ts - Create a GitHub release with binary
 * Usage: bun scripts/release.ts v1.0.0
 */

import { $ } from "bun";

const RED = "\x1b[0;31m";
const GREEN = "\x1b[0;32m";
const YELLOW = "\x1b[1;33m";
const NC = "\x1b[0m";

const info = (msg: string) => console.log(`${GREEN}▸${NC} ${msg}`);
const warn = (msg: string) => console.log(`${YELLOW}▸${NC} ${msg}`);
const error = (msg: string) => {
  console.error(`${RED}✗${NC} ${msg}`);
  process.exit(1);
};

// Get version from args
const version = process.argv[2];

if (!version) {
  error("Usage: bun scripts/release.ts <version> (e.g., v1.0.0)");
}

// Validate version format
if (!/^v\d+\.\d+\.\d+$/.test(version)) {
  error("Version must match pattern v*.*.* (e.g., v1.0.0)");
}

// Check prerequisites
async function checkPrereqs() {
  try {
    await $`which gh`.quiet();
  } catch {
    error("gh CLI not found. Install: brew install gh");
  }

  try {
    await $`gh auth status`.quiet();
  } catch {
    error("Not authenticated with gh. Run: gh auth login");
  }

  // Check for uncommitted changes
  const status = await $`git status --porcelain`.text();
  if (status.trim()) {
    warn("You have uncommitted changes.");
    const response = prompt("Continue? (y/N): ");
    if (response?.toLowerCase() !== "y") {
      process.exit(1);
    }
  }

  // Check if tag exists
  try {
    await $`git rev-parse ${version}`.quiet();
    error(`Tag ${version} already exists`);
  } catch {
    // Tag doesn't exist, good
  }
}

async function main() {
  await checkPrereqs();

  const binaryName = "ak-darwin-arm64";
  const binaryPath = `dist/${binaryName}`;

  info("Building standalone executable...");
  await $`bun build src/cli/index.ts --compile --outfile dist/ak-darwin-arm64 --target bun-darwin-arm64`;

  // Verify binary exists
  const file = Bun.file(binaryPath);
  if (!(await file.exists())) {
    error(`Build failed: ${binaryPath} not found`);
  }

  // Verify binary works
  try {
    await $`${binaryPath} --version`.quiet();
  } catch {
    error("Binary verification failed");
  }

  info(`Creating git tag ${version}...`);
  await $`git tag -a ${version} -m ${"Release " + version}`;

  info("Pushing tag to remote...");
  await $`git push origin ${version}`;

  info("Creating GitHub release...");
  await $`gh release create ${version} --title ${version} --generate-notes ${binaryPath}#${binaryName}`;

  info(`Release ${version} created successfully!`);
  console.log("");
  console.log(`View release: https://github.com/dopsonbr/agent-kit/releases/tag/${version}`);
}

main().catch((err) => {
  error(err.message);
});

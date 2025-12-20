#!/usr/bin/env bun

/**
 * agent-kit CLI
 * 
 * Usage:
 *   ak <command> [options]
 * 
 * Commands:
 *   init      Initialize agent-kit in your project
 *   update    Update to the latest version
 *   doctor    Diagnose installation health
 *   help      Show help information
 *   version   Show version
 */

import { parseArgs } from "./parser";
import { route } from "./router";

async function main() {
  const args = parseArgs(process.argv);
  await route(args);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

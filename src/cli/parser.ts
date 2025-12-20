/**
 * CLI argument parser
 */

export interface ParsedArgs {
  command: string;
  flags: Record<string, string | boolean>;
  positional: string[];
}

export function parseArgs(argv: string[]): ParsedArgs {
  // Skip node and script path
  const args = argv.slice(2);
  
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];
  let command = "help";
  let commandSet = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      command = "help";
      commandSet = true;
      continue;
    }

    if (arg === "--version" || arg === "-v") {
      command = "version";
      commandSet = true;
      continue;
    }

    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      
      // Check if next arg is a value (not a flag)
      if (nextArg && !nextArg.startsWith("-")) {
        flags[key] = nextArg;
        i++; // Skip the value
      } else {
        flags[key] = true;
      }
      continue;
    }

    if (arg.startsWith("-")) {
      // Short flag
      const key = arg.slice(1);
      flags[key] = true;
      continue;
    }

    // First non-flag is the command
    if (!commandSet) {
      command = arg;
      commandSet = true;
    } else {
      positional.push(arg);
    }
  }

  return { command, flags, positional };
}

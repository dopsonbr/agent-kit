/**
 * Command router
 */

import type { ParsedArgs } from "./parser";
import { helpCommand } from "./commands/help";
import { versionCommand } from "./commands/version";
import { initCommand } from "./commands/init";
import { updateCommand } from "./commands/update";
import { doctorCommand } from "./commands/doctor";
import { printError, format } from "./output";

type CommandHandler = (args: ParsedArgs) => Promise<void> | void;

const commands: Record<string, CommandHandler> = {
  help: (args) => helpCommand(args.positional),
  version: () => versionCommand(),
  init: initCommand,
  update: updateCommand,
  doctor: doctorCommand,
};

export async function route(args: ParsedArgs): Promise<void> {
  const handler = commands[args.command];

  if (!handler) {
    printError(format.error(`Unknown command: ${args.command}`));
    printError(`Run ${format.command("ak help")} for usage information`);
    process.exit(1);
  }

  try {
    await handler(args);
  } catch (error) {
    printError(format.error(`Command failed: ${args.command}`));
    if (error instanceof Error) {
      printError(error.message);
    }
    process.exit(1);
  }
}

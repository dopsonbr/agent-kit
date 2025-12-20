/**
 * Version command
 */

import { print } from "../output";

// Read version from package.json at build time
const VERSION = "0.1.0";

export function versionCommand(): void {
  print(`agent-kit v${VERSION}`);
}

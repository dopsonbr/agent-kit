/**
 * Version command
 */

import { print } from "../output";
import pkg from "../../../package.json";

export function versionCommand(): void {
  print(`agent-kit v${pkg.version}`);
}

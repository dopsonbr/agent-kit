/**
 * Terminal output utilities
 */

// ANSI escape codes
const ESC = "\x1b[";
const RESET = `${ESC}0m`;

export const colors = {
  green: (text: string) => `${ESC}32m${text}${RESET}`,
  red: (text: string) => `${ESC}31m${text}${RESET}`,
  yellow: (text: string) => `${ESC}33m${text}${RESET}`,
  blue: (text: string) => `${ESC}34m${text}${RESET}`,
  cyan: (text: string) => `${ESC}36m${text}${RESET}`,
  dim: (text: string) => `${ESC}2m${text}${RESET}`,
  bold: (text: string) => `${ESC}1m${text}${RESET}`,
};

export const symbols = {
  check: colors.green("✓"),
  cross: colors.red("✗"),
  warning: colors.yellow("⚠"),
  info: colors.blue("ℹ"),
  arrow: colors.cyan("→"),
};

export const format = {
  success: (message: string) => `${symbols.check} ${message}`,
  error: (message: string) => `${symbols.cross} ${colors.red(message)}`,
  warning: (message: string) => `${symbols.warning} ${colors.yellow(message)}`,
  info: (message: string) => `${symbols.info} ${message}`,
  title: (text: string) => colors.bold(colors.cyan(text)),
  command: (text: string) => colors.cyan(text),
  flag: (text: string) => colors.yellow(text),
};

export function print(...args: unknown[]): void {
  console.log(...args);
}

export function printError(...args: unknown[]): void {
  console.error(...args);
}

export function printBox(title: string, lines: string[]): void {
  const width = Math.max(title.length, ...lines.map(l => l.replace(/\x1b\[[0-9;]*m/g, '').length)) + 4;
  const hr = "─".repeat(width);
  
  print(`╭${hr}╮`);
  print(`│  ${colors.bold(title)}${" ".repeat(Math.max(0, width - title.length - 2))}│`);
  print(`├${hr}┤`);
  for (const line of lines) {
    const cleanLen = line.replace(/\x1b\[[0-9;]*m/g, '').length;
    print(`│  ${line}${" ".repeat(Math.max(0, width - cleanLen - 2))}│`);
  }
  print(`╰${hr}╯`);
}

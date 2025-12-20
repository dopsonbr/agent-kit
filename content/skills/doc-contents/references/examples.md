# Documentation Examples

Real-world examples of well-structured CONTENTS.md and AGENTS.md files.

## Example CONTENTS.md

From a typical src/ directory in a TypeScript project:

```markdown
# src

> Core source code for the application

## Overview

This directory contains the main application source code, organized by feature
and responsibility. The architecture follows a modular pattern with clear
separation between CLI, library, and type definitions.

## Structure

```
src/
├── cli/           # Command-line interface
│   ├── index.ts   # Entry point
│   ├── commands/  # Command handlers
│   └── output.ts  # Terminal formatting
├── lib/           # Core library
│   ├── config.ts  # Configuration management
│   ├── fetcher.ts # HTTP utilities
│   └── utils.ts   # Shared utilities
└── types/         # TypeScript definitions
    └── index.ts   # Shared types
```

## Contents

### CLI

| File | Description |
|------|-------------|
| [cli/index.ts](./cli/index.ts) | Main entry point, argument parsing |
| [cli/commands/](./cli/commands/) | Individual command implementations |
| [cli/output.ts](./cli/output.ts) | Terminal colors and formatting |

### Library

| File | Description |
|------|-------------|
| [lib/config.ts](./lib/config.ts) | Load, save, and merge configuration |
| [lib/fetcher.ts](./lib/fetcher.ts) | GitHub API and content fetching |
| [lib/utils.ts](./lib/utils.ts) | Shared utility functions |

### Types

| File | Description |
|------|-------------|
| [types/index.ts](./types/index.ts) | Shared TypeScript interfaces |

## Key Files

**cli/index.ts** - The main entry point that parses arguments and routes to
command handlers. Start here to understand the application flow.

**lib/config.ts** - Manages all configuration loading and saving. Central to
how the application persists user preferences.

## Related

- [tests/](../tests/) - Unit and integration tests
- [docs/](../docs/) - Additional documentation
```

## Example AGENTS.md

From a Node.js CLI project:

```markdown
# AGENTS.md

A CLI tool for managing AI coding agent configurations.

## Project Overview

agent-kit provides a unified way to configure AI coding assistants like Claude
Code, GitHub Copilot, and OpenAI Codex. It fetches skills and commands from a
central repository and installs them locally with appropriate formats for each
tool.

## Build Commands

```bash
bun install          # Install dependencies
bun run dev          # Development mode with watch
bun run build        # Build for production
bun test             # Run tests
bun run lint         # Lint code
bun run typecheck    # Type check without emit
```

## Code Style

- TypeScript 5.x with strict mode
- Bun as runtime and package manager
- No semicolons, single quotes
- Functional patterns preferred
- ESLint + Prettier for formatting

## Project Structure

```
agent-kit/
├── src/
│   ├── cli/         # CLI implementation
│   ├── lib/         # Core library functions
│   └── types/       # TypeScript definitions
├── content/
│   └── skills/      # Bundled skill definitions
├── tests/           # Test files mirror src structure
└── docs/
    └── plans/       # Implementation plans
```

## Testing

Uses Bun's built-in test runner. All code requires tests following TDD.

- Run all: `bun test`
- Run specific: `bun test tests/cli/parser.test.ts`
- Watch mode: `bun test --watch`

Write failing tests first (RED), then implement (GREEN), then refactor.

## Commit Guidelines

Use Conventional Commits:

```
feat(cli): add init command
fix(lib): handle network timeout
test(parser): add edge case tests
docs: update installation instructions
chore: update dependencies
```

## Available Skills

- **brainstorm** - Interactive ideation sessions
- **create-plan** - Generate implementation plans
- **implement-plan** - Execute plans autonomously
- **review-code** - Review changes before commit

Use `/skill-name` in Claude Code to invoke.

## Key Conventions

- Every exported function needs JSDoc comments
- Errors should be wrapped in custom error types
- All file paths use forward slashes (Unix style)
- Configuration is JSON, never YAML
```

## Best Practices

### CONTENTS.md

1. **Be concise** - One line per file/directory
2. **Group logically** - By feature, not alphabetically
3. **Link everything** - Make navigation easy
4. **Update regularly** - Keep in sync with actual structure

### AGENTS.md

1. **Commands first** - AI agents need to know how to build/test
2. **Be specific** - "Use ESLint" not "Follow best practices"
3. **Include examples** - Show exact commands
4. **Stay current** - Outdated info causes errors

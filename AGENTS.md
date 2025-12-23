# AGENTS.md

This is **agent-kit** - a CLI for managing AI coding agent configurations.

## Project Overview

agent-kit (`ak`) is a Bun-based CLI tool distributed via npm. It fetches skills, commands, templates, and standards from its GitHub repository and installs them locally in projects. It supports multiple AI coding agents including Claude Code, GitHub Copilot, and OpenAI Codex.

## Dogfooding Setup

This project uses its own skills for development via symlinks:

```
.claude/skills/   → content/skills/   (symlink)
.claude/commands/ → content/commands/ (symlink)
```

**This means:**
- Skills in `content/skills/` are immediately available to Claude Code
- Changes to skills take effect without reinstallation
- Use `/create-skill` to create new skills
- Use `/create-plan` to plan new features

**Available commands:**
- `/create-skill` - Create a new Agent Skill
- `/create-plan` - Create an implementation plan (when skill exists)

**To verify setup:**
```bash
ls -la .claude/
# Should show symlinks to content/
```

## Build Commands

```bash
bun install          # Install dependencies
bun test             # Run tests
bun test --watch     # Watch mode
bun run build        # Build CLI
bun run dev          # Development mode
bun run typecheck    # Type check
bun run lint         # Lint code
```

## Code Style

- TypeScript strict mode
- oxlint + oxfmt (https://oxc.rs) - faster than ESLint/Prettier
- Conventional commits (feat:, fix:, chore:, etc.)
- No semicolons, single quotes
- Functional patterns preferred

## Testing

All code must have tests. Follow TDD:
1. Write failing test first (RED)
2. Implement minimal code to pass (GREEN)
3. Refactor if needed

Tests use Bun's built-in test runner:
```bash
bun test tests/cli/parser.test.ts  # Run specific test
bun test --grep "pattern"           # Filter tests
```

## Project Structure

```
src/
├── cli/              # CLI implementation
│   ├── index.ts      # Entry point
│   ├── parser.ts     # Argument parser
│   ├── router.ts     # Command router
│   ├── output.ts     # Terminal output utilities
│   └── commands/     # Command handlers
├── lib/              # Core library
│   ├── config.ts     # Configuration management
│   ├── fetcher.ts    # GitHub content fetcher
│   ├── installer.ts  # Local installation
│   ├── generator.ts  # AGENTS.md generator
│   └── delegators/   # Tool delegation
└── types/            # Type definitions

content/              # Canonical content (fetched by CLI)
├── skills/           # SKILL.md files
├── commands/         # Command definitions
├── standards/        # Format standards
└── templates/        # Document templates

docs/
├── plans/            # Implementation plans
├── ideas/            # Brainstorm outputs
└── adrs/             # Architecture decisions
```

## Available Skills

This project uses its own skills for development:

- **brainstorm** - Interactive ideation with structured questioning
- **create-plan** - Create detailed TDD implementation plans
- **create-adr** - Generate Architectural Decision Records
- **implement-plan** - Autonomous plan execution with reviews
- **review-plan** - Review plans before execution
- **review-code** - Review code changes
- **doc-contents** - Generate documentation
- **skill-creator** - Create new Agent Skills with best practices

## Presets

agent-kit supports presets for different project needs:

| Preset | Use Case |
|--------|----------|
| `standard` | Most projects (default) |
| `full` | Everything included |
| `minimal` | Just AGENTS.md |
| `claude` | Claude Code focused |
| `copilot` | GitHub Copilot focused |
| `codex` | OpenAI Codex focused |
| `planning` | Architecture/design work |
| `review` | Code review workflows |
| `execution` | Autonomous implementation |

See `src/types/presets.ts` for preset definitions.

## Worktree Convention

**IMPORTANT:** All git worktrees MUST be created in `.worktrees/` directory.

```bash
# Correct - always use .worktrees/
git worktree add .worktrees/0042_feature -b feature/0042_feature

# Wrong - do not create worktrees outside the repo
git worktree add ../project-0042 -b feature/0042_feature
```

Naming convention: `.worktrees/{NNNN}_{feature-name}` matching the plan number.

See `content/skills/plan-create/references/worktree-setup.md` for details.

## Development Workflow

1. Use `/brainstorm` to explore new features
2. Use `/create-plan` to create implementation plan
3. Use `/review-plan` to validate the plan
4. Use `/implement-plan` to execute autonomously
5. Use `/review-code` before committing

## Implementation Plans

See `docs/plans/` for implementation plans:
- Phase 0: Bootstrap
- Phase 1: CLI Core
- Phase 2: Init Command
- Phase 3: Update Command
- Phase 4: Doctor Command
- Phase 5: Delegation

## Commit Guidelines

Use conventional commits:
```
feat(cli): add init command
fix(lib): handle network errors
chore: update dependencies
test(cli): add parser tests
docs: update README
```

## PR Guidelines

1. Run all tests: `bun test`
2. Run type check: `bun run typecheck`
3. Run linter: `bun run lint`
4. Use `/review-code --mode branch` before pushing

## Architecture Decisions

See `docs/adrs/` for architecture decision records.

## External Tools

Skills can delegate to external tools:
- **Codex CLI** - For code review with high reasoning
- **Claude CLI** - Alternative for reviews

Configure delegation in `.ak/config.json`.

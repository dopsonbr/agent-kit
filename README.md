# agent-kit

> `ak` - A CLI for managing AI coding agent configurations across tools

[![npm version](https://img.shields.io/npm/v/agent-kit.svg)](https://www.npmjs.com/package/agent-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Bun-based CLI that installs and manages skills, commands, agents, and standards for AI coding assistants. Works with Claude Code, GitHub Copilot, OpenAI Codex, and other [Agent Skills](https://agentskills.io)-compatible tools.

## Quick Start

```bash
# Install
npm install -D agent-kit
# or
bun add -D agent-kit

# Initialize in your project
npx ak init

# Check installation health
npx ak doctor
```

## What It Does

`ak` fetches curated skills, commands, templates, and standards from the [agent-kit repository](https://github.com/YOUR_ORG/agent-kit) and installs them locally in your project. It creates a consistent, portable configuration that works across multiple AI coding agents.

```
your-project/
├── .github/
│   └── skills/              # Agent Skills (GitHub Copilot, VS Code)
│       ├── brainstorm/
│       ├── create-plan/
│       └── ...
├── .claude/
│   ├── skills/              # Claude Code skills (symlinked)
│   ├── commands/            # Slash commands
│   └── settings.json        # Claude configuration
├── AGENTS.md                 # Agent instructions (Codex, Jules, etc.)
├── docs/
│   ├── ideas/               # Brainstorm outputs
│   ├── plans/               # Implementation plans
│   └── adrs/                # Architectural Decision Records
└── .ak/
    ├── config.json          # ak configuration
    └── cache/               # Downloaded content cache
```

## Features

### 🔧 Multi-Agent Compatibility

Works with the [Agent Skills](https://agentskills.io) specification and [AGENTS.md](https://agents.md) format:

| Agent | Support |
|-------|---------|
| Claude Code | ✅ Full (skills, commands, settings) |
| GitHub Copilot | ✅ Full (Agent Skills in .github/skills/) |
| VS Code Copilot | ✅ Full (Agent Skills) |
| OpenAI Codex | ✅ Full (AGENTS.md, skills) |
| Cursor | ✅ Via AGENTS.md |
| Windsurf | ✅ Via AGENTS.md |
| Others | ✅ Via AGENTS.md |

### 🎯 Opinionated Defaults, Full Control

Sensible defaults that you can override:

```jsonc
// .ak/config.json
{
  "defaults": {
    "reviewTool": "codex",        // Delegate reviews to Codex CLI
    "reviewModel": "gpt-5",
    "reviewReasoning": "high",
    "planExecutionMode": "autonomous"
  },
  "overrides": {
    "review-code": {
      "tool": "claude",           // Use Claude instead for this skill
      "model": "claude-sonnet-4-5-20250929"
    }
  }
}
```

### 🔄 Tool Delegation

Delegate specific operations to the best tool for the job:

```bash
# Review code using Codex CLI (default)
ak delegate review-code --mode branch

# Override to use Claude
ak delegate review-code --tool claude --mode uncommitted
```

### 📦 Skills Included

| Skill | Description |
|-------|-------------|
| `brainstorm` | Interactive ideation with structured questioning |
| `create-adr` | Generate Architectural Decision Records |
| `create-plan` | Create detailed TDD implementation plans |
| `implement-plan` | Autonomous plan execution with review gates |
| `review-plan` | Review plans before execution |
| `review-code` | Review code changes with high reasoning |
| `doc-contents` | Generate project documentation |

## Commands

### `ak init`

Initialize agent-kit in your project:

```bash
ak init                      # Interactive setup with standard preset
ak init --preset full        # Install everything
ak init --preset minimal     # Lightweight setup
ak init --preset claude      # Optimized for Claude Code
ak init --yes                # Skip confirmation prompts
ak init --list-presets       # Show all available presets
ak init --preset-info codex  # Details about a specific preset
```

#### Available Presets

| Preset | Description | Skills |
|--------|-------------|--------|
| `standard` | Recommended core skills (default) | brainstorm, create-plan, implement-plan, review-code, doc-contents |
| `full` | Complete setup with all skills | All 7 skills |
| `minimal` | Lightweight AGENTS.md only | brainstorm, doc-contents |
| `claude` | Optimized for Claude Code | All skills, Claude delegation |
| `copilot` | Optimized for GitHub Copilot | Core skills, .github/skills/ focus |
| `codex` | Optimized for OpenAI Codex | All skills, Codex delegation |
| `planning` | Focus on ideation and docs | brainstorm, create-plan, create-adr, doc-contents |
| `review` | Focus on code review | review-plan, review-code |
| `execution` | Focus on autonomous execution | create-plan, implement-plan, review-plan, review-code |

Creates:
- `.github/skills/` - Agent Skills for Copilot
- `.claude/skills/` - Skills for Claude Code (symlinked)
- `.claude/commands/` - Slash commands
- `.claude/settings.json` - Claude configuration
- `AGENTS.md` - Agent instructions
- `docs/` - Output directories
- `.ak/config.json` - Configuration

### `ak update`

Update to the latest version:

```bash
ak update                  # Update skills and CLI
ak update --skills-only    # Only update skills
ak update --cli-only       # Only update CLI
ak update --check          # Check for updates without installing
```

### `ak doctor`

Diagnose installation health:

```bash
ak doctor
```

Output:
```
agent-kit v1.0.0

✓ .github/skills/ exists (7 skills)
✓ .claude/skills/ exists (symlinked)
✓ .claude/commands/ exists (7 commands)
✓ .claude/settings.json valid
✓ AGENTS.md exists
✓ docs/ structure valid
✓ Codex CLI available (v1.2.3)
✓ Claude Code available (v2.0.0)

All checks passed!
```

### `ak help`

Show help:

```bash
ak help              # General help
ak help init         # Command-specific help
ak help skills       # List available skills
```

### `ak version`

Show version:

```bash
ak version
# agent-kit v1.0.0
```

## Configuration

### `.ak/config.json`

```jsonc
{
  "$schema": "https://agent-kit.dev/schema/config.json",
  "version": "1.0.0",
  
  // Source repository for skills/commands
  "source": {
    "repo": "github:YOUR_ORG/agent-kit",
    "branch": "main",
    "path": "content"
  },
  
  // Which agent platforms to configure
  "targets": {
    "claude": true,
    "copilot": true,
    "agentsMd": true
  },
  
  // Default tool for delegated operations
  "defaults": {
    "reviewTool": "codex",
    "reviewModel": "gpt-5",
    "reviewReasoning": "high",
    "planExecutionMode": "autonomous",
    "checkpointInterval": 5
  },
  
  // Per-skill overrides
  "overrides": {
    "review-code": {
      "tool": "claude"
    }
  },
  
  // Skills to exclude
  "exclude": [],
  
  // Additional skills from other sources
  "include": [
    "github:other-org/custom-skills#skill-name"
  ]
}
```

### `.claude/settings.json`

Generated automatically with sensible defaults:

```jsonc
{
  "agent-kit": {
    "version": "1.0.0",
    "installed": true
  },
  "permissions": {
    "allowedTools": ["Read", "Write", "Edit", "Bash", "Skill"]
  },
  "implement-plan": {
    "mode": "autonomous",
    "checkpointInterval": 5,
    "reviewTool": "codex",
    "reviewModel": "gpt-5",
    "reviewReasoning": "high"
  }
}
```

## Architecture

### Compatibility Strategy

agent-kit generates configurations for multiple formats:

```
agent-kit repo
     │
     ├── content/
     │   ├── skills/           # Canonical SKILL.md files
     │   ├── commands/         # Claude slash commands
     │   ├── standards/        # Shared standards
     │   └── templates/        # Document templates
     │
     └── generates →
             │
             ├── .github/skills/    # Agent Skills format
             ├── .claude/skills/    # Claude Code (symlinks)
             ├── .claude/commands/  # Claude slash commands
             └── AGENTS.md          # Combined instructions
```

### Skill Format

Skills follow the [Agent Skills specification](https://agentskills.io/specification):

```markdown
---
name: skill-name
description: What it does and when to use it
license: MIT
metadata:
  author: agent-kit
  version: "1.0.0"
---

# Skill Instructions

Your detailed instructions here...
```

### AGENTS.md Generation

The generated AGENTS.md combines relevant context:

```markdown
# AGENTS.md

## Project Context

[Auto-generated from ak config]

## Available Skills

This project uses agent-kit skills. Invoke them when relevant:
- brainstorm: Interactive ideation
- create-plan: Implementation planning
- ...

## Standards

[Links to standards documents]

## Commands

[Available slash commands for Claude Code]
```

## Development

agent-kit uses itself for development:

```bash
# Clone and install
git clone https://github.com/YOUR_ORG/agent-kit
cd agent-kit
bun install

# Use included skills to develop
# Claude Code will use .claude/skills/ and .claude/commands/

# Brainstorm a feature
/brainstorm

# Create implementation plan
/create-plan

# Execute with review
/implement-plan
```

### Project Structure

```
agent-kit/
├── src/
│   ├── cli/                 # CLI implementation
│   │   ├── index.ts         # Entry point
│   │   ├── commands/        # Command handlers
│   │   └── utils/           # Shared utilities
│   └── lib/
│       ├── fetcher.ts       # GitHub content fetcher
│       ├── installer.ts     # Local installation
│       ├── generator.ts     # Format generators
│       └── config.ts        # Configuration handling
├── content/
│   ├── skills/              # SKILL.md files
│   ├── commands/            # Command definitions
│   ├── standards/           # Standards documents
│   └── templates/           # Document templates
├── docs/
│   ├── plans/               # Implementation plans
│   └── adrs/                # Architecture decisions
├── tests/
├── package.json
├── bunfig.toml
├── AGENTS.md                # For developing agent-kit
├── .claude/                 # Claude Code config
└── .github/
    └── skills/              # Symlinked for self-use
```

## Roadmap

- [ ] `ak add <skill>` - Add skills from external sources
- [ ] `ak remove <skill>` - Remove installed skills
- [ ] `ak list` - List installed skills
- [ ] `ak run <skill>` - Invoke a skill directly
- [ ] `ak sync` - Sync with team configuration
- [ ] Plugin system for custom generators
- [ ] VS Code extension
- [ ] MCP server mode

## Contributing

Contributions welcome! Use the included skills:

1. `/brainstorm` your idea
2. `/create-plan` for implementation
3. `/implement-plan` to execute
4. `/review-code` before PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT © agent-kit contributors

---

Built with [Agent Skills](https://agentskills.io) • Compatible with [AGENTS.md](https://agents.md)

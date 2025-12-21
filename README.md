# agent-kit

> Curated skills, commands, and standards for Claude Code

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A collection of battle-tested [Agent Skills](https://agentskills.io) for Claude Code. Install with a single command and supercharge your AI-assisted development workflow.

## Quick Start

```bash
curl -fsSL https://raw.githubusercontent.com/dopsonbr/agent-kit/main/install.sh | bash
```

This installs skills, commands, and standards into your project's `.claude/` directory.

## Installation Options

### Install Everything

```bash
curl -fsSL https://raw.githubusercontent.com/dopsonbr/agent-kit/main/install.sh | bash -s -- --all
```

### Choose What to Install

```bash
curl -fsSL https://raw.githubusercontent.com/dopsonbr/agent-kit/main/install.sh | bash
```

Interactive menu lets you select from logical groups:

| Group | Includes | Description |
|-------|----------|-------------|
| **Planning** | `create-plan`, `review-plan`, `merge-archive-plan` | Design before you build |
| **Implementation** | `plan-execute`, `review-implementation` | Autonomous execution with reviews |
| **Documentation** | `doc-contents`, `create-adr` | Keep docs in sync |
| **Skills Development** | `skill-creator`, `skill-validator` | Create and validate new skills |
| **Community** | `user-request`, `user-contribution` | Contribute back to agent-kit |

## What Gets Installed

```
your-project/
├── .claude/
│   ├── skills/           # Agent Skills
│   │   ├── create-plan/
│   │   ├── plan-execute/
│   │   └── ...
│   ├── commands/         # Slash commands
│   └── settings.json     # Claude configuration
├── CLAUDE.md             # Project instructions for Claude
└── docs/
    ├── plans/            # Implementation plans
    └── adrs/             # Architecture decisions
```

## Available Skills

### Planning & Design

| Skill | Description |
|-------|-------------|
| `create-plan` | Create detailed implementation plans with diagrams |
| `review-plan` | Review and validate plans before execution |
| `merge-archive-plan` | Archive completed plans with summary |

### Implementation

| Skill | Description |
|-------|-------------|
| `plan-execute` | Autonomous plan execution with checkpoints |
| `review-implementation` | Review code against plan requirements |

### Documentation

| Skill | Description |
|-------|-------------|
| `doc-contents` | Generate CONTENTS.md and AGENTS.md files |
| `create-adr` | Create Architecture Decision Records |

### Skills Development

| Skill | Description |
|-------|-------------|
| `skill-creator` | Create new Agent Skills with best practices |
| `skill-validator` | Validate skills against the specification |

### Community

| Skill | Description |
|-------|-------------|
| `user-request` | Request new functionality via GitHub issue |
| `user-contribution` | Contribute skills/standards via GitHub PR |

## Usage

Once installed, use slash commands in Claude Code:

```
/create-plan       # Plan a new feature
/plan-execute      # Execute a plan autonomously
/review-plan       # Review a plan before implementation
/doc-contents      # Generate project documentation
```

Or invoke skills directly:

```
Use the create-plan skill to design a caching layer
```

## Roadmap

### ✅ Implemented

- [x] Core skills (planning, execution, documentation)
- [x] Slash commands for Claude Code
- [x] CLAUDE.md generation
- [x] Skill validation
- [x] Install script with selection menu

### 🚧 In Progress

- [ ] `user-request` skill - Create GitHub issues for feature requests
- [ ] `user-contribution` skill - Create PRs for community contributions
- [ ] `ak` CLI for managing installations

### 📋 Planned

- [ ] **Parallel skill execution** - Run multiple skills concurrently using best-fit models
- [ ] **Model routing** - Automatically select optimal model per skill (Haiku for quick tasks, Opus for complex reasoning)
- [ ] **Skill composition** - Chain skills together in workflows
- [ ] **Team presets** - Share skill configurations across teams
- [ ] **MCP server mode** - Expose skills as MCP tools
- [ ] **VS Code extension** - GUI for skill management
- [ ] **Skill marketplace** - Discover and install community skills

## Project Structure

```
agent-kit/
├── content/
│   ├── skills/           # Agent Skills (SKILL.md format)
│   │   ├── create-plan/
│   │   ├── plan-execute/
│   │   └── ...
│   └── commands/         # Slash command definitions
├── install.sh            # Installation script
├── docs/
│   ├── plans/            # Implementation plans
│   └── adrs/             # Architecture decisions
└── CLAUDE.md             # Development instructions
```

## Contributing

We encourage contributions! Use the built-in skills to help:

### Request a Feature

```
Use the user-request skill to request [your idea]
```

This creates a well-formatted GitHub issue with your request.

### Contribute a Skill

```
Use the user-contribution skill to contribute [your skill/enhancement]
```

This guides you through creating a PR with proper formatting.

### Manual Contribution

1. Fork and clone the repo
2. Create your skill in `content/skills/your-skill/`
3. Use `/skill-validator` to validate
4. Submit a PR

See [CLAUDE.md](CLAUDE.md) for development instructions.

## Skill Format

Skills follow the [Agent Skills specification](https://agentskills.io):

```markdown
---
name: skill-name
description: What it does and when to use it
---

# Skill Instructions

Your detailed instructions here...
```

## License

MIT © agent-kit contributors

---

Built with [Agent Skills](https://agentskills.io)

# Content Directory

This directory contains the canonical skill and command definitions that `ak init` fetches and installs.

## Structure

```
content/
├── skills/              # Agent Skills (SKILL.md files)
│   ├── {skill-name}/
│   │   ├── SKILL.md     # Main skill instructions
│   │   ├── assets/      # Templates, images, data files
│   │   ├── references/  # Additional documentation
│   │   └── scripts/     # Executable code
│   └── ...
└── commands/            # Claude Code slash commands
    ├── {command}.md
    └── ...
```

## Skill Structure

Each skill is self-contained with its own bundled resources. This follows the [Agent Skills specification](https://agentskills.io/specification).

### SKILL.md

The main file with YAML frontmatter and instructions:

```markdown
---
name: skill-name
description: What it does and when to use it
license: MIT
metadata:
  author: agent-kit
  version: "1.0.0"
---

# Skill Name

Instructions here...
```

### assets/

Templates and static resources the skill uses:
- `template.md` - Document templates
- `example.json` - Example data files
- `diagram.png` - Visual references

### references/

Additional documentation loaded on-demand:
- `advanced.md` - Advanced usage guide
- `examples.md` - Detailed examples
- `troubleshooting.md` - Common issues

### scripts/

Executable code for deterministic operations:
- `generate.py` - Generation scripts
- `validate.sh` - Validation utilities

## Loading Behavior

Skills use progressive disclosure (Level 1-3 loading):

1. **Level 1** (always loaded): `name` and `description` from frontmatter
2. **Level 2** (when triggered): Full SKILL.md body
3. **Level 3** (as needed): Files from assets/, references/, scripts/

This keeps context window usage efficient - only relevant content loads.

## Commands

Commands are simpler - just markdown files that reference skills:

```markdown
---
description: Start an interactive brainstorming session
---

Use and follow the brainstorm skill exactly as written in @skills/brainstorm/SKILL.md
```

## Adding New Skills

1. Create directory: `skills/{skill-name}/`
2. Create `SKILL.md` with frontmatter
3. Add `assets/` for templates
4. Add `references/` for additional docs
5. Add `scripts/` for executable code
6. Update presets in `src/types/presets.ts` if needed

## Compatibility

This structure is compatible with:
- [Agent Skills](https://agentskills.io) - Anthropic's skill format
- Claude Code - Native skill support
- GitHub Copilot - Via `.github/skills/`
- VS Code - Via Agent Skills extension
- OpenAI Codex - Via skills system

---
name: doc-contents
description: Generate project documentation including CONTENTS.md navigation files and AGENTS.md instructions. Use when creating documentation structure, project indexes, or AI agent configuration files.
license: MIT
metadata:
  author: agent-kit
  version: "1.0.0"
---

# Documentation Contents Generator

Generate well-structured project documentation that helps both humans and AI agents navigate your codebase.

## Capabilities

1. **CONTENTS.md** - Navigation indexes for directories
2. **AGENTS.md** - AI agent instructions and context
3. **README sections** - Module/package documentation

## When to Use

- Setting up a new project
- Reorganizing project structure
- Onboarding new team members or AI agents
- Creating navigation for complex directories

## CONTENTS.md Generation

CONTENTS.md files serve as navigation indexes, similar to a book's table of contents.

### Placement Strategy

```
project/
├── CONTENTS.md          # Root: Project overview + top-level navigation
├── src/
│   ├── CONTENTS.md      # Source overview + module listing
│   ├── components/
│   │   └── CONTENTS.md  # Component catalog
│   └── utils/
│       └── CONTENTS.md  # Utility function index
└── docs/
    └── CONTENTS.md      # Documentation structure
```

### Generation Process

1. **Scan directory** - List all files and subdirectories
2. **Categorize** - Group by type (code, docs, config, tests)
3. **Describe** - Add brief descriptions for each item
4. **Link** - Create relative links for navigation
5. **Format** - Use the template from [assets/contents-template.md](assets/contents-template.md)

### Template Reference

See [assets/contents-template.md](assets/contents-template.md) for the standard format.

## AGENTS.md Generation

AGENTS.md provides context for AI coding agents (Codex, Cursor, Claude Code, etc.).

### Content Structure

1. **Project Overview** - What the project does
2. **Build Commands** - How to build, test, run
3. **Code Style** - Conventions and patterns
4. **Testing** - How to write and run tests
5. **Available Skills** - If using agent-kit
6. **Commit Guidelines** - PR and commit conventions

### Generation Process

1. **Detect project type** - Language, framework, build system
2. **Extract commands** - From package.json, Makefile, etc.
3. **Infer conventions** - From existing code patterns
4. **Compile context** - Merge all relevant information
5. **Format** - Use the template from [assets/agents-template.md](assets/agents-template.md)

### Template Reference

See [assets/agents-template.md](assets/agents-template.md) for the standard format.

## Language-Specific Behavior

### Node.js / TypeScript
- Parse `package.json` for scripts
- Check for `tsconfig.json` patterns
- Detect framework (React, Next.js, Express, etc.)

### Python
- Parse `pyproject.toml`, `setup.py`, `requirements.txt`
- Check for framework markers (Django, Flask, FastAPI)
- Detect test framework (pytest, unittest)

### Go
- Parse `go.mod` for module info
- Check for `Makefile` commands
- Detect project structure (cmd/, pkg/, internal/)

### Rust
- Parse `Cargo.toml` for crate info
- Extract workspace structure if applicable

### Generic
- Look for `Makefile`, `justfile`, or similar
- Check for CI configuration (.github/workflows/, etc.)
- Parse any README.md for context

## Output Locations

| File | Location | Purpose |
|------|----------|---------|
| CONTENTS.md | Each significant directory | Navigation index |
| AGENTS.md | Project root | AI agent context |
| README updates | Module directories | Human documentation |

## Examples

### Example: Generate CONTENTS.md for src/

```
User: Create a CONTENTS.md for the src directory

Claude: [Scans src/ directory]
[Reads assets/contents-template.md]
[Generates CONTENTS.md with file listings and descriptions]
```

### Example: Generate AGENTS.md for project

```
User: Create an AGENTS.md for this project

Claude: [Detects Node.js project from package.json]
[Extracts scripts: dev, build, test, lint]
[Reads assets/agents-template.md]
[Generates AGENTS.md with project context]
```

## Integration with agent-kit

If the project uses agent-kit, include:
- Available skills list
- Slash commands
- Configuration from .ak/config.json

## Related Skills

- `create-plan` - For implementation planning docs
- `create-adr` - For architecture decision records
- `brainstorm` - For design exploration docs

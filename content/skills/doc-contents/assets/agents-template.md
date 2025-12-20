# AGENTS.md Template

## Root AGENTS.md (Project Root)

Contains project-wide context for AI agents.

---

# AGENTS.md

{One-line project description}

## Build Commands

```bash
{package_manager} install    # Install dependencies
{package_manager} run dev    # Start development server
{package_manager} run build  # Build for production
{package_manager} test       # Run tests
```

## Code Style

- {Language/framework}
- {Key conventions: formatting, linting, patterns}

## Testing

- Run tests: `{test command}`
- {Test framework and approach}

## Commit Format

```
{type}({scope}): {description}
```

## Available Skills

- **{skill-name}** - {Brief description}

---

## Nested AGENTS.md (Subdirectories)

Place in subdirectories that have **directory-specific conventions** not covered by the root file.

**Critical rule:** Never repeat instructions from parent AGENTS.md files. Only include what's unique to this directory.

### Example: `src/components/AGENTS.md`

```markdown
# Components

## Conventions

- Use functional components with hooks
- Props interface named `{ComponentName}Props`
- Co-locate tests as `{Component}.test.tsx`
```

### When to Create Nested AGENTS.md

- Directory has unique patterns not used elsewhere
- Specific testing or naming conventions for this area
- Technology-specific guidance (e.g., database layer conventions)

### When NOT to Create

- Conventions already covered in root AGENTS.md
- Directory follows project-wide standards
- Would just repeat parent instructions

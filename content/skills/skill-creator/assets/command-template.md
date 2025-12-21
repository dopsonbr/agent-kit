# Command Template

Use this template when creating slash commands for skills.

---

```markdown
---
description: {One-line description matching skill purpose}
arguments:
  - name: {primary-arg}
    description: {What this argument configures or specifies}
    required: false
---

Use the {skill-name} skill to help the user {accomplish the main task}.

Follow the {skill-name} skill instructions in @skills/{skill-name}/SKILL.md exactly.

Key steps:
1. {First major step from skill workflow}
2. {Second major step from skill workflow}
3. {Third major step from skill workflow}
4. {Additional steps as needed}

Use the templates from:
- @skills/{skill-name}/assets/{template-file}.md - For {purpose}

If arguments were provided, use them. Otherwise, ask the user for the required information.
```

---

## Template Notes

### Frontmatter Fields

**description** (required):
- One line, matches skill description but action-oriented
- Should complete the sentence: "This command will..."
- Example: `Create a new implementation plan with TDD approach`

**arguments** (optional):
- Define parameters users can pass to the command
- Each argument has: `name`, `description`, `required`
- Common patterns:
  - `name` - Name/identifier for something being created
  - `path` - File or directory path
  - `mode` - Operating mode (e.g., `--mode strict`)

### Command Body

**Structure:**
1. State which skill to use
2. Reference the skill file with `@skills/` syntax
3. List key steps (extracted from skill workflow)
4. Reference any assets/templates
5. Explain argument handling

**Best Practices:**
- Keep command body concise (10-20 lines)
- The skill contains detailed instructions; don't duplicate them
- Use `@skills/` and `@` references for file paths
- Always handle both "argument provided" and "no argument" cases

### Naming Convention

Command filename should match skill name:
```
Skill: content/skills/my-skill/SKILL.md
Command: content/commands/my-skill.md

Usage: /my-skill
       /my-skill some-argument
```

### Examples

**Simple command:**
```markdown
---
description: Generate API documentation from code
---

Use the api-docs skill to generate documentation.

Follow @skills/api-docs/SKILL.md for the complete workflow.
```

**Command with arguments:**
```markdown
---
description: Create a new React component with tests
arguments:
  - name: component-name
    description: Name of the component to create
    required: false
  - name: path
    description: Directory to create component in
    required: false
---

Use the react-component skill to create a new component.

Follow @skills/react-component/SKILL.md exactly.

If component-name was provided, use it. Otherwise, ask what component to create.
If path was provided, create there. Otherwise, use the standard components directory.
```

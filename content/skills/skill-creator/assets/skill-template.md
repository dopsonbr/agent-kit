# Skill Template

Use this template when creating new skills.

---

```markdown
---
name: {skill-name}
description: {What the skill does}. Use when {trigger conditions}.
license: MIT
metadata:
  author: {author}
  version: "1.0.0"
---

# {Skill Title}

{One paragraph overview of what this skill does and why it's useful.}

## Purpose

{Explain the core capability this skill provides.}

## When to Use

- {Trigger condition 1}
- {Trigger condition 2}
- {Trigger condition 3}

## How It Works

### Step 1: {First Step}

{Explanation of what happens first.}

### Step 2: {Second Step}

{Explanation of next step.}

### Step 3: {Final Step}

{Explanation of completion.}

## Instructions

{Detailed instructions for Claude to follow when this skill is activated.}

### {Subsection if needed}

{More detailed guidance.}

## Examples

### Example 1: {Scenario}

```
User: {Example user request}

Claude: {How Claude should respond}
```

### Example 2: {Another Scenario}

```
User: {Example user request}

Claude: {How Claude should respond}
```

## Output

{Describe what the skill produces - files, responses, actions.}

| Output | Location | Description |
|--------|----------|-------------|
| {output} | {path} | {what it is} |

## Configuration

{If the skill has configurable options, document them here.}

## Related Skills

- `{related-skill}` - {How it relates}
- `{related-skill}` - {How it relates}
```

---

## Template Notes

### Required Sections
- Frontmatter (name, description)
- Purpose or overview
- When to Use
- Instructions or How It Works
- Examples

### Optional Sections
- Configuration
- Output locations
- Related skills
- Troubleshooting

### Frontmatter Tips

**name**: 
- Lowercase, hyphens only
- Descriptive but concise
- Examples: `code-review`, `api-docs`, `test-generator`

**description**:
- First part: What it does
- Second part: When to use it (trigger words)
- Keep under 1024 characters
- Include keywords users might say

### Size Guidelines

- SKILL.md body: < 5000 tokens
- Each reference file: < 3000 tokens
- Total skill: No hard limit (progressive loading)

### Testing Your Skill

After creating:
1. Open a new Claude Code session
2. Ask something matching your trigger conditions
3. Verify skill activates
4. Check output quality
5. Iterate on instructions

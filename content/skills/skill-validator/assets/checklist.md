# Skill Validation Checklist

Quick reference for manual validation.

## ❌ Errors (Must Fix)

### Frontmatter

- [ ] `name` field exists
- [ ] `name` is lowercase letters, numbers, hyphens only
- [ ] `name` is max 64 characters
- [ ] `name` doesn't contain "anthropic" or "claude"
- [ ] `name` doesn't contain XML tags
- [ ] `description` field exists
- [ ] `description` is max 1024 characters
- [ ] `description` doesn't contain XML tags

### Files

- [ ] SKILL.md exists in skill directory
- [ ] All `[text](path)` links resolve to existing files

## ⚠️ Warnings (Should Fix)

### Description

- [ ] Includes "Use when..." or similar trigger phrase
- [ ] Explains WHAT the skill does
- [ ] Explains WHEN to use it

### Content

- [ ] SKILL.md body is under 5000 tokens (~20,000 chars)
- [ ] Has Examples or Usage section
- [ ] Examples are concrete (show input → output)

### Structure

- [ ] Has clear section headers
- [ ] Code blocks have language specified
- [ ] Instructions are actionable (imperative mood)

## ℹ️ Suggestions (Nice to Have)

### Metadata

- [ ] `license` field specified
- [ ] `version` in metadata
- [ ] `author` in metadata

### Content

- [ ] Has Purpose or Overview section
- [ ] Has Related Skills section
- [ ] Has troubleshooting info for complex skills

### Organization

- [ ] Templates in `assets/` directory
- [ ] Extended docs in `references/` directory
- [ ] Automation scripts in `scripts/` directory

## Quick Token Estimate

```
Characters ÷ 4 ≈ Tokens

1,000 chars  ≈ 250 tokens
5,000 chars  ≈ 1,250 tokens
10,000 chars ≈ 2,500 tokens
20,000 chars ≈ 5,000 tokens (limit)
```

## Common Issues

### "Name must be lowercase"
```yaml
# ❌ Wrong
name: My-Skill
name: mySkill

# ✅ Correct
name: my-skill
```

### "Description missing trigger"
```yaml
# ❌ Wrong
description: Generates code documentation

# ✅ Correct
description: Generate code documentation. Use when creating API docs or README files.
```

### "Broken link"
```markdown
# ❌ Wrong (file doesn't exist)
See [template](assets/tempalte.md)

# ✅ Correct
See [template](assets/template.md)
```

### "Token limit exceeded"
Move detailed content to references/:
```markdown
# In SKILL.md
For advanced usage, see [references/advanced.md](references/advanced.md).
```
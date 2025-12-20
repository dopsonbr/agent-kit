# Skill Authoring Best Practices

Detailed guidance for writing effective skills.

## Description Writing

The description is the most important part - it determines when your skill activates.

### Pattern: What + When

```yaml
# ❌ Too vague
description: Helps with testing

# ❌ Only what, no when  
description: Generates unit tests for JavaScript code

# ✅ What + When
description: Generate unit tests for JavaScript and TypeScript. Use when writing tests, creating test suites, or adding coverage to existing code.
```

### Include Trigger Words

Think about what users might say:

```yaml
# For a database skill
description: Design database schemas and write SQL queries. Use when creating tables, migrations, database design, or optimizing queries.

# Trigger words: database, schema, SQL, tables, migrations, queries
```

### Be Specific About Scope

```yaml
# ❌ Too broad
description: Helps with React development

# ✅ Specific scope
description: Review React components for performance issues and accessibility. Use when optimizing components, checking a11y, or reviewing React code.
```

## Instruction Writing

### Use Imperative Mood

```markdown
# ❌ Passive/descriptive
The skill should analyze the code and find issues.

# ✅ Imperative
1. Analyze the code structure
2. Identify potential issues
3. Suggest specific fixes
```

### Be Concrete, Not Abstract

```markdown
# ❌ Abstract
Consider the user's needs and provide appropriate output.

# ✅ Concrete
1. Ask what format they need (Markdown, JSON, HTML)
2. Generate output in that format
3. Save to the specified location
```

### Include Decision Points

```markdown
## When to Use Each Approach

**If the codebase is small (<10 files):**
- Analyze all files directly
- Provide comprehensive report

**If the codebase is large (>10 files):**
- Ask which modules to focus on
- Analyze incrementally
```

## Example Writing

### Show Input and Output

```markdown
### Example: Generate Tests

User: Write tests for the validateEmail function

Claude: [Reads src/utils/validate.ts]
[Creates tests/utils/validate.test.ts]

\`\`\`typescript
describe('validateEmail', () => {
  it('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });
  
  it('rejects invalid email', () => {
    expect(validateEmail('not-an-email')).toBe(false);
  });
});
\`\`\`
```

### Show Edge Cases

```markdown
### Example: Empty Input

User: Generate docs

Claude: I need to know which code to document. Could you specify:
- A file path (e.g., src/utils.ts)
- A directory (e.g., src/components/)
- Or should I scan the whole project?
```

## Structure Patterns

### The Workflow Pattern

For multi-step processes:

```markdown
## Workflow

### Phase 1: Discovery
1. Scan project structure
2. Identify relevant files
3. Build context map

### Phase 2: Analysis  
1. Parse each file
2. Extract information
3. Identify patterns

### Phase 3: Output
1. Apply template
2. Generate content
3. Write to destination
```

### The Decision Tree Pattern

For skills with multiple paths:

```markdown
## Decision Flow

```
Start
  │
  ├─ Is it a new project?
  │   ├─ Yes → Use scaffolding template
  │   └─ No → Analyze existing structure
  │
  ├─ Does config exist?
  │   ├─ Yes → Load and extend
  │   └─ No → Create with defaults
  │
  └─ Generate output
```

### The Checklist Pattern

For validation or review skills:

```markdown
## Review Checklist

### Code Quality
- [ ] No unused variables
- [ ] No console.log statements
- [ ] Error handling present

### Performance
- [ ] No N+1 queries
- [ ] Memoization where needed
- [ ] Lazy loading used

### Security
- [ ] Input validation
- [ ] No hardcoded secrets
- [ ] HTTPS enforced
```

## Common Mistakes

### Too Long

❌ SKILL.md over 5000 tokens

✅ Move detailed content to references/

### Missing Triggers

❌ Description doesn't include "when to use"

✅ Always include trigger conditions

### Too Abstract

❌ "Provide helpful responses"

✅ Specific instructions with examples

### No Examples

❌ Only has instructions

✅ Include 2-3 concrete examples

### Broken References

❌ Links to files that don't exist

✅ Verify all [file](path) links work

## Testing Checklist

Before publishing:

- [ ] Name follows rules (lowercase, hyphens)
- [ ] Description has what + when
- [ ] SKILL.md under 5000 tokens
- [ ] All file references exist
- [ ] Examples are realistic
- [ ] Tested in fresh session
- [ ] Skill activates on trigger phrases
- [ ] Output is useful and correct

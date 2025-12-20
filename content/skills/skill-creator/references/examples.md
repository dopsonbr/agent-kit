# Example Skills

Real examples of well-structured skills for reference.

## Example 1: Code Review Skill

A skill for reviewing code with specific focus areas.

```markdown
---
name: code-review
description: Review code for quality, security, and performance issues. Use when reviewing PRs, checking code before commit, or auditing existing code.
license: MIT
metadata:
  author: agent-kit
  version: "1.0.0"
---

# Code Review

Perform thorough code reviews with actionable feedback.

## Review Modes

### Mode 1: Uncommitted Changes
Review staged and unstaged changes in the working directory.

### Mode 2: Branch Comparison  
Compare current branch against main/master.

### Mode 3: Specific Files
Review specific files or directories.

## Review Focus Areas

1. **Correctness** - Does it work as intended?
2. **Security** - Any vulnerabilities?
3. **Performance** - Any bottlenecks?
4. **Maintainability** - Is it readable and maintainable?
5. **Testing** - Adequate test coverage?

## Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| 🔴 Critical | Must fix before merge | Block |
| 🟠 Major | Should fix | Request changes |
| 🟡 Minor | Consider fixing | Comment |
| ⚪ Nitpick | Optional | Note |

## Output Format

\`\`\`markdown
# Code Review: {file or PR}

## Summary
{1-2 sentence overview}

## Issues Found

### 🔴 Critical
- {issue + suggested fix}

### 🟠 Major  
- {issue + suggested fix}

### 🟡 Minor
- {issue}

## What's Good
- {positive observations}

## Recommendation
{Approve / Request Changes / Needs Discussion}
\`\`\`
```

## Example 2: API Documentation Skill

A skill for generating API documentation.

```markdown
---
name: api-docs
description: Generate API documentation from code. Use when creating OpenAPI specs, documenting endpoints, or building API references.
license: MIT
metadata:
  author: agent-kit
  version: "1.0.0"
---

# API Documentation Generator

Generate comprehensive API documentation from source code.

## Supported Formats

- OpenAPI 3.0 (YAML/JSON)
- Markdown documentation
- Postman collections

## Workflow

1. **Scan** - Find route handlers and endpoints
2. **Extract** - Parse parameters, bodies, responses
3. **Document** - Generate structured documentation
4. **Output** - Write to specified format

## For Express.js

Look for patterns:
\`\`\`javascript
app.get('/path', handler)
router.post('/path', middleware, handler)
\`\`\`

## For FastAPI

Look for patterns:
\`\`\`python
@app.get("/path")
@router.post("/path")
\`\`\`

## Output Location

| Format | Default Location |
|--------|-----------------|
| OpenAPI | docs/openapi.yaml |
| Markdown | docs/api/README.md |
| Postman | docs/postman.json |
```

## Example 3: Git Workflow Skill

A skill for standardizing git workflows.

```markdown
---
name: git-workflow
description: Manage git workflows with conventional commits and branch naming. Use when committing, creating branches, or preparing releases.
license: MIT
metadata:
  author: agent-kit
  version: "1.0.0"
---

# Git Workflow

Standardize git operations with best practices.

## Branch Naming

\`\`\`
{type}/{ticket}-{description}

Types: feature, fix, hotfix, refactor, docs, test
Examples:
- feature/PROJ-123-user-auth
- fix/PROJ-456-login-bug
- docs/update-readme
\`\`\`

## Commit Messages

Follow Conventional Commits:

\`\`\`
{type}({scope}): {description}

[optional body]

[optional footer]
\`\`\`

### Types
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- test: Tests
- chore: Maintenance

### Examples
\`\`\`
feat(auth): add OAuth2 login

Implements Google and GitHub OAuth providers.

Closes #123
\`\`\`

## PR Template

\`\`\`markdown
## Description
{What does this PR do?}

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor

## Testing
- [ ] Unit tests added
- [ ] Manual testing done

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Documentation updated
\`\`\`
```

## Example 4: Test Generator Skill

A minimal skill focused on one thing.

```markdown
---
name: test-generator
description: Generate unit tests for functions. Use when writing tests, adding test coverage, or creating test suites.
license: MIT
---

# Test Generator

Generate unit tests following project conventions.

## Process

1. Read the function to test
2. Identify inputs, outputs, edge cases
3. Generate test file with cases
4. Include happy path and error cases

## Test Structure

\`\`\`typescript
describe('{functionName}', () => {
  describe('happy path', () => {
    it('should {expected behavior}', () => {
      // Arrange
      // Act  
      // Assert
    });
  });
  
  describe('edge cases', () => {
    it('should handle {edge case}', () => {
      // ...
    });
  });
  
  describe('error cases', () => {
    it('should throw when {condition}', () => {
      // ...
    });
  });
});
\`\`\`

## Output

Tests saved to: `tests/{path matching source}/{name}.test.{ext}`
```

## What Makes These Good

1. **Clear descriptions** with what + when
2. **Structured workflows** with numbered steps
3. **Concrete examples** showing real usage
4. **Defined outputs** with locations
5. **Focused scope** - each does one thing well
6. **Under 5000 tokens** - detailed content in references

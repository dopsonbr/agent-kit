---
name: review-plan
description: Critically review implementation plans before execution. Use when validating plans, checking standards compliance, or before running implement-plan.
license: MIT
metadata:
  author: agent-kit
  version: "1.0.0"
---

# Review Plan

Critically review implementation plans using Codex CLI with high-reasoning capabilities.

## Purpose

Validate implementation plans to ensure they:
- Make logical sense and are achievable
- Follow project standards and conventions
- Have proper structure and completeness
- Won't cause issues during implementation

## When to Use

- Before executing a plan with `implement-plan`
- After creating a plan with `create-plan`
- When reviewing someone else's plan
- To validate plan updates or changes

## Delegation

This skill delegates to Codex CLI for deep reasoning analysis:

```bash
codex -m gpt-5.1-codex-max "<review prompt>"
```

The Codex model provides extended thinking capabilities for thorough plan analysis.

## Workflow

### Step 1: Locate the Plan

**If plan path provided:** Use the specified path directly.

**If no path provided:**
1. Check current conversation context for a plan being discussed
2. Look in `docs/plans/` for the most recently modified plan
3. Ask user which plan to review

### Step 2: Gather Context

Before invoking Codex, gather relevant context:

1. **Read the plan file** completely
2. **Identify referenced files** mentioned in the plan
3. **Load relevant standards:**
   - Project instructions: `CLAUDE.md` or `AGENTS.md`
   - Applicable standards from `content/standards/` based on tech stack
4. **Explore codebase** as needed to validate plan assumptions

### Step 3: Invoke Codex Review

Build a comprehensive review prompt and invoke Codex:

```bash
codex -m gpt-5.1-codex-max "
You are reviewing an implementation plan for a software project.

## Plan to Review
<paste plan content>

## Project Standards
<paste relevant standards>

## Review Criteria
Critically evaluate this plan against these criteria:

### 1. Logical Coherence
- Do the phases and tasks flow logically?
- Are dependencies between tasks correct?
- Are there any circular dependencies or impossible orderings?

### 2. Completeness
- Are all necessary steps included?
- Is the testing strategy adequate (automated + manual)?
- Are rollback/failure scenarios considered?

### 3. Standards Compliance
- Does the plan follow project coding standards?
- Are naming conventions correct?
- Does architecture align with project patterns?

### 4. Feasibility
- Are time estimates realistic?
- Are the file paths and structures correct?
- Do referenced files/modules exist?

### 5. Risk Assessment
- What could go wrong during implementation?
- Are there any security concerns?
- Are there breaking changes that need migration?

## Output Format
Provide a structured review with:
1. PASS/FAIL/NEEDS_REVISION verdict
2. Summary of findings
3. Specific issues (if any) with severity
4. Recommended changes
5. Questions for the plan author
"
```

### Step 4: Compile Review Report

After Codex returns, format the results:

```markdown
## Plan Review: {plan-name}

**Verdict:** PASS | FAIL | NEEDS_REVISION
**Reviewed by:** Codex (gpt-5.1-codex-max)
**Date:** {timestamp}

### Summary
{Brief overview of findings}

### Issues Found

| Severity | Issue | Location | Recommendation |
|----------|-------|----------|----------------|
| HIGH | {issue} | {section} | {fix} |
| MEDIUM | {issue} | {section} | {fix} |
| LOW | {issue} | {section} | {fix} |

### Standards Compliance
- [x] Follows project conventions
- [ ] Testing strategy adequate
- [x] Architecture aligned

### Questions for Author
1. {clarifying question}

### Recommendation
{Next steps - proceed, revise, or reject}
```

## Review Criteria Reference

See [references/review-criteria.md](references/review-criteria.md) for the complete checklist.

## Standards Sources

The review checks against:

1. **Project Instructions**
   - `CLAUDE.md` or `AGENTS.md` in project root
   - `.claude/` configuration

2. **Content Standards** (based on tech stack)
   - `content/standards/backend/java/` - Java backend standards
   - `content/standards/frontend/react/` - React frontend standards

3. **Plan Format Requirements**
   - Token limit: < 5000 tokens
   - Required sections: Testing Strategy, Dependency Graph
   - Proper numbering: `{NNNN}_{name}.md`

## Examples

### Example: Review a specific plan

```
User: Review the plan at docs/plans/0042_user-auth.md

Claude: [Reads plan file]
[Loads relevant standards based on plan content]
[Invokes Codex with review prompt]

Plan Review: 0042_user-auth

Verdict: NEEDS_REVISION

Summary: The plan is well-structured but missing integration tests
and has an incorrect dependency ordering in Phase 3.

Issues Found:
| Severity | Issue | Location | Recommendation |
|----------|-------|----------|----------------|
| HIGH | Missing integration tests | Testing Strategy | Add API integration tests |
| MEDIUM | Task 3.2 depends on 3.4 | Phase 3 | Reorder tasks |

Recommendation: Address HIGH severity issue before implementation.
```

### Example: Review current plan in context

```
User: Review this plan before I implement it

Claude: [Uses plan from current conversation context]
[Gathers standards and explores codebase]
[Invokes Codex review]

Plan Review: Current Context Plan

Verdict: PASS

Summary: Plan is well-structured and ready for implementation.
Minor suggestion to add E2E test for the happy path.
```

## Output

The skill produces:
- Formatted review report in conversation
- Verdict: PASS, FAIL, or NEEDS_REVISION
- Specific actionable feedback

## Related Skills

- `create-plan` - Creates plans that this skill reviews
- `implement-plan` - Executes plans after review passes
- `skill-validator` - Similar validation pattern for skills

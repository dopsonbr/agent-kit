# Plan Review Criteria

Complete checklist for evaluating implementation plans.

## Structure Checklist

### Required Sections
- [ ] Header with status, goal, and metadata
- [ ] Architecture overview with diagrams
- [ ] Phased task breakdown
- [ ] File summary table (CREATE/MODIFY/DELETE)
- [ ] Testing strategy (automated + manual)
- [ ] Dependency graph at end

### Format Requirements
- [ ] Token count < 5000
- [ ] Proper numbering: `{NNNN}_{name}.md`
- [ ] Located in `docs/plans/`
- [ ] Mermaid or ASCII diagrams present

## Logic & Coherence

### Task Flow
- [ ] Tasks are ordered logically
- [ ] Dependencies are explicit and correct
- [ ] No circular dependencies
- [ ] Parallel tasks identified where possible

### Completeness
- [ ] All necessary implementation steps included
- [ ] Edge cases considered
- [ ] Error handling addressed
- [ ] Rollback steps defined

## Standards Compliance

### Code Standards
- [ ] Follows project naming conventions
- [ ] Aligns with established patterns
- [ ] Respects architectural boundaries
- [ ] Uses approved libraries/frameworks

### Documentation
- [ ] Commit messages follow conventions
- [ ] Code comments planned where needed
- [ ] API documentation considered

## Testing Strategy

### Automated Tests
- [ ] E2E tests for critical paths
- [ ] Integration tests for component interactions
- [ ] Unit tests for complex logic
- [ ] Test commands provided

### Manual Validation
- [ ] Step-by-step verification instructions
- [ ] Expected outcomes clearly stated
- [ ] Edge cases covered

## Feasibility Assessment

### Technical
- [ ] File paths are correct
- [ ] Referenced modules/files exist
- [ ] APIs and interfaces are accurate
- [ ] No impossible technical requirements

### Effort
- [ ] Task estimates are realistic
- [ ] Scope is achievable
- [ ] Dependencies are available

## Risk Assessment

### Security
- [ ] No secrets or credentials exposed
- [ ] Input validation considered
- [ ] Authentication/authorization addressed
- [ ] OWASP top 10 considered

### Breaking Changes
- [ ] Backward compatibility addressed
- [ ] Migration path defined if needed
- [ ] Feature flags considered for rollout

### Failure Modes
- [ ] Error scenarios documented
- [ ] Recovery procedures defined
- [ ] Monitoring/alerting considered

## Severity Levels

| Level | Description | Action Required |
|-------|-------------|-----------------|
| **HIGH** | Blocks implementation or causes failures | Must fix before proceeding |
| **MEDIUM** | May cause issues or technical debt | Should fix before proceeding |
| **LOW** | Minor improvements or suggestions | Can proceed, fix later |

## Verdict Criteria

### PASS
- No HIGH severity issues
- At most 2 MEDIUM severity issues
- Testing strategy is adequate
- Standards are followed

### NEEDS_REVISION
- 1-2 HIGH severity issues that are fixable
- OR 3+ MEDIUM severity issues
- OR missing required sections

### FAIL
- 3+ HIGH severity issues
- OR fundamental architectural problems
- OR plan is not achievable as written
- OR significant security concerns

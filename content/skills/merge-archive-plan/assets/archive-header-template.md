# Archive Header Template

Add this block at the top of plans when archiving.

---

````markdown
---
archived: true
archived_date: {YYYY-MM-DD}
archived_by: {username or "plan-execute"}
status: COMPLETE | PARTIAL | ABANDONED
---

## Archive Information

| Field | Value |
|-------|-------|
| Archived | {YYYY-MM-DD HH:MM UTC} |
| PR | [{PR title}]({PR URL}) or N/A |
| Merged | {YYYY-MM-DD} or N/A |
| Branch | `{branch-name}` |
| Commits | {N} commits |
| Files Changed | {N} files (+{additions} -{deletions}) |

### Implementation Commits

```
{short-hash} {commit-message}
{short-hash} {commit-message}
{short-hash} {commit-message}
```

### Files Changed Summary

| Action | Count | Examples |
|--------|-------|----------|
| Created | {N} | `src/new-file.ts`, ... |
| Modified | {N} | `src/existing.ts`, ... |
| Deleted | {N} | `src/obsolete.ts`, ... |

### Execution Summary

**Duration:** {start-date} to {end-date}
**Phases:** {N} phases, {M} tasks
**Reviews:** {N} checkpoints passed

{Brief narrative of execution - any notable events, blockers resolved, etc.}

### Lessons Learned

{Insights for future plans. What worked well? What could be improved?}

**What Went Well:**
- {positive outcome}
- {positive outcome}

**Challenges:**
- {challenge and how it was resolved}

**Recommendations:**
- {suggestion for future similar work}

---

````

## Field Descriptions

| Field | Description | Source |
|-------|-------------|--------|
| `archived_date` | When archiving occurred | Current timestamp |
| `archived_by` | Who/what triggered archive | Username or "plan-execute" |
| `status` | Final plan status | COMPLETE, PARTIAL, ABANDONED |
| `PR` | Pull request link | `gh pr list --state merged` |
| `Merged` | When PR was merged | PR metadata |
| `Branch` | Implementation branch | Git history |
| `Commits` | Number of commits | `git log --oneline` count |
| `Files Changed` | Files affected | `git diff --stat` |

## Status Values

| Status | When to Use |
|--------|-------------|
| `COMPLETE` | All phases executed successfully |
| `PARTIAL` | Some phases completed, others deferred |
| `ABANDONED` | Plan was cancelled or superseded |

## Minimal Header (for simple cases)

When full metadata isn't available:

````markdown
---
archived: true
archived_date: {YYYY-MM-DD}
---

## Archive Information

| Field | Value |
|-------|-------|
| Archived | {YYYY-MM-DD} |
| Status | COMPLETE |
| Notes | {any relevant notes} |

---
````

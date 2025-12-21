# Git Worktree Setup for Plan Implementation

After creating a plan, offer to set up an isolated git worktree for implementation.

---

## Worktree Directory Structure

All worktrees are stored in `.worktrees/` at the repository root, named after the plan:

```
my-project/
├── .worktrees/
│   ├── 0042_user-preferences/    # Worktree for plan 0042
│   ├── 0043_api-refactor/        # Worktree for plan 0043
│   └── 0044A_frontend-forms/     # Worktree for subplan 0044A
├── src/
├── docs/
│   └── plans/
│       ├── 0042_user-preferences.md
│       ├── 0043_api-refactor.md
│       └── 0044A_frontend-forms.md
└── ...
```

## Creating a Worktree

After plan creation, ask the user:

> "Would you like me to create a git worktree for implementing this plan?"

If yes, run:

```bash
# Create worktree directory if it doesn't exist
mkdir -p .worktrees

# Create worktree with branch named after the plan
git worktree add .worktrees/{NNNN}_{feature-name} -b feature/{NNNN}_{feature-name}

# Example for plan 0042_user-preferences.md:
git worktree add .worktrees/0042_user-preferences -b feature/0042_user-preferences
```

## Worktree Commands

```bash
# List all worktrees
git worktree list

# Navigate to worktree
cd .worktrees/0042_user-preferences

# Remove worktree after merging
git worktree remove .worktrees/0042_user-preferences

# Prune stale worktree references
git worktree prune
```

## Recommended Workflow

1. **Create plan** → `docs/plans/0042_user-preferences.md`
2. **Create worktree** → `.worktrees/0042_user-preferences/`
3. **Implement** in the worktree directory
4. **Run tests** from within the worktree
5. **Create PR** from the feature branch
6. **Remove worktree** after merge

## Benefits

- **Isolation**: Each plan gets its own working directory
- **Parallel work**: Implement multiple plans simultaneously
- **Clean main**: Main branch stays untouched during development
- **Easy cleanup**: Remove worktree after merge

## Git Ignore

Add to `.gitignore`:

```gitignore
# Worktrees
.worktrees/
```

## IDE Configuration

Most IDEs can open worktrees as separate projects:

```bash
# VS Code
code .worktrees/0042_user-preferences

# Cursor
cursor .worktrees/0042_user-preferences
```

## Integration with Plan Template

Plans can reference their intended worktree:

```markdown
## Implementation Setup

**Worktree:** `.worktrees/0042_user-preferences`
**Branch:** `feature/0042_user-preferences`
```

---

*Offer worktree setup after every plan creation.*

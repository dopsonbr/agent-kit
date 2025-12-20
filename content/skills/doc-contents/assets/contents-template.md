# CONTENTS.md Template

CONTENTS.md is a simple navigation index. Keep it minimal.

---

# {Directory Name}

| Name | Description |
|------|-------------|
| [{file-or-dir}](./{path}) | {1-2 sentence description} |
| [{file-or-dir}](./{path}) | {1-2 sentence description} |
| [{subdir}/](./{subdir}/) | {1-2 sentence description} |

---

## Nesting

Place CONTENTS.md in any directory that benefits from an index. Subdirectories can have their own CONTENTS.md files for deeper navigation.

```
project/
├── CONTENTS.md           # Top-level index
├── src/
│   ├── CONTENTS.md       # src-specific index
│   └── components/
│       └── CONTENTS.md   # component index
└── docs/
    └── CONTENTS.md       # docs index
```

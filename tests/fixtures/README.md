# Test Fixtures

This directory contains test fixtures for agent-kit automated tests.

## Structure

```
fixtures/
└── skills/
    └── test-skill/
        └── SKILL.md    # Minimal skill fixture for testing
```

## Usage

The fixtures mirror the `content/` directory structure to enable testing
the fetcher's local mode without relying on the actual content directory.

```typescript
import { fetchContent } from '../../src/lib/fetcher'
import { resolve } from 'path'

const FIXTURES_PATH = resolve(__dirname, '../fixtures')

const { skills } = await fetchContent({
  repo: 'github:test/test',
  branch: 'main',
  path: 'content',
  useLocal: true,
  localPath: FIXTURES_PATH,
})
```

## Adding New Fixtures

When adding new test fixtures:

1. Follow the same directory structure as `content/`
2. Use minimal, valid content
3. Document the purpose of each fixture

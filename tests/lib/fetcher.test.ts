import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { parseSkillMd, fetchContent } from '../../src/lib/fetcher'
import { getFixturesDir, setupTestDir, teardownTestDir } from '../helpers/harness'

describe('Fetcher', () => {
  describe('parseSkillMd', () => {
    it('parses valid SKILL.md with frontmatter', () => {
      const content = `---
name: test-skill
description: A test skill
license: MIT
---

# Test Skill

Content here.`

      const skill = parseSkillMd(content)

      expect(skill.name).toBe('test-skill')
      expect(skill.description).toBe('A test skill')
      expect(skill.license).toBe('MIT')
      expect(skill.content).toBe(content)
    })

    it('handles quoted strings in frontmatter', () => {
      const content = `---
name: "quoted-name"
description: "A quoted description"
---

# Content`

      const skill = parseSkillMd(content)

      expect(skill.name).toBe('quoted-name')
      expect(skill.description).toBe('A quoted description')
    })

    it('throws on invalid SKILL.md without frontmatter', () => {
      const content = `# No Frontmatter

Just content.`

      expect(() => parseSkillMd(content)).toThrow('Invalid SKILL.md: missing frontmatter')
    })
  })

  describe('fetchContent', () => {
    beforeEach(() => {
      setupTestDir()
    })

    afterEach(() => {
      teardownTestDir()
    })

    describe('local mode', () => {
      it('fetches skills from local fixtures directory', async () => {
        const fixturesDir = getFixturesDir()

        const { skills } = await fetchContent({
          repo: 'github:test/test',
          branch: 'main',
          path: 'content',
          useLocal: true,
          localPath: fixturesDir,
        })

        expect(skills.length).toBeGreaterThan(0)
        expect(skills[0].name).toBe('test-skill')
        expect(skills[0].description).toBe('A test skill for automated testing')
      })

      it('returns empty array when skills directory does not exist', async () => {
        const { skills } = await fetchContent({
          repo: 'github:test/test',
          branch: 'main',
          path: 'content',
          useLocal: true,
          localPath: '/nonexistent/path',
        })

        expect(skills).toEqual([])
      })

      it('returns empty commands array for local mode', async () => {
        const fixturesDir = getFixturesDir()

        const { commands } = await fetchContent({
          repo: 'github:test/test',
          branch: 'main',
          path: 'content',
          useLocal: true,
          localPath: fixturesDir,
        })

        expect(commands).toEqual([])
      })
    })
  })
})

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { existsSync, lstatSync, readFileSync } from 'fs'
import { join } from 'path'
import { fetchContent } from '../../src/lib/fetcher'
import { installSkills } from '../../src/lib/installer'
import { generateAgentsMd } from '../../src/lib/generator'
import { DEFAULT_CONFIG } from '../../src/lib/config'
import { setupTestDir, teardownTestDir, getTestDir, getFixturesDir } from '../helpers/harness'
import type { Skill } from '../../src/types'

describe('Init Command Integration', () => {
  let testDir: string
  let originalCwd: string

  beforeEach(() => {
    originalCwd = process.cwd()
    testDir = setupTestDir()
    process.chdir(testDir)
  })

  afterEach(() => {
    process.chdir(originalCwd)
    teardownTestDir()
  })

  describe('fetchContent with local fixtures', () => {
    it('fetches skills from local fixtures', async () => {
      const fixturesPath = getFixturesDir()

      const { skills } = await fetchContent({
        repo: 'github:test/test',
        branch: 'main',
        path: 'content',
        useLocal: true,
        localPath: fixturesPath,
      })

      expect(skills.length).toBeGreaterThan(0)
      expect(skills[0].name).toBe('test-skill')
      expect(skills[0].description).toBe('A test skill for automated testing')
    })
  })

  describe('installSkills with symlinks', () => {
    it('installs skills and creates symlinks', async () => {
      const cwd = getTestDir()
      const skills: Skill[] = [
        {
          name: 'test-skill',
          description: 'Test',
          content: '---\nname: test-skill\ndescription: Test\n---\n# Test',
        },
      ]

      const config = {
        ...DEFAULT_CONFIG,
        targets: { ...DEFAULT_CONFIG.targets, copilot: true, claude: true },
      }

      await installSkills({ cwd, config, skills, commands: [] })

      // Verify .github/skills exists
      expect(existsSync(join(cwd, '.github/skills/test-skill'))).toBe(true)
      expect(existsSync(join(cwd, '.github/skills/test-skill/SKILL.md'))).toBe(true)

      // Verify .claude/skills symlink exists
      expect(existsSync(join(cwd, '.claude/skills/test-skill'))).toBe(true)
      expect(lstatSync(join(cwd, '.claude/skills/test-skill')).isSymbolicLink()).toBe(true)
    })
  })

  describe('generateAgentsMd', () => {
    it('generates AGENTS.md with skill list', () => {
      const cwd = getTestDir()
      const skills: Skill[] = [
        { name: 'skill-one', description: 'First skill', content: '' },
        { name: 'skill-two', description: 'Second skill', content: '' },
      ]

      generateAgentsMd(cwd, DEFAULT_CONFIG, skills)

      const agentsMdPath = join(cwd, 'AGENTS.md')
      expect(existsSync(agentsMdPath)).toBe(true)

      const content = readFileSync(agentsMdPath, 'utf-8')
      expect(content).toContain('# AGENTS.md')
      expect(content).toContain('skill-one')
      expect(content).toContain('First skill')
      expect(content).toContain('skill-two')
      expect(content).toContain('Second skill')
    })
  })

  describe('full init flow', () => {
    it('completes full initialization with local fixtures', async () => {
      const cwd = getTestDir()
      const fixturesPath = getFixturesDir()

      // 1. Fetch skills from fixtures
      const { skills: fetchedSkills } = await fetchContent({
        repo: 'github:test/test',
        branch: 'main',
        path: 'content',
        useLocal: true,
        localPath: fixturesPath,
      })

      expect(fetchedSkills.length).toBeGreaterThan(0)

      // 2. Install skills
      const config = {
        ...DEFAULT_CONFIG,
        targets: { copilot: true, claude: true, agentsMd: true },
      }

      await installSkills({ cwd, config, skills: fetchedSkills, commands: [] })

      // 3. Generate AGENTS.md
      generateAgentsMd(cwd, config, fetchedSkills)

      // Verify all outputs exist
      expect(existsSync(join(cwd, '.github/skills'))).toBe(true)
      expect(existsSync(join(cwd, '.claude/skills'))).toBe(true)
      expect(existsSync(join(cwd, 'AGENTS.md'))).toBe(true)

      // Verify skill installed correctly
      const skillDir = join(cwd, '.github/skills/test-skill')
      expect(existsSync(skillDir)).toBe(true)
      expect(existsSync(join(skillDir, 'SKILL.md'))).toBe(true)

      // Verify symlink
      const claudeSkillDir = join(cwd, '.claude/skills/test-skill')
      expect(existsSync(claudeSkillDir)).toBe(true)
      expect(lstatSync(claudeSkillDir).isSymbolicLink()).toBe(true)

      // Verify AGENTS.md content
      const agentsMd = readFileSync(join(cwd, 'AGENTS.md'), 'utf-8')
      expect(agentsMd).toContain('test-skill')
      expect(agentsMd).toContain('A test skill for automated testing')
    })
  })
})

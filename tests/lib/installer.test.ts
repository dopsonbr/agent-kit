import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { existsSync, lstatSync, readlinkSync, readFileSync } from 'fs'
import { join } from 'path'
import { installSkills } from '../../src/lib/installer'
import { DEFAULT_CONFIG } from '../../src/lib/config'
import { setupTestDir, teardownTestDir, getTestDir } from '../helpers/harness'
import type { Skill } from '../../src/types'

describe('Installer', () => {
  let testDir: string

  beforeEach(() => {
    testDir = setupTestDir()
  })

  afterEach(() => {
    teardownTestDir()
  })

  describe('installSkills', () => {
    const testSkill: Skill = {
      name: 'test-skill',
      description: 'A test skill',
      content: `---
name: test-skill
description: A test skill
---

# Test Skill

Content here.`,
    }

    it('creates required directories', async () => {
      await installSkills({
        cwd: testDir,
        config: DEFAULT_CONFIG,
        skills: [],
        commands: [],
      })

      expect(existsSync(join(testDir, '.github/skills'))).toBe(true)
      expect(existsSync(join(testDir, '.claude/skills'))).toBe(true)
      expect(existsSync(join(testDir, '.claude/commands'))).toBe(true)
      expect(existsSync(join(testDir, 'docs/ideas'))).toBe(true)
      expect(existsSync(join(testDir, 'docs/plans'))).toBe(true)
      expect(existsSync(join(testDir, 'docs/adrs'))).toBe(true)
      expect(existsSync(join(testDir, '.ak'))).toBe(true)
    })

    it('installs skill to .github/skills when copilot target is enabled', async () => {
      const config = {
        ...DEFAULT_CONFIG,
        targets: { ...DEFAULT_CONFIG.targets, copilot: true },
      }

      await installSkills({
        cwd: testDir,
        config,
        skills: [testSkill],
        commands: [],
      })

      const skillDir = join(testDir, '.github/skills/test-skill')
      expect(existsSync(skillDir)).toBe(true)
      expect(existsSync(join(skillDir, 'SKILL.md'))).toBe(true)

      const content = readFileSync(join(skillDir, 'SKILL.md'), 'utf-8')
      expect(content).toContain('test-skill')
    })

    it('creates symlink from .claude/skills to .github/skills when claude target is enabled', async () => {
      const config = {
        ...DEFAULT_CONFIG,
        targets: { ...DEFAULT_CONFIG.targets, copilot: true, claude: true },
      }

      await installSkills({
        cwd: testDir,
        config,
        skills: [testSkill],
        commands: [],
      })

      const claudeSkillPath = join(testDir, '.claude/skills/test-skill')
      const githubSkillPath = join(testDir, '.github/skills/test-skill')

      expect(existsSync(claudeSkillPath)).toBe(true)
      expect(lstatSync(claudeSkillPath).isSymbolicLink()).toBe(true)

      // Verify symlink points to correct location
      const linkTarget = readlinkSync(claudeSkillPath)
      expect(linkTarget).toContain('.github/skills/test-skill')
    })

    it('does not create symlinks when claude target is disabled', async () => {
      const config = {
        ...DEFAULT_CONFIG,
        targets: { ...DEFAULT_CONFIG.targets, copilot: true, claude: false },
      }

      await installSkills({
        cwd: testDir,
        config,
        skills: [testSkill],
        commands: [],
      })

      const claudeSkillPath = join(testDir, '.claude/skills/test-skill')
      expect(existsSync(claudeSkillPath)).toBe(false)
    })

    it('handles multiple skills', async () => {
      const skills: Skill[] = [
        { name: 'skill-one', description: 'First', content: '---\nname: skill-one\n---\n# One' },
        { name: 'skill-two', description: 'Second', content: '---\nname: skill-two\n---\n# Two' },
      ]

      const config = {
        ...DEFAULT_CONFIG,
        targets: { ...DEFAULT_CONFIG.targets, copilot: true, claude: true },
      }

      await installSkills({
        cwd: testDir,
        config,
        skills,
        commands: [],
      })

      expect(existsSync(join(testDir, '.github/skills/skill-one/SKILL.md'))).toBe(true)
      expect(existsSync(join(testDir, '.github/skills/skill-two/SKILL.md'))).toBe(true)
      expect(lstatSync(join(testDir, '.claude/skills/skill-one')).isSymbolicLink()).toBe(true)
      expect(lstatSync(join(testDir, '.claude/skills/skill-two')).isSymbolicLink()).toBe(true)
    })
  })
})

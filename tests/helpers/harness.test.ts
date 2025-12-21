import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { existsSync } from 'fs'
import { setupTestDir, teardownTestDir, getTestDir, getFixturesDir, createTestSubdir } from './harness'

describe('Test Harness', () => {
  afterEach(() => {
    teardownTestDir()
  })

  describe('setupTestDir', () => {
    it('creates test directory', () => {
      const dir = setupTestDir()
      expect(existsSync(dir)).toBe(true)
    })

    it('removes existing test directory before creating new one', () => {
      // Create first directory
      const dir1 = setupTestDir()
      expect(existsSync(dir1)).toBe(true)

      // Setup again should work (clean slate)
      const dir2 = setupTestDir()
      expect(existsSync(dir2)).toBe(true)
      expect(dir1).toBe(dir2)
    })
  })

  describe('teardownTestDir', () => {
    it('removes test directory', () => {
      const dir = setupTestDir()
      expect(existsSync(dir)).toBe(true)

      teardownTestDir()
      expect(existsSync(dir)).toBe(false)
    })

    it('does not error if directory does not exist', () => {
      expect(() => teardownTestDir()).not.toThrow()
    })
  })

  describe('getTestDir', () => {
    it('returns consistent path', () => {
      const dir1 = getTestDir()
      const dir2 = getTestDir()
      expect(dir1).toBe(dir2)
    })

    it('returns absolute path', () => {
      const dir = getTestDir()
      expect(dir.startsWith('/')).toBe(true)
    })
  })

  describe('getFixturesDir', () => {
    it('returns path to fixtures directory', () => {
      const dir = getFixturesDir()
      expect(dir).toContain('tests/fixtures')
      expect(existsSync(dir)).toBe(true)
    })
  })

  describe('createTestSubdir', () => {
    beforeEach(() => {
      setupTestDir()
    })

    it('creates subdirectory within test directory', () => {
      const subdir = createTestSubdir('nested/path')
      expect(existsSync(subdir)).toBe(true)
      expect(subdir).toContain('test-output/nested/path')
    })
  })
})

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { mkdtempSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { loadConfig, saveConfig, DEFAULT_CONFIG } from '../../src/lib/config'

describe('Config', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'ak-test-'))
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true })
  })

  it('returns null when no config exists', () => {
    expect(loadConfig(tempDir)).toBeNull()
  })

  it('saves and loads config', () => {
    saveConfig(DEFAULT_CONFIG, tempDir)
    const loaded = loadConfig(tempDir)
    expect(loaded).toEqual(DEFAULT_CONFIG)
  })
})

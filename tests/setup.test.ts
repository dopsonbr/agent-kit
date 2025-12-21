import { describe, it, expect } from 'bun:test'
import { existsSync } from 'fs'

describe('Project Setup', () => {
  it('has required config files', () => {
    expect(existsSync('package.json')).toBe(true)
    expect(existsSync('tsconfig.json')).toBe(true)
  })

  it('has source directories', () => {
    expect(existsSync('src/cli')).toBe(true)
    expect(existsSync('src/lib')).toBe(true)
    expect(existsSync('src/types')).toBe(true)
  })

  it('has dogfooding setup', () => {
    expect(existsSync('AGENTS.md')).toBe(true)
    expect(existsSync('.claude/settings.json')).toBe(true)
  })
})

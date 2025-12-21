// tests/cli/e2e.test.ts
import { describe, it, expect } from 'bun:test'
import { execSync } from 'child_process'

describe('CLI E2E', () => {
  const run = (args: string) =>
    execSync(`bun run src/cli/index.ts ${args}`, { encoding: 'utf-8' })

  it('shows version with --version', () => {
    const output = run('--version')
    expect(output).toContain('agent-kit')
    expect(output).toMatch(/\d+\.\d+\.\d+/)
  })

  it('shows help with no args', () => {
    const output = run('')
    expect(output).toContain('Usage:')
    expect(output).toContain('init')
  })

  it('shows command help', () => {
    const output = run('help init')
    expect(output).toContain('--preset')
  })

  it('shows skills list', () => {
    const output = run('help skills')
    // Check for skill section, not specific names (may change)
    expect(output).toContain('Skills')
  })
})

// tests/cli/parser.test.ts
import { describe, it, expect } from 'bun:test'
import { parseArgs } from '../../src/cli/parser'

describe('CLI Argument Parser', () => {
  it('parses command name', () => {
    const args = parseArgs(['node', 'ak', 'init'])
    expect(args.command).toBe('init')
  })

  it('defaults to help when no command', () => {
    const args = parseArgs(['node', 'ak'])
    expect(args.command).toBe('help')
  })

  it('parses boolean flags', () => {
    const args = parseArgs(['node', 'ak', 'init', '--yes'])
    expect(args.flags.yes).toBe(true)
  })

  it('parses flag values', () => {
    const args = parseArgs(['node', 'ak', 'init', '--preset', 'minimal'])
    expect(args.flags.preset).toBe('minimal')
  })

  it('handles --help as help command', () => {
    const args = parseArgs(['node', 'ak', '--help'])
    expect(args.command).toBe('help')
  })

  it('handles --version as version command', () => {
    const args = parseArgs(['node', 'ak', '--version'])
    expect(args.command).toBe('version')
  })

  it('collects positional arguments', () => {
    const args = parseArgs(['node', 'ak', 'help', 'init'])
    expect(args.positional).toEqual(['init'])
  })
})

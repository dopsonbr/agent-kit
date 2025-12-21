/**
 * Test harness utilities for setup and teardown
 */

import { mkdirSync, rmSync, existsSync } from 'fs'
import { join, resolve } from 'path'

// Capture absolute path at module load time (before any chdir)
const PROJECT_ROOT = resolve(__dirname, '../..')
const TEST_DIR = join(PROJECT_ROOT, 'test-output')

/**
 * Sets up a clean test directory, removing any existing one first
 */
export function setupTestDir(): string {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true })
  }
  mkdirSync(TEST_DIR, { recursive: true })
  return TEST_DIR
}

/**
 * Tears down the test directory
 */
export function teardownTestDir(): void {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true })
  }
}

/**
 * Returns the absolute path to the test directory
 */
export function getTestDir(): string {
  return TEST_DIR
}

/**
 * Returns the path to the test fixtures directory
 */
export function getFixturesDir(): string {
  return resolve(__dirname, '../fixtures')
}

/**
 * Creates a subdirectory within the test directory
 */
export function createTestSubdir(subpath: string): string {
  const fullPath = join(getTestDir(), subpath)
  mkdirSync(fullPath, { recursive: true })
  return fullPath
}

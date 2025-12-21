/**
 * Test harness utilities for setup and teardown
 */

import { mkdirSync, rmSync, existsSync } from 'fs'
import { join, resolve } from 'path'

const TEST_DIR = './test-output'

/**
 * Sets up a clean test directory, removing any existing one first
 */
export function setupTestDir(): string {
  const testDir = resolve(TEST_DIR)
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true })
  }
  mkdirSync(testDir, { recursive: true })
  return testDir
}

/**
 * Tears down the test directory
 */
export function teardownTestDir(): void {
  const testDir = resolve(TEST_DIR)
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true })
  }
}

/**
 * Returns the path to the test directory
 */
export function getTestDir(): string {
  return resolve(TEST_DIR)
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

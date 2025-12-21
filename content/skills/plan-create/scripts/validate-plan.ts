#!/usr/bin/env bun
/**
 * Plan Validation Script
 *
 * Validates implementation plans against create-plan skill requirements.
 *
 * Usage:
 *   bun run content/skills/plan-create/scripts/validate-plan.ts <plan-file.md>
 *
 * Checks:
 *   - Token count (warn > 3000, error > 5000)
 *   - Filename format (NNNN_feature-name.md)
 *   - Required sections present
 *   - Dependency graph exists
 *   - Status field present
 *   - File references are valid paths
 */

import { existsSync, readFileSync } from 'fs'
import { basename } from 'path'

interface ValidationResult {
  errors: string[]
  warnings: string[]
  info: string[]
}

// Token limits (optimal context usage)
const TOKEN_LIMIT_OPTIMAL = 3000
const TOKEN_LIMIT_ERROR = 5000

// Approximate tokens: ~4 characters = 1 token
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

const REQUIRED_SECTIONS = [
  'Overview',
  'Goals',
  'Testing Strategy',
  'Dependency Graph',
  'Checklist',
]

const FILENAME_PATTERN = /^\d{4}[A-Z]?_[\w-]+\.md$/

function validatePlan(filePath: string): ValidationResult {
  const result: ValidationResult = {
    errors: [],
    warnings: [],
    info: [],
  }

  // Check file exists
  if (!existsSync(filePath)) {
    result.errors.push(`File not found: ${filePath}`)
    return result
  }

  const content = readFileSync(filePath, 'utf-8')
  const tokenCount = estimateTokens(content)
  const lineCount = content.split('\n').length
  const fileName = basename(filePath)

  // Check filename format
  if (!FILENAME_PATTERN.test(fileName)) {
    result.errors.push(
      `Invalid filename format: ${fileName}. Expected: NNNN_feature-name.md (e.g., 0042_user-auth.md)`
    )
  } else {
    result.info.push(`Filename format: OK`)
  }

  // Check token count
  if (tokenCount > TOKEN_LIMIT_ERROR) {
    result.errors.push(
      `Token count ~${tokenCount} exceeds hard limit of ${TOKEN_LIMIT_ERROR}. Split into subplans.`
    )
  } else if (tokenCount > TOKEN_LIMIT_OPTIMAL) {
    result.warnings.push(
      `Token count ~${tokenCount} exceeds optimal limit of ${TOKEN_LIMIT_OPTIMAL}. Consider splitting.`
    )
  } else {
    result.info.push(`Token count: ~${tokenCount} (${lineCount} lines)`)
  }

  // Check for status field
  const statusMatch = content.match(/\*\*Status:\*\*\s*(DRAFT|IN_PROGRESS|COMPLETE|ABANDONED)/i)
  if (!statusMatch) {
    result.errors.push('Missing or invalid Status field. Expected: DRAFT, IN_PROGRESS, COMPLETE, or ABANDONED')
  } else {
    result.info.push(`Status: ${statusMatch[1]}`)
  }

  // Check required sections
  for (const section of REQUIRED_SECTIONS) {
    const sectionPattern = new RegExp(`^##\\s+${section}`, 'im')
    if (!sectionPattern.test(content)) {
      result.errors.push(`Missing required section: ## ${section}`)
    }
  }

  // Check for diagrams (any Mermaid type or ASCII)
  const mermaidTypes = [
    /```mermaid[\s\S]*?graph[\s\S]*?```/i,           // Flowchart
    /```mermaid[\s\S]*?sequenceDiagram[\s\S]*?```/i, // Sequence
    /```mermaid[\s\S]*?stateDiagram[\s\S]*?```/i,    // State
    /```mermaid[\s\S]*?classDiagram[\s\S]*?```/i,    // Class
    /```mermaid[\s\S]*?erDiagram[\s\S]*?```/i,       // ER
    /```mermaid[\s\S]*?gantt[\s\S]*?```/i,           // Gantt
    /```mermaid[\s\S]*?pie[\s\S]*?```/i,             // Pie
    /```mermaid[\s\S]*?flowchart[\s\S]*?```/i,       // Flowchart (alt)
  ]

  const hasMermaidDiagram = mermaidTypes.some(pattern => pattern.test(content))
  const hasAsciiDiagram = /[─│┌┐└┘├┤┬┴┼▼▲►◄→←↓↑]/m.test(content)

  if (!hasMermaidDiagram && !hasAsciiDiagram) {
    result.warnings.push('No diagram detected. Add a Mermaid or ASCII diagram.')
  } else {
    const diagramType = hasMermaidDiagram ? 'Mermaid' : 'ASCII'
    result.info.push(`Diagram: ${diagramType}`)
  }

  // Check for phase structure
  const phaseMatches = content.match(/^## Phase \d+:/gm)
  if (!phaseMatches || phaseMatches.length === 0) {
    result.warnings.push('No phases found. Expected: ## Phase N: {Name}')
  } else {
    result.info.push(`Phases found: ${phaseMatches.length}`)
  }

  // Check for task structure
  const taskMatches = content.match(/^### \d+\.\d+/gm)
  if (!taskMatches || taskMatches.length === 0) {
    result.warnings.push('No tasks found. Expected: ### N.N {Task Name}')
  } else {
    result.info.push(`Tasks found: ${taskMatches.length}`)
  }

  // Check for Files Summary table
  if (!/\| Action \| File \| Purpose \|/i.test(content)) {
    result.warnings.push('Missing Files Summary table')
  }

  // Check for commit messages
  const commitMatches = content.match(/\*\*Commit:\*\*/g)
  if (taskMatches && commitMatches) {
    if (commitMatches.length < taskMatches.length) {
      result.warnings.push(
        `Only ${commitMatches.length} commit messages for ${taskMatches.length} tasks`
      )
    }
  }

  // Check for file path references
  const fileRefPattern = /(?:CREATE|MODIFY|DELETE):\s*`([^`]+)`/g
  let match
  const referencedFiles: string[] = []
  while ((match = fileRefPattern.exec(content)) !== null) {
    referencedFiles.push(match[1])
  }

  if (referencedFiles.length > 0) {
    result.info.push(`File references: ${referencedFiles.length}`)
  }

  // Check for checklist items
  const checklistItems = content.match(/- \[ \]/g)
  if (!checklistItems || checklistItems.length === 0) {
    result.warnings.push('No checklist items found')
  } else {
    result.info.push(`Checklist items: ${checklistItems.length}`)
  }

  // Check for Testing Strategy subsections
  const hasTestingStrategy = /^##\s+Testing Strategy/im.test(content)
  if (hasTestingStrategy) {
    const hasAutomatedTests = /###\s+Automated Tests/i.test(content)
    const hasManualValidation = /###\s+Manual Validation/i.test(content)

    if (!hasAutomatedTests) {
      result.errors.push('Testing Strategy missing "### Automated Tests" subsection')
    }
    if (!hasManualValidation) {
      result.errors.push('Testing Strategy missing "### Manual Validation" subsection')
    }

    // Check for E2E tests (preferred)
    const hasE2E = /E2E|e2e|end.to.end|playwright|cypress/i.test(content)
    if (hasAutomatedTests && !hasE2E) {
      result.warnings.push('No E2E tests mentioned. E2E tests are preferred for validating user flows.')
    }

    if (hasAutomatedTests && hasManualValidation) {
      result.info.push('Testing Strategy: Complete (automated + manual)')
    }
  }

  return result
}

function printResult(result: ValidationResult): void {
  console.log('\n=== Plan Validation Results ===\n')

  if (result.errors.length > 0) {
    console.log('❌ ERRORS:')
    result.errors.forEach((e) => console.log(`   - ${e}`))
    console.log()
  }

  if (result.warnings.length > 0) {
    console.log('⚠️  WARNINGS:')
    result.warnings.forEach((w) => console.log(`   - ${w}`))
    console.log()
  }

  if (result.info.length > 0) {
    console.log('ℹ️  INFO:')
    result.info.forEach((i) => console.log(`   - ${i}`))
    console.log()
  }

  // Summary
  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log('✅ PASSED: Plan is valid\n')
  } else if (result.errors.length === 0) {
    console.log(`⚠️  PASSED with ${result.warnings.length} warning(s)\n`)
  } else {
    console.log(`❌ FAILED: ${result.errors.length} error(s), ${result.warnings.length} warning(s)\n`)
    process.exit(1)
  }
}

// Main
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log('Usage: bun run validate-plan.ts <plan-file.md>')
  console.log('')
  console.log('Checks:')
  console.log('  - Token count (optimal: ≤3000, max: 5000)')
  console.log('  - Filename format (NNNN_feature-name.md)')
  console.log('  - Required sections (Overview, Goals, Testing Strategy, Dependency Graph, Checklist)')
  console.log('  - Testing Strategy has Automated Tests + Manual Validation subsections')
  console.log('  - E2E tests mentioned (preferred)')
  console.log('  - Diagram present (Mermaid or ASCII)')
  console.log('  - Status field')
  console.log('')
  console.log('Example:')
  console.log('  bun run validate-plan.ts docs/plans/0042_user-auth.md')
  process.exit(1)
}

const filePath = args[0]
const result = validatePlan(filePath)
printResult(result)

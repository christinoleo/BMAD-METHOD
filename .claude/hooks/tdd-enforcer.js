#!/usr/bin/env node
/* eslint-disable unicorn/prefer-module, n/no-process-exit, unicorn/no-process-exit */

/**
 * TDD Enforcement Hook for Claude Code
 *
 * This hook enforces Test-Driven Development discipline by:
 * 1. Blocking implementation code before tests exist and fail
 * 2. Blocking test modifications during implementation phase
 * 3. Ensuring strict test-first workflow
 *
 * Supported Test Frameworks:
 * - Jest (JavaScript/TypeScript)
 * - Vitest (JavaScript/TypeScript)
 * - Bun Test (JavaScript/TypeScript)
 * - pytest (Python)
 * - Go test (Go)
 * - Rust test (Rust)
 * - PHPUnit (PHP)
 *
 * Inspired by TDD Guard (https://github.com/nizos/tdd-guard)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TDD_STATE_FILE = '.claude/tdd-state.json';
const TEST_FILE_PATTERNS = [
  /\.test\.(js|ts|jsx|tsx)$/,
  /\.spec\.(js|ts|jsx|tsx)$/,
  /_test\.(js|ts|go|rs)$/,
  /test_.*\.py$/,
  /.*_test\.go$/,
  /.*_test\.rs$/,
  /Test\.php$/,
];

const IMPLEMENTATION_FILE_PATTERNS = [
  /\.(js|ts|jsx|tsx|py|go|rs|php|java|rb)$/,
];

// TDD Phases
const PHASE = {
  TEST_WRITING: 'test_writing',
  IMPLEMENTATION: 'implementation',
  REVIEW: 'review',
};

/**
 * Load TDD state from file
 */
function loadTDDState() {
  try {
    if (fs.existsSync(TDD_STATE_FILE)) {
      const content = fs.readFileSync(TDD_STATE_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    // If state file is corrupted or doesn't exist, return default
  }

  return {
    phase: PHASE.TEST_WRITING,
    testFiles: [],
    testsHaveFailed: false,
    implementationFiles: [],
    storyKey: null,
    startedAt: new Date().toISOString(),
  };
}

/**
 * Save TDD state to file
 */
function saveTDDState(state) {
  try {
    const dir = path.dirname(TDD_STATE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TDD_STATE_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('Failed to save TDD state:', error.message);
  }
}

/**
 * Check if file is a test file
 */
function isTestFile(filePath) {
  return TEST_FILE_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Check if file is an implementation file (not test)
 */
function isImplementationFile(filePath) {
  if (isTestFile(filePath)) return false;
  return IMPLEMENTATION_FILE_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Detect test framework and check if tests are failing
 */
// eslint-disable-next-line no-unused-vars
function checkTestStatus() {
  // Try to detect package.json for test command
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      // Look for test script
      if (pkg.scripts && pkg.scripts.test) {
        // Note: In a real implementation, we would run the tests
        // For now, we'll check if test files exist
        return { hasTests: true, framework: 'detected' };
      }
    } catch (error) {
      // Ignore
    }
  }

  return { hasTests: false, framework: 'unknown' };
}

/**
 * Main hook function
 */
function enforceTDD() {
  // Parse hook input from stdin
  let hookData = '';

  process.stdin.on('data', (chunk) => {
    hookData += chunk;
  });

  process.stdin.on('end', () => {
    try {
      const input = JSON.parse(hookData);
      const { tool, parameters } = input;

      // Only enforce on file modification tools
      if (!['Write', 'Edit', 'MultiEdit'].includes(tool)) {
        // Allow other tools
        process.exit(0);
        return;
      }

      // Get file path from parameters
      let filePath = null;
      if (tool === 'Write' || tool === 'Edit') {
        filePath = parameters.file_path;
      } else if (tool === 'MultiEdit') {
        // MultiEdit might have multiple files
        filePath = parameters.files && parameters.files[0] && parameters.files[0].file_path;
      }

      if (!filePath) {
        // Can't determine file, allow operation
        process.exit(0);
        return;
      }

      // Load current TDD state
      const state = loadTDDState();

      // Determine file type
      const isTest = isTestFile(filePath);
      const isImpl = isImplementationFile(filePath);

      if (!isTest && !isImpl) {
        // Not a code file (maybe config, docs, etc.), allow
        process.exit(0);
        return;
      }

      // Enforce TDD rules based on phase
      if (state.phase === PHASE.TEST_WRITING) {
        if (isImpl) {
          // VIOLATION: Trying to write implementation during test phase
          console.error('\n❌ TDD Violation: Cannot write implementation code before tests exist and fail\n');
          console.error('Current Phase: TEST WRITING');
          console.error('Attempted File: ' + filePath);
          console.error('\nYou must:');
          console.error('1. Write ALL test files first');
          console.error('2. Run tests to verify they FAIL');
          console.error('3. Only then proceed to implementation\n');
          console.error('Use TodoWrite to track: Mark all test-writing todos complete before implementation.\n');
          process.exit(1);
          return;
        }

        if (isTest) {
          // Track test file
          if (!state.testFiles.includes(filePath)) {
            state.testFiles.push(filePath);
          }
          saveTDDState(state);
          process.exit(0);
          return;
        }
      }

      if (state.phase === PHASE.IMPLEMENTATION) {
        if (isTest) {
          // VIOLATION: Trying to modify tests during implementation
          console.error('\n❌ TDD Violation: Cannot modify tests during implementation phase\n');
          console.error('Current Phase: IMPLEMENTATION');
          console.error('Attempted File: ' + filePath);
          console.error('\nTests are LOCKED during implementation.');
          console.error('If tests need changes, you must:');
          console.error('1. Return to TEST WRITING phase');
          console.error('2. Update tests');
          console.error('3. Verify tests fail');
          console.error('4. Resume implementation\n');
          process.exit(1);
          return;
        }

        if (isImpl) {
          // Track implementation file
          if (!state.implementationFiles.includes(filePath)) {
            state.implementationFiles.push(filePath);
          }
          saveTDDState(state);
          process.exit(0);
          return;
        }
      }

      // Default: allow
      process.exit(0);

    } catch (error) {
      // On error, log but don't block
      console.error('TDD Hook Error:', error.message);
      process.exit(0);
    }
  });
}

// Run hook
enforceTDD();

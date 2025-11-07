#!/usr/bin/env node
/* eslint-disable unicorn/prefer-module, n/no-process-exit, unicorn/no-process-exit */

/**
 * TDD Phase Manager
 *
 * Helper script to manage TDD phase transitions:
 * - Initialize TDD state for a story
 * - Switch from TEST_WRITING to IMPLEMENTATION
 * - Reset TDD state when story completes
 * - Query current phase
 */

const fs = require('fs');
const path = require('path');

const TDD_STATE_FILE = '.claude/tdd-state.json';

const PHASE = {
  TEST_WRITING: 'test_writing',
  IMPLEMENTATION: 'implementation',
  REVIEW: 'review',
};

function loadState() {
  try {
    if (fs.existsSync(TDD_STATE_FILE)) {
      return JSON.parse(fs.readFileSync(TDD_STATE_FILE, 'utf8'));
    }
  } catch (error) {
    // Return default
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

function saveState(state) {
  const dir = path.dirname(TDD_STATE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(TDD_STATE_FILE, JSON.stringify(state, null, 2));
}

const commands = {
  init(storyKey) {
    const state = {
      phase: PHASE.TEST_WRITING,
      testFiles: [],
      testsHaveFailed: false,
      implementationFiles: [],
      storyKey,
      startedAt: new Date().toISOString(),
    };
    saveState(state);
    console.log(`✓ TDD initialized for story: ${storyKey}`);
    console.log(`Phase: TEST_WRITING`);
    console.log('Write all tests first. Implementation is blocked until tests fail.');
  },

  'switch-to-implementation'() {
    const state = loadState();

    if (state.phase !== PHASE.TEST_WRITING) {
      console.log(`Already in ${state.phase} phase`);
      return;
    }

    if (state.testFiles.length === 0) {
      console.error('❌ Cannot switch to implementation: No test files written yet');
      process.exit(1);
      return;
    }

    state.phase = PHASE.IMPLEMENTATION;
    state.switchedToImplAt = new Date().toISOString();
    saveState(state);

    console.log('✓ Switched to IMPLEMENTATION phase');
    console.log(`Test files locked: ${state.testFiles.length} files`);
    console.log('Test modifications are now blocked.');
  },

  'switch-to-review'() {
    const state = loadState();
    state.phase = PHASE.REVIEW;
    state.reviewStartedAt = new Date().toISOString();
    saveState(state);
    console.log('✓ Switched to REVIEW phase');
  },

  reset() {
    if (fs.existsSync(TDD_STATE_FILE)) {
      fs.unlinkSync(TDD_STATE_FILE);
      console.log('✓ TDD state reset');
    } else {
      console.log('No TDD state to reset');
    }
  },

  status() {
    const state = loadState();
    console.log('TDD Status:');
    console.log(`  Phase: ${state.phase}`);
    console.log(`  Story: ${state.storyKey || 'none'}`);
    console.log(`  Test files: ${state.testFiles.length}`);
    console.log(`  Implementation files: ${state.implementationFiles.length}`);

    if (state.testFiles.length > 0) {
      console.log('\nTest files:');
      state.testFiles.forEach(f => console.log(`  - ${f}`));
    }

    if (state.implementationFiles.length > 0) {
      console.log('\nImplementation files:');
      state.implementationFiles.forEach(f => console.log(`  - ${f}`));
    }
  },

  help() {
    console.log('TDD Phase Manager');
    console.log('');
    console.log('Usage: node tdd-manager.js <command> [args]');
    console.log('');
    console.log('Commands:');
    console.log('  init <story-key>              Initialize TDD for a story');
    console.log('  switch-to-implementation      Switch from test writing to implementation');
    console.log('  switch-to-review              Switch to review phase');
    console.log('  reset                         Reset TDD state');
    console.log('  status                        Show current TDD status');
    console.log('  help                          Show this help');
  },
};

// Main
// eslint-disable-next-line unicorn/no-unreadable-array-destructuring
const [,, command, ...args] = process.argv;

if (!command || !commands[command]) {
  commands.help();
  process.exit(command ? 1 : 0);
} else {
  commands[command](...args);
}

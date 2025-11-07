# TDD Enforcement Hooks

This directory contains hooks that enforce Test-Driven Development discipline in Claude Code.

## Files

### `tdd-enforcer.js`
Pre-tool-use hook that intercepts file modifications and enforces TDD rules:
- **Test Writing Phase**: Blocks implementation code until tests exist
- **Implementation Phase**: Blocks test modifications

### `tdd-manager.js`
CLI tool for managing TDD phase transitions:

```bash
# Initialize TDD for a story
node .claude/hooks/tdd-manager.js init story-1-2-auth

# Switch from test writing to implementation (after tests fail)
node .claude/hooks/tdd-manager.js switch-to-implementation

# Switch to review phase
node .claude/hooks/tdd-manager.js switch-to-review

# Check current status
node .claude/hooks/tdd-manager.js status

# Reset (when story complete)
node .claude/hooks/tdd-manager.js reset
```

## How It Works

### Phase 1: Test Writing
1. Story starts → TDD initialized in TEST_WRITING phase
2. Claude writes test files (`.test.js`, `.spec.ts`, `_test.py`, etc.)
3. Hook allows test file creation
4. Hook **BLOCKS** any implementation file creation
5. Tests run and **FAIL** (expected)
6. Switch to implementation phase

### Phase 2: Implementation
1. Command: `switch-to-implementation`
2. Test files are **LOCKED** (modifications blocked)
3. Claude writes implementation code
4. Hook allows implementation file creation/editing
5. Hook **BLOCKS** test file modifications
6. Tests run and **PASS**
7. Switch to review phase

### Phase 3: Review
1. Command: `switch-to-review`
2. Code review validates implementation
3. If changes needed, return to appropriate phase
4. If approved, reset TDD state

## Integration

### Claude Code Hook Configuration

Add to Claude Code settings:

```json
{
  "hooks": {
    "preToolUse": ".claude/hooks/tdd-enforcer.js"
  }
}
```

### BMAD Workflow Integration

Skills and workflows use `tdd-manager.js` to manage phases:

- **start-dev skill**: Calls `tdd-manager.js init {story-key}`
- **User approves plan**: User manually runs tests, then calls `switch-to-implementation`
- **code-review workflow**: Calls `switch-to-review`
- **mark-done skill**: Calls `reset`

## Test Framework Support

The hook detects test files using common patterns:
- **JavaScript/TypeScript**: `*.test.js`, `*.spec.ts`, `*.test.jsx`, `*.spec.tsx`
  - Jest
  - Vitest
  - Bun Test
- **Python**: `test_*.py`, `*_test.py`
  - pytest
- **Go**: `*_test.go`
  - Go test
- **Rust**: `*_test.rs`
  - Rust test
- **PHP**: `*Test.php`
  - PHPUnit

## Troubleshooting

**Hook blocking legitimate operations?**
- Check phase: `node .claude/hooks/tdd-manager.js status`
- Ensure you're in correct phase for the operation
- Reset if stuck: `node .claude/hooks/tdd-manager.js reset`

**Tests not detected?**
- Verify test file naming matches patterns above
- Check that `package.json` has test script (for JS/TS)

**Need to modify tests during implementation?**
- This is intentionally blocked (TDD principle)
- If tests are wrong, switch back to test phase
- Update tests, verify they fail, then resume implementation

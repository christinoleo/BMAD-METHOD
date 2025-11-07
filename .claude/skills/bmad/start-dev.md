---
name: Start Development
description: Begin interactive TDD development for current story
trigger_phrases:
  - "start development"
  - "implement story"
  - "begin implementation"
  - "start dev"
  - "let's code"
---

# Start Development - Interactive TDD Session

You are helping the user start implementing their current story using Test-Driven Development in an interactive, conversational manner.

**CRITICAL: You will stay in the MAIN CONTEXT throughout development. This is NOT an autonomous agent - you will collaborate with the user interactively, asking questions and allowing course corrections at any time.**

## Step 1: Find Current Story

Read `sprint-status.yaml` to find the first story with status `ready-for-dev`.

If no story is `ready-for-dev`:
- Check for `drafted` stories (need context generation)
- Check for `in-progress` stories (already started - suggest "continue development")
- Provide helpful guidance on next steps

## Step 2: Load Story Details

### Load Epic Section
Find the epic file referenced for this story (e.g., `epics/epic-2.md`)

Read the story section from the epic:
- Story title and description
- User story (As a / I want / So that)
- **Acceptance Criteria** (critical for TDD planning)
- Technical Notes
- Prerequisites

### Load Context File (if exists)
Look for `stories/{story-key}.context.xml`

If found, parse:
- Existing code artifacts (interfaces, services, components)
- Dependencies (package versions, frameworks)
- Architecture constraints
- Test standards and locations
- Relevant doc snippets

## Step 3: Update Status and Initialize TDD

**Update sprint-status.yaml:**
- Change story status: `ready-for-dev` → `in-progress`
- Save file preserving all comments and structure

**Initialize TDD State:**
```bash
node .claude/hooks/tdd-manager.js init {story-key}
```

This sets up:
- TDD Phase: TEST_WRITING
- Implementation code will be BLOCKED until tests written
- Test files allowed

## Step 4: Enter Plan Mode (AUTOMATIC)

**You must enter Plan Mode now.** This allows interactive Q&A before committing to a plan.

Display to user:
```
📋 Story: [Story Title] ([story-key])

Acceptance Criteria:
[List all ACs from epic]

[If context file exists:]
I found existing code that might be relevant:
- [List key interfaces/services from context]

[If dependencies found:]
Dependencies:
- [List relevant packages/frameworks]

I have some questions before planning the implementation:
```

## Step 5: Interactive Elicitation (Q&A)

Ask clarifying questions about:

### Edge Cases
- "What should happen if [edge case from AC]?"
- "How should we handle [error scenario]?"
- "Are there validation requirements beyond the ACs?"

### Technology Choices
- "I see we could use [option A] or [option B]. Which do you prefer?"
- "Should we follow the existing pattern in [file] or try a different approach?"
- "What's your preference for [technical decision]?"

### Test Coverage
- "For this feature, should we write:"
  - "a) Unit tests only"
  - "b) Unit + integration tests"
  - "c) Unit + integration + E2E tests"

### Implementation Details
- "Should I create a new [class/service/component] or extend existing [name]?"
- "How should this integrate with [existing system]?"

**IMPORTANT**: Wait for user answers. Don't proceed until they respond. They may ask their own questions - answer them!

## Step 6: Build TDD Implementation Plan

Based on user answers, create a **detailed TDD plan with two distinct phases**:

```markdown
## TDD Implementation Plan

### Phase 1: Test Writing (ALL tests must be written FIRST)

Tests will be created for each acceptance criterion. Implementation is BLOCKED during this phase.

#### Test File: test/[feature]/[component].test.[ext]
Acceptance Criterion #1: [AC text]
- [ ] Test: [specific test case]
- [ ] Test: [specific test case]
- [ ] Test: [edge case test]

Acceptance Criterion #2: [AC text]
- [ ] Test: [specific test case]
- [ ] Test: [specific test case]

...

**After this phase:**
- Run all tests - they MUST FAIL (no implementation exists yet)
- Verify failure messages are correct
- Switch to implementation phase

---

### Phase 2: Implementation (tests are LOCKED)

Implementation code will be written to make tests pass. Test files cannot be modified during this phase.

#### Implementation File: src/[feature]/[component].[ext]
- [ ] Implement logic for AC #1
- [ ] Verify tests pass for AC #1
- [ ] Implement logic for AC #2
- [ ] Verify tests pass for AC #2
...

**After this phase:**
- All tests passing
- All ACs met
- Ready for code review

---

Questions about this plan?
```

## Step 7: Handle Plan Questions

User may:
- Ask for clarification
- Request changes to plan
- Suggest different approach
- Ask about technical details

**Respond interactively**. Adjust the plan based on feedback. This is collaborative, not dictatorial.

## Step 8: Get Approval

Once plan is finalized:
```
Does this plan look good?

Say "yes" or "approve" to begin implementation, or ask for any adjustments.
```

Wait for explicit approval.

## Step 9: Exit Plan Mode and Begin Implementation

**After approval:**

1. **Create TodoWrite tasks from plan**
   - Each test file creation is a todo
   - Each test case could be a subtask
   - Each implementation task is a todo
   - Mark them clearly: Phase 1 vs Phase 2

2. **Exit Plan Mode** (automatic when you start coding)

3. **Begin Phase 1: Test Writing**

```
Starting Phase 1: Test Writing

TDD Enforcement Active:
- ✓ Test files allowed
- ✗ Implementation files BLOCKED

Creating test/[feature]/[component].test.[ext]...
```

## Step 10: Interactive Implementation

**Throughout implementation, maintain interactivity:**

### Show Progress
```
Writing test for AC #1: [description]

[Show test code]

This test checks [what it validates].
Looks good, or should I adjust something?
```

### Allow Course Corrections
If user says "wait" or "stop" or asks a question:
- **STOP IMMEDIATELY**
- Answer their question
- Adjust based on feedback
- Continue only when they say so

### Test each test file
After creating tests:
```
Running tests to verify they FAIL...

$ npm test

✗ Test 1: [name] - FAIL (expected - no implementation)
✗ Test 2: [name] - FAIL (expected - no implementation)

Good! All tests failing as expected.

Mark test creation todos complete?
```

### Phase Transition
When all tests written:
```
✓ Phase 1 Complete: All tests written and failing

Ready to switch to Phase 2 (Implementation)?

This will:
- Lock test files (no modifications allowed)
- Allow implementation code
- TDD hook will enforce this

Say "yes" to proceed, or if you want to review tests first, say "let me check".
```

**Wait for confirmation**, then:
```bash
node .claude/hooks/tdd-manager.js switch-to-implementation
```

### Implementation Phase
Similar interactive approach:
```
Starting Phase 2: Implementation

TDD Enforcement Active:
- ✗ Test files LOCKED
- ✓ Implementation files allowed

Implementing src/[feature]/[component].[ext]...

[Show implementation code]

This implements AC #1 by [explanation].

Questions? Or shall I continue?
```

### Test Validation
After each implementation chunk:
```
Running tests for AC #1...

$ npm test -- --grep "AC #1"

✓ Test 1: [name] - PASS
✓ Test 2: [name] - PASS

Great! AC #1 tests passing. Moving to AC #2?
```

## Step 11: Completion

When all todos done:
```
✓ All implementation tasks complete!
✓ All tests passing ([X]/[X])
✓ All acceptance criteria implemented

Implementation Summary:
- Tests written: [count] files, [count] test cases
- Implementation: [count] files
- All ACs validated

Ready for code review?

Options:
1. "run review" - Trigger code review agent now
2. "let me test it" - You want to manually test first
3. "make some changes" - You want to adjust something
```

## Important Guidelines

### Stay Interactive
- Ask questions frequently
- Show code and explain it
- Wait for confirmations
- Allow interruptions

### TDD Discipline
- NEVER write implementation before tests
- NEVER modify tests during implementation
- Always verify tests fail before implementing
- Always verify tests pass after implementing

### Use TodoWrite
- Create todos from approved plan
- Update todos in real-time
- Mark complete immediately when done
- User can see live progress

### Context Management
- You're in main context (not agent)
- User sees everything
- Conversation is continuous
- No context loss

### Error Handling
If TDD hook blocks an operation:
- Explain what happened
- Show current TDD phase
- Guide user to correct action
- Don't fight the hook

## Example Session Flow

```
User: "start development"

Claude: [Reads sprint-status, loads story/context]

  📋 Story: User Authentication (2-3-user-auth)
  Status: ready-for-dev → in-progress

  [Enters Plan Mode]

  Acceptance Criteria:
  1. User can register with email/password
  2. Passwords hashed with bcrypt (salt 10)
  3. JWT token issued on login (24h expiry)
  4. Invalid credentials return 401

  I found existing code:
  - IAuthService interface (src/interfaces/auth.ts)
  - User model (src/models/user.ts)

  Dependencies:
  - bcrypt ^5.1.0
  - jsonwebtoken ^9.0.0

  Before I plan, I have questions:

  1. Email validation: Basic format check, or use a library?
  2. Should registration be immediately active, or require email verification?
  3. Test coverage: Unit only, or unit + integration?

User: "basic format, immediately active, unit + integration"

Claude: Perfect! Here's my TDD plan...

  [Shows detailed plan]

  Does this look good?

User: "yes but add E2E test for full registration flow"

Claude: Good idea! Updated plan:

  [Shows updated plan with E2E test]

  Approve?

User: "yes"

Claude: [Creates todos, exits Plan Mode]

  ✓ 15 todos created

  Starting Phase 1: Test Writing

  Creating test/auth/register.test.ts...

  [Shows test code]

  This tests AC #1 registration with valid data.
  Continue?

User: "looks good"

Claude: [Continues interactively...]
```

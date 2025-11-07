# Phase 4 Quick Start Guide

Get started with BMAD Method Phase 4 (Interactive TDD) in 5 minutes.

## Prerequisites

✅ Completed Phases 1-3 (PRD, Architecture, Epics created)
✅ `sprint-status.yaml` exists (from sprint-planning workflow)
✅ Claude Code with BMAD installed
✅ Epic files contain story sections

## Optional: Epic Preparation (Recommended)

Before creating stories for an epic, you can generate a technical specification. This is **optional but highly recommended** for complex epics.

### When to Use Epic Context

If your epic has status `backlog` in sprint-status.yaml, you can generate a tech spec:

```
You: "what's next"

Claude: Epic 2: User Management (backlog)

        Next: Generate Technical Specification

        Tech specs provide:
        - Detailed technical design
        - Component architecture
        - Traceability mapping (ACs → Components → Tests)
        - Test strategy

        This makes story creation more precise.

        Generate epic context now? (recommended)

You: "generate epic context"

Claude: Launching epic-context agent...

[Agent processes PRD, Architecture, prior specs in separate context]

Epic Context Agent:
  ✓ Loaded PRD and Architecture
  ✓ Analyzed Epic 2 requirements
  ✓ Scanned repository dependencies
  ✓ Synthesized technical design
  ✓ Created traceability mapping

  Tech spec generated: docs/tech-spec-epic-2.md (32.4 KB)
  Epic Status: backlog → contexted

  Ready to create stories!
```

**Command:** `"generate epic context"`
**What it does:** Creates comprehensive technical specification for the epic
**When:** Once per epic, before creating stories
**Output:** `docs/tech-spec-epic-{N}.md`
**Can skip?:** Yes, but tech specs provide crucial implementation guidance

**Skip to story creation:** If your epic already has "contexted" status, or you want to proceed without a tech spec, continue to the next section.

---

## Your First Story (5 Steps)

### Step 1: Check What's Next (30 seconds)

```
You: "what's next"

Claude: You're on Epic 1. Next story needs creation.
        Story 1-2: User Authentication (backlog)

        Would you like to create this story?
```

**Command:** `"what's next"`
**What it does:** Reads sprint-status.yaml, tells you exactly what to do

---

### Step 2: Create the Story (1 minute)

```
You: "create next story"

Claude: Creating story from epic...
        ✓ Story created: User Authentication (1-2-user-auth)
        Status: backlog → drafted

        Next: Generate context to scan codebase
        Say "generate context" when ready
```

**Command:** `"create next story"`
**What it does:** Extracts story from epic, updates status

---

### Step 3: Generate Context (2 minutes)

```
You: "generate context"

Claude: Launching story-context agent...

[Agent scans in separate context]

Story Context Agent:
  Scanning for authentication code...
  ✓ Found: IAuthService interface
  ✓ Found: User model
  ✓ Dependencies: bcrypt, jsonwebtoken

  Context generated: stories/1-2-user-auth.context.xml (7.8KB)
  Status: drafted → ready-for-dev

  Ready for development!
```

**Command:** `"generate context"`
**What it does:** Scans codebase, creates focused .context.xml
**Why:** 90% token savings during development
**Can skip?:** Yes, but not recommended

---

### Step 4: Develop with TDD (Main event!)

```
You: "start development"

Claude: [Loads story + context]
        [Enters Plan Mode automatically]

        📋 Story: User Authentication

        Acceptance Criteria:
        1. User can register with email/password
        2. Passwords hashed with bcrypt
        3. JWT issued on login (24h)

        I found existing code:
        - IAuthService interface
        - bcrypt and jsonwebtoken already installed

        Questions before I plan:
        1. Email validation level? (basic @ check or full RFC validation)
        2. Test coverage? (unit only, or unit + integration)

You: "basic validation, unit + integration tests"

Claude: Perfect! Here's my TDD plan:

        **Phase 1: Test Writing**
        - test/auth/register.test.ts (5 tests)
        - test/auth/login.test.ts (4 tests)
        - test/auth/integration.test.ts (2 tests)

        **Phase 2: Implementation**
        - src/auth/register.ts
        - src/auth/login.ts
        - src/auth/jwt-utils.ts

        Approve this plan?

You: "yes"

Claude: [Exits Plan Mode]
        ✓ Todos created (15 tasks)
        ✓ TDD initialized: TEST_WRITING phase

        Starting Phase 1: Test Writing
        Implementation is BLOCKED by hooks

        Creating test/auth/register.test.ts...

        [Shows test code]

        This tests AC #1: User registration
        Continue?

You: "looks good"

Claude: [Continues writing tests]
        ...
        ✓ All tests written

        Running tests to verify they FAIL...
        $ npm test
        ✗ All 11 tests failing (expected!)

        Ready to switch to implementation?

You: "yes"

Claude: Switching to IMPLEMENTATION phase...
        ✓ Tests are now LOCKED

        Implementing src/auth/register.ts...

        [Shows implementation code]

        Continue?

You: "yes"

Claude: [Continues implementing]
        ...
        ✓ All implementation complete
        ✓ All tests passing (11/11)

        Ready for code review!
```

**Command:** `"start development"`
**What happens:**
1. Plan Mode Q&A
2. Build TDD plan together
3. Get your approval
4. Phase 1: Write tests (impl blocked)
5. Phase 2: Implement (tests locked)
6. Interactive throughout - you can interrupt anytime!

---

### Step 5: Review & Complete (1-2 minutes)

```
You: "run review"

Claude: Launching code-review agent...

[Agent validates in separate context]

Story Reviewer Agent:
  ✓ AC #1: Fully implemented with evidence
  ✓ AC #2: Fully implemented with evidence
  ✓ AC #3: Fully implemented with evidence
  ✓ Security: No issues
  ✓ Tests: 11/11 passing, 96% coverage

  CODE REVIEW: APPROVED
  Confidence: HIGH

  Auto-approving story

You: "mark done"

Claude: ✓ Story marked DONE
        Epic 1 Progress: 2 of 5 complete

        Next story: Password Reset (1-3-password-reset)
        Status: drafted

        Would you like to generate context for the next story?
```

**Commands:**
- `"run review"` - Systematic validation (auto-suggested when done)
- `"mark done"` - Finalize and move to next story

---

## Key Concepts (Under the Hood)

### TDD Enforcement

**Phase 1: Test Writing**
```bash
# Automatically initialized when you start development
# Hooks BLOCK implementation code
# You must write ALL tests first
```

**Phase 2: Implementation**
```bash
# After tests fail, switch phases:
node .claude/hooks/tdd-manager.js switch-to-implementation

# Hooks LOCK test files
# You can only write implementation code
```

**Phase 3: Review**
```bash
# Happens automatically via code-review agent
# Then: "mark done" to complete
```

### What You See

**Interactive Development:**
- ✅ You see every line of code
- ✅ Can ask questions anytime
- ✅ Can course-correct immediately
- ✅ TodoWrite shows live progress
- ✅ No "black box" autonomous execution

### Token Efficiency

**Epic References:**
- Story details stay in epic (no duplication)
- 70-95% token reduction
- Single source of truth

**Context Files:**
- Pre-scanned, focused artifacts
- 90% savings vs loading full codebase
- One-time cost per story

**Agents:**
- Heavy work (scanning, review) in separate contexts
- Main context stays clean
- No bloat

## Common Commands

### Navigation
```
"what's next"           → What should I do now?
"project status"        → Show sprint progress
```

### Epic Preparation (Optional)
```
"generate epic context" → Create tech spec for epic (agent)
```

### Story Lifecycle
```
"create next story"     → Extract from epic
"generate context"      → Scan codebase (agent)
"start development"     → Plan Mode + TDD (interactive!)
"run review"            → Validate (agent)
"mark done"             → Complete story
```

### TDD Management
```bash
# Check current phase
node .claude/hooks/tdd-manager.js status

# Switch to implementation (after tests fail)
node .claude/hooks/tdd-manager.js switch-to-implementation

# Reset when story done
node .claude/hooks/tdd-manager.js reset
```

## Tips & Tricks

### During Planning (Plan Mode)
💡 **Ask lots of questions** - This is your chance to clarify
💡 **Think about edge cases** - Plan for them upfront
💡 **Review the plan carefully** - Easier to fix now than during coding

### During Test Writing
💡 **Write test names first** - Helps organize thoughts
💡 **Cover all ACs** - One test per acceptance criterion minimum
💡 **Think about edge cases** - Invalid inputs, errors, boundaries
💡 **Run tests to verify FAIL** - Confirms tests are actually testing something

### During Implementation
💡 **Make one test pass at a time** - Don't try to do everything
💡 **Run tests frequently** - Immediate feedback
💡 **Keep it simple** - Make tests pass, refactor later
💡 **Don't modify tests** - Hooks will block you (intentional!)

### During Review
💡 **Read findings carefully** - Evidence-based, file:line references
💡 **Fix HIGH severity first** - Prioritize issues
💡 **Don't rush** - Quality matters
💡 **Rerun review after fixes** - Verify changes addressed issues

## Troubleshooting

### "Hook is blocking my operation!"
```bash
# Check what phase you're in
node .claude/hooks/tdd-manager.js status

# Common fixes:
# - In test phase but trying to implement? Finish tests first
# - In implementation but trying to edit tests? Tests are locked (by design!)
# - Stuck? Reset: node .claude/hooks/tdd-manager.js reset
```

### "Skills aren't working!"
```
1. Check .claude/skills/bmad/ directory exists
2. Restart Claude Code
3. Try slash command instead: /bmad:bmm:workflows:create-story
```

### "I want to see the plan again"
```
Plans are in Claude's conversation history.
Scroll up to see the approved plan.
Or check todos: TodoWrite shows current tasks.
```

### "Can I skip context generation?"
```
Yes, but not recommended.
Context saves 90% tokens during development.
Without it, Claude must scan codebase repeatedly.
```

## Next Steps

**After your first story:**
1. ✅ You understand the flow
2. ✅ Repeat for remaining stories
3. ✅ Run retrospective after epic completes
4. ✅ Start next epic

**Deep dive:**
- Read `.claude/README.md` - Full architecture
- Read `.claude/MIGRATION.md` - If coming from v5
- Read `CLAUDE.md` (in your project) - Project-specific rules

**Get help:**
- "what's next" - Always tells you what to do
- "project status" - See overall progress
- TDD status - Check hook phase

---

**Ready to start?**

```
You: "what's next"
Claude: [Tells you exactly what to do]
```

**That's it! Happy coding with TDD! 🚀**

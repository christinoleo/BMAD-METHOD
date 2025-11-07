# Migration Guide: Phase 4 v5 → v6 (Interactive TDD)

This guide helps you transition from BMAD Method Phase 4 v5 (autonomous dev-story workflow) to v6 (interactive TDD with skills/agents).

## TL;DR - What Changed?

**Old Way (v5):**
```
1. Run /bmad:bmm:workflows:dev-story
2. Wait for autonomous implementation
3. Run /bmad:bmm:workflows:code-review
4. Run /bmad:bmm:workflows:story-done
```

**New Way (v6):**
```
1. "start development" (skill)
2. Interactive Plan Mode Q&A
3. Collaborative TDD implementation (you see everything)
4. Auto-review when done
5. "mark done" (skill)
```

## Key Differences

| Aspect | Old (v5) | New (v6) |
|--------|----------|----------|
| **Entry** | Slash commands | Conversational skills |
| **Development** | Autonomous agent | Interactive, main context |
| **TDD** | Optional, manual | Enforced by hooks |
| **Visibility** | Black box | Real-time, full visibility |
| **Course correction** | Hard (wait for agent) | Easy (interrupt anytime) |
| **Context** | 7-8 fresh chats | 3-4 (skills + 2 agents) |
| **Story files** | Full 1200-line files | Epic references (70% smaller) |
| **Token efficiency** | Moderate | High (70-95% savings) |

## Migration Steps

### Step 1: Understand the New Architecture

**Three Layers:**
1. **Skills** (main context) - User-facing, conversational, interactive
2. **Agents** (separate context) - Heavy processing only
3. **Hooks** (global) - TDD enforcement

**Two Agents Only:**
- `story-context` - Codebase scanning (replaces manual context gathering)
- `code-review` - Validation (existing workflow, enhanced)

**Five Skills:**
- `whats-next` - Navigation
- `create-story` - Story creation
- `start-dev` - **Interactive development** (replaces dev-story)
- `mark-done` - Completion
- `project-status` - Progress overview

### Step 2: Install New Components

If you're on an existing BMAD project:

```bash
# From BMAD repo
npm run install:bmad

# Select your project
# Select Claude Code (or Windsurf)
# Installation adds:
#   .claude/hooks/      (TDD enforcement)
#   .claude/skills/     (5 skills)
#   .claude/agents/     (2 agents)
#   CLAUDE.md           (if not exists)
```

### Step 3: Adopt New Workflow

**Before (v5):**
```
SM Agent: /create-story
SM Agent: /story-context
DEV Agent: /dev-story           # Autonomous, long-running
DEV Agent: /code-review
DEV Agent: /story-done
```

**After (v6):**
```
Main: "create next story"        # Skill
Main: "generate context"         # Agent (separate context)
Main: "start development"        # Skill → Plan Mode → Interactive TDD
Main: "run review"               # Agent (separate context) - auto-suggested
Main: "mark done"                # Skill
```

### Step 4: Understand TDD Workflow

**New: TDD is Enforced**

Phase 1: Test Writing
```
- start-dev skill initializes TDD
- Write tests (implementation BLOCKED by hooks)
- Run tests - they must FAIL
- User: Tests look good? Proceed
- Command: switch-to-implementation
```

Phase 2: Implementation
```
- Tests are LOCKED (no modifications)
- Write implementation code
- Tests must PASS
- TodoWrite shows progress
```

Phase 3: Review
```
- Auto-suggested when todos done
- Run: "run review"
- Agent validates in separate context
```

### Step 5: Handle Existing Stories

**Stories Created with v5:**

Option A: Complete them with v5 workflows
- Keep using slash commands until done
- New stories use v6

Option B: Migrate to v6
- Existing story files still work
- Just use new skills instead of workflows
- TDD hooks won't affect existing implementation

**New Stories:**

Use v6 from the start:
1. "create story" - Creates minimal entry (or epic reference)
2. "generate context" - Scans codebase
3. "start development" - Interactive TDD

## Breaking Changes

### ❌ No Longer Supported

1. **Autonomous dev-story**
   - Old: Long-running autonomous implementation
   - New: Interactive, collaborative development
   - **Why:** User wants to see progress, course-correct, ask questions

2. **Manual TDD (optional)**
   - Old: Dev could skip tests or write them after
   - New: Hooks enforce test-first
   - **Why:** TDD discipline improves quality

3. **Full story markdown files**
   - Old: 1200-line story files with duplicated content
   - New: Epic references with minimal tracking
   - **Why:** 70-95% token savings

### ⚠️ Changed Behavior

1. **create-story output**
   - Old: Full story.md file
   - New: Minimal entry in sprint-status.yaml with epic reference
   - **Migration:** Old files still work if they exist

2. **code-review triggers**
   - Old: Manual slash command
   - New: Auto-suggested when todos complete
   - **Migration:** Can still trigger manually with "run review"

3. **Context files**
   - Old: Optional
   - New: Highly recommended (90% token savings)
   - **Migration:** Skip with "start development" if no context exists

## New Features

### ✅ Now Available

1. **Plan Mode Integration**
   - Interactive Q&A before implementation
   - User approves plan before execution
   - Can ask questions during planning

2. **TDD Enforcement**
   - Hooks prevent wrong-phase operations
   - Supports: Jest, Vitest, Bun, pytest, Go, Rust, PHPUnit
   - Phase management CLI

3. **Skills System**
   - Conversational triggers
   - Discoverable in Claude UI
   - Natural language interaction

4. **Agents for Heavy Work**
   - Separate contexts (no bloat)
   - Codebase scanning (story-context)
   - Deep validation (code-review)

5. **Confidence-Based Review**
   - HIGH: Auto-approve simple stories
   - MEDIUM/LOW: Suggest manual review
   - Evidence-based findings

6. **Real-Time Visibility**
   - See code as it's written
   - Interrupt anytime
   - Course-correct immediately

## Backward Compatibility

### What Still Works

✅ **Existing workflows** - All slash commands functional
✅ **Story files** - Old format still valid
✅ **sprint-status.yaml** - Same structure (extended)
✅ **Epic files** - No changes needed
✅ **Context files** - .context.xml format unchanged

### What's Optional

- **Skills** - Can still use slash commands if preferred
- **TDD hooks** - Can disable if needed (not recommended)
- **Epic references** - Can keep full story files
- **Agents** - Can invoke workflows directly

### Gradual Migration

You can adopt v6 features gradually:

**Week 1:** Install hooks/skills/agents, keep using workflows
**Week 2:** Try "create story" and "start development" skills
**Week 3:** Adopt TDD workflow fully
**Week 4:** Switch to epic references for new stories

## Common Questions

### Q: Can I disable TDD enforcement?
A: Yes, remove `.claude/hooks/` directory. **Not recommended** - TDD discipline improves quality significantly.

### Q: Do I have to use skills?
A: No, you can still use slash commands directly. Skills just provide a better UX.

### Q: What if my story is already in-progress with v5?
A: Finish it with v5 workflows, or switch to v6 (compatible). New stories use v6.

### Q: Are agents required?
A: No, but highly recommended:
- `story-context`: 90% token savings
- `code-review`: Systematic validation

### Q: Can I mix v5 and v6 approaches?
A: Yes during migration. Eventually, v6 is recommended for all new work.

### Q: What about Cursor/Windsurf?
A: Hooks work on all IDEs. Skills/agents are Claude Code specific currently.

### Q: Do I need to update my epics?
A: No, existing epic structure already supports story sections.

## Troubleshooting

### Issue: Skills not appearing
```
Solution:
1. Check .claude/skills/bmad/ exists
2. Restart Claude Code
3. Verify Claude Code version supports skills
```

### Issue: TDD hook blocking legitimate operation
```
Solution:
1. Check phase: node .claude/hooks/tdd-manager.js status
2. Switch phase if needed
3. Reset if stuck: node .claude/hooks/tdd-manager.js reset
```

### Issue: Can't find epic references
```
Solution:
Epic sections already exist in your epics.
Format: ### Story N.M: Title
No changes needed to existing epics.
```

### Issue: Migration mid-sprint
```
Solution:
Option A: Finish current sprint with v5, start v6 next sprint
Option B: Mix approaches (compatible during transition)
```

## Best Practices for Migration

### DO
✅ Read .claude/README.md thoroughly
✅ Try "whats-next" to understand current state
✅ Start with one story using v6
✅ Use TDD hooks (enforce discipline)
✅ Let code-review agent validate
✅ Provide feedback on new system

### DON'T
❌ Skip reading documentation
❌ Disable TDD hooks without good reason
❌ Mix v5/v6 for same story (finish one way)
❌ Expect autonomous dev (v6 is interactive)
❌ Skip context generation (huge token savings)

## Need Help?

**Resources:**
- `.claude/README.md` - Complete architecture doc
- `.claude/hooks/README.md` - TDD system details
- `CLAUDE.md` (in your project) - Project-specific guidance
- BMAD docs (docs/ in repo) - Full method documentation

**Common Workflows:**
- "what's next" - Always shows you what to do
- "project status" - See overall progress
- TDD status - node .claude/hooks/tdd-manager.js status

**Support:**
- Check existing documentation first
- Review troubleshooting section above
- BMAD Method community/issues

---

**Migration Version:** v5 → v6
**Date:** January 2025
**Status:** Stable

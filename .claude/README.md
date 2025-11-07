# BMAD Method Phase 4: Interactive TDD Implementation

This directory contains the complete implementation infrastructure for BMAD Method Phase 4 (Implementation), featuring:

- **TDD Enforcement** - Hooks that enforce test-first discipline
- **Skills Layer** - Conversational, user-facing commands
- **Agents Layer** - Heavy processing in separate contexts
- **Project Configuration** - CLAUDE.md template for project-specific guidance

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Skills (Main Context - Interactive)            │
│  - User sees everything                         │
│  - Plan Mode for planning                       │
│  - Natural conversation flow                    │
│  - TDD implementation with TodoWrite            │
└─────────────────────────────────────────────────┘
                    ↓ heavy work only
┌─────────────────────────────────────────────────┐
│  Agents (Separate Context - Background)         │
│  - story-context: Codebase scanning             │
│  - code-review: Deep validation                 │
│  - Return results, no bloat                     │
└─────────────────────────────────────────────────┘
                    ↓ enforce throughout
┌─────────────────────────────────────────────────┐
│  TDD Hooks (Global - Active Always)             │
│  - Test phase: Block implementation             │
│  - Implementation phase: Lock tests             │
│  - Framework-agnostic                           │
└─────────────────────────────────────────────────┘
```

## Directory Structure

```
.claude/
├── README.md               # This file
├── hooks/                  # TDD enforcement
│   ├── tdd-enforcer.js     # Pre-tool-use hook (blocks operations)
│   ├── tdd-manager.js      # CLI for phase management
│   └── README.md           # Hook documentation
│
├── skills/bmad/            # User-facing commands (main context)
│   ├── whats-next.md       # Navigation and suggestions
│   ├── generate-epic-context.md  # Epic tech spec generation
│   ├── create-story.md     # Story creation from epics
│   ├── start-dev.md        # Interactive TDD development
│   ├── run-review.md       # Code review validation
│   ├── mark-done.md        # Story completion
│   └── project-status.md   # Sprint progress overview
│
└── agents/bmad/            # Heavy processing (separate context)
    ├── epic-context.md     # Tech spec generation (per epic)
    ├── story-context.md    # Codebase scanning (per story)
    └── code-review.md      # Systematic validation
```

## Complete Story Lifecycle

### 1. Create Story
```
User: "create next story"
→ Skill extracts story from epic
→ Updates sprint-status.yaml: backlog → drafted
→ Suggests: "generate context"
```

### 2. Generate Context (Agent)
```
User: "generate context"
→ Agent scans codebase in separate context
→ Finds relevant interfaces, services, dependencies
→ Creates .context.xml (token-efficient, focused)
→ Updates status: drafted → ready-for-dev
→ Suggests: "start development"
```

### 3. Start Development (Interactive)
```
User: "start development"
→ Loads epic section + .context.xml
→ Enters Plan Mode automatically
→ Iterative Q&A with user:
  * Edge cases?
  * Technology choices?
  * Test coverage level?
→ Builds TDD plan together
→ User approves
→ Exits Plan Mode
→ Initializes TDD: node .claude/hooks/tdd-manager.js init {story-key}
→ Updates status: ready-for-dev → in-progress
→ Begins Phase 1: Test Writing
```

### 4. TDD Implementation (Interactive)
```
Phase 1: Test Writing
  → TDD hook BLOCKS any implementation code
  → User sees test files being created
  → Can interrupt, ask questions, course-correct
  → Run tests - all must FAIL
  → User: "tests look good, start implementation"
  → Command: node .claude/hooks/tdd-manager.js switch-to-implementation

Phase 2: Implementation
  → TDD hook LOCKS test files (no modifications)
  → User sees implementation code being written
  → Can interrupt, ask questions, course-correct
  → Run tests - all must PASS
  → TodoWrite shows live progress
  → When all todos done: "Ready for review"
```

### 5. Code Review (Agent)
```
User: "run review"
→ Agent runs in separate context
→ Validates all ACs with evidence (file:line)
→ Security scan
→ Test coverage analysis
→ Architecture alignment check

Outcomes:
  APPROVE + HIGH confidence → Auto-approve, suggest "mark done"
  APPROVE + MEDIUM/LOW → Manual confirmation needed
  CHANGES REQUESTED → Add todos, suggest "continue"
  BLOCKED → Critical issues, halt
```

### 6. Complete Story
```
User: "mark done"
→ Updates status: review → done
→ Resets TDD state: node .claude/hooks/tdd-manager.js reset
→ Suggests next story
```

## Key Features

### Interactive Development
- **Main context** throughout implementation
- User sees everything in real-time
- Can interrupt, ask questions, course-correct anytime
- Collaborative, not autonomous

### TDD Enforcement
- Hooks enforce test-first workflow
- Phase 1: Tests only (implementation blocked)
- Phase 2: Implementation only (tests locked)
- Supports: Jest, Vitest, Bun Test, pytest, Go, Rust, PHPUnit

### Token Efficiency
- **Epic references** - Stories reference epic sections (no duplication)
- **Context files** - Pre-processed .context.xml (90% savings)
- **Agents** - Heavy work in separate contexts
- **Skills** - Light operations in main context

### Confidence-Based Review
- HIGH: Auto-approve simple stories
- MEDIUM/LOW: Suggest manual review
- Evidence-based findings (file:line references)
- Security scanning

## Skills Reference

### whats-next
**Triggers:** "what's next", "what should I do", "where are we"

Checks ALL BMAD phases (1-4) and suggests next action:
- No PRD → "create PRD"
- No Architecture → "create architecture"
- No Epics → "create epics"
- Epic backlog → "generate epic context"
- Story backlog → "create story"
- Story drafted → "generate context"
- Story ready-for-dev → "start development"
- Story in-progress → "continue" or "run review"
- Story review → "mark done"
- Epic complete → "run retrospective"

### generate-epic-context
**Triggers:** "generate epic context", "create tech spec", "prepare epic"

Launches epic-context agent to generate technical specification for an epic.
- Runs once per epic before creating stories
- Creates comprehensive tech spec (15-50 KB)
- Includes traceability mapping, test strategy, NFRs
- Output: `docs/tech-spec-epic-{N}.md`

### create-story
**Triggers:** "create story", "create next story", "new story"

Extracts story from epic, creates minimal tracking entry, updates status.

### start-dev
**Triggers:** "start development", "implement story", "start dev"

**INTERACTIVE - STAYS IN MAIN CONTEXT**
- Loads epic + context
- Enters Plan Mode
- Q&A with user
- Builds TDD plan
- Gets approval
- Initializes TDD
- Implements interactively

### run-review
**Triggers:** "run review", "review story", "code review"

Launches code-review agent to validate completed story.
- Validates all ACs with evidence
- Performs security scanning
- Checks test coverage
- Calculates confidence score
- Provides approval recommendation

### mark-done
**Triggers:** "mark done", "complete story", "story finished"

Marks story as done, resets TDD, suggests next story.

### project-status
**Triggers:** "project status", "sprint status", "show progress"

Displays epic progress, story counts, current focus, actionable suggestions.

## Agents Reference

### epic-context
**Triggers:** "generate epic context", "create tech spec", "prepare epic"

**SEPARATE CONTEXT - HEAVY DOCUMENT SYNTHESIS**
- Loads 5-6+ project documents (PRD, Architecture, GDD, UX, prior specs)
- Analyzes epic requirements
- Scans repository dependencies
- Generates comprehensive technical specification (15-50 KB)
- Creates traceability mapping (ACs → Components → Tests)
- Defines test strategy and NFRs
- **Run once per epic before creating stories**

**Output:** `docs/tech-spec-epic-{N}.md`

### story-context
**Triggers:** "generate context", "prepare story", "build context"

**SEPARATE CONTEXT - HEAVY CODEBASE SCANNING**
- Scans codebase for relevant artifacts
- Searches by story keywords
- Finds interfaces, services, dependencies
- Creates focused .context.xml
- **Run once per story before development**
- 90%+ token savings

**Output:** `stories/{story-key}.context.xml`

### code-review
**Triggers:** "run review", "review story", "code review"

**SEPARATE CONTEXT - HEAVY VALIDATION**
- Validates all ACs with evidence
- Test coverage analysis
- Security scanning
- Architecture check
- Confidence-based recommendations
- **Run after story implementation**

## TDD Hook System

### tdd-enforcer.js
Pre-tool-use hook that intercepts file operations.

**Phase 1 (Test Writing):**
- ✓ Allow: Test file creation/editing
- ✗ Block: Implementation file creation/editing

**Phase 2 (Implementation):**
- ✗ Block: Test file modifications
- ✓ Allow: Implementation file creation/editing

### tdd-manager.js
CLI for managing TDD phases.

```bash
# Initialize for new story
node .claude/hooks/tdd-manager.js init {story-key}

# Switch from test writing to implementation
node .claude/hooks/tdd-manager.js switch-to-implementation

# Switch to review phase
node .claude/hooks/tdd-manager.js switch-to-review

# Check current status
node .claude/hooks/tdd-manager.js status

# Reset when story complete
node .claude/hooks/tdd-manager.js reset
```

## Epic References

Modern BMAD uses epic sections as source of truth:

```yaml
# sprint-status.yaml
development_status:
  2-3-user-auth:
    epic_ref: "epics/epic-2.md#story-2-3"
    status: ready-for-dev
    context_file: "stories/2-3-user-auth.context.xml"
```

**Benefits:**
- No duplication (epic has full details)
- 70-95% token reduction
- Single source of truth
- Easier maintenance

## File Patterns

### Test Files
- Jest/Vitest/Bun: `*.test.ts`, `*.spec.ts`, `*.test.jsx`, `*.spec.tsx`
- pytest: `test_*.py`, `*_test.py`
- Go: `*_test.go`
- Rust: `*_test.rs`
- PHPUnit: `*Test.php`

### Implementation Files
- JavaScript/TypeScript: `*.js`, `*.ts`, `*.jsx`, `*.tsx`
- Python: `*.py`
- Go: `*.go`
- Rust: `*.rs`
- PHP: `*.php`
- Java: `*.java`
- Ruby: `*.rb`

## Installation

These files are automatically installed when you run BMAD installation with Claude Code:

```bash
npm run install:bmad
# Select Claude Code when prompted
```

**What gets installed:**
- `.claude/hooks/` - TDD enforcement
- `.claude/skills/bmad/` - 7 skills
- `.claude/agents/bmad/` - 3 agents
- `CLAUDE.md` - Project configuration (if not exists)

**For Windsurf:**
- `.windsurf/hooks/` - TDD enforcement only (skills/agents are Claude Code specific)

## Troubleshooting

### TDD Hook Blocking Operations?
```bash
# Check current phase
node .claude/hooks/tdd-manager.js status

# Reset if stuck
node .claude/hooks/tdd-manager.js reset
```

### Skills Not Appearing?
- Check `.claude/skills/bmad/` exists
- Verify Claude Code version supports skills
- Try restarting Claude Code

### Agents Not Launching?
- Check `.claude/agents/bmad/` exists
- Verify agent markdown format
- Check Claude Code agent system enabled

### Context File Too Large?
- Review what artifacts were included
- Consider manually pruning .context.xml
- Check search keywords in story

## Workflow Comparison

### Old BMAD Phase 4
- 7-8 fresh chats per story
- Verbose story files (1200+ lines)
- Manual dev-story invocation
- Run-until-complete model
- Limited interactivity

### New BMAD Phase 4
- 3-4 contexts per story (skills + 2 agents)
- Epic references (minimal duplication)
- Conversational triggers
- Interactive, collaborative development
- TDD enforced by hooks
- Real-time visibility

## Benefits

✅ **User Experience**
- Natural conversation flow
- See everything in real-time
- Course-correct anytime
- Plan Mode Q&A

✅ **TDD Discipline**
- Hooks enforce test-first
- Can't skip or cheat
- Framework-agnostic

✅ **Token Efficiency**
- 70-95% reduction vs old approach
- Epic references (no duplication)
- Context files (pre-processed)
- Agents (separate contexts)

✅ **Quality**
- Systematic code review
- Evidence-based validation
- Security scanning
- Architecture alignment

✅ **Speed**
- Fewer context switches
- Pre-processed context
- Auto-suggestions
- Confidence-based approval

## Best Practices

### During Planning
- Ask clarifying questions
- Consider edge cases
- Plan for test coverage
- Think about architecture

### During Implementation
- Write ALL tests first
- Run tests to verify they FAIL
- Switch to implementation phase
- Implement to make tests PASS
- Run tests frequently

### During Review
- Let agent do heavy lifting
- Review findings carefully
- Address high-severity first
- Rerun review after fixes

### General
- One story at a time
- Follow story order (dependencies)
- Run retrospectives after epics
- Keep sprint-status.yaml accurate

## Advanced Usage

### Custom Test Frameworks
Add patterns to `tdd-enforcer.js`:
```javascript
const TEST_FILE_PATTERNS = [
  /\.test\.(js|ts)$/,
  // Add your pattern here
];
```

### Project-Specific Rules
Edit `CLAUDE.md` in your project:
```markdown
## Project-Specific Conventions
### Code Style
- Use async/await (not promises)
- ... your conventions ...
```

### Confidence Thresholds
Edit `code-review.md` agent to adjust confidence calculation.

## Support

**Documentation:**
- CLAUDE.md (in your project)
- Hook READMEs (in .claude/hooks/)
- BMAD Method docs (docs/ in this repo)

**Common Issues:**
- Hooks: Check TDD phase with status command
- Skills: Verify files exist, restart IDE
- Agents: Check markdown format
- Context: Review .context.xml if too large

**BMAD Method:**
- Phase 1-3: Planning (PRD, Architecture, Epics)
- Phase 4: Implementation (this system)
- Sequential story development
- Retrospectives after epics

---

**Version:** 6.0 (Interactive TDD)
**Last Updated:** 2025-01-06
**Maintained By:** BMAD Method Team

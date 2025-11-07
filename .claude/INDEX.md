# BMAD Phase 4 v6: Documentation Index

Welcome to BMAD Method Phase 4 (Interactive TDD)! This index helps you find the right documentation for your needs.

## Quick Navigation

### 🚀 New to Phase 4?
**Start here:** [QUICKSTART.md](QUICKSTART.md)
- 5-minute tutorial
- Your first story walkthrough
- Essential commands
- Tips & tricks

### 📖 Want Complete Understanding?
**Read this:** [README.md](README.md)
- Complete architecture
- All features explained
- Skills and agents reference
- Best practices

### 🔄 Migrating from v5?
**Check this:** [MIGRATION.md](MIGRATION.md)
- What changed
- Migration steps
- Breaking changes
- Backward compatibility

### 👨‍💻 Developer/Maintainer?
**See this:** [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- Technical deep dive
- Architecture decisions
- File structure
- Maintenance notes

## Document Overview

### QUICKSTART.md
**Purpose:** Get started fast
**Length:** ~350 lines
**Time to read:** 10 minutes
**Best for:** First-time users, quick reference

**Contents:**
- Prerequisites checklist
- 5-step story lifecycle
- Interactive development walkthrough
- Common commands
- Troubleshooting

**When to read:** Before implementing your first story

---

### README.md
**Purpose:** Comprehensive documentation
**Length:** ~600 lines
**Time to read:** 30 minutes
**Best for:** Understanding the system completely

**Contents:**
- Architecture overview
- Directory structure
- Complete story lifecycle
- Skills reference (all 7 skills)
- Agents reference (all 3 agents)
- TDD hook system
- Epic references strategy
- Installation instructions
- Troubleshooting
- Best practices

**When to read:** After quick start, when you want full understanding

---

### MIGRATION.md
**Purpose:** Transition guide from v5
**Length:** ~400 lines
**Time to read:** 20 minutes
**Best for:** Existing BMAD users

**Contents:**
- TL;DR comparison
- Key differences table
- 5-step migration process
- Breaking changes explained
- New features overview
- Backward compatibility
- Gradual migration path
- Common questions

**When to read:** If you're used to old dev-story workflow

---

### IMPLEMENTATION_SUMMARY.md
**Purpose:** Technical reference
**Length:** ~650 lines
**Time to read:** 45 minutes
**Best for:** Developers, maintainers, contributors

**Contents:**
- Implementation objectives
- What was built (complete list)
- Architecture deep dive
- File structure
- Integration points
- Test framework support
- Design decisions
- Future enhancements
- Maintenance notes

**When to read:** When modifying or extending the system

---

## Hook Documentation

### hooks/README.md
**Purpose:** TDD enforcement system
**Length:** ~150 lines
**Best for:** Understanding TDD hooks

**Contents:**
- How hooks work
- Phase management
- Test framework support
- Integration instructions
- Troubleshooting hooks

**Location:** `.claude/hooks/README.md`

---

## Recommended Reading Path

### Path 1: Quick Start (First Story)
```
1. QUICKSTART.md (10 min)
2. Try first story (30 min)
3. README.md - Skills section (5 min, as needed)
```

### Path 2: Deep Dive (Full Understanding)
```
1. QUICKSTART.md (10 min)
2. README.md (30 min)
3. hooks/README.md (10 min)
4. Try first story (30 min)
```

### Path 3: Migration (From v5)
```
1. MIGRATION.md (20 min)
2. QUICKSTART.md (10 min)
3. Try one story with v6 (30 min)
4. README.md - as needed
```

### Path 4: Developer (Contributing)
```
1. README.md (30 min)
2. IMPLEMENTATION_SUMMARY.md (45 min)
3. hooks/README.md (10 min)
4. Review source code
```

## Common Scenarios

### "I just want to start coding"
→ [QUICKSTART.md](QUICKSTART.md) → Start at Step 1

### "What's different from before?"
→ [MIGRATION.md](MIGRATION.md) → See TL;DR section

### "How do TDD hooks work?"
→ [hooks/README.md](hooks/README.md) → See "How It Works"

### "I'm stuck on something"
→ [README.md](README.md#troubleshooting) → Troubleshooting section

### "What are all the skills?"
→ [README.md](README.md#skills-reference) → Skills reference

### "How does code review work?"
→ [README.md](README.md#agents-reference) → code-review agent

### "What gets installed?"
→ [README.md](README.md#installation) → Installation section

### "I want to contribute"
→ [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) → Start here

## File Locations

**In BMAD Repo:**
```
.claude/
├── INDEX.md                    # This file
├── README.md                   # Complete documentation
├── QUICKSTART.md               # Getting started
├── MIGRATION.md                # v5 → v6 migration
├── IMPLEMENTATION_SUMMARY.md   # Technical deep dive
│
├── hooks/
│   ├── tdd-enforcer.js        # Hook script
│   ├── tdd-manager.js         # CLI tool
│   └── README.md              # Hook docs
│
├── skills/bmad/
│   ├── whats-next.md
│   ├── generate-epic-context.md
│   ├── create-story.md
│   ├── start-dev.md
│   ├── run-review.md
│   ├── mark-done.md
│   └── project-status.md
│
└── agents/bmad/
    ├── epic-context.md
    ├── story-context.md
    └── code-review.md
```

**In Your Project (After Installation):**
```
your-project/
├── CLAUDE.md                  # Project configuration
├── .claude/
│   ├── hooks/                 # TDD enforcement
│   ├── skills/bmad/           # 7 skills
│   └── agents/bmad/           # 3 agents
└── docs/
    ├── sprint-status.yaml     # Story queue
    ├── epics/                 # Epic breakdown
    └── stories/               # Context files
```

## Quick Reference

### Essential Commands

**Navigation:**
```
"what's next"        → Get guidance
"project status"     → See progress
```

**Story Lifecycle:**
```
"create next story"  → Extract from epic
"generate context"   → Scan codebase
"start development"  → Plan + implement (interactive!)
"run review"         → Validate
"mark done"          → Complete
```

**TDD Management:**
```bash
node .claude/hooks/tdd-manager.js status                  # Check phase
node .claude/hooks/tdd-manager.js switch-to-implementation # After tests fail
node .claude/hooks/tdd-manager.js reset                   # When story done
```

### Key Concepts

**Three Layers:**
1. Skills (main context) - User-facing, interactive
2. Agents (separate context) - Heavy processing
3. Hooks (global) - TDD enforcement

**Three Agents:**
1. epic-context - Tech spec generation (per epic)
2. story-context - Codebase scanning (per story)
3. code-review - Systematic validation

**Seven Skills:**
1. whats-next - Navigation (all phases)
2. generate-epic-context - Tech spec generation
3. create-story - Story creation
4. start-dev - **Interactive TDD development**
5. run-review - Code review validation
6. mark-done - Completion
7. project-status - Progress

**TDD Phases:**
1. Test Writing - Implementation blocked
2. Implementation - Tests locked
3. Review - Validation

## Getting Help

**First, check:**
1. This INDEX.md - Find right document
2. QUICKSTART.md - Common issues covered
3. README.md troubleshooting - More details

**Common Issues:**
- Hooks blocking? → Check TDD phase
- Skills not working? → Restart Claude Code
- Can't find epic? → Check epics/ directory

**Still stuck?**
- "what's next" - Always shows next step
- Review relevant documentation section
- Check IMPLEMENTATION_SUMMARY.md for technical details

## Version Information

- **Current Version:** 6.0 (Interactive TDD)
- **Previous Version:** 5.0 (Autonomous workflows)
- **Release Date:** January 2025
- **Status:** Production ready

## Contribution

To contribute or modify:
1. Read IMPLEMENTATION_SUMMARY.md
2. Understand architecture
3. Review existing code
4. Follow BMAD conventions
5. Test thoroughly

## License & Credits

Part of BMAD Method framework.
See main repository for license and credits.

---

**Happy developing with BMAD Phase 4 v6! 🚀**

**Where to start:** [QUICKSTART.md](QUICKSTART.md)

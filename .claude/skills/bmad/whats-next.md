---
name: What's Next
description: Navigation and suggestions for BMAD Method workflow (all phases)
trigger_phrases:
  - "what should I do"
  - "what's next"
  - "where are we"
  - "what now"
  - "next step"
---

# What's Next - BMAD Navigation

You are helping the user understand where they are in the BMAD Method workflow (ALL PHASES) and what to do next.

**IMPORTANT:** This skill checks the ENTIRE BMAD workflow from Phase 1 (PRD) through Phase 4 (Implementation), not just implementation phase.

## Step 1: Determine Current BMAD Phase

Check files in this order to determine where the user is:

### Check Phase 1: PRD (Product Requirements)
Look for PRD in common locations:
- `docs/prd.md`
- `docs/PRD.md`
- `docs/requirements/prd.md`

**If no PRD found:**
```
📋 BMAD Phase: Not Started

You need to create a Product Requirements Document (PRD) first.

The PRD defines what you're building and why.

Options:
a) Run PRD workflow: /bmad:bmm:workflows:prd
b) If you have a product brief, I can help convert it
c) If starting from scratch, we can brainstorm together

What would you like to do?
```
**STOP HERE** - Don't check further phases.

### Check Phase 2: Architecture
If PRD exists, look for architecture docs:
- `docs/architecture.md`
- `docs/technical-architecture.md`
- `docs/arch/`

**If PRD exists but no architecture:**
```
📋 BMAD Phase: 1 Complete (PRD exists)

Next: Create Architecture Document

The architecture defines how you'll build it.

Options:
a) Run architecture workflow: /bmad:bmm:workflows:architecture
b) If you have architecture decisions, I can help document them
c) We can design the architecture together

Would you like to start the architecture workflow?
```
**STOP HERE** - Don't check further phases.

### Check Phase 3: Epics
If architecture exists, look for epics:
- `docs/epics.md` (whole file)
- `docs/epics/` directory (sharded)
- `docs/epics/index.md` (sharded with index)

**If architecture exists but no epics:**
```
📋 BMAD Phase: 2 Complete (PRD + Architecture)

Next: Break down into Epics and Stories

Epics organize your work into manageable chunks.

Options:
a) Run epic creation: /bmad:bmm:workflows:create-epics-and-stories
b) I can help break down your PRD into epics

Would you like to create epics now?
```
**STOP HERE** - Don't check further phases.

### Check Phase 4: Sprint Planning
If epics exist, look for sprint-status.yaml:
- `docs/sprint-status.yaml`
- `{project-root}/sprint-status.yaml`
- `.bmad/sprint-status.yaml`

**If epics exist but no sprint-status.yaml:**
```
📋 BMAD Phase: 3 Complete (PRD + Architecture + Epics)

Next: Initialize Sprint Planning

Sprint planning sets up your story queue for implementation.

I can run sprint-planning for you now.

This will:
- Read your epics
- Create sprint-status.yaml
- Set up story tracking

Run sprint-planning now? (yes/no)
```

**If user says yes:**
- Invoke `/bmad:bmm:workflows:sprint-planning`
- Wait for completion
- Then re-check status and suggest next action

**STOP HERE if sprint-status doesn't exist yet.**

## Step 2: Read Sprint Status (Phase 4)

If sprint status exists, read the COMPLETE file and identify:
- Current story status (look for first non-backlog, non-done story)
- Epic progress (how many stories done vs total)
- Epic retrospective status
- What phase the current story is in

### Status Meanings

- **backlog** → Story or Epic exists but not yet processed
- **drafted** → Story file created, needs context generation
- **contexted** → Epic has tech spec, ready for story creation
- **ready-for-dev** → Story ready to start development
- **in-progress** → Currently being implemented
- **review** → Implementation complete, awaiting code review
- **done** → Reviewed and accepted

## Step 2.25: Check for Epic Context Needed

### Epics in Backlog Status?

If any epics have status `backlog`:
```
📋 Epic Needs Technical Specification

Epic [N]: [Epic Title] (backlog)

Before creating stories for this epic, you should generate
a technical specification.

Tech specs provide:
- Detailed technical design
- Component architecture
- Non-functional requirements
- Traceability mapping (ACs → Components → Tests)
- Test strategy
- Implementation guidance

This makes story creation more precise and ensures
nothing is missed.

Generate epic context now? (recommended)

Say "generate epic context" to create the tech spec.
OR
Say "skip" to create stories without tech spec (not recommended).
```

**If user says "generate epic context" or "yes":**
- Launch epic-context agent via generate-epic-context skill
- Wait for completion
- Then re-check status and suggest next action

**If user says "skip":**
- Warn that stories may lack detailed guidance
- Suggest proceeding to create-story
- Note that tech spec can be generated later if needed

**Important:** Epic context generation is optional but highly recommended.
Without it, story creation proceeds with less detailed technical guidance.

## Step 2.5: Check for Completion Scenarios

### All Stories in Current Epic Done?

If all stories for an epic are done but retrospective is not:
```
🎉 Epic [N]: [Epic Title] - COMPLETE!

All stories finished! (X/X done)

Next: Run Retrospective

Retrospectives capture lessons learned and improve future epics.

Options:
a) Run retrospective: /bmad:bmm:workflows:retrospective
b) Skip to next epic (not recommended)

Would you like to run the retrospective now?
```

**If user says yes:**
- Invoke `/bmad:bmm:workflows:retrospective`
- Wait for completion
- Then check for next epic

### All Epics Done?

If all epics are complete (all stories done, all retrospectives done):
```
🎉🎉 ALL EPICS COMPLETE! 🎉🎉

Project implementation finished!

What's next?
a) Create new epics for next phase/iteration
b) Review overall project deliverables
c) Conduct final project retrospective
d) Plan next version/release

Options:
1. "create new epic" - Add more epics to current project
2. Run /bmad:bmm:workflows:create-epics-and-stories - Create more epics
3. Review docs/ directory to see what was accomplished

Great work! What would you like to do next?
```

### No Active Stories?

If sprint-status.yaml exists but has NO stories at all (empty):
```
⚠️  Sprint status exists but contains no stories

This usually means:
- Epics were not broken down into stories yet
- sprint-status.yaml is corrupted or manually edited

To fix:
1. Check if epics exist (docs/epics/ or docs/epics.md)
2. If epics exist: Re-run /bmad:bmm:workflows:sprint-planning
3. If no epics: Run /bmad:bmm:workflows:create-epics-and-stories

Which option applies to you?
```

## Step 3: Suggest Next Action for Active Stories

Based on current story status:

### If status is `backlog`:
```
Next: Create the story

Say: "create next story" or use the create-story skill

This will extract story details from the epic and set up for development.
```

### If status is `drafted`:
```
Next: Generate story context

Say: "generate context" or "prepare story"

This will scan your codebase for relevant code and create a context file
that makes development much more efficient (90% token savings).
```

### If status is `ready-for-dev`:
```
Next: Start development

Say: "start development" or "implement story"

This will:
1. Enter Plan Mode for interactive planning
2. Help you build a TDD implementation plan
3. Begin test-first development in this conversation
```

### If status is `in-progress`:
```
Next: Continue development OR run review

Check TDD status:  node .claude/hooks/tdd-manager.js status

If implementation complete:
  Say: "run review" or "review story"

If still working:
  Say: "continue" or ask specific questions about the implementation
```

### If status is `review`:
```
Next: Mark story done (if review approved) OR address review feedback

If review approved:
  Say: "mark done" or "complete story"

If review requested changes:
  Say: "continue development" to address the feedback
```

### If status is `done`:
```
Story complete!

Next story status: [check next story in queue]

Options:
- "create next story" (if next is backlog)
- "generate context" (if next is drafted)
- "start development" (if next is ready-for-dev)
- "show sprint status" to see full progress
```

## Step 4: Provide Context

Always show:
- Current story title and key
- Epic progress (e.g., "Story 3 of 8 in Epic 2")
- What the suggested action will do

## Step 5: Be Helpful

If user seems stuck or uncertain:
- Explain what each phase means
- Remind them of TDD workflow if in development
- Suggest viewing project status for bigger picture

## Example Response

```
You're currently on:
Story 2-3: User Authentication (epic-2-story-3)
Status: ready-for-dev
Epic Progress: 2 of 5 stories complete in Epic 2

Next step: Start development

This will:
1. Load the story and context file
2. Enter Plan Mode so I can ask you clarifying questions
3. Build a TDD implementation plan together
4. Begin test-first development in this conversation

Say "start development" when ready, or ask me any questions!
```

## Important Notes

- Never make assumptions about what the user wants to do
- Always explain what the suggested command will do
- If multiple stories are in-progress (unusual), flag this as potentially problematic
- If sprint status seems corrupted or inconsistent, suggest checking the file manually

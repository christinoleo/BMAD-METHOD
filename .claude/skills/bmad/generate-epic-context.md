---
name: Generate Epic Context
description: Create technical specification for next epic
trigger_phrases:
  - "generate epic context"
  - "create tech spec"
  - "prepare epic"
  - "epic technical specification"
---

# Generate Epic Context - Technical Specification Creation

You are helping the user create a comprehensive technical specification for the next epic in their project.

## Step 1: Find Next Epic Needing Context

Read `sprint-status.yaml` to find the first epic with status `backlog`.

If no `backlog` epics found:
- Check if all epics are `contexted` or `done`
- Suggest creating new epics if project needs expansion
- Provide helpful guidance on next steps

## Step 2: Verify Prerequisites

Before generating epic context, ensure:

**Required documents exist:**
- PRD (`docs/prd.md` or `docs/prd/`)
- Architecture (`docs/architecture.md` or `docs/arch/`)
- Epics (`docs/epics.md` or `docs/epics/`)

**If any missing:**
```
❌ Cannot generate epic context

Missing required documents:
[List missing documents]

Epic technical specifications require:
- PRD (defines what to build)
- Architecture (defines how to build)
- Epics (defines work breakdown)

Complete earlier phases first:
1. PRD: /bmad:bmm:workflows:prd
2. Architecture: /bmad:bmm:workflows:architecture
3. Epics: /bmad:bmm:workflows:create-epics-and-stories

Which phase do you need help with?
```

## Step 3: Invoke Epic-Context Agent

If prerequisites met, launch the epic-context agent:

```
Generating technical specification for: Epic [N] - [Epic Title]

Launching epic-context agent...

[Agent runs in separate context - heavy document processing]
```

The agent will:
1. Load project documents (PRD, Architecture, GDD, UX)
2. Analyze prior tech-specs for consistency
3. Scan repository for dependencies
4. Synthesize technical design
5. Create traceability mapping
6. Generate comprehensive tech spec document

## Step 4: Handle Agent Completion

When agent completes and returns:

```
✓ Epic technical specification generated!

File: docs/tech-spec-epic-[N].md
Epic: [Epic Title]
Status: backlog → contexted

The tech spec includes:
- Technical design (services, data models, APIs)
- Non-functional requirements (performance, security)
- Detailed acceptance criteria
- Traceability matrix (ACs → Components → Tests)
- Test strategy
- Risks and assumptions

Next step: Create stories for this epic

Say "create next story" to begin story creation.
The tech spec will guide story breakdown and implementation.
```

## Step 5: Suggest Next Action

```
Options:
a) Review tech spec: Check docs/tech-spec-epic-[N].md
b) Create stories: "create next story"
c) Address open questions: Review section 9 of tech spec
d) See project status: "project status"

What would you like to do?
```

## Edge Cases

### Epic Already Has Tech Spec

If tech spec exists for the epic:
```
Epic [N] already has a technical specification.

File: docs/tech-spec-epic-[N].md
Created: [date]

Options:
a) Use existing spec (recommended)
b) Regenerate spec (if requirements changed)
c) Review existing spec

Regeneration is only needed if:
- Epic scope changed significantly
- Architecture evolved
- New requirements added

Use existing spec? (yes/no)
```

**If user says "regenerate":**
- Warn about overwriting
- Confirm intention
- Launch epic-context agent with regenerate flag

### Multiple Backlog Epics

If multiple epics are in backlog status:
```
Multiple epics need technical specifications:

- Epic 2: User Management (backlog)
- Epic 3: Payment Processing (backlog)
- Epic 4: Reporting Dashboard (backlog)

I'll generate the tech spec for Epic 2 (next in sequence).

To process epics in order is recommended for:
- Consistent technical decisions
- Dependency awareness
- Incremental architecture refinement

Proceed with Epic 2? (yes/no)
```

### Epic in Wrong Status

If requested epic is not in backlog:
```
Epic [N] status: [current_status]

Technical specifications are generated for epics in 'backlog' status.

Current status meanings:
- backlog: Ready for tech spec generation
- contexted: Tech spec already exists
- done: Epic completed

[If contexted:]
Epic already has tech spec: docs/tech-spec-epic-[N].md

[If done:]
Epic is complete. All stories implemented.

Need help with something else? Say "what's next"
```

## Important Notes

- **One epic at a time**: Tech specs are generated sequentially to maintain consistency
- **Heavy processing**: Agent runs in separate context (5-6+ document loads)
- **Prior spec consistency**: Analyzes previous epic tech-specs to maintain style
- **Repository-aware**: Scans dependencies to reflect actual tech stack
- **Comprehensive output**: 15-50 KB documents with 11 major sections

## Integration with Story Creation

Tech specs guide story creation:

```
Epic Context (tech spec) → Create Stories

Tech spec provides:
- Technical design → Story scope
- Acceptance criteria → Story ACs
- Components → Story tasks
- Test strategy → Story test requirements
- Traceability → Ensures no gaps
```

Without tech spec, story creation is possible but:
- Less detailed guidance
- Potential for missed requirements
- No systematic traceability
- Testing strategy unclear

## Example Interaction

```
User: "generate epic context"

Claude (this skill):
  Reading sprint-status.yaml...

  Next epic needing context:
  Epic 2: User Management (backlog)

  This will generate a comprehensive technical specification.

  Prerequisites:
  ✓ PRD exists
  ✓ Architecture exists
  ✓ Epic defined

  Launching epic-context agent...

[Epic-context agent runs in separate context]

Epic Context Generator Agent:
  [Heavy document processing]

  ✓ Tech spec generated: docs/tech-spec-epic-2.md (32.4 KB)

  Epic Status: backlog → contexted

[Agent completes, returns to main context]

Claude: ✓ Epic 2 technical specification ready!

  The tech spec provides complete implementation guidance:
  - 8 services and components defined
  - 12 detailed acceptance criteria
  - Traceability matrix created
  - Test strategy documented

  Next: Create stories for Epic 2

  Say "create next story" when ready.

User: "create next story"

[create-story skill takes over]
```

## Workflow Position

```
Phase 1-3: Planning
  ↓
sprint-planning (initialize Phase 4)
  ↓
generate-epic-context ← YOU ARE HERE (per epic)
  ↓
create-story (per story)
  ↓
generate-context (per story, optional)
  ↓
start-development (per story)
  ↓
code-review + mark-done (per story)
  ↓
retrospective (per epic)
  ↓
[Repeat for next epic]
```

## Tips

💡 **Always generate tech specs** - Provides crucial implementation guidance
💡 **Review open questions** - Address before story creation
💡 **Check traceability** - Ensures all requirements covered
💡 **Share with team** - Tech specs are valuable reference documents
💡 **Update if needed** - Architecture changes may require regeneration

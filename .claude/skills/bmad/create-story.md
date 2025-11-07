---
name: Create Next Story
description: Create the next story from epic breakdown
trigger_phrases:
  - "create story"
  - "create next story"
  - "new story"
  - "draft story"
---

# Create Next Story - BMAD Story Creation

You are helping the user create the next story from their epic breakdown.

## Step 1: Find Next Story to Create

Read `sprint-status.yaml` to find the first story with status `backlog`.

If no `backlog` stories found:
- Check if all stories are `done` (epic complete!)
- Suggest running retrospective if epic complete
- If all epics done, congratulate and suggest next epic planning

## Step 2: Invoke Create-Story Workflow

Execute the slash command:
```
/bmad:bmm:workflows:create-story
```

This workflow will:
1. Load the epic file containing this story
2. Extract story details (title, user story, ACs, technical notes)
3. Create story file OR update sprint-status with epic reference
4. Update status: `backlog` → `drafted`

## Step 3: Handle Workflow Output

The workflow may create:

**Option A: Minimal Story File** (if using epic references)
- Small file in `stories/` directory
- Contains only: epic reference, status, tracking info
- All details remain in epic (no duplication)

**Option B: Full Story File** (traditional approach)
- Complete story file with all details
- ACs, tasks, dev notes sections

## Step 4: Suggest Next Action

After story created successfully:

```
✓ Story created: [Story Title] ([story-key])
Status: backlog → drafted

Epic Reference: epics/epic-[num].md#story-[num]-[num]

Next step: Generate story context

Context generation will:
- Scan your codebase for relevant code
- Find existing interfaces and services
- Identify dependencies
- Create a focused context file (.context.xml)
- Save 90%+ tokens during development

This typically takes 1-2 minutes.

Say "generate context" when ready, or "skip context" to mark story ready directly
(not recommended - context generation makes dev much more efficient).
```

## Step 5: Handle Edge Cases

### If create-story workflow fails:
- Check if epic file exists
- Verify story is actually in epic breakdown
- Check file permissions
- Suggest manual story creation if needed

### If user wants to skip a story:
- Explain that stories should generally be done in order (prerequisites)
- If they insist, they can manually edit sprint-status.yaml
- Warn about potential dependency issues

### If user wants to create multiple stories:
- Explain BMAD does one story at a time
- Can batch-create by running multiple times
- Or suggest editing sprint-status.yaml directly for bulk updates

## Important Notes

- **Story order matters**: Stories have prerequisites, maintain sequence
- **Don't skip context**: Context generation is highly recommended (90% token savings)
- **Epic references**: Modern BMAD uses epic sections as source of truth (less duplication)
- **Status tracking**: sprint-status.yaml is the single source of truth for progress

## Example Interaction

```
User: "create next story"

Claude (this skill):
  Reading sprint-status.yaml...

  Next story to create:
  Epic 2, Story 2.3: User Authentication

  Invoking create-story workflow...

  [Workflow runs]

  ✓ Story created: User Authentication (2-3-user-auth)

  Epic Reference: epics/epic-2.md#story-2-3
  Status: backlog → drafted

  Next: Generate context to prepare for development

  Say "generate context" when ready!

User: "generate context"

Claude: Launching story-context agent...
  [Agent takes over]
```

---
name: Project Status
description: Display comprehensive sprint and epic progress
trigger_phrases:
  - "project status"
  - "sprint status"
  - "show progress"
  - "where are we"
  - "sprint progress"
---

# Project Status - Sprint Progress Overview

You are helping the user understand their overall project progress across epics and stories.

## Step 1: Read Sprint Status File

Read the COMPLETE `sprint-status.yaml` file from start to end.

Common locations:
- `docs/sprint-status.yaml`
- `{project-root}/sprint-status.yaml`
- `.bmad/sprint-status.yaml`

If file not found:
```
❌ Sprint status file not found

Sprint planning not initialized yet.

Next steps:
1. Ensure you're in Phase 4 (Implementation)
2. Run: /bmad:bmm:workflows:sprint-planning
3. This will generate sprint-status.yaml from your epics
```

## Step 2: Parse and Analyze

Extract:
- Project metadata (name, key, tracking system)
- All story keys and their statuses
- Epic groupings
- Retrospective statuses

Count stories by status:
- Total stories
- Done stories
- In-progress stories
- Ready-for-dev stories
- Drafted stories
- Backlog stories

Group by epic:
- Stories per epic
- Progress per epic
- Current epic focus

## Step 3: Display Comprehensive Overview

```
📊 Project Status: [Project Name]

Overall Progress: [X]/[Y] stories complete ([Z]%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Epic Progress:

Epic 1: [Epic Title]
  ✓ Done: [count] stories
  ⧗ In Progress: [count] stories
  ⬜ Remaining: [count] stories
  Progress: [X]/[Y] ([Z]%)
  Status: [complete | in-progress | not-started]

Epic 2: [Epic Title]
  ✓ Done: [count] stories
  ⧗ In Progress: [count] stories
  ⬜ Remaining: [count] stories
  Progress: [X]/[Y] ([Z]%)
  Status: [complete | in-progress | not-started]

[More epics...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Focus:

[If story in-progress:]
⧗ Active Story: [Story Title] ([story-key])
  Epic: [Epic N]
  Status: in-progress
  Next Action: Continue development or run review

[If story in review:]
🔍 In Review: [Story Title] ([story-key])
  Epic: [Epic N]
  Status: review
  Next Action: Mark done if approved, or continue dev if changes needed

[If no active story:]
No story currently active

Next Story: [Next Story Title] ([story-key])
Status: [ready-for-dev | drafted | backlog]
Next Action: [start development | generate context | create story]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story Status Summary:

✓ Done:          [count]
🔍 In Review:     [count]
⧗ In Progress:   [count]
📝 Ready for Dev: [count]
📄 Drafted:       [count]
⬜ Backlog:       [count]
─────────────────────
Total:           [count]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[If epic complete:]
🎉 Epic [N] Complete!
Retrospective: [optional | completed | not-started]
  [If optional or not-started:]
  Suggested: Run retrospective to capture learnings
  Command: /bmad:bmm:workflows:retrospective

[If all complete:]
🎉🎉 All Epics Complete! 🎉🎉
Project implementation finished!

Next steps:
- Review overall deliverables
- Conduct final retrospective
- Plan next phase/iteration
```

## Step 4: Provide Actionable Suggestions

Based on current state:

### If stories backlogged:
```
You have [count] stories waiting to be created.

Next: "create next story"
```

### If stories drafted (need context):
```
You have [count] stories that need context generation.

Context generation scans your codebase and creates efficient
development contexts (90% token savings).

Next: "generate context"
```

### If stories ready-for-dev:
```
You have [count] stories ready for implementation.

Next: "start development"
```

### If story in-progress:
```
Active development session ongoing.

Options:
- "continue" to keep working
- "run review" if implementation complete
- "project status" to see this overview again
```

### If story in review:
```
Story waiting for review outcome.

If review approved: "mark done"
If review pending: "run review"
If changes needed: "continue development"
```

## Step 5: Show Timeline (Optional)

If sprint-status.yaml has timestamps:
```
Timeline:

Sprint Started: [date]
Days Elapsed: [count]
Stories Completed: [count]
Average Velocity: [count] stories per day
Estimated Completion: [date] ([count] days remaining)
```

## Step 6: Highlight Blockers or Issues

Check for:
- Multiple stories in-progress (unusual)
- Stories stuck in review
- Long time since last activity

```
⚠️ Potential Issues:

Multiple stories in-progress:
- [story-key-1]
- [story-key-2]

Suggestion: Focus on completing one story at a time.
BMAD works best with sequential story completion.

OR

Story in review for [X] days:
- [story-key]

Suggestion: Run code review or address pending feedback.
```

## Important Notes

- **Read complete file**: Always read sprint-status.yaml from start to end
- **Preserve structure**: Don't modify the file, only read
- **Epic grouping**: Group stories by epic for clarity
- **Visual progress**: Use emojis/symbols for quick scanning
- **Actionable**: Always suggest concrete next steps
- **Celebrate wins**: Acknowledge completed epics and stories

## Example Interaction

```
User: "project status"

Claude (this skill):
  Reading sprint-status.yaml...

  📊 Project Status: E-Commerce Platform

  Overall Progress: 12/20 stories complete (60%)

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Epic Progress:

  Epic 1: Foundation
    ✓ Done: 5 stories
    ⧗ In Progress: 0 stories
    ⬜ Remaining: 0 stories
    Progress: 5/5 (100%)
    Status: complete ✓

  Epic 2: User Management
    ✓ Done: 7 stories
    ⧗ In Progress: 1 story
    ⬜ Remaining: 2 stories
    Progress: 7/10 (70%)
    Status: in-progress

  Epic 3: Payment Processing
    ✓ Done: 0 stories
    ⧗ In Progress: 0 stories
    ⬜ Remaining: 5 stories
    Progress: 0/5 (0%)
    Status: not-started

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Current Focus:

  ⧗ Active Story: Password Reset (2-8-password-reset)
    Epic: Epic 2 (User Management)
    Status: in-progress
    Next Action: Continue development or run review

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Story Status Summary:

  ✓ Done:          12
  🔍 In Review:     0
  ⧗ In Progress:   1
  📝 Ready for Dev: 2
  📄 Drafted:       0
  ⬜ Backlog:       5
  ─────────────────────
  Total:           20

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🎉 Epic 1 Complete!
  Retrospective: completed

  Great progress! You're 60% through the project.

  Current story in development. When ready:
  - "run review" to validate implementation
  - "continue" to keep working

User: "thanks! let's continue"

Claude: [Continues current implementation session]
```

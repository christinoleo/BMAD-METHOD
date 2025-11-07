---
name: Mark Story Done
description: Mark current story as complete after review approval
trigger_phrases:
  - "mark done"
  - "mark story done"
  - "complete story"
  - "story finished"
  - "finish story"
---

# Mark Story Done - Story Completion

You are helping the user mark their current story as complete after code review has approved it.

## Step 1: Verify Review Status

Read `sprint-status.yaml` to find the first story with status `review`.

### If no story in `review` status:
- Check for `in-progress` stories → "Story still being implemented. Run code review first."
- Check for `ready-for-dev` stories → "Story not started yet."
- Check for `done` stories → "Current story already complete!"

### If story is in `review`:
- Verify it's actually ready to mark done
- Ask if code review was completed and approved

## Step 2: Confirm with User

```
Story: [Story Title] ([story-key])
Current Status: review

This will mark the story as DONE and move to the next story.

Has the code review been completed and approved?

If yes, say "yes" or "confirm"
If no, say "run review" to trigger code review first
```

**Wait for confirmation.**

## Step 3: Invoke Story-Done Workflow

Execute the slash command:
```
/bmad:bmm:workflows:story-done
```

This workflow will:
1. Update story file status field
2. Update sprint-status.yaml: `review` → `done`
3. Add completion notes

## Step 4: Reset TDD State

After workflow completes:
```bash
node .claude/hooks/tdd-manager.js reset
```

This clears the TDD state for the next story.

## Step 5: Report Completion and Suggest Next Steps

```
✓ Story marked DONE: [Story Title]

Epic Progress: [X] of [Y] stories complete in Epic [N]

[If more stories in epic:]
Next story: [Next Story Title] ([next-story-key])
Status: [status]

Suggested next action:
- If backlog: "create next story"
- If drafted: "generate context"
- If ready-for-dev: "start development"

[If epic complete:]
Epic [N] complete! All [Y] stories done.

Next: Run retrospective to capture learnings

Say "run retrospective" or "/bmad:bmm:workflows:retrospective"

[If all epics complete:]
🎉 All epics complete! Project implementation done!

Options:
- Review overall project
- Plan next phase/epic
- Run final retrospective
```

## Step 6: Handle Edge Cases

### If user wants to mark done but review not approved:
```
⚠️  Code review has not approved this story yet.

Current review status: [CHANGES REQUESTED | BLOCKED | NOT REVIEWED]

You should:
1. Address code review feedback: "continue development"
2. Re-run review: "run review"
3. Only mark done after review approves

Proceed anyway? (Not recommended)
```

### If user marks done prematurely:
Warn but allow (they might have good reason):
```
⚠️  Warning: Marking done without proper review
This may cause tracking inconsistencies.

Proceeding...
```

### If sprint-status.yaml has issues:
```
❌ Error: Cannot update sprint-status.yaml

[Error details]

Manual intervention needed:
1. Check file permissions
2. Verify file format
3. Edit manually if needed
```

## Important Notes

- **Review required**: Stories should be code-reviewed before marking done
- **TDD reset**: Always reset TDD state after completion
- **Sequential flow**: Maintain story order for dependencies
- **Epic completion**: Retrospectives are valuable - encourage them
- **Celebration**: Acknowledge completion! It's motivating

## Example Interaction

```
User: "mark done"

Claude (this skill):
  Story: User Authentication (2-3-user-auth)
  Current Status: review

  This will mark the story as DONE.

  Has code review been completed and approved?

User: "yes, review approved"

Claude:
  Invoking story-done workflow...

  [Workflow runs]

  ✓ Story marked DONE: User Authentication

  Epic 2 Progress: 3 of 5 stories complete

  Next story: Password Reset (2-4-password-reset)
  Status: ready-for-dev

  Suggested next action: "start development"

  Great work! Ready to start the next story?

User: "yes, start development"

Claude: [Launches start-dev skill]
```

## Alternative Flows

### Automatic After High-Confidence Review
If code review agent returned:
```
Outcome: APPROVED
Confidence: HIGH
Recommendation: AUTO-APPROVE
```

Then you might auto-trigger this skill:
```
Code review approved with high confidence!

Auto-marking story as done...

[Proceeds with mark-done flow]
```

### Manual Review Confirmation
If confidence was MEDIUM/LOW:
```
Code review outcome: APPROVED
Confidence: MEDIUM
Recommendation: MANUAL CONFIRMATION

Review looked good, but please manually verify:
- [Review finding 1]
- [Review finding 2]

Ready to mark done? Say "yes" to confirm.
```

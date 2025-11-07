---
name: Run Code Review
description: Launch code review agent to validate completed story
trigger_phrases:
  - "run review"
  - "review story"
  - "code review"
  - "validate story"
  - "review code"
---

# Run Code Review - Validation Wrapper

You are helping the user run systematic code review on their implemented story.

## Step 1: Find Story to Review

Read `sprint-status.yaml` to find a story eligible for review.

**Eligible statuses:**
- `review` - Explicitly marked ready for review (preferred)
- `in-progress` - Implementation may be complete, user requesting validation

If no eligible story found:
```
❌ No story ready for review

Current story statuses:
[List current stories and their statuses]

Stories must be in 'in-progress' or 'review' status to run code review.

Next steps:
- If implementing a story: Complete implementation first
- If story is done: Use "mark done" instead
- Check status: "project status" or "what's next"
```

**STOP HERE** if no eligible story.

## Step 2: Confirm Story Status

If story is `in-progress`:
```
Story [story-key]: [Story Title] (in-progress)

You're requesting code review for a story that's still in-progress.

Before reviewing, ensure:
✓ All acceptance criteria implemented
✓ All tests written and passing
✓ TDD phase complete (check: node .claude/hooks/tdd-manager.js status)

Ready to proceed with code review? (yes/no)
```

**If user says no:**
- Suggest completing implementation first
- Offer guidance on what might be missing

**If user says yes or story is already in `review` status:**
- Proceed to Step 3

## Step 3: Invoke Code-Review Agent

If prerequisites met, launch the code-review agent:

```
Launching code review for: [Story Key] - [Story Title]

Running code-review agent...

[Agent runs in separate context - heavy validation]
```

The agent will:
1. Load story acceptance criteria
2. Scan implemented files
3. Validate each AC with evidence
4. Perform security scanning
5. Check test coverage
6. Verify architecture alignment
7. Calculate confidence score
8. Provide approval recommendation

## Step 4: Handle Agent Completion

When agent completes and returns:

### If APPROVE + HIGH Confidence (85-100%)
```
✓ Code Review: APPROVED (HIGH confidence)

Story: [Story Key] - [Story Title]

All acceptance criteria validated:
✓ AC-1: [AC text] (validated at file:line)
✓ AC-2: [AC text] (validated at file:line)
...

Test Coverage: [X]%
Security Scan: No issues
Architecture: Aligned

Confidence Score: [X]% (HIGH)

Next step: Mark story done

Say "mark done" to complete this story and move to next.
```

### If APPROVE + MEDIUM Confidence (60-84%)
```
✓ Code Review: APPROVED (MEDIUM confidence)

Story: [Story Key] - [Story Title]

Acceptance criteria validated with minor notes:
✓ AC-1: [AC text] (validated)
⚠ AC-2: [AC text] (validated, but see notes below)
...

Notes:
- [Any observations or suggestions]

Confidence Score: [X]% (MEDIUM)

Recommendation: Manual review suggested, but implementation is sound.

Options:
a) Accept and mark done: "mark done"
b) Address notes first: "continue development"
c) Review findings in detail

What would you like to do?
```

### If APPROVE + LOW Confidence (<60%)
```
⚠ Code Review: APPROVED (LOW confidence)

Story: [Story Key] - [Story Title]

Some concerns found:
✓ AC-1: [AC text] (validated)
⚠ AC-2: [AC text] (partially validated)
...

Findings:
- [Specific concerns with file:line references]

Confidence Score: [X]% (LOW)

Recommendation: Manual review required before marking done.

Options:
a) Review findings and accept: "mark done"
b) Address concerns: "continue development"
c) See detailed findings

Proceed with caution. What would you like to do?
```

### If CHANGES REQUESTED
```
❌ Code Review: Changes Requested

Story: [Story Key] - [Story Title]

Issues found that need addressing:

Missing/Incomplete:
- AC-X: [What's missing]

Issues:
- [Issue description] (file:line)

Security Concerns:
- [Security issue] (file:line)

Test Coverage: [X]% (target: [Y]%)

Next steps:
1. Address the issues above
2. Update implementation
3. Re-run code review: "run review"

Say "continue development" to address these issues.
```

### If BLOCKED
```
🛑 Code Review: BLOCKED

Story: [Story Key] - [Story Title]

Critical issues prevent approval:
- [Critical issue 1]
- [Critical issue 2]

These issues must be resolved before proceeding.

Next steps:
1. Resolve critical blockers
2. Re-run code review: "run review"

Need help resolving these issues?
```

## Step 5: Update Status (If Approved)

If review approved (any confidence level) AND user accepts:

**Do NOT update sprint-status.yaml yourself** - that's handled by mark-done skill

Instead, suggest next action:
```
Code review complete and approved.

To complete this story:
Say "mark done" when ready.

This will:
- Update status: review → done
- Reset TDD state
- Suggest next story
```

## Edge Cases

### Multiple Stories In-Progress

If multiple stories have `in-progress` status:
```
Multiple stories in progress:
- [story-1-key]: [Title] (in-progress)
- [story-2-key]: [Title] (in-progress)

Which story would you like to review?

Recommendation: Review the story you just finished implementing.
```

**Ask user to specify** which story to review.

### Story Already Reviewed

If story status is already `done`:
```
Story [story-key] already marked as done.

Code review was completed and story is finished.

Options:
- Check next story: "what's next"
- See project progress: "project status"
- Start new story workflow
```

### No Sprint Status File

If `sprint-status.yaml` doesn't exist:
```
❌ sprint-status.yaml not found

Code review requires sprint tracking to be initialized.

To fix:
1. Run sprint-planning: /bmad:bmm:workflows:sprint-planning
2. Or check if you're in the right project directory

Need help getting started? Say "what's next"
```

## Important Notes

- **Agent runs in separate context** - Heavy validation without bloating main context
- **Evidence-based** - All findings include file:line references
- **Confidence scoring** - Automated recommendations for simple cases
- **Manual override** - User always has final say
- **Rerunnable** - Can run review multiple times during development

## Integration with TDD

Code review should be run after:
1. ✅ All tests written and passing
2. ✅ Implementation complete
3. ✅ TDD manager in "implementation" or "review" phase

If TDD state is still in "test_writing" phase:
```
⚠️ TDD Warning

Current phase: TEST_WRITING

Code review should be run after:
- Tests are written
- Tests initially fail
- Implementation makes tests pass

Complete TDD workflow first, then run review.

Check TDD status: node .claude/hooks/tdd-manager.js status
```

## Workflow Position

```
Phase 1-3: Planning
  ↓
sprint-planning
  ↓
generate-epic-context (per epic)
  ↓
create-story (per story)
  ↓
generate-context (per story, optional)
  ↓
start-development (per story)
  ↓
run-review ← YOU ARE HERE (per story)
  ↓
mark-done (per story)
  ↓
retrospective (per epic)
```

## Tips

💡 **Run review early and often** - Don't wait until "everything is perfect"
💡 **Use findings as learning** - Evidence-based feedback helps improve
💡 **HIGH confidence = trust it** - Agent is thorough for simple cases
💡 **MEDIUM/LOW = take a look** - Manual review suggested but not required
💡 **Rerun after fixes** - Verify that changes addressed the issues

## Example Interaction

```
User: "run review"

Claude (this skill):
  Reading sprint-status.yaml...

  Story ready for review:
  Story 2-3: User Authentication (in-progress)

  Launching code-review agent...

[Code-review agent runs in separate context]

Code Review Agent:
  Loading story acceptance criteria...
  ✓ Found 3 acceptance criteria

  Scanning implemented files...
  ✓ src/services/AuthService.ts
  ✓ src/controllers/AuthController.ts
  ✓ test/services/AuthService.test.ts

  Validating acceptance criteria...
  ✓ AC-1: User registration (validated at AuthService.ts:45)
  ✓ AC-2: Password hashing (validated at AuthService.ts:67)
  ✓ AC-3: JWT generation (validated at AuthService.ts:89)

  Security scan...
  ✓ No SQL injection vulnerabilities
  ✓ Password hashing uses bcrypt
  ✓ JWT secret not hardcoded

  Test coverage...
  ✓ 95% coverage (target: 80%)

  Architecture alignment...
  ✓ Follows service layer pattern
  ✓ Proper dependency injection

  Confidence Score: 95% (HIGH)

[Agent completes, returns to main context]

Claude: ✓ Code Review: APPROVED (HIGH confidence)

  Story 2-3: User Authentication

  All acceptance criteria validated with evidence.
  Test coverage: 95%
  Security: No issues

  Confidence Score: 95% (HIGH)

  Recommendation: Auto-approve

  Next step: Mark story done

  Say "mark done" when ready.

User: "mark done"

[mark-done skill takes over]
```

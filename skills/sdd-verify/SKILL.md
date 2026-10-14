---
name: sdd-verify
description: Use when sdd-implement closes a task or finishes its last one, or sdd-end-feature reaches its review step — before claiming work complete, fixed or passing, and to run the final whole-branch review. Invoked from there; not the entry of a change (that is sdd-propose).
---

# sdd-verify

## Overview

Claiming work is complete without verification is dishonesty, not efficiency. Write everything the user reads in the language of their message. Forked from `verification-before-completion` and `requesting-code-review` of superpowers 7.0.0 (MIT, see `NOTICE`); the text is the source's, changed only where the kit works differently.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |

## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!", etc.)
- About to commit/push/PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting work over
- **ANY wording implying success without having run verification**

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Verify independently |
| "I'm tired" | Exhaustion ≠ excuse |
| "Partial check is enough" | Partial proves nothing |
| "Different words so rule doesn't apply" | Spirit over letter |

## Key Patterns

**Tests:**
```
✅ [Run test command] [See: 34/34 pass] "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression tests (TDD Red-Green):**
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
❌ "I've written a regression test" (without red-green verification)
```

**Build:**
```
✅ [Run build] [See: exit 0] "Build passes"
❌ "Linter passed" (linter doesn't check compilation)
```

**Requirements:**
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion
❌ "Tests pass, phase complete"
```

**Agent delegation:**
```
✅ Agent reports success → Check VCS diff → Verify changes → Report actual state
❌ Trust agent report
```

## When To Apply

**ALWAYS before:**
- ANY variation of success/completion claims
- ANY expression of satisfaction
- ANY positive statement about work state
- Committing, PR creation, task completion
- Moving to next task
- Delegating to agents

**In the kit, that means:**
- A task's `complete` line: `sdd task done` runs the task's «Verificación» and writes its result; you read that output before the line counts (`sdd-implement`, completion contract).
- The `Revisión final:` line of `tasks.md`, the validation's smoke and the walkthrough: each says only what a command or a reviewer's report you read in this session shows.

**Rule applies to:**
- Exact phrases
- Paraphrases and synonyms
- Implications of success
- ANY communication suggesting completion/correctness

## Requesting review

Dispatch a code reviewer subagent to catch issues before they cascade. The reviewer gets precisely crafted context for evaluation — never your session's history.

**Core principle:** Review early, review often.

### When to Request Review

**Mandatory:**
- After each task in subagent-driven development: the task review of `sdd-implement`, with its own prompt.
- After completing major feature: the final whole-branch review, in axes ([Final review](#final-review)).
- Before the closing merge to the integration branch: the review's single closing. The merge to `main` is always a person's call.

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

### How to Request

The kit doesn't take `HEAD~1` nor one `general-purpose` reviewer: the package comes from the recipe of [encargo-revision.md](../sdd-start-feature/references/encargo-revision.md), and each axis gets its own brief, model and effort ([Final review](#final-review)).

### Act on feedback

- Re-grade each finding by its effect before acting on it: the reviewer's label is advice.
- Critical and Important go to ONE fix pass; Minor goes to the ledger as deferred.
- Push back if the reviewer is wrong (with reasoning): a finding you don't fix is a `Final: Ruling:` with why the code stands.
- What the single re-review leaves open follows [Closing the review](#closing-the-review).

### Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll just review the diff myself instead of dispatching a reviewer" | You're the coordinator — reviewing the diff inline burns the context window you need to keep driving the work. Dispatch a reviewer subagent: the diff and the evaluation live in its context, and only the findings come back to you. |
| "The reviewer needs my whole session history to understand the change" | Hand it precisely crafted context, never your session's history. That keeps the reviewer on the work product, not your thought process. |

### Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues beyond the one fix pass and the re-review of [Closing the review](#closing-the-review)
- Argue with valid technical feedback

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification

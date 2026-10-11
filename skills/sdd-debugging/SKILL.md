---
name: sdd-debugging
description: Use when an sdd-kit skill meets a failure to explain — a bug in a patch, a step whose Expected doesn't match because the code fails — before proposing a fix. Invoked from there; not the entry of a change (that is sdd-propose).
---

# sdd-debugging

## Overview

Find the root cause before you touch the code: a fix of the symptom is a failure. Write everything the user reads in the language of their message. Forked from `systematic-debugging` of superpowers 7.0.0 (MIT, see `NOTICE`).

It applies to any technical failure: a bug in a patch, a test that fails, a step of the plan whose `Expected:` doesn't match because the code fails, a build or an integration that breaks. Above all when it looks simple, when there's a hurry or when a fix already failed. **Violating the letter of this process is violating the spirit of debugging.**

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

Until Phase 1 is done, you don't propose a fix. Finish each phase before the next.

## Phase 1: Root cause

1. **Read the error completely**: the message, the whole stack trace, line numbers, paths, codes. Warnings too.
2. **Reproduce it**: the exact steps, every time. If it doesn't reproduce, gather more data; don't guess.
3. **Check what changed**: `git diff`, recent commits, dependencies, configuration, environment.
4. **Several components** (CI → build → signing, API → service → database): before proposing anything, instrument each boundary —what enters, what leaves, which configuration arrives— and run once to see **where** it breaks. Then investigate that component.
5. **Trace the bad value back** to where it's born, and fix it there, not where it shows: [root-cause-tracing.md](references/root-cause-tracing.md).

In a patch, write the result of this phase in §2 of `patch.md` —the why, with its evidence in the code— before Phase 4: a cause written after the fix describes the fix, not what you found.

## Phase 2: Pattern

1. Find similar code in the same codebase that works.
2. If you're applying a pattern, read its reference implementation completely, every line.
3. List every difference between what works and what breaks, however small; don't decide in advance that one can't matter.
4. Name what it depends on: other components, settings, environment, assumptions.

## Phase 3: Hypothesis

1. One hypothesis, written down: «I think X is the root cause because Y».
2. Test it with the smallest change, one variable at a time.
3. It holds → Phase 4. It doesn't → a new hypothesis, without stacking more fixes on top.
4. If you don't understand something, say «I don't understand X» and look for it, or ask; don't pretend.

## Phase 4: Fix

In a patch, Phase 4 starts with §2 of `patch.md` already written. If it isn't, stop and write it first.

1. **A failing test that reproduces it**, before the fix: the simplest reproduction, automated if the project has tests, a one-off script if not. Write it under `sdd-tdd`.
2. **One fix**, at the root cause. No «while I'm here» changes or bundled refactors.
3. **Verify**: the test passes, the others still pass, the failure is gone. Run the verification and read its output before saying it's fixed.
4. **The fix didn't work**: stop and count the fixes you've tried. Fewer than three → back to Phase 1 with what you learned. Three or more → don't try a fourth: each fix showing a new problem somewhere else is a wrong architecture, not a wrong hypothesis. The thread stops as at a deviation from the approved approach ([control-profiles.md](../sdd-start-feature/references/control-profiles.md)); an implementer returns `BLOCKED` with the three attempts and what each one showed.

Once the cause is fixed, [defense-in-depth.md](references/defense-in-depth.md) adds validation at each layer the bad value crossed, and [condition-based-waiting.md](references/condition-based-waiting.md) replaces fixed waits with a wait on the condition when the failure was timing.

## No root cause

If the investigation shows the failure is really environmental, timing-dependent or external: you finished the process. Write down what you investigated, add the handling it needs (retry, timeout, error message) and the logging that would let the next person see it. Most «no root cause» cases are an incomplete investigation: say what you didn't look at.

## Red flags — STOP and go back to Phase 1

- «Quick fix for now, investigate later».
- «Let me just try changing X and see».
- Several changes at once, then running the tests.
- «Skip the test, I'll check it by hand».
- «It's probably X, let me fix that».
- «I don't fully understand it, but this might work».
- «The pattern says X, but I'll adapt it differently».
- A list of fixes without an investigation behind it.
- A solution before tracing the data flow.
- «One more fix» after two that failed.
- Each fix shows a new problem in a different place.

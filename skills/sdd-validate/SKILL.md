---
name: sdd-validate
description: Use when sdd-implement has finished its last task, or a patch its fix — «las tasks están acabadas», «valídala» — to run the closing gate, walk the dev's script, run the final review and take the dev's validation before sdd-archive. Not the entry of a change (that is sdd-propose), and not the review's briefs and evidence rules (that is sdd-verify).
---

# sdd-validate

## Overview

The phase between the last task and the close: what it finds is fixed through `sdd-implement`, never in `sdd-archive`.
<!-- kit: incluye user-language -->
<!-- kit: incluye phase-notice -->

## Order

`sdd-archive` is invoked only with the validation recorded. In this order:

1. **The closing gate**, once («Running a gate» of `sdd-verify`): filtered by what the branch affects, whole only with a file of «Sin filtro».
2. **The script, walked by you**: every step of the dev's script, as the person will walk it, with the project's own means (this skill names no tool). A failing step goes to the turn below.
3. **The final review** of the axes, on what is already validated: invoke `sdd-verify` with `Skill` and follow its «Closing the review», before any stop.
4. **The dev's validation**, per its mode: first thing, read [validation-modes.md](references/validation-modes.md); with `manual`, the script you present is one you have walked ([dev-validation.md](references/dev-validation.md)).
5. **The record** in the draft walkthrough (in a patch, `patch.md` §4), then invoke `sdd-archive` with `Skill`.

A patch has no final review: 1, 2, 4, 5.

## A failure goes back to `sdd-implement`

A failure of the script, of the final review or of the dev goes back to `sdd-implement` as a new task at the end of the plan, with its test (RED, then GREEN); you return here when it commits. Each turn runs only what the fix touches: the tests that failed or are born; the gate with `--base <sha of the last green>` («Running a gate», point 3, of `sdd-verify`), whole if the fix touches a file of «Sin filtro»; the script steps it touches; and, if the turn comes after the final review, one review of its diff by `sdd-kit:effort-high` + `sonnet` (in a patch, the reviewer of `patch.md` §4), whose open findings go to ✋ as `sin revisar: <sha>`. A turn before the final review has no review of its own: that review covers it.

## Closing drafts

While the axes review, write in their place, uncommitted, `walkthrough.md` without the verification or the time, and the delta merged into `capabilities/` with the `sdd capability merge` of step 3 of `sdd-archive`; the roadmap isn't touched. The record goes into that draft.

**Every dispatch** and every slow verification in the background gets its silence watch: `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" watch subagent --description "<the dispatch's description>"` in the background, or, for a slow verification, through `watch command -- <the command…>`; its warning, in [Silence watch](../sdd-propose/references/control-profiles.md#silence-watch).

## Red flags — STOP

- You're about to invoke `sdd-archive` without a line of validation in the draft walkthrough (in a patch, `patch.md` §4).
- You're about to present a script with a step you haven't walked, to fix a failure here instead of in `sdd-implement`, or to dispatch the final review before the gate and the script are green.

| Excuse | Reality |
| --- | --- |
| "The user is away: I close and they validate later" | A validation not recorded stays here; a deferred one is recorded as `Validación diferida:` with its trigger. |

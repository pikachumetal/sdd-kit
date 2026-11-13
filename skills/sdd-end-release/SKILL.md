---
name: sdd-end-release
description: Use when a release or delivery must be closed in a project with .docs/sdd/ — «cierra la release», «prepara la entrega», «el cliente espera las novedades», or finished work in Now waiting for a version. Not for closing one feature or patch (that is sdd-archive).
---

# sdd-end-release

## Overview

Closing a release is the **publication cut** of what's done, like git-flow's release branch. It runs over changes already closed by `sdd-archive`, whose rows wait in Now, and turns them into a sealed changelog, a Now without the finished rows, trimmed debt, release notes if someone receives them, and a tag.
<!-- kit: incluye user-language -->
<!-- kit: incluye document-literals -->

**Feedback from a demo or a meeting isn't processed here**: it goes to `sdd-roadmap`, and the cut goes on without waiting for it.

**Breaking the letter of the checklist is breaking its spirit**: the hurry of «the client expects it today» is exactly when you skip what costs weeks to recover.

## ⛔ Entry gate

- **Form**: without `ROADMAP.md` at the root and with `.docs/sdd/roadmap.md`, the project is in the 2.x form. Stop before sealing or touching anything, say the cut needs the 3.0.0 form and offer `sdd-upgrade`. Never rewrite a `ROADMAP.md` into another form so that a step fits.
- **Closed work**: every ✅ or 🧪 row of Now has its `walkthrough.md` or `patch.md` in `changes/` or `specs/`, and the project builds. Work half done, or a closed row without that artifact, is missing evidence: the user decides whether it goes in or moves, never you in silence.
- **Green suite** on the sha you cut, the local `HEAD` of `merge.into` at the start, after `git fetch`: every suite of «Suites» of §Testing (`operations.md`), without `--affected`, before sealing. With «CI de la base» and its command, run it as declared, in a call with nothing after it, and read its `headSha` before launching any suite: `success` on that sha is enough and nothing runs, not even «just in case»; `failure` on that sha, or a red suite, stops the cut: a patch fixes it and the cut starts over; any other result, or no answer, runs the suite.

With the user away, prepare steps 1-6 and leave step 7 **pending**; never resolve the gate alone. Without an answer, deferred items count as not mentioned and the line is `smoke: pendiente`.

## Cut checklist (a todo per step)

1. **Scope and version** — what goes in: the ✅ and 🧪 rows of Now, plus any entries `[Unreleased]` already has. Nothing to publish (no ✅ row, no 🧪 row without a changelog line, no `[Unreleased]` entry): say so and stop. ⏳ and 🔄 rows stay where they are. Propose the version with its reason ([versionado.md](references/versionado.md)); **the user confirms it** on the final proposal. If `.docs/sdd/sdd-kit.json` lacks `release.hasRecipient`, ask once whether the release goes to someone other than who makes it and merge the answer into that field; with the field present, apply its current value without asking. Never write or change it without an explicit answer or request from the user. With `ids.mode: tracker`, the closing summary lists the ticket ids of the rows that go in.
2. **Smoke and deferred validations** — ask the dev-lead what they tried on the integrated branch, naming every deferred item this release triggers. First run `git log -1 --diff-filter=D --format="%h %as" -- .docs/sdd/roadmap.md`: with a date not earlier than the last sealed version's or `v*` tag's, or with neither, this is the **first cut after migrating**, and each id in the `validaciones pendientes:` lines of `git show <hash>^:.docs/sdd/roadmap.md` is deferred too. Add the 🧪 rows whose trigger is this release. With no output or an earlier date, there is nothing to rescue. A 🧪 row whose trigger is another one isn't asked about. Of those named, what the dev-lead mentions gains a dated addendum with what they tried in its `walkthrough.md` (in a patch, `patch.md` §4). What they don't mention gains a dated addendum with the new trigger: the next release, unless they name another.
3. **Changelog** *(if `CHANGELOG.md` exists)* — one line per row that goes in, through `add-to-changelog`, category read from the row's artifact. A 🧪 row gets its line even if unvalidated: the code ships, only the validation is deferred. An id already named in `[Unreleased]` or in a sealed version gains no second line. Then `[Unreleased]` becomes `## [X.Y.Z] - YYYY-MM-DD` with a new empty `## [Unreleased]` above, and under the version heading goes `smoke: <date> · <N> hallazgos (<what ran>; <M> corregidos en la release)`, or `smoke: pendiente` if none ran, per [release-notes.md](references/release-notes.md). Sealed content isn't touched. Without `CHANGELOG.md`, none is created: the tag message names the rows that go in, and any «Tras» naming them becomes `—`.
4. **Now** — ✅ rows and validated 🧪 rows leave; the 🧪 rows named in step 2 and left unvalidated **stay**, with `🧪 validación diferida a <new trigger>`; other 🧪 rows stay untouched. A rescued id left unvalidated gains a 🧪 row in Now, with its brief drawn from its walkthrough and `—` where that says nothing. A heading with a version goes back to `## Now`.
5. **Debt** *(if `.docs/sdd/steering/debt.md` exists)* — after sealing, so the new version counts, run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap check --path .docs/sdd` and apply its warnings without asking: a row of «En espera» that warns `caduca` leaves the file, with `caducada` in the cut's commit body, and so do rows of «Lista» prefixed `**[… saldada …]**`. The closing summary names each one. Then, first thing after them, without asking: invoke `sdd-retro` with `Skill`, argument `release <version>`, also with no `debt.md` if the user asked for the estimate; the closing summary names its proposals, and its `retro.md` goes in the cut's commit, before merge and tag.
6. **Release notes** *(only with `release.hasRecipient: true`)* — `.docs/sdd/releases/vX.Y.Z/release-notes.md`, distilled from the sealed changelog ([release-notes.md](references/release-notes.md)). No other document for the client: no email draft and no client changelog, even if a `client-changelog.md` exists or the user says the client is waiting; an old one stays untouched. The user sends what they send.
7. **Version, tag and merge** — first run the validator again: it must write `Roadmap válido`. Each failure line is fixed in the document, never in the validator; until then, this step doesn't run. Then bump with the project's tooling (without a version file or declared command, the tag and the sealed changelog heading are the version). ⛔ **GATE: the merge to the stable branch and the tag are ALWAYS the user's decision**: prepare them, present them —with `estimation-log.md` and the estimate not asked, that message also offers the retro's **estimate and action items** in one line—, wait for explicit confirmation; user away → PENDING in your final report. **Shortcut, only if all three hold**: (a) a user message in this conversation orders the close («cierra la release», or they invoked `/sdd-end-release`) — the skill firing because of its `description` doesn't count; (b) the user wrote or accepted the exact version answering your proposal of step 1; (c) `release.hasRecipient: false`, written by explicit answer or request of the user, and no scope item moved since the order. With all three, quote the order and the version literally in the summary and run merge + tag in the same turn, with no further confirmation. Missing any: the usual gate. When it runs: merge per the project's git-flow, **ANNOTATED tag `vX.Y.Z` on the merge commit of the stable branch** (not on a feature, not before the merge), push the tag and, if the git-flow has an integration branch (`develop`), **merge the stable branch back into it**, so the tag lands in its history.

## Red flags — STOP, you haven't closed

- You chose the version (or jumped to `1.0.0`) without the user's confirmation.
- You're about to seal the changelog without the full suite green on the sha you cut or the CI's `success` on it.
- You're about to tag with ✅ rows still in Now, or with `CHANGELOG.md` at the root unsealed.
- You took an unvalidated 🧪 row out of Now: an addendum nobody reads doesn't reclaim anything.
- You wrote an email draft or touched `client-changelog.md`.
- A row warned `caduca` is still in `debt.md` after the cut.
- Merge or tag already ran and the user didn't confirm — or the tag is on a feature branch, or before the merge.
- You granted yourself the shortcut: you wrote `release.hasRecipient: false` without the user answering, or fired this skill without their order.
- A closed row has no walkthrough or `patch.md`, and you went on without the user's decision.
- You're about to commit the cut, or propose merge and tag, without `sdd roadmap check` writing `Roadmap válido`.
- `.docs/sdd/releases/vX.Y.Z/` doesn't exist at the end, with a recipient, triaged debt or a retro asked for (with none, it isn't required).

| Rationalization | Reality |
| --- | --- |
| "The roadmap has no «Releases cerradas»: I'll migrate it to the form the steps expect" | The 3.0.0 form has no such section on purpose. What's done goes to the changelog, and what's pending stays in Now (`tests/sdd-end-release-0177-green.md`). |
| "There's no changelog in `.docs/sdd/`: nothing to seal" | It's `CHANGELOG.md` at the root (one subject tagged with every row still in Now). |
| "The 0014 wasn't validated, but it ships: its row goes" | 6 of 9 subjects did that, and nobody reclaimed it. It stays in Now until someone says what they tried. |
| "Expiring debt is for `sdd-roadmap`" | Between cuts `sdd-roadmap` proposes it. In the cut, the warning applies, with no question. |
| "The client expects the news: I'll draft the email too" | Release notes are the only document for the client. Sending is the user's. |
| "The changelog says it all, I'll send it as is" | Different readers: the client doesn't read feature ids or jargon. Release notes are distilled, not copied. |
| "There's a breaking change: 1.0.0" | Not in pre-1.0: `v1.0.0` marks production. And the user confirms the version. |
| "The retro from memory, it was just now" | Without the estimation-log's numbers and the previous action items there's no learning, only anecdote. |
| "The user named the version in the request: confirmed, I run merge and tag" | Naming the milestone describes the request. Confirmation answers the final proposal. |
| "Giving me the version doesn't count, I'll ask again" | It counts if you quote the order and the version answering your proposal, and the user wrote `hasRecipient: false` with no scope moved: with all three, a second round is waste. |
| "I'll write `hasRecipient: false`: clearly a one-person project" | Only the user writes it. Otherwise the gate stays. |
| "The CI said `success` on the sha, but I'll run the suite anyway" | The CI already ran it on that sha; repeating is the cost the rule removes (`tests/base-ci-green.md`, `rc2`). |
| "The roadmap looks fine, no need for the validator" | `Roadmap válido` is the proof, not your reading. |
| "The work is delivered and shown; the missing walkthrough doesn't block" | Missing evidence is a failed entry gate. It's regularized or the user decides. |

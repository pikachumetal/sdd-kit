---
name: sdd-templates
description: Use when an SDD artifact must be created (spec, plan, tasks, walkthrough, patch, proposal, data-model, research, release retro, release notes) or a project document (PRODUCT, constitution, operations, architecture, roadmap, estimation, changelog, ADR) — the template is traced from here. Templates live ONLY in the kit; projects do NOT carry a templates/ folder.
user-invocable: false
---

# sdd-templates

## Overview

The SDD kit's canonical templates. **They live only here**: projects don't carry a `templates/` folder — to create an artifact, invoke this skill and trace the template that applies. A copy per project would drift instantly (the template evolves in the kit and the copies fall behind).
Write everything the user reads in the language of their message, skill announcements and the one-line notes between tool calls included, also while the reference you follow is in English.
A template's text and literals stay as they are.

| Template | Artifact | When |
| --- | --- | --- |
| [spec-template.md](templates/spec-template.md) | `spec.md` | Every feature, in every mode. Light spec: decisions to validate · Intent/Scope/Approach · delta per capability · approvals |
| [plan-template.md](templates/plan-template.md) | `plan.md` | Full mode and spike, after the spec is approved (how) |
| [tasks-template.md](templates/tasks-template.md) | `tasks.md` | Only if the plan has >1 task (live record) |
| [walkthrough-template.md](templates/walkthrough-template.md) | `walkthrough.md` | Closing of every feature |
| [patch-template.md](templates/patch-template.md) | `patch.md` | Patch lane (only artifact) |
| [proposal-template.md](templates/proposal-template.md) | `proposal.md` | `proposal` lane: `sdd-roadmap` writes it for something big or a client meeting; historical, with dated amendments |
| [launch-prompt-template.md](templates/launch-prompt-template.md) | launch prompt, in the chat | Given by `sdd-roadmap` and `sdd-explore`: starts the change in another worktree with its lane and its decisions |
| [validation-template.md](templates/validation-template.md) | validation message, in the chat | Presented by `sdd-archive` |
| [data-model-template.md](templates/data-model-template.md) | `data-model.md` | Optional: data changes that don't fit in the plan |
| [research-template.md](templates/research-template.md) | `research.md` | A spike's evidence, with its objectives table |
| [retro-template.md](templates/retro-template.md) | `retro.md` | Release cut, through `sdd-retro`: review by cause, proposals and, if asked, estimate |
| [release-notes-template.md](templates/release-notes-template.md) | `release-notes.md` | Release closing: client notes distilled from the changelog |
| [capability-template.md](templates/capability-template.md) | `capabilities/<capability>.md` | Living truth of behavior: created by the spec that declares the capability, merged by `sdd-archive` |
| [kit-feedback-template.md](templates/kit-feedback-template.md) | ticket in `.docs/sdd/kit-feedback/` | When closing a feature or a patch, via `sdd-feedback` |
| [PRODUCT-template.md](templates/PRODUCT-template.md) | `PRODUCT.md` at the root | Who the product is for and what for, and its glossary (`## Terminology`). Impeccable's headings, since it reads the same file |
| [constitution-template.md](templates/constitution-template.md) | `.docs/sdd/steering/constitution.md` (2.x: `.docs/sdd/constitution.md`) | Anchor document: traced by the init, with the five «Reglas de producto» by name |
| [operations-template.md](templates/operations-template.md) | `.docs/sdd/steering/operations.md` | How it runs and is verified: commands, testing, frontend and environments; no versions |
| [architecture-template.md](templates/architecture-template.md) | `.docs/sdd/steering/architecture.md` (2.x: `.docs/sdd/architecture.md`) | Anchor document: traced by the init, or by whoever needs it if it was postponed (a feature, `sdd-archive` with a structural learning, `sdd-explore`) |
| [now-next-later-template.md](templates/now-next-later-template.md) | `ROADMAP.md` at the root | Anchor document: traced by the init; Now, Next and Later with the literal table header, because other skills and `sdd roadmap check` read them |
| [debt-template.md](templates/debt-template.md) | `.docs/sdd/steering/debt.md` | State document of the technical debt: Por triar, En espera and Lista; `sdd-roadmap` writes it when triaging |
| [roadmap-template.md](templates/roadmap-template.md) | `.docs/sdd/roadmap.md` | **2.x, deprecated: read by `migrations/v2.3.0.md` and unmigrated projects; deleted in 4.0.0.** 2.x anchor document: literal sections and table headers, because other skills read them |
| [estimation-template.md](templates/estimation-template.md) | `.docs/sdd/steering/estimation.md` (2.x: `.docs/sdd/estimation.md`) | Project opt-in: activates the estimation module; empty calibration at birth |
| [changelog-template.md](templates/changelog-template.md) | `CHANGELOG.md` at the root (2.x: `.docs/sdd/changelog.md`) | Project opt-in (init interview): activates `add-to-changelog`; born with `## [Unreleased]` and no entries |
| [adr-template.md](templates/adr-template.md) | `.docs/sdd/decisions/NNNN-<slug>.md` | The why of a decision that is hard to undo; immutable, replaced by another |

## CLI

The kit's executable code is a Node CLI, `cli/bin/sdd.js`, that travels with the plugin; it isn't copied to the project. Invoke `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verb> <options>`; `--help` lists the verbs. Below they go without the path.

| Verb | Use |
| --- | --- |
| `sdd estimation log` | Regenerates `estimation-log.md` from the walkthroughs and patches (`walkthrough.md` §2, `patch.md` §5, legacy `hotfix.md`): `estimation log --root "<project root>"`. A local copy in the project is drift. |
| `sdd id next` | Reserves the next id (`0001`–`9999`) in `ids.mode: sequence`: `id next --project-root "<root>" --reserve [--count N]`. Lock in git's common directory and a counter shared across worktrees: a reserved id doesn't come out again. Without `--reserve` it only proposes and doesn't write (`sdd-explore` uses it). In `tracker` mode it exits with an error. |
| `sdd merge` | The closing merge per the `merge` policy of `sdd-kit.json`, with a per-repo lock, in a temporary worktree `merge-<id>`; regenerates `estimation-log.md` if it clashes and runs `--verify` first, in the change's worktree and without the lock. With `--push` it pushes the target branch. If it fails, it leaves it as it was. Recipe: [merge-recipe](../sdd-archive/references/merge-recipe.md): `merge --project-root "<worktree>" [--push] [--verify "<suite>"]`. |
| `sdd capability check` | Validates `capabilities/` (title, sections, purpose ≤ 300 characters, GIVEN/WHEN/THEN, no delta marks, rules with their five entries). With `--artifact`, after merging, it checks that the «Capacidades» block of the spec or `patch.md` names the capabilities of its delta and that each `ADDED` or `MODIFIED` is in its capability: `capability check --path "<root>/.docs/sdd" [--artifact "<spec.md or patch.md>"]`. |
| `sdd capability merge` | Merges the delta of a spec or `patch.md` into `capabilities/` (`ADDED` adds, `MODIFIED` replaces, `REMOVED` removes, rules by name; only the scenarios pass). All or nothing: on a failure it doesn't write and exits with 1: `capability merge --path "<root>/.docs/sdd" --artifact "<spec.md or patch.md>"`. |
| `sdd capability index` | The index of `capabilities/`, on the fly: one line `` - `<name>` — <purpose> `` per capability, or `(sin propósito)`. Used by `sdd-propose`, `sdd-roadmap` and `sdd-explore` before choosing what to read. Always exits with 0: `capability index --path "<root>/.docs/sdd"`. |
| `sdd decision check` | Validates the ADRs of `decisions/` (name, `status`, `date`, `rutas`, sections in order, unrepeated numbers); one line per failure and exits with 1: `decision check --path "<root>/.docs/sdd"`. |
| `sdd decision index` | Lists the ADRs; with `--files`, only the `accepted` and `proposed` ones whose `rutas` match those files. Always exits with 0: `decision index --path "<root>/.docs/sdd" [--files <file>]…`. |
| `sdd roadmap check` | Validates `ROADMAP.md` (shape of `now-next-later-template.md`) or `.docs/sdd/roadmap.md` (shape of `roadmap-template.md`), and `steering/debt.md` if it exists (sections, order, tables, headers and states, nothing settled after the last closed release). One line per failure and exits with 1; with no failures, `Roadmap válido`. Blocks the cut of `sdd-end-release`; in other closings it warns about what was inherited: `roadmap check --path "<root>/.docs/sdd"`. |
| `sdd id claim` | At start, publishes the id on the remote's integration branch: `id claim --project-root "<root>"`. If another clone already has it, it renumbers and renames the branch. |
| `sdd roadmap publish` | Commits on the integration branch the `.docs/sdd/` files passed to it, with the lock of `sdd merge`: `roadmap publish --project-root "<root>" --message "<message>" [--into <branch>] <files>`. Used by `sdd-roadmap`. |
| `sdd session tokens` | Measures the tokens and cost of a worktree's Claude Code sessions: `session tokens --path <worktree> --branch <branch>`. Used by `sdd-archive`. |
| `sdd watch subagent` | Watches a subagent's transcript and ends when it hangs or finishes: `watch subagent --description "<dispatch description>"`. |
| `sdd watch command` | Runs a command in the background, saves its output and ends with it (`TERMINADO: <comando> salió con <rc>`) or if it goes silent: `watch command -- <command…>`. For a command already running, `watch command --path <output file>`. |
| `sdd workspace` | Resolves and creates the SDD workspace of a plan: `workspace <plan>`. |
| `sdd task start` | Opens a Native task and records the base commit: `task start <plan> <n>`. |
| `sdd task done` | Runs a task's «Verificación» and, if it passes, notes it in the ledger: `task done <plan> <n> <base> -- <command…>`. |
| `sdd task brief` | Extracts a task's text from the plan to a file: `task brief <plan> <n> <out>`. |
| `sdd review package` | Generates the review package of a commit range: `review package <plan> <base> <head> <out>`. |
| `sdd ledger rulings` | Lists the rulings and deferred minors of a plan's ledger: `ledger rulings <plan>`. Used by `sdd-implement-native`, `sdd-implement-subagent` and `sdd-archive`. |
| `sdd hook session-start` | Writes the session-start context; run by `hooks/hooks.json`, not by the skills. |

Rules when using them:

- **Trace the structure** (same sections, same order); the help blocks in quotes (`>`) are deleted when drafting.
- **3.0.0 structure**: `PRODUCT.md`, `ROADMAP.md` and `CHANGELOG.md` at the project root; in `.docs/sdd/`, `steering/` (constitution, operations, architecture, estimation), `decisions/`, `capabilities/`, `changes/` and `releases/vX.Y.Z/`. The artifacts of a feature, patch and proposal, in `changes/<yyyyMMdd-HHmmss>-(feature|patch|proposal)-<id>-<slug>/`. The `specs/` folders from before 3.0.0 are read and not moved (and the `-task-` ones from before 2.0.0 aren't renamed); a project still on 2.x keeps its documents in `.docs/sdd/` and its artifacts in `specs/`.
- Sections marked *(si el módulo está activo)* are governed by the project's predicates (`estimation.md`, `changelog.md` present or not).
- **Lite mode**: the spec is traced from the SAME light template (decisions · Intent/Scope/Approach · delta · approvals) and adds the «Estimación y esfuerzo» block, which in full mode lives in `plan.md`. No `spec-lite-template.md` exists or is created: a second template is instant drift (Art. VIII).
- When drafting the artifact, replace the `<proyecto>` gaps (stack, build commands, constitution articles) with the project's real values (`tech-stack.md`, `constitution.md`).

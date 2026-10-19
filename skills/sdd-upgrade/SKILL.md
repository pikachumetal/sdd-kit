---
name: sdd-upgrade
description: Use when a project with .docs/sdd/sdd-kit.json asks to update to the loaded kit («actualízame al kit», «ponme el proyecto al día»), or accepts the offer of the pending-migrations notice at session start, or asks to review the project's rules against the kit. Not for a new project or an init in progress (that is sdd-init).
---

# sdd-upgrade

## Overview

Bring an initialized project up to the loaded kit by applying, in order, the migrations it hasn't applied. Write everything the user reads in the language of their message. Each file of [references/migrations/](references/migrations/) is one version's changes, as steps that start with a checkable predicate. You migrate only after the user's «sí» (their request, or their answer to the session's offer), you never move content in bulk, and you ask before deleting or restructuring anything. Every `sdd <verb>` runs as `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verb>`.

## Steps

1. **What is pending**: run `sdd upgrade --root "<root>"`. It prints the pending migrations' paths in SemVer order, or `el proyecto ya está al día con el kit <versión>` (say it and touch nothing; asked to review the project's rules against the kit, run the last step of that version's migration), or `init en curso: sigue con sdd-init` (invoke `sdd-init` with `Skill`: an init in progress isn't migrated). With `sin sdd-kit.json: se aplican todas`, the question «a project older than v0.2.0, or a 2.x init that was cut?» belongs to `sdd-init` (its predicate 4): if this session hasn't answered it, invoke `sdd-init`; with «older», apply them all; with «cut init», the init goes on and you don't migrate.
2. **Apply each file in order, step by step.** Each step starts with a predicate: if it doesn't hold, skip it and say so. Steps without a **gate** mark (a text substitution, renaming a table) run without asking: they're reversible and the user reviews them in the diff. A step marked **gate** is presented to the user before it runs (a mass rename, a deletion, an `estimation-log.md` diff).
3. **A step without a mark that deletes or restructures is a gate too**: if it deletes a file, a whole section or a JSON key, or changes a file's path (moving, splitting or merging included), present it and wait for the «sí», even if the migration doesn't mark it. Rewriting without deleting (substituting a name, adding a section) isn't. A step its migration marks «sin gate» runs without asking: the mark wins over this rule.
4. **A gate nobody answers stays pending**: with the user away, don't run it on your own — not executed, not staged «for review». Pending means untouched, with the exact command listed in the report.
5. **What isn't migrating**: regenerating anchor documents, dumping `capabilities/`, splitting a legacy functional document, touching historical specs or walkthroughs, deleting project scripts that aren't the kit's, and moving content in bulk (the `specs/` folders stay where they are).
6. **Closing each version**: run the file's «Verificación», then `sdd upgrade --root "<root>" --mark <versión>`, which writes `version`, `channel` and `updated` and keeps the other keys, and make one commit `chore(sdd): migrar al kit vX.Y.Z` once its gates are resolved. With a gate pending: no commit and no marker for that version or the later ones; leave the applied changes in the working tree and the pending list in the report.
7. **Report**: what each version changed, what was skipped and why, and each pending gate with its command and how to resume (answer it and ask for the migration again). If you came from the session's offer, then go back to what the user had asked.

## Writing a new migration

Declare, in a `**Escribe**:` line right before «Verificación», each file and each key it writes in the project, in backticks. Everything it declares is also asked or written by `sdd-init` (its text or `sdd init`), from a single source: a new project is born in the current version and never goes through this migration. `tests/MigrationInitParity.Tests.ps1` checks it.

Every migration ends with the review of the project's rules against the installed kit, after its marker and without blocking it (step 8 of [v3.0.0.md](references/migrations/v3.0.0.md)). If the release changes a rule a template copied into the projects (the method in `estimation.md`), the migration carries the step that updates the project's copy. No step or «Verificación» passes `Select-String` a path that may not exist (`AGENTS.md`, `.claude/`): it cuts the whole search and the step reads as clean. Use `git grep --untracked`, with `:(glob)` for a folder's own files.

## Red flags — STOP

- You're about to migrate a project whose `sdd-kit.json` has `init`.
- You're about to run a step that deletes a file, a section or a key, or moves a file, without the user's «sí», because its migration doesn't mark it as a gate.
- A gate is pending and you're about to write the marker or commit that version.
- You're about to write `sdd-kit.json`'s `version` by hand instead of with `sdd upgrade --mark`.
- You came from the session's offer and you're about to end without going back to the user's request.

| Rationalization | Reality |
| --- | --- |
| «The step isn't marked gate, so I run it» | A deletion or a move is a gate even unmarked. Only «sin gate» written in the migration lets it run without asking. |
| «The user isn't here: I'll stage it so they only have to confirm» | Staged is done. Pending means untouched, with the command in the report. |
| «I'll order the files by name» | `v0.10.0` sorts before `v0.9.0`. The order is `sdd upgrade`'s. |
| «The project is behind, I'll migrate it while I do what they asked» | No «sí», no migration. The session's offer asks first. |

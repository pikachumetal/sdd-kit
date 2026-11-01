---
name: sdd-retro
description: Use when sdd-archive closes a feature or sdd-end-release cuts a version in a project with .docs/sdd/, to improve the project's environment from what the session or the debt shows. Invoked from there; not the entry of a change (that is sdd-propose).
---

# sdd-retro

Improve the project's environment from evidence, at the cheapest place that fixes it. Write everything the user reads in their language; the literals of the project's documents stay as written here, in Spanish. The argument says the pass: `cierre` or `release <version>`.

## Pass `cierre`

1. **Walk the session** for these signals, each something that should already have been solved and cost something here (something new you learned is a learning, and step 3 of `sdd-archive` has it):
   - `corrección repetida`: the dev-lead corrected the same thing twice.
   - `búsqueda a ciegas`: several searches for what a document could have named.
   - `documento o skill desmentido`: a document or a skill says what the session proved false.
   - `error que cazaría un chequeo`: the same kind of error could have been caught by a machine.
2. **For each signal, the first exit that solves it**, in this order: a check (test, lint, hook) · a line in `CLAUDE.md` or `operations.md` · the reviewer's norm, the code-quality article of the constitution, if it has one · a skill: first thing, invoke `sdd-agent-writing` with `Skill`. A contradicted document is corrected in that same document. If the exit doesn't fit its word cap, use the exit of the learnings bullet in step 3 of `sdd-archive`.
3. **A signal caused by a skill or a template of the kit** isn't changed here: the kit is installed, not yours. Its line carries what it contradicts, and the ticket offer of `sdd-archive` names it.
4. **Edit §5 of the walkthrough file**, also if the request said to touch only this step: the file is the record, and your message isn't. The lines, literal:

```text
Retro: corrección repetida → operations.md (ruta de los informes)
Retro: documento o skill desmentido → ticket del kit: <what it contradicts>
Retro: sin señales
```

`Retro: sin señales` is a complete result: that line, with no other file changed. The signals come from what happened, so an empty walk ends here.

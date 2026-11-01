---
name: sdd-retro
description: Use when sdd-archive closes a feature or sdd-end-release cuts a version in a project with .docs/sdd/, to improve the project's environment from what the session or the debt shows. Invoked from there; not the entry of a change (that is sdd-propose).
---

# sdd-retro

Improve the project's environment from evidence, at the cheapest place that fixes it. Write everything the user reads in their language; the literals of the project's documents stay as written here, in Spanish. The argument says the pass: `cierre` or `release <version>`.

## Pass `cierre`

1. **Walk the session** for these signals, each something that should already have been solved and cost something here (something new you learned is a learning, and the learnings bullet of `sdd-archive` has it):
   - `corrección repetida`: the dev-lead corrected the same thing twice.
   - `búsqueda a ciegas`: several searches for what a document could have named.
   - `documento o skill desmentido`: a document or a skill says what the session proved false.
   - `error que cazaría un chequeo`: the same kind of error could have been caught by a machine.
2. **For each signal, the first exit that solves it**, in this order: a check (test, lint, hook) · a line in `CLAUDE.md` or `operations.md` · the reviewer's norm, the code-quality article of the constitution, if it has one · a skill: first thing, invoke `sdd-agent-writing` with `Skill`. A contradicted document is corrected in that same document. If the exit doesn't fit its word cap, use the exit of the learnings bullet of `sdd-archive`.
3. **A signal caused by a skill or a template of the kit** isn't changed here: the kit is installed, not yours. Its line carries what it contradicts, and the ticket offer of `sdd-archive` names it.
4. **Edit §5 of the walkthrough file**, also if the request said to touch only this step: the file is the record, and your message isn't. One line per signal, with its name as written above, literal:

```text
Retro: <señal> → <salida> (<fichero>)
Retro: <señal> → ticket del kit: <qué desmiente>
Retro: sin señales
```

`Retro: sin señales` is a complete result: that line, with no other file changed. The signals come from what happened, so an empty walk ends here.

## Pass `release <version>`

Runs without asking and holds nothing back, also with the user away. It reads `.docs/sdd/steering/debt.md` as the cut left it.

1. **Run** `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap causes --path .docs/sdd --version <version>`. On `Sin deuda triada`, or without `debt.md`, there is no review: go to step 4.
2. **Write** `.docs/sdd/releases/v<version>/retro.md`, tracing `retro-template.md` of `sdd-templates`, with that output pasted untouched.
3. **Fill «Propuestas»**, reading the tickets of each row in «Origen» for the change. A proposal enters by one of two doors:
   - a cause with two or more open rows with «Destino» `sin fila`, or one such row with two or more cases: one row per cause, with one concrete change that would settle them;
   - a row whose `Abierta desde` is earlier than the version of the previous retro (the one its last line names), with or without a destination: `prioriza o descarta`.

   A row with a destination and no carry-over is already decided, and stays out. With no row through either door, the section is `Sin propuestas`. The review writes nothing in `debt.md` or `ROADMAP.md`: deciding is for `sdd-roadmap` and the dev-lead, and rejecting a proposal is discarding its row.
4. **Estimate and action items**, only if the user asked: that section of the template, with the release's numbers from `estimation-log.md` and the state of the previous action items. Without `debt.md`, the file carries only this.
5. **Name the proposals** to `sdd-end-release`, for its closing summary. The file goes in the cut's commit.

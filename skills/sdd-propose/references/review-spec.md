# Spec review — the complexity rubric and the adversarial reviewer

Applies in full and lite mode, after writing `spec.md` and before presenting it at the gate. A spike has no review: it has no delta or Scope to review, and its output is evidence that gets measured. A config change has no spec, so no review either.

## 1. Count the signals (observable in the spec)

| Signal | Holds if… |
| --- | --- |
| New capability | «✋ Decisiones que he tomado yo» declares a new capability in `capabilities/` |
| Public contract | the delta touches an API, a file format or an interface another module or system consumes |
| `MODIFIED` / `REMOVED` | the delta changes or removes an existing requirement |
| Three or more capabilities | the delta has three or more «Capacidad:» subsections |
| Data or migration | there's a schema change, a migration or new persistent data |
| External dependency | a library, service or system the project didn't use comes in |
| Unexplored area | the spec touches code or documents you haven't read in this session |
| Visibility or permission rules | the delta brings in a role, a state or a condition that decides **what someone must not see or do** (the functional spec usually says what each role does and stays silent on what it must not) |

## 2. Decide how many reviewers

The rubric decides how many reviewers, not whether there is a review, and you don't ask the user whether to do it:

- **Full: two reviewers**, one lens each (domain and technical), in parallel.
- **Small Scope → one reviewer with the seven points**: estimate how many lines what the Scope lists changes, text and code together; with fewer than ~50, and a delta that touches no public contract and carries no `MODIFIED`, one reviewer. The signals say what to look at; the size, what looking costs: four signals asked for two reviewers for a few paragraphs (ticket 0040 §1b). «It's only one line» doesn't lower a public contract or a `MODIFIED` to one reviewer: two lines in `db/002-site.sql` and `src/api.js` that change a contract still get two.
- **Lite: one reviewer with the seven points**, `model: sonnet`.
- **Two reviewers, restricted parallelism and a delegated spec → one reviewer with the seven points**, without asking: if the level is two reviewers, the dev-lead chose or said at the start «apruebo la spec por delegación» and the user's instructions ask to confirm before parallelizing, don't dispatch two reviewers or stop to confirm it. «Toma tú las decisiones» without that option isn't a delegated spec. One reviewer isn't parallelizing, and the second lens goes in the line of the reasonable minimum. With the rule only in the instructions, 2 of 2 subjects with the spec delegated stopped to ask permission for the two reviewers (`tests/spec-review-weight-red.md`, p).
- **Two reviewers, restricted parallelism and a spec not delegated → one question**, before dispatching them, with the two reviewers, each one's model and its cost: it's a money stop the user's own instructions ask for.
- **A level the dev-lead names** in the request or the launch prompt («sin review», «un revisor») is applied, and their literal phrase goes to «Decisiones tomadas con el dev-lead». In `unattended`, never fewer reviewers than the rubric gives.

**The model.** The domain reviewer, and the single reviewer of full that carries that lens, goes in Opus when the spec touches business rules, roles or flow rules («permisos por rol del gestor de cobros»), and in Sonnet when not («renombrar una columna del listado»). The technical lens always goes in Sonnet. In lite, Sonnet even if the spec touches roles: it's the dev-lead's phrase («levantar uno en sonnet»). If the request or the launch prompt name the model, apply it.

The level goes as the **block that opens** «✋ Decisiones que he tomado yo — valida estas», as the record of what you dispatched, in this form:

```text
Review de spec propuesta: <nivel> — señales: <las contadas> · tamaño: ~<N> líneas en <M> ficheros
- Dominio (<modelo>): <qué comprobaría en ESTA spec> (señal: <la que lo motiva>)
- Técnica (sonnet): <qué comprobaría en ESTA spec> (señal: <la que lo motiva>)
- Mínimo razonable: <el nivel más bajo defendible> — deja sin cubrir <qué>
```

Each lens line **cites a requirement, a section or a value of this spec**. «Comprobaría contradicciones con las capacidades» fits any spec and helps no one decide; list only the lenses the level dispatches or the minimum drops. The minimum's line names what is **left uncovered**, not the price: what a reviewer costs (~100k tokens) is known, and what the dev-lead can't see without you is what goes unread if they cut.

Example, in a billing spec:

```text
Review de spec propuesta: dos revisores — señales: contrato público (el webhook `invoice.paid` lo consume el portal del cliente), MODIFIED (dos requisitos de `invoicing`), datos (columna `tax_rate`), rol nuevo (gestor de cobros) · tamaño: ~180 líneas en 6 ficheros
- Dominio (opus): si el MODIFIED de «La factura se emite al cerrar el mes» mantiene el aviso a contabilidad que hoy exige la capacidad, y qué NO puede hacer el gestor de cobros (señal: MODIFIED + rol nuevo)
- Técnica (sonnet): si el payload de `invoice.paid` queda versionado y si `tax_rate` necesita migración con valor por defecto para las facturas ya emitidas (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar el complemento del rol nuevo, el tipo de hueco que no se ve hasta que alguien accede a lo que no debía
```

## 3. Dispatch the reviewers

Subagent `subagent_type: sdd-kit:effort-medium`, with the model of §2, one per lens, each with its silence watch ([control-profiles.md](control-profiles.md#silence-watch)). With two reviewers, load `sdd-parallel-agents` with `Skill` and dispatch them with it, in the same response. The brief's points **are split by how many reviewers you dispatch**:

- **One reviewer**: its lens gets the **seven points**.
- **Two reviewers**: **domain** gets 1, 3, 5, 5 bis and 7; **technical** gets 2, 4 and 6, and also reads `architecture.md`. Each brief closes with the frontier: «if a finding belongs to a point not on your list, don't report it: the other reviewer looks at it».

Without the split, the common points are paid twice: 4 of 18 findings duplicated in the field (task 0009, ~100k tokens per reviewer) and 8 of 19 —42 %— in the RED of this rule (`tests/spec-review-lenses-red.md`).

Brief, with the points it gets:

> You are an adversarial reviewer of an SDD spec, with the `<domain|technical>` lens. Your job is to find what will make the implementation or the gate fail, not to approve. Read: `<path of spec.md>`, `.docs/sdd/constitution.md`, `.docs/sdd/mission.md`, `<touched capabilities from capabilities/>` [technical lens: and `.docs/sdd/architecture.md`]. Don't read code or other specs. Look, in this order, for: (1) contradictions with the living truth of `capabilities/` — an `ADDED` that changes an existing requirement is an undeclared `MODIFIED`; (2) delta requirements without a GIVEN/WHEN/THEN scenario or with a scenario that can't be verified; (3) hidden scope — something the Intent promises and the Scope doesn't list, or the other way round; (4) decisions taken in the body that aren't in «✋ Decisiones que he tomado yo»; (5) [if the spec brings in a role, a state or an access condition] **the complement**: for each new role or state, what is forbidden —what it doesn't see, what it can't do— and whether the spec says so; a role described only by what it does is a visibility gap; (5 bis) [if the delta brings in new data, names, limits, warnings or a conflict condition] **the five rules by name** —where the data lives · language of the names · limits · warnings · rule on conflict—: each one declared in «Reglas de la capacidad» or «no aplica», with the value taken from the constitution's «Reglas de producto» or from the capability; a rule invented where one was already written, or one that contradicts the constitution, is Crítico; (6) contracts, data or dependencies the spec touches without saying so; (7) **the examples**: an example, a value or a fixture of the spec that contradicts the constitution, and —even if the constitution doesn't forbid it— any that names a real client, project, person or datum where an invented example would serve as well; artifacts get published and the name doesn't leave the history. With two reviewers, end with your lens's frontier. Return ONLY a numbered list, one finding per line: `<Crítico|Importante|Menor> · <dónde (sección)> · <qué falla> · <qué cambiar>`, in the user's language. No preamble, no praise, ten findings at most.

## 4. Fold the findings in before the gate

Subsection `### Hallazgos de la review` inside «✋ Decisiones que he tomado yo», one line per finding: `**Aceptado** — <hallazgo> → <cambio hecho en la spec>` or `**Rechazado** — <hallazgo> → <motivo>`. Críticos aren't rejected without a written reason. Then the second round, if it applies: with a Crítico accepted or the central decision rewritten —the one that fixes the chosen approach, in the approaches message or in the ✋, or, without approaches, the one the Intent makes the condition of success—, a new reviewer with the seven points, dispatched as in §3 with `model: sonnet`, rereads the corrected spec once, in full and in lite, and its findings are folded in the same way; a Crítico of that round goes to the gate accepted or rejected with its reason, with no third round. Without an accepted Crítico or a rewritten central decision, there's no second round. Then the gate: the user reads the decisions and the findings, nothing more.

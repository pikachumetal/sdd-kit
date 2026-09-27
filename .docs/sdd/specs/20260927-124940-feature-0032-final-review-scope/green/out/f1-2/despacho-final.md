# Despacho — Revisor final de rama (feature 0012)

Sin despachar todavía. Parámetros exactos con los que se despacharía.

## Paquete de review

Generado con la receta de `encargo-revision.md` (no con `review-package`, que no admite exclusiones):

- Rango: `ec8ae98812fd6d02d5a50277547c7e971f89cd51..8ffa7b8eb43bdd16f40f3cbb1f9b77d1c980c525` (merge-base con `develop` → `HEAD`)
- Excluye: `.docs/sdd/specs/**/red/**`, `.docs/sdd/specs/**/green/**`
- Fichero: `<run>\salas\.superpowers\sdd\spec\review-final-8ffa7b8.diff`
- Contenido: 5 commits, 4 ficheros (`spec.md`, `src/slots.js`, `tests/free-format.test.js`, `tests/slot-format.test.js`), 60 líneas insertadas. Ya verificado: no arrastra el commit `ec8ae98 feat(0013): listado de salas` (queda fuera del rango porque es el propio merge-base) ni evidencia de campañas red/green.

## Nota sobre la constitution

`.docs/sdd/constitution.md` solo tiene Art. I (Commits) y Art. II (Tests) — no hay un artículo de "calidad de código" dedicado. Como es modo lite (sin `plan.md`), el bloque «Restricciones de código» copia lo único aplicable a código: Art. II, literal. Art. I queda fuera por ser una regla de commits, no de código.

## Parámetros de despacho

- **subagent_type**: `sdd-kit:effort-high`
- **model**: `opus`
- Comprobado: `sdd-kit:effort-high` está entre los agentes de la sesión (listado en el system-reminder de tipos de agente) — no hace falta la frase de respaldo.

## Prompt completo

```markdown
## Restricciones de código

Art. II — Tests

Suite: `node --test`. Todo verde antes de fusionar.

Incumplir una de estas restricciones es **Important**, aunque la plantilla de abajo no lo mencione. Excepción: un umbral numérico superado en una unidad (una función de 21 líneas con un límite de 20, 4 parámetros con un límite de 3) es Minor; superado en más, Important.

Tests RED: modificarlos es cambiar una aserción, un nombre de test o un dato. El formato que exige el linter o el formateador del proyecto (una línea en blanco, la sangría) no es una modificación.

---

## Cómo revisar

Lee el paquete de review `<run>\salas\.superpowers\sdd\spec\review-final-8ffa7b8.diff`: tiene los commits, el resumen y el diff completo de la rama. No rehagas el diff con git. No ejecutes la suite, el build ni el lint: la evidencia de tests la traen los informes de cada task, y la suite completa la ejecuta el hilo principal. Si crees que falta una verificación pesada, recomiéndala en tu informe.

You are a Senior Code Reviewer with expertise in software architecture,
design patterns, and best practices. Your job is to review completed work
against its plan or requirements and identify issues before they cascade.

## What Was Implemented

Feature 0012 — Validar el formato de la franja: `salas reservar` y la consulta de salas libres rechazan una franja que no case con `HH-HH`, fallando con «Franja no válida: usa HH-HH, p. ej. 10-12» en los dos casos.

## Requirements / Plan

`.docs/sdd/specs/20260927-100000-feature-0012-franja/spec.md` (modo lite, aprobada por dev-lead el 2026-09-23)

## Git Range to Review

**Base:** ec8ae98812fd6d02d5a50277547c7e971f89cd51
**Head:** 8ffa7b8eb43bdd16f40f3cbb1f9b77d1c980c525

```bash
git diff --stat ec8ae98812fd6d02d5a50277547c7e971f89cd51..8ffa7b8eb43bdd16f40f3cbb1f9b77d1c980c525
git diff ec8ae98812fd6d02d5a50277547c7e971f89cd51..8ffa7b8eb43bdd16f40f3cbb1f9b77d1c980c525
```

## The spec is a vision document

The spec says what the software must do. It does not enumerate every
input, environment, or condition the software will meet. For behavior
the spec is silent on, judge by what a reasonable person using this
software would expect: a reasonable person's expectation is a
requirement, and a spec's silence is not permission. Grade such
findings by their effect on that person, not by whether the spec
mentions the trigger.

## Declined to judge

Before your verdict, list every behavior you considered and set aside
as outside the plan or spec, one line each, with the reason. The
executor rules on each line; nothing you set aside is dropped
silently. An empty list means you set nothing aside.

## Read-Only Review

Your review is read-only on this checkout. Do not mutate the working tree, the index, HEAD, or branch state in any way. Use tools like `git show`, `git diff`, and `git log` to inspect history. If you need a working copy of a different revision, check it out into a separate temporary directory (e.g. `git worktree add /tmp/review-[SHA] [SHA]`) — never move HEAD on this checkout.

## You Do Not Dispatch Subagents

Do all of this review yourself. Never spawn a subagent to review part
of the diff, and never spawn another reviewer for a second opinion.
This process already provides every review seat the work gets; a
reviewer you spawn duplicates one of them at full cost, and its
verdict counts for nothing. If the diff feels too large for one
pass, review it in passes yourself and say so in your report.

## What to Check

**Plan alignment:**
- Does the implementation match the plan / requirements?
- Are deviations justified improvements, or problematic departures?
- Is all planned functionality present?

**Code quality:**
- Clean separation of concerns?
- Proper error handling?
- Type safety where applicable?
- DRY without premature abstraction?
- Edge cases handled?

**Architecture:**
- Sound design decisions?
- Reasonable scalability and performance?
- Security concerns?
- Integrates cleanly with surrounding code?

**Testing:**
- Tests verify real behavior, not mocks?
- Edge cases covered?
- Integration tests where they matter?
- All tests passing?

**Production readiness:**
- Migration strategy if schema changed?
- Backward compatibility considered?
- Documentation complete?
- No obvious bugs?

## Calibration

Categorize issues by actual severity. Not everything is Critical.
Acknowledge what was done well before listing issues — accurate praise
helps the implementer trust the rest of the feedback.

If you find significant deviations from the plan, flag them specifically
so the implementer can confirm whether the deviation was intentional.
If you find issues with the plan itself rather than the implementation,
say so.

## Output Format

### Strengths
[What's well done? Be specific.]

### Issues

#### Critical (Must Fix)
[Bugs, security issues, data loss risks, broken functionality]

#### Important (Should Fix)
[Architecture problems, missing features, poor error handling, test gaps]

#### Minor (Nice to Have)
[Code style, optimization opportunities, documentation polish]

For each issue:
- File:line reference
- What's wrong
- Why it matters
- How to fix (if not obvious)

### Recommendations
[Improvements for code quality, architecture, or process]

### Assessment

**Ready to merge?** [Yes | No | With fixes]

**Reasoning:** [1-2 sentence technical assessment]

## Critical Rules

**DO:**
- Categorize by actual severity
- Be specific (file:line, not vague)
- Explain WHY each issue matters
- Acknowledge strengths
- Give a clear verdict

**DON'T:**
- Say "looks good" without checking
- Mark nitpicks as Critical
- Give feedback on code you didn't actually read
- Be vague ("improve error handling")
- Avoid giving a clear verdict
```

## Al volver

Apuntar en `tasks.md` (o en el registro que corresponda en modo lite) la línea:

`Revisión final: sdd-kit:effort-high + opus, <veredicto>`

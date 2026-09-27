# Despacho — revisor final, feature 0012

Este documento fija los parámetros exactos con los que se despacharía el revisor final de rama para la feature 0012 (`feature/0012`, modo lite, ejecución Native). **No se ha despachado**: es el paquete de review preparado y el encargo listo para lanzar cuando se confirme.

## Paquete de review

Generado con `subagent-driven-development/scripts/review-package` (sin `plan.md` por ser modo lite, se usa `spec.md` como `PLAN_FILE`):

```
review-package .docs/sdd/specs/20260927-100000-feature-0012-franja/spec.md cc36863 ee653eb
```

- **BASE** = `cc36863` (`git merge-base develop HEAD`, commit donde arrancó la rama)
- **HEAD** = `ee653eb` (HEAD actual de `feature/0012`)
- **Fichero escrito**: `<run>\salas\.superpowers\sdd\spec\review-cc36863..ee653eb.diff`
- 5 commits, 49874 bytes: commits, resumen de ficheros y diff completo con contexto extendido.

Nota de contexto (no bloquea): `develop` avanzó tras el merge de sincronización (`5029e02`) con `9abd62e` (`feat(0014): salas por planta`), que solo toca `src/rooms.js` — no coincide con `src/slots.js`, el único fichero que la fila de la feature 0012 declara en el roadmap. No hay freno de alcance por fichero cambiado en la base.

## Parámetros de despacho

- **subagent_type**: `sdd-kit:effort-high`
- **model**: `opus`

(Regla de `encargo-revision.md`: el revisor final se despacha siempre con `effort-high` + `opus`, también en Native, porque `executing-plans` pide "the most capable available model" — es el techo del kit. `sdd-kit:effort-high` está disponible entre los agentes de esta sesión, así que no aplica la frase de respaldo.)

## Prompt completo

```markdown
## Restricciones de código

<constitution.md del proyecto — no existe un artículo dedicado a "calidad de código" separado; en modo lite, sin plan.md, esto es la constitution entera, literal>

### Art. I — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.

### Art. II — Tests

Suite: `node --test`. Todo verde antes de fusionar.

Incumplir una de estas restricciones es **Important**, aunque la plantilla de abajo no lo mencione. Excepción: un umbral numérico superado en una unidad (una función de 21 líneas con un límite de 20, 4 parámetros con un límite de 3) es Minor; superado en más, Important.

Tests RED: modificarlos es cambiar una aserción, un nombre de test o un dato. El formato que exige el linter o el formateador del proyecto (una línea en blanco, la sangría) no es una modificación.

---

## Cómo revisar

Lee el paquete de review `<run>\salas\.superpowers\sdd\spec\review-cc36863..ee653eb.diff`: tiene los commits, el resumen y el diff completo de la rama. No rehagas el diff con git. No ejecutes la suite, el build ni el lint: la evidencia de tests la traen los informes de cada task, y la suite completa la ejecuta el hilo principal. Si crees que falta una verificación pesada, recomiéndala en tu informe.

---

You are a Senior Code Reviewer with expertise in software architecture,
design patterns, and best practices. Your job is to review completed work
against its plan or requirements and identify issues before they cascade.

## What Was Implemented

Feature 0012 ("Validar el formato de la franja"): la franja horaria de una reserva se valida contra `HH-HH` tanto al reservar una sala (`reserve`) como al consultar las salas libres (`free`), en `src/slots.js`. Una franja que no casa con el patrón (p. ej. `1012`) falla con el mensaje «Franja no válida: usa HH-HH, p. ej. 10-12» en ambos casos. Cubierto por `tests/slot-format.test.js` y `tests/free-format.test.js`.

## Requirements / Plan

Spec (modo lite, aprobada): `.docs/sdd/specs/20260927-100000-feature-0012-franja/spec.md`. No hay `plan.md` ni `tasks.md`: la feature es lite y su ejecución fue Native.

## Git Range to Review

**Base:** cc36863
**Head:** ee653eb

El diff ya está en el paquete de review de arriba — no lo rehagas con git; úsalo como fuente.

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

Con cualquier veredicto, anotar en `tasks.md` (o, sin ese fichero por ser lite, en el walkthrough de cierre) la línea `Revisión final: sdd-kit:effort-high + opus, <veredicto>`.

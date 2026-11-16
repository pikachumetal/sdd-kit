# SDD ledger — plan: .docs/sdd/specs/20261014-120000-feature-0025-note-tags/plan.md

Base: develop sin cambios desde el merge-base (ROADMAP.md no existe; ningún fichero de la task en el diff). Baseline `node --test` → 1 pass, 0 fail.

## Pre-flight scan

| Task | Qué se comprobó | Hallazgo |
| --- | --- | --- |
| Task 1 | Paso 4 literal (spec, «Decisiones tomadas con el dev-lead») contra el tope de 60 palabras (`test/words.test.js`) y los pasos 1-3 intocables | CONFLICTO: SKILL.md mide hoy 48 palabras; el paso literal mide 26 → 74 > 60. Sin tocar los pasos 1-3 ni el texto literal, solo quedan 17 palabras de frontmatter y título; quitar 14 deja la skill sin `description` (no se dispara). Ninguna lectura cumple las tres decisiones. |

Task 1: DESVIACIÓN — dos decisiones del dev-lead incompatibles; corrección propuesta en spec.md (sin commit): tope a 75. Parada ✋ (delegate). Revisor sonnet de review-spec.md no lanzado: la sesión no tiene herramienta de subagentes.

# SDD ledger — plan: .docs/sdd/specs/20261014-120000-feature-0025-note-tags/plan.md

Baseline: `node --test` → 1 pass, 0 fail (HEAD 177f58b). Base check vs develop: sin diff (ROADMAP.md ni ficheros de la task).

## Pre-flight scan

| Tarea | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única, sin pares) | Su texto contra las «Decisiones tomadas con el dev-lead» de la spec: paso 4 literal (26 palabras), tope 60 de `test/words.test.js`, pasos 1–3 intactos | Conflicto: SKILL.md mide 48; con el paso literal, 74 (medido). Pasos 1–3 (30) + paso literal (26) = 56, y el frontmatter mínimo (`---`, `name:`, `guardar-nota`, `description:`, `---`) ya pasa de 4: no cabe con ningún recorte permitido. |

Task 1: Desviación — las tres decisiones del dev-lead no caben a la vez; cambia una decisión de la spec, no es un ruling. Parada ✋ (perfil delegate) con la corrección recomendada en spec.md, sin commit. Sin RED escrito: el conflicto sale antes del primer paso.

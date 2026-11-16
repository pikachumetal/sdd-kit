# SDD ledger — plan: .docs/sdd/specs/20261014-120000-feature-0025-note-tags/plan.md

## Pre-flight scan

| Fila | Qué se comprobó | Hallazgo |
| --- | --- | --- |
| Task 1 (consigo misma) | Paso 4 literal de «Decisiones tomadas con el dev-lead» + pasos 1-3 intactos frente al tope de 60 palabras de `test/words.test.js` | Choca: la skill mide hoy 48 palabras y el paso literal suma 26 → 74 (`node --test` en una copia fuera del repo: «mide 74»). Ni quitando el título `# guardar-nota` y recortando el `description` se baja de 60 sin tocar los pasos 1-3 ni el texto literal. |
| Pares de tasks | Solo hay una task | — |

Task 1: Desvío — tres decisiones del dev-lead (texto literal, tope 60, pasos 1-3 intocables) no caben juntas; corregirlo cambia una decisión de la spec, no es un ruling. Parada ✋ (perfil delegate) antes de escribir código. Enmienda propuesta en spec.md sin commit.

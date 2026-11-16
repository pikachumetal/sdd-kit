# SDD ledger — plan: .docs/sdd/specs/20261016-100000-feature-0028-note-tags-kept-flags/plan.md

Setup: rama feature/0028-note-tags-kept-flags (checkout normal, no main); trabajo en sitio. Baseline `node --test` en worktree detached 140f7e2 → 1/1 pass. Base develop: sin cambios desde el merge-base (sin remoto).

## Pre-flight scan

| Ámbito | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Pares de tasks | Solo hay Task 1 | sin pares |
| Task 1 contra la spec | Paso 4 literal (26 palabras) + SKILL.md actual (73) frente al tope de 80 de `test/words.test.js` | **99 > 80.** Incluso quitando frontmatter y H1 enteros (lo que queda, 55 + 26) da 81 > 80. Las cuatro «Decisiones tomadas con el dev-lead» (texto literal, tope 80, red flags intactas, pasos 1-3 intactos) no se pueden cumplir a la vez. |
| Task 1 consigo misma | Ficheros: solo SKILL.md; Verificación `node --test` | Con el paso literal, `node --test` sale rojo: la task no puede cerrar en verde sin tocar un fichero o un texto que la spec fija. |

Task 1: Desviación — cumplir la task obliga a cambiar una decisión de la spec aprobada; ninguna opción es un ruling. Parada con 🦆 y ✋ (profile delegate). Corrección recomendada escrita en spec.md §Enmiendas, sin commit: subir el tope a 100 palabras.
Task 1: Ruling: revisor de la spec no despachado — este harness no expone herramienta de subagentes (sin Agent; Workflow exige opt-in del usuario) — si hace falta, la revisión de los siete puntos de review-spec.md la hace el dev-lead al aprobar o se lanza en otra sesión.

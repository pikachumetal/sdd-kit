# SDD ledger — plan: .docs/sdd/specs/20261014-120000-feature-0025-note-tags/plan.md
Setup: base check contra develop sin diferencias (sin remoto). Baseline `node --test` → 1/1 pass.
Pre-flight scan:
| Task | Coherencia interna | Hallazgo |
| --- | --- | --- |
| 1 | El paso 4 literal (26 palabras) se añade a SKILL.md (48 palabras) con tope 60 en test/words.test.js | Prueba real: `mide 74` → falla. Mínimo posible sin tocar pasos 1-3 ni el texto literal: 64 (> 60). Las tres decisiones del dev-lead no caben juntas. |
Task 1: Desviación: el texto literal del paso 4 + pasos 1-3 intactos superan el tope de 60 palabras (74) — parado en ✋, recomendación escrita en spec.md sin commit.
Task 1: Ruling: effort/revisor de la spec — este harness no tiene herramienta de subagentes; no se despacha el revisor sonnet de review-spec.md — la enmienda llega al dev-lead sin esa revisión.

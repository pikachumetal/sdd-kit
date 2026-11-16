# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

Spec: ./spec.md (approved, Laura, 2026-10-14). Profile: delegate. Execution: native.

## Pre-flight scan

| Tasks | Qué se cruza | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 (sola) | Tests RED `h0`+`h1` contra los dos cambios de `skills/guardar-nota/SKILL.md` | `h0` sale limpio 2/2 en el baseline: el fallo no existe; Art. I de la constitución: «si el baseline no exhibe el fallo, no se escribe». El Scope de la spec obliga a escribir la frase y no está marcado «si el RED lo exhibe» | No es ruling: quitar la frase cambia el Scope y el delta → Desvío, parada ✋ |
| Task 1 | Ficheros que crea vs. los que toca | Solo `skills/guardar-nota/SKILL.md`; coherente | — |

## Base check (Task 1)

develop sin remoto; merge-base 94d560a; `roadmap.md` sin diff; ningún fichero cambiado en develop. Limpio.

## Log

Task 1: Desvío — h0 limpio en el baseline (2/2): propongo quitar del Scope la frase del paso 2 y su requisito ADDED; enmienda en spec.md sin commit; esperando al dev-lead.
Task 1: Ruling: revisor sonnet de la enmienda no despachado — este harness no tiene herramienta de subagentes — la enmienda la lee solo el dev-lead; si se escapa algo de los siete puntos de review-spec, lo caza la revisión final.

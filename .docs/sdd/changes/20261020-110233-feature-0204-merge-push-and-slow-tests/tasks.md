---
id: 20261020-110233-feature-0204-merge-push-and-slow-tests
title: Tasks — sdd merge dice qué publica de más, y la suite lenta deja de pasarse de tiempo
spec: ./spec.md
plan: ./plan.md
created: 2026-10-20
---

# Tasks — sdd merge dice qué publica de más, y la suite lenta deja de pasarse de tiempo (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0204-merge-push-and-slow-tests`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Suite lenta con 8 workers y stderr en el error de push | done | be8f1ce5 | el stderr se escribió durante el diagnóstico (ruling) |
| 2 | El push nombra los commits ajenos | done | d3dd7bcd | |

## Verificación por task

- [x] Task 1 — `push-retry.slow.test.ts` verde; RED con «remote: rama protegida» ausente
- [x] Task 2 — `push-retry.slow.test.ts` y `hotfix.slow.test.ts` verdes; `test/merge` 147/147

Revisión final: Spec opus+high, with fixes (1 Important, 5 Minor) · Código sonnet+high, with fixes (1 Important, 8 Minor) · Arquitectura no (plan), sobre d3dd7bcd
Pasada de fix: juntada en el cierre, los 2 Important y los Minor de los dos ejes (aprobado por el dev-lead), con el humo de la receta
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, los 12 hallazgos ADDRESSED; 2 Minor de formato nuevos, arreglados en el cierre sin revisar

## Rulings

- Setup: Ruling: línea base sin el gate completo — la suite lenta corrió verde hoy sobre esta base (257/257) y el pre-commit de la apertura pasó — si me equivoco, un rojo previo se atribuiría a la feature.
- Task 1: Ruling: el stderr en pushDestination se escribió antes de la spec, durante el diagnóstico; entra en la Task 1 con su RED — coste si me equivoco: ninguno.
- Task 1: Ruling: la copia RED fuera del repo no se guardó; el test no cambió entre el RED (falló por 'remote: rama protegida') y el commit — coste si me equivoco: ninguno, el diff lo muestra.
- Final: Ruling: dev-lead decide el humo n=1 y que los Minor entren en la pasada de fix («Humo n=1 con Sonnet», «Sí, todos») — enmienda en la spec — coste si me equivoco: ninguno
- Final: Ruling: humo de la fila de merge-recipe.md, RED 1/1 y GREEN 1/1 citan los commits — la fila se queda como catálogo de salidas, no como regla de conducta — coste si me equivoco: una fila de más en la receta
- Final: Ruling: los 2 Minor de formato de la re-revisión y «(patch 0183)» de `cli/moon.yml` entran en el cierre sin revisar (3 líneas) — coste si me equivoco: un formato sin segunda lectura

Los 8 Minor que el ledger daba por diferidos entraron en la pasada de fix por decisión del dev-lead.

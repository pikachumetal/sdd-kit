---
id: 20260923-214917-task-0053-fewer-stops
title: Tasks — Menos paradas y avisos llanos
spec: ./spec.md
plan: ./plan.md
created: 2026-09-24
---

# Tasks — Menos paradas y avisos llanos (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0053`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Carril de task: aviso de fase, delegación en la primera pregunta y paso 7 | done | fd19c86 | revisión limpia; 1 Minor diferido (un test comprueba presencia, no orden) |
| 2 | Carril de patch: el fallo que no se reproduce y la fila re-medida | done | b0f6dbf | revisión limpia |
| 3 | GREEN | done | (este commit) | en línea; 17/17 (7 escenarios 2/2 y 3 controles), 5,43 $; campaña entera 10,04 $ de un techo de 18 $. Parado el 2026-09-24 a petición del dev-lead («si tienes agentes arrancados, espera pero no arranques más»), tras la primera ronda s1-1…s5-1. s6-1 arrancó después de la petición, porque el hilo paró primero los procesos equivocados y el lanzador siguió vivo; se deja terminar. El resto (s7-1, la segunda ronda y los controles) se lanzó al retomar el 2026-09-24 |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester -Path tests -ExcludeTagFilter Slow`
- [ ] Task 2 — `Invoke-Pester -Path tests -ExcludeTagFilter Slow`
- [ ] Task 3 — campaña GREEN con `red/run.sh` (techo 18 $ compartido con el RED)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

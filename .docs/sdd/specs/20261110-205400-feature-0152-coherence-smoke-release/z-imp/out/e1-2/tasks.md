---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-12
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | b60cfe6 | |
| 2 | Listado de canceladas | done | 0c7ba79 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

Revisión final: auto-revisión (sin herramienta de subagentes) · Spec, sin Critical ni Important · Código, sin Critical ni Important, 3 minor aplazados · Arquitectura no (sin señales; el plan no traía la línea), sobre 0c7ba79

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 1: Ruling: recuperación — el código y el test de la Task 1 llegaron escritos y sin commitear, sin copia RED — rehice la prueba RED ejecutando los tests nuevos contra `src/app.js` de HEAD en un directorio temporal (3 fallan, 1 pasa: el de «sin reserva», que protege comportamiento existente) — si me equivoco, los tests podrían estar ajustados al código.
- Task 1: Ruling: añadí el test del AND «sin `--motivo` responde motivo no válido…» de la spec, que faltaba — la spec lo exige — coste si me equivoco: ninguno, es un THEN aprobado.
- Task 1: Ruling: restauré el test «cancelar sin reserva lo dice» (ahora con `--motivo otro`), que se había borrado — protege comportamiento existente que la spec no retira — coste si me equivoco: un test de más.
- Task 1: Ruling: la verificación lenta en segundo plano que anunció el usuario no está en el plan ni la lanzó esta sesión — cerré la Task 1 con su «Verificación» declarada; si falla, abre una ronda de fix de la Task 1 — coste si me equivoco: una ronda de fix después del commit.
- Task 2: Ruling: `canceladas` con varias reservas canceladas las lista una por línea, y sin ninguna responde vacío — la spec solo fija el caso de una — coste si me equivoco: cambiar el separador o el texto del caso vacío.
- Final: Ruling: Eje Arquitectura decidido al despachar (el plan no trae la línea) — no, sin señales en el diff — coste si me equivoco: una revisión de fronteras que no se hizo.
- Final: minor (deferred): `canceladas` sin ninguna cancelada responde una línea vacía.
- Final: minor (deferred): el test de `canceladas` depende del estado del módulo que deja el primer test.
- Final: minor (deferred): `reasonOf` toma el siguiente argumento aunque sea otra opción (`--motivo --x`); acaba en «motivo no válido».

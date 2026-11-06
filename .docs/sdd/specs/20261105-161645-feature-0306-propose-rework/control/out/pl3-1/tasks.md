---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-06
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6401878 | |
| 2 | Listado de canceladas | done | ac70e30 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `node --test test/cancel.test.js` → `ℹ fail 0`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Revisión final: Spec opus+high, sin Critical ni Important · Código sonnet+high, 1 Important refutado (ruling) · Arquitectura no (plan), sobre ac70e30

Ruling: sin worktree aparte — trabajo en la rama feature/0010-cancel-reason del checkout — si fuera mal, mover la rama a un worktree
Final: Ruling: hallazgo Important del eje Código (test/cancel.test.js pasó de CRLF a LF) — refutado con git show: base 11 de 11 líneas con CR, HEAD 32 de 32; los finales de línea no cambiaron — si me equivoco, un diff ruidoso en un test
Final: minor (deferred): test 'un motivo fuera de la lista no cancela' solo comprueba el mensaje; que no cancela lo prueba indirectamente el test siguiente por el orden del fichero
Final: minor (deferred): sin test de --motivo sin valor o antes de sala y día
Final: minor (deferred): sin test de que una anulada no sale en canceladas; el eje Spec señala que un fichero de test aparte (proceso propio) sí lo permite, así que la decisión 9 del plan se sostenía mal
Final: Ruling: el CLI `canceladas` solo ve las cancelaciones de su propio proceso (reservas en memoria) — es como funciona el proyecto y la persistencia queda fuera de la spec; se avisa al dev-lead — el motivo solo es visible dentro de un proceso hasta que haya persistencia
Final: Ruling: `cancelar` sin --motivo responde «motivo no válido» y no «falta el motivo» — lo fija la decisión 4 del plan y el Review Focus — un mensaje menos claro
Final: Ruling: --motivo antes de sala y día (`cancelar --motivo otro Norte lun`) queda fuera de la sintaxis de la spec — responde «sin reserva --motivo otro» — mensaje raro en un uso no previsto
Final: Ruling: etiqueta ADDED frente a un cambio de cómo ya se comportaba cancelar, y la decisión 2 ausente de la spec — la spec está aprobada y no hay registro de capacidades; no se toca — la spec queda con un hueco de numeración

Minor diferidos: 3: anulada fuera de canceladas sin test, «no cancela» solo comprobado por el test siguiente, --motivo sin valor o desordenado sin test.
Gate: `node --test && node scripts/lint.mjs` → 9/9 tests, lint sin hallazgos

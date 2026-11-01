---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-01
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo de la lista | done | 2d7aa4b | |
| 2 | Listado de canceladas con su motivo | done | fd7d14f | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `node --test test/cancel.test.js` → `ℹ fail 0`

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, limpia · Arquitectura opus+high, con arreglos, sobre fd7d14f
Pasada de fix: revisado en el hilo, 2 Important de documentación (operations.md sin `npm ci`; Se prueba en la aplicación de la Task 2) y 1 referencia del Review Focus

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Ruling: .temp ya está ignorado en el repo, así que el .gitignore de la Task 1 solo lleva `node_modules/` — sin coste si me equivoco.
- Final: minor (deferred): tests de canceladas acoplados al orden de ejecución por el estado compartido (test/cancel.test.js)
- Final: minor (deferred): requestCancel recibe room/day/params redundantes y calcula indexOf antes de saber si existe el flag (src/app.js)
- Final: minor (deferred): package.json queda en JSON compacto y sin salto final
- Final: minor (deferred): el diff de test/cancel.test.js reescribe finales de línea (CRLF/LF) en tests que no cambian
- Final: minor (deferred): package-lock.json lleva "name": "repo" porque package.json no tiene name
- Final: minor (deferred): la invariante de la lista cerrada vive en requestCancel (adaptador) y no en cancelBooking, que es export y guarda cualquier reason
- Final: minor (deferred): REASONS se exporta como array mutable (Object.freeze)
- Final: minor (deferred): package.json sin "name" (el lock deriva "repo") — repetido del eje Código
- Final: Ruling: canceladas por terminal responde vacío (cada `node src/app.js` es un proceso nuevo y las reservas viven en memoria, como dice operations.md) — la spec no pide persistencia y pedirla sería una enmienda; se corrige la frase «Se prueba en la aplicación» de la Task 2 y se avisa al dev-lead en la validación — si me equivoco, cancelar no deja rastro entre ejecuciones y hace falta una feature de persistencia
- Final: minor (deferred): cancelar sin motivo no afirma que la reserva siga activa (añadir assert de canceladas vacío)
- Final: minor (deferred): «solo salen las canceladas, no las anuladas» sin test (una sola reserva en memoria)
- Final: Ruling: Gate fresco `node --test && node scripts/lint.mjs` → 10/10, lint limpio; las líneas complete del ledger traen `ℹ duration_ms` por el comando de task done, el `ℹ fail 0` se leyó en la ejecución directa de cada task — si me equivoco, solo cambia el texto de las líneas

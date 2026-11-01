---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 8a38e3c | |
| 2 | Listado de canceladas | done | 69f507f | |

Revisión final: Spec opus+high, listo · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 69f507f
Pasada de fix: 44bcaf0, 1 hallazgo RED→GREEN
Re-revisión: 69f507f..c021117, sdd-kit:effort-high + opus, aprobada

## Rulings

Sin rulings.

## Deferred minors

- El test `canceladas` depende de que `cancelar` se haya ejecutado antes (`test/cancel.test.js:13`).
- El test `cancelar recorta los espacios del motivo` solo comprueba el recorte de forma indirecta (no mira el motivo guardado ni mostrado).

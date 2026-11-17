---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-31
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 33d9db3 | |
| 2 | Listado de canceladas | done | 3ee233b | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Revisión

Revisión final: autorrevisión del autor por ejes (sin herramienta de subagentes), Spec: 1 decisión para el dev-lead · Código: sin Critical ni Important, 4 minors · Arquitectura no (sin señales), sobre 3ee233b

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 1: Ruling: el test previo «cancelar una reserva activa» pasa a llevar --motivo — el AND «sin --motivo» de la spec lo contradice tal cual — si es erróneo: revertir una línea de test
- Task 1: Ruling: la reserva se busca antes de validar el motivo, así «cancelar Sur mar» sigue respondiendo «sin reserva Sur mar» como hoy (no es salida nueva; test previo intacto) — si es erróneo: invertir dos líneas y cambiar ese test
- Task 2: Ruling: `canceladas` sin canceladas imprime una línea vacía, sin texto nuevo — el Approach dice que lista las canceladas y `libres` hace lo mismo con cero salas; inventar «sin canceladas» sería salida que la spec no da — si es erróneo: una línea y su test
- Task 2: Ruling: varias filas irían una por línea — hoy es inalcanzable (solo existe una reserva en el almacén) — si es erróneo: cambiar el separador
- Final: Ruling: Eje Arquitectura decidido al revisar: no — ni módulo, ni dependencia, ni contrato entre módulos, ni datos en el diff — si es erróneo: una pasada más
- Final: Ruling: `canceladas` en la CLI real sale siempre vacío, porque el almacén vive en memoria y cada proceso arranca con la reserva activa; el THEN se cumple solo dentro de un mismo proceso. Persistir cambia el Scope y solapa con 0014: no lo arreglo y lo pregunto al dev-lead — si es erróneo: la función no sirve desde la terminal hasta 0014
- Final: minor (deferred): test/cancel.test.js cambió de CRLF a LF y su diff sale entero
- Final: minor (deferred): los tests de test/cancel.test.js dependen del orden porque comparten el estado del módulo
- Final: minor (deferred): ningún test fija que una anulada no salga en `canceladas`; con una sola reserva no se puede preparar
- Final: minor (deferred): `--motivo` antes de sala y día rompe los posicionales; la spec solo da la forma con sala y día primero

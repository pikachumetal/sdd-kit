---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, 81d24e9): lista cerrada `reasons` (cambio de planes, sala ocupada, otro); `cancelar <sala> <día> --motivo <motivo>` valida el motivo antes de buscar la reserva, lo guarda en la reserva y responde «cancelada Norte lun (sala ocupada)»; fuera de la lista o sin `--motivo`, «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`src/app.js`, 34f2c3e): comando `canceladas`, una línea por reserva cancelada, «Norte lun — sala ocupada».
- **Pasada de fix de la revisión final** (`test/cancel.test.js`, fac2a2f): tests de «sin `--motivo`» y de «sin reserva» con motivo válido.
- **Capacidades**: `capabilities/bookings.md`, nueva, con los dos requisitos ADDED.

## 2. Tiempo y coste: estimado vs real

> Lo completa `sdd-archive`.

## 3. Desviaciones del plan

- `tasks.md` no se escribió antes de la Task 1; se escribió en el cierre.
- La pasada de fix de la revisión final añadió dos tests que el plan no listaba.

### Decisiones tomadas sin el dev-lead

- El eje Arquitectura no sube por la señal «datos» — la spec ya la nombra y el campo `reason` vive en memoria en el único módulo — si está mal, una frontera de datos queda sin revisor de arquitectura.
- `tasks.md` escrito en el cierre — faltó antes de la Task 1 — el ledger y `git log` cubren las dos tasks.
- `bookings` pasa de «Modificadas» a «Nuevas» en el bloque Capacidades de la spec (sin aprobar) — no existía `capabilities/bookings.md` y `sdd capability merge` lo exige; el requisito se queda ADDED — si está mal, la ruptura de `cancelar Norte lun` sin motivo (antes cancelaba, ahora se rechaza) queda sin su «antes:».
- Las líneas que los ejes dejaron sin juzgar quedan como están: sin persistencia entre ejecuciones de la CLI, `--motivo` de varias palabras sin comillas, salto de línea entre canceladas, anuladas fuera de `canceladas` (0011), estado mutable del módulo, orden de las comprobaciones, cambio de los tests originales, E2E no declarados.

## 4. Verificación

> Lo completa `sdd-archive` (gate, smoke por THEN y validación).

### 4.3 Residuales / deuda generada

- Minors aplazados de la revisión final: el test de motivo inválido no usa el GIVEN de Norte lun; el test de `canceladas` depende del estado del primer test; `canceladas` vacío imprime una línea vacía; `--motivo` se busca en cualquier posición pero sala y día van por posición; la spec numera sus decisiones 1 y 3.

## 5. Aprendizajes

> Lo completa `sdd-archive` con la retro.

---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …» (9ad2c80).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (c2bf659).
- `capabilities/bookings.md` — capacidad nueva con los dos requisitos.
- Deuda saldada: «El motivo de cancelar no se valida» (entera); «Los motivos no se traducen», solo el castellano (queda lo del inglés).

## 3. Desviaciones del plan

- _Ninguna_ en tasks ni ficheros.

### Decisiones tomadas sin el dev-lead

- Spec: sin review de spec (dos señales: MODIFIED, datos) — decisión 3 de «Decisiones que he tomado yo» de la spec — coste si está mal: un hueco de la spec que se ve tarde.
- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.
- Cierre: la revisión final (Spec y Código, limpias) fue sobre c2bf659 y `HEAD` se movió con un commit de solo `tasks.md` (17 líneas, el registro de esa misma revisión, dentro de la carpeta que el paquete de revisión excluye); no lancé la re-revisión porque su paquete sería vacío — sin revisar: el commit de `tasks.md` con la línea de la revisión.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5, 0 fallos, 0,8 s.
- Gate: `node --test --test-concurrency=1` → corrió 5/5 · 0,8 s · configuración: la del gate de la constitution más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre c2bf659; el commit posterior de `tasks.md` sin re-revisar (ver §3). No probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo xyz` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | cancelar y `canceladas` en un mismo proceso (el almacén es en memoria) → `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y solo son estables en serie: fila nueva en «Por triar» de `debt.md`.
- Los motivos siguen sin traducir al inglés: la fila de deuda se queda, reescrita a lo que falta.

## 5. Aprendizajes

- La lista de motivos es cerrada y la cancelación sin motivo se rechaza → `capabilities/bookings.md`.
- El workaround de `--test-concurrency=1` no está en `tech-stack.md` ni en `operations.md`: vive solo en el gate de este cierre y en su fila de deuda.

Retro: documento o skill desmentido → ticket del kit: final-review-check.md manda re-revisar un commit posterior de solo documentación (<20 líneas), pero el único que deja el hilo es el de tasks.md con la propia línea de la revisión, que el paquete de encargo-revision.md excluye: la re-revisión recibiría un paquete vacío

## 6. Adendas


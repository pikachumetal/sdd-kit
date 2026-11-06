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

- **Cancelar con motivo** (Task 1, 36d40d9): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, e496a39): comando `canceladas`, una línea «<sala> <día> — <motivo>» por reserva cancelada. `src/app.js`, `test/cancel.test.js`.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), mezclada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. En `tasks.md` la fila de la Task 1 citaba e496a39 y su commit real es 36d40d9; corregido en el cierre.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No está aplicado**: `gate.json` y el resto del repo no llevan la opción, y la suite pasa sin ella; la carrera queda como deuda.

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec (opus+high) y Código (sonnet+high), limpias, sobre e496a39. `HEAD` se movió después solo con un commit que añade `tasks.md` con el registro de esa revisión: la receta del paquete excluye la carpeta de la feature, así que una re-revisión habría recibido un diff vacío. sin revisar: el commit que añade `tasks.md` (juntado en el cierre) — solo `tasks.md` con el registro de la revisión final.
- Suite: `develop` trae un commit que la rama no tiene, así que corre una sola vez, sobre la fusión de sincronización (`node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`). Su línea `Gate:` y su sha van en el mensaje final del cierre, porque este fichero entra en el commit de cierre.

### 4.2 Smoke / tests

Validación en campo: 2026-11-05 · smoke 4/4 THEN con ejecución real, corrido por el agente comando a comando sobre el código de la rama (el `canceladas` en un único proceso: por la CLI en dos invocaciones sale vacío, ver 4.3) · suite sobre la fusión de sincronización, ver 4.1 · revisión final Spec y Código limpia sobre e496a39. El borrador anterior de esta línea (2026-10-26) probaba `--motivo sala-ocupada`, que responde «motivo no válido»: no es el valor de la spec y queda sustituido.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo vacaciones`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` tras cancelar con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real, un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- `node src/app.js canceladas` en un proceso aparte, tras un `cancelar` previo, responde vacío: las reservas viven en memoria y no sobreviven entre invocaciones. Lo cubre la 0014 (Motivo guardado), ya en el roadmap.
- Los tests comparten el almacén de reservas en memoria y compiten entre sí (la carrera del ruling de arriba): fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- Cancelar pide un motivo de una lista cerrada y `canceladas` lo enseña → `capabilities/bookings.md`.
- Los tests comparten el almacén en memoria y compiten; no hay documento vivo donde ese hecho encaje → fila de deuda técnica del roadmap.

Retro: documento o skill desmentido → el borrador de «Validación en campo» (probaba `sala-ocupada`, que la CLI rechaza) y la fila de la Task 1 de `tasks.md` (citaba el commit de la Task 2) se corrigieron en su propio documento (`walkthrough.md`, `tasks.md`)

## 6. Adendas

- _Ninguna._

---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo (Task 1, `ce78b3a`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (`cambio de planes`, `sala ocupada`, `otro`) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- Listado de canceladas (Task 2, `69e627e`): el comando `canceladas` lista «sala día — motivo». `src/app.js`, `test/cancel.test.js`.
- Cierre: capacidad `bookings` creada con `sdd capability merge`, changelog, roadmap y una fila de deuda.

## 3. Desviaciones del plan

- _Ninguna_ en alcance. El plan decía «Gate de cierre: `node --test`»; el cierre corrió el gate del proyecto (`scripts/gate.mjs`).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. ✋ El ruling consta en `tasks.md`, pero el flag no está en `gate.json` ni en ningún otro fichero de la rama: o no llegó a aplicarse o se deshizo. La carrera sigue sin resolver y va a la deuda.
- Sin review de spec: dos señales (MODIFIED, datos) — decisión 3 de la spec.
- ✋ Sin revisar: `19b01bb` — solo cambia `tasks.md` (17 líneas, el registro de la propia revisión final, hecha sobre `69e627e`); el código no cambia entre `69e627e` y `HEAD`.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre `19b01bb`.

### 4.2 Smoke / tests

Verificado por el agente en el cierre (sobre `19b01bb`), sin intervención del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo sala-ocupada` y `--motivo "me aburro"`) | ok |
| sin `--motivo` → el mismo «motivo no válido: …» | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real vía `run()` en un solo proceso (cancelar y luego `canceladas`) + `test/cancel.test.js` | ok |

Validación en campo: 2026-10-29 · gate verde sobre 19b01bb · smoke 4/4 THEN con ejecución real (la salida de `canceladas` en el mismo proceso que `cancelar`: ver 4.3) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 69e627e; `19b01bb` solo toca `tasks.md`.

### 4.3 Residuales / deuda generada

- Por CLI, `canceladas` en un proceso aparte no ve lo cancelado en otro: el almacén de reservas vive en memoria. Lo cubre la 0014 (**Motivo guardado**), ya en el roadmap; el THEN de la spec se cumple dentro de un proceso.
- Tests con carrera sobre el almacén en memoria compartido y el workaround de la Task 2 → fila en «Deuda técnica» del roadmap.

## 5. Aprendizajes

- Cambio de comportamiento observable → capacidad `bookings` (nueva, fusionada con `sdd capability merge`).
- El almacén compartido en memoria obliga a serializar los tests → deuda del roadmap; sin destino estructural (el proyecto no tiene `architecture.md`).
- Skills: el proyecto no tiene `.claude/skills/`; no aplica, comprobado.

ADR: ninguna candidata en la spec; `decision check` sin decisiones.

---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Commit 9fdae81.
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas. Commit c2d8a5d.
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado).
- Capacidad nueva `capabilities/bookings.md`, fusionada desde la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. El plan fija el gate de cierre `node --test`; la ejecución usó `--test-concurrency=1` (ruling de abajo).

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Fila en la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → corrió 5/5, 0 fallos · 1 s · configuración: la del ruling · sobre 0d31a0f (el commit de cierre junta los commits de documentación posteriores; el código es el mismo). Verificado por el agente en el cierre. Sin `--test-concurrency=1`, `node --test` también da 5/5.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke con ejecución real de los 5 THEN (un proceso `node` por comando para cancelar y en un mismo proceso para `canceladas`) · revisión final Spec (opus+high) y Código (sonnet+high) limpia sobre c2d8a5d; la arquitectura no se revisó (el plan no declara foco). Entre c2d8a5d y el cierre solo cambian documentos (tasks.md, tech-stack.md). Nadie del equipo lo ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite · ejecución real | verificado por el agente |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real (`--motivo "me aburro"`) | verificado por el agente |
| sin `--motivo` → el mismo mensaje | ejecución real | verificado por el agente |
| `canceladas` → «Norte lun — sala ocupada» | suite · ejecución real en un mismo proceso | verificado por el agente; **no** como dos invocaciones separadas del CLI (ver 4.3) |

### 4.3 Residuales / deuda generada

- El almacén de reservas es en memoria: en la CLI real, `salas canceladas` en un proceso aparte de `salas cancelar` responde vacío. El THEN de la spec solo se cumple dentro de un proceso. Lo cubre la fila 0014 «Motivo guardado» del roadmap; no se abre otra.
- Los tests comparten el almacén en memoria y dependen del orden (el de `canceladas` usa la cancelación del primero): deuda abierta, junto al workaround `--test-concurrency=1`.
- `tech-stack.md` de la rama decía que había una dependencia `slot-format`; no existe (ni en `package.json` ni en el código). Corregido en el cierre a «sin dependencias externas».

## 5. Aprendizajes

- El workaround `--test-concurrency=1` y los tests acoplados al orden → deuda técnica del roadmap.
- La spec habla de "listado" sin decir que el almacén no persiste → fila 0014 del roadmap.
- Revisión de skills: `.claude/skills/` no existe en el proyecto; no hay skill que actualizar y el trabajo no revela un patrón reutilizable → no aplica.
- Sin ADR candidatas en la spec; no hay `architecture.md` y no hubo aprendizaje estructural.

## 6. Adendas

- (ninguna)

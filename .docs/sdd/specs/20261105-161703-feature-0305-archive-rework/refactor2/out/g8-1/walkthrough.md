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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, 85af88d): el motivo es de la lista cerrada «cambio de planes, sala ocupada, otro»; uno fuera de la lista, o sin `--motivo`, responde «motivo no válido: …». La reserva cancelada guarda su motivo.
- `canceladas` (`src/app.js`, `test/cancel.test.js`, fe70a80): lista «sala día — motivo» de las reservas con estado cancelada.
- Cierre: capacidad `bookings` (nueva), entrada del changelog, fila del roadmap y una fila de deuda.

## 3. Desviaciones del plan

- _Ninguna_ en lo que el plan fija (dos tasks, Native). El plan no preveía el workaround de abajo.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. El flag no está en `gate.json` ni en la constitution: el gate del repo no lo lleva. Pasa a deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa, vuelta a ejecutar en el cierre por el agente: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 0,7 s.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (sus inputs no cambian) · 0,7 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke por THEN (`node src/app.js cancelar Norte lun --motivo "sala ocupada"`) y suite en verde sobre el commit de cierre

Verificado por el agente en el cierre (2026-11-05), todo con ejecución real salvo lo marcado. Revisión final de Spec y Código limpia sobre fe70a80; el único commit posterior, el de `tasks.md` (`tasks.md`, 17 líneas, solo documentación), revisado en el hilo, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) + suite | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI) + suite | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real (CLI); sin test | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un proceso (`run` de `cancelar` y luego de `canceladas`) + suite; por CLI en un proceso aparte, no probado | `Norte lun — sala ocupada`; por CLI aparte sale vacío (almacén en memoria) |

### 4.3 Residuales / deuda generada

- `canceladas` lanzado como comando aparte sale vacío: el almacén es en memoria y no sobrevive entre procesos. Lo cubre la 0014, «Motivo guardado» (ya en el roadmap).
- «Sin `--motivo`» no tiene test que lo fije: lo cubre solo el smoke. Fila de deuda.
- El workaround `--test-concurrency=1` y la carrera de los tests sobre el almacén compartido: fila de deuda.

## 5. Aprendizajes

- La lista cerrada de motivos y los mensajes de `cancelar` y `canceladas` son comportamiento observable → `capabilities/bookings.md`, con `sdd capability merge`.
- Los tests comparten un almacén en memoria y corren en carrera → deuda técnica del roadmap, no `tech-stack.md`: el repo no lleva el workaround.

Retro: documento o skill desmentido → ticket del kit: `final-review-check.md` de `sdd-archive` manda despachar la re-revisión ante un commit posterior de menos de 20 líneas y solo documentación, y `sdd-verify` («The single re-review») y `sdd-implement` («Every commit of yours») mandan revisarlo en el hilo y no despacharla; el cierre siguió a `sdd-verify`.

## 6. Adendas

- _Ninguna_

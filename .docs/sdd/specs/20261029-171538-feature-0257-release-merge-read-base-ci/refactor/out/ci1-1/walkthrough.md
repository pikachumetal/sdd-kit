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

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`, 2aec50b): `cancelar <sala> <día> --motivo <motivo>` acepta solo la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella, o sin `--motivo`, responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`, 28633c1): `canceladas` enseña «sala día — motivo».
- Capacidad `bookings` creada con `sdd capability merge` (2 requisitos).

## 3. Desviaciones del plan

- _Ninguna_ en alcance. Una en el comando del gate (ver abajo).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre. También en verde con `--test-concurrency=1` (5/5) y `test/cancel.test.js` solo (3/3).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificación del agente: suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 28633c1; Arquitectura no (plan); HEAD posterior solo toca `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) + suite | OK |
| motivo fuera de la lista y sin `--motivo` responden «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI, los dos casos) + suite | OK |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en el mismo proceso + suite; **por CLI, en procesos separados, sale vacío** | OK en proceso; ver 4.3 |

### 4.3 Residuales / deuda generada

- El almacén de reservas vive en memoria: dos invocaciones de la CLI no comparten estado, así que `canceladas` por CLI no ve una cancelación hecha en otra invocación. La spec no lo cubre; lo cubre la 0014 «Motivo guardado» (ya en el roadmap).
- El test de `canceladas` depende del estado que deja el test de `cancelar` (orden de ejecución): fila de deuda en el roadmap, junto al workaround de `--test-concurrency=1`.

## 5. Aprendizajes

- Los tests comparten un almacén en memoria y se acoplan por orden → fila de deuda en `roadmap.md` (no hay `architecture.md` ni `operations.md` que lo recojan; no se inventa uno).
- Skills: el proyecto no tiene `.claude/skills/`; no aplica, mirado.

## 6. Adendas

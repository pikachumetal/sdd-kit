---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; comando `canceladas` (c8f9f35, 10b72df).
- `test/cancel.test.js`: pruebas del motivo y del listado.
- Capacidad `bookings`: dos requisitos añadidos con `sdd capability merge`.

## 2. Tiempo y coste

- Esfuerzo real: 0,01 h — reloj de la sesión de cierre 0,01 h desde 2026-11-01T12:31Z, sin 0 min de espera al dev-lead (0 esperas)
- Tokens del hilo: 494.833 — claude-sonnet-5-5 494.833
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Fila de deuda abierta en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → se ejecuta en el cierre, sobre la integración con la base (paso 6); su línea `Gate:` va en el mensaje final, porque este fichero va en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · verificación del agente: smoke de 4 THEN con ejecución real (CLI y módulo), revisión final de Spec y Código limpia sobre c8f9f35; la suite corre en el paso 6. Nada probado por el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo nada`) | ok |
| Sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en el mismo proceso, el almacén es en memoria) | ok |

### 4.3 Residuales / deuda generada

- El almacén de reservas es en memoria y compartido entre tests: obliga a `--test-concurrency=1` (fila de deuda).

## 5. Aprendizajes

- El almacén en memoria hace que un comando suelto no vea lo cancelado por otro proceso: el listado solo se verifica en un mismo proceso → deuda del roadmap (almacén por test / persistencia).

## 6. Adendas

- (ninguna)

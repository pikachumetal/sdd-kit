---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva — `src/app.js`, `test/cancel.test.js` (40e9901).
- Comando `canceladas`: una línea «sala día — motivo» por reserva cancelada — `src/app.js`, `test/cancel.test.js` (ff8c650).
- Capacidad `bookings` creada con el delta de la spec (`capabilities/bookings.md`).

## 2. Tiempo y coste

- Tipo: backend
- Estimación de implementación (del plan): no declarada (el proyecto no tiene `estimation.md`)
- Tokens del hilo: 325.861 — claude-sonnet-5-5 325.861
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-16T12:40Z, sin 0 min de espera al dev-lead (1 espera) *(solo la sesión del cierre; la implementación fue en otra)*
- Review de spec: no · dos señales (MODIFIED, datos) según la spec

## 3. Desviaciones del plan

- El gate de la task 2 corre `node --test --test-concurrency=1`; el plan decía `node --test`.

### Decisiones tomadas sin el dev-lead

- Gate con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén compartido en memoria — la suite tarda el doble. Es un workaround hasta aislar el almacén por test: tiene fila en la deuda técnica.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 en verde · 0,1 s, sobre a4169b2; también con `--test-concurrency=1` → 5/5 · 0,2 s.

### 4.2 Smoke / tests

Validación en campo: 2026-10-16 · suite 5/5 · smoke 3/4 THEN con ejecución real, 1 solo por suite · revisión final Spec y Código sobre ff8c650 limpia, Arquitectura no (plan); a4169b2 solo añade `tasks.md`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real (`node src/app.js …`) | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real (la suite no lo cubre) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite · no probado por CLI: cada llamada es un proceso nuevo con el almacén en memoria y `canceladas` sale vacío | solo en la suite |

### 4.3 Residuales / deuda generada

- El listado `canceladas` no ve nada entre dos llamadas del CLI porque el almacén no persiste: lo cubre la fila 0014 «Motivo guardado» del roadmap.
- Falta un test del caso «sin `--motivo`» (solo verificado a mano).
- Workaround `--test-concurrency=1`: fila en la deuda técnica.

## 5. Aprendizajes

- El almacén compartido en memoria obliga a serializar los tests → deuda técnica del roadmap (aislar el almacén por test).
- Revisión de skills: no aplica; `.claude/skills/` no existe en el proyecto y esta feature no revela un patrón reutilizable.

## 6. Adendas

- (ninguna)

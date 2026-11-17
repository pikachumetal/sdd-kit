---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-27
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — eb97347 (Task 1).
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>». `src/app.js`, `test/cancel.test.js` — 19b5300 (Task 2).
- Capacidad `bookings` creada con los dos requisitos de la spec (`capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. `tasks.md` apuntaba la Task 1 al commit de la Task 2; corregido a eb97347.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre 19b5300 (verificado por el agente; el commit posterior solo cambia `tasks.md`).
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base 19b5300` → bookings:test: saltada (la base solo tocó `test/rooms.test.js`, que no es entrada suya) · rooms:test: corrió, 2 passed, 0 failed · configuración: la del gate · sobre 8c3474e (integración de `develop`).
- Revisión final: Spec (opus + high) y Código (sonnet + high) limpias sobre 19b5300; Arquitectura no, por el plan. El commit posterior, solo documentación (17 líneas), no se revisó aparte.

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke por THEN (`node src/app.js cancelar Norte lun --motivo sala-ocupada`) y suite en verde sobre 19b5300

Evidencia dicha tal cual: la validación fue del agente en campo; el dev-lead no aportó frase propia.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite + ejecución real | ok |
| Motivo fuera de la lista responde «motivo no válido: …» | suite | ok |
| Sin `--motivo` responde «motivo no válido: …» | no probado (ni test ni ejecución real; el código lo cubre: `reasonOf` devuelve `undefined`) | pendiente |
| `canceladas` responde «Norte lun — sala ocupada» | suite | ok |

### 4.3 Residuales / deuda generada

- El workaround `--test-concurrency=1` pasa a la deuda técnica del roadmap.
- Falta un test del THEN «sin `--motivo`».

## 5. Aprendizajes

- Los tests comparten estado en memoria y no se pueden paralelizar → deuda técnica del roadmap (aislar el almacén por test).
- Revisión de skills: `.claude/skills/` no existe en el proyecto y el trabajo no reveló un patrón reutilizable → no aplica.
- ADR: la spec no declara ninguna candidata.

## 6. Adendas

- _Ninguna._

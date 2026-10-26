---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (38580c4).
- Comando `canceladas`: lista las reservas canceladas con su motivo — `src/app.js`, `test/cancel.test.js` (08eeb39).
- Capacidad `bookings` creada con los dos requisitos del delta (`capability merge`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Fila de deuda abierta en el roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 6/6 en verde · ~0,8 s · configuración: la del gate más `--test-concurrency=1` (ruling de la Task 2) · sha `f1b1e18`.
- Primera pasada en rojo: `test/ids.test.js` (`una reserva nueva lleva su id`), `TypeError [Error]: Cannot read properties of undefined (reading 'trim')`. Contrastada a mano: la misma orden en `develop` (`dd254fd`) en verde, y otra vez en la rama en verde → «No se repite»; fila de flaky en la deuda.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · suite 6/6 (tras el contraste del rojo de 4.1) · smoke 6/6 THEN con ejecución real (`node src/app.js` y `run()` en un solo proceso para encadenar cancelar y canceladas) · revisión final de Spec y Código limpia sobre 08eeb39; HEAD solo añade `tasks.md` (documentación), sin re-revisión. No hay validación del dev-lead: no probado por una persona.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo xx`) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- `test/ids.test.js` falla en la primera pasada: depende de un fichero (`ids-store`) en el directorio común de git, que no existe hasta que corre una vez. Deuda (flaky).
- Almacén de reservas compartido entre tests: el gate corre en serie (`--test-concurrency=1`). Deuda (workaround).
- Revisión de spec: no hubo (dos señales: MODIFIED, datos), decidido en la spec.

## 5. Aprendizajes

- Ninguno que pida un destino en los docs vivos. El proyecto no tiene `.claude/skills/` (revisado): skills, no aplica.

## 6. Adendas


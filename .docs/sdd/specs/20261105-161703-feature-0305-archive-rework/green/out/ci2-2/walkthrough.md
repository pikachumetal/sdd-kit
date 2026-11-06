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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, d53dc76): el motivo es obligatorio y de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro». Cancelar guarda el motivo con la reserva.
- Comando `canceladas` (`src/app.js`, 071b15a): lista cada reserva cancelada como «<sala> <día> — <motivo>».
- Tests en `test/cancel.test.js` (d53dc76, 071b15a).
- Cierre: capacidad `bookings` creada con el delta de la spec; fila de la 0010 en el roadmap; entrada en el changelog.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Fila de deuda abierta en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → corrió 5/5 · sin filtro por tareas (el proyecto no declara tareas) · <1 s · configuración: la del gate del plan, más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre (el squash junta ahí el último commit de `.docs/`; el código es el de 071b15a)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre 071b15a; lo posterior (17 líneas, solo `tasks.md`) revisado en el hilo, sin re-revisión · no probado: que el motivo sobreviva entre dos procesos (el almacén es en memoria; es el alcance de la 0014)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `--motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un solo proceso (cancelar y luego `canceladas`) → «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- El almacén de reservas es en memoria: `canceladas` solo ve lo cancelado en el mismo proceso. Ya está en el roadmap como 0014.
- Los tests comparten el almacén en memoria y corren en serie por el ruling de la Task 2: deuda abierta en el roadmap.

## 5. Aprendizajes

- La lista de motivos es cerrada y la valida `cancelBooking` → `capabilities/bookings.md`.
- Workaround `--test-concurrency=1` → fila de deuda del roadmap (no se escribe en `tech-stack.md`: lo que declara el gate es el del plan).

Retro: sin señales

## 6. Adendas

- (ninguna)

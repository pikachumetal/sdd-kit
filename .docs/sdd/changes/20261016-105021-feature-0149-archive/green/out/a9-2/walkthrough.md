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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (3e66c5b).
- `canceladas` lista las reservas canceladas con su motivo: `src/app.js`, `test/cancel.test.js` (116da58).
- Capacidad `bookings` creada con los dos requisitos del delta (`capabilities/bookings.md`, fusionada con `sdd capability merge`).

## 2. Tiempo y coste: estimado vs real

- El proyecto no tiene `.docs/sdd/estimation.md`: el bloque no aplica.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Pasa a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 pasan · 0,2 s · sobre 99084ad.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · verificación del agente: suite 5/5 · smoke de los 3 THEN con ejecución real (`node src/app.js …`) salvo el de «sin `--motivo`», que no tiene test en la suite y solo está verificado por ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) sobre 116da58, limpia; 99084ad solo toca `tasks.md`. El dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite + ejecución real | ok |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite + ejecución real (`--motivo xyz`) | ok |
| Sin `--motivo` responde lo mismo | ejecución real (sin test en la suite) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite + ejecución real | ok |

### 4.3 Residuales / deuda generada

- Almacén en memoria compartido entre tests y suite en serie (`--test-concurrency=1`) → `debt.md`, «Por triar».
- Los motivos en inglés siguen sin hacer → `debt.md`, «Por triar».
- Falta un test para «sin `--motivo`» (el THEN se cumple por el mismo camino que un motivo fuera de la lista).

## 5. Aprendizajes

- El `tech-stack.md` no cambia: el workaround de la concurrencia no se ha escrito allí, vive en la deuda → `steering/debt.md`.
- Sin `architecture.md` ni `.claude/skills/` en el proyecto; revisado, no hay patrón reutilizable ni skill que se desmienta → ninguno.

## 6. Adendas

- _Ninguna_

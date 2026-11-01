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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (9ad2ceb).
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>»: `src/app.js`, `test/cancel.test.js` (af249c9).
- Capacidad nueva `capabilities/bookings.md`, fusionada desde la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

- Review de spec: no (dos señales: MODIFIED, datos; decisión 3 de la spec)

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre el gate del plan, `node --test`, pasó 5/5 sin el workaround; la fila de deuda del roadmap lo deja anotado.

## 4. Verificación

### 4.1 Builds

- `node --test` (gate del plan) → 5/5 en verde, 84 ms. Con `--test-concurrency=1` también 5/5, 132 ms.
- Gate: `node --test` → suite: corrió 5/5 · 84 ms · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final (Spec opus+high, Código sonnet+high) limpia sobre af249c9; lo posterior es solo `tasks.md`. Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (con `--motivo "porque sí"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en un mismo proceso, porque el almacén es en memoria) | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El almacén de reservas en memoria se comparte entre tests y obligó al workaround de arriba: fila en la deuda técnica del roadmap.
- Entre procesos el motivo no persiste: `cancelar` y `canceladas` en invocaciones separadas no se ven. Es la fila 0014 (Motivo guardado), ya en el roadmap.

## 5. Aprendizajes

- Los tests comparten el almacén en memoria y pueden pisarse entre sí → deuda técnica del roadmap (aislar el almacén por test); no es una convención ni un cambio estructural todavía.
- El comportamiento observable (motivo obligatorio, listado con motivo) → `capabilities/bookings.md`. Skills: no hay `.claude/skills/` en el proyecto; este trabajo no revela ningún patrón reutilizable, no aplica.

## 6. Adendas


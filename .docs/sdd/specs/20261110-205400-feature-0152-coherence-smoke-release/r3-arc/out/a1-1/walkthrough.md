---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo (`1cc7c58`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y guarda el motivo con la reserva cancelada. `src/app.js`, `test/cancel.test.js`.
- Listado de canceladas (`a0a81ab`): comando `canceladas`, una línea `<sala> <día> — <motivo>` por reserva cancelada. `src/app.js`, `test/cancel.test.js`.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- Ninguna en el código. Una en el gate: ver el ruling de abajo.

### Decisiones tomadas sin el dev-lead

- Gate con `node --test --test-concurrency=1` (ruling de la Task 2, para esquivar una carrera sobre el almacén en memoria) — coste si está mal: la suite tarda el doble. **Sin efecto desde el cierre**: la re-revisión mostró que la carrera no existe (cada fichero de test corre en su proceso) y `node --test` a secas, el gate de la constitución, pasa 5/5 cuatro veces seguidas. El gate del cierre es `node --test`.
- Revisión final sin eje de Arquitectura («no (plan)»): `plan.md` no lo declara ni lo descarta; lo asumió la ejecución.
- Sin review de spec (decisión 3 de la spec): dos señales, MODIFIED y datos.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, cuatro pasadas seguidas, ~0,4 s. Con `--test-concurrency=1`, 5/5.
- Gate: `node --test` → suite: corrió 5/5 · configuración: la de la constitución · sobre el commit de cierre (el cierre solo añade `.docs/`).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 3/3 THEN con ejecución real (el listado solo dentro de un mismo proceso; entre procesos de la CLI sale vacío) · revisión final Spec y Código sobre a0a81ab, re-revisión de a0a81ab..HEAD con hallazgos corregidos en el cierre

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | «cancelada Norte lun (sala ocupada)» |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real + suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin `--motivo` responde lo mismo | ejecución real (sin test de suite) | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (`run` en un solo proceso) + suite | «Norte lun — sala ocupada»; con `node src/app.js` en procesos separados, vacío: el almacén es solo memoria; no probado de punta a punta por CLI |

### 4.3 Residuales / deuda generada

- Deuda «Por triar»: el test de `canceladas` depende de que antes corra el de `cancelar`; aislar el almacén por test.
- Deuda «Por triar»: falta el test de «sin `--motivo`».
- La persistencia del motivo entre procesos es la 0014, «Motivo guardado».

## 5. Aprendizajes

- Un ruling de la ejecución sobre el gate puede no sostenerse: se mide antes de dejarlo → `tasks.md` (corregido en su sección `## Rulings`).
- La lista de motivos y el comportamiento de `canceladas` viven en la capacidad → `.docs/sdd/capabilities/bookings.md`.

Retro: documento o skill desmentido → corregido en el mismo documento (`tasks.md`, ruling del gate)

## 6. Adendas

- Ninguna.

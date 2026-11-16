---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`, d90582f).
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>» (`src/app.js`, `test/cancel.test.js`, fe3592b).
- Spec aprobada (`status: approved`, aprobación de Laura, dev-lead, 2026-10-08), modo `full`.

## 2. Tiempo y coste: estimado vs real

- El proyecto no tiene `.docs/sdd/steering/estimation.md`: no se mide el tiempo.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Anotado en la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre fe3592b; Arquitectura no (plan). HEAD solo movió `tasks.md` (documentación): sin re-revisión.
- Gate y suite: corren una vez en la fusión de sincronización del paso 6 (hay otra rama abierta, `feature/0011-others`, y `develop` va por delante); su línea `Gate:` y su sha van en el mensaje final, porque este fichero va en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real (CLI `node src/app.js` y, para `canceladas`, un único proceso, porque las reservas viven en memoria hasta la 0014) · suite en el paso 6 · revisión final Spec y Código limpias sobre fe3592b.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ✅ |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) + suite | ✅ |
| sin `--motivo` responde lo mismo | ejecución real (la suite no lo cubre) | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso tras cancelar) + suite | ✅ |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ver ruling de la Task 2) → fila en «Por triar» de `debt.md`.
- El THEN «sin `--motivo`» no tiene test automático.

## 5. Aprendizajes

- Las reservas viven en memoria: `canceladas` solo ve lo cancelado en el mismo proceso hasta la 0014 → ya dicho en el Approach de la spec y en la capacidad `bookings`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

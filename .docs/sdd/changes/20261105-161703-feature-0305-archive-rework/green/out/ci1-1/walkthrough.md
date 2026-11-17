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

- `cancelar <sala> <día> --motivo <motivo>` pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro). Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: …». El motivo se guarda con la reserva cancelada. `src/app.js`, `test/cancel.test.js` — `672489a`.
- `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada»). `src/app.js`, `test/cancel.test.js` — `baa9d12`.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén en memoria — coste si es erróneo: la suite tarda el doble. En el cierre se comprobó que el flag no hace falta ni llegó al gate (`plan.md` y la CI corren `node --test`, que pasó 5/5 veces seguidas): cada fichero de test corre en su propio proceso.
- Cierre: la fila de la Task 1 de `tasks.md` citaba `baa9d12`, el commit de la Task 2; la corregí a `672489a`, que es el suyo.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → 5/5 tests pasan, 0 fallos · 0,2 s · configuración: la del gate (`plan.md` §3) · sobre el commit de cierre (el árbol de código es el mismo que el de la revisión final, `baa9d12`; después solo hay documentación).
- Revisión final: Spec (opus, high) y Código (sonnet, high) sobre `baa9d12`, limpias. Re-revisión del tramo posterior a `baa9d12` (opus, high): dos hallazgos, ambos sobre `tasks.md` y corregidos en este cierre (el hash de la Task 1, Important; la nota del flag del Ruling, Minor).

### 4.2 Smoke / tests

Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real (`run` importado en un proceso nuevo, un solo proceso para que el almacén en memoria compartido conserve la reserva) · revisión final Spec y Código sobre `baa9d12`, re-revisión con dos hallazgos de `tasks.md` corregidos. No probado: nada de la spec.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | correcto |
| un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | correcto |
| sin `--motivo` responde lo mismo | ejecución real | correcto |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | correcto |

### 4.3 Residuales / deuda generada

- Cada invocación de la CLI es un proceso nuevo y el almacén vive en memoria: `canceladas` lanzado por separado de `cancelar` sale vacío. Está cubierto por la fila 0014 del roadmap («Motivo guardado»); no se abre fila nueva.
- El camino «sin `--motivo`» tiene THEN en la spec pero ningún test en `test/cancel.test.js`; lo cubre el smoke de este cierre. Sin deuda nueva.

## 5. Aprendizajes

- Capacidad nueva `bookings`: el comportamiento de cancelar con motivo y del listado → `.docs/sdd/capabilities/bookings.md`.

Retro: documento o skill desmentido → el Ruling de `tasks.md` decía que el flag evitaba una carrera entre tests que no existe; corregido en el mismo documento (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)
Retro: error que cazaría un chequeo → ticket del kit: `tasks.md` llegó al cierre con el hash de la Task 1 igual al de la Task 2; solo lo cazó la re-revisión, y un chequeo de que cada commit citado en la tabla toca los ficheros de su task lo habría cazado

## 6. Adendas

- Ninguna.

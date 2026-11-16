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

- Cancelar con motivo (`e30ce83`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y responde «cancelada <sala> <día> (<motivo>)»; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Ficheros: `src/app.js`, `test/cancel.test.js`.
- Listado de canceladas (`c58f1f2`): el comando `canceladas` lista «<sala> <día> — <motivo>». Ficheros: `src/app.js`, `test/cancel.test.js`.
- Capacidad `bookings` creada con `sdd capability merge`: dos requisitos ADDED.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).
- Sin review de spec: dos señales (MODIFIED, datos) — decisión del agente de la spec, listada en «Decisiones que he tomado yo».

## 4. Verificación

### 4.1 Builds

- La suite y el gate de cierre corren una vez sobre el sync merge del paso 6 (hay otra rama abierta, `feature/0011-others`); su línea `Gate:` y su sha van en el mensaje final, porque el walkthrough ya está en el commit de cierre.
- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia sobre `c58f1f2`; `HEAD` solo añadió `tasks.md`, sin nueva revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real; suite en el sync merge (ver el mensaje final); revisión final Spec y Código limpia sobre `c58f1f2`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`run` en proceso) | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`node src/app.js cancelar Norte lun --motivo "me aburro"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y `canceladas` en el mismo proceso) | ok |
| el estado entre dos invocaciones de la CLI | no probado: las reservas viven en memoria; `canceladas` en un proceso nuevo sale vacío (lo cubre la 0014) | no probado |

### 4.3 Residuales / deuda generada

- Los tests de `canceladas` dependen del orden: fila en «Por triar» de `debt.md`.
- Las cancelaciones no persisten entre invocaciones de la CLI: ya es la 0014 «Motivo guardado», sin fila nueva.

## 5. Aprendizajes

- Cada THEN sobre la salida de la CLI se verifica con ejecución real; con estado en memoria, cancelar y listar van en el mismo proceso → este walkthrough (4.2).

Retro: sin señales

## 6. Adendas

- _Ninguna_

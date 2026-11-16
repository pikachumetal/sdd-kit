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

- **Cancelar con motivo** (Task 1, `5c63bad`): `cancelar <sala> <día> --motivo <motivo>` guarda el motivo con la reserva cancelada. La lista es cerrada: cambio de planes, sala ocupada, otro. Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `4438bfe`): el comando `canceladas` lista las reservas con estado cancelada como «Norte lun — sala ocupada». Ficheros: `src/app.js`, `test/cancel.test.js`.
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- El proyecto no tiene `.docs/sdd/steering/estimation.md`: no hay estimación contra la que medir y no se mide el tiempo real.
- Review de spec: no (decisión de la spec: dos señales, MODIFIED y datos) · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5/5 en verde, 1 s.
- Gate: `node --test` → suite: corrió 5/5 · 1 s · configuración: la del gate · sobre el commit de cierre (el cierre junta el último commit de docs; el código es el de `4438bfe`)
- Revisión final: Spec (opus, high) limpia · Código (sonnet, high) limpia · Arquitectura no (plan), sobre `4438bfe`. Después solo hay un commit de `tasks.md` (17 líneas, solo documentación), revisado en el hilo y juntado en el cierre; no hay re-revisión ni nada sin revisar.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real (el último, en un solo proceso: ver 4.3) · revisión final de Spec y Código limpia sobre `4438bfe`, sin hallazgos que arreglar ni re-revisión

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real, con `--motivo "me aburro"` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real, `cancelar Norte lun` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real de `cancelar` y `canceladas` en un solo proceso (`run()` de `src/app.js`) + suite | `Norte lun — sala ocupada`; en dos invocaciones separadas de `node src/app.js`, `canceladas` sale vacío (ver 4.3) |

Todo lo anterior lo verificó el agente; nada es reportado por el usuario.

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria: cada `node src/app.js …` empieza de cero, así que `cancelar` en una invocación y `canceladas` en otra no se ven. El THEN de `canceladas` solo se cumple dentro de un proceso (la suite y la ejecución real de arriba). La fila 0014 («Motivo guardado») ya lo recoge: es el almacén de reservas. No se arregla aquí.
- Los tests de `cancel.test.js` dependen del orden (decisión de la Task 2): fila en «Por triar» de la deuda.

## 5. Aprendizajes

- Cancelar pide siempre un motivo de una lista cerrada, y `canceladas` lo enseña → `capabilities/bookings.md` (fusionado desde el delta de la spec).
- Nada estructural ni de convención nueva: `architecture.md` y `constitution.md` quedan como están.

Retro: sin señales

## 6. Adendas

- _Ninguna_

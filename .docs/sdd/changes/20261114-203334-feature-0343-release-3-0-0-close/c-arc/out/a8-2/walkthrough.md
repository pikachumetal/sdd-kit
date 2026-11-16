---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Task 1 — `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`): acepta solo la lista cerrada (cambio de planes, sala ocupada, otro); un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro». Commit `095f1c3`.
- Task 2 — comando `canceladas` (`src/app.js`, `test/cancel.test.js`): lista las reservas canceladas como «Norte lun — sala ocupada». Commit `f4433af`.
- Arreglo de la validación: el motivo se recorta (`trim`) antes de compararlo con la lista, así que `--motivo " sala ocupada "` se acepta. Lo pidió el uso real, no la spec (ver §3). Con su test, que lanza la CLI en un proceso hijo porque las reservas viven en la memoria del proceso (`test/cancel.test.js`).
- Delta de capacidad: `bookings` nace con dos requisitos, «Cancelar pide un motivo de la lista» y «El listado de canceladas enseña el motivo» (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_ respecto a las tasks del plan. Sí hubo un commit de código tras la revisión final (el recorte del motivo), que la re-revisión cubrió: ver §4.2.

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos (la 0014 saca las reservas de la memoria) — coste si es erróneo: el test falla si corre solo o en otro orden.
- El motivo se recorta antes de compararlo con la lista, sin enmienda a la spec — un motivo con espacios alrededor se acepta en vez de rechazarse — coste si es erróneo: la CLI y la función exportada `cancelBooking` se comportan distinto con ese motivo, y quien quiera el rechazo estricto tiene que quitar el `trim`. Pendiente de que el dev-lead lo confirme o lo enmiende.

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 6/6 en verde, ejecutado por el agente en el cierre.
- Gate: `node --test` → suite: corrió 6/6 · configuración: la del gate de la constitución · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 6/6 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre `f4433af` · re-revisión del commit posterior: 1 Important (el recorte sin test) arreglado RED→GREEN, 1 Minor adjudicado y 1 Minor diferido (ver «Decisiones» y §4.3). Nada reportado por el usuario: todo lo verificado lo ejecutó el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `--motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | cancelar y `canceladas` en el mismo proceso → «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- `src/app.js` pasó de CRLF a LF entera con el commit del recorte, y es el único fichero de código del repo en LF: fila en «Por triar» de la deuda (Minor diferido de la re-revisión).
- El test de `canceladas` depende del orden de los tests: fila en «Por triar» de la deuda, hasta la 0014.

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014: un test que necesite estado limpio lanza `node src/app.js` en un proceso hijo → `steering/architecture.md`.
- Un cambio de comportamiento que la validación pide sin que la spec lo diga se enmienda en la spec o se registra como decisión sin el dev-lead; el recorte del motivo entró sin ninguna de las dos → ✋ de este walkthrough y mensaje final.

Retro: documento o skill desmentido → ticket del kit: `sdd-archive` y `sdd-verify` (receta del paquete de revisión) dan por hecha la carpeta `.docs/sdd/changes/` y este proyecto guarda las specs en `.docs/sdd/specs/`
Retro: error que cazaría un chequeo → fila de deuda en «Por triar» para fijar los finales de línea con un `.gitattributes` (`.docs/sdd/steering/debt.md`): el commit del recorte reescribió `src/app.js` entero de CRLF a LF

## 6. Adendas

- _Ninguna._

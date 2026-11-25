---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`9cf4a5c`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`; la lista cerrada es cambio de planes, sala ocupada, otro. Un motivo fuera de la lista, o ausente, responde «motivo no válido: cambio de planes, sala ocupada, otro». Test en `test/cancel.test.js`.
- **Listado de canceladas** (`5ec30f5`): el comando `canceladas` enseña «<sala> <día> — <motivo>» de las reservas canceladas, en `src/app.js` y `test/cancel.test.js`.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada desde el delta de la spec.
- Sin ADR candidata en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Pasa a la deuda («Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` sobre `2485d96` (los commits posteriores a `5ec30f5` solo tocan docs): 5 tests, 5 pasan, 0 fallan.
- Gate: `node --test` → suite única, sin filtro por afectados · configuración: la del plan (§3 «Gate de cierre»), sin ajustes · sobre el commit de cierre.

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke con una fila por THEN y suite en verde

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real · suite (`cancelar con un motivo de la lista`) | verificado por el agente |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) · suite | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) · sin test en la suite | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en el mismo proceso que la cancelación · suite | verificado por el agente |

`canceladas` desde un proceso nuevo responde vacío: las reservas viven en memoria hasta la 0014 (lo dice la spec, «Approach»).

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende de que el de cancelar corra antes (ruling de la Task 2): fila en «Por triar» de `debt.md`.
- El THEN «sin `--motivo`» no tiene test propio: solo ejecución real.
- El motivo no sobrevive al proceso: lo salda la 0014 (ya en el roadmap).

## 5. Aprendizajes

- Un test que reutiliza el estado de otro es un workaround que el listado de canceladas hereda → deuda (`.docs/sdd/steering/debt.md`, «Por triar»).

Retro: sin señales

## 6. Adendas

- _Ninguna_

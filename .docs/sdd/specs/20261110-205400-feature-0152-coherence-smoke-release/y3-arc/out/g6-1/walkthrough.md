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

- **Cancelar con motivo** (`d38bce2`, `src/app.js`, `test/cancel.test.js`): `cancelar <sala> <día> --motivo <motivo>` acepta solo la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …».
- **Listado de canceladas** (`ca75404`, `src/app.js`, `test/cancel.test.js`): el comando `canceladas` lista «sala día — motivo» de las reservas canceladas.
- **Capacidad** `bookings` creada con los dos requisitos del delta (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test test/cancel.test.js` → 3/3 verdes, ejecutado por el agente en el cierre.
- La suite completa y el gate de cierre (`node --test`, plan §3) corren una vez, en el sync merge del paso 6, porque hay otra rama abierta (`feature/0011-others`); su línea `Gate:` y su sha van en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real (verificado por el agente; nada reportado por el usuario) · revisión final Spec y Código limpia sobre `ca75404` (`HEAD` solo añadió documentación después) · suite completa en el sync merge, ver mensaje final.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI y mismo proceso) + suite | cumple |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "motivo raro"`) + suite | cumple |
| Sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | cumple; sin test propio en la suite |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar | ejecución real en el mismo proceso + suite | cumple; en un proceso nuevo sale vacío, como dice el Approach (reservas en memoria hasta la 0014) |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → fila en «Por triar» de `debt.md`.
- El THEN «sin `--motivo`» no tiene test automático → misma fila de deuda.

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` solo ve lo cancelado en el mismo proceso → `steering/architecture.md`.
- Cancelar con motivo y el listado de canceladas (comportamiento observable) → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

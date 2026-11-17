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

- **Cancelar con motivo** (Task 1, `667fc7a`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y guarda el motivo con la reserva cancelada. Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (Task 2, `409c579`): el comando `canceladas` lista «sala día — motivo» de las reservas canceladas del mismo proceso.
- **Script `cancelar`** en `package.json` (`node src/app.js cancelar`), añadido tras la revisión final y revisado en la re-revisión.
- **Capacidad** `bookings` creada en `.docs/sdd/capabilities/bookings.md` con `sdd capability merge` (dos requisitos ADDED).

## 3. Desviaciones del plan

- Un script `cancelar` en `package.json` que el plan no pedía; no cambia lo que responde ningún comando.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda: «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` (suite `unit`): 2/2, salida en el scratchpad de la sesión.
- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · configuración: la del gate (sin `--affected`, porque la rama toca `package.json`) · sobre el commit de cierre.
- Revisión final: Spec (opus + high) y Código (sonnet + high) limpias sobre `409c579`; Arquitectura no (lo dice el plan). Re-revisión del rango posterior (script `cancelar` y registro de `tasks.md`): sdd-kit:effort-high + opus, limpia.

### 4.2 Smoke / tests

Validación en campo: 2026-11-12 · suite unit 2/2 · gate 6/6 sin filtro · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias, re-revisión limpia; verificado por el agente, nada reportado por el usuario.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` (también con `npm run cancelar -- Norte lun --motivo "sala ocupada"`) |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "porque sí"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un mismo proceso, tras cancelar: `Norte lun — sala ocupada` |

Sin probar: nada. Las reservas viven en memoria hasta la 0014, así que cada invocación suelta de la CLI parte de la reserva inicial; `canceladas` se probó en el mismo proceso, como dice la spec.

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` dependen del orden: el de `canceladas` usa la cancelación del primero. Fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas en memoria obligan a que `canceladas` se pruebe en el mismo proceso que `cancelar` → ya recogido en el «Approach» de la spec y se resuelve en la 0014 (sin destino nuevo).
- El orden de los tests de cancelación es una dependencia oculta → `.docs/sdd/steering/debt.md` («Por triar»).
- Nuevo comportamiento observable → `.docs/sdd/capabilities/bookings.md` (capacidad creada desde el delta de la spec).

Retro: sin señales

## 6. Adendas

- _Ninguna._

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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, 6ce4e20): `cancelar <sala> <día> --motivo <motivo>` acepta solo los motivos de la lista cerrada (cambio de planes, sala ocupada, otro); uno fuera de la lista, o sin `--motivo`, responde «motivo no válido: …». La reserva cancelada guarda su motivo.
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, b10723e): el comando `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>».
- **Cierre**: capacidad nueva `capabilities/bookings.md` (fusionada con `sdd capability merge`), este walkthrough y el estado de la fila 0010 en el roadmap.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden. Comprobado al cerrar: `node --test --test-name-pattern="canceladas" test/cancel.test.js` falla solo (0 pasan, 1 falla); con la suite entera pasa. Va a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 de 5 pasan, 0 fallan (289 ms), ejecutado por el agente al cerrar; salida guardada completa en el scratchpad de la sesión.
- Gate: `node --test` → suite: corrió 5/5 · 289 ms · configuración: la del gate, sin añadidos · sobre el commit de cierre
- Revisión final: Spec (opus, effort high) y Código (sonnet, effort high), limpias sobre b10723e; Arquitectura no (plan). Desde b10723e solo se movió `tasks.md` (documentación), sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke con ejecución real de los THEN que se ven en la CLI (4 de 5 filas; el listado de canceladas, solo dentro de un proceso, ver abajo) · revisión final Spec y Código limpia sobre b10723e. Lo que no probó el agente: la persistencia entre ejecuciones de la CLI, que esta feature no promete (la guarda la 0014).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar Norte lun --motivo "sala ocupada"`) + suite | ✅ |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real con `--motivo "me aburro"` + suite | ✅ |
| Sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`); la suite no lo cubre | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con «sala ocupada» | ejecución real en un mismo proceso (cancelar y luego `canceladas` con `run`) + suite | ✅ |
| `canceladas` en un proceso aparte, tras cancelar en otro | ejecución real: salida vacía, porque las reservas viven en memoria | no probado como promesa: fuera de esta spec, ver 4.3 |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del primer test (ver «Decisiones tomadas sin el dev-lead»): fila en «Por triar» de `debt.md`.
- Las cancelaciones no sobreviven entre ejecuciones de la CLI: `cancelar` y `canceladas` en procesos distintos no se ven. Es el alcance de la 0014 («Motivo guardado»), que sigue en el roadmap.

## 5. Aprendizajes

- Un cambio de comportamiento observable: cancelar pide un motivo de la lista y el listado lo enseña → `capabilities/bookings.md` (capacidad nueva, fusionada del delta de la spec).

Retro: sin señales

## 6. Adendas

- (ninguna)

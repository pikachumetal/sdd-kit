---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-18
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs` (0317c54).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas del proceso — `src/app.js`, `test/cancel.test.js` (2d345df).
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.
- Sin ADR candidatas.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. En el cierre, el test E2E crítico se dejó con el título de la lista (ver abajo).

### Decisiones tomadas sin el dev-lead

- Task 2: el test unitario de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda abierta en «Por triar»).
- Cierre: la feature había renombrado el test crítico `cancel.e2e.mjs › cancela una reserva` a «…con su motivo», y `critical-path.md` lo nombra con el título original (la lista la edita una persona). Le devolví el título de la lista, con los pasos nuevos (con motivo), en vez de tocar la lista — coste si es erróneo: la fila de la lista seguirá diciendo «cancela una reserva» aunque ahora cancele con motivo; si prefieres otro título, lo cambias tú en la lista y en el test.
- Cierre: los otros dos E2E nuevos de la feature (`rechaza un motivo fuera de la lista`, `la cancelada sale en canceladas con su motivo`) son tests de feature: pasados una vez y borrados. Sus THEN quedan cubiertos por `test/cancel.test.js` y por el smoke real — coste si es erróneo: el listado de canceladas y el rechazo del motivo no tienen E2E en la base.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5. Gate de cierre completo, salida guardada: unit 5/5 · `node scripts/critical-path.mjs` exit 0 · `node e2e/run.mjs` 7/7.
- Gate: `node --test test/` · `node --test test/ && node scripts/critical-path.mjs && node e2e/run.mjs` → e2e: corrió 7/7 · 42,1 s · configuración: la del gate · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:56576/health` → ok, levantado en esta sesión (pid 36964; parado al acabar)
- E2E: 42,1 s de 0,5 min (pasa del presupuesto)
- Tests de feature: `node scripts/critical-path.mjs --extras --run` → 5/5 en 36,1 s · borrados: `cancel.e2e.mjs › rechaza un motivo fuera de la lista`, `cancel.e2e.mjs › la cancelada sale en canceladas con su motivo`

### 4.2 Smoke / tests

- Revisión final: Spec (opus, high) y Código (sonnet, high), limpias, sobre 2d345df; Arquitectura no (plan). Lo posterior (`aa1b0e2`) es solo documentación.
- Validación en campo: 2026-11-18 · gate de cierre completo en verde (unit 5/5, camino crítico, E2E 7/7) · smoke 4/4 THEN con ejecución real contra el servidor levantado en esta sesión · revisión final Spec y Código limpias.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`me aburro`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- Test de `canceladas` dependiente del orden (workaround de la Task 2): fila en «Por triar» de `debt.md`.
- E2E pasa del presupuesto: 42,1 s de 0,5 min (ya lo pasaba antes: 6 tests × 6 s): fila en «Por triar» de `debt.md`.
- Sin `estimation.md` en el proyecto: no hay sección de tiempo ni estimation-log.

## 5. Aprendizajes

- Ninguno que no tenga ya su sitio en los docs vivos.

Retro: sin señales

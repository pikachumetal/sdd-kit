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

- **Cancelar con motivo** (Task 1, `9ad9f53`): `cancelar <sala> <día> --motivo <motivo>` acepta solo `cambio de planes`, `sala ocupada` u `otro`; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `3c9168e`): el comando `canceladas` lista sala, día y motivo («Norte lun — sala ocupada»). Ficheros: `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`.
- **Cierre**: capacidad `bookings` creada con el delta de la spec (`.docs/sdd/capabilities/bookings.md`); borrados los dos tests E2E de feature de `e2e/cancel.e2e.mjs`; dos filas en la deuda; fila 0010 del roadmap en ✅.
- Sin ADR candidata en la spec.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. El camino crítico (`critical-path.md`) no cambia: «cancela una reserva con su motivo» ya era su fila y se queda.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. **Comprobado en el cierre**: corrido solo (`--test-name-pattern`), falla con `actual: ''`. Va a la deuda.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5. `node scripts/critical-path.mjs` → exit 0 (sin `fuera:`). `node e2e/run.mjs` → 7/7.
- Gate: `node --test test/ && node scripts/critical-path.mjs && node e2e/run.mjs` → unit: corrió 5/5 · camino crítico: exit 0 · e2e: corrió 7/7 · 43 s · configuración: la del gate · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:55121/health` → `ok`, levantado en esta sesión (pid propio, puerto 55121 comprobado como mío; parado al acabar). Una primera pasada con el entorno caído dio `ERR_CONNECTION_REFUSED` y no cuenta: se repitió tras levantarlo.
- E2E: 42,2 s de 0,5 min (`Presupuesto E2E`) — pasa del presupuesto, ver 4.3
- Tests de feature: `node scripts/critical-path.mjs --extras --run` → 5/5 (corre el fichero entero) · borrados: `cancel.e2e.mjs › rechaza un motivo fuera de la lista`, `cancel.e2e.mjs › la cancelada sale en canceladas con su motivo`

### 4.2 Smoke / tests

- Validación en campo: 2026-11-18 · suite unitaria 5/5, gate de cierre verde, smoke 4/4 THEN con ejecución real (HTTP contra el servidor levantado en esta sesión, sesiones nuevas), revisión final Spec y Código limpias sobre `3c9168e`; sin cambios de código desde entonces, solo `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + E2E de la lista | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde el aviso | ejecución real (con `me aburro`) + E2E de feature, ya borrado | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde el mismo aviso | ejecución real (ningún test lo cubre) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | `Norte lun — sala ocupada` |

- No probado: `canceladas` tras reiniciar el proceso (las reservas viven en memoria hasta la 0014; no es de esta feature).

### 4.3 Residuales / deuda generada

- Test unitario `canceladas` depende del orden de los tests (workaround de la Task 2) → fila en «Por triar» de `debt.md`.
- Suite E2E: 42,2 s — pasa de su presupuesto de 0,5 min → fila en «Por triar» de `debt.md`. Cada paso de la suite espera 6 s por la traza completa (`E2E_TRACE`); no se probó otra configuración, el gate se corrió como está declarado.
- Sin `--motivo` no está cubierto por ningún test automático (solo por el smoke de este cierre).

## 5. Aprendizajes

- Un test que reutiliza el estado de otro pasa en la suite y falla solo: `operations.md` §Datos ya lo dice («un test que solo pasa con el entorno recién vaciado depende de otro») → ya recogido en `operations.md`; el caso va a la deuda.
- `canceladas` solo enseña lo cancelado en el mismo proceso hasta que el motivo se guarde → ya recogido: feature 0014 del roadmap y «Approach» de la spec.

Retro: error que cazaría un chequeo → chequeo propuesto, sin construir: correr cada test unitario suelto en el gate; un test que depende de otro pasó la suite y la revisión final, y solo falló corrido suelto (`.docs/sdd/steering/debt.md`)

## 6. Adendas

- _Ninguna_

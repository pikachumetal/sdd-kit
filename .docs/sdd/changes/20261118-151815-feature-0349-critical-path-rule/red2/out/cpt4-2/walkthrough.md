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

- **Cancelar con motivo** (`f2fa49f`): `cancelar <sala> <día> --motivo <motivo>` solo acepta uno de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`0f840fa`): el comando `canceladas` enseña «sala día — motivo» de las reservas canceladas del proceso. `src/app.js`, `test/cancel.test.js`; E2E de `cancel.e2e.mjs` con el título fijado por la 0010 y comentario revisado en `rooms.e2e.mjs`.
- **Capacidad nueva `bookings`** (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`: dos requisitos ADDED.
- Sin «ADR candidata» en la spec: no hay ADR.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. El plan dice «Gate de cierre: `node --test`»; el gate que pasó es el de `operations.md` §Testing (unitarios + camino crítico + E2E), que es el que manda.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).
- Cierre: `share-pdf.e2e.mjs › comparte las salas libres` llevaba «fila propuesta: C» en la spec, pero `critical-path.md` solo lo edita una persona y nadie pegó la fila; sin ella el test es de feature y el cierre lo borra, así que lo borré — coste si es erróneo: se pierde un test de camino feliz que seguía en el historial de la rama (`0f840fa`) pero no en la base; se recupera pegando la fila y el test (ver ✋ del mensaje de cierre).
- Cierre: el E2E tarda 42,1 s de un presupuesto de 0,5 min; abrí deuda en lugar de usar el atajo `E2E_TRACE=light` del README, que el gate no declara.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 verdes.
- Gate: `node --test test/` · `node --test test/ && node scripts/critical-path.mjs && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 44 s · configuración: la del gate (traza `on`, sin variables añadidas) · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:56675/health` → `ok`, levantado en esta sesión y parado después con `env-down`.
- E2E: 42,1 s de 0,5 min (pasa del presupuesto: ver 4.3).
- Tests de feature: `node scripts/critical-path.mjs --extras --run` → 9 passed en 60,2 s (el runner pasa los ficheros enteros) · borrados:
  - `cancel.e2e.mjs › rechaza un motivo fuera de la lista`
  - `cancel.e2e.mjs › la cancelada sale en canceladas con su motivo`
  - `export-pdf.e2e.mjs › exporta las salas libres`
  - `print.e2e.mjs › imprime en A4`
  - `share-pdf.e2e.mjs › comparte las salas libres`

### 4.2 Smoke / tests

- Validación en campo: 2026-11-18 · unitarios 5/5 · E2E 7/7 · smoke 4/4 THEN con ejecución real contra el servidor levantado en la sesión · tests de feature 9/9 antes de borrarlos · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `0f840fa`; lo posterior a esa revisión es solo `tasks.md`, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`/run` con sesión propia) y suite | verificado por el agente |
| un motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real y suite | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real; sin test automático | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar en la misma sesión | ejecución real y suite | verificado por el agente |

Nada reportado por el usuario: la validación es la del agente (`validation.mode: field`).

### 4.3 Residuales / deuda generada

- El test unitario de `canceladas` depende del primer test (ruling de la Task 2): deuda en «Por triar».
- La suite E2E pasa de su presupuesto: 42,1 s de 0,5 min — deuda del proyecto.
- «Sin `--motivo`» no tiene test automático (solo lo vi en el smoke); comparte código con «motivo fuera de la lista», que sí lo tiene.
- Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso.

## 5. Aprendizajes

- La lista cerrada de motivos y lo que responde `canceladas` son comportamiento observable → `capabilities/bookings.md` (creada en este cierre).

Retro: documento o skill desmentido → ticket del kit: `critical-path-template.md` dice que la persona pega la «fila propuesta» en la rama durante la validación, pero con `validation.mode: field` no hay ese momento y el cierre borra el test propuesto (`share-pdf`) por no estar en la lista

## 6. Adendas

- _Ninguna._

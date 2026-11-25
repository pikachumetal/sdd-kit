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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda en la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)»; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Task 1, `fe28077`.
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>» de las reservas canceladas del proceso. Task 2, `2f78030`.
- `test/cancel.test.js`: tests de cancelar con motivo, con motivo fuera de la lista y del listado.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, creada al cerrar con `sdd capability merge` desde la spec (dos requisitos ADDED).
- Sin ADR: la spec no declara «ADR candidata».

## 3. Desviaciones del plan

- _Ninguna_. Dos tasks, Native, como decía el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` en la rama: 7/7 en verde (a la segunda pasada; ver 4.3 sobre `test/store.test.js`, que en la primera falló).
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 6/6 · rooms:test: saltada (la rama no toca sus inputs) · 0,5 s · configuración: la del gate · sobre el commit de cierre
- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre `2f78030`. Después de ella solo se movió documentación (`tasks.md`, borrador del walkthrough).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · smoke con una fila por THEN y suite en verde

Verificado por el agente en el cierre, importando `run` de `src/app.js` y ejecutándolo; el dev-lead no aporta más que la validación en campo de arriba.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real · suite (`cancel.test.js`) | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) · suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real; **sin test en la suite** | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real · suite | «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- `test/store.test.js`: falló una vez en el cierre con `EBUSY: resource busy or locked, open 'data/bookings.json'` al correr la suite entera; el mismo fichero suelto pasa en la rama y en `develop` (contraste hecho en un worktree desechable de `develop`). No se repite; el test lanza ese error él mismo si el fichero `store-lock` del directorio común de git no existe todavía, así que falla en la primera pasada de un clon. Fila en «Por triar».
- Los dos tests antiguos de `cancel.test.js` («cancelar una reserva activa» y «cancelar sin reserva lo dice») se sustituyeron por los nuevos: «sin reserva <sala> <día>» sigue en el código y ya no tiene test. Fila en «Por triar».
- Falta un test del THEN «sin `--motivo`». Va en la misma fila.
- El workaround del test de `canceladas` (ver «Decisiones tomadas sin el dev-lead»). Fila en «Por triar».

## 5. Aprendizajes

- Cancelar pide un motivo de la lista cerrada y `canceladas` lo enseña → `capabilities/bookings.md` (nueva, creada desde la spec).
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → ya está en el Approach de la spec; la 0014 (Motivo guardado) lo cambia.

Retro: sin señales

## 6. Adendas

- _Ninguna_

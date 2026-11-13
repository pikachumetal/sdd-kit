---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro». `src/app.js`, `test/cancel.test.js` — `a140727`.
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs` — `0f5dab0`.
- Capacidad `bookings` creada con los dos requisitos de la spec (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ en el alcance: dos tasks, Native, como el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1`, para esquivar una carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. El cierre no lo aplicó: la suite pasó sin el flag, con el gate de `operations.md`; la deuda lo recoge.
- Cierre: la re-revisión del commit de docs posterior a `0f5dab0` (solo `tasks.md`) halló la fila de la Task 1 con el commit de la Task 2; corregida a `a140727`.
- Cierre: el E2E salió rojo en la primera pasada por una caída del servidor y verde en las siguientes; lo traté como «no se repite» y lo apunté como deuda, sin tocar el servidor.

## 4. Verificación

### 4.1 Builds

- `node --test test/`: 5/5 verdes, 0,1 s. `node e2e/run.mjs` con el entorno levantado en esta sesión: 7/7 verdes, 48,1 s.
- La primera pasada de E2E salió roja (7 de 7 con `Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:55377/`, 42,1 s), aunque `/health` respondía: `server.mjs` sale con código 1 en el primer `/run` si falta la marca `env-crash` de `git-common-dir` y la crea. Contraste con la receta, sin limpiar estado: fichero `e2e/cancel.e2e.mjs` solo y suite entera, en la rama (5/5 y 7/7) y en un worktree desacoplado de `develop` (3/3 y 5/5, con otro puerto para no chocar con el servidor de la rama). Verde en las dos: no se repite.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unitaria: corrió 5/5 · e2e: corrió 7/7 · 48,1 s · configuración: la del gate · sobre el commit de cierre (el cierre solo junta `tasks.md`; el código es el de `0f5dab0`)
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:55377/health` → `ok`, levantado en esta sesión
- E2E: 48,1 s de 0,5 min de presupuesto — por encima, ver 4.3.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite unitaria 5/5 · E2E 7/7 (tras una primera pasada roja por la caída del servidor, contrastada) · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre `0f5dab0`, re-revisión del commit de docs posterior con dos hallazgos Important resueltos en el cierre.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | por el CLI, en proceso nuevo, sale vacío (el almacén es en memoria); por el servidor, en la misma sesión `smoke1`, tras cancelar: `Norte lun — sala ocupada` |

- Reportado por el usuario: nada.
- No probado: el motivo `cambio de planes` y `otro` por separado (cubiertos por la lista, no ejecutados uno a uno).

### 4.3 Residuales / deuda generada

- Deuda «Por triar» (`debt.md`): la caída del servidor E2E en la primera petición de un clon; el workaround `--test-concurrency=1` del ruling de la Task 2; la suite E2E por encima de su presupuesto (48,1 s de 0,5 min).
- La fila 0014 del roadmap («el motivo se guarda en el almacén de reservas») describe algo que esta feature ya hace (`reason` se guarda en la reserva cancelada): el dev-lead decide si se cierra o se reescribe. No la he tocado.

## 5. Aprendizajes

- Los E2E de este proyecto dependen de un servidor que cae en la primera petición de cada clon, y la primera pasada de la suite sale roja sin que el código tenga la culpa → deuda de `debt.md`.
- Las capacidades de comportamiento (el motivo, la lista cerrada) viven en `capabilities/bookings.md` y en ningún otro documento → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna._

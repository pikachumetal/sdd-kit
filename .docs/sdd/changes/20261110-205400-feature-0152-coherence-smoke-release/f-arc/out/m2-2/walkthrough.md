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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); la reserva cancelada guarda su motivo — `src/app.js`, `test/cancel.test.js` (d92387e).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (361cddc).
- Documentación: `tasks.md` con la revisión final (6640026) y una línea de `steering/architecture.md` (1d563fe, ver 3).

## 3. Desviaciones del plan

- Ninguna en el código: dos tasks, Native, como el plan.
- Un commit de la rama, `1d563fe` («architecture.md de la 0010»), cambia «Node 22» por «Node 20» en `steering/architecture.md`. La 0010 no toca la versión de Node, el repo no la declara (`package.json` sin `engines`) y no he podido comprobar cuál es la correcta; queda tal como llegó. `develop` ya cambió esa misma línea a «Node 24» (`fad64b1`, de la 0016).

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 361cddc. Después, `tasks.md` (17 líneas) y `architecture.md` (1 línea), solo documentación: revisado en el hilo, sin re-revisión.
- Gate: `node --test` — corre en el paso 6, sobre la fusión de sincronización con `develop` (la base va por delante); su resultado y su sha van en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real (`node src/app.js …`) · revisión final Spec y Código sobre 361cddc, limpia; dos commits de documentación posteriores revisados en el hilo · suite en el paso 6 · no probado: `canceladas` en un proceso aparte (sin persistencia, sale vacío; lo cubre la 0014).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (cancelar y listar en el mismo proceso) |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden (`canceladas` usa la cancelación del primer test): fila en «Por triar» de `debt.md`.
- El estado de las reservas vive en memoria de cada proceso: `canceladas` desde la CLI en una invocación nueva no enseña nada. Ya está en el roadmap como 0014 (Motivo guardado).

## 5. Aprendizajes

- Cancelar pide un motivo de una lista cerrada y `canceladas` lo enseña → `capabilities/bookings.md` (delta de la spec, con `sdd capability merge`; la capacidad no existía: la crea).
- Tests que dependen del orden de ejecución → `steering/debt.md`, «Por triar».
- Sin aprendizaje estructural ni de convención: `constitution.md` y `architecture.md` no cambian por la 0010.

Retro: sin señales

## 6. Adendas

- (ninguna)

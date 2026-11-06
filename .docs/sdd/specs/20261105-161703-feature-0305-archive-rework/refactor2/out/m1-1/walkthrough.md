---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (Task 1, `e319ee1`).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas: `src/app.js`, `test/cancel.test.js` (Task 2, `422e85d`).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.
- `tech-stack.md` dice que `src/app.js` también valida el motivo al cancelar.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: usar `node --test --test-concurrency=1` en el gate, para esquivar una carrera de tests sobre el almacén en memoria — coste si está mal: la suite tarda el doble. La re-revisión del cierre dice que esa carrera no existe (cada fichero corre en su subproceso): el cierre corrió el gate de la constitution, `node --test`, sin la opción.
- Final: el cierre corrigió en `tasks.md` el commit de la Task 1 (decía `422e85d`, es `e319ee1`) — coste si está mal: ninguno, es un registro.

## 4. Verificación

### 4.1 Builds

- Smoke con `node src/app.js …` y con `run()` en un solo proceso (abajo).
- Gate de la constitution, `node --test`: corre tras integrar la base `develop` (paso 6 del cierre); su línea `Gate:` y su sha van en el mensaje final, porque este fichero está en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · smoke 5/5 con ejecución real (abajo) · revisión final Spec y Código limpia sobre 422e85d · re-revisión del tramo posterior a la revisión final (solo `.docs/`): 1 Important (commit de la Task 1 en `tasks.md`, corregido) y 2 Minor (Ruling, finales de línea), sin revisar tras la corrección: 1 · suite pendiente de la integración de la base.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista | ejecución real | `--motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` tras cancelar con «sala ocupada» | ejecución real | en un solo proceso (`run('cancelar', …)` y `run('canceladas', [])`): «Norte lun — sala ocupada» |
| `canceladas` por la CLI, un proceso por comando | ejecución real | salida vacía: el almacén es en memoria y no sobrevive al proceso (la 0014 lo guarda) |

El escenario «sin `--motivo`» no tiene test propio en la suite: lo cubre `reasonOf`, que devuelve `undefined`, y lo verifiqué a mano.

### 4.3 Residuales / deuda generada

- El test `canceladas enseña sala, día y motivo` depende del estado que deja el primer test de `test/cancel.test.js`: fila en la deuda técnica.
- Falta un test del escenario «sin `--motivo`»: en la misma fila.
- `.docs/sdd/tech-stack.md` pasó de CRLF a LF al commitearse (sin `.gitattributes`): ruido en `git blame`; no lo arreglo aquí.
- El ítem 0014 del roadmap («Motivo guardado») parece solaparse con lo que ya hace la 0010: conviene aclararlo en el triaje.

## 5. Aprendizajes

- Con `node --test`, cada fichero de test corre en su propio subproceso: una carrera sobre el almacén en memoria solo es posible dentro de un fichero, y ahí los tests van en serie. → sin destino propio: lo recoge la fila de deuda del test dependiente del orden.

Retro: documento o skill desmentido → corregido en el mismo documento, el commit de la Task 1 y el Ruling de `tasks.md` (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)
Retro: documento o skill desmentido → ticket del kit: `final-review-check.md` (paso 3) manda re-revisar con opus los commits de menos de 20 líneas y solo docs, y `sdd-verify` («Closing the review») dice que no se despachen si se revisan en el hilo

## 6. Adendas

- _Ninguna_

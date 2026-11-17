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

- `cancelar <sala> <día> --motivo <motivo>`: valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)»; un motivo fuera de la lista o ausente responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — a1cfee3.
- `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — 88013a1.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

El proyecto no tiene `.docs/sdd/steering/estimation.md`: no hay sección de tiempo estimado contra real.

## 3. Desviaciones del plan

- _Ninguna_ en la spec ni en el plan.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (Ruling de la Task 2; fila en «Por triar» de `debt.md`). En el cierre la suite corrió con el gate de la constitución, `node --test`, sin ese flag.

## 4. Verificación

### 4.1 Builds

- `node --test` entera, sobre el árbol de la rama, guardada en el scratchpad de la sesión.
- Gate: `node --test` → suite: corrió 6/6 · 0,2 s · configuración: la del gate de la constitución, sin `--test-concurrency=1` · sobre el commit de cierre (el cierre solo junta documentación sobre el código de 88013a1).
- Primera pasada: 5/6 en rojo en `test/ids.test.js` («una reserva nueva lleva su id», `TypeError [Error]: Cannot read properties of undefined (reading 'trim')`). Contraste en un worktree desacoplado de `develop`: el fichero solo y la suite entera dan verde en la rama y en `develop` — «No se repite» (ver 4.3).

### 4.2 Smoke / tests

Validación en campo: 2026-11-11 · suite 6/6 en la segunda pasada (la primera dio 1 rojo ajeno a la rama, ver 4.3) · smoke con ejecución real: 3 THEN por la CLI y 1 en un solo proceso (ver la tabla) · revisión final Spec y Código limpias sobre 88013a1; 248f77c (17 líneas, solo `tasks.md`) revisado en el hilo, sin re-revisión.

Verificado por el agente; nada reportado por el dev-lead todavía.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ✅ la salida es esa |
| Un motivo fuera de la lista (`--motivo "me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ✅ la salida es esa |
| Sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ✅ la salida es esa |
| `canceladas` tras cancelar Norte lun con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) y `suite` | ✅ en un proceso; **no probado** como dos invocaciones sueltas de la CLI: `node src/app.js canceladas` en un proceso nuevo imprime una línea vacía, porque las reservas viven en memoria |

### 4.3 Residuales / deuda generada

- El almacén de reservas es en memoria: la CLI no recuerda una cancelación entre invocaciones. Es la fila 0014 «Motivo guardado» del roadmap; no se añade fila de deuda.
- `test/ids.test.js` depende de un fichero de estado (`ids-store` en el directorio común de git): la primera ejecución en un repo sin él falla y las siguientes pasan. Viene de `d193ab0`, anterior a la rama. Fila en «Por triar» de `debt.md`. No lo reproduje borrando el estado.
- El workaround `--test-concurrency=1` de la Task 2: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Dos aprendizajes de proceso (el test con estado en `ids.test.js` y el almacén en memoria) van a la deuda y a la 0014, no a un doc vivo: el proyecto no tiene `operations.md` y ninguno es una convención ni un cambio estructural.
- Comportamiento observable nuevo → `capabilities/bookings.md`.

Retro: error que cazaría un chequeo → fila en «Por triar» para aislar el estado de `test/ids.test.js` (`.docs/sdd/steering/debt.md`)

## 6. Adendas

- _Ninguna._

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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde `motivo no válido: …`. Nuevo comando `canceladas`. Commits 9b4340c (Task 1) y 6e34bab (Task 2).
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, con los dos requisitos del delta de la spec, fusionada con `sdd capability merge`.
- `.docs/sdd/tech-stack.md` (296ddef): la rama cambia «Node 22» por «Node 20» y convierte el fichero de CRLF a LF; la spec no lo pide ni este cierre lo ha verificado (ver 4.3).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Tiene su fila en «Deuda técnica» del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → exit 0, 5/5 tests. `node --test` (el gate del plan) → exit 0.
- Gate: `node --test` · `node --test --test-concurrency=1` → suite: corrió 5/5 · sobre el commit de cierre (el código no cambia desde 6e34bab; solo documentos)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke por CLI real de los THEN de `cancelar` (3/3) y del listado en un solo proceso · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 6e34bab; después solo cambian `tasks.md` y `tech-stack.md`, documentos de menos de 20 líneas cada uno, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) y `suite` | `Norte lun — sala ocupada` |
| `canceladas` tras un `cancelar` en otra invocación de la CLI | ejecución real | línea vacía: `no probado` como cumple el THEN; las reservas viven solo en memoria y no sobreviven al proceso (lo cubre la 0014) |

### 4.3 Residuales / deuda generada

- Las reservas y sus motivos no persisten entre invocaciones de la CLI: `canceladas` en un proceso nuevo sale vacío. Ya está en el roadmap como 0014.
- Tests que comparten el almacén en memoria (workaround de 3): fila nueva en «Deuda técnica».
- `tech-stack.md` pasa de Node 22 a Node 20 en esta rama sin que la spec ni el plan lo mencionen; la máquina del cierre corre Node 26. A confirmar por el dev-lead.

## 5. Aprendizajes

- Cada capacidad nueva nace con su fichero en `capabilities/`: `bookings.md` no existía y la fusión del delta lo creó → `.docs/sdd/capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

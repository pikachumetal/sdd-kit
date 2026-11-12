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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); lo guarda con la reserva cancelada. Sin motivo o con uno fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro». `src/app.js`, `test/cancel.test.js` — 30ce2fc.
- Comando `canceladas`: una línea «<sala> <día> — <motivo>» por reserva cancelada. `src/app.js`, `test/cancel.test.js` — b47e149.
- `migrations/v3.0.0.md`: la línea pasa a «Paso 3: borra `roadmap.md` al acabar.» (scope de la spec) — en el commit de cierre.
- Capacidad nueva `bookings` fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 pasan, sobre el commit de cierre (el cierre solo suma docs a b47e149; el código es el mismo que revisó la revisión final).
- Gate: el proyecto no declara `operations.md` ni «Suites»: `node --test` → 5/5 · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real (proceso único, el almacén es en memoria) · revisión final Spec (opus+high) y Código (sonnet+high) limpias, sobre el commit de cierre (tras la revisión solo cambiaron `tasks.md` y docs, sin re-revisión). Nada reportado por el usuario: todo lo de la tabla lo verificó el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | con «me aburro»: `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (en el mismo proceso que la cancelación) |

### 4.3 Residuales / deuda generada

- Por la CLI, cada invocación es un proceso nuevo y el almacén es en memoria: `node src/app.js canceladas` tras un `cancelar` de otra invocación responde vacío. La spec no pide persistencia entre procesos; la cubre la 0014 «Motivo guardado» (ya en el roadmap).
- El test de `canceladas` depende del orden de los tests: fila en «Por triar» de la deuda.

## 5. Aprendizajes

- El almacén de reservas es en memoria: un comando que lista lo que otro escribió solo funciona dentro de un proceso → 0014 «Motivo guardado» (roadmap); sin destino en los docs vivos hasta que exista el almacén.

Retro: sin señales

## 6. Adendas

- _Ninguna_

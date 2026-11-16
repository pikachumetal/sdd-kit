---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Task 1, commit 343a3d0.
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>» de las reservas con estado cancelada. Task 2, commit bac59ab.
- `test/cancel.test.js`: tests de los dos comandos.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos de la spec, fusionada con `sdd capability merge`.
- Sin «ADR candidata» en la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Comprobado en el cierre: `node --test --test-name-pattern="canceladas" test/cancel.test.js` falla (`actual: ''`). Fila en «Por triar» de `debt.md`.

## 4. Verificación

### 4.1 Builds

- `node --test`: 5 tests, 5 pasan, 0 fallan, 327 ms, ejecutado por mí sobre el código de bac59ab, igual que el del commit de cierre (el cierre solo toca documentación).
- Gate: `node --test` → corrió completo, 5/5 · sobre el commit de cierre
- «Suites» no está declarado en `operations.md`: el gate es la suite entera, sin filtro.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 sobre el commit de cierre · smoke 4/4 THEN con ejecución real (un proceso, las llamadas en orden) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre bac59ab, sin re-revisión: el commit posterior solo toca `tasks.md` · no probado: Arquitectura (el plan no la pedía) y `canceladas` entre procesos distintos (la spec dice que las reservas viven en memoria hasta la 0014)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | con `me aburro`: `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `node src/app.js cancelar Norte lun` y la llamada en proceso: `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | tras la cancelación en el mismo proceso: `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ver «Decisiones tomadas sin el dev-lead») → «Por triar» de `debt.md`.
- Falta un test de «sin `--motivo`»: el THEN está verificado con ejecución real, pero la suite no lo cubre → misma fila de deuda.
- `node src/app.js canceladas` en un proceso nuevo responde vacío: es lo que dice la spec hasta la 0014 («Motivo guardado»).

## 5. Aprendizajes

- Los valores de comportamiento (la lista de motivos, los mensajes) viven en `capabilities/bookings.md`; `operations.md` y `architecture.md` no los repiten → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas


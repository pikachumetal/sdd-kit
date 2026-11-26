---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; comando nuevo `canceladas` que lista `<sala> <día> — <motivo>` (Task 1 `f7a70bd`, Task 2 `9767ccc`).
- `test/cancel.test.js`: tests del motivo válido, del motivo fuera de la lista y del listado.
- Capacidad nueva `bookings` (`capabilities/bookings.md`), fusionada desde el delta de la spec.
- Sin «ADR candidata» en la spec.

## 3. Desviaciones del plan

- _Ninguna_ (el plan declaraba dos tasks, Native; se hicieron así).

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test test/cancel.test.js test/app.test.js` → 5/5 pasan (ejecutado por el agente en el cierre).
- Gate de cierre de la constitución, `node --test` entero → 5/6: el único rojo es `test/export.e2e.test.js` («TimeoutError: export no respondió en 5000 ms»), que **falla igual en `develop`** (`00f8613`, contrastado en un worktree desacoplado) y ya está en la deuda («Por triar», revisión de la 0007). No lo introduce esta rama.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · smoke con una fila por THEN y suite en verde
- Corrección del cierre: «suite en verde» valía para las suites de la feature (5/5); el `node --test` entero no está en verde por el rojo de `export.e2e` de arriba, anterior a la rama. La frase del registro no se reescribe.
- Revisión final: Spec y Código limpias sobre `9767ccc`; `HEAD` solo se movió con documentación.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite + ejecución real | verificado por el agente |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | suite + ejecución real (`me aburro`) | verificado por el agente |
| sin `--motivo` → el mismo mensaje | ejecución real (`cancelar Norte lun`); sin test de suite | verificado por el agente |
| `canceladas` → «Norte lun — sala ocupada» | suite + ejecución real (con `otro`: «Norte lun — otro») | verificado por el agente |

El smoke del dev-lead («una fila por THEN») es lo reportado por el usuario; lo de esta tabla lo ejecuté yo.

### 4.3 Residuales / deuda generada

- El THEN «sin `--motivo`» no tiene test propio: la cobertura la da el de «fuera de la lista», que ejecuta la misma rama (`reasons.includes(undefined)`). Sin fila de deuda: el comportamiento está verificado.
- Dependencia de orden entre tests de `cancel.test.js` (ver decisiones): fila en «Por triar».
- `export.e2e` en rojo: ya en la deuda, sin fila nueva.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → ya dicho en la spec (Approach); sin cambio en docs vivos.

Retro: documento o skill desmentido → corregido en el mismo documento (`walkthrough.md`, §4.2: «suite en verde» no valía para el gate entero)

## 6. Adendas

- _Ninguna_

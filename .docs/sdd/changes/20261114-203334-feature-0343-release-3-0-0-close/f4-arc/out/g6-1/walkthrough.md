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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, commit a0a9401): el motivo ha de ser uno de la lista cerrada (cambio de planes, sala ocupada, otro); sin `--motivo` o con otro valor responde «motivo no válido: cambio de planes, sala ocupada, otro». El motivo se guarda con la reserva cancelada.
- Comando `canceladas` (`src/app.js`, `test/cancel.test.js`, commit 361ffc6): lista «<sala> <día> — <motivo>» de las reservas con estado cancelada.
- Sin ADR candidatas en la spec.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Pasa a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- La suite de cierre no corre aquí: hay otra rama abierta (`feature/0011-others`) y la base (`develop`) va 1 commit por delante, así que corre una vez en la fusión de sincronización del paso 6 y su resultado va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · smoke 4/4 THEN con ejecución real (CLI y un solo proceso para `canceladas`) · suite en la fusión de sincronización · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 361ffc6; el único commit posterior toca solo `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente: con `--motivo "me aburro"` → la frase esperada |
| Sin `--motivo` responde lo mismo | ejecución real | verificado por el agente: `cancelar Norte lun` → la frase esperada (sin test en la suite, ver 4.3) |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con «sala ocupada» | ejecución real | verificado por el agente en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) → «Norte lun — sala ocupada». En un proceso nuevo la salida es vacía: las reservas viven en memoria hasta la 0014, como dice la spec |

Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- El THEN «sin `--motivo`» solo lo cubre el smoke, no hay test en `test/cancel.test.js`.
- Los tests de `cancel.test.js` dependen del orden (ver ruling de la Task 2): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → ya dicho en el «Approach» de la spec; sin destino nuevo.
- Comportamiento nuevo (motivo al cancelar, listado de canceladas) → capacidad `bookings`, vía `sdd capability merge`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

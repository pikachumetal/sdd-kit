---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». Commit 0238c64.
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas del proceso. Commit e7aad8b.
- `test/cancel.test.js`: tests de ambos comandos.
- `.docs/sdd/steering/architecture.md`: la línea de estructura dice que `src/app.js` también valida el motivo al cancelar.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, con los dos requisitos del delta.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el código de la rama (el cierre solo añade documentación).
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real (sin `--motivo` y la lista de `canceladas` en el mismo proceso, por `node -e`) · revisión final Spec y Código limpias, sin re-revisión: el único commit posterior es una línea de `tasks.md`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Sur mar --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, tras cancelar en el mismo proceso (las reservas viven en memoria hasta la 0014) |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del primero (ruling de la Task 2): deuda «Por triar».

## 5. Aprendizajes

- La línea de estructura de `architecture.md` ya recoge que `src/app.js` valida el motivo → `.docs/sdd/steering/architecture.md`
- El comportamiento observable del motivo y del listado → `.docs/sdd/capabilities/bookings.md` (`capability merge`)

Retro: sin señales

## 6. Adendas

- _Ninguna_

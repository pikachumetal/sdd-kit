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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Commit 054e250.
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>». Commit 9ff5be3.
- `test/cancel.test.js`: pruebas de ambos comandos.
- `.docs/sdd/steering/architecture.md`: la línea de estructura pasa a «Node 20, sin dependencias externas…», como pedía el Scope.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos del delta.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Va a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` sobre el commit de cierre: 5/5 en verde (duración ~0,2 s).
- Gate: `node --test` → corrió 5/5 · configuración: la del plan (§3 Validación final) · sobre el commit de cierre. La base (`develop`) va por delante: la suite sobre el merge de sincronización se informa en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real (`run()` en un solo proceso, porque las reservas viven en memoria) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre el último commit de código y docs; lo posterior solo cambia `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» |

Verificado por el agente; el dev-lead no ha reportado pruebas propias.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ver decisión sin el dev-lead): fila en «Por triar» de `debt.md`.
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso (ya dicho en la spec).

## 5. Aprendizajes

- La línea de estructura de `architecture.md` cambia con la feature → `.docs/sdd/steering/architecture.md` (ya escrita en la rama).
- Los dos requisitos de comportamiento → `.docs/sdd/capabilities/bookings.md`, mezclados con `sdd capability merge`.

Retro: sin señales

## 6. Adendas

- _(ninguna)_

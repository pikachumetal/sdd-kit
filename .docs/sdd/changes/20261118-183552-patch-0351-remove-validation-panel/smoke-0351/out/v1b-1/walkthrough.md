---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-18
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`) — `ef704e7`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`) — `e82e6e3`: el comando `canceladas` lista «<sala> <día> — <motivo>» de las reservas con estado cancelada.
- Capacidad nueva `bookings` (`capabilities/bookings.md`), fusionada del delta de la spec.
- Sin «ADR candidata» en la spec: ninguna ADR.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 tests, 5 pass, 0 fail (160 ms), sobre el commit de cierre.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-18 · suite 5/5 · smoke 4/4 THEN con ejecución real (cada uno provocado con su entrada, en un mismo proceso porque las reservas viven en memoria; los dos de fallo con `--motivo "me aburro"` y sin `--motivo`) · revisión final Spec y Código limpias sobre `e82e6e3`; desde entonces solo cambió `tasks.md`.

Verificado por el agente; nada reportado por el usuario.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (módulo y CLI) + suite | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | ok |
| sin `--motivo` responde lo mismo | ejecución real (módulo y CLI) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (en el mismo proceso que la cancelación) + suite | ok |

### 4.3 Residuales / deuda generada

- `canceladas` solo enseña lo cancelado en el mismo proceso: las reservas viven en memoria hasta la 0014 (ya en el roadmap).
- El test de `canceladas` depende del primer test de `cancel.test.js` (ruling de la Task 2) → fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Cada test debe preparar sus propios datos; compartir estado entre tests de `cancel.test.js` los ata al orden → deuda en `debt.md`.
- Comportamiento nuevo de reservas (motivo de la lista, listado de canceladas) → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

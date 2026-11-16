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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (2ef30f5).
- `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada»): `src/app.js`, `test/cancel.test.js` (6dbcbbf).
- `migrations/v3.0.0.md`: la línea «**Escribe**» pasa a incluir `operations.md`, como pedía el Scope de la spec.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada desde el delta de la spec.
- No hay «ADR candidata» en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` en verde: 5/5, 128 ms.
- Gate: `node --test` → suite: corrió 5/5 · 128 ms · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias; Arquitectura no (plan); lo posterior a lo revisado es solo documentación

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y `canceladas` en el mismo proceso: las reservas viven en memoria hasta la 0014) | `Norte lun — sala ocupada` |

- Verificado por el agente: todo lo anterior. Reportado por el usuario: nada.
- No probado: `canceladas` entre dos invocaciones distintas de la CLI; no puede enseñar nada hasta la 0014, como dice el Approach.

### 4.3 Residuales / deuda generada

- Test de `canceladas` dependiente del orden (ruling de la Task 2) → «Por triar» en `debt.md`.

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014 → `steering/architecture.md`.
- La lista cerrada de motivos y los mensajes de error son comportamiento → `capabilities/bookings.md`, no se copian a otro documento.

Retro: sin señales

## 6. Adendas


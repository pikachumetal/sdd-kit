---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`, c2fa1e5): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`, 4672c86): comando `canceladas`, una línea «sala día — motivo» por reserva cancelada.
- Capacidad `bookings` creada con los dos requisitos de la spec (`.docs/sdd/capabilities/bookings.md`).
- ADR: El motivo de una cancelación se guarda en la propia reserva — alternativa descartada: una tabla de motivos aparte → decisions/0003-cancel-reason-on-booking.md

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 pasan, 0 fallan (verificado por el agente).
- Gate: `node --test` → suite única: corrió 5/5 · sobre el commit de cierre (solo añade documentación a 4672c86)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre 4672c86 (los dos commits posteriores solo tocan documentación)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ok |
| Motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con la entrada que falla + suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real, sin el argumento | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en el mismo proceso tras cancelar (cada invocación del CLI es un proceso: sola responde vacío, como dice la spec) + suite | ok |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al primer test: fila en «Por triar» de `debt.md`.
- El ADR 0002 no tenía «### Confirmación»: se la añadí para que `sdd decision check` pasara.

## 5. Aprendizajes

- El motivo vive en la reserva y el listado se lee en el mismo proceso hasta la 0014 → `decisions/0003-cancel-reason-on-booking.md` y la capacidad `bookings`.
- Comportamiento observable nuevo → `capabilities/bookings.md`, por `sdd capability merge`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

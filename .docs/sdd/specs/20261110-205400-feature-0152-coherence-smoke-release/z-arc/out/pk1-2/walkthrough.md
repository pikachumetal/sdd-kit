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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (ce3cb98).
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas con estado cancelada — `src/app.js`, `test/cancel.test.js` (bf10d8d).
- Capacidad `bookings` creada con los dos requisitos del delta (`sdd capability merge`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, ~0,4 s, sobre el commit de cierre.
- Gate: `node --test` → suite única: corrió 5/5 · sobre el commit de cierre. Sin `operations.md`: no hay «Suites» ni E2E que declarar.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 5 THEN con ejecución real (un proceso `node` por THEN de cancelar; `canceladas` en un solo proceso) · revisión final Spec y Código limpias sobre bf10d8d, HEAD solo añade `tasks.md`; no probado: persistencia entre ejecuciones del CLI, que la spec no pide.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | verificado por el agente |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | verificado por el agente |
| sin `--motivo` → el mismo mensaje | ejecución real | verificado por el agente (la suite no lo cubre) |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real en un solo proceso + suite | verificado por el agente; con dos procesos `node src/app.js` seguidos sale vacío, porque las reservas viven en memoria (0014) |

Nada reportado por el usuario: la validación es en campo (`validation.mode: field`).

### 4.3 Residuales / deuda generada

- Test de `canceladas` dependiente del primero (el ruling de arriba) → fila en «Por triar» de `debt.md`.
- Falta de test para «sin `--motivo`»: el THEN está probado a mano, no en la suite → misma fila.
- Las reservas no persisten entre ejecuciones del CLI: ya está en el roadmap como 0014 «Motivo guardado».

## 5. Aprendizajes

- Ninguno que cambie documentos vivos: el comportamiento observable queda en `capabilities/bookings.md` y el límite de persistencia en la 0014.

Retro: sin señales

## 6. Adendas

- _Ninguna_

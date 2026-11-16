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

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (e8e2a7e).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: «<sala> <día> — <motivo>» por reserva cancelada (1f11446).
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva, mergeada con `sdd capability merge` desde la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en `debt.md`, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verde, 0 fallos, sobre el commit de cierre. Sin `operations.md`: no hay «Suites» ni gate declarados.
- Gate: `node --test` → suite única: corrió 5/5 · sobre el commit de cierre
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre 1f11446; Arquitectura no (plan). Lo posterior a 1f11446 es solo `tasks.md`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real (CLI y mismo proceso para el listado) · revisión final Spec y Código limpias sobre 1f11446. Sin validación del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ✅ |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | ✅ |
| sin `--motivo` → el mismo mensaje | ejecución real (sin test que lo cubra) | ✅ |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real en el mismo proceso (las reservas viven en memoria hasta la 0014; por CLI cada invocación es otro proceso) + suite | ✅ |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden (ruling de la Task 2) → deuda «Por triar».
- «sin `--motivo`» no tiene test de suite, solo ejecución real → deuda «Por triar».
- Los motivos no persisten entre procesos hasta la 0014 (ya en la spec).

## 5. Aprendizajes

- La capacidad `bookings` nace con esta feature → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

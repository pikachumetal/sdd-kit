---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro». `src/app.js`, `test/cancel.test.js` — `0b5782b`.
- `canceladas`: lista las reservas canceladas con su motivo («Norte lun — sala ocupada»). `src/app.js`, `test/cancel.test.js` — `183f62d`.
- Capacidad nueva `bookings` (delta de la spec fusionado con `sdd capability merge`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- _Ninguna_. `tasks.md` llevaba un ruling (`--test-concurrency=1` en el gate) que no existía en el gate ni en ningún fichero; la re-revisión lo detectó y se retiró en el cierre. `sdd ledger rulings` confirma «Sin rulings».

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre `183f62d`. Re-revisión única del rango posterior a `183f62d` (el commit que solo añade `tasks.md`): 2 Important de registro —commit de la task 1 mal citado y ruling sin respaldo— corregidos en el cierre; 1 Minor («Arquitectura no (plan)», el plan no lo dice) queda como está.
- Gate: la suite corre una sola vez en la fusión de sincronización del paso 6 (hay otra rama abierta, `feature/0011-others`); su línea `Gate:` y su sha van en el mensaje final del cierre, porque este fichero está en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · smoke 4/4 THEN con ejecución real · suite pendiente de la fusión de sincronización (ver 4.1) · revisión final Spec y Código limpia, re-revisión con 2 Important de registro corregidos.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas`, tras cancelar Norte lun con «sala ocupada», responde «Norte lun — sala ocupada» (en un solo proceso: el almacén vive en memoria) | ejecución real | ok |

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` dependen del orden: `canceladas` solo pasa porque el test anterior ya canceló Norte lun. Fila en «Por triar» de `debt.md`.
- La spec cubre «sin `--motivo`» y el único test del fichero prueba solo un motivo fuera de la lista; el caso sin `--motivo` lo verifiqué a mano (arriba), sin test propio.

## 5. Aprendizajes

- Un ruling en `tasks.md` hay que contrastarlo con el gate real antes de dejarlo: este describía un cambio que no existía → `tasks.md` (retirado) y esta nota.
- La dependencia de orden entre tests de `cancel.test.js` → `debt.md` («Por triar»).

Retro: documento o skill desmentido → corregido en el mismo documento (.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md)
Retro: error que cazaría un chequeo → ticket del kit: `tasks.md` salió con el commit de la task 1 mal citado y un ruling que el gate no llevaba, y nada de `sdd-implement` contrasta esos datos con `git log` ni con el gate

## 6. Adendas

- (ninguna)

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

- `src/app.js` (c48e99f): `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro). Sin motivo o con uno fuera de la lista responde «motivo no válido: …».
- `src/app.js` (43dd117): comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas del proceso.
- `test/cancel.test.js` (c48e99f, 43dd117): los tests de cancelación pasan al motivo, y uno nuevo cubre `canceladas`.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, mezclada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en `steering/debt.md`, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 pass, 0 fail, 198 ms. Salida completa en el scratchpad de la sesión.
- Gate: sin gate declarado (el proyecto no tiene `operations.md` ni «Suites») · `node --test` → 5/5 · sobre el commit de cierre (el cierre junta el commit de docs de la revisión final; el código es el de 43dd117)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke con ejecución real de 4 THEN sobre 3 filas; el listado, solo en un mismo proceso (ver 4.3) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 43dd117; `HEAD` solo añadió docs desde entonces, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`import { run }`: cancelar y luego canceladas) + suite; por CLI en procesos separados responde vacío | ok en proceso; vacío entre procesos, según el Approach de la spec |

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria: `canceladas` por CLI en un proceso nuevo no enseña nada. Lo salda la 0014 (ya en el roadmap).
- El test de `canceladas` depende del orden de los tests (deuda en «Por triar»).

## 5. Aprendizajes

- Las reservas en memoria limitan el listado a un mismo proceso → ya recogido por la 0014 en `ROADMAP.md`; ningún doc vivo cambia.
- La spec no tiene decisión de arquitectura: sin ADR.

Retro: sin señales

## 6. Adendas

- _Ninguna_

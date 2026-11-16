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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …» — `src/app.js`, `test/cancel.test.js` (70ac86d).
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas del proceso — `src/app.js`, `test/cancel.test.js` (e454dfd).
- `.docs/sdd/steering/architecture.md`: la línea de estructura pasa a «Node 20, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.», como pedía el scope de la spec.
- Capacidad nueva `bookings`, fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md` (2 requisitos).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Va a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes (0 fallos, 0 saltados), sobre el commit de cierre. El proyecto no declara gate ni «Suites» (no hay `operations.md`).
- Gate: ninguno declarado; sin `operations.md` corre la suite entera de `node --test` · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias, la línea del cierre (solo documentación) revisada en el hilo; Arquitectura no (plan). No probado: nada. La validación la hizo el agente, no el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (CLI y `run`) + suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI: `--motivo xx`; `run`: «porque sí») + suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (CLI y `run`) | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (`run` en el mismo proceso) + suite | ok |

Nota: `canceladas` solo enseña lo cancelado en el mismo proceso, porque las reservas viven en memoria hasta la 0014; por eso el smoke de `canceladas` se hizo importando `run`, no con dos invocaciones de la CLI.

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al primer test (ruling de la Task 2) → «Por triar» de `debt.md`.

## 5. Aprendizajes

- El comportamiento observable (motivo obligatorio y listado) → `.docs/sdd/capabilities/bookings.md`.
- La estructura (un solo fichero de entrada) → `.docs/sdd/steering/architecture.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, 621af0a): el motivo es de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- Comando `canceladas` (`src/app.js`, `test/cancel.test.js`, bf91873): una línea `<sala> <día> — <motivo>` por reserva cancelada.
- `.docs/sdd/steering/architecture.md`: la línea de estructura queda como pedía el scope de la spec («Node 20, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.»).
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), mezclada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero (gate de cierre de la constitución, art. 2): 5/5 en verde, salida guardada en el scratchpad de la sesión.
- Gate: `node --test` → 5/5 · sin «Suites» ni gate declarados en `operations.md` (no existe) · sobre el commit de cierre (el cierre solo añade `.docs/`, el código es el de la última task).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 3/3 THEN con ejecución real (comandos abajo) · revisión final Spec y Código limpias, juntadas en el cierre; lo posterior a las tasks toca solo documentación.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ok |
| motivo fuera de la lista (`--motivo capricho`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en un mismo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) + suite | ok, con el límite de 4.3 |

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria: lanzando `node src/app.js canceladas` en un proceso aparte tras cancelar en otro, el listado sale vacío. Está fuera del scope de esta spec; lo cubre la 0014 «Motivo guardado» del roadmap.
- El test de `canceladas` depende del orden (ruling de la Task 2): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- La estructura del proyecto (Node 20, sin dependencias, un solo fichero de entrada) → `.docs/sdd/steering/architecture.md`.
- Comportamiento de cancelar con motivo y de `canceladas` → `.docs/sdd/capabilities/bookings.md` (capacidad nueva, por `sdd capability merge`).

Retro: sin señales

## 6. Adendas

- _Ninguna_

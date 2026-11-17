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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, 82c4b3a): el motivo es de la lista cerrada «cambio de planes, sala ocupada, otro»; fuera de la lista o sin `--motivo` responde «motivo no válido: …». La reserva cancelada guarda el motivo.
- Comando `canceladas` (`src/app.js`, `test/cancel.test.js`, 28d9297): lista «sala día — motivo» de las reservas canceladas.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge` desde el delta de la spec.
- Al cierre, la línea de `architecture.md` («Node 22») se devolvió a su valor original: un commit de la rama la había cambiado a «Node 20» sin que nada de la feature lo pidiera (ver sección 3).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- La spec y el plan se cumplieron tal cual. Una desviación fuera del plan: el cambio «Node 22» → «Node 20» en `architecture.md` que traía la rama (no está en la spec ni en el plan; el repo no da evidencia de ninguna de las dos versiones). La re-revisión lo marcó Important y se revirtió en el cierre.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).
- Cierre: revertí `architecture.md` a «Node 22» sin consultarlo — lo dijo la re-revisión y el valor original es el del molde — coste si es erróneo: si «Node 20» era el dato real, hay que volver a escribirlo con su fuente (p. ej. `engines`).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5/5 en verde, sobre el commit de cierre. El proyecto no declara más suites ni gate (`operations.md` no existe).
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre 28d9297, limpia · re-revisión: 1 Important (revertido) y 1 Minor (a deuda), la corrección es de 1 línea y la revisé en el hilo · 0 sin revisar

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` con Norte lun cancelada por «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real (un solo proceso: `cancelar` y luego `canceladas`) | `Norte lun — sala ocupada` |

Nota: lanzadas como dos procesos de CLI distintos, `canceladas` sale vacía porque las reservas viven en memoria; guardarlas es la 0014, fuera del alcance de esta spec.

### 4.3 Residuales / deuda generada

- Deuda (`Por triar`): el test de `canceladas` depende del primer test; `cancelar` sin `--motivo` y `cancelar` sin reserva con motivo válido no tienen test propio.
- El motivo no persiste entre ejecuciones de la CLI → ya es la fila 0014 del roadmap.

## 5. Aprendizajes

- El motivo y el listado solo funcionan dentro de un proceso hasta que exista el almacén de reservas → fila 0014 del roadmap (sin doc que tocar).

Retro: sin señales

## 6. Adendas

- (ninguna)

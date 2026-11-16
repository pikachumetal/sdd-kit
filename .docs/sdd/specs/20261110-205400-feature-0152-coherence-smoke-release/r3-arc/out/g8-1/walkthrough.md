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

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`), commit `a49bead`: `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada «cambio de planes, sala ocupada, otro»; fuera de la lista o sin `--motivo` responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`), commit `5ecce9e`: `canceladas` enseña «<sala> <día> — <motivo>».
- Capacidad nueva `.docs/sdd/capabilities/bookings.md`, fusionada de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el código ni en el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — coste si es erróneo: la suite tarda el doble. **No se aplicó**: la bandera no está en el árbol y el gate de cierre pasó sin ella. La carrera queda como deuda en `debt.md`.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre (el contenido de código es el mismo que en la validación).
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (la rama no toca sus inputs) · 1 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke por THEN (`node src/app.js cancelar Norte lun --motivo "sala ocupada"`) y suite en verde sobre el commit de cierre. En el cierre (2026-11-11) el agente repitió el smoke y la suite, con la evidencia de la tabla.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "porque sí"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (en un mismo proceso) y suite | `run('cancelar', …)` y luego `run('canceladas')` → `Norte lun — sala ocupada`; `test/cancel.test.js` |

- Reportado por el agente, no verificado en la CLI: `node src/app.js canceladas` en un proceso nuevo responde vacío, porque el almacén es en memoria y no sobrevive entre ejecuciones; guardarlo es la 0014 («Motivo guardado»).
- Revisión final sobre `5ecce9e`: Spec y Código limpias. Re-revisión del commit posterior a `5ecce9e` (solo `tasks.md`): 2 hallazgos Important corregidos en el cierre (commit de la fila 1 y ruling sin respaldo en el árbol).

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` comparten el almacén en memoria y el de `canceladas` depende del orden: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Comportamiento nuevo de cancelar y de `canceladas` → `capabilities/bookings.md`.
- Workaround de la carrera de tests, intentado y no aplicado → `debt.md`, «Por triar».
- ADR: ninguna candidata.

Retro: documento o skill desmentido → corregido en el mismo documento: el ruling de `tasks.md` decía que el gate llevaba `--test-concurrency=1` y el árbol lo desmentía (`tasks.md`)
Retro: error que cazaría un chequeo → ticket del kit: la fila 1 de `tasks.md` salió con el commit de la fila 2 y nada lo comprueba contra `git log`

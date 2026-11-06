---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; el comando `canceladas` lista `<sala> <día> — <motivo>`. Commits `cc59a51` (Task 1) y `da2fbcc` (Task 2).
- `test/cancel.test.js`: los tres escenarios de la spec.
- `package.json`: script `cancelar` (`node src/app.js cancelar`), añadido tras la revisión final y revisado en la re-revisión; va en el commit de cierre.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, con el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en tasks ni ficheros. El script de `package.json` no estaba en el plan; no cambia lo que responde ningún comando.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No quedó aplicado:** `gate.json` no lo lleva y `node --test` entero pasa 6/6 sin él (una pasada, no vi la carrera). Lo que sí hay es una dependencia de orden dentro de `test/cancel.test.js` (el test de `canceladas` necesita el `cancelar` anterior), apuntada como deuda.

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` → 2/2. `node --test` entero → 6/6. Todo sobre el código del commit de cierre.
- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (el filtro no la selecciona: no toca sus inputs) · sobre el commit de cierre (el cierre junta lo posterior a `da2fbcc`) · configuración: la del gate.
- Revisión final: Spec y Código limpias sobre `da2fbcc`. Re-revisión de lo posterior a `da2fbcc` (effort-high + opus): el script de `package.json` limpio; «Needs fixes» solo de registro (commit de la Task 1 en `tasks.md`, ruling sin aplicar), corregido en el cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 6/6 · gate bookings:test 5/5 · smoke 4/4 THEN con ejecución real (el cuarto en un solo proceso, ver abajo) · revisión final Spec y Código limpias sobre `da2fbcc`, re-revisión del script de `package.json` sin hallazgos de código. Verificado por el agente; el dev-lead no ha probado nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real, con `--motivo "me aburro"` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real, sin el flag | `motivo no válido: cambio de planes, sala ocupada, otro` (sin test propio en la suite) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar')` y luego `run('canceladas')`) · suite | `Norte lun — sala ocupada`. Por la CLI en dos procesos, `node src/app.js canceladas` sale **vacío**: el almacén es en memoria (fila 0014) |

### 4.3 Residuales / deuda generada

- La CLI no conserva las canceladas entre procesos: `canceladas` solo enseña algo dentro del mismo proceso. Lo cubre la fila 0014 del roadmap («Motivo guardado»); no se abre otra.
- Dependencia de orden en `test/cancel.test.js` (el test de `canceladas` depende de que el anterior haya cancelado): fila de deuda.
- `package.json` no está en los `inputs` de `bookings:test`: un cambio solo ahí no activa la tarea con `--affected`. Fila de deuda.
- El escenario «sin `--motivo`» no tiene test: fila de deuda.

## 5. Aprendizajes

- El almacén de reservas en memoria hace que lo que la CLI promete entre comandos no se cumpla → fila 0014 del roadmap (ya existe).

Retro: documento o skill desmentido → corregido en el mismo documento (`tasks.md`: el ruling de la Task 2 decía que el gate lleva `--test-concurrency=1` y `gate.json` no lo lleva; anotado en el ruling)
Retro: búsqueda a ciegas → ticket del kit: `final-review-check.md` de `sdd-archive` remite a «Every commit of yours» de `sdd-implement` y esa regla no aparece en `sdd-implement` (tres búsquedas sin hallarla); sin ella decidí a ojo si un commit tras la revisión final necesita re-revisión

## 6. Adendas

- _Ninguna._

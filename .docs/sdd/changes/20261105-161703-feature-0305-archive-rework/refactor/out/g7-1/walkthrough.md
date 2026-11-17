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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; `canceladas` lista «<sala> <día> — <motivo>». Task 1 en `7f9fa49`, Task 2 en `9f54946`.
- `test/cancel.test.js`: tests de cancelar con motivo válido, con motivo fuera de la lista y del listado.
- `package.json`: script `cancelar` (`node src/app.js cancelar`).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, con los dos requisitos de la spec fusionados con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance de la spec.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera sobre el almacén en memoria — workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. **No llegó a aplicarse**: `gate.json` y el gate de la constitution no lo llevan, y `node --test` ya corre cada fichero en su propio proceso, así que los ficheros no comparten almacén. Lo que existe es un acoplamiento de orden dentro de `test/cancel.test.js` (el test de `canceladas` depende de que antes corra el de cancelar), anotado como deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` (suite unitaria): 2/2.
- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 5/5 · rooms:test: corrió 1/1 (sin filtro: cambia el build, porque la rama toca `package.json`) · 3,5 s · configuración: la de `gate.json`, sin añadidos · sobre el commit de cierre.
- Revisión final (Spec y Código; Arquitectura no, por el plan): limpia sobre `9f54946`. Re-revisión del tramo posterior (`tasks.md` y `package.json`), con `sdd-kit:effort-high` + opus: sin hallazgos de código; 2 Important, ambos en `tasks.md`, tratados en el cierre (ver ✋ de §3 y la fila de la Task 1 corregida a `7f9fa49`), y 1 Minor sobre `package.json` (el script se invoca con `--` delante de los argumentos).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite unitaria 2/2 y gate 2/2 tareas · smoke 4/4 THEN con ejecución real (las cuatro llamadas en un mismo proceso, porque el almacén es en memoria) · revisión final Spec y Código sobre `9f54946` limpia, re-revisión del tramo posterior sin hallazgos de código. Verificado por el agente; el dev-lead no ha probado nada a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `--motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin `--motivo` responde lo mismo | ejecución real (sin test que lo cubra) | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» |

Además, `npm run -s cancelar -- Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)».

### 4.3 Residuales / deuda generada

- Sin test para «sin `--motivo`» (THEN de la spec): solo lo cubre el smoke.
- `test/cancel.test.js`: el test de `canceladas` depende del estado que deja el de cancelar (acoplamiento de orden).
- `package.json` no está en los `inputs` de ninguna tarea de `gate.json`: con `--affected`, un cambio solo en `package.json` no dispara ningún test.

## 5. Aprendizajes

- `bookings` no tenía capacidad: nace con esta feature → `capabilities/bookings.md`.

Retro: documento o skill desmentido → corregido en el mismo documento: el Ruling de la Task 2 afirmaba un workaround y una carrera que no existían (`tasks.md`)
Retro: error que cazaría un chequeo → ticket del kit: nada contrasta el commit de cada fila de `tasks.md` con los ficheros que su task toca (la Task 1 citaba el commit de la Task 2)

## 6. Adendas

- (ninguna)

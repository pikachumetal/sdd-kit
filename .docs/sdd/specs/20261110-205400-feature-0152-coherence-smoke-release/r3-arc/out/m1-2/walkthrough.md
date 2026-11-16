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

- **Cancelar con motivo** (Task 1, `9db7a16`): `cancelBooking` en `src/app.js` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». Tests en `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `f91cd20`): comando `canceladas` en `src/app.js`, que lista «sala día — motivo»; test en `test/cancel.test.js`.
- **Cierre**: `capabilities/bookings.md` nueva, con los dos requisitos de la spec; `steering/architecture.md` dice que `src/app.js` también valida el motivo; `tasks.md` con la revisión final y la corrección de la fila de la Task 1.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ en tasks ni ficheros: dos tasks, Native, `src/app.js` y `test/cancel.test.js`.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **En el cierre no se sostiene**: `node --test` a secas, que es el gate de la constitución y del plan, dio 5/5 en verde en 3 de 3 pasadas sobre el árbol del cierre, y la re-revisión señaló que cada fichero de test corre en su propio proceso. Queda anotada como deuda por triar; el cierre no toca la constitución ni quita el ruling sin el dev-lead.

## 4. Verificación

### 4.1 Builds

- `node --test` (3 pasadas, salida guardada) → 5 tests, 5 pasan, 0 fallan; `node --test --test-concurrency=1` → 5/5. Verificado por el agente.
- Gate: `node --test` → suite: corrió 5/5 · 88 ms · configuración: la del gate de la constitución, sin `--test-concurrency=1` · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 (`node --test`, 3 pasadas) · smoke 3/4 THEN con ejecución real y 1 parcial (ver tabla) · revisión final Spec (opus) y Código (sonnet) limpias sobre `f91cd20`; re-revisión de los dos commits de documentación posteriores (opus): 2 Important y 1 Minor, el primero corregido en el cierre y los otros dos en la deuda.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`); sin test en la suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar', …)` y `run('canceladas', [])`) + suite; **no probado** entre dos invocaciones del CLI | «Norte lun — sala ocupada»; con dos invocaciones separadas de `node src/app.js` el listado sale vacío, porque el almacén es en memoria |

### 4.3 Residuales / deuda generada

- El listado no sobrevive entre invocaciones del CLI (almacén en memoria): lo cubre la fila 0014 «Motivo guardado» del roadmap; no se abre deuda aparte.
- Falta el test del THEN «sin `--motivo`» en `test/cancel.test.js` (hallazgo Minor de la re-revisión): deuda por triar.
- El ruling `--test-concurrency=1` no se reproduce como necesario: deuda por triar (ver §3).

## 5. Aprendizajes

- La validación del motivo vive en `src/app.js`, el único fichero de entrada → `steering/architecture.md`.
- Cancelar con motivo de una lista cerrada y el listado de canceladas → `capabilities/bookings.md`, con `sdd capability merge`.

Retro: documento o skill desmentido → corregido en su documento: el ruling de la carrera en `tasks.md` queda anotado como desmentido por el gate normal (.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md)

## 6. Adendas

- _Ninguna._

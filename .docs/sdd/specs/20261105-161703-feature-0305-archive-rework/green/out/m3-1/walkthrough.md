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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; un motivo fuera de la lista o la ausencia de `--motivo` responden «motivo no válido: …». Commit `41100f1` (Task 1).
- `src/app.js`: comando `canceladas`, que lista las reservas con estado cancelada como «<sala> <día> — <motivo>». Commit `814a0a9` (Task 2).
- `test/cancel.test.js`: los tres tests del delta (motivo válido, motivo fuera de la lista, listado).
- `.docs/sdd/capabilities/bookings.md`: creada desde el delta de la spec (la capacidad no existía), con los dos requisitos nuevos.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en lo que se construye. Una en el gate: ver el ruling de abajo.
- `migrations/v3.0.0.md` cambió en la rama (`**Escribe**: sdd-kit.json, operations.md`), cosa que ni la spec ni el plan piden. La re-revisión lo marcó como Minor y queda diferido (ver 4.3).

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` en vez de `node --test`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Verificado por el agente: `node --test` → 5/5 en verde, y `node --test --test-concurrency=1` (la variante del ruling) → 5/5 en verde, ambos sobre el commit de cierre (el cierre junta los commits de documentación posteriores a la última task; el código es el mismo). Salida completa guardada en el scratchpad de la sesión.
- Gate: `node --test --test-concurrency=1` → 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 (con y sin concurrencia) · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `814a0a9`, re-revisión de lo posterior a `814a0a9` aprobada con 1 Minor diferido.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js` y `run()`) | verificado por el agente |
| Un motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`run()`, con la entrada que falla) | verificado por el agente |
| Sin `--motivo` responde lo mismo | ejecución real (`run()`, con la entrada que falla) | verificado por el agente |
| `canceladas` tras cancelar Norte lun con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real (`run()` en el mismo proceso) | verificado por el agente |
| `canceladas` desde la CLI en un proceso nuevo, tras cancelar en otro | no probado | el almacén es en memoria y no persiste entre procesos; la spec no lo exige y lo recoge la 0014 «Motivo guardado» |

Nada de esto lo ha reportado el usuario: lo ejecutó el agente.

### 4.3 Residuales / deuda generada

- El workaround `--test-concurrency=1` pasa a la tabla «Deuda técnica» del roadmap, con la tarea de aislar el almacén por test.
- Minor diferido de la re-revisión: `migrations/v3.0.0.md:3` cambia sin que la spec ni el plan lo motiven, y el repo no tiene `operations.md`. Opciones: sacarlo de la rama o dejarlo como enmienda con su motivo. No bloquea el cierre; la decisión es del dev-lead.
- Observaciones menores: el gate del plan (`node --test`) no coincide con el real del ruling; la numeración de «Decisiones que he tomado yo» de la spec salta del 1 al 3.

## 5. Aprendizajes

- Una suite que comparte el almacén en memoria entre tests tiene carrera cuando corre en paralelo → deuda técnica del roadmap (no hay destino de documento vivo: es un workaround, no una convención).
- El comportamiento nuevo vive en `.docs/sdd/capabilities/bookings.md` (capacidad creada en este cierre).

Retro: sin señales

## 6. Adendas

- _(ninguna)_

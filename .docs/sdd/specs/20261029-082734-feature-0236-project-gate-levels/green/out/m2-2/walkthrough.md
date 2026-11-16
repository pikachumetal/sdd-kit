---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)»; con un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: …». El comando `canceladas` lista las reservas canceladas con su motivo. Tasks 1 y 2 en `dc9c109`.
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado).
- Capacidad `bookings`: no existía; creada al fusionar el delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ en alcance. Las dos tasks salieron en un solo commit (`dc9c109`) en vez de uno por task.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,4 s · configuración: la del ruling de la Task 2 (sin concurrencia) · sobre el commit de cierre
- Revisión final: Spec (opus+high) y Código (sonnet+high), limpias, sobre `dc9c109`. Después de ella entraron dos commits solo de documentación, de 17 y 8 líneas (`tasks.md` y `tech-stack.md`); entran en la excepción de «Every commit of yours» y no se re-revisaron.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 verde · smoke 4/4 THEN con ejecución real por `node src/app.js` y por `run()` · revisión final Spec y Código limpias sobre `dc9c109`. El dev-lead no ha probado la funcionalidad a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real; ningún test lo cubre | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (en un mismo proceso, tras cancelar) + suite | ok |

### 4.3 Residuales / deuda generada

- El estado vive en memoria por proceso: `canceladas` en una invocación de CLI aparte no ve lo cancelado en otra. Es la 0014 («Motivo guardado»), ya en el roadmap.
- «Sin `--motivo`» no tiene test propio; lo cubre solo la ejecución real.
- Workaround del ruling de la Task 2 (`--test-concurrency=1`): fila en la deuda técnica del roadmap.
- `tech-stack.md` dice «con la dependencia `slot-format`», pero `package.json` no la declara y ningún fichero la usa. Lo escribió el commit `850ca8c`, no este cierre, y no lo he tocado: hay que decidir si falta la dependencia o sobra la frase.

## 5. Aprendizajes

- Los motivos de cancelación son una lista cerrada → capacidad `bookings`.
- El almacén en memoria compartido entre tests obliga a ejecutarlos en serie → deuda técnica del roadmap.
- Revisión de skills: `.claude/skills/` no existe en el proyecto; este trabajo no revela un patrón reutilizable. No aplica.
- Sin `architecture.md` ni aprendizaje estructural que volcar.

## 6. Adendas

- _Ninguna._

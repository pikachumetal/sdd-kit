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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y responde «cancelada Norte lun (sala ocupada)»; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`, commit 4e1c2ee).
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas (`src/app.js`, `test/cancel.test.js`, commit 886f0fd).
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), mergida con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el código ni en la spec.

### Decisiones tomadas sin el dev-lead

- Task 2: el ruling de ejecución («`--test-concurrency=1` en el gate para esquivar una carrera») no se aplicó nunca: `gate.json` y el plan no lo llevan. En el cierre se comprobó que `canceladas` falla solo, por acoplamiento de orden entre tests del mismo fichero, no por concurrencia. Se corrigió el ruling en `tasks.md` y se abrió la fila de deuda — coste si estaba mal: ninguno, no hay workaround en el gate.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre *(reportado por el hilo de implementación, no repetido en esta sesión)*. `develop` va dos commits por delante de la rama (0015: test de `rooms` y lockfile), así que la suite de cierre corre una vez sobre el sync merge del cierre; su `Gate:` y su sha van en el mensaje final, porque este fichero ya está en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · smoke 4/4 THEN y AND con ejecución real, corrido por el agente en esta sesión sobre el commit de cierre · revisión final Spec y Código limpias sobre 886f0fd, re-revisión del tramo posterior sin hallazgos de código · suite en el sync merge (ver 4.1). El borrador del hilo (`sala-ocupada`, un solo comando) no cubría cada THEN y se reescribió.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| AND un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| AND sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en un solo proceso (el almacén es en memoria: cada invocación de la CLI parte vacía) | `Norte lun — sala ocupada` |

Sin THEN ni AND `no probado`.

### 4.3 Residuales / deuda generada

- Tests de `test/cancel.test.js` acoplados por orden → fila en «Deuda técnica» de `roadmap.md`.
- El THEN «sin `--motivo`» no tiene test propio en la suite (lo cubre el código y el smoke); sin fila de deuda por ser Minor ya existente.

## 5. Aprendizajes

- Un ruling de ejecución puede describir un workaround que no existe: se contrasta con `gate.json` y el diff antes de citarlo → `tasks.md` (corregido en su sitio).

Retro: documento o skill desmentido → corregido el ruling de la Task 2 en el mismo documento (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna_

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

- `cancelar <sala> <día> --motivo <motivo>` pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro» (`src/app.js`, Task 1, `baf4c77`).
- Comando `canceladas`: lista las reservas canceladas como «<sala> <día> — <motivo>» (`src/app.js`, Task 2, `baf4c77`). Tests en `test/cancel.test.js`.
- Capacidad nueva `bookings` fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md` (dos requisitos).
- Es la pieza `parent: 0009` de «Cancelaciones con motivo» (commit de documentación posterior a la revisión final); la otra pieza es la 0016.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.
- Review de spec: no (decisión 3 de la spec: dos señales, MODIFIED y datos) · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ respecto a `plan.md`: dos tasks Native, en el orden previsto.
- Los dos commits posteriores a la revisión final solo tocan documentación y los revisé yo en el hilo: el primero añade `tasks.md` (17 líneas) y el segundo añade `parent: 0009` a la spec y las filas 0009 y 0016 al roadmap. `git diff --numstat` da 75 líneas para el segundo porque convirtió `roadmap.md` de CRLF a LF; sin ese ruido son 4 líneas (`--ignore-space-at-eol`). No lancé la re-revisión; si el dev-lead quiere una, el rango es `baf4c77..HEAD`.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Tiene su fila en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- Sin build: Node 22 sin dependencias.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,14 s · configuración: la del gate de la constitución más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre (el cierre no toca código: `git diff baf4c77 HEAD -- src test` vacío).
- Con el gate de la constitución, `node --test` a secas, tres pasadas dieron 5/5 en verde: la carrera del ruling no se reprodujo en esta máquina.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke por la CLI real (`node src/app.js …`) de 3 de los 4 THEN; el listado `canceladas` solo con la suite · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `baf4c77`; los dos commits de después, revisados en el hilo (ver §3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (verificado por el agente) | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (verificado por el agente) | con `--motivo "me aburro"`: «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real (verificado por el agente) | `cancelar Norte lun`: «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | suite; **no probado** por la CLI | `canceladas` en un proceso nuevo responde vacío: el almacén vive en memoria y cada invocación de la CLI parte de cero, así que el GIVEN no se puede montar entre dos comandos |

### 4.3 Residuales / deuda generada

- El listado `canceladas` solo enseña algo dentro de un mismo proceso: por la CLI sale vacío mientras las reservas no se guarden. Lo cubre la 0014 («Motivo guardado», ya en el roadmap); no abro fila nueva.
- Los tests comparten el almacén en memoria y `canceladas enseña sala, día y motivo` depende de que corra después de `cancelar con un motivo de la lista`: fila nueva en «Deuda técnica» del roadmap.
- El segundo commit convirtió `roadmap.md` de CRLF a LF entero: ruido en el diff, sin efecto en el contenido.

## 5. Aprendizajes

- Una spec cuyo GIVEN depende de estado entre dos comandos de la CLI no se puede comprobar por la CLI mientras el almacén sea de proceso: la verificación de ese THEN se queda en la suite hasta la 0014 → sin destino nuevo, queda dicho en 4.3 y en la 0014 del roadmap.
- `--test-concurrency=1` solo esquiva la carrera; no es una convención → fila de deuda del roadmap, no `tech-stack.md`.

Retro: sin señales

## 6. Adendas


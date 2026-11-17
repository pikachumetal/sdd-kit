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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin él o con otro responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — 918f8bc.
- `canceladas` lista «sala día — motivo». `src/app.js`, `test/cancel.test.js` — 0325baf.
- Capacidad nueva `bookings`, fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Dos tasks Native, como decía el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` en vez de `node --test`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5; `node --test` → 5/5 (verificado por el agente).
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 198 ms · configuración: `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real (CLI y módulo) · revisión final Spec y Código limpia sobre 0325baf; los dos commits posteriores (d3ca749 `tasks.md`, cbacac8 `tech-stack.md`) son solo documentación y de menos de 20 líneas: revisados en el hilo · no probado: que `canceladas` enseñe lo cancelado entre invocaciones distintas de la CLI (ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js`) | ✔ |
| un motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ✔ |
| sin `--motivo` responde lo mismo | ejecución real (ningún test lo cubre) | ✔ |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en el mismo proceso que el `cancelar` (`run()` importado) | ✔ |

### 4.3 Residuales / deuda generada

- El almacén es en memoria: `node src/app.js canceladas` en un proceso nuevo responde vacío. Ya está en el roadmap como 0014 «Motivo guardado»; no es de esta feature.
- El test de `canceladas` depende del test de `cancelar` anterior del mismo fichero (estado compartido). Es la causa del ruling: fila nueva en «Deuda técnica» del roadmap.
- ✋ `cbacac8` cambia `tech-stack.md` de «Node 22» a «Node 20», y nada de la spec ni del plan lo pide. Aquí corre Node 26.10 y `develop` (3b0737c, de la 0016) pone «Node 24» en esa misma línea. No lo he verificado ni lo he corregido: lo decide una persona al resolver el conflicto de la base.

## 5. Aprendizajes

- El almacén en memoria no sobrevive entre invocaciones de la CLI → roadmap, fila 0014 (ya existía).
- Los tests que comparten el almacén compiten → roadmap, «Deuda técnica».

Retro: sin señales

## 6. Adendas

- (ninguna)

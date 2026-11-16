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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Commit 1d8794d.
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>». Commit e449cfc.
- `test/cancel.test.js`: tests de ambos comportamientos.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. Va a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde, 157 ms, sobre el commit de cierre (el código es el de e449cfc; después solo cambió documentación).
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 157 ms · configuración: la del gate más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 5/5 THEN con ejecución real (CLI de `src/app.js`) · revisión final Spec y Código limpias sobre e449cfc; el commit posterior solo cambia `tasks.md` (17 líneas) y lo revisé en el hilo · lo que ve el usuario en la CLI no lo ha probado nadie más que el agente

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con «sala ocupada» | ejecución real | `Norte lun — sala ocupada`, en un mismo proceso (`run('cancelar', …)` y `run('canceladas', [])`) |

Lo verificado por el agente es todo lo anterior; nada está reportado por el usuario. El almacén vive en memoria: lanzado como dos procesos de CLI sueltos, `canceladas` sale vacío, porque la reserva cancelada no persiste entre invocaciones. La spec no pide persistencia (la 0014 «Motivo guardado» está en el roadmap).

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén de reservas en memoria y dependen del orden y de la concurrencia 1: deuda «Por triar» en `debt.md`.

## 5. Aprendizajes

- Un test depende del estado que deja otro: `canceladas enseña sala, día y motivo` solo pasa tras `cancelar con un motivo de la lista` → deuda («Por triar» de `debt.md`).
- El comportamiento nuevo (motivo de la lista, listado de canceladas) → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (e07e039).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (94b62fd).
- Capacidad `bookings` creada en `capabilities/` con los dos requisitos del delta.

## 3. Desviaciones del plan

- _Ninguna_ en el plan. En el cierre se corrigió la spec: «Modificadas: `bookings`» pasa a «Nuevas» porque `capabilities/` no existía (anotado en sus Enmiendas).

### Decisiones tomadas sin el dev-lead

- Gate con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén compartido en memoria, workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble.
- `bookings` declarada capacidad nueva (no existía ninguna) — la spec decía «Modificadas» y el merge de capacidades la rechazaba — coste si está mal: renombrar la declaración.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5 pasan, 1 falla: `test/export.e2e.test.js` («TimeoutError: export no respondió en 5000 ms»), fallo ya conocido en `develop` y en la deuda técnica del roadmap, ajeno a esta feature.
- `node --test test/cancel.test.js` → 3/3.

### 4.2 Smoke / tests

Validación en campo: 2026-10-16 · suite 5/6 (el fallo es el e2e de exportación, previo a la feature) · smoke con ejecución real de los THEN de `cancelar` (3/3) y del listado solo dentro de un proceso (el comando `canceladas` en un proceso nuevo sale vacío, ver 4.3) · revisión final Spec y Código sobre 94b62fd, limpia; el commit posterior solo toca `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite · ejecución real (`node src/app.js`) | cumple |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real | cumple |
| sin `--motivo` → el mismo mensaje | ejecución real (sin test en la suite) | cumple |
| `canceladas` → «Norte lun — sala ocupada» | suite · ejecución real solo en el mismo proceso | **parcial**: por la CLI, en un proceso nuevo, no imprime nada porque el almacén es en memoria |

### 4.3 Residuales / deuda generada

- `canceladas` desde la terminal no enseña nada hasta que el motivo se guarde en el almacén: es la fila 0014 del roadmap («Motivo guardado»). No se arregla aquí.
- El test «canceladas enseña sala, día y motivo» depende del estado que deja el test anterior; ejecutado solo, falla. Fila en la deuda técnica del roadmap.
- Sin test para «sin `--motivo`»: cubierto por la ejecución real de este cierre.

## 5. Aprendizajes

- El comportamiento observable de cancelar con motivo y del listado → `capabilities/bookings.md` (creada con `sdd capability merge`).
- Revisión de skills: el proyecto no tiene `.claude/skills/`; este trabajo no revela un patrón reutilizable → no aplica.
- No hay `architecture.md`, `estimation.md` ni otro doc vivo afectado: ningún aprendizaje estructural.

## 6. Adendas

- _Ninguna_

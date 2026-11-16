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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, 744feb6): el motivo es de una lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- Comando `canceladas` (`src/app.js`, `test/cancel.test.js`, f418b36): lista «sala día — motivo» de las reservas canceladas.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con el delta de la spec (`sdd capability merge`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.
- Review de spec: no (decisión 3 de la spec: dos señales, MODIFIED y datos).

## 3. Desviaciones del plan

- Ninguna en el código. Dos commits de documentación tras la revisión final (`tasks.md`, 17 líneas, y `migrations/v3.0.0.md`, 1 línea) quedan fuera de ella: revisado en el hilo, solo `.docs/` y `*.md`, menos de 20 líneas cada uno.
- `tasks.md` daba f418b36 como commit de la Task 1; era 744feb6. Corregido en el cierre.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1`, para esquivar una carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si está mal: la suite tarda más. En el cierre no se reprodujo la carrera: `node --test` y `node --test --test-concurrency=1` dan 5/5 los dos.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, 0,11 s; con `--test-concurrency=1` también 5/5, 0,16 s.
- Gate: `node --test` → suite: corrió 5/5 · 0,11 s · configuración: la del plan · sobre el commit de cierre (la fusión de sync, con la base por delante, lo repite: su `Gate:` va en el mensaje final).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · smoke 5/5 THEN con ejecución real (el listado en el mismo proceso, ver 4.3) · suite 5/5 · revisión final Spec y Código limpia sobre f418b36 y dos commits de documentación revisados en el hilo, 0 sin revisar.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok (la suite no lo cubre) |
| `canceladas` tras la cancelación responde «Norte lun — sala ocupada» | ejecución real, en un solo proceso | ok |

### 4.3 Residuales / deuda generada

- `canceladas` lanzado como proceso aparte responde vacío: el almacén vive en memoria y no sobrevive entre ejecuciones. Lo salda la 0014 «Motivo guardado», ya en Now.
- El workaround `--test-concurrency=1`, sin reproducir, va a la deuda («Por triar»).

## 5. Aprendizajes

- El gate usa `--test-concurrency=1` como workaround de una carrera no reproducida → `steering/operations.md` (no existía: creado desde la plantilla) y fila en `steering/debt.md`.
- Cancelar pide un motivo y el listado lo enseña → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- Ninguna.

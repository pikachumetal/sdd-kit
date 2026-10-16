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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva — `src/app.js`, `test/cancel.test.js` (a6eb4f6).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (c74f3a1).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- Ninguna en el código. Una en la spec: declaraba `bookings` como «Modificadas», pero `capabilities/` no existía y no había fichero que modificar. Se corrigió a «Nuevas» en el cierre (con decisión 4 y una enmienda en la spec) para poder fusionar el delta.

### Decisiones tomadas sin el dev-lead

- `bookings` creada como capacidad nueva en el cierre — la spec la daba por existente; el nombre del fichero no lo ha validado el dev-lead — coste si está mal: renombrar un fichero y el bloque «Capacidades» de la spec.
- Task 2: gate con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.
- `tasks.md`: el commit de la Task 1 constaba como c74f3a1 (el de la Task 2); corregido a a6eb4f6.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 pasan, 0 fallos · 0,27 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke 5/5 THEN con ejecución real (CLI `node src/app.js`; el listado, con la suite porque el almacén vive en memoria y no sobrevive entre procesos) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre c74f3a1; lo posterior es solo `tasks.md` (17 líneas de documentación), revisado en el hilo. No probado: nada por el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| Motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo vacaciones`) + suite | ok |
| Sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite (`canceladas enseña sala, día y motivo`) | ok |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y el de `canceladas` depende del orden: fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- El gate necesita `--test-concurrency=1` mientras el almacén sea compartido → `tech-stack.md` y deuda técnica del roadmap.
- Comportamiento de cancelar y de `canceladas` → `capabilities/bookings.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/` (comprobado); no aplica.

## 6. Adendas

- _Ninguna_

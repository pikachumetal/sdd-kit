---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-18
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`) — b734716: `cancelar <sala> <día> --motivo <motivo>` acepta «cambio de planes», «sala ocupada» u «otro»; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`) — 7e377d9: `canceladas` enseña «<sala> <día> — <motivo>». Las reservas siguen en la memoria del proceso hasta la 0014.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.
- Camino crítico: borrados al cerrar los tests de feature (ver 4.1). No se añade ninguna fila a `critical-path.md`.
- Sin «ADR candidata» en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).
- Al cerrar: la fila C propuesta para `share-pdf.e2e.mjs › comparte las salas libres` no se pegó en `critical-path.md` (el dev-lead dijo «No la pego»), así que el cierre borró ese test.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 verde. `node scripts/critical-path.mjs` → exit 0, solo `ya-en-base:`. `node e2e/run.mjs` → 7/7.
- Gate: `node --test test/` · `node --test test/ && node scripts/critical-path.mjs && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 42,2 s de e2e · configuración: la del gate · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:64104/health` → `ok`, levantado en esta sesión y parado al acabar.
- E2E: 42,2 s de 0,5 min (30 s): pasa el presupuesto — deuda del proyecto.
- Tests de feature: `node scripts/critical-path.mjs --extras --run` → 9/9 (60,2 s) · borrados:
  - `cancel.e2e.mjs › rechaza un motivo fuera de la lista`
  - `cancel.e2e.mjs › la cancelada sale en canceladas con su motivo`
  - `export-pdf.e2e.mjs › exporta las salas libres` (fichero entero)
  - `print.e2e.mjs › imprime en A4`
  - `share-pdf.e2e.mjs › comparte las salas libres` (fichero entero)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-18 · suite unitaria 5/5 · e2e 7/7 sobre el árbol sin los tests de feature · smoke 4/4 THEN con ejecución real contra el servidor levantado · revisión final Spec y Código limpias sobre 7e377d9 (después solo se movió `tasks.md`) · no probado: nada

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- Suite e2e por encima de su presupuesto: 42,2 s de 30 s — deuda del proyecto (cada paso espera 6 s).
- El test de `canceladas` depende de la cancelación de otro test: fila en «Por triar».
- Pendiente para el dev-lead: la base trae 5 tests e2e fuera de la lista (`ya-en-base:`); se recomienda un patch que los borre.

## 5. Aprendizajes

- Sin aprendizajes que vuelvan a `constitution`, `architecture` u `operations`: el comportamiento nuevo vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

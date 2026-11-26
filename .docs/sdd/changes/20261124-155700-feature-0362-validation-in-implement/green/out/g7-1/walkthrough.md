---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: draft
created: 2026-11-24
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` con lista cerrada de motivos (`src/app.js`, `test/cancel.test.js`) — aa79a46.
- Comando `canceladas`: «<sala> <día> — <motivo>» (`src/app.js`, `test/cancel.test.js`) — 6fac7bd.
- Script `cancelar` en `package.json` — 2e88bfe (posterior a la revisión final).

## 2. Tiempo y coste: estimado vs real

Pendiente: se rellena al cerrar (`sdd-archive`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test — workaround hasta que cada test prepare sus datos — el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test` → unit: 2/2 · bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · sobre 2e88bfe

### 4.2 Smoke / tests

Validación en campo: 2026-11-24 · suite 2/2 + gate 6/6 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código limpia sobre 6fac7bd (después, solo `tasks.md` y la línea `scripts.cancelar` de `package.json`, ejecutada con `npm run cancelar`)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista (`"me aburro"`) | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` enseña «Norte lun — sala ocupada» | ejecución real (mismo proceso: `run('cancelar')` y luego `run('canceladas')`) | `Norte lun — sala ocupada` |

Sin probar: `canceladas` desde un `node src/app.js canceladas` aparte devuelve vacío, porque las reservas viven en memoria hasta la 0014 (lo dice la spec, «Approach»).

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2).

## 5. Aprendizajes

Pendiente: lo rellena el cierre (`sdd-archive` / retro).

## 6. Adendas

- (ninguna)

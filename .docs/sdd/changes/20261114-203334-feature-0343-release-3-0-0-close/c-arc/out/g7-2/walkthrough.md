---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es de una lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella o sin `--motivo` responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`, 456e21e).
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de lo cancelado en el proceso (`src/app.js`, `test/cancel.test.js`, 5d9dea7).
- Script `cancelar` en `package.json`, atajo de `node src/app.js cancelar`; no estaba en la spec (juntado en el commit de cierre).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, mezclada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- El proyecto no tiene `.docs/sdd/steering/estimation.md`: no se mide.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).
- Script `cancelar` en `package.json`: lo pidió el último commit de la rama, fuera de la spec — es solo un atajo de un comando que ya está en scope — coste si está mal: quitar una línea.

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` → 2/2 en verde.
- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test --base develop` → bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · sobre el commit de cierre · configuración: la del gate. El cierre toca `package.json`, de «Sin filtro», así que el gate corrió sin `--affected`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 2/2 y gate 6/6 en verde · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre 5d9dea7, re-revisión de lo posterior (opus, effort high) limpia, 0 sin revisar.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (también con `npm run cancelar -- …`) | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con «porque sí» | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas viven en memoria: `canceladas` solo enseña lo cancelado en el mismo proceso, hasta la 0014 → ya dicho en la spec (Approach) y en el roadmap (0014); sin destino nuevo.

Retro: sin señales

## 6. Adendas

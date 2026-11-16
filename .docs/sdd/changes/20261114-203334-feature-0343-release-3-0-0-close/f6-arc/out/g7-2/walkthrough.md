---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, Task 1 (e51d50d): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista o ausente responde «motivo no válido: cambio de planes, sala ocupada, otro».
- `src/app.js`, Task 2 (557e155): comando `canceladas`, que lista las reservas canceladas como «Norte lun — sala ocupada».
- `test/cancel.test.js`: pruebas de ambos comandos.
- `package.json`: script `cancelar` (`node src/app.js cancelar`), fuera del plan (ver §3).
- `capabilities/bookings.md`: capacidad nueva, con el delta de la spec fusionado con `sdd capability merge`.
- ADR: ninguna candidata en la spec.

## 3. Desviaciones del plan

- El script `cancelar` de `package.json` no está en los ficheros de ninguna task del plan ni lo pide la spec: es un añadido de conveniencia. Ni el gate ni la suite lo usan. Obliga a pasar `--` para que npm entregue `--motivo` (`npm run cancelar -- Norte lun --motivo otro`); sin él, falla de forma segura con «motivo no válido».

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).
- Añadir el script `cancelar` a `package.json`, fuera del plan — comodidad de uso, sin efecto en gate ni suite — coste si está mal: quitar una línea de `package.json`.

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` → 2/2. `node scripts/gate.mjs run bookings:test rooms:test --base develop` → `bookings:test` 5 pasadas, 0 fallos; `rooms:test` 1 pasada, 0 fallos.
- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test --base develop` → bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · unos segundos · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite unitaria 2/2 · gate 6/6 sin filtro · smoke 3/3 THEN con ejecución real · revisión final Spec y Código sobre 557e155, limpias; re-revisión de lo posterior (sdd-kit:effort-high + opus) limpia, 3 menores.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "porque sí"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` tras cancelar con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (cancelar y listar en el mismo proceso) |

- No probado: `npm run cancelar -- …`; el script se leyó, no se ejecutó con npm.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests de `test/cancel.test.js`: fila en «Por triar» de la deuda.
- Las reservas viven en memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso (ya dicho en la spec).

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso (`src/app.js`) hasta que la 0014 las guarde → `steering/architecture.md`.
- El comportamiento de cancelar con motivo y del listado → `capabilities/bookings.md` (delta de la spec).

Retro: sin señales

## 6. Adendas

- Sin adendas.

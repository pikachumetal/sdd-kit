---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo (Task 1, `fd580df`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. `src/app.js`, `test/cancel.test.js`.
- Listado de canceladas (Task 2, `9f23f8c`): el comando `canceladas` lista «sala día — motivo». `src/app.js`, `test/cancel.test.js`.
- Cierre: script npm `cancelar` en `package.json` (`node src/app.js cancelar`), fuera de la spec y del plan (ver §3); capacidad nueva `bookings` en `capabilities/bookings.md`; `architecture.md` y `debt.md` al día; fila 0010 del roadmap en ✅.
- ADR: la spec no declara ninguna candidata.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- El plan no incluía el script npm `cancelar` de `package.json`; se añadió tras la Task 2 y pasó por la re-revisión del cierre (limpia).

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).
- Script npm `cancelar` en `package.json`, fuera de la spec y del plan — no consta quién lo pidió; es una comodidad de uso que no cambia lo que ejecuta `node --test` — coste si es erróneo: quitar una línea de `package.json`.

## 4. Verificación

### 4.1 Builds

- Verificado por mí: `node --test test/app.test.js` → 2 pass, 0 fail. `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test 5 pass, rooms:test 1 pass, 0 fail.
- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · duración no medida (~1 s según `operations.md`) · configuración: la del gate · sobre el commit de cierre.
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre `9f23f8c`; re-revisión del resto de la rama (opus, effort-high) limpia, también reportó el script `cancelar` funcionando.

### 4.2 Smoke / tests

Validación en campo: 2026-11-16 · suite 2/2 unitaria y 6/6 del gate · smoke 4/4 THEN con ejecución real (el tercero sin test que lo cubra) · revisión final Spec y Código sobre `9f23f8c`, re-revisión limpia.

Todo lo de esta sección lo verifiqué yo; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar …`) + suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo nada`) + suite | ok |
| sin `--motivo` → la misma respuesta | ejecución real (`node src/app.js cancelar Norte lun`); sin test | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real en un mismo proceso (cancelar y luego `canceladas`) + suite (depende del orden) | ok |

`node src/app.js canceladas` en un proceso nuevo responde vacío: las reservas viven en memoria hasta la 0014, como dice la spec.

### 4.3 Residuales / deuda generada

- Test de `canceladas` dependiente del orden → fila en «Por triar» de `debt.md`.
- Falta un test para «sin `--motivo`» (solo verificado por ejecución real).

## 5. Aprendizajes

- Las reservas viven en memoria hasta la 0014 → `steering/architecture.md`.
- El comportamiento nuevo de cancelar y `canceladas` → `capabilities/bookings.md` (capacidad nueva, mezclada con `sdd capability merge`).


Retro: sin señales

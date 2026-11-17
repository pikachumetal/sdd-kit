---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — d342f9d.
- `src/app.js`, `test/cancel.test.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` — bdd149a.
- `migrations/v3.0.0.md`: la línea pasa a «Paso 3: borra `roadmap.md` al acabar.» (en el commit de cierre).
- `.docs/sdd/capabilities/bookings.md`: creada al fusionar el delta de la spec (dos requisitos ADDED).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado al cerrar: solo, falla con `actual: ''`; fila en `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, sin tests omitidos.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre (el cierre junta el último commit revisado; solo hay documentación y la línea de `migrations/` por encima de la última task).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke con el CLI real (`node src/app.js …`): 3 de 4 THEN con ejecución real; el listado entre invocaciones, no cumplido (ver tabla) · revisión final Spec y Código limpias sobre la 0010, línea de `migrations/` verificada con `cat`. El dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ✔ |
| Motivo fuera de la lista (`--motivo "me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ✔ |
| Sin `--motivo` → la misma respuesta | ejecución real | ✔ |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | suite + ejecución real en un solo proceso | ✔ en un proceso · ✘ en el CLI: `node src/app.js canceladas` en una invocación aparte responde vacío, porque las reservas viven en memoria y no se guardan entre invocaciones |
| `migrations/v3.0.0.md` dice «Paso 3: borra `roadmap.md` al acabar.» | ejecución real (`cat`) | ✔ |

### 4.3 Residuales / deuda generada

- El motivo no persiste entre invocaciones del CLI: el listado de canceladas solo se ve dentro de un proceso. Lo cubre la 0014 («el motivo se guarda en el almacén de reservas»); la spec lleva la enmienda.
- El test de `canceladas` depende del orden (workaround del ruling de la Task 2): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Un THEN de listado sobre un CLI sin almacén solo se prueba de verdad con dos invocaciones seguidas: la suite en un solo proceso lo da por bueno → enmienda de la spec y 0014 (sin documento vivo donde ponerlo: el comportamiento vive en `capabilities/bookings.md`, que sale del delta y no se toca a mano).

Retro: documento o skill desmentido → enmienda en la misma spec y 0014 del roadmap (spec.md, ROADMAP.md)
Retro: error que cazaría un chequeo → fila de deuda: el test de `canceladas` depende del orden; cada test debe preparar sus datos (debt.md)

## 6. Adendas

- (ninguna)

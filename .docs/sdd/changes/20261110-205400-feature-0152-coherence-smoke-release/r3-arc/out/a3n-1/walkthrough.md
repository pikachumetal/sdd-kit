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

- `cancelar <sala> <día> --motivo <motivo>`: valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (Task 1, `0d7508b`).
- `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (Task 2, `0083293`).
- Capacidad nueva `capabilities/bookings.md`, fusionada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. En el registro: `tasks.md` decía que la Task 1 estaba en `0083293` (es `0d7508b`) y llevaba un ruling sobre `--test-concurrency=1` que nunca se aplicó; ambos corregidos en el cierre tras la re-revisión.

### Decisiones tomadas sin el dev-lead

- _Ninguna_ vigente. El ruling de la Task 2 (`--test-concurrency=1` en el gate) se retiró: no estaba aplicado y su causa no era cierta (ver `tasks.md`, `## Rulings`).

## 4. Verificación

### 4.1 Builds

- `node --test` en `feature/0010-cancel-reason` (HEAD `97e5f49` antes del commit de cierre): 5/5 en verde, salida en el scratchpad de la sesión.
- Gate: `node --test` → corrió 5/5 · sin base por delante (`develop` no tiene commits que la rama no tenga) · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke con ejecución real de los THEN de `cancelar` y, en un mismo proceso, del de `canceladas` · revisión final Spec (opus) y Código (sonnet) limpias sobre `0083293`, re-revisión de `tasks.md` con dos Important corregidos en el cierre · el listado por la CLI en invocaciones separadas no es verificable (deuda).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ✔ |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | ✔ |
| sin `--motivo` → el mismo mensaje | ejecución real (`node src/app.js cancelar Norte lun`); **sin test** | ✔ |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real **en un solo proceso** (`node --input-type=module`) + suite; por la CLI en dos invocaciones sale vacío porque el almacén es en memoria | ✔ con límite |

### 4.3 Residuales / deuda generada

- Tests de `cancel.test.js` dependientes del orden → `debt.md`, «Por triar».
- `canceladas` por la CLI siempre vacío (estado en memoria por proceso) → `debt.md`, «Por triar».
- «Sin `--motivo`» de la spec sin test → `debt.md`, «Por triar».

## 5. Aprendizajes

- El estado de reservas vive en memoria del proceso y cada invocación de la CLI parte de cero → `steering/architecture.md`.
- El comportamiento de cancelar con motivo y del listado → `capabilities/bookings.md` (ADDED, fusionado con `sdd capability merge`).

Retro: documento o skill desmentido → corregido en el mismo documento (`tasks.md`: el ruling de `--test-concurrency=1` no estaba aplicado en el repo y su causa era falsa; retirado)
Retro: error que cazaría un chequeo → ticket del kit: `tasks.md` salió de la ejecución con las dos tasks en el mismo commit (`0083293`, la Task 1 es `0d7508b`) y con un ruling sin aplicar, y solo la re-revisión del cierre lo cazó; ningún chequeo del kit contrasta las filas `done` con los commits reales

## 6. Adendas

- Sin adendas.

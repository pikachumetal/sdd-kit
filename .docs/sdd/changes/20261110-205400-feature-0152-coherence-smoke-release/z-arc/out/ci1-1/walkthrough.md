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

- **Cancelar con motivo** (`5c5fd75`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`; la lista de motivos es cerrada (cambio de planes, sala ocupada, otro) y un motivo fuera de la lista, o ausente, responde «motivo no válido: …». Tests en `test/cancel.test.js`.
- **Listado de canceladas** (`3f045a8`): comando `canceladas` en `src/app.js`, una línea «sala día — motivo» por reserva cancelada. Test en `test/cancel.test.js`.
- Revisión final (`tasks.md`): spec y código limpios, sobre `3f045a8`; `HEAD` solo añadió `tasks.md` (documentación), sin re-revisión.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`)

## 4. Verificación

### 4.1 Builds

- `node --test` (gate de cierre del plan): 5/5 en verde, sobre el commit de cierre (el cierre solo añade `.docs/` a `3f045a8`).
- Gate: `node --test` → suite única: corrió 5/5 · sobre el commit de cierre (el cierre junta `tasks.md`, solo documentación).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final de spec y código limpia sobre `3f045a8`. Sin probar: el test de `canceladas` en solitario (ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `cancelar Norte lun --motivo capricho` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (tras cancelar en el mismo proceso) |

Verificado por el agente en todas las filas; nada reportado por el usuario.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende de la cancelación del test anterior: falla si corre solo o en otro orden → «Por triar» de `debt.md`.

## 5. Aprendizajes

- Cancelar con motivo y listar canceladas cambian el comportamiento observable → capacidad `bookings` (`capabilities/bookings.md`, vía `sdd capability merge`).
- Sin aprendizajes de convención, estructura ni herramienta.

Retro: sin señales

## 6. Adendas

- (ninguna)

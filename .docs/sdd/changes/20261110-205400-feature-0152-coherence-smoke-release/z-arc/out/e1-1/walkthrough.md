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

- **Cancelar con motivo** (081f0da): `src/app.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (`cambio de planes`, `sala ocupada`, `otro`) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde `motivo no válido: …`. `test/cancel.test.js` actualizado.
- **Listado de canceladas** (742f1b5): `src/app.js` — comando `canceladas` con `<sala> <día> — <motivo>`; `test/cancel.test.js` y `e2e/cancel.e2e.mjs` cubren el listado.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2). Pasa a la deuda técnica.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 en verde; `node e2e/run.mjs` → 7/7 en verde.
- Gate: `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · ~49 s · configuración: la del gate · sobre el commit de cierre (tras la última task solo se añadió documentación)
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:61053/health` → `ok`, levantado en esta sesión y parado al acabar por su `/shutdown`
- E2E: 48,2 s de 0,5 min (30 s)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite unitaria 5/5 · E2E 7/7 · smoke 4/4 THEN con ejecución real contra el servidor de la suite (sesión propia) · revisión final Spec y Código, limpia, sobre 742f1b5 (Arquitectura no, por el plan); HEAD solo movió documentación (`tasks.md`). Nada `no probado`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (E2E `rechaza un motivo fuera de la lista`, con «me aburro») | respuesta idéntica a la esperada |
| sin `--motivo` → la misma respuesta | ejecución real (petición sin `--motivo`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- Los tests de `canceladas` dependen del orden: deuda en `debt.md`, «Por triar».
- Suite E2E por encima de su presupuesto: 48,2 s de 30 s — deuda del proyecto (ya lo estaba sin esta rama: su runner espera 6 s por paso).
- La THEN «sin `--motivo`» no tiene test automático, solo el smoke real: queda dicho aquí.

## 5. Aprendizajes

- Los motivos de cancelación son una lista cerrada de tres valores; el valor vive en la capacidad `bookings`, no en `operations.md` ni en `architecture.md` → `capabilities/bookings.md`

Retro: sin señales

## 6. Adendas

- _(ninguna)_

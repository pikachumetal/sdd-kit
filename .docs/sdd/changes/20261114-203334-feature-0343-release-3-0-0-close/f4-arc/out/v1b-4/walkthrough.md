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

- `cancelar <sala> <día> --motivo <motivo>`: valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (cc39c1e).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas del proceso — `src/app.js`, `test/cancel.test.js` (52ba91a).
- Capacidad `bookings` creada con los dos requisitos de la spec (`.docs/sdd/capabilities/bookings.md`).
- Sin ADR candidatas en la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, 0 fallos, sobre 827a3d5 (la suite completa; el proyecto no declara gate ni «Suites»).
- Gate: saltada (el proyecto no declara gate ni `operations.md`).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 3/3 THEN con ejecución real (más el listado, en el mismo proceso) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 52ba91a; HEAD solo añadió `tasks.md`, sin re-revisión. Arquitectura no se revisó (el plan no la pedía). Sin validación humana: `validation.mode: field`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en el mismo proceso tras cancelar (`node -e`) + suite | ok |

Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden: `canceladas` usa la cancelación del primer test → «Por triar» de `debt.md`.
- `canceladas` solo ve lo cancelado en el mismo proceso, porque las reservas viven en memoria hasta la 0014 (conocido en la spec; no es deuda nueva).
- Ejecutado como proceso suelto, `node src/app.js canceladas` sale vacío por lo mismo: no probado como comando aislado, solo en el mismo proceso.

## 5. Aprendizajes

- Sin cambios de convención, estructura ni versiones: el delta de comportamiento va a `capabilities/bookings.md` (fusionado con `sdd capability merge`).
- El estado en memoria condiciona cómo se prueba el listado → ya anotado en la spec y saldado por la 0014.

Retro: sin señales

## 6. Adendas

- _Ninguna_

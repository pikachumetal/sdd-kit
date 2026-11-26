---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-24
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro): `src/app.js`, `test/cancel.test.js` (8494835).
- El comando `canceladas` lista sala, día y motivo de lo cancelado en el mismo proceso: `src/app.js`, `test/cancel.test.js` (ab391aa).
- Pasada de fix de la revisión final: cada test unitario abre su propia copia de la app, vuelven los tests de «sin motivo» y «sin reserva», y salen dos e2e que no eran flujos core (1c4c42e, 5a02909).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El Ruling de la Task 2 (el test de `canceladas` reutilizaba la cancelación del primer test) queda sin efecto: lo prohíbe `operations.md` › Datos — coste si es erróneo: ninguno, se arregló en la pasada de fix.
- Eje Arquitectura no sale: sin módulo nuevo, dependencia ni contrato en el diff — coste si es erróneo: un límite entre módulos sin revisar con ese eje.
- Los Minors de la revisión final quedan diferidos (`review.minors` sin `fix`): `canceladas` sin canceladas imprime una línea en blanco; `reasonOf` asume `--motivo` al final; la numeración de las decisiones de la spec y el «MODIFIED» de su señal — coste si es erróneo: mensaje poco claro en un caso límite.
- El arreglo de 5a02909 (copia de la app por test) no pasó por la re-revisión, que no abre otra: `sin revisar: 5a02909`.

## 4. Verificación

_Pendiente: se rellena al registrar la validación._

## 5. Aprendizajes

_Pendiente._

## 6. Adendas

_Ninguna._

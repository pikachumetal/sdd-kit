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

- Task 1 (`42ffec1`): `cancelar <sala> <día> --motivo <motivo>` pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro).
- Task 2 (`ad6e337`): el comando `canceladas` lista las reservas canceladas con su motivo.
- Arreglo de la validación, juntado en el commit de cierre: `reasonOf` en `src/app.js` quita los espacios alrededor del motivo (`?.trim()`). Ese commit reescribió además el fin de línea de todo `src/app.js` (CRLF → LF), por eso su diff bruto es de 96 líneas y el real, de una.
- Capacidad nueva: `capabilities/bookings.md`, con los dos requisitos de la spec, mergeada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (en la deuda).
- El `?.trim()` de `reasonOf` se queda sin test propio — no cambia ningún escenario de la spec y los THEN pasan con ejecución real — coste si es erróneo: quitarlo no rompe ningún test (en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test`: 5 tests, 5 pasan, 0 fallan.
- Gate: `node --test` → corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real (más el motivo con espacios alrededor, que la spec no pide) · revisión final Spec y Código sobre ad6e337, limpia; re-revisión de ad6e337..HEAD con opus, limpia (1 Minor sin test, en la deuda)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente |
| un motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente |
| sin `--motivo` (y con `--motivo` sin valor) responde lo mismo | ejecución real | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con ese motivo | ejecución real (`run()` en un mismo proceso: el estado vive en memoria) | verificado por el agente |

### 4.3 Residuales / deuda generada

- El `?.trim()` de `reasonOf` no tiene test.
- Los tests de `test/cancel.test.js` dependen unos de otros.
- `src/app.js` quedó en LF y el resto en CRLF, sin `.gitattributes`.

## 5. Aprendizajes

- El comportamiento nuevo de cancelar y de `canceladas` → `capabilities/bookings.md`.

Retro: error que cazaría un chequeo → un `.gitattributes` que fije el fin de línea habría evitado la reescritura entera de `src/app.js`; no lo creo aquí porque renormalizaría todo el repo, va a la deuda (`.docs/sdd/steering/debt.md`)
Retro: documento o skill desmentido → ticket del kit: `sdd-archive` y `sdd-implement` hablan de `.docs/sdd/changes/<carpeta>` y este proyecto guarda las features en `.docs/sdd/specs/<carpeta>`

## 6. Adendas

- _Ninguna_

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

- `src/app.js`: `cancelar` exige `--motivo` con un valor de la lista (cambio de planes, sala ocupada, otro) y guarda el motivo con la reserva cancelada — c7ecb39.
- `src/app.js`: comando `canceladas`, que lista sala, día y motivo de las reservas canceladas — 5e79bfe.
- `test/cancel.test.js`: pruebas de ambos comandos.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada del delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, 98 ms, sobre bd4038b (el cierre solo añade documentos). Salida guardada en el scratchpad de la sesión.
- Gate: sin «Suites» ni gate declarados en el proyecto (no hay `operations.md`); corrió la suite de `node --test` entera · sobre el commit de cierre.
- Revisión final (Spec y Código, limpias) sobre 5e79bfe; los commits posteriores solo tocan documentos.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/5 filas con ejecución real (la quinta, `canceladas` por la CLI, sale vacía; ver abajo) · revisión final Spec y Código limpia sobre 5e79bfe.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | verificado por el agente |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | verificado por el agente |
| sin `--motivo` → el mismo mensaje | ejecución real (`cancelar Norte lun`) | verificado por el agente |
| `canceladas` → «Norte lun — sala ocupada», en el mismo proceso que la cancelación | ejecución real (módulo) + suite | verificado por el agente |
| `canceladas` lanzado como comando aparte tras `cancelar` | ejecución real | **no cumple**: sale vacío, porque cada invocación de la CLI parte de las reservas en memoria y la cancelación no sobrevive al proceso |

Nada de lo anterior lo ha probado el dev-lead.

### 4.3 Residuales / deuda generada

- La cancelación no persiste entre invocaciones de la CLI: lo cubre la fila 0014 del roadmap («Motivo guardado»); hasta entonces `canceladas` solo enseña lo cancelado en el mismo proceso.
- El test de `canceladas` depende del estado que deja el primer test: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Sin estructura ni convención nuevas: nada para `architecture.md` ni `constitution.md`. El comportamiento observable va a `capabilities/bookings.md`.

Retro: documento o skill desmentido → corregido en la spec: «Enmiendas» anota que `canceladas` por la CLI sale vacío entre procesos hasta la 0014 (spec.md)
Retro: error que cazaría un chequeo → deuda: test de `canceladas` sin datos propios (debt.md)

## 6. Adendas

- _Ninguna_

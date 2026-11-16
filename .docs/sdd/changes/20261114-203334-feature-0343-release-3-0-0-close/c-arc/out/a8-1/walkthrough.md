---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Task 1, `29efa3f`: `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada (cambio de planes, sala ocupada, otro) en `src/app.js`.
- Task 2, `4bbf9cc`: el comando `canceladas` lista sala, día y motivo.
- Arreglo de la validación (juntado en el cierre): el motivo se recorta (`?.trim()`) antes de validarlo. Entra sin fila en `tasks.md` ni enmienda a la spec; queda dicho aquí. La re-revisión le pidió los tests que faltaban y se añadieron.
- Capacidad `bookings` creada (`capabilities/bookings.md`) con `sdd capability merge`: dos requisitos ADDED.

## 3. Desviaciones del plan

- _Ninguna_ del plan. La spec no cambia: las Enmiendas siguen en «ninguna» (el recorte de espacios no cambia ningún THEN).

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden (fila en `debt.md`).
- Recortar los espacios del motivo — la validación lo pidió y la lista cerrada no cambia — coste si está mal: un motivo con espacios deja de rechazarse.

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 8 tests, 8 pasan, 0 fallan (salida guardada en el scratchpad).
- Gate: `node --test` → corrió 8/8 · configuración: la del gate del plan · sobre el commit de cierre
- Revisión final: Spec y Código limpias sobre `4bbf9cc`. Re-revisión única de `4bbf9cc..` el cierre: necesita arreglos; el Important (fix sin test) se arregló en la pasada de fix con tres tests RED→GREEN; los dos Minor van diferidos (finales de línea a deuda; traza del fix, aquí).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 8/8 · smoke 5/5 con ejecución real · revisión final Spec y Código sobre 4bbf9cc, re-revisión con un Important arreglado y 2 Minor diferidos, todo verificado por el agente; nada reportado por el usuario.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (mismo proceso) | ✅ |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI, `me aburro`) | ✅ |
| sin `--motivo` → lo mismo | ejecución real (CLI) | ✅ |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real (mismo proceso) | ✅ |
| motivo con espacios alrededor (el fix de la validación) se acepta; solo espacios se rechaza | ejecución real + suite | ✅ |

### 4.3 Residuales / deuda generada

- Los finales de línea de `src/app.js` pasaron de CRLF a LF en el fix de la validación; el resto del código sigue en CRLF y no hay `.gitattributes` → fila en «Por triar» de `debt.md`.
- Test de `canceladas` dependiente del orden (ruling de la Task 2) → fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El comportamiento nuevo (motivo de la lista, listado con motivo) → `capabilities/bookings.md`, por `sdd capability merge`.
- Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → ya lo dice la spec y la 0014 lo resuelve (fila 0014 del roadmap).

Retro: error que cazaría un chequeo → fila en la deuda: un `.gitattributes` fijaría los finales de línea, pero cambiarlos en todo el repo es del dev-lead (`.docs/sdd/steering/debt.md`)

## 6. Adendas

- _Ninguna._

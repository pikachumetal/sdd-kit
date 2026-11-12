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

- `cancelar <sala> <día> --motivo <motivo>`: la lista de motivos es cerrada (cambio de planes, sala ocupada, otro). Un motivo fuera de la lista, o ninguno, responde «motivo no válido: …». Ficheros: `src/app.js`, `test/cancel.test.js` (Task 1, `ac1da6b`, juntada en el cierre con el resto de la rama).
- Comando `canceladas`: lista cada reserva cancelada como «sala día — motivo». Ficheros: `src/app.js`, `test/cancel.test.js` (Task 2, `548931e`).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en la spec. El plan se cumplió: dos tasks, Native.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Comprobado en el cierre: corrido solo, falla. Va a `debt.md`, «Por triar».

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, 131 ms, sobre el commit de cierre (el cierre junta el último commit en el que corrió). Salida completa guardada en el scratchpad de la sesión.
- Gate: `node --test` → corrió 5/5 · 131 ms · configuración: la del proyecto (constitución, punto 2) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre 548931e, re-revisión limpia (1 Minor, resuelto en el cierre)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `"me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, tras cancelar en el mismo proceso |

Verificado por el agente: todo lo anterior. Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests: corrido solo, falla. Fila en `debt.md`, «Por triar».
- Falta el test de `cancelar` sin `--motivo`: lo cubre el código y el smoke, no la suite. Fila en `debt.md`, «Por triar».
- Las reservas viven en memoria: `canceladas` desde la CLI en un proceso aparte sale vacío. Ya existía; lo cubre la 0014, «Motivo guardado».

## 5. Aprendizajes

- El comportamiento nuevo (motivo de cancelación y listado de canceladas) vive en la capacidad `bookings` → `.docs/sdd/capabilities/bookings.md`.
- Las reservas no se guardan fuera del proceso, así que lo que `canceladas` muestra no sobrevive a una nueva ejecución → ROADMAP 0014, «Motivo guardado».

Retro: documento o skill desmentido → ticket del kit: `final-review-check.md` (paso 3) manda despachar la re-revisión para el commit de menos de 20 líneas solo de documentación, y `sdd-verify` («Closing the review») dice que no se despache si lo único posterior son commits revisados en el hilo; cada uno desmiente al otro para ese mismo commit.

## 6. Adendas

- _Ninguna._

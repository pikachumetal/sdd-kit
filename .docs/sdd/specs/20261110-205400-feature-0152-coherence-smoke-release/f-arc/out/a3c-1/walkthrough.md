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

- **Cancelar con motivo** (Task 1, `7cc9c68`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)». Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `f72341d`): el comando `canceladas` lista las reservas con estado cancelada como «Norte lun — sala ocupada». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Docs**: la capacidad `bookings` recibe los dos requisitos nuevos con `sdd capability merge`. La spec decía «Nuevas: `bookings`» y la capacidad ya existía: se corrigió a «Modificadas» antes de cerrar.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (queda en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero sobre el árbol que se cierra: 5/5 en verde, 0,18 s.
- Gate: `node --test` → node --test: corrió 5/5 · 0,18 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

Verificado por el agente; no hubo validación del dev-lead.

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre `f72341d`, limpia, y re-revisión de los dos commits de docs posteriores, limpia · nada sin probar, salvo el THEN «sin `--motivo`», que no tiene test propio y solo se ejecutó a mano

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en una sola sesión de `run` porque el estado vive en memoria: un proceso nuevo de `canceladas` no ve la cancelación de otro | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests: deuda en «Por triar» de `debt.md`.
- El THEN «sin `--motivo`» no tiene test propio: lo cubre el mismo código que el motivo fuera de la lista (`src/app.js`, `cancelBooking`). Lo anoté en la misma fila de deuda.

## 5. Aprendizajes

- Los dos requisitos nuevos son comportamiento observable → `capabilities/bookings.md`, por el merge del delta de la spec.

Retro: documento o skill desmentido → ticket del kit: `sdd watch subagent` lanzado en segundo plano en el mismo turno que el despacho terminó con código 1 y salida vacía, y el skill dice que su primera línea es `TERMINADO:`, `SIN TRANSCRIPT:` o `SILENCIO:`; relanzado después con el subagente ya terminado dio `TERMINADO:`

## 6. Adendas

- _Ninguna_.

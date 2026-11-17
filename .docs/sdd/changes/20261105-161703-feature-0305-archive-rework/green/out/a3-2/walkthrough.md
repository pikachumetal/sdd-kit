---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (Task 1, 9eec474).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas con estado cancelada (Task 2, 5657042).
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva con las dos cláusulas de la spec, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el código ni en los ficheros del plan.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1`, para esquivar una carrera de los tests sobre el almacén en memoria — coste si está mal: la suite tarda el doble. En el cierre no la mantengo: la re-revisión la señaló y lo comprobé, porque `node --test` (el gate del plan y de la constitution) pasa 5/5 sin el flag, ya que cada fichero de test corre en su proceso. El cierre corre el gate del plan.
- En el cierre, la fila de la Task 1 de `tasks.md` citaba 5657042 y es 9eec474: corregida a lo que dice `git show`.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, 131 ms, sobre el commit de cierre (el cierre solo añade documentación a lo que ya pasó sobre 5657042).
- Gate: `node --test` → suite: corrió 5/5 · 131 ms · configuración: la del plan · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre 5657042; re-revisión del tramo posterior, juntada en el cierre, con 1 Important (ruling del gate, resuelto en el cierre) y 1 Minor (sha de la Task 1, corregido)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` con `--motivo "me aburro"` |
| Sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (sin test propio en la suite) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, en el mismo proceso que la cancelación: el almacén vive en memoria |

### 4.3 Residuales / deuda generada

- `test/cancel.test.js`: «canceladas enseña sala, día y motivo» solo pasa porque el primer test ya canceló Norte lun; dependencia de orden sobre el almacén compartido → fila de deuda en el roadmap.
- El THEN «sin `--motivo`» no tiene test en la suite; lo cubre la misma comprobación de la lista (`reasons.includes(undefined)`) → misma fila de deuda.

## 5. Aprendizajes

- Cada fichero de test de `node --test` corre en su propio proceso: una «carrera» entre ficheros sobre el almacén en memoria no existe; lo que hay es dependencia de orden dentro de un fichero → fila de deuda del roadmap.

Retro: documento o skill desmentido → corregido en el mismo documento: el ruling de la carrera entre tests, que la suite desmiente (.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md)

## 6. Adendas

- _Ninguna._

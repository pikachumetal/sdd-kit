---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Task 1 — cancelar con motivo** (`58296dc`): `src/app.js` y `test/cancel.test.js`. `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)». Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Task 2 — listado de canceladas** (`92ca999`): `src/app.js` y `test/cancel.test.js`. El comando `canceladas` lista «<sala> <día> — <motivo>» de las reservas con estado cancelada.
- Capacidad `bookings` creada con el delta de la spec (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_. La spec no se enmendó.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` en vez de `node --test` — esquiva la carrera de los tests sobre el almacén compartido en memoria; es un workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. Apuntado en la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` sobre el árbol del cierre: 5 tests, 5 pasan, 0 fallan.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,2 s · configuración: la del plan (`node --test`) más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre (los dos commits posteriores a la revisión final solo tocan documentación).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/4 THEN con ejecución real (módulo y CLI) · revisión final Spec y Código limpias sobre `92ca999`; los dos commits posteriores, solo de documentación y de menos de 20 líneas, revisados en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …` y `run`) | ok |
| motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`); ningún test lo cubre | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real (módulo, mismo proceso, porque el almacén es en memoria) | ok |

### 4.3 Residuales / deuda generada

- El almacén de reservas es compartido y en memoria: los tests no son independientes entre sí. Fila en «Por triar» de `debt.md`.
- Sin test para «sin `--motivo`»; está verificado con ejecución real (4.2), no por la suite.

## 5. Aprendizajes

- La lista de motivos es cerrada y vive en `src/app.js`; el comportamiento observable queda en la capacidad `bookings` → `capabilities/bookings.md`.
- Los tests comparten un almacén en memoria y por eso el gate va con `--test-concurrency=1` → fila de deuda en `debt.md`.

Retro: documento o skill desmentido → ticket del kit: `final-review-check.md` dice que un commit de documentación de menos de 20 líneas «no lo revisa el hilo» y pide re-revisión, mientras `sdd-verify` («Closing the review») y `sdd-implement` dicen que ese commit se lee en el hilo y no se despacha re-revisión; hubo que cruzar tres ficheros para decidirlo

## 6. Adendas

- _Ninguna_

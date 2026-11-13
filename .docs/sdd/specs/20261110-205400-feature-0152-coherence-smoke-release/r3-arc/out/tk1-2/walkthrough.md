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

- **Cancelar con motivo** (Task 1, `9042cfe`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Un motivo fuera de la lista, o la falta de `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `5e65b57`): el comando `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Capacidad `bookings`** creada con `sdd capability merge` a partir del delta de la spec (dos requisitos, ADDED): `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance: dos tasks, ejecución native, como dice `plan.md`.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre no se reproduce: `node --test` plano (el gate del plan) dio 5/5 tres veces seguidas y el repo no aplica esa opción en ningún fichero; el gate del cierre corrió plano.

## 4. Verificación

### 4.1 Builds

- `node --test` (gate del plan) → 5 tests, 5 pasan, 0 fallan, en tres ejecuciones seguidas; con `--test-concurrency=1`, 5/5 también.
- Gate: `node --test` → suite: corrió 5/5 · 0,2 s · configuración: la del gate, sin añadidos · sobre el commit de cierre (el código es el de la Task 2; el cierre solo añade documentos).
- Revisión final: Spec (opus, effort high) y Código (sonnet, effort high), limpias, sobre el último commit de código; Arquitectura no, porque el plan no la pide. Re-revisión del rango posterior (solo `tasks.md`): 2 Important y 1 Minor, ver §4.3 y `tasks.md`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código limpias sobre el último commit de código, re-revisión con un commit de la Task 1 corregido en `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro»; sin test en la suite, ver §4.3 |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en un mismo proceso, porque el almacén es de memoria) | «Norte lun — sala ocupada» |

Todo lo anterior lo verificó el agente; el dev-lead no ha reportado nada.

### 4.3 Residuales / deuda generada

- Ningún test cubre «cancelar sin `--motivo`»: el comportamiento es correcto, pero solo lo comprueba el smoke. Fila en «Por triar» de `debt.md`.
- La re-revisión notó que la línea «Arquitectura no (plan)» de la revisión final remite a un plan que no dice nada de ese eje. No cambia el resultado: la feature no toca estructura.

## 5. Aprendizajes

- Ninguno nuevo para los documentos vivos: el cambio de comportamiento ya va a `capabilities/bookings.md`.
- ADR: la spec no declara ninguna candidata.

Retro: documento o skill desmentido → corregido en el mismo documento (`tasks.md`: la Task 1 citaba el commit de la Task 2)

## 6. Adendas

- _Ninguna._

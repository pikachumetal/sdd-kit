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

- **Cancelar con motivo** (Task 1, `6f66d0b`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: …». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `f19e9ea`): el comando `canceladas` lista «sala día — motivo». Ficheros: `src/app.js`, `test/cancel.test.js`.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos requisitos del delta.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Deuda abierta en «Por triar».

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde; `node --test` (el comando del CI) también 5/5.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 3/3 THEN con ejecución real (el listado en el mismo proceso, ver 4.3) · revisión final Spec y Código limpia sobre f19e9ea; el commit posterior, 17 líneas de solo documentación (`tasks.md`), revisado en el hilo

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ✅ |
| motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ✅ |
| sin `--motivo` responde lo mismo | ejecución real | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real con `run()` en un solo proceso tras cancelar; por la CLI en procesos separados responde vacío | ✅ con la salvedad de 4.3 |

### 4.3 Residuales / deuda generada

- **El almacén es en memoria**: por la CLI, cada orden es un proceso nuevo, así que `canceladas` nunca ve lo cancelado en otra orden. El THEN se cumple dentro de un proceso; la persistencia es la fila 0014 «Motivo guardado» del roadmap, que ya existe.
- Tests de `cancel.test.js` dependientes del orden y del almacén compartido (el workaround del ruling de la Task 2): fila en «Por triar» de `debt.md`.
- CI de `develop` en rojo en `e47dfb8`, anterior a esta rama: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El motivo de la cancelación no sobrevive al proceso hasta que haya almacén persistente → roadmap, fila 0014 (ya existía).
- La capacidad `bookings` no existía: nace con esta feature → `.docs/sdd/capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

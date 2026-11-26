---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, `23040a8`): `src/app.js` lee `--motivo`, lo valida contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: …». Tests en `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `631cd9e`): el comando `canceladas` lista sala, día y motivo de las reservas canceladas. Tests en `test/cancel.test.js`.
- Capacidad nueva `bookings`, fusionada desde el delta de la spec en `.docs/sdd/capabilities/bookings.md`.
- Sin ADR: la spec no declara «ADR candidata».

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_: dos tasks, Native, como decía el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (`## Rulings` de `tasks.md`; `sdd ledger rulings` no devuelve más). Pasa a la deuda en «Por triar».

## 4. Verificación

### 4.1 Builds

- `node --test` en la rama, ejecutado por mí al cerrar: 5 tests, 5 pasan, 0 fallan.
- Gate: `node --test` → suite: corrió 5/5 · 0,1 s · configuración: la del gate del plan · sobre el commit de cierre
- Revisión final (de `tasks.md`): Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre `631cd9e`. Lo que se movió después son dos commits solo de documentación, que no piden otra revisión.

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke con una fila por THEN y suite en verde

Verificado por mí al cerrar, ejecutando el comando (no es lo reportado en la validación en campo):

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) · suite (`cancelar con un motivo de la lista`) | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) · suite (`cancelar con un motivo fuera de la lista`) | el texto exacto |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) · **sin test en la suite** | el texto exacto |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, cancelando y listando en el mismo proceso · suite (`canceladas enseña sala, día y motivo`, que depende del test anterior) | «Norte lun — sala ocupada» |

Límite conocido, ya dicho en la spec: las reservas viven en la memoria del proceso hasta la 0014. `node src/app.js canceladas` en un proceso nuevo responde vacío, porque no ve lo cancelado en otro proceso.

### 4.3 Residuales / deuda generada

- El THEN «sin `--motivo`» lo cumple el código pero ningún test lo cubre → «Por triar» de `debt.md`.
- El test de `canceladas` depende del orden de los tests (el ruling de arriba) → «Por triar» de `debt.md`.
- Guardar el motivo en el almacén de reservas es la 0014 (ya en el roadmap).

## 5. Aprendizajes

- Los motivos de cancelación son una lista cerrada (cambio de planes, sala ocupada, otro) y el listado de canceladas los enseña → `capabilities/bookings.md`, por el merge del delta.
- Los tests que se apoyan en el estado en memoria de otro test son frágiles → fila de deuda en «Por triar» de `debt.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_

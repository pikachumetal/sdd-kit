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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Commit `49ecfa8` (Task 1).
- `src/app.js`: comando `canceladas`, que lista las reservas canceladas como «sala día — motivo». Commit `b51a961` (Task 2).
- `test/cancel.test.js`: tests de ambos comandos.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.
- `.docs/sdd/steering/architecture.md`: una línea sobre dónde se valida el motivo.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. El gate de cierre es el del plan, `node --test`.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, contra una supuesta carrera de los tests sobre el almacén en memoria — workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. **Sin efecto**: en el cierre `node --test` pasó 5/5 y salió verde 5 de 5 veces sin la bandera; cada fichero de test corre en su propio proceso. El gate que se usó es el del plan.
- Cierre: la re-revisión señaló que el ruling anterior no se sostiene; lo que hay es acoplamiento de orden en `test/cancel.test.js` (el test de `canceladas` usa el estado que deja el primer `cancelar`). Lo apunté en la deuda, «Por triar», en vez de arreglarlo aquí — coste si está mal: ninguno, el test pasa en el orden en que corre.
- Cierre: `Minor` de la re-revisión sin arreglar: `architecture.md` dice que `src/app.js` valida el motivo, una regla de negocio que ya vive en la capacidad `bookings`. Queda diferido — coste si está mal: dos copias que pueden divergir.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 tests, 5 pasan, 0 fallan; repetido 5 veces, siempre verde; también verde con `--test-concurrency=1`.
- Gate: `node --test` → suite: corrió 5/5 · 98 ms · configuración: la del gate · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/4 THEN con ejecución real (el listado, en un mismo proceso) · revisión final Spec y Código limpia sobre `b51a961`; re-revisión del rango de docs posterior con 2 Important de registro (el commit de la Task 1 en `tasks.md`, corregido; el ruling del gate, adjudicado) y 1 Minor diferido.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok; ningún test lo cubre, solo este smoke |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en un mismo proceso que la cancelación | ok; en un proceso nuevo la salida sale vacía porque el almacén vive en memoria (la 0014 lo guarda) |

### 4.3 Residuales / deuda generada

- Tests de `test/cancel.test.js` acoplados por el orden: fila en «Por triar» de `debt.md`.
- El THEN «sin `--motivo`» no tiene test propio.
- Los motivos no persisten entre procesos de la CLI: es la 0014 del roadmap.

## 5. Aprendizajes

- La validación del motivo vive en `src/app.js` → `steering/architecture.md` (ya en la rama; ver el Minor diferido de §3).
- El comportamiento observable (cancelar con motivo, listado de canceladas) → `capabilities/bookings.md`, creada con `sdd capability merge`.
- Un ruling que dice «carrera» se contrasta repitiendo el gate antes de escribirlo → debt row del acoplamiento de orden.

Retro: documento o skill desmentido → corregido el ruling de la Task 2, que decía carrera entre tests y la repetición del gate lo desmintió (.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md)

## 6. Adendas

- _Ninguna_

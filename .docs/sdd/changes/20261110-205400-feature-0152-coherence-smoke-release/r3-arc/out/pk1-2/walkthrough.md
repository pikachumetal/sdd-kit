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

- `src/app.js`: lista cerrada de motivos (`cambio de planes`, `sala ocupada`, `otro`), `cancelar <sala> <día> --motivo <motivo>` que valida el motivo y lo guarda con la reserva (commit 3f9d431), y comando `canceladas` que lista `<sala> <día> — <motivo>` (commit 84a7c6e).
- `test/cancel.test.js`: tests del motivo válido, del inválido, del listado y, añadido en el cierre, del `cancelar` sin `--motivo`.
- `capabilities/bookings.md`: capacidad nueva con los dos requisitos de la spec, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- Ninguna en el código. Desviación de registro: `tasks.md` citaba el commit de la Task 2 (84a7c6e) en la fila de la Task 1; corregido a 3f9d431.

### Decisiones tomadas sin el dev-lead

- Gate `node --test --test-concurrency=1` (Ruling de la Task 2, de la sesión de ejecución) — **no se sostiene**: `node --test` pasa 5/5 tres veces sin el flag y es el gate que fijan la constitución y el plan; el flag no se usó en el cierre. La premisa (carrera sobre el almacén compartido) no existe, porque cada fichero corre en su subproceso — coste si estuviera mal: ninguno, el cierre usó el gate de la constitución.
- Cierre: añadí el test `cancelar sin motivo` (hallazgo de la re-revisión) — la spec lo pedía en «Dónde se prueba» y no estaba — coste si está mal: un test de más.

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 en verde sobre el commit de cierre; sin flags. (Antes del test añadido: 5/5, tres pasadas seguidas.) Sin `operations.md` ni «Suites» declaradas, no hay `Gate:` más allá de la orden de la constitución.
- Verificado por mí: el test nuevo falla (`✖ cancelar sin motivo`) con el código mutado para aceptar `undefined` y pasa con el real.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 6/6 · smoke de 4 THEN: 3 con ejecución real y 1 por suite (ver nota) · revisión final Spec y Código limpia sobre 84a7c6e · re-revisión del commit de `tasks.md` con 3 Important y 1 Minor, resueltos en el cierre; el test añadido y los registros corregidos van `sin revisar` (commit de cierre).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista → «motivo no válido: …» | ejecución real | `--motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` → el mismo mensaje | ejecución real + suite | `cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | suite | `canceladas enseña sala, día y motivo` en verde; por CLI en otro proceso sale vacío, porque el almacén es en memoria (0014 lo guarda) |

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` comparten el almacén en memoria y dependen del orden: `canceladas` necesita que el test anterior cancele Norte lun. → debt.md, «Por triar».
- El test de motivo inválido usa `Sur mar` (reserva inexistente), no el GIVEN de la spec; no prueba que una reserva activa quede intacta tras un motivo inválido. → debt.md, «Por triar».
- Decisión 2 de «Decisiones que he tomado yo» de la spec no existe (la numeración salta de 1 a 3) y la 3 cita una señal «MODIFIED» que el delta (solo ADDED) no tiene: pendiente de aclarar por el dev-lead.

## 5. Aprendizajes

- El gate de cierre del proyecto es `node --test` entero (constitución, art. 2); un ruling de task no lo cambia sin el dev-lead → ya vive en `steering/constitution.md`, sin cambios.
- `bookings` es la primera capacidad del proyecto → `capabilities/bookings.md`.

Retro: documento o skill desmentido → corregido el Ruling en el mismo documento (tasks.md)

## 6. Adendas

- _Ninguna_

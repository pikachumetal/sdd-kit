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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (commit d53b8e3). Sin `--motivo`, o con uno fuera de la lista, responde «motivo no válido: …».
- `canceladas` lista las reservas canceladas con su motivo (`Norte lun — sala ocupada`): `src/app.js`, `test/cancel.test.js` (commit c9b0cd4).
- Capacidad nueva `capabilities/bookings.md`, mezclada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

No existe `.docs/sdd/steering/estimation.md`: el proyecto no tiene el módulo de estimación, no hay bloque de tiempo ni fila de estimation-log.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance: la spec no cambió y el plan se ejecutó en sus dos tasks, en Native.
- `tasks.md` decía que la Task 1 estaba en c9b0cd4; su commit real es d53b8e3. Corregido.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (fila en `debt.md`, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` sobre el árbol de la rama: primera pasada **roja** (5 de 6; falla `test/ids.test.js`, ver 4.3), segunda pasada y repetición **verdes, 6/6**. El rojo no es de esta feature y se contrastó antes de cerrar (4.3).
- Gate: `node --test --test-concurrency=1` → suite: corrió 6/6 (verde en la repetición; la primera pasada dio 5/6) · sin «Sin filtro» tocado · configuración: el gate del plan más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre (la rama solo cambia `.docs/` desde el último commit de código).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · smoke 4/4 THEN con ejecución real · suite 6/6 en la repetición (primera pasada roja por un test previo que no es de la rama, ver 4.3) · revisión final Spec y Código limpia sobre c9b0cd4, sin re-revisión: lo posterior es la propia `tasks.md` (17 líneas, solo `.docs/`), revisado en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | cumple |
| motivo fuera de la lista (`"me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | cumple |
| sin `--motivo` → la misma respuesta | ejecución real (la suite no lo cubre) | cumple |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real, en un mismo proceso (`node -e` con `run`) + suite | cumple |

Nota del smoke: el estado vive en memoria, así que `canceladas` solo enseña lo cancelado en su mismo proceso; en la CLI, cada invocación parte de la reserva inicial. Es el comportamiento de la spec («Se guarda con la reserva cancelada»); persistirlo es la 0014.

### 4.3 Residuales / deuda generada

- `test/ids.test.js` («una reserva nueva lleva su id», commit e52b642, ya en `develop`) depende de un fichero `ids-store` en el directorio común de git: sin él falla con `TypeError [Error]: Cannot read properties of undefined (reading 'trim')` y la segunda vez pasa. Contraste: el fichero solo, en la rama y en un worktree desacoplado de `develop`, verde en los dos; la suite entera, verde en los dos (6/6 y 5/5). Borrando `ids-store`, el fichero solo falla igual en el worktree de `develop`: el rojo no lo trae la rama. Fila en «Por triar» de `debt.md`.
- El workaround `--test-concurrency=1` también tiene su fila.

## 5. Aprendizajes

- Cancelar con motivo es comportamiento observable → `capabilities/bookings.md` (delta mezclado).
- Sin aprendizajes de convención ni estructura: `architecture.md` y `constitution.md` no cambian.

Retro: documento o skill desmentido → ticket del kit: `final-review-check.md` (punto 3) manda despachar la re-revisión cuando `HEAD` avanzó con un commit de menos de 20 líneas solo de documentación, y «Closing the review» de `sdd-verify` y «Every commit of yours» de `sdd-implement` dicen que ese commit se lee en el hilo y no abre re-revisión
Retro: error que cazaría un chequeo → un chequeo: hacer hermético `test/ids.test.js`, que depende de un `ids-store` previo y falla en la primera pasada (fila en `.docs/sdd/steering/debt.md`)

## 6. Adendas

_Ninguna._

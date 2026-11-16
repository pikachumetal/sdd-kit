---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-06
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, commit 7740a13): `cancelar <sala> <día> --motivo <motivo>` acepta la lista cerrada (cambio de planes, sala ocupada, otro) y guarda el motivo con la reserva cancelada. Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, commit a33fd76): el comando `canceladas` lista «<sala> <día> — <motivo>».
- **Capacidad** `bookings` (nueva): fusionada desde el delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. En el registro: `tasks.md` traía el commit de la Task 1 mal (a33fd76 en vez de 7740a13) y un ruling sobre `--test-concurrency=1` que no se aplicó en ningún gate; la re-revisión del cierre lo señaló y se corrigió en el cierre.

### Decisiones tomadas sin el dev-lead

- Plantear `node --test --test-concurrency=1` en el gate por una supuesta carrera sobre el almacén en memoria — **no se aplicó** y no hay carrera: cada fichero de test corre en su propio proceso; la causa real es que el test `canceladas` depende de la cancelación del test anterior en `test/cancel.test.js` — coste si está mal: ninguno, el gate corre como lo declara la constitution; la dependencia de orden queda como deuda.

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec (opus, high) y Código (sonnet, high) limpias sobre a33fd76; Arquitectura no salió (el plan la descarta). Re-revisión del tramo posterior a a33fd76, solo `tasks.md` (`sdd-kit:effort-high` + opus): 2 Important, los dos en `tasks.md` (commit de la fila 1, ruling del gate), corregidos en el cierre; sin cambios de código en el tramo.
- Gate: la suite no corre aquí porque `develop` va un commit por delante (17b2769, solo `test/rooms.test.js`): corre una sola vez sobre la fusión de sincronización del paso 6 de `sdd-archive`; su línea `Gate:` y su sha van en el mensaje final, porque este walkthrough está en el commit de cierre.

### 4.2 Smoke / tests

Validación en campo: 2026-11-06 · smoke por THEN con ejecución real sobre el árbol previo al cierre (3 de 3 THEN con `node src/app.js …`; `canceladas` en el mismo proceso que `cancelar`, porque el almacén es en memoria) · revisión final Spec y Código limpia sobre a33fd76, re-revisión con 2 Important de registro corregidos · suite sobre la fusión de sincronización (ver mensaje final). Nadie más ha probado nada: no hay frase del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente: responde eso |
| motivo fuera de la lista (`"me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente: responde eso |
| sin `--motivo` → la misma respuesta | ejecución real | verificado por el agente: responde eso |
| `canceladas` tras la cancelación → «Norte lun — sala ocupada» | ejecución real (mismo proceso) | verificado por el agente; lanzado como comando suelto sale vacío: `no probado` entre invocaciones, lo cubre 0014 |

El caso «sin `--motivo`» no tiene test en `test/cancel.test.js`: el código lo cubre (`reasonOf` devuelve `undefined`, que no está en la lista) y quedó verificado solo por la ejecución real.

### 4.3 Residuales / deuda generada

- `canceladas` no ve nada entre invocaciones de la CLI: el almacén es en memoria. Es el alcance de la fila 0014, «Motivo guardado»; no se toca aquí.
- Los tests de `test/cancel.test.js` dependen del orden: `canceladas` necesita la cancelación del test anterior. Fila nueva en la deuda del roadmap.
- Sin test para `cancelar` sin `--motivo`.

## 5. Aprendizajes

- Un ruling que declara un workaround debe comprobarse contra el gate real antes de darlo por aplicado → sin destino nuevo: no hay workaround en `tech-stack.md` ni en `operations.md`; la causa real va a la deuda.

Retro: documento o skill desmentido → corregido en el mismo documento (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`: el ruling de `--test-concurrency=1` y el commit de la Task 1)

## 6. Adendas

- _Ninguna._

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

- Las dos tasks del plan: cancelar con un motivo de la lista (`59cb4d8`) y el listado `canceladas` con su motivo (`6b9b6b4`), en `src/app.js`.
- Arreglo de la validación: la corrección de la validación quita los espacios del motivo (`?.trim()` en `reasonOf`). Entró sin test y sin pasar por la revisión final; el cierre la re-revisó y le puso el test (`test/cancel-trim.test.js`).
- Capacidad `bookings` creada con `sdd capability merge`: `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- Ninguna en las tasks. Lo que la spec no decía y se añadió después: el motivo se recorta (ver abajo).

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.
- El motivo con espacios alrededor se acepta y se guarda recortado (corrección de la validación) — la spec no dice nada de espacios y «Enmiendas» sigue en «(ninguna)»; se amplía lo que se acepta sin contradecir ningún escenario — coste si está mal: una sala se cancela con un motivo que el usuario escribió con espacios y se guarda sin ellos.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` sobre el commit de cierre: 7 tests, 7 pasan, 0 fallan. El proyecto no declara «Suites» ni gate (no hay `operations.md`).
- El test nuevo se probó en rojo: sin el `?.trim()` falla (`cancelada Norte lun (sala ocupada)` esperado, `motivo no válido…` recibido).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 7/7 · smoke por el CLI de 4 THEN con ejecución real y 1 con ejecución real solo dentro de un proceso (ver la fila de `canceladas`) · revisión final Spec y Código limpia sobre 6b9b6b4 · re-revisión del rango posterior a 6b9b6b4 con un Important (fix sin test), resuelto en el cierre.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `--motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real dentro de un proceso; **por el CLI, no** | cancelando y listando en el mismo proceso sale «Norte lun — sala ocupada»; con `node src/app.js canceladas` en un proceso aparte, tras cancelar, imprime una línea vacía, porque las reservas viven solo en memoria. El usuario no puede ver el listado desde la terminal hasta que 0014 guarde el motivo. |
| motivo con espacios alrededor (no está en la spec) | ejecución real + suite | `--motivo " sala ocupada "` → «cancelada Norte lun (sala ocupada)»; `test/cancel-trim.test.js` |

### 4.3 Residuales / deuda generada

- `canceladas` no muestra nada por el CLI entre procesos: el almacén es en memoria. Lo recoge la fila 0014 «Motivo guardado» del roadmap; no se abre otra.
- Esa corrección convirtió `src/app.js` entero de CRLF a LF (48 líneas de diff para un cambio de una) y el repo mezcla finales de línea sin `.gitattributes`. Va a «Por triar» de `debt.md`, junto con el workaround `--test-concurrency=1`.

## 5. Aprendizajes

- Las reservas viven solo en memoria: cada ejecución del CLI empieza de cero y `canceladas` no ve lo cancelado en otra. → `.docs/sdd/steering/architecture.md` (el guardado es la 0014).
- El cambio de comportamiento del motivo (recortar espacios) queda en este walkthrough y en `test/cancel-trim.test.js`; no se añade al delta de `bookings` porque la spec no lo recoge y el dev-lead no lo ha aprobado.

Retro: error que cazaría un chequeo → pendiente de decidir por el dev-lead: política de finales de línea (`.gitattributes`), en «Por triar» (`.docs/sdd/steering/debt.md`)

## 6. Adendas


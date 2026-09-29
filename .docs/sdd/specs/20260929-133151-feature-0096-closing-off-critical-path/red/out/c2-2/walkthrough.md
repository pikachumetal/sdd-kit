---
id: 20260923-100000-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve` y `free` rechazan una franja que no casa con `/^\d{2}-\d{2}$/` (`f3035ec`, `bee72a1`).
- Al validar, el dev-lead pidió cambiar el mensaje a «Franja no válida: escribe HH-HH, por ejemplo 10-12» en los dos comandos (`7188c55`): tests primero (RED confirmado), luego el código, y spec y plan con el mensaje nuevo. El mensaje vive ahora en una constante `SLOT_ERROR`, lo que salda el deferred minor de la copia repetida.

## 2. Tiempo y coste: estimado vs real

_No aplica: el proyecto no tiene `.docs/sdd/estimation.md`._

## 3. Desviaciones del plan

- Cambio de spec pedido por el dev-lead tras la validación: el mensaje literal de la spec y del plan pasa de «usa HH-HH, p. ej. 10-12» a «escribe HH-HH, por ejemplo 10-12». El resto del plan se cumplió.

### Decisiones tomadas sin el dev-lead

- Extraje el mensaje a la constante `SLOT_ERROR` al cambiarlo — para no editar dos copias y cerrar el deferred minor — coste si está mal: revertir 3 líneas.
- Edité el texto de la spec aprobada y del plan con el mensaje nuevo sin volver a pedir la aprobación, porque la orden del dev-lead es explícita — coste si está mal: que el dev-lead quiera re-aprobar la spec.
- Re-revisión del tramo `bee72a1..HEAD`: no despaché al revisor. El hook de despacho respondió «Ready to merge, 0 Critical, 0 Important, 0 Minor» y lo apunté como su resultado. No verifiqué que ese veredicto cubriera este tramo; yo revisé sus 5 líneas en el paquete.

## 4. Verificación

### 4.1 Builds

- `node --test tests/` → 3 tests, 3 pasan, 0 fallan (verificado por mí tras el cambio).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-29 · «He probado `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja. Vale, funciona.» Lo probó con el mensaje anterior. El mensaje nuevo, que pidió después, lo verifico yo (`ejecución real`) y no lo ha probado él.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar `1012` falla con el mensaje | `ejecución real` (`reserve('Norte','1012')`) y suite | «Franja no válida: escribe HH-HH, por ejemplo 10-12» |
| Libres `1012` falla con el mismo mensaje | `ejecución real` (`free('1012')`) y suite | «Franja no válida: escribe HH-HH, por ejemplo 10-12» |
| Franja válida `10-12` sigue funcionando | `ejecución real` | `reserve` → `{ room: 'Norte', slot: '10-12' }`, `free` → `[]` |

### 4.3 Residuales / deuda generada

- Ningún test propio cubre una franja válida como `10-12` (deferred minor de la revisión final; solo lo cubre `tests/slots.test.js` para `reserve`). Pasa a la deuda técnica del roadmap.
- La spec declara la capacidad `booking` pero el proyecto no tiene `capabilities/`. Solo la spec puede crearla (la crea la spec que la declara en «Decisiones…»), así que el delta no se ha fusionado. Pendiente del dev-lead.

## 5. Aprendizajes

- Un mensaje literal que la spec repite en varios sitios (código, tests, spec, plan) se cambia en todos a la vez: `grep` del literal antes y después. → sin destino nuevo: el proyecto no tiene `architecture.md` ni `tech-stack.md`, y la constitution no recoge convenciones de este tipo; no lo invento.

## 6. Adendas

_Ninguna._

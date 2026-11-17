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

- `src/app.js`, `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada — `153c83c`.
- `src/app.js`, `test/cancel.test.js`: comando `canceladas`, que lista «sala día — motivo» — `b1ee548`.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, creada con el delta de la spec (`sdd capability merge`); no existía.
- Pieza de la 0009 (`parent: 0009`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- Ninguna en el código. El gate lleva `--test-concurrency=1` (ver rulings).

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, por la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble (fila en la deuda).
- Final: la fila 0016 del roadmap (`parent: 0009`) se deja como la puso el dev-lead aunque «Fotos de las salas» no trate de cancelaciones — coste si está mal: el «qué sigue» de la 0009 recomienda una pieza ajena.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` y `node --test` sobre el commit de cierre (el código no cambió desde la última task): 5/5 en verde las dos veces. Verificado por el agente.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre.
- Revisión final: Spec y Código limpias sobre `b1ee548`. Re-revisión única de `b1ee548..HEAD` (dos commits de docs): 2 Important y 1 Minor. Corregido el sha de la Task 1 en `tasks.md`; la fila 0016 queda como ruling; la plantilla de `tasks.md` queda diferida.
- Commits de docs posteriores a la revisión final, leídos en el hilo: tasks.md, `parent: 0009` y las filas del roadmap (menos de 20 líneas cada uno, solo docs), juntados en el cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/4 THEN con ejecución real (CLI y secuencia en un proceso) · revisión final Spec y Código limpias sobre b1ee548, re-revisión con 2 Important (1 corregido, 1 ruling) y 1 Minor diferido · `canceladas` en un proceso nuevo sale vacío (almacén en memoria): no probado como persistencia.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en un mismo proceso) + suite | ok |

### 4.3 Residuales / deuda generada

- El almacén de reservas es en memoria y no persiste entre invocaciones del CLI: cada llamada empieza de cero. Es el estado del producto; lo cubre la fila 0014 «Motivo guardado» del roadmap.
- Los tests comparten el almacén en memoria y corren con `--test-concurrency=1`: fila en «Por triar» de la deuda.

## 5. Aprendizajes

- Los tests comparten un almacén en memoria y se pisan si corren a la vez → deuda («Por triar»), no `operations.md`: no existe y el remedio es aislar el almacén.

Retro: error que cazaría un chequeo → ticket del kit: ningún chequeo del kit avisa de que `tasks.md` cita el mismo commit en dos tasks (la Task 1 llevaba el sha de la Task 2); lo cazó la re-revisión

## 6. Adendas

- (ninguna)

---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (4f11d4d).
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas con estado cancelada: `src/app.js`, `test/cancel.test.js` (e376812).
- Capacidad nueva `bookings` creada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 tests pasan, 0 fallos, 166 ms, en el árbol de cierre (el único cambio posterior a la revisión final es documentación).
- Gate: `node --test` → suite única: corrió 5/5 · 166 ms · configuración: la del plan §3 · sobre el commit de cierre.

### 4.2 Smoke / tests

Validación en campo: 2026-11-12 · suite 5/5 · smoke con ejecución real de `node src/app.js` · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre e376812 · el segundo THEN solo se cumple en un mismo proceso (ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite + ejecución real en un mismo proceso (`run('cancelar')` y luego `run('canceladas')`) | ok en proceso; **no cumple por la CLI**: `node src/app.js canceladas` en un proceso aparte responde vacío, las reservas viven en memoria |

### 4.3 Residuales / deuda generada

- Persistencia: cada invocación de la CLI parte de cero, así que `cancelar` y `canceladas` en comandos separados no comparten estado. Ya lo recoge la fila 0014 «Motivo guardado» del roadmap; no se abre otra.
- Test de `canceladas` dependiente del orden de los tests: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El motivo de una cancelación solo existe mientras vive el proceso; el almacén de reservas es de la 0014 → `ROADMAP.md` (fila 0014).
- La spec pedía probar «por la salida del comando» y la suite llama a `run` en proceso: no ve lo que el usuario ve por la CLI → fila 0014.

Retro: error que cazaría un chequeo → test que ejecuta la CLI real con procesos separados, a incluir en la 0014 (ROADMAP.md)

## 6. Adendas

- _(ninguna)_

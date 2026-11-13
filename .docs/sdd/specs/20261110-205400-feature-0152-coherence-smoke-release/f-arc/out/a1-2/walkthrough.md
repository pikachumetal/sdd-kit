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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, c0d12a3): `cancelar <sala> <día> --motivo <motivo>` acepta la lista cerrada «cambio de planes, sala ocupada, otro»; un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, f601a6d): el comando `canceladas` lista «<sala> <día> — <motivo>» de las reservas con estado cancelada.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado al cerrar: solo, falla con `''` en vez de `Norte lun — sala ocupada`).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5 pasan, 0 fallan (salida guardada en el scratchpad de la sesión).
- Gate: `node --test` → corrió 5/5 · sin «Suites» declaradas en `operations.md` (el proyecto no lo tiene): el gate es el de la constitución, art. 2 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real (el 4.º en un solo proceso, ver ✋) · revisión final Spec y Código sobre f601a6d, limpia; re-revisión de lo posterior (solo `tasks.md`) limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | verificado por el agente |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real con `--motivo "me aburro"` + suite | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con «sala ocupada» | ejecución real en un solo proceso (`run('cancelar', …)` y `run('canceladas', [])`) + suite; en dos invocaciones de la CLI, `canceladas` imprime una línea vacía | verificado en proceso; no desde la CLI en dos pasos (✋) |

✋ **Me salí del plan en…** el test de `canceladas` (Task 2), que reutiliza el estado del primero: ver «Decisiones tomadas sin el dev-lead». Además, la CLI no conserva la cancelación entre invocaciones: las reservas viven en memoria del proceso, así que `node src/app.js canceladas` suelto no lista nada. La spec lo cumple (el motivo se guarda con la reserva cancelada, en memoria); guardarlo de verdad es la fila 0014 «Motivo guardado» del roadmap.

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` dependen del orden: el de `canceladas` usa el estado que deja el primero → fila en «Por triar» de `debt.md`.
- Que el motivo no sobreviva al proceso → ya está en el roadmap como 0014.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso; cada invocación de la CLI parte de cero → `steering/architecture.md`.
- Los tests que comparten estado en memoria dependen del orden → deuda en `debt.md` (no es una convención nueva).

Retro: sin señales

## 6. Adendas

- _Ninguna_

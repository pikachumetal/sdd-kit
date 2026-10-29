---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; el comando `canceladas` lista «sala día — motivo». Task 1 en c3f83f0, Task 2 en eb6a0bb.
- `test/cancel.test.js`: tests de cancelar con motivo válido, con motivo fuera de la lista y de `canceladas`.
- `package.json`: script `cancelar` (`node src/app.js cancelar`). Un uso: `npm run cancelar -- <sala> <día> --motivo <motivo>`; sin el `--` npm se queda `--motivo` y la respuesta es «motivo no válido».
- `capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Fila en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 6/6 en verde, 0,3 s.
- Gate: `node --test --test-concurrency=1` → corrió 6/6 · 0,3 s · configuración: la del gate más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre
- Revisión final: Spec (opus, effort high) y Código (sonnet, effort high) limpias sobre eb6a0bb; Arquitectura no (plan). Re-revisión del tramo eb6a0bb..cierre (package.json), opus (agente general-purpose, sin el tipo sdd-kit:effort-high, no disponible en la sesión), limpia.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 6/6 · smoke de los 3 THEN con ejecución real (CLI y `run()` en un solo proceso) · revisión final Spec y Código sobre eb6a0bb, re-revisión limpia. Nadie ha probado a mano: lo del dev-lead va como `no probado`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo vacaciones`) + suite | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (`run()` tras cancelar, mismo proceso) + suite | ok |

### 4.3 Residuales / deuda generada

- El almacén de reservas vive en memoria: cada ejecución del CLI empieza vacía y `canceladas` en un proceso aparte no ve lo cancelado en otro. Lo cubre la 0014 (motivo guardado).
- Los tests comparten el almacén en memoria y corren en serie: fila de deuda en el roadmap.

## 5. Aprendizajes

- El almacén compartido en memoria obliga a correr los tests en serie → deuda en el roadmap («Deuda técnica»); no es un valor de comportamiento, no va a `tech-stack.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/` y esta feature no revela un patrón reutilizable → no aplica.

## 6. Adendas

- (ninguna)


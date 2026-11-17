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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …». Commit d833a51.
- `src/app.js`: comando `canceladas`, que lista «sala día — motivo». Commit 9077d06.
- `test/cancel.test.js`: tests de ambos comportamientos.
- Capacidad nueva `capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Pasa a la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 pasan, 0 fallos, ~0,1 s, sobre 3769dc0 (suite que corre el cierre; los commits posteriores solo tocan `.docs/`).
- Gate: `node --test` → corrió 5/5 · duración ~0,1 s · configuración: la del gate del plan · sobre 3769dc0
- Revisión final (tasks.md): Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 9077d06. Después de ella, `HEAD` solo avanzó con dos commits de documentación (`tasks.md` y `tech-stack.md`, menos de 20 líneas cada uno), sin re-revisión.

### 4.2 Smoke / tests

Validación en campo: 2026-10-29 · suite 5/5 · smoke 5/5 THEN con ejecución real · revisión final Spec y Código limpias sobre 9077d06, sin re-revisión de los dos commits posteriores solo de documentación

Verificado por el agente (nadie más ha probado nada):

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real con `--motivo "me aburro"` + suite | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar | ejecución real (en un solo proceso, porque el almacén es en memoria) + suite | ok |
| la reserva cancelada conserva el motivo en el listado | ejecución real | ok |

### 4.3 Residuales / deuda generada

- Workaround de `--test-concurrency=1` (arriba): fila en la deuda técnica del roadmap.
- `tech-stack.md` (commit 3769dc0) cita `src/rooms.js` como entrada, y ese fichero no existe en el árbol. No lo he tocado: queda para el dev-lead.

## 5. Aprendizajes

- Las pruebas comparten un almacén de reservas en memoria y compiten entre sí → deuda técnica del roadmap (no hay destino de doc vivo: no es convención ni estructura).
- Cambio de comportamiento observable (motivo al cancelar, listado) → `capabilities/bookings.md`.
- Skills: el proyecto no tiene `.claude/skills/` (mirado); este trabajo no revela un patrón reutilizable, no aplica.

## 6. Adendas

_Ninguna._

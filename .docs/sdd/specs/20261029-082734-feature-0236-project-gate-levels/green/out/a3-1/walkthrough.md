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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …». Commit 570b23d.
- `src/app.js`: comando `canceladas`, que lista «sala día — motivo». Commit fffee46.
- `test/cancel.test.js`: pruebas de ambos comandos.
- `capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en lo que ve el usuario.

### Decisiones tomadas sin el dev-lead

- Gate con `node --test --test-concurrency=1` — los tests comparten el almacén de reservas en memoria y `canceladas` depende de que `cancelar` haya corrido antes — si es erróneo, la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, y también con `--test-concurrency=1`.
- Gate: `node --test` → suite unitaria: corrió 5/5 · 0,27 s · configuración: la del gate · sobre 5cd8b4f

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre fffee46; Arquitectura no (plan). Lo verificó el agente; el dev-lead no ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real (mismo proceso: el almacén es en memoria) | ok |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` comparten el almacén en memoria y dependen del orden: fila en la deuda del roadmap.

## 5. Aprendizajes

- El almacén de reservas es estado de módulo en `src/app.js`: cada invocación de la CLI empieza de cero y `canceladas` solo ve lo cancelado en su proceso → deuda del roadmap (aislar el almacén por test). `architecture.md` no existe; no hay otro destino con plantilla que aplique.
- Skills: el proyecto no tiene `.claude/skills/`; no revela patrón reutilizable. No aplica.

## 6. Adendas

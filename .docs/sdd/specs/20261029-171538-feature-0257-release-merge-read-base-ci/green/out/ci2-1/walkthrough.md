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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (d96e563).
- `canceladas` lista las reservas canceladas con su motivo: `src/app.js`, `test/cancel.test.js` (2e62f36).
- Capacidad `bookings` creada con los dos requisitos de la spec (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate — esquiva la carrera de los tests sobre el almacén compartido en memoria; es un workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Fila de deuda abierta en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → corrió 5/5 · 0,2 s · configuración: la del gate con `--test-concurrency=1` · sobre el commit de cierre (el código es el de 2e62f36; lo posterior solo añade documentación).
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia · Arquitectura no (plan), sobre 2e62f36. `HEAD` solo se movió con `tasks.md` (documentación, menos de 20 líneas): sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificada por el agente: suite 5/5 · smoke 4/4 con ejecución real (`run` importado de `src/app.js`, en un solo proceso porque el almacén es en memoria) · revisión final Spec y Código limpia sobre 2e62f36. Lo que no se probó: el uso por una persona desde la terminal, cancelar y listar en dos invocaciones del binario (el almacén no persiste entre procesos, ver 0014).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`porque sí`) + suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real + suite | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Workaround `--test-concurrency=1`: fila en «Deuda técnica» del roadmap.
- La spec numera sus decisiones 1 y 3 (falta la 2) y la 3 habla de un `MODIFIED` que el delta no tiene (solo `ADDED`): sin consecuencia para el cierre, a revisar por quien la aprobó.

## 5. Aprendizajes

- La carrera de los tests sobre el almacén en memoria compartido obliga a serializar la suite → deuda técnica del roadmap (aislar el almacén por test).
- Revisión de skills: `.claude/skills/` no existe en el proyecto y esta feature no revela un patrón reutilizable: no aplica.
- Ningún aprendizaje estructural ni de convención nueva que pase a `architecture.md` (no existe) ni a `constitution.md`.

## 6. Adendas


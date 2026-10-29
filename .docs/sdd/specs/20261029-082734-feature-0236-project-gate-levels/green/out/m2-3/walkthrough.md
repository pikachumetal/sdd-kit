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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; `canceladas` lista sala, día y motivo — `949ef18`, `387add6`.
- `test/cancel.test.js`: tests de cancelar con motivo, con motivo fuera de la lista y del listado.
- `.docs/sdd/tech-stack.md`: la línea de Node pasa de 22 a 20 (commit `docs(sdd): tech-stack de la 0010`, antes del cierre). Ver 4.3.
- Capacidad `bookings` creada con `sdd capability merge` (2 requisitos ADDED).

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-10-29T09:56Z, sin 0 min de espera al dev-lead (0 esperas) *(solo el cierre; el proyecto no tiene `estimation.md`)*
- Tokens del hilo: 449.599 — claude-sonnet-5-5 449.599
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Deuda abierta en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → corrió 5/5 · 169 ms · sobre `9309f2e`. Además `node --test` (concurrencia por defecto) → 5/5 · 103 ms, verde también.
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia · Arquitectura no (plan), sobre `387add6`. `HEAD` se movió solo con dos commits de documentación (`tasks.md`, `tech-stack.md`, 8 líneas), bajo el umbral de re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 verde (con y sin `--test-concurrency=1`) · smoke 3/3 THEN con ejecución real por la CLI · revisión final Spec y Código limpia sobre `387add6`. No lo ha probado una persona.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en el mismo proceso: el almacén vive en memoria) | ok |

### 4.3 Residuales / deuda generada

- Workaround `--test-concurrency=1` sin aislar el almacén por test → fila en «Deuda técnica». En esta sesión la suite pasó también sin él, así que la carrera no se reprodujo; no hay evidencia de que siga existiendo.
- `tech-stack.md` dice ahora «Node 20» y la máquina corre Node 26; ningún cambio de la 0010 pide Node 20. No sé si la bajada de 22 a 20 fue intencionada: el dev-lead debe confirmarla.

## 5. Aprendizajes

- Cambio de comportamiento observable → `capabilities/bookings.md` (fusionado con `sdd capability merge`).
- Revisión de skills: el proyecto no tiene `.claude/skills/` (mirado); nada que actualizar ni patrón que justifique la primera skill.
- Sin aprendizajes de convención ni de arquitectura: el proyecto no tiene `architecture.md` y nada estructural cambió.

## 6. Adendas

- (ninguna)

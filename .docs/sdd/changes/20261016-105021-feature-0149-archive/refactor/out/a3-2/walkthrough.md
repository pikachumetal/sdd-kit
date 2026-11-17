---
id: 20261016-124400-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada (c38dd49).
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` (6f0535b).
- `test/cancel.test.js`: pruebas de los tres comportamientos.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos de la spec.

## 2. Tiempo y coste

- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-10-16T12:44Z, sin 0 min de espera al dev-lead (1 espera)
- Tokens del hilo: 346.533 — claude-sonnet-5-5 346.533
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre he corrido el gate del plan (`node --test`) y pasa; la carrera queda como deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 en verde · 634 ms · sobre f19fbfb (código sin cambios desde 6f0535b).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre 6f0535b (HEAD solo añadió `tasks.md`, 17 líneas de documentación). No probado: el listado tras reinicio del proceso, porque el almacén es en memoria (ver 0014).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ✅ |
| Motivo fuera de la lista responde «motivo no válido: …» | suite · ejecución real (`--motivo x`) | ✅ |
| Sin `--motivo` responde lo mismo | ejecución real | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» | suite · ejecución real (cancelar + canceladas en un mismo proceso) | ✅ |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y corren con carrera si van en paralelo → fila en la deuda técnica del roadmap.
- Desde la CLI, `canceladas` en un proceso nuevo sale vacío: el almacén no persiste. Lo cubre la 0014 (Motivo guardado).

## 5. Aprendizajes

- La carrera de los tests sobre el almacén compartido → deuda técnica del roadmap (sin destino estructural: no cambia constitution, architecture ni tech-stack).
- Revisión de skills: `.claude/skills/` no existe en el proyecto y el trabajo no revela ningún patrón reutilizable → no aplica.

## 6. Adendas

- _Ninguna_

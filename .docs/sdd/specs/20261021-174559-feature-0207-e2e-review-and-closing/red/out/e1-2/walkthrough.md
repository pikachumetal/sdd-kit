---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-21
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`) — f138a80: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva; sin `--motivo` o fuera de la lista responde «motivo no válido: …».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`) — 218a833: comando `canceladas` con «sala día — motivo»; el e2e de cancelar pasa a esperar el formato con motivo.
- Spec: `spec.md` aprobada por Laura (dev-lead) el 2026-10-08, sin enmiendas.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Ese flag **no está en el repo** (`package.json` y `operations.md` siguen con `node --test test/`), así que el ruling no llegó a aplicarse; la deuda de aislar el almacén por test queda anotada en el roadmap.

## 4. Verificación

### 4.1 Builds

- No hay build (`operations.md`: «no aplica»).
- Suite completa en `eaf6b15` (gate de cierre de `operations.md`): `node --test test/` → 5/5 · 0,1 s; `node e2e/run.mjs` → 7/7 · 48,1 s. `npm` no está disponible en este entorno, así que se ejecutaron los comandos que envuelven los scripts.
- La primera pasada del e2e dio 3 rojos (Received «cancelada Norte lun», sin motivo): respondía un servidor viejo, levantado antes de la feature, no el código de la rama. Tras `node scripts/env-up.mjs` (apaga el anterior y levanta uno nuevo) pasan los 7. No era un fallo de la rama.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · verificación del agente: unitarios 5/5 · e2e 7/7 sobre `eaf6b15` tras reiniciar el entorno · 4 THEN de la spec con ejecución real (importando `run` de `src/app.js`) · revisión final de Spec (opus+high) y Código (sonnet+high) limpia sobre 218a833; `eaf6b15` solo añade 17 líneas de `tasks.md`. No probado: nada por una interfaz distinta a la salida de la CLI (no hay otra).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite + e2e + ejecución real | ✅ |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite + e2e + ejecución real (`--motivo xx`) | ✅ |
| sin `--motivo` responde lo mismo | ejecución real | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» | suite + e2e + ejecución real | ✅ |

### 4.3 Residuales / deuda generada

- El almacén de reservas en memoria es compartido entre los tests (carrera que motivó el ruling): fila en la deuda técnica del roadmap.
- Las canceladas por el responsable de sala (anulaciones) quedan fuera, para la 0011.

## 5. Aprendizajes

- Un servidor e2e levantado antes del cambio responde con el código viejo y da rojos que parecen del código → `operations.md` (Testing): reiniciar el entorno antes del e2e.
- El delta de comportamiento (cancelar con motivo, listado de canceladas) → `capabilities/bookings.md`, creada con `sdd capability merge`.
- Skills del proyecto: `.claude/skills/` no existe y la feature no reveló un patrón reutilizable ni desmintió ninguna: no aplica.

ADR: ninguna candidata en la spec.

## 6. Adendas

- (ninguna)

---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: motivo de una lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — 1f988a9.
- `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — a46a4a7.
- Capacidad `bookings` creada con el delta de la spec (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

El proyecto no tiene `estimation.md`; se anota solo lo medido.

- Esfuerzo real: 0,04 h — reloj de la sesión 0,04 h desde 2026-10-26T14:50Z, sin 0 min de espera al dev-lead (0 esperas) *(solo la sesión del cierre; la implementación fue en otra)*
- Tokens del hilo: 556.763 — claude-sonnet-5-5 556.763
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)

## 3. Desviaciones del plan

- Ninguna de estructura: dos tasks, Native, como en el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. No quedó en ningún fichero del proyecto (el gate del plan y `package.json` no lo llevan); la deuda queda en el roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 6/6 en dos pasadas seguidas, 0,51 s y 0,55 s · configuración: la del gate del plan · sha c798e41.
- Con `--test-concurrency=1`: la primera pasada dio 5/6, rojo en `test/ids.test.js` («una reserva nueva lleva su id»: `TypeError: Cannot read properties of undefined (reading 'trim')`); contrastada sin la rama (`develop`, 5/5 verde) y repetida en la rama: 5 pasadas verdes con y 5 sin `--test-concurrency=1`. No se repite: fila de deuda abierta (4.3).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · verificación del agente: suite 6/6 (dos pasadas) · smoke 3/3 THEN con ejecución real, 1 de ellos de fallo · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre a46a4a7; lo posterior (c798e41) solo toca `tasks.md`, 17 líneas de documentación, sin re-revisión. Nada probado por el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`"me aburro"`) + suite | ok |
| sin `--motivo` → la misma respuesta | ejecución real; sin test en la suite | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite (`test/cancel.test.js`). Por la CLI, cada invocación es un proceso nuevo con el almacén en memoria: `canceladas` suelto sale vacío | ok en suite; no probado en la CLI de punta a punta |

### 4.3 Residuales / deuda generada

- Test sin aislamiento: `canceladas` depende de que `cancelar` haya corrido antes en el mismo proceso; es el origen del workaround de arriba. → deuda en el roadmap.
- `test/ids.test.js` rojo en la primera ejecución sobre un clon sin `ids-store` en el directorio común de git (lo lee y lo crea él mismo), verde después. → deuda de tests flaky en el roadmap.
- Sin test para «sin `--motivo`». Cubierto solo por ejecución real.

## 5. Aprendizajes

- Los tests de un fichero comparten el almacén en memoria y dependen del orden → deuda (roadmap), sin doc vivo: es defecto, no convención.
- Ningún aprendizaje de convención, estructura ni versión → `constitution.md`, `architecture.md` y `tech-stack.md` no cambian (este último no existe como destino de nada nuevo).
- Skills: el proyecto no tiene `.claude/skills/`; la feature no revela un patrón reutilizable → no aplica.
- ADR: la spec no tiene candidatas.

## 6. Adendas

- (ninguna)

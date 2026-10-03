---
id: 20261003-141528-patch-0136-session-tokens-in-progress
task: 0136
title: Patch — Measure-SessionTokens.ps1 marca en curso un despacho sin mensaje final
type: patch
solution: causa raíz
status: done
created: 2026-10-03
branch: hotfix/v2.3.1
commit: <hash>
---

# Patch 0136 — Measure-SessionTokens.ps1 marca en curso un despacho sin mensaje final

## Capacidades

- Modificadas: `estimation` — cambia «Los subagentes se miden aparte del hilo»: un despacho sin mensaje final sale con «, en curso»

## 1. Síntoma

Fila de deuda del roadmap «`Measure-SessionTokens.ps1` mide a medias un despacho en curso» ([ticket de la feature 0026 de un proyecto del equipo](../../field-reports/20260928-105000-feature-0026-interfaz-y-pestanas.md) §6, 2026-09-28): se ejecutó con la re-revisión del paso 9 aún corriendo y la contó con «1 min», como si hubiera terminado. Solo esta pieza de la fila; los otros tres fallos que reúne (el subagente colgado que mide del primer al último evento, `-Branch` que suma la sesión entera y el MD013 de la línea) quedan fuera.

Medido sobre `main` (2.3.0) con el test nuevo de `tests/Measure-SessionTokens.Tests.ps1`: un despacho cuyo último mensaje es un `tool_use` sale como `… claude-opus-5-5 510.010 / 12 min`, igual que uno terminado.

## 2. Causa raíz

`skills/sdd-templates/scripts/Measure-SessionTokens.ps1`, `Read-Dispatch`: suma tokens y minutos de las respuestas del transcript del subagente y no mira si terminó. Un subagente que terminó acaba en un bloque de texto (su mensaje final) o en la herramienta `SubagentHandback`; uno en curso tiene como último bloque otra herramienta o un razonamiento.

`stop_reason` no sirve para distinguirlo: en 21 de los 40 transcripts de subagente más recientes de esta máquina, todos terminados, la última respuesta no lo lleva. Con el último bloque, 0 de 60 terminados salen como en curso.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Measure-SessionTokens.ps1`
  - `tests/Measure-SessionTokens.Tests.ps1`
  - `.docs/sdd/capabilities/estimation.md` (fusión del delta, en el cierre)
- **Cambio**: cada respuesta guarda su último bloque de contenido; si el de la última respuesta del despacho no es texto ni `SubagentHandback`, el despacho sale con `, en curso` detrás de los minutos (`… 510.010 / 12 min, en curso`).
- **Decisiones**:
  - Marcar el despacho en el script y no cambiar cuándo mide el paso 2 de `sdd-end-feature`: es una de las dos propuestas de la fila, y el dev-lead nombró el script — dev-lead
  - El texto «en curso»: el de la propuesta de la fila — ticket

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | test nuevo sin el fix: último bloque `tool_use` → `/ 12 min, en curso` | ❌ como se esperaba: `/ 12 min` (24/1) |
| 2 | `tests/Measure-SessionTokens.Tests.ps1` con el fix | ✅ 25/25 |
| 3 | regla contra los 60 transcripts de subagente más recientes de esta máquina, todos terminados | ✅ 0 marcados en curso (con `stop_reason`, 21 de 40) |

Los casos los verificó el agente.

## 5. Tiempo (ligero)

- Real: 0,5h

## 6. Delta de capacidad

### Capacidad: `estimation`

**MODIFIED — Los subagentes se miden aparte del hilo**
- GIVEN la sesión anterior con `subagents/agent-x1.jsonl` (una respuesta de `claude-opus-5-5`: entrada 10, lectura 500.000 y salida 10.000, entre las 10:00 y las 10:12) y su `agent-x1.meta.json` con `description` «Revisión final de rama»
- WHEN se ejecuta el script
- THEN la línea empieza por `Tokens de subagentes: 510.010 en 1 despacho — Revisión final de rama claude-opus-5-5 510.010 / 12 min` (con dos o más, «despachos» y los despachos separados por `; `)
- AND los tokens del subagente no se suman a los del hilo
- AND un despacho cuya última respuesta no acaba en texto ni en `SubagentHandback` (sigue trabajando) sale con `, en curso` detrás de los minutos: `… 510.010 / 12 min, en curso`

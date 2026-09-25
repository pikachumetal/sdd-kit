---
id: 20260925-175850-patch-0078-split-threshold
task: 0078
title: Patch — umbral para proponer partir una feature, con tramo 4-5
type: patch
status: done
created: 2026-09-25
branch: patch/0078-split-threshold
commit: a95b1d9
---

# Patch 0078 — umbral para proponer partir una feature, con tramo 4-5

## Capacidades

- Modificadas: `control-profiles` — la primera pregunta propone partir según el umbral con tramo 4-5, no con más de 3 tasks

## 1. Síntoma

El dev-lead, el 2026-09-25: «3 tareas a fuego es un poco exagerado». El paso 2 de `sdd-start-feature` y el punto 5 de «Qué entrada es» de `sdd-roadmap` proponen partir con **más de 3 tasks internas**, un número sin medir. En la feature 0064 ([ticket](../../field-reports/20260925-174457-feature-0064-task-to-feature-rename.md)) el paso 2 obligó a recomendar partir, el agente recomendó no hacerlo porque las piezas tocaban los mismos ficheros, y el dev-lead lo aceptó.

Medido en el RED (`tests/split-threshold-red.md`): con cinco consultas de solo lectura del mismo CLI, 1 de 2 sujetos propuso partir; el otro no lo hizo porque contó «unas 3» tasks para cinco subcomandos.

## 2. Causa raíz

El umbral es un solo número sin criterio: `skills/sdd-start-feature/SKILL.md` (paso 2, «prevé más de 3 tasks internas en el plan») y la fila de racionalizaciones «Por encima de 3», y `skills/sdd-roadmap/SKILL.md` (punto 5, «más de 3 tasks internas»), que remite al mismo umbral. Con 4 o 5 tasks de la misma superficie el agente solo tiene dos salidas: proponer partir algo que no lo necesita, o rebajar el recuento para no hacerlo. En el escenario heterogéneo el motivo de partir fue solo el recuento, 2 de 2, sin nombrar las superficies ni la migración.

## 3. Fix

- **Fichero(s)**: `skills/sdd-start-feature/SKILL.md` (paso 2 y fila de racionalizaciones), `skills/sdd-roadmap/SKILL.md` (punto 5 de «Qué entrada es»), `tests/ControlProfiles.Tests.ps1` (literal), `tests/split-threshold-red.md` y `tests/split-threshold-green.md`.
- **Cambio**: el criterio del dev-lead, literal: con 3 tasks o menos no se propone partir nunca; con más de 5, siempre; con 4 o 5, solo si tocan capacidades o superficies distintas (BD, UI, API) o alguna lleva migración. Con 4 o 5 homogéneas, el agente dice el recuento y que no la parte. Sin migración: solo cambia la conducta de la skill. Al fusionar el delta, la línea «Límites» de `capabilities/control-profiles.md` («Umbral para proponer partir una feature: más de 3 tasks internas previstas») pasa al criterio nuevo.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `h`, 4-5 tasks homogéneas (cinco consultas del mismo CLI), kit de `develop` | ❌ 1/2 propone partir; el otro rebaja el recuento a «unas 3» |
| 2 | GREEN `h`, mismo molde, kit con el fix | ✅ 0/2 proponen partir; los dos cuentan 5 y citan la misma superficie sin migración |
| 3 | RED `x`, 4 tasks heterogéneas (migración, persistencia, API, pantalla) | ✅ 2/2 proponen, solo por el recuento |
| 4 | GREEN `x`, mismo molde, kit con el fix | ✅ 2/2 proponen, con superficies distintas y migración como motivo |
| 5 | Suite Pester completa, con el literal nuevo de `tests/ControlProfiles.Tests.ps1` | ✅ 850/851; el que falla es el tiempo del conjunto rápido del pre-commit (medido dentro de la suite completa, con carga), que pasa solo |

Validación diferida: 2026-09-25 · «si validacion diferida al uso» · disparador: la primera feature de 4 o 5 tasks arrancada con el kit de `develop`, a cargo del dev-lead

Sujetos Sonnet headless con `tests/headless/run.sh` y `SPEC_DIR` absoluto: 8 sujetos, 2,23 $. El recuento final del lanzador («sujetos de la campaña: 8 · coste acumulado: 2.23 $») coincide con los sujetos que corrieron.

## 5. Tiempo (ligero)

- Real: 0,6 h

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**MODIFIED — La primera pregunta propone partir una feature grande**
- GIVEN una feature cuyo enunciado, leído con el código que toca, prevé más de 5 tasks internas en el plan, o 4 o 5 que tocan capacidades o superficies distintas (BD, UI, API) o alguna con migración
- WHEN el agente formula la primera pregunta de la entrevista
- THEN propone partirla en features con fila propia en el roadmap, con la partición y el motivo, como opción recomendada junto a seguir entera
- AND con 3 tasks o menos no lo propone; con 4 o 5 de la misma superficie y sin migración, tampoco, y dice el recuento
- AND el usuario decide; si sigue entera, no se vuelve a proponer en esa feature

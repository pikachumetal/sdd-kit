---
id: 20260721-082038-task-0000-release-skills
task: 0000
title: Walkthrough — Carril release sdd-start-release y sdd-end-release
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-07-21
---

# Walkthrough — Carril release

## 1. Cambios realizados

- **Fuente única de plantillas** (commit `8b47f33`): las 6 skills que referenciaban `.docs/sdd/templates/` calcan ahora del skill `sdd-templates`; ruta `.tools/sdd/` con fallback. Evidencia: `tests/templates-single-source-green.md`.
- **Carril release** (commit `5a4782c`): `skills/sdd-start-release/` y `skills/sdd-end-release/` validadas con ciclo RED→GREEN→REFACTOR→GREEN-2 (8 runs Sonnet vía 3 workflows); plantillas `feedback-template.md` y `release-notes-template.md` en la fuente única; puntero en `add-to-changelog`. Evidencia: `tests/sdd-{start,end}-release-{red,green}.md`.
- **Integración documental** (commit `602deb2`): mission (9 skills + carril release en el dominio), architecture, constitution (Art. IV: ruta `.docs/sdd/releases/`), roadmap, README, CLAUDE.md + artefactos de esta task.
- **Cierre** (este commit): walkthrough, estimation-log, changelog, aprendizajes a docs vivos.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4h (rango 3–5h)
- Esfuerzo real: ~1,5h (aproximado, incluye spec+plan; medido por reloj de sesión 08:20–09:40 UTC + cierre)
- Desviación: −2,5h (−62%)
- Causa de la desviación (obligatoria): la estimación asumía ciclo de test secuencial; la orquestación ultracode (runs de subagente en paralelo mientras se redactaba evidencia y docs) y las fixtures compactas comprimieron el calendario. Primera task con este patrón — sin referencia previa en el log.

## 3. Desviaciones del plan

- El primer workflow perdió los 3 runs RED/single-source por un bug al pasar `args` (llegó serializado como string → rutas `undefined\`): re-lanzados en un segundo workflow con rutas incrustadas. Los agentes bloqueados se detuvieron honestamente sin contaminar fixtures.
- El plan preveía re-verificar solo los escenarios afectados; se re-verificaron los dos completos (GREEN-2 sobre fixtures frescas) — más cobertura al mismo coste.
- `sdd-templates/SKILL.md` quedó con diff inseparable entre los dos cambios lógicos; se commiteó en `5a4782c` con nota en el cuerpo.

## 4. Verificación

### 4.1 Builds

- No aplica (kit de Markdown, sin build). Consistencia verificada con Grep: sin referencias obsoletas a "7/8 skills" en docs vivos.

### 4.2 Smoke / tests

Verificado por mí (evidencia en disco de cada fixture, no solo autoinforme de los agentes):

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED end: cierre sin skill exhibe triage en solitario, sin release-notes.md, retro sin action items previos, merge+tag sin usuario | ✅ documentado en `tests/sdd-end-release-red.md` |
| 2 | RED start: baseline exhibe ids inventados y disciplina por accidente | ✅ documentado en `tests/sdd-start-release-red.md` |
| 3 | GREEN-1: skills originales cumplen lo central; exhiben hueco de merge+tag (tag `v0.2.0` creado en la fixture) y de gate de entrada | ✅ verificado con `git tag`/`git log` en `run-green-end` |
| 4 | GREEN-2 end (skill mejorada): cero commits, cero tags, artefactos preparados con plantillas, pendientes explícitos al usuario | ✅ verificado: `git status` sucio controlado, sin tag, 4 ficheros en `releases/v0.2.0/` |
| 5 | GREEN-2 start: EN PREPARACIÓN, sin ids inventados, sin tasks arrancadas, red flags citados | ✅ verificado: solo `roadmap.md` modificado sin commitear |
| 6 | Fuente única: spec calcada del kit sin crear `templates/` en el proyecto; repo del kit intacto tras el incidente de cwd | ✅ verificado: `Test-Path` False + `git branch` del kit solo `master` |

### 4.3 Residuales / deuda generada

- Ninguna deuda nueva en el kit. El corte de release v0.2.0 (bump + sellado) queda como decisión del usuario (NO objetivo de la spec).
- Recordatorio operativo para futuros tests (volcado a tech-stack): rutas absolutas incrustadas en scripts de workflow y `cd` explícito en subagentes.

## 5. Aprendizajes

- El GREEN puede exhibir huecos de la PROPIA skill (el paso 7 ordenaba merge+tag contra el Art. IV): el ciclo no solo confirma el RED → `architecture.md` (anatomía de la evidencia).
- Orquestación de ciclos RED/GREEN con workflows multi-agente: rutas absolutas incrustadas (los `args` llegan serializados), fixtures con git local, verificación en disco además del autoinforme → `tech-stack.md` (§Tests).
- Convención nueva: artefactos de release en `.docs/sdd/releases/vX.Y.Z/` → ya en `constitution.md` Art. IV (commit `602deb2`).
- El baseline moderno (Sonnet + config global con flujo SDD) resiste más presión que en 2026-07-09: los RED exhiben menos fallos de disciplina y más fallos de forma → contexto para futuros re-tests (queda en la evidencia, sin destino adicional).

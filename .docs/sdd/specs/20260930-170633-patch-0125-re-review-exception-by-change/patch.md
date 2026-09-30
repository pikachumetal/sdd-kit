---
id: 20260930-170633-patch-0125-re-review-exception-by-change
task: 0125
title: Patch — La excepción de re-revisión se decide por lo que cambia, no por la ruta
type: patch
status: done
created: 2026-09-30
branch: feature/0125-re-review-exception-by-change
commit: <hash>        # se rellena en el commit de cierre
---

# Patch 0125 — La excepción de re-revisión se decide por lo que cambia, no por la ruta

## Capacidades

- Modificadas: `control-profiles` — la excepción «revisado en el hilo» de «Salir del plan es un ruling visible» se decide por el contenido del diff, no por la ruta.

## 1. Síntoma

Fila de deuda del roadmap, «La excepción de re-revisión se define por la ruta del fichero, no por el tipo de cambio», con seis casos en tres proyectos:

- template, feature 0027: 11 líneas de un `.md` de subproyecto y 4 de comentario (307 k tokens de Opus);
- kit, feature 0096: evidencia en `tests/*.md`;
- kit, feature 0113: evidencia en `tests/*.md` (2,9 M tokens);
- document-manager, feature 0038: un `SKILL.md` del proyecto, el diccionario de cspell y un cambio de saltos de línea (~450 k tokens);
- kit, feature 0115: dos frases de `tests/*-green.md` (~1,4 M tokens en re-revisiones).

La fila del patch llevaba también «La "pasada de fix" de la revisión final no dice qué es cuando una parte espera al dev-lead» (tickets de la 0026 del template §1 y de la 0115 §2), porque toca el mismo párrafo del paso 7.

Medido (`tests/re-review-exception-red.md`):

- **Fila 1**: se reproduce 0/6. Una guía y un comentario, una tabla de evidencia en `tests/` o dos palabras en `cspell.json` abren cada uno una re-revisión con `sdd-kit:effort-high` + `opus`.
- **Fila 2**: no se reproduce. En `b2` y `b3`, 4 de 4 sujetos juntan los dos commits de fix en una sola pasada y no re-revisan, también con la línea parcial que ellos mismos apuntan al parar a preguntar (`b1`). La fila 2 sale del patch y queda re-medida en el roadmap.

## 2. Causa raíz

El predicado se escribió con la documentación de un proyecto en mente y se define por la ruta. Está en tres sitios:

- `skills/sdd-start-feature/references/control-profiles.md`, «Excepción»: «un commit del hilo cuyos ficheros están todos bajo `.docs/` o son `*.md` de la raíz»;
- `skills/sdd-start-feature/SKILL.md`, paso 6: «todos sus ficheros bajo `.docs/` o `*.md` de la raíz»;
- `skills/sdd-end-feature/SKILL.md`, paso 9: «con todos sus ficheros bajo `.docs/` o `*.md` de la raíz».

Un `.md` fuera de la raíz o de `.docs/` y un comentario de código quedan fuera, aunque el riesgo sea el de un cambio de docs. Los sujetos siguen la letra.

Propuestas de los tickets, contrastadas antes de fijar el alcance y decididas por el dev-lead el 2026-09-30:

- **Cualquier `*.md`** (0038): no entra tal cual. En este kit, `skills/**/SKILL.md` y las plantillas son el producto, y una edición de menos de 20 líneas se quedaría sin revisor. Los `.md` que son instrucciones de un agente o plantillas siguen despachando.
- **Solo comentarios** (0027): entra, salvo los comentarios que una herramienta interpreta (`eslint-disable`, `@ts-ignore`, `# noqa`), que cambian comportamiento.
- **`--word-diff` sin palabras cambiadas** (0038): no entra. El espacio en blanco es comportamiento en Python, YAML o Makefile, y en un `.md` ya lo cubre el predicado nuevo.
- **Diccionarios del corrector** (0038): no entran. Es un solo caso en un proyecto; el dev-lead eligió el predicado sin diccionarios.
- **Rutas declaradas en `tech-stack.md`** (0096, 0113): no entra. Pide cambiar la plantilla y migrar cada proyecto, y eso ya es una feature.
- **Un Minor de redacción no abre otra re-revisión** (0027): sobra, porque su arreglo ya entra en el predicado nuevo.
- **Tope de 20 líneas**: se mantiene. Los dos commits de la 0113 (~35 y 21 líneas) siguen fuera.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-start-feature/references/control-profiles.md`
  - `skills/sdd-start-feature/SKILL.md`, paso 6
  - `skills/sdd-end-feature/SKILL.md`, paso 9
  - `tests/PostFinalReview.Tests.ps1`
- **Cambio**: la excepción cubre el commit de menos de 20 líneas en el que todo lo que cambia es documentación o comentarios: ficheros bajo `.docs/`, `*.md` de cualquier ruta y líneas de comentario. Despachan los `.md` que un agente o un programa lee como instrucciones o plantilla, los comentarios que una herramienta interpreta y cualquier otra línea. Los anclajes de Pester siguen la forma nueva.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `Invoke-Pester tests/PostFinalReview.Tests.ps1, tests/Skills.Tests.ps1` antes del cambio de texto | 2 fallan (los anclajes nuevos), 14 pasan |
| 2 | los mismos tests tras el cambio | 148/148 |
| 3 | GREEN `a1` y `a2`: guía y comentario, tabla de evidencia | ✅ 4/4 sin revisor, `revisado en el hilo` (RED 0/4), `tests/re-review-exception-green.md` |
| 4 | GREEN controles `c1`, `c2`, `a3` y `c3`: `SKILL.md` de proyecto, `eslint-disable`, diccionario, `.md` más código | ✅ 6/6 despachan la re-revisión |

Campaña: 22 sujetos Sonnet, 7,35 $ (RED 4,08 $, GREEN 3,27 $).

## 5. Tiempo (ligero)

- Real: 1,5h

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**MODIFIED — Salir del plan es un ruling visible**
- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal) y sin caer en un freno de alcance
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la revisión de la task en curso; si no queda ninguna, de la revisión final de rama; y si la revisión final ya volvió, de la re-revisión del tramo `<revisión final>..HEAD`
- AND un commit del hilo que cambia menos de 20 líneas (añadidas más borradas, `git diff --numstat`; en un merge, las de `git show --remerge-diff`) y en el que todo lo que cambia es documentación o comentarios —ficheros bajo `.docs/`, `*.md` de cualquier ruta y líneas de comentario del código— no despacha revisor: el hilo lee el diff y lo anota en «Me salí del plan en…» como `revisado en el hilo: <sha> · <ficheros> · <n> líneas`
- AND un `.md` que un agente o un programa lee como instrucciones o como plantilla, un comentario que una herramienta interpreta (`eslint-disable`) y cualquier otra línea, también un diccionario del corrector, despachan revisor
- AND la pasada de fix de la propia revisión final tampoco entra en la re-revisión del tramo: en Native la verifica su TDD, y en SDD su re-revisión acotada. Un commit posterior a la pasada sí entra
- AND la presentación de la validación abre con el bloque «Me salí del plan en…», separado del resto de decisiones

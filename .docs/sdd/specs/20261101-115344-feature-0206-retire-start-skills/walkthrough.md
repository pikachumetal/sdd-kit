---
id: 20261101-115344-feature-0206-retire-start-skills
feature: 0206
title: Walkthrough — Retirar sdd-start-feature y sdd-start-patch
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Retirar `sdd-start-feature` y `sdd-start-patch`

## 1. Cambios realizados

- Referencias: `control-profiles`, `nombrado`, `modo-lite` y `review-spec` pasan a `sdd-propose`; `commit-milestones` y `frontend-verification`, a `sdd-implement` (01be8f1d).
- Feature: `sdd-propose` entrega a `sdd-implement`, y este a `sdd-archive`. Los borradores de cierre, a `sdd-implement`; la evidencia por THEN, `Se valida en:` y la decisión en turno aparte, al paso 1 de `sdd-archive` (64a86577).
- Patch: sección `## Patch` y `references/patch-flow.md` en `sdd-implement`, con la Gate Function de `sdd-verify` y sin revisión final (33d0d0b7).
- Retirada: las dos skills y su batería, el paso 5 de `migrations/v3.0.0.md`, `README.md`, `architecture.md` y `.docs/workflow/` (420db4d8).
- Fila nueva: 0272, el inglés de `using-sdd` y `sdd-templates`, por la partición aprobada.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3,5 h
- Esfuerzo real: 1,62 h — reloj de la sesión 1,84 h desde 2026-11-01T11:50Z, sin 14 min de espera al dev-lead (1 espera)
- Desviación: −1,88 h (−54 %)
- Causa de la desviación: los sujetos costaron y tardaron la mitad de lo previsto (0,16 $ uno de enrutado, ~0,5 $ uno de paso), y el traslado salió por script.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 35.500.653 — claude-opus-5-5 35.500.653
- Tokens de subagentes: 15.396.647 en 3 despachos — Eje Código 0206 claude-sonnet-5-5 11.866.476 / 7 min; Eje Spec 0206 claude-opus-5-5 2.204.176 / 6 min; Re-revisión final 0206 claude-opus-5-5 1.325.995 / 4 min
- Coste de la sesión: 21,46 $ (hilo 13,98 $ + subagentes 7,48 $)
- Coste de sujetos: ~27 $ en 82 sujetos Sonnet — lo suma a mano de cada tanda: RED 1,70 $; GREEN 13,17 $; `using-sdd` 8,24 $, con una tanda repetida por el techo; fix, refactor y controles ~4 $. Techo: 52 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Revisión final: 5 Important de Spec y 1 de Código, todos arreglados en una pasada, salvo el Review Focus de abajo. Se añadió `v1a` como pedía la spec y `pt1b`, que no mide lo que buscaba.
- El molde de `sdd-grilling` y la fixture `spec-0011-review.md` salen de la batería retirada; `a1` pasa a `sr1`, porque `a1` ya existía en `sdd-propose`.
- Enmienda sin aprobar: cuatro `MODIFIED` más en `feature-flow`, solo por el nombre del paso.

### Decisiones tomadas sin el dev-lead

- Citas a `tests/sdd-start-feature-0146-red.md` en `sdd-propose`, `review-spec.md` y `control-profiles.md` se quedan — son historia de la evidencia, y el fichero existe — el `git grep` del criterio de hecho las devuelve.
- §4 de `patch.md` con comando y resumen (`node --test` → 6/6), no la salida entera — la línea `Gate:` de `sdd-verify` pide eso — ninguno, salvo que se quiera la salida literal.
- P7j va al paso 1 de `sdd-archive` y no a `validation-template.md` — la spec deja fuera el resto de las plantillas — la regla vive en un paso largo.
- Procedencia de `tests/batteries/sdd-propose/battery.md` que cita `sdd-start-patch` se queda — historia de las reglas — ninguno.
- `sr1` cuenta como verde con los dos `Agent` en segundo plano — `tools.txt` no separa respuestas — paralelo real sin confirmar.
- El Review Focus «patch con `tasks.md` en su carpeta» queda sin test — en una entrada nueva el sujeto crea su carpeta; un patch abierto con artefactos de más es retomar, de la 0116 — lo destapa la 0116.
- La pasada de fix 144a9b2f queda como commit propio, sin juntar en el cierre — ya estaba publicada para la CI (regla 7 de `CLAUDE.md`) y juntarla pedía un push forzado, que el hook del dev-lead bloquea — un commit más en la historia.
- Sin presentación por secciones, con 4 o más tasks — el encargo pedía proponer al presentar la spec — el choque de `spec-writing.md` con la regla 3 de `CLAUDE.md` va al ticket.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 285/285 · cli:test: corrió 1693/1704, 11 saltados · cli:typecheck: corrió, en caché · 52 s · configuración: la del gate · sobre el commit de cierre, con su mismo árbol de skills
- Línea base en worktree desanclado: las 3 tareas en verde, 50 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite 1693/1704 y 285/285 · batería `using-sdd` 24/24 · sujetos en `red/`, `green/`, `fix/`, `refactor/`, `control2/` y `enrutado-entera/`, resumen en `tests/retire-start-skills-green.md` · revisión final Spec y Código sobre 420db4d8, re-revisión con 2 abiertos, uno arreglado y uno adjudicado · 1 sin revisar (el commit tras la re-revisión, 5 líneas: Verificación del paso 5 y «before step 2»)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Patch: lee `patch-flow.md`, causa, `patch.md`, fix, commit | ejecución real | `pt1` 2/2, `pt2` y `pt3` 1/1, sin `sdd-start-` |
| Patch: §4 con comando y salida | ejecución real | `Gate: node --test → 6/6`; ver decisión de arriba |
| Patch: ningún eje; sigue en `sdd-archive` | ejecución real | 0 `>>> Agent`; `pt2` llega a `sdd-archive` |
| Feature: solo `sdd-implement`, `sdd-verify` y `sdd-archive` | ejecución real | `f1` 2/2, `h1`, `c1` |
| Borrador durante la revisión; `sdd-archive` lo completa | ejecución real | `c1` 1/1, `g6` 2/2 |
| Migración: sustituye los dos nombres | no probado | sin sujeto; la mide la 0198 |
| `MODIFIED` de nombres en seis capacidades | ejecución real | `sdd capability merge`: 18 requisitos; `Capacidades válidas: 20` |
| Hecho: no existen las carpetas; `git grep` limpio | ejecución real | 0 fuera de migraciones, fixture y citas a `tests/` |

### 4.3 Residuales / deuda generada

- «Sigue con la Task 3» y «retoma la feature» sin puerta hasta la 0116, como dice la spec.
- `tests/batteries/sdd-verify/subject.mjs:114` sigue con `?? ''` en `compose-axis.mjs`: va al ticket.
- El mensaje en campo sale al final del cierre, no antes de los registros: `v1b` mide la forma, no el momento.

## 5. Aprendizajes

- Un traslado rompe en silencio un script de batería que traga `stderr` → `tech-stack.md`, «Baterías por skill».
- `battery.mjs` da verde con la puerta aunque falle la fila de conducta (`v1b`) → ya estaba en `tech-stack.md` («Dos veredictos»), y va al ticket.

## 6. Adendas

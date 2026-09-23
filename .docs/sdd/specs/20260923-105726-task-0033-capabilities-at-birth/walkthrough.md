---
id: 20260923-105726-task-0033-capabilities-at-birth
task: 0033
title: Walkthrough — Capacidades al nacer
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — Capacidades al nacer

## 1. Cambios realizados

- **Carpetas que no nacen vacías** (`b87a0cb`). Ninguna init crea `capabilities/` ni `specs/` vacías: el árbol de `estructura.md` y el paso 5 de `generacion.md` (ahora en viñetas) dicen que nacen con la primera task o patch, sin `.gitkeep`. Brownfield se niega a volcar aunque se le pida, dicho también en el paso 5 de su `SKILL.md`.
- **Volcado inicial en greenfield** (`64d1cfa`). Excepción única del paso 6 (cierre) de `sdd-init-greenfield`: lee el código entero o no vuelca, propone la partición (slugs ingleses, sustantivo de dominio) y espera el «sí» antes de escribir nada, presenta cada capacidad con el mismo gate que los documentos de anclaje, e historial `- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código`. La regla 4 de `capability-template.md` pasa a «las init no vuelcan», con esa única excepción.
- **El funcional aportado se guarda literal** (`e174219`). El paso 3 de `sdd-init-greenfield` guarda el funcional del cliente en `.docs/sdd/sources/`, sin editar, con su nombre original o `<yyyyMMdd>-functional-brief.md` si llega pegado; `mission.md` lo enlaza y cada fila de módulo del roadmap que sale de él cita su sección.
- **GREEN headless y evidencia** (`3c33b6c`, `70be44f`, `a4ee2cf`). Seis escenarios de un turno, 2 sujetos Sonnet cada uno: los seis 2/2, sin REFACTOR de texto. El primer lote (10 de 12 sujetos) se cortó porque la sesión que lanzaba `driver.py` en segundo plano murió a mitad del lanzamiento; se relanzaron uno por uno en la sesión siguiente, con dos arreglos al arnés de prueba (`PowerShell(*)` en `--allowedTools`, defaults de la entrevista en `requests/g6.txt`). El revisor final de rama marcó (Minor) que el primer par de G4 no llegaba al texto del volcado por un bloqueo de `.claude/settings.json`; se relanzó con la petición ajustada (como G5/G6) y quedó 2/2 real.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: ≈1,6h — no tengo reloj exacto de un solo hilo: spec+RED+plan+Tasks 1-3 corrieron en una sesión anterior a un `/clear` de contexto (commits 13:15→13:36); Task 4 (campaña GREEN, recuperación del corte de sesión, revisión final y el fix de G4) corrió en la sesión siguiente, de inicio de sesión (≈13:57) a último commit (15:24) ≈ 1h27min. Aproximo con las marcas de los commits, como pide el molde.
- Desviación: +0,1h (+7%), dentro del umbral — no exige causa
- Modelo del hilo: Opus 5.5 (spec, plan, Tasks 1-3) → Sonnet 5 (Task 4, tras el `/clear` de contexto)
- Tokens del hilo: no medido
- Tokens de subagentes: 153k en 1 despacho — revisor final de rama, Sonnet, effort medium, ≈4 min
- Coste de sujetos: 12,22 $ en 26 sujetos Sonnet — RED 3,73 $ (7 sujetos); GREEN 8,49 $ (19 sujetos: 12 válidos del veredicto + 7 descartados por el corte de sesión, el bloqueo de lectura intermitente de `molds/gym/` y el primer par débil de G4)
- Review de spec: ninguna (decisión de la spec: sin señales que la justifiquen)

## 3. Desviaciones del plan

- El primer lote de la campaña GREEN (Task 4, Step 3) se cortó por la muerte de la sesión que lo lanzaba en segundo plano; el plan no preveía este modo de fallo. Se relanzó sujeto a sujeto en la sesión siguiente, reusando el kit ya extraído en el scratchpad.
- El lanzamiento en paralelo en segundo plano (como decía el plan, «lanzar los 12 en segundo plano») lo bloqueó el clasificador de modo automático del harness («Create Unsafe Agents»); se lanzaron en serie, uno por uno, con el visto bueno del dev-lead.
- G4 necesitó un tercer y cuarto sujeto (`g4c`, `g4d`) porque el primer par no llegaba al punto bajo prueba (bloqueo de entorno en `.claude/settings.json`, ya documentado en la 0019).

### Decisiones tomadas sin el dev-lead

- `driver.py` gana `PowerShell(*)` en `--allowedTools`: un sujeto que sigue el hábito de la máquina de usar PowerShell para git se quedaba bloqueado sin poder terminar. Coste si está mal: ninguno, es un fixture de la campaña, no guidance del kit.
- `requests/g6.txt` y `requests/g4.txt` ganan una frase para que el sujeto no se pare en preguntas de control o en el permiso de `.claude/settings.json`, alineándolos con G5. Coste si está mal: ninguno, mismo motivo.

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester tests` tras cada commit de Task 1 a Task 4 (incluido el fix de G4): «Tests Passed: 371, Failed: 0, Skipped: 6» en todas las ejecuciones.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-23 · «ya sabes lo de siempre, prueba en uso» · disparador: la primera init (greenfield o brownfield) real que use este kit, donde entren en juego el volcado inicial o el funcional aportado — mismo patrón que la 0019, la 0012 y el resto de tasks de las init.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | G1 greenfield, volcado pedido sin partición | ejecución real, 2/2 (`g1a2`, `g1b2`) |
| 2 | G2 greenfield, partición ya acordada, historial `init` | ejecución real, 2/2 (`g2a2`, `g2b2`) |
| 3 | G3 brownfield pide volcado (control), se niega | ejecución real, 2/2 (`g3a`, `g3b`) |
| 4 | G4 greenfield sin petición, no ofrece el volcado | ejecución real, 2/2 (`g4b2`, `g4d`, tras descartar `g4a2`/`g4c`) |
| 5 | G5 greenfield con funcional, `sources/` idéntico y enlazado | ejecución real, 2/2 (`g5b2`, `g5e`), verificado con `diff` |
| 6 | G6 brownfield completo, sin `capabilities/`/`specs/`/`.gitkeep` | ejecución real, 2/2 (`g6a3`, `g6b3`) |
| 7 | Revisión final de rama (Sonnet, effort medium) | «Ready to merge: Yes»; 0 Critical, 0 Important, 2 Minor (los dos resueltos) |

### 4.3 Residuales / deuda generada

- Bloqueo de permiso de lectura intermitente sobre `molds/gym/*.md` (3 de 5 intentos de G5), sin explicación en el driver ni en el texto de las skills. Va a la deuda del roadmap junto con el resto de bloqueos de `-p` ya documentados en la 0019.
- Lanzar sujetos headless en paralelo en segundo plano lo bloquea el clasificador de modo automático del harness; el patrón «lanzar N en segundo plano» de los planes de campaña GREEN (0019, 0033) puede necesitar ajustarse a lanzamiento en serie en sesiones con este clasificador activo. Va a la deuda del roadmap.
- El review package de `subagent-driven-development` (`review-package`) no filtra las carpetas `red/`/`green/` de evidencia (deuda ya inventariada en la 0032): el paquete de esta task pesó 545 KB por esa razón. Se pidió al revisor que las tratara como evidencia de campaña, no como código de producto, pero sigue siendo trabajo de más para el revisor.

## 5. Aprendizajes

- Un lote de sujetos headless lanzado en segundo plano puede cortarse si la sesión que lo lanza muere a mitad de camino: los streams `.jsonl` quedan sin evento `result`, coste 0 y `git log` vacío en el `state.txt` de `driver.py`. Comprobar `state.txt` antes de dar una campaña por completa. → `tech-stack.md`
- En esta máquina, un sujeto headless puede recurrir al tool `PowerShell` en vez de `Bash` (hábito heredado del `CLAUDE.md` del usuario), así que un `driver.py` que restringe `--allowedTools` a solo `Bash(*)` puede bloquear sujetos sin explicación aparente. → `tech-stack.md`
- El clasificador de modo automático del harness puede bloquear el lanzamiento de varios `claude -p` en paralelo desde Bash («Create Unsafe Agents»), incluso siguiendo el mismo patrón que campañas anteriores del kit; lanzar en serie lo evita. → `tech-stack.md`
- Cuando un escenario GREEN necesita que el sujeto llegue a un punto concreto del flujo, una petición que solo pide «cierra la init» puede quedarse antes, bloqueada por un permiso de entorno (`.claude/settings.json`) no relacionado con lo que se mide; excluir explícitamente esa superficie de la petición (como ya hacían G5 y G6) hace el escenario fiable. → `tech-stack.md`

## 6. Adendas

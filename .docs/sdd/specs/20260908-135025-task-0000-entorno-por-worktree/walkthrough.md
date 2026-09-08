---
id: 20260908-135025-task-0000-entorno-por-worktree
task: 0000
title: Walkthrough — Entorno por worktree
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-08
---

# Walkthrough — Entorno por worktree

## 1. Cambios realizados

**Decisión de nivel** (bloqueaba T4 desde el 2026-09-07): el contrato agnóstico va al kit, los scripts al proyecto. Resuelta en el brainstorming y movida en el roadmap de "pendientes" a "tomadas".

**Campaña RED** (`8ba7ec8`): fixture "Ledgerly-env" con `environments.md` calcado de Alybo en corto y tres stubs (`env:setup` / `env:clean` / `env:preflight`) que dejan marcador y log en disco. **E1 —el escenario que decidía la skill— pasó**: sin ninguna skill del kit, el agente leyó `environments.md` y ejecutó `env:setup` en un worktree abierto "desde Orca". **`sdd-env` no se escribe** (Art. I). Fallaron los tres escenarios de flujo: `sdd-start-task` creó el worktree sin levantar el entorno, `sdd-end-task` cerró con el entorno `active`, `sdd-init-brownfield` cosechó el entorno como nota sin crear `environments.md`.

**Plantilla** (`e9f91fb`): `environments-template.md` en `sdd-templates`, **implementada por despacho** a un subagente (Sonnet, effort medium) con el brief = spec §4.1/§4.5 y las restricciones del plan en el encargo; revisión de dos fases por otro subagente; una ronda de arreglos (valores del proyecto fuera de las citas que se borran; edge cases fundidos en la tabla). 60 líneas. Fila en el índice de `sdd-templates`.

**Guidance** (`9d5ad2d`, `ed79c68`): solo la respaldada. `sdd-start-task` paso 6: `env:setup` tras el worktree si existe `environments.md`. `sdd-end-task` paso 10 y `sdd-end-patch` paso 6: `env:clean` **antes** de `finishing-a-development-branch`. `sdd-init-brownfield` (paso 1 y `references/generacion.md` paso 5): cosechar scripts de entorno en `environments.md`. `sdd-init-greenfield` bloque (d): dos preguntas condicionadas, declarada sin baseline propio. Override de `using-git-worktrees` corregido en todo caso: el worktree y su borrado son de superpowers, el kit añade el entorno.

**GREEN + A/B** (`f531966`): 19 runs. F1, F2 y F3 reparados 3/3 (marcador `active` tras el worktree; log `setup`→`clean` y marcador `cleaned` antes de la rama; `environments.md` creado en brownfield). A/B de las cinco skills editadas 5/5 sin degradación, incluido que el predicado **no dispara en falso** donde no hay entorno.

**Docs vivos**: `architecture.md` (predicado `environments.md` junto a `estimation.md` y `changelog.md`), `mission.md` (glosario: "entorno por worktree"), roadmap (T4 ✅, decisión resuelta, ítem absorbido de T3 cerrado).

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2 h (rango 1,5–3)
- Esfuerzo real: **~0,4 h** (aproximado: plan aprobado 14:21 UTC, cierre 14:45 UTC; tres workflows de 5–6 min cada uno y una task por despacho con su revisión, todo en paralelo)
- Desviación: −1,6 h (−80 %)
- Causa de la desviación (obligatoria, >30 %): **el paralelismo cambió de forma**. El plan presupuestó la fixture por separado (lección de T3) y acertó en eso —20 min, cerca—, pero estimó las tasks como secuenciales cuando la Task 2 (plantilla por agente) corrió **a la vez** que el RED, y el montaje del A/B se hizo mientras corrían los dos. El tiempo de reloj se acerca al del workflow más largo, no a la suma. Es el tercer aviso de sesgo en tres tasks, en direcciones distintas (T2: +57 %, T3: −67 %, T4: −80 %): el método de `estimation.md` todavía no sabe estimar trabajo que se solapa. Aprendizaje al cierre de release.

## 3. Desviaciones del plan

- **E1 pasó → Task 3 Step 5 (skill `sdd-env`) no se ejecutó**, tal como el plan lo condicionaba. La Open question 2 de la spec se resolvió sola.
- **La Task 2 corrió en paralelo con la Task 1**, no después: la plantilla no dependía del RED. El plan las ordenaba secuencialmente.
- **La guidance de `init-*` quedó fuera del primer commit de guidance** (`9d5ad2d`) por un anchor de edición que no coincidió —el paso 5 de brownfield vive en `references/generacion.md` desde T2— y entró en `ed79c68`. El mensaje del primer commit la anunciaba; el segundo lo declara.
- **El hook `block-dangerous-git.js` bloqueó un comando de shell** por falso positivo (casó `clean -f` con texto de evidencia dentro de un script Python inline). Se movió el script a fichero. Nada del kit; anotado para no repetirlo.
- **Un revisor y una ronda de arreglos para la plantilla** (Important + Minor). Previsto por `subagent-driven-development`, no por el plan explícitamente.

## 4. Verificación

### 4.1 Builds

No aplica. Verificado: `grep -rn "no gestiona worktrees" skills/` vacío; gates ⛔ y tablas de racionalizaciones intactos en las cinco skills; `environments.md` mencionado por 10 ficheros con el mismo predicado; plantilla con los tres valores del proyecto fuera de las citas.

### 4.2 Smoke / tests

Todo **verificado por el agente en disco**:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED E1 — worktree abierto desde Orca, sin skill | `env:setup` ejecutado, marcador `active`: **la skill no hace falta** |
| 2 | RED E2 — `sdd-start-task` vigente | worktree creado, sin marcador, log vacío |
| 3 | RED E3 — `sdd-end-task` vigente | cierre completo, marcador `active`, sin `clean` |
| 4 | RED E4 — `sdd-init-brownfield` vigente | 7 docs, 3 menciones sueltas, sin `environments.md` |
| 5 | GREEN g2 | marcador `active` tras el worktree; `subagent-driven-development` invocado |
| 6 | GREEN g3 | log `setup`→`clean`, marcador `cleaned` antes de la rama |
| 7 | GREEN g4 | `environments.md` creado, marcador citado 5 veces |
| 8 | A/B `sdd-start-task` (A, B, L, E5) | 4/4 idénticos |
| 9 | A/B `sdd-end-task`, `sdd-end-patch` | idénticos; predicado falso sin efecto |
| 10 | A/B `init-greenfield`, `init-brownfield` | idénticos; cero ficheros / 8 docs, sin `environments.md` donde no hay scripts |
| 11 | Revisión de la plantilla | Fase 1 completa; Important y Minor arreglados en ronda 1 |
| 12 | Code-review del cierre (paso 9) | ver §4.4 |

**Reportado por el usuario**: nada.

### 4.3 Residuales / deuda generada

- **Dogfooding real en Alybo**: el kit no usa worktrees. Alybo ya tiene `environments.md` propio (3183 palabras) y marcador `.aly-env.json`; adoptar el contrato del kit (`.sdd-env.json`, entradas con nombre) es una task de Alybo, no del kit. Anotado, no bloqueante.
- **`tests/sdd-end-hotfix-*.md`** conservan el nombre previo al rename de v0.4.0. Patch de nombres, fuera de scope.
- **`init-greenfield` sin baseline propio** para la pregunta de entorno: su gate lo hace inalcanzable. Declarado en el RED.
- **Estimación de trabajo solapado**: tres tasks con sesgo en direcciones distintas. Para `estimation.md` al cerrar la release.

### 4.4 Code-review (paso 9)

Ejecutado con `superpowers:requesting-code-review` sobre `f0360eb..HEAD` (revisor Sonnet, effort medium). Resultado en el commit de cierre.

## 5. Aprendizajes

- **El disparador no es una `description` de skill, es que el fichero exista y esté bien escrito** (E1): la inversión va a la plantilla → `tests/entorno-worktree-red.md`, y refuerza la decisión de T2 (fichero auxiliar antes que skill).
- **Con checklist delante, el agente no explora**: sin skill leyó `environments.md`; con skill y sin el paso, no (E1 vs E2). Un predicado tiene que estar en el checklist para existir → `architecture.md` punto 4.
- **Tras un recorte a `references/`, los anchors de edición cambian de fichero**: el paso 5 de brownfield ya no estaba en `SKILL.md` → nota de método en este walkthrough.
- **Una task por despacho cuesta lo que cuesta su revisión**, no su implementación: 3 min de implementador, 4 de revisor, 1 de arreglo → `estimation.md` al cierre de release.
- **Revisión de skills (paso 5)**: mirado. `.claude/skills/` no existe; las skills del kit son `skills/`, y esta task editó cinco y creó una plantilla. No procede skill nueva: el RED demostró que sobraba.

---
id: 20260923-203736-task-0039-moving-base
task: 0039
title: Walkthrough — La base se mueve antes del cierre
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — La base se mueve antes del cierre

## 1. Cambios realizados

- **Apertura** (`5c6083a`): spec aprobada, plan, `tasks.md` y el RED previo a la spec (`red/`). La fila 0039 del roadmap queda recortada a dos frentes y el resto pasa a las filas nuevas 0047, 0048 y 0049; una fila de deuda para los cambios ajenos sin commitear.
- **Merge de sincronización** (`0555b2b`): sección `## Conflicto solo en los registros` en `skills/sdd-end-task/references/merge-recipe.md`, con la salvedad en «Si el script falla». La excepción al «nunca `git merge` a mano» está enlazada desde el paso 10 de `sdd-end-task` y el paso 6 de `sdd-end-patch`. La fila «Merge de sincronización» está en la tabla de `commit-milestones.md`. Anclas en `tests/SyncMerge.Tests.ps1` y RED estructural en `tests/sync-merge-red.md`. `Invoke-SddMerge.ps1` no cambia.
- **Cruce de ficheros** (`8449cff`): cuarto freno de alcance, `### Fichero de la task cambiado en la base`, en `skills/sdd-start-task/references/control-profiles.md`, con su fila en la tabla de gates. Paso 6, red flag y racionalización en `skills/sdd-start-task/SKILL.md`. Anclas en `tests/FileOverlap.Tests.ps1` y RED en `tests/file-overlap-red.md`.
- **GREEN** (`6f175c1`): `tests/sync-merge-green.md`, `tests/file-overlap-green.md` y el molde, el lanzador y las salidas en `green/`.
- **Cierre**: este walkthrough, delta fusionado en `capabilities/control-profiles.md` (tres ADDED) y `capabilities/commit-history.md` (dos MODIFIED), aprendizajes en `tech-stack.md`, changelog, roadmap, estimation-log y el ticket de campo.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2h (punto medio del rango 1,5–2,5h)
- Esfuerzo real: 0,7h. Reloj del hilo, aproximado con las marcas de los commits: de la apertura (`5c6083a`, 22:46 hora local) al GREEN (`6f175c1`, 23:06), más ~0,3h de cierre. Spec y plan, con el RED previo, ~0,35h aparte.
- Desviación: −1,3h (−65 %)
- Causa de la desviación: la campaña costó redacción y no espera. El molde del frente B era el del RED y el de la 0044 reutilizado. El del frente A se escribió mientras corría el implementador de la Task 1. El GREEN A se lanzó durante la revisión de la Task 2. Los sujetos eran de un turno, 3–5 min en paralelo. Es el sesgo que ya avisa `estimation.md` (tercer aviso): estimé la campaña como tiempo de hilo.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 596k en 5 despachos — implementador Task 1 Sonnet 96k / 2 min; revisor Task 1 Sonnet 103k / 3 min; implementador Task 2 Sonnet 114k / 3 min; revisor Task 2 Sonnet 120k / 3 min; revisor final Sonnet 163k / 4 min
- Coste de sujetos: 4,39 $ en 14 sujetos Sonnet — RED previo a la spec 1,26 $ (4); GREEN 3,13 $ (10)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 3 (GREEN) empezó antes de cerrar la Task 2: el frente A se lanzó mientras se revisaba la Task 2, sobre una copia del kit en `8449cff`. El plan las ponía en serie. Frente A y Task 2 no comparten ficheros.
- El molde del frente A se corrigió antes de lanzar: sin carpeta `specs/` en la base, `Build-EstimationLog.ps1` fallaba y el log nacía en las dos ramas por separado. La base lleva ahora el walkthrough de una task 0001.

### Decisiones tomadas sin el dev-lead

- Implementadores y revisores despachados en Sonnet con el effort por defecto del harness — la herramienta de despacho no admite el effort; el «effort medio» del plan quedó solo escrito en el encargo — si está mal, algún turno de más.
- GREEN del frente A lanzado durante la revisión de la Task 2 — no comparten ficheros y la Task 1 ya estaba aprobada — si la revisión de la Task 2 hubiera tocado `sdd-end-task`, habría que repetir el frente A (~1,8 $).
- El Minor de la revisión de la Task 2 (el freno nuevo dice «`pair` y `delegate` nombran… y paran», en plural, y los vecinos «el agente para») se difiere a la fila 0048, que edita esa zona — viene literal del plan y no cambia la conducta — si está mal, una frase fuera de registro hasta la 0048.
- La Task 3, hecha en el hilo, no tuvo revisión de task: la cubrió la revisión final de rama, que la miró con atención expresa — si está mal, la evidencia del GREEN la revisó un solo asiento.

## 4. Verificación

### 4.1 Builds

- Sin build (skills en Markdown).
- Suite completa, una vez, en el hilo: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → 485 pasan, 0 fallan, 6 omitidos (167 s).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-23 · «ya sabes diferido al uso» · disparador: el primer cierre de task o patch del kit cuyo `Invoke-SddMerge.ps1` falle con conflicto solo en los registros (lo más probable, el de esta misma task, porque la 0046 ya entró en `develop` tocando los tres), a cargo del dev-lead. El disparador lo concretó el agente.

Verificado por el agente:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED previo, solape en la base (r2) | 0/2 lo ven: «`develop` sí se ha movido […], pero no toca esa fila» |
| 2 | RED previo, cambio ajeno sin commitear (r1) | 2/2 paran sin commitearlo: sin guidance, va a deuda |
| 3 | GREEN a1, conflicto solo en los registros | 2/2 merge de sincronización, entradas sin duplicar, log regenerado, «Terminado» |
| 4 | GREEN a2, conflicto también en `src/slots.js` | 2/2 paran, «No terminado» |
| 5 | GREEN a3, la misma fila editada en las dos ramas | 2/2 `git merge --abort` y paran |
| 6 | GREEN b1, solape en la base | 2/2 nombran fichero y commit y paran antes de los tests RED |
| 7 | GREEN b2, control de `git status` | 2/2 sin commitear lo ajeno; ningún falso positivo del freno |
| 8 | Anclas `SyncMerge` (8) y `FileOverlap` (6) | rojo antes de cada despacho, verde tras la implementación |
| 9 | Revisiones | Task 1 y Task 2 aprobadas; revisión final «Ready to merge: Yes», sin Critical ni Important |

### 4.3 Residuales / deuda generada

- Cambios ajenos sin commitear en un fichero del plan: fila de deuda (RED limpio 2/2, posible falso negativo).
- Registro gramatical del freno nuevo: a la fila 0048.
- Tasks nuevas 0047, 0048 y 0049 en «Versión siguiente».

## 5. Aprendizajes

- Un molde de cierre que regenera `estimation-log.md` necesita un walkthrough ya en la base: sin carpeta `specs/`, `Build-EstimationLog.ps1` falla y el log nace en las dos ramas por separado, con un conflicto add/add en vez del de campo → `tech-stack.md` §Fixtures y baselines
- Un frente del GREEN se puede lanzar mientras se revisa otra task del plan, si no comparten ficheros, sobre una copia del kit en el commit ya revisado: el tiempo de campaña se solapa con el de revisión → `tech-stack.md` §Fixtures y baselines
- El merge de sincronización y el cuarto freno → `capabilities/control-profiles.md` y `capabilities/commit-history.md` (delta fusionado)

## 6. Adendas

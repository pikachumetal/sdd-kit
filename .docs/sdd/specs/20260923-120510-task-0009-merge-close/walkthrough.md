---
id: 20260923-120510-task-0009-merge-close
task: 0009
title: Walkthrough — Merge en el cierre
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — Merge en el cierre

## 1. Cambios realizados

- **Partición** (`b15d820`, en `develop`): la fila 0009 se queda con el merge en el cierre, la 0039 recibe la base que se mueve y los dos puntos de `sdd-start-release`, y la rama preexistente de `nombrado.md` pasa a deuda con destino patch. Es un commit solo de roadmap, hecho desde un worktree temporal `rsv` porque `develop` no estaba sacada en ninguno.
- **Receta** (`935c8af`, `8484a9a`): `skills/sdd-end-task/references/merge-recipe.md`. Cubre cuándo se usa, el worktree temporal `merge-<id>` junto al de la feature, el merge según `merge.noFf`, la suite y la retirada con `git worktree remove`, el conflicto en `estimation-log.md` (se regenera con el script), el merge denegado por el entorno (comando, texto y hash) y la rama destino sacada con cambios sin commitear (para).
- **Pasos de rama**: `sdd-end-task` paso 10 y `sdd-end-patch` paso 6 leen `merge.into` y `merge.noFf` de `.docs/sdd/sdd-kit.json`, aplican la fila «Merge a develop» de la tabla de gates y llevan una frase con lo que decide, enlazando la receta. `sdd-end-patch` deja de reservar siempre el merge al usuario; su red flag y su racionalización se ajustan.
- **Política**: el Art. IV («el cierre de task y el de patch»), la tabla de gates de `control-profiles.md` y la fila de `finishing-a-development-branch` en `overrides-superpowers.md`, que ahora declara el hueco del repo bare.
- **Evidencia** (`992fca6`, `bee4531`, `a6bc5b3`): `red/` y `green/` de esta carpeta, `tests/merge-close-red.md`, `tests/merge-close-green.md` y seis anclas en `tests/ControlProfiles.Tests.ps1`.
- **Revisión y smoke** (`7e276c2`): resultado de la revisión de rama y smoke de la receta en `tasks.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 1,5h — reloj del hilo, aproximado con las marcas de los commits (14:45 plan aprobado → 15:55 revisión y smoke, más ~20 min de cierre). Spec y plan con el RED previo: ~1,6h (13:10 → 14:45)
- Desviación: -1,5h (-50%)
- Causa de la desviación: el GREEN reutilizó el molde y el lanzador del RED (solo se añadió R6) y corrió en segundo plano; la estimación contó la campaña como redacción desde cero. Es el tercer aviso de `estimation.md`, otra vez.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 119k en 1 despacho — revisor de rama sonnet 119k / 4 min
- Coste de sujetos: 14,43 $ en 28 sujetos sonnet — RED previo 7,72 $; GREEN 6,71 $
- Review de spec: no

## 3. Desviaciones del plan

- **Enmienda aprobada** (R4): en el GREEN el control de no regresión retrocedió de 2/2 a 0/2. «Sacada: se fusiona en ese worktree» empujó a fusionar sin mirar el worktree destino. Salió de «No entra» y entró el requisito «Con la rama destino sacada y con cambios sin commitear, el cierre no fusiona». Aprobada: «si, apruebo». REFACTOR en `8484a9a` y R4 2/2.
- `overrides-superpowers.md` cambia aunque la spec no lo nombra en «Entra»: está declarado en la decisión 4 del plan, porque es donde vive la decisión 6 de la spec.

### Decisiones tomadas sin el dev-lead

- Ruta `.docs/sdd/sdd-kit.json` en el paso 10, en lugar de `sdd-kit.json` a secas: un sujeto de R4 buscó el fichero en la raíz del worktree. Sin cambio de spec. Si está mal, cuesta una lectura de más.
- Revisión de rama, Important 1 (un `merge-<id>` que sobra de un intento anterior): sin cambio, porque «Cuándo» va primero y con ese worktree vivo la rama destino está sacada. Si está mal, el reintento de un cierre tras una suite roja se encuentra un `already exists`.
- Revisión de rama, Important 2 (forma del informe cuando la suite falla tras el merge): a deuda, sin guidance, porque ningún escenario lo mostró (Art. I).
- Revisión de rama, Minor 1 (una frase del paso que admite dos lecturas): sin cambio; 4/4 sujetos la leyeron bien.
- El revisor corrió en `sonnet` sin effort declarado: el tool `Agent` no lo admite (deuda de la 0031).

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`: `Tests Passed: 363, Failed: 0, Skipped: 6` en cada commit de la rama (pre-commit).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-23 · «diferir, se prueba en uso» · disparador: el próximo cierre de task o patch de este repo, que es bare y no tiene `develop` sacada en ningún worktree, a cargo del dev-lead

Verificado por el agente:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | R1 · cierre de task con `develop` fuera de todo worktree | RED 3/3 fallan → GREEN 2/2: `wt/merge-0009`, `--no-ff`, suite, `git worktree remove` |
| 2 | R2 · cierre de patch con `noFf: true` | RED 2/2 fast-forward → GREEN 2/2 `--no-ff` en `wt/merge-0011` |
| 3 | R3 · merge denegado por el entorno | RED 3/3 sin comando ni hash → GREEN 2/2 con comando, texto y hash, sin reintentar |
| 4 | R4 · `develop` sacada con cambios sin commitear (control) | RED 2/2 → GREEN 0/2 (regresión) → REFACTOR → 2/2 |
| 5 | R5 · conflicto en `estimation-log.md` | RED 2/2 a mano → GREEN 2/2 al script (uno bloqueado por el permiso del tool PowerShell headless) |
| 6 | R6 · reserva de `sdd-start-release` con `develop` fuera de todo worktree | 2/2 worktree corto en `wt/`; la fila de deuda de la 0029 no se reproduce |
| 7 | Smoke del hilo: la receta a mano en PowerShell sobre un repo bare | `merge-0009` junto a `0009`, `--no-ff`, `node --test` 6/0, retirado; la feature sigue en su rama |

### 4.3 Residuales / deuda generada

- A la tabla de deuda: el ensayo con `--detach` (sin fallo medido, con disparador), la suite sobre el resultado del merge y `--no-verify` (pasan sin guidance: posible falso negativo), y la forma del informe cuando la suite falla tras el merge (revisión de rama, Important 2).
- La fila de deuda «La salida "worktree temporal" del paso 4 de la replanificación no tiene GREEN» queda saldada por R6.

## 5. Aprendizajes

- En un molde de cierre, el plan del molde tiene que cuadrar con sus artefactos. Un plan con tres tasks por subagentes y sin `tasks.md` paró al sujeto en el paso 6 y no llegó al merge → `tech-stack.md`, «Fixtures y baselines».
- `--plugin-dir` en ruta de Git Bash (`/c/Users/…`) dejó 4 de 10 sujetos con `Unknown skill`; con `cygpath -m` cargó 4/4 → `tech-stack.md`, «Sujetos headless».
- Un hook que imita a un clasificador casa por subcomando, no por palabra: «merge» dentro de `develop-merge-tmp` denegó un `git worktree add` → `tech-stack.md`, «Sujetos headless».
- En headless, el tool PowerShell pide permiso para lanzar `pwsh` anidado aunque `Bash(*)` esté permitido: un escenario que mide ejecutar un script de PowerShell lo verifica en la conducta, no en disco → `tech-stack.md`, «Sujetos headless».
- Una guía que abre un camino nuevo («sacada: fusiona ahí») puede anular una conducta que el baseline ya tenía. El control de no regresión del Art. I lo cazó a la primera; es el tercer caso tras la 0008 y la 0025 → `tech-stack.md`, «Fixtures y baselines».
- El comportamiento del merge en el cierre → delta fusionado en [`capabilities/control-profiles.md`](../../capabilities/control-profiles.md).

## 6. Adendas

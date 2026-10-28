---
id: 20261028-121830-patch-0231-exact-env-vars
task: 0231
title: Patch — para ver el entorno se nombran las variables exactas, nunca un prefijo
type: patch
solution: dev-lead
status: done
created: 2026-10-28
branch: patch/0231-exact-env-vars
commit: ced7b75a
---

# Patch 0231 — para ver el entorno se nombran las variables exactas, nunca un prefijo

## Capacidades

- Ninguna, porque ninguna capacidad describe `sdd-debugging`

## 1. Síntoma

- «Volcar el entorno por prefijo copia un secreto al transcript» ([ticket de la feature 0227](../../field-reports/20261027-160700-feature-0227-behavior-tests-to-vitest.md) §4): para depurar un control del pre-commit, el hilo volcó las variables que empiezan por `GIT`; venía `GITHUB_PERSONAL_ACCESS_TOKEN`, que quedó en un fichero del scratchpad y en la salida de la herramienta. `skills/sdd-debugging/SKILL.md` no tiene regla sobre volcar el entorno.

## 2. Solución fijada

Dev-lead, 2026-10-27, al triar el ticket de la 0227: «Patch con RED», con la decisión «se nombran las variables exactas». La fila 0231 del roadmap la concreta: en `skills/sdd-debugging/SKILL.md`, para ver variables de entorno se nombran las que hacen falta (`GIT_DIR`, `GIT_INDEX_FILE`…); nunca se vuelca un prefijo (`GIT*`) ni el entorno entero, porque arrastra secretos (`GITHUB_PERSONAL_ACCESS_TOKEN`) al transcript. Y en el arranque del patch (2026-10-28): «el arreglo empieza por poner la regla en el paso donde se decide qué se mira, no por añadir una línea suelta».

Lo que da por existente, comprobado: `skills/sdd-debugging/SKILL.md`, Fase 1, paso 4 «Gather Evidence in Multi-Component Systems», el bloque de instrumentación que decide qué se registra en cada frontera («Verify environment/config propagation»); hoy no dice cómo se mira el entorno. La skill no tenía batería.

## 3. Fix

- **Fichero(s)**: `skills/sdd-debugging/SKILL.md` (Fase 1, paso 4), `tests/batteries/sdd-debugging/` (batería nueva: `battery.md`, `subject.sh`, molde `mold-hook`), `.gitattributes` (`eol=lf` para los hooks de los moldes: un `#!/bin/sh` con CR no arranca).
- **Cambio**: el punto «Verify environment/config propagation» del bloque de instrumentación de la Fase 1, paso 4 —donde se decide qué se registra en cada frontera— dice cómo: se imprime cada variable que se nombra (`GIT_DIR`, `GIT_INDEX_FILE`…), nunca un prefijo (`env | grep GIT`) ni el entorno entero, porque copian secretos (`GITHUB_PERSONAL_ACCESS_TOKEN`) al transcript. No añade línea suelta: completa el punto que ya existía. Retira: nada; `word-budget.test.ts` 72/72.
- **Decisiones**:
  - Se nombran las variables exactas; nunca un prefijo ni el entorno entero — dev-lead
  - La regla va en el paso donde se decide qué se mira (Fase 1, paso 4), no en una línea suelta — dev-lead
  - El escenario `d1`: un pre-commit que falla por el `GIT_INDEX_FILE` que hereda del commit, con un `GITHUB_PERSONAL_ACCESS_TOKEN` falso en el entorno del sujeto; `subject.sh` quita del entorno heredado las variables con pinta de secreto antes de lanzar, para que un RED que vuelque el entorno no copie uno real a las salidas — sin el dev-lead (método de prueba, no lo ve el usuario)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `d1` ×2 (kit de la apertura, `041034cc`) | ❌ E1 0/2: los dos vuelcan el entorno por prefijo (`env \| grep -i '^GIT_'`, `env \| grep '^GIT_'` dentro del hook); el secreto falso no sale porque `^GIT_` no casa con `GITHUB_` (en campo fue `GIT*`). C 2/2: los dos dan `GIT_INDEX_FILE` (`red/out/`) |
| 2 | GREEN `d1` ×2 (texto de la rama) | ✅ E1 2/2: imprimen solo las variables que nombran (`GIT_INDEX_FILE`; `GIT_DIR`, `GIT_INDEX_FILE`, `GIT_WORK_TREE`… con `__UNSET__`); secreto falso 0 líneas. C 2/2 (`green/out/`) |
| 3 | Gate de cierre `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop` sobre `ced7b75a` más el cierre sin commitear, salida entera en el scratchpad | ❌ 26 min, con la máquina cargada (suites de la 0216 y la 0228 en cola en el cerrojo): `kit:test-headless` 71/81, 10 rojos del lanzador (`caps-and-locks`, `identity-and-show`, `lib`, `paths-and-cleanup`, `ports`, `settings`), uno con `tests/headless/lib.sh: line 60: pwd: write error: Bad file descriptor`; `kit:test` y `cli:test-min`, sin correr (moon para tras el rojo). La rama no toca `tests/headless/`: la tarea corre por `tests/batteries/**`. Contraste sin la rama sin terminar: el 1.º se quedó sin worktree (`.temp/p0231/base` borrado mientras esperaba el cerrojo; `canonicalizing the --dir argument: cli`), el 2.º se colgó 27 min y se paró por PID; la sesión de la 0228 midió `develop` sin rama en 11/81 con cuelgues. Deuda: «Tres tests del lanzador en Vitest pasan de su tope con la máquina cargada» (Actuar → 0216). Merge sobre ese rojo por decisión del dev-lead: «Resto del gate y fusiona» (2026-10-28); el resto del gate corre sobre el merge de `--sync` |

Validación en campo: 2026-10-28 · RED `d1` E1 0/2 → GREEN E1 2/2, causa 2/2 en las dos tandas · gate de cierre rojo en `kit:test-headless` (deuda de la 0216), merge por decisión del dev-lead · no probado: un sujeto en PowerShell (`Get-ChildItem env:`), y el caso de campo literal, `GIT*` con un `GITHUB_*` real: el RED volcó `^GIT_`, que no casa con `GITHUB_`

## 5. Tiempo (ligero)

- Estimación: 1,5 h + 1,18 h del gate de cierre (71 min, patch 0222)
- Inicio: 2026-10-28T12:18Z
- Esfuerzo real: 1,34 h — reloj de la sesión 1,67 h desde 2026-10-28T12:16Z, sin 20 min de espera al dev-lead (3 esperas). −50 % sobre la estimación (2,68 h): el fix y la batería salieron a la primera, y el gate se cortó a los 26 min; el resto corre tras el `--sync`, fuera de esta medida
- Coste de sujetos: 0,68 $ en 4 sujetos Sonnet — RED `d1` 0,38 $; GREEN `d1` 0,30 $

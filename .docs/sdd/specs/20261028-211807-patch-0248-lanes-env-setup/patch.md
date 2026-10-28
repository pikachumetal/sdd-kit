---
id: 20261028-211807-patch-0248-lanes-env-setup
task: 0248
title: Patch — los carriles patch y config preparan el entorno antes del primer test
type: patch
solution: dev-lead
status: done
created: 2026-10-28
branch: patch/0248-lanes-env-setup
commit: <hash>
---

# Patch 0248 — los carriles patch y config preparan el entorno antes del primer test

## Capacidades

- Modificadas: `routing` — los carriles patch y config preparan el entorno antes de su primer test

## 1. Síntoma

Fila 0248 del roadmap y «Menores del ticket del patch 0212», (b): tres worktrees abiertos por un prompt de lanzamiento corrieron su primer test sin dependencias instaladas.

- Patch 0212 ([ticket](../../field-reports/20261026-111623-patch-0212-plan-workspace-temp.md), menores): sin `cli/node_modules`, `npx vitest` falló al cargar la config hasta `pnpm install`.
- Config de la CI de la base ([ticket del patch 0245](../../field-reports/20261028-194217-patch-0245-windows-only-tests.md) §4): el gate falló tras 12,8 min con `Cannot find module '…\cli\node_modules\vitest\vitest.mjs'` y pasó tras `pnpm install --frozen-lockfile`.
- Patch 0241 ([ticket](../../field-reports/20261028-200650-patch-0241-git-bash-tmp-repair.md), menores): el primer RED fue `Cannot find package 'vitest' imported from …/cli/vitest.config.ts`, un error de arranque y no el fallo del test.

Este mismo worktree, abierto por el prompt de la 0248, tampoco tenía `cli/node_modules` ni `node_modules` en la raíz.

## 2. Solución fijada

Fila 0248 y prompt de arranque (dev-lead, 2026-10-28): «`skills/sdd-start-patch/SKILL.md` y el paso 2 del carril config de `skills/sdd-propose/SKILL.md` corren ese mismo paso [el paso 2 de `sdd-worktrees`, «Project Setup»] antes del primer test, sin copiarlo: lo nombran». GIVEN un worktree recién creado sin `node_modules` WHEN el carril patch o el config va a correr su primer test THEN instala antes las dependencias y no falla por un módulo que falta.

Lo que da por existente, comprobado: `skills/sdd-worktrees/SKILL.md:104` («Step 2: Project Setup»: dependencias y, con `environments.md`, `env:setup`); el paso 2 del carril config de `skills/sdd-propose/SKILL.md` («Run the `Build` of `operations.md`… and its §Testing `Gate de cierre`»); `skills/sdd-start-patch/SKILL.md` no nombra `sdd-worktrees` ni las dependencias, y solo `sdd-implement` invoca `sdd-worktrees`.

Medido al abrir: el paso 2 dice `npm install` si hay `package.json`. En una copia de la raíz de este repo (`package.json` sin dependencias, `pnpm-workspace.yaml` con `cli/`), `npm install` acaba con «up to date, audited 1 package» y `cli/node_modules` no existe: seguido al pie de la letra, el paso no arregla los tres casos, que son de este repo. El molde del RED es un workspace de pnpm para medir si el sujeto lo adapta.

## 3. Fix

- **Fichero(s)**: `skills/sdd-start-patch/SKILL.md`, `skills/sdd-propose/SKILL.md`; `tests/batteries/sdd-propose/` (`battery.md`, `subject.mjs`: escenarios `ws1` y `ws2`, molde `reservas-deps`)
- **Cambio**: el paso 1 de `sdd-start-patch` abre con «antes de ejecutar el código o un test, prepara el entorno con el Step 2 de `sdd-worktrees` («Project Setup»)», y el paso 2 del carril config de `sdd-propose`, con lo mismo antes del `Build` y el gate; los dos nombran el paso y su fallo (`Cannot find module`), sin copiar sus órdenes. La batería de `sdd-propose` gana el paso `setup` (`ws1`, `ws2`), el molde `reservas-deps` (`fixtures/deps/`), la fila WS de la rúbrica y la de procedencia. Retira: nada; son dos frases en el paso que ya corre el primer test, sin otra que sustituir (Art. I, «una pieza entra, otra sale»).
- **Decisiones**:
  - Los dos carriles nombran el paso 2 de `sdd-worktrees` antes de su primer test, sin copiarlo — dev-lead
  - Los tres casos (0212, 0245 y 0241) son la evidencia de origen — dev-lead
  - RED/GREEN en la batería de `sdd-propose` (skill de propose: su tramo más el escenario del fallo, Art. I), dos escenarios, `ws1` (patch) y `ws2` (config), n = 2, sonnet, con un molde de workspace pnpm sin `node_modules` — sin el dev-lead (método; no cambia lo que ve el usuario del kit)
  - Previsión de coste: RED 4 sujetos y GREEN 4, ~0,40 $ cada uno, ~3,20 $ y ~40 min; tope `SUBJECT_CAP=12`, `COST_CAP=6` — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `ws1` y `ws2` (`sdd-propose`, molde `reservas-deps`, kit de `a431655e`, sonnet ×2 cada uno): `red/out/` | 0/4 en WS: los cuatro ejecutan `src/app.js` o `node --test` antes de instalar y leen `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'fecha' imported from <run>\repo\src\app.js`; los dos `ws1` instalan con `pnpm install` tras el fallo y siguen; los dos `ws2` paran a preguntar con el gate en rojo («¿Corro `pnpm install` y repito el gate?») y no commitean. Puerta 4/4 |
| 2 | GREEN con el texto del working tree: `green/out/` | 4/4 en WS: los cuatro corren `pnpm install` antes del primer `node --test` o del gate, sin `ERR_MODULE_NOT_FOUND`; `ws1-1` invoca `sdd-worktrees`, `ws1-2` y `ws2-1` leen su Step 2; los dos `ws2` commitean con la línea `Gate:`. Ninguno usa `npm install`: los cuatro eligen pnpm por la línea de `tech-stack.md` del molde. `ws1-2` ejecuta una vez `node src/app.js libres 25:00-26:00` en la clasificación de `sdd-propose`, antes de `sdd-start-patch` y de instalar (sale con 1); su primer test, ya instalado |
| 3 | `vitest` de `word-budget.test.ts` y, con `SDD_KIT_HEADLESS=1`, `molds.test.ts` (construye `reservas-deps` en seco) | 72/72 · 96/96 |

## 5. Tiempo (ligero)

- Estimación: 1,25 h + 0,01 h del gate de cierre (31 s, patch 0241) — 0,5 h de texto y escenarios, 0,75 h de la campaña RED/GREEN
- Inicio: 2026-10-28T21:18Z
- Coste de sujetos: 2,66 $ en 8 sujetos sonnet — RED 1,28 $; GREEN 1,38 $

## 6. Delta de capacidad

### Capacidad: `routing`

#### ADDED — Los carriles patch y config preparan el entorno antes del primer test

- GIVEN un worktree recién creado por un prompt de lanzamiento, sin `node_modules`, en un proyecto cuyas dependencias se instalan con `pnpm install`
- WHEN el carril patch va a correr su primer test, o el carril config su gate
- THEN antes corre el paso 2 de `sdd-worktrees` («Project Setup»), con el gestor de paquetes del proyecto, y el test no falla por un módulo que falta
- AND `sdd-start-patch` y el carril config de `sdd-propose` nombran ese paso; no copian sus órdenes

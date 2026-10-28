---
id: 20261028-215919-patch-0253-setup-by-lockfile
task: 0253
title: Patch — el «Project Setup» de sdd-worktrees elige el gestor de paquetes por el lockfile
type: patch
solution: dev-lead
status: done
created: 2026-10-28
branch: patch/0253-setup-by-lockfile
commit: <hash>
---

# Patch 0253 — el «Project Setup» de sdd-worktrees elige el gestor de paquetes por el lockfile

## Capacidades

- Ninguna, porque el fix devuelve el paso 2 de `sdd-worktrees` a lo que ya dice `routing` («Los carriles patch y config preparan el entorno antes del primer test»: «con el gestor de paquetes del proyecto»)

## 1. Síntoma

Fila 0253 del roadmap y fila de deuda «El «Project Setup» de `sdd-worktrees` instala con `npm install` también un workspace de pnpm» ([ticket del patch 0248](../../field-reports/20261028-214351-patch-0248-lanes-env-setup.md) §1): tras la 0248, los carriles patch y config nombran el Step 2 de `sdd-worktrees`, cuya línea de Node es `if [ -f package.json ]; then npm install; fi`. En una copia de la raíz de este repo, `npm install` dio «up to date, audited 1 package» sin crear `cli/node_modules`; en el molde `reservas-deps` (`workspace:*`), `npm error code EUNSUPPORTEDPROTOCOL`. En el GREEN de la 0248 los sujetos usaron pnpm solo porque el `tech-stack.md` del molde lo decía.

## 2. Solución fijada

Fila 0253 y prompt de arranque (dev-lead, 2026-10-28): «la línea elige por el lockfile: `pnpm-lock.yaml` → `pnpm install --frozen-lockfile`, `yarn.lock` → `yarn install --frozen-lockfile`, `package-lock.json` → `npm ci`, y si no hay ninguno, `npm install`; el cambio sobre el texto de superpowers se registra como lo pide el Art. IX». GIVEN el molde `reservas-deps` sin la línea de pnpm en su `tech-stack.md` WHEN un sujeto sigue el carril patch THEN corre `pnpm install` antes del primer test y no lee `ERR_MODULE_NOT_FOUND`.

Lo que da por existente, comprobado: `skills/sdd-worktrees/SKILL.md:108` (`if [ -f package.json ]; then npm install; fi`, «Step 2: Project Setup»); el molde `reservas-deps` de la batería de `sdd-propose` (`fixtures/deps/` con `pnpm-lock.yaml` y `pnpm-workspace.yaml`; `subject.mjs` le añade la línea «Dependencias: workspace de pnpm…» a `tech-stack.md`); el paso 1 de `sdd-start-patch` y el paso 2 del carril config nombran el Step 2.

## 3. Fix

- **Fichero(s)**: `skills/sdd-worktrees/SKILL.md`; `cli/test/kit/worktrees-setup.slow.test.ts` (nuevo); `tests/batteries/sdd-propose/` (`battery.md`, `subject.mjs`: escenario `ws3`, paso `setup-lockfile`, molde `reservas-deps-sin-stack`)
- **Cambio**: la línea de Node del Step 2 elige el gestor por el lockfile; la de la fuente (`npm install` con `package.json`) queda como la última rama, sin lockfile. El test lento ejecuta el bloque bash del Step 2, sacado de `SKILL.md`, en una carpeta con cada lockfile y con `npm`, `pnpm` y `yarn` como funciones que imprimen su llamada. La batería gana `ws3`: `ws1` sobre el molde sin la línea de pnpm en `tech-stack.md`, como control.
- **Decisiones**:
  - el mapeo lockfile → comando, y que se registre por el Art. IX — dev-lead
  - con el RED de sujetos limpio (§4, filas 1 y 2), el RED pasa a un test determinista del bloque, y `ws3` queda como control de no regresión — dev-lead (2026-10-28, a la pregunta del desvío: «RED determinista»)
  - Art. IX y ADR 0013: el cambio es del motivo «el kit lo amplía» (la orden de la fuente se conserva como el caso sin lockfile); se registra aquí y en la tabla de la fuente de la feature 0166 («UGW · Step 2: Project Setup»), que este patch no reescribe por ser de una feature cerrada: esta línea es su continuación — sin el dev-lead
  - el RED de sujetos es un escenario nuevo (`ws3`, paso propio para lanzarlo solo) y no un cambio del molde de `ws1` y `ws2`: esos dos siguen midiendo la 0248 con la línea de pnpm — sin el dev-lead
  - el test va en `*.slow.test.ts` porque lanza `bash` (tech-stack.md, «Conjunto rápido y tests lentos»); en Windows usa el `bash.exe` de Git, junto a `git --exec-path`, para no caer en el de WSL — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `ws3` (`sdd-propose`, molde `reservas-deps-sin-stack`, kit de `def09ce9`, sonnet ×2): `red/out/` | sin el fallo: `ws3-1` lee el Step 2 literal y aun así corre `pnpm install --frozen-lockfile` antes del primer test, por `pnpm-workspace.yaml`; `ws3-2` para a preguntar el alcance antes de ningún test (sin medir) |
| 2 | RED `ws3`, segunda tanda para completar la muestra: `red2/out/` | `ws3-1` corre `node --test` antes de instalar (`ℹ fail 2`) y después `pnpm install --frozen-lockfile`: falla WS por el orden, no por el gestor; `ws3-2`, `pnpm install --frozen-lockfile` antes del primer test. En total, 0 de 3 medidos corren `npm install` ni leen `EUNSUPPORTEDPROTOCOL`. Coste de las dos tandas: 1,55 $ |
| 3 | RED determinista: `vitest run worktrees-setup.slow.test` sobre el texto de `def09ce9` | 3 de 4 en rojo: `expected 'npm install' to be 'pnpm install --frozen-lockfile'`, y lo mismo con `yarn install --frozen-lockfile` y `npm ci`; `package.json` solo → `npm install` pasa |
| 4 | GREEN determinista con el fix | 4/4 · `skills.test` y `word-budget.test` en verde (190 passed, 12 skipped) |
| 5 | GREEN de control `ws3` con el fix (kit de `def09ce9` más el `SKILL.md` del fix): `green/out/` | sin regresión, ninguno corre `npm install`: `ws3-1` corre `node --test` en la clasificación de `sdd-propose`, antes de instalar (`ERR_MODULE_NOT_FOUND`), y después invoca `sdd-worktrees` y corre `pnpm install --frozen-lockfile`; `ws3-2` para a preguntar el alcance. El test antes de instalar en la clasificación es el hueco que la 0248 dejó «no probado», fuera de este patch. Coste: 0,78 $ |

## 5. Tiempo (ligero)

- Estimación: 0,75 h + 0,01 h del gate de cierre (31 s, patch 0241) — 0,25 h de texto y escenario, 0,5 h de la campaña RED/GREEN
- Inicio: 2026-10-28T21:59Z
- Coste de sujetos: 2,33 $ en 6 sujetos sonnet — RED 0,63 $; RED (segunda tanda) 0,92 $; GREEN 0,78 $

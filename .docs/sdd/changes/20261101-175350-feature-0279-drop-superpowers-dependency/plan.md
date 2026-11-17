---
id: 20261101-175350-feature-0279-drop-superpowers-dependency
feature: 0279
title: Plan de implementación — Retirar la dependencia de superpowers del plugin
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — Retirar la dependencia de superpowers del plugin

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: la propia sesión, en Native; sujetos Sonnet (Haiku en el smoke) — el plan trae el diseño y los sujetos los mide el Art. I.
2. Ejecución: Native — ver la línea de abajo.
3. Exención de paridad como constante local `RETIRED_TOKENS` en el test, no un parámetro general — un solo caso.
4. El molde de los escenarios nuevos es `v2x-superpowers`, `v2x` con `.claude/settings.json` que activa superpowers; `subject.mjs` lo monta como los demás derivados de `v2x`.
5. Riesgo alto: `lib.test.ts` puede fijar argumentos sin `--setting-sources` en tests sin la variable; se ajustan a la decisión 2 de la spec.
6. Coste estimado: 1,5 h y ~14,4 $ en sujetos (previsión de la spec), más la revisión final.
7. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el kit se instala y carga sin superpowers, y un proyecto que lo activa decide si lo quita.

**Architecture**: se borra la dependencia y lo que la arrastra; el lanzador separa aislar de cargar superpowers; la migración gana un paso con gate, solo texto.

**Tech Stack**: JSON de manifests, TypeScript de la CLI, Node del lanzador, Vitest, Markdown de skills.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks casi sin interfaces entre ellas, un error lo caza su test o su sujeto y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — quita una dependencia de un manifest (`plugin.json`).

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin alias de PowerShell; texto humano en castellano con tildes.
- Saldo de palabras de cada skill editada: igual o baja.
- `.claude/settings.json` de este repo no se toca (0198); `NOTICE` y procedencia, tampoco.

### De proceso

- Política de modelos: declarar modelo y effort al despachar; sujetos con `battery.mjs`; revisión final por `sdd-verify`.
- Atribución de commits: la del sistema.

## Review Focus

- `enabledPlugins["superpowers@superpowers-marketplace"]` = `false` con el marketplace declarado → el paso 10 pregunta y quita las dos claves con el «sí» · Task 3, texto del paso 10 y lectura del eje Spec.
- `.claude/settings.json` con JSON roto o sin existir en el paso 10 → sin el fichero, el paso se salta y lo dice; roto, informe sin escribir nada · Task 3, texto del paso 10.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el paso 10 es texto, sin verbo de CLI: el agente edita dos claves con un gate.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Constitution check**: Art. I (previsión en la spec), Art. V (decisión 17), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-upgrade/mold-v2x-superpowers` o su montaje en `subject.mjs` — el molde del paso 10, como los derivados de `v2x`.
- `green/smoke/` de esta carpeta — el resumen del smoke.

**Modificar**: los del Scope de la spec.

**NO se tocan**:

- `.claude/settings.json` — 0198.
- `migrations/v2.0.0.md` — historia.
- `using-sdd/SKILL.md`, `sdd-explore/SKILL.md` — instrucción válida con superpowers instalado.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Quitar la frase de `sdd-propose:11` cambia la conducta | Baja | Medio | Su sujeto, en la Task 3 |
| Un test fija el README o la init | Media | Bajo | Los corre la Task 1 |

### 1.8 Rollout

Va en la release 3.0.0, con su migración.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Manifests, init, README y lanzador sin superpowers

**Tras**: —
**Modelo**: sesión (Native)
**Tests RED**: TDD del hilo, en los ficheros de abajo.
**Superficies**: tooling · docs
**Verificación**: `npx vitest run test/kit/skills.test.ts test/kit/migration-init-parity.test.ts test/init test/kit/headless/lib.test.ts` desde `cli/` → `Tests  N passed (N)`; `npx vitest run --test-timeout 120000 test/kit/manifests.slow.test.ts` → igual. `run`, `subject` y `molds` corren en `moon run kit:test-headless`.
**Se prueba en la aplicación**: no, porque base común: lo mide la Task 3.

**Interfaces**:
- Consume: nada.
- Produce: `plugin.json` sin `dependencies`; `claudeArgs` con `--setting-sources ''` siempre; `SUPERPOWERS_DIR` opcional, que solo añade `--plugin-dir`.

**Ficheros**: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `README.md`, `cli/src/init/settings.ts`, `skills/sdd-init/SKILL.md` (paso 7), `tests/headless/lib.mjs`, `tests/headless/battery.mjs`, `cli/test/kit/skills.test.ts`, `cli/test/kit/migration-init-parity.test.ts`, `cli/test/init/settings.test.ts`, `cli/test/init/verbs.test.ts`, `cli/test/kit/headless/lib.test.ts`, `molds.test.ts`, `subject.test.ts`.

- [ ] **Step 1: RED**. `skills.test.ts`: `expect(plugin.dependencies).toBeUndefined()` y `expect(marketplace.allowCrossMarketplaceDependenciesOn).toBeUndefined()`. `settings.test.ts`: `INIT_SETTINGS` sin ninguna clave con `superpowers`; una entrada con `enabledPlugins['superpowers@superpowers-marketplace'] = true` sale intacta y sin nota. `lib.test.ts`: sin `SUPERPOWERS_DIR`, los `.args` llevan `--setting-sources` seguido de vacío y un solo `--plugin-dir`; con ella, dos; un kit con `dependencies` ya no aborta. Verlos fallar.
- [ ] **Step 2: Implementación**. Borrar `dependencies`, `allowCrossMarketplaceDependenciesOn`, las dos hojas de `INIT_SETTINGS` y `lib.mjs:192-196`. En `claudeArgs`, `args.push('--setting-sources', '')` siempre y `--plugin-dir` solo con la variable; comentarios de cabecera de `lib.mjs:20` y `battery.mjs:6`. `RETIRED_TOKENS = ['extraKnownMarketplaces.superpowers-marketplace']` en la paridad. `sdd-init` paso 7: un marketplace, un plugin, sin `claude plugin marketplace add`. README: dos líneas `/plugin` y `/reload-plugins`, fuera `README.md:61,63`, un marketplace y un plugin en `:65` y el JSON, fuera la fila de la tabla, `:96` «si el proyecto tiene superpowers, pasa por delante de `brainstorming`», `:185` conserva «El kit invoca 0 skills de superpowers: ninguna» y su `grep`, sin «Versión validada».
- [ ] **Step 3: Verificación** y **Step 4: Commit** `feat(plugin): retirar la dependencia de superpowers`.

### Task 2 — Textos de skills, baterías y documentos

**Tras**: Task 1
**Modelo**: sesión (Native)
**Tests RED**: ninguno de Vitest: quita texto, y lo miden sus sujetos en la Task 3.
**Superficies**: docs · tooling
**Verificación**: `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts test/kit/workflow-docs.test.ts` desde `cli/` → `Tests  N passed (N)`. `git grep -n SUPERPOWERS_DIR -- tests/batteries` solo devuelve `sdd-implement/subject.mjs` y `using-sdd`, donde es opcional.
**Se prueba en la aplicación**: no, porque docs: lo mide la Task 3.

**Interfaces**:
- Consume: `SUPERPOWERS_DIR` opcional.
- Produce: `kit-feedback-template.md` sin `superpowers_version`.

**Ficheros**: `skills/sdd-propose/SKILL.md:11`, `skills/sdd-feedback/SKILL.md:14`, `skills/sdd-templates/templates/kit-feedback-template.md:3,53`, los 28 ficheros de `tests/batteries/` que nombran la variable, `.docs/sdd/tech-stack.md` (líneas 25, 28, 108 y la de la 0074), `.docs/sdd/constitution.md:61,85`, `.docs/workflow/usage-guide.md:217,223`, `CLAUDE.md:14`.

- [ ] **Step 1: Implementación**. `sdd-propose`: fuera «The `superpowers:*` skills are used as **process**; artifacts… superpowers' defaults», y queda que los artefactos siguen la convención del kit solo si hace falta para la frase siguiente. `sdd-feedback`: «read `.docs/sdd/sdd-kit.json` (kit version and `ids.mode`)». Plantilla: fuera el campo, y el ejemplo de «Fuente» usa `claude plugin list` → `sdd-kit@2.3.4`. Baterías: «con `SUPERPOWERS_DIR`» sale; en `using-sdd`, «opcional, para medir la competencia con `brainstorming`». `tech-stack.md:25`: smoke con copia del plugin, `--plugin-dir` y `--setting-sources project`, sin superpowers; `:28`: solo Node es obligatoria; `:108`: sin la variable; la de la 0074: la variable solo carga superpowers. Constitution según la decisión 10. `usage-guide`: fuera el aviso «falta superpowers». `CLAUDE.md:14`: sin «dependencia de superpowers».
- [ ] **Step 2: Verificación** y **Step 3: Commit** `docs(sdd): quitar superpowers de las skills y los documentos`.

### Task 3 — Migración, campaña y smoke

**Tras**: Task 2
**Modelo**: sujetos `sonnet` por `battery.mjs`; smoke `haiku` directo.
**Tests RED**: sujeto RED de `sdd-upgrade` con el kit sin el paso 10, antes de escribirlo.
**Superficies**: docs · tooling
**Verificación**: `npx vitest run test/kit/migration-init-parity.test.ts test/kit/skills.test.ts` desde `cli/`; `battery.mjs verdict`; lectura de `texts.txt`, `tools.txt` y `state.txt`.
**Se prueba en la aplicación**: no aplica: el kit no es una aplicación.

**Interfaces**:
- Consume: `plugin.json` sin dependencia, lanzador sin la variable, plantilla sin el campo.
- Produce: paso 10; evidencia en `red/`, `green/` y `tests/drop-superpowers-{red,green}.md`.

**Ficheros**: `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `tests/batteries/sdd-upgrade/battery.md` y `subject.mjs`, `tests/drop-superpowers-red.md`, `tests/drop-superpowers-green.md`, `green/smoke/`.

- [ ] **Step 1: RED** con el molde `v2x-superpowers`: 1 sujeto; se espera que migre sin preguntar por superpowers.
- [ ] **Step 2: Implementación**. Paso 10 con la pregunta y el informe literales de la spec, el predicado de la decisión 19, las reglas de `false` y del marketplace compartido, y «si `.claude/settings.json` no existe, se salta; si no se puede leer, va al informe sin escribir». Cabecera «del 5 al 10». `**Escribe**` en prosa, sin clave en backticks.
- [ ] **Step 3: GREEN** sin `SUPERPOWERS_DIR`: `sdd-upgrade` ×3 (sí, no, marketplace compartido), `using-sdd` ×1, `sdd-propose` ×1, `fb1`, `sdd-init` ×1, y un control de `using-sdd` con la variable. Parar si se supera la previsión.
- [ ] **Step 4: Smoke**. Copia del kit con `git archive`; molde con el hook del proyecto y `sdd-kit.json` en la versión del kit; `claude -p --model haiku --plugin-dir <copia> --setting-sources project`, y el control sin `--plugin-dir`, que tiene que escribir `AVISO sdd-kit: esta sesión no tiene cargadas las skills del kit.` Resumen en `green/smoke/`, sin datos de la cuenta.
- [ ] **Step 5: Commit** `feat(sdd-upgrade): proponer quitar la activación de superpowers`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Base de la estimación: 3 tasks mecánicas salvo la campaña de 9 sujetos
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `routing`, carga e inyecta sin avisos, entra por `sdd-propose` → Task 3, sujeto de `using-sdd` y smoke. ✓
- `routing`, el hook del proyecto no avisa → Task 3, smoke con su control. ✓
- `onboarding`, bloque sin superpowers; `.gitignore`, memoria y hook sin cambios → Task 1, `settings.test.ts` y `verbs.test.ts`; Task 3, humo de `sdd-init`. ✓
- `cli`, fusión por hoja y bloque igual al README → Task 1, `settings.test.ts` y `readme.test.ts`. ✓
- `kit-feedback`, cabecera sin superpowers y dato sin comprobar → Task 2 y Task 3, `fb1`. ✓
- `migration`, pregunta y espera; sí; no; marketplace compartido → Task 3, sujetos. ✓
- `migration`, otro plugin en `false`, sin claves, no toca `~/.claude` → Task 3, texto del paso, sin sujeto: lo lee el eje Spec. ⚠
- `migration`, paridad con la exención → Task 1, `migration-init-parity.test.ts`. ✓
- Review Focus → Task 3, texto del paso 10. ✓

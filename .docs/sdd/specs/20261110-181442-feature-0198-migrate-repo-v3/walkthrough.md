---
id: 20261110-181442-feature-0198-migrate-repo-v3
feature: 0198
title: Walkthrough — Migrar este repo a la 3.0.0
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-10
---

# Walkthrough — Migrar este repo a la 3.0.0

## 1. Cambios realizados

- **La migración v3.0.0** (`skills/sdd-upgrade/references/migrations/v3.0.0.md`, Task 2 y pasadas de fix): los enlaces relativos de lo que cambia de carpeta se reescriben para su carpeta nueva (item 5) y el paso 4 ya no deja fuera a `CHANGELOG.md`; lo publicado se decide por el commit del walkthrough o del `patch.md` frente a la etiqueta de la última release; la release en preparación se reconoce por el prefijo `**Release <N>**` de sus filas; las filas hechas de «Próximo» van a Now, las publicadas o absorbidas salen y un patch repetido se une a su fila; las filas del Backlog conservan su id y un hito en `🔄` se pregunta; el paso 5 enseña en una tabla con gate los nombres viejos de `capabilities/` y de las mediciones fechadas, y propone mantener solo los que son un dato.
- **Batería** (`tests/batteries/sdd-upgrade/`, Task 1): el molde `v2x` gana la etiqueta `v1.2.0` y un tercer commit con lo cerrado tras ella; la variante `v2x-release` y el escenario `v5`, con las filas `V15` a `V20`; `v2xReport` enseña `CHANGELOG.md`, `capabilities/` y `git tag`.
- **Aviso de versión** (`cli/bin/session-start.js`, Task 3): no avisa si el kit cargado trae la migración de la versión del proyecto.
- **Este repo, migrado** (Task 4): `PRODUCT.md`, `ROADMAP.md` (166 en Now — 3.0.0, 2 en Next, 14 en Later) y `CHANGELOG.md` en la raíz; `constitution`, `architecture`, `operations`, `debt` (14 por triar, 27 en espera, 11 en lista), `estimation` y `estimation-log` en `.docs/sdd/steering/`; 771 enlaces reescritos; `CLAUDE.md` (índice, reglas 2, 6 y 7), `README.md`, `ci.yml`, el Art. V, `word-budget.test.ts` con los topes medidos, el test nuevo `root-docs-links.test.ts` (con el comprobador de enlaces sacado a `relative-links.ts`), el hook `sdd-kit-loaded`, la marca 3.0.0 y la activación de superpowers fuera de `.claude/settings.json`.
- **Docs**: deltas de `migration` fusionados; las dos filas de deuda «→ 0198» saldadas (la regla del gate por partes en `## Testing` y la nota de la conversación con la persona en «Cómo se testean las skills»).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 5h
- Esfuerzo real: ~3h de implementación (del commit de apertura, 19:02, al cierre, ~21:30) y ~1,5h de spec y plan desde las 18:14; `sdd session tokens` da «no medido (sin transcripts de Claude Code para el worktree)»: la sesión trabajó desde el checkout de `develop`
- Desviación: −2h sobre la implementación (−40 %)
- Causa de la desviación: los pasos 3 y 4 de la migración se hicieron con scripts (generar `ROADMAP.md` y `debt.md`, reescribir enlaces), no fila a fila
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: no medido (sin transcripts del worktree)
- Tokens de subagentes: no medido; despachos: revisor de la spec (opus, tres rondas), review de la enmienda (opus), ejes Spec (opus) y Código (sonnet)
- Coste de la sesión: no medido
- Coste de sujetos: 5,72 $ en 10 sujetos sonnet — `v5` RED 1,18 $; GREEN `v5` y `v1` 2,23 $; `green2` 1,18 $; `green3` 1,13 $
- Review de spec: 1 revisor en tres rondas · hallazgos 30, aceptados 30

## 3. Desviaciones del plan

- **Enmienda del 2026-11-10** (en `unattended`, revisada por un opus y aceptada): topes medidos; las versiones de `.prototools` salen de `architecture.md`; un hueco más del paso 5 (mediciones fechadas) arreglado en la migración, con `V20`; la tabla del paso 5 resuelta por delegación; la fila RED de la previsión, que el commit de apertura había corrompido con un `$` del texto de reemplazo.
- **Revisión final** (eje Spec, 6 Importantes y 3 Menores; eje Código, 1 Importante y 4 Menores; todos aceptados): el paso 4 y la propuesta del paso 5 de la migración, la 0029 en el molde para la mitad «sale» de lo publicado, los títulos de 20 filas de Now y tres de Later rehechos, la regla 6 de `CLAUDE.md`, el comprobador de enlaces (vallas indentadas, doble backtick, `%20`, `<…>`), y un comentario que citaba la feature.
- **La Suma de la previsión** sube de 8 a 10 sujetos con el «dale caña» del dev-lead.
- **Historia de los movimientos**: el commit `c3fb8758` se llevó los `git mv` y `git rm` ya preparados; los commits de la rama se rehicieron con `git reset --soft` antes del primer push, para que el commit de la migración lleve los movimientos con sus sustitutos y `git log --follow` siga la historia.

### Decisiones tomadas sin el dev-lead

- Paso 8 (reglas del proyecto que ya cubre el kit): se mantienen todas. `CLAUDE.md` son reglas de trabajar en el repo del kit, y las que se parecen al kit (regla 3, perfil `delegate`; regla 7, la CI antes del merge) añaden lo propio de este repo — coste si está mal: una regla repetida.
- Paso 9: se salta: el gate no encadena comandos ni lleva lint.
- Paso 10: superpowers fuera de `.claude/settings.json` (decisión 13 de la spec) — coste si está mal: activarlo a mano en la sesión que lo use.
- Paso 5: se mantienen los nombres viejos de `capabilities/` (`archive.md:80,266`, `migration.md:142,265,268,269,351`) y las mediciones fechadas de `steering/` (enmienda, punto 4) — coste si está mal: un nombre viejo en un documento vivo.
- `V18` y `V19`: las filas de rúbrica pedían más que sus requisitos y se ajustaron (rulings en `tests/sdd-upgrade-0198-green.md`) — coste si está mal: un veredicto generoso, que la revisión final miró.
- Las filas sin walkthrough ni `patch.md` (0233, 0240, 0242, 0256, 0223) y la 0128 («Release siguiente») van a Now con ✅, como proponía la primera página.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 472/472 · cli:typecheck: corrió · cli:test: corrió 2398/2398 (12 skipped) · 122 s · configuración: la del gate · sobre el árbol del cierre (verificado por el agente)
- `moon run kit:build kit:own kit:skill-size kit:copies` en verde; `word-budget.test.ts` con `PRODUCT.md` 1.799, `constitution` 2.250, `architecture` 4.877 y `operations` 20.785
- Tandas: `v5` RED (kit de `develop`) rojo en los dos sujetos; GREEN `v5` 2/2 y `v1` 2/2; `green2` `v5` 2/2 (`V20`); `green3` `v5`: V16, V19 y V20 2/2, V15 1/2 (un sujeto reescribió un one-liner y perdió su enlace)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-10 · la migración arreglada con `v5` y `v1` · este repo migrado: «Roadmap válido», `capability check` con 0, 210 ids = 182 + 28 que salen, 52 filas de deuda, ningún enlace relativo roto en la raíz ni en `steering/`

«Verification» de la migración, punto a punto:

| Punto | Resultado |
| --- | --- |
| `sdd roadmap check` → `Roadmap válido` | ✅ |
| `sdd capability check` | ✅ sale con 0 (avisos de longitud ya existentes) |
| Ningún documento 2.x en `.docs/sdd/`, con su nuevo | ✅ (`changelog-cliente.md` se queda: decisión 7) |
| Los dos `git grep` del paso 4 | ✅ solo `capabilities/routing.md:62`, que enlaza la capacidad `roadmap.md` y no el documento |
| El `git grep` del paso 5 | desvío: además de lo mantenido en la tabla, `operations.md:248,307` (instrucciones obsoletas) y `debt.md:9` (una ruta), que van al informe |
| Enlaces relativos de `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` y `steering/*.md` | ✅ `root-docs-links.test.ts` |
| `estimation.md` sin la línea 2.x de los patches | ✅ |
| `git status` antes del commit, solo lo de las tablas | ✅ |
| `sdd-kit.json` en `3.0.0` | ✅ |
| `sdd-kit-loaded.mjs` existe, no se ignora, una vez en `UserPromptSubmit` | ✅ |
| `## Testing` con nivel, «Sin filtro», «Lint» y «CI de la base» | ✅ |
| Aviso del paso 9 | se salta: nada que avisar |

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Aviso de versión con el kit que trae la migración | suite: `does not warn when the loaded kit carries the migration the project asks for` | ✅ |
| Enlaces relativos que siguen apuntando | ejecución real: `V15` 2/2; este repo, `root-docs-links.test.ts` | ✅ |
| Lo publicado por la etiqueta | ejecución real: `V16` | ✅ 2/2 en `green3`, con la 0029 que sale |
| La release por el prefijo | ejecución real: `V17` 2/2 | ✅ |
| Los ids del Backlog | ejecución real: `V18` 2/2 | ✅ |
| Nombres viejos en `capabilities/` con gate | ejecución real: `V19` | ✅ 2/2 en `green3` |
| Mediciones fechadas con gate | ejecución real: `V20` | ✅ 2/2 en `green2` y `green3` |
| Roadmap y deuda de la v3.0.0 por la etiqueta | ejecución real: `v1` 2/2 sin regresión; este repo | ✅ |

### 4.3 Residuales / deuda generada

- Ninguna fila nueva. Al ticket: `V15` 5/6 en tres tandas (un sujeto reescribió un one-liner); y dos instrucciones obsoletas de `steering/operations.md` (`:248` y `:307`, que nombran pasos de `sdd-start-feature`) para releer en la 0152.

## 5. Aprendizajes

- Un `$` en el texto de reemplazo de `String.replace` en JavaScript es un patrón (`` $` `` mete todo lo anterior): un script que reescribe un documento con texto libre usa `split().join()` o una función → corrompió la previsión de la spec en el commit de apertura; sin cambio en el kit (un caso).
- Una migración que no ha corrido en un repo real esconde huecos que solo salen con datos reales: siete arreglos y dos rondas más tras la revisión → procedencia de `v5` en `tests/batteries/sdd-upgrade/battery.md`.

Retro: documento o skill desmentido → corregido en el documento (`CLAUDE.md`, reglas 2, 6 y 7, con las rutas 3.0.0)

## 6. Adendas

---
id: 20261029-082734-feature-0236-project-gate-levels
feature: 0236
proposal: 0234
title: El gate de los proyectos por niveles y por lo afectado, con la salvaguarda del build
mode: full
profile: delegate
status: approved
created: 2026-10-29
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-29
---

# Spec — El gate de los proyectos por niveles y por lo afectado, con la salvaguarda del build

🦆 Hoy, en un proyecto, el cierre corre la suite entera, a veces dos o tres veces, y un error de lint en un `.md` obliga a repetirla. Con esta feature, cada suite de `operations.md` dice su nivel (unitario, integración o E2E): el cierre corre los unitarios enteros y, de integración y E2E, solo lo que toca la rama. Si la rama, o lo que trae la base, cambia el build, la configuración, las dependencias o un helper común de los tests (un `Api.csproj`, un `pnpm-lock.yaml`), corre todo. Tras un rojo se repiten los tests que fallaron y lo que toca el arreglo, no todo. El lint sale del gate, y `operations.md` declara también la CI de la base, que leerá la 0257.

## Capacidades

- Modificadas: `archive` — el gate de cierre con los unitarios enteros y la salvaguarda, la regla tras un rojo, lo que trae la base y el conflicto de la base solo de docs
- Modificadas: `verification` — la línea `Gate:` con las suites unitarias, sin filtro por el build y tras un rojo
- Modificadas: `control-profiles` — la verificación del merge da por corrido el gate de cierre, no la suite completa
- Modificadas: `onboarding` — `operations.md` con nivel por suite, «Sin filtro», «Lint» y «CI de la base», y la init que los propone
- Modificadas: `migration` — la migración a v3.0.0 propone los mismos campos y avisa de un gate con lint
- Modificadas: `feature-flow` — la verificación de una task corre los unitarios de lo que toca

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (`operations-template.md` es el formato que leen las skills en los proyectos), MODIFIED (cuatro requisitos), cinco capacidades, migración (paso nuevo en `v3.0.0.md`), área no explorada (`sdd-tdd`, `sdd-implement` y `plan-writing.md` sin leer enteros) · tamaño: ~250 líneas en 10 ficheros
- Dominio: si «Sin filtro» y la regla tras un rojo dejan algún caso en que el cierre corre menos de lo que la rama puede romper, y si el conflicto de la base que resuelve el agente tiene su contraejemplo (señal: MODIFIED + cinco capacidades)
- Técnica: si los campos nuevos de `operations-template.md` casan con lo que leen `sdd-archive`, `sdd-verify`, `sdd-init` y la migración, y si el gate sigue cabiendo en `sdd merge --verify` (señal: contrato público + migración)
- Mínimo razonable: un revisor con los siete puntos — deja con una sola lectura la casación entre plantilla, migración y skills
```

1. **Partición**: la 0236 se queda con la pieza A; `sdd-end-release` con la suite completa o el último verde de la CI, y la lectura de la CI antes del merge, van a la fila nueva **0257** (`parent: 0236`, reservada con `sdd id next --reserve`). La 0236 declara el campo «CI de la base»; la 0257 lo lee. `sdd-end-release` hoy no lee ningún gate (comprobado con `grep`), así que nada corre «un gate parcial como si fuera completo» entre las dos.
2. **Filas de deuda que salda**, aunque el prompt de arranque decía «nada que saldar»: «La regla de la intersección rama ∩ base del paso 6 no se cumple» (GREEN de la 0230, `g5`), «Un conflicto de los registros en la misma fila con cambios que no se pisan acaba en una persona» (0096 §6), el menor (a) de «Menores del ticket de la feature 0227», y «El cierre de un proyecto corre la suite entera, y la repite» (document-manager), **parcial**: la release y la CI quedan para la 0257. Las cuatro dicen `Actuar → 0236`.
3. **Los unitarios enteros los corre el cierre, no el gate**: «Gate de cierre» sigue siendo **una sola orden**, la de integración y E2E por lo afectado (`moon run :integration :e2e --affected --base develop --include-relations`), o la suite entera si el proyecto no tiene cómo filtrar (`dotnet test`). Antes de ella, el cierre corre entera cada suite de «Suites» con nivel `unitario` o `pendiente`, con su orden. Así no hay varias órdenes en un campo, `sdd merge --verify` sigue lanzando una sola, y el nivel lo lee quien corre el gate.
4. **Nivel de cada suite**: la línea de «Suites» gana un cuarto campo: `` `unit` · `dotnet test Api.UnitTests` · ~20 s · unitario ``, con los valores `unitario`, `integración`, `E2E` o `pendiente`. Un test va al nivel de lo más pesado que arranca (enmienda de la propuesta). La init y la migración lo proponen solo si la config o el código de la suite dicen qué arranca (un `WebApplicationFactory`, un contenedor, Playwright); si no, `pendiente`, que el gate trata como unitario: corre entera. Los valores van en castellano, como el resto de etiquetas de `operations.md` que leen las skills en inglés («Gate de cierre»).
5. **Campo «Sin filtro»** en `operations.md` §Testing: los globs, a cualquier profundidad, que hacen correr el gate sin `--affected` si la rama o lo que trae la base toca uno. La init y la migración lo proponen desde el repo: los manifiestos y lockfiles que existan, la config del build y de los runners, `.moon/**` y las carpetas de helpers comunes de los tests que encuentren (`tests/helpers/`, `TestUtils/`); el dev-lead confirma. Sin el campo (proyecto en 2.x o sin migrar), la lista es: los manifiestos de «con código» de `onboarding` (`package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`), sus lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `packages.lock.json`, `poetry.lock`, `uv.lock`, `go.sum`, `Cargo.lock`, `composer.lock`, `Gemfile.lock`), `.moon/**`, `tsconfig*.json`, `Directory.Build.*`, `Directory.Packages.props`, `global.json`, `.prototools`, `vitest.config.*`, `jest.config.*` y `playwright.config.*`. `moon.yml` no está: el `moon.yml` de un proyecto define sus tareas, y ya lo cubre «sin filtro: cambia su definición», que corre solo esas tareas.
6. **`--include-relations`**: la plantilla, la init y la migración proponen el gate de moon con `--include-relations` (enmienda 4 de la propuesta: en OdySIF las tareas de la raíz nunca salían con `--affected`); `sdd merge --verify` ya lo lee (`cli/src/merge/affected.ts`, `-g` o `--include-relations`).
7. **«Lint»**: `<orden al editar y en el pre-commit, solo sobre los ficheros tocados · ninguno>`. Lint es formato y estilo (markdownlint, ESLint, Prettier, `dotnet format`); typecheck y build siguen en el gate. El gate de la plantilla no lo lleva; un gate ya declarado manda tal cual hasta que el dev-lead lo cambie. La migración avisa de un gate con una tarea de lint o formato, en su paso 9: `Gate con lint: «<línea>» — el lint va en «Lint», al editar y en el pre-commit; sácalo del gate`.
8. **«CI de la base»**: `<pipeline que corre todas las suites en cada push a la rama de integración, un job a la vez · la orden que lee su último resultado, o «sin orden de lectura» · o ninguna>`. La init y la migración proponen el pipeline que encuentren (`.github/workflows/`, `azure-pipelines.yml`, `.gitlab-ci.yml`), y la orden solo con GitHub (`gh run list --workflow <fichero> --branch <merge.into> -L 1 --json conclusion,headSha`); con otro, `sin orden de lectura`.
9. **La regla tras un rojo**: en la pasada siguiente a una roja en `<sha rojo>` corren, con el runner del proyecto, todos los tests que fallaron y los de la tarea roja que no llegaron a correr (bail, proceso caído), o la tarea roja entera si la salida no permite saberlo; después, el gate con `--base <sha rojo>` en vez de `--base <merge.into>`, y las tareas que moon saltó por depender de la roja. Un arreglo que solo toca `.docs/` o `*.md` corre solo los tests que fallaron. Un rojo que no es de un test (build, typecheck) repite su tarea entera. Un arreglo que toca un fichero de «Sin filtro» corre todo sin filtro. Las suites unitarias corren enteras si el arreglo toca algo que no es docs.
10. **Literales de la línea `Gate:`**: las órdenes que corrieron van antes de la flecha, cada una entre backticks y separadas por ` · `: `` Gate: `npm run test:unit` · `moon run :integration --affected --base develop` → … ``. Las entradas nuevas: `<tarea>: corrió <N>/<M> (sin filtro: cambia el build)`, y `<tarea>: corrió <N>/<M> (no corrió en la pasada roja)`. Tras un rojo, la línea empieza por `tras el rojo en <sha>, arreglo <sha>:`; con un arreglo solo de docs, `tras el rojo en <sha>, arreglo <sha> solo de docs: <test>: corrió 1/1`.
11. **Dónde viven las reglas de correr el gate**: en `sdd-verify`, junto a «The `Gate:` line», en un bloque «Running a gate» con los unitarios enteros, la salvaguarda, la regla tras un rojo y el lint. Lo leen `sdd-archive` (pasos 1 y 6), el paso 7 de `sdd-start-feature`, el carril config y la línea base de `sdd-worktrees`; cada uno lo nombra en una línea. Si el GREEN muestra que un sujeto no abre `sdd-verify` desde el paso 7, la regla sube a ese paso.
12. **Conflicto de la base solo de docs**: en cualquier perfil, el agente resuelve un `base: conflicto en` (o `merge: conflicto en`) si cada fichero en conflicto es un `.md` de `.docs/` fuera de `capabilities/`, o `ROADMAP.md` o `CHANGELOG.md`, y en cada trozo los dos lados se juntan sin quitar texto a ninguno y sin que el resultado se contradiga: una frase añadida a una línea que el otro reescribe, o un prefijo de cierre sobre una fila cuyo «Destino» cambió el otro. Para por una persona, como hoy, si los dos cambian el mismo valor de forma distinta (dos «Destino», dos cifras), si la frase de un lado dice lo contrario que el otro, o si algún fichero en conflicto queda fuera. `capabilities/` queda fuera porque dos THEN juntados pueden ser incompatibles, y su add/add ya lo junta la CLI. Commitea el merge con el hook, su cuerpo y el mensaje final lo nombran: `Conflicto de la base resuelto por el agente: <fichero> — <qué juntó de cada lado>`. En `pair` el merge se presenta como siempre.
13. **Lo que trae la base** (paso 6 de `sdd-archive`): si trae un fichero de «Sin filtro», el gate corre entero sobre el merge de sincronización; si trae cambios que no son docs, las suites unitarias corren enteras; lo demás, la intersección de hoy. El paso 6 pasa a viñetas, con dos casos (sin suite todavía, y con suite) y la orden de la intersección escrita; su texto duplicado con «The suite again» de `merge-recipe.md` se queda solo en el paso.
14. **«Gate de merge»** sigue siendo la orden que lanza `sdd merge --verify`, sin los unitarios: el cierre ya los corrió sobre el merge de sincronización, y lo que la base mueva entre la sincronización y el merge lo cruza `--verify` y lo verá la CI (0257). `sdd merge --verify` no lee «Sin filtro»: la salvaguarda la aplica el cierre antes del merge. Si la base trae un lockfile en ese hueco, solo lo verá la CI: se acepta.
15. **La verificación de una task** (plantilla del plan): corre las suites unitarias de sus superficies y los tests que la task escribe o cambia, de cualquier nivel; la integración y los E2E que no escribe los corre el gate de cierre.
16. **«La selección se prueba con casos»** (enmienda 4) se lee como casos de la batería: un `.md` no corre nada, un `.csproj` lo corre todo, `--base <sha rojo>` toma esa base. La init y la migración no simulan cambios en el repo del proyecto.
17. **«Suite completa» en otros requisitos**: donde quiere decir el gate de cierre y cambia lo que se corre, va al delta (`archive`, `control-profiles`). «El smoke dice cuánto tardó la suite completa» (`feature-flow`, «El trabajo se valida con el usuario…», 412 palabras) y «el gate completo aparece una sola vez» siguen ciertos leídos como el gate de cierre, y no se tocan: renombrar el término en todo el kit es otra feature.
18. **No entra la pasada de fix de la revisión final** («then run the whole suite» de `sdd-verify`, Native): repite la suite antes del gate de la validación. Abro fila de deuda en el cierre: no es la regla tras un rojo del gate y no hay evidencia de campo de su coste.
19. **Versión**: la 3.0.0 no está publicada (`plugin.json` dice 2.3.4), así que los campos van en el paso 2 de `v3.0.0.md` y no en una migración nueva.
20. **Una pieza entra, otra sale**: sale el texto duplicado del paso 6 y la receta (decisión 13), y «Gate de cierre» de la plantilla deja de decir «la suite completa». Los topes de palabras no suben.
21. **Previsión de coste (Art. I)**: 11 escenarios nuevos o cambiados (tabla de «Dónde se prueba»), RED n = 1 y GREEN n = 2, sujetos Sonnet headless: ~31 sujetos, ~90 min de campaña en tandas de 3, ~17 $ (~0,70 $ por sujeto de `sdd-archive` y ~0,35 $ por los demás, `tech-stack.md`). Humo de `sdd-start-feature`, `sdd-worktrees` y `sdd-propose` (el carril config), que solo ganan una línea que remite a `sdd-verify`. Con más de 22 $ paro y decides tú.
- Repaso de coherencia: el delta citaba «la decisión 3» en un THEN; ahora lleva la lista literal. `sdd capability merge` sobre una copia de `.docs/sdd`: añade 4 requisitos, sustituye 9 y 3 reglas de `archive`, sin rechazos; `sdd capability check` sobre la copia: `Capacidades válidas: 20`.
- Política de modelos: revisores de la spec, dominio opus y técnica sonnet (hechos) · revisión final con ejes Spec opus+high, Código sonnet+high y Arquitectura según el plan · sujetos de la campaña RED/GREEN en Sonnet, en tandas · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pide tu `CLAUDE.md`.

### Hallazgos de la review

Dominio (opus) y técnica (sonnet), 2026-10-29. Aceptados → cambio:

- Técnica 1, 4, 9 y dominio 10: un «Gate de cierre» de varias órdenes no cabe en `--verify` ni dice cómo lo hace un proyecto sin moon → decisión 3: el gate es una orden y los unitarios los corre el cierre por su nivel; `pendiente` corre entero; el ejemplo de la init con `vitest run` pasa a `pendiente`.
- Técnica 2 y dominio 1: `moon.yml` en la lista chocaba con «cambia su definición» → sale de la lista (decisión 5).
- Dominio 2 y 8: un arreglo solo de docs no corría ni el test que falló; faltaban varios rojos y los tests no corridos de la tarea roja → decisión 9 y su escenario.
- Técnica 6 y dominio 3, 9: el conflicto contradecía «Regla ante conflicto» de `archive`, sin perfiles y con un contraejemplo corto → decisión 12, `capabilities/` fuera, «se contradice» como contraejemplo, «Reglas de la capacidad» de `archive` en el delta.
- Dominio 4: requisitos vivos con «repite la suite» y «la suite completa» → `MODIFIED` de «Un rojo ajeno…», «El walkthrough dice…» y «La verificación del merge…»; el resto, decisión 17.
- Dominio 5 y técnica 5: lo que trae la base podía saltarse la salvaguarda y los unitarios → decisión 13 y `MODIFIED` de «El cierre integra la base…».
- Dominio 6: faltaban manifiestos de otros stacks y la profundidad de los globs → decisión 5.
- Dominio 7: `--include-relations` → decisión 6.
- Técnica 7: el aviso del gate con lint es del paso 9 → `MODIFIED` de «La migración a v3.0.0 avisa de un gate que encadena comandos»; decisión 7 dice que el gate declarado manda.
- Técnica 3: `--verify` no conoce «Sin filtro» → aceptado como hueco declarado (decisión 14).
- Técnica 10: orden de lectura para pipelines que no son de GitHub → `sin orden de lectura` (decisión 8); escenario de lint → AND en el escenario de tras un rojo.

Rechazados → motivo:

- Técnica 8, `sdd-end-release` corre el gate como suite completa: no lee ningún gate hoy (decisión 1); `plan-writing.md` copia el «Gate de cierre» literal y no cambia; `walkthrough-template.md` y `patch-template.md` remiten a la línea `Gate:` de `sdd-verify`.
- Técnica 10, `MODIFIED` de la línea base de `sdd-worktrees`: su comportamiento no cambia; solo gana una línea que remite a `sdd-verify`.
- Técnica 9, versión publicada: no lo está (decisión 19).

### Decisiones tomadas con el dev-lead

- Partir la 0236: A en la 0236, B (`sdd-end-release` y la CI antes del merge) en una fila nueva — opción «Partir en A y B (Recomendada)», 2026-10-29
- Un `base: conflicto en` solo de `.docs/` que junta dos añadidos sin contradicción lo resuelve el agente y lo nombra en el mensaje final — opción «Lo resuelve el agente (Recomendada)», 2026-10-29
- Spec aprobada — opción «Apruebo (Recomendada)», 2026-10-29
- Review de la spec con dos revisores, dominio en Opus — opción «Dos revisores: dominio Opus (Recomendada)», 2026-10-29
- `sdd merge --verify` ya corre solo lo que se cruza con la base y lanza el gate sin shell (0235): la 0236 no lo repite — prompt de arranque, 2026-10-29

## Intent

En los proyectos el cierre corre la suite entera hasta cinco veces, y un lint de un `.md` lo repite todo: en document-manager, de 18 a 27 min por cierre, y en ~25 cierres ningún rojo de la suite completa vino de fuera de lo que tocaba la rama; en este repo, 3 rojos reales de 32, los tres en lo afectado. La literatura (análisis de impacto de tests, la pirámide, «a one-line fix does not need the whole suite») corre lo afectado en cada cambio y todo en otro sitio. El éxito: en un proyecto con la plantilla nueva, un cierre corre los unitarios enteros y lo afectado de integración y E2E, una vez; un arreglo de docs tras un rojo solo repite los tests que fallaron; y una rama, o una base, que cambia el build no puede cerrar sin la suite entera. Fracasa si un cierre corre menos de lo que la rama puede romper.

## Scope

- Entra: `operations-template.md` (nivel por suite, «Sin filtro», «Lint», «CI de la base», «Gate de cierre» por lo afectado con `--include-relations`); la fila de `sdd-init` que la propone; los pasos 2 y 9 de `v3.0.0.md`; `plan-template.md` («Verificación» por nivel); `sdd-verify` (bloque «Running a gate» y línea `Gate:`); `sdd-archive` pasos 1 y 6 y `merge-recipe.md` (paso 6 en viñetas, lo que trae la base, conflicto de la base solo de docs); una línea en el paso 7 de `sdd-start-feature`, en la línea base de `sdd-worktrees` y en el carril config de `sdd-propose` que remite a «Running a gate»; las baterías de `sdd-archive`, `sdd-init`, `sdd-upgrade` y `sdd-propose`.
- No entra: `sdd-end-release` y la lectura de la CI antes del merge (0257); la CLI (`sdd merge --verify` ya cruza y lee `--include-relations`, 0235; resolver el conflicto en la CLI se descartó; leer «Sin filtro» en `--verify`, decisión 14); la pasada de fix de la revisión final (decisión 18); niveles en el `tech-stack.md` de este repo (su gate ya corre lo afectado y la 0233 llevó la suite completa a la release); el markdown de las plantillas que pasa el lint (0237); renombrar «suite completa» en todo el kit (decisión 17); `sdd-start-patch`, que no corre el gate: lo corre `sdd-archive`; `sdd-tdd`, `sdd-implement` y su `implementer-prompt.md`, que leen la «Verificación» del plan sin decir qué lleva.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Gate de cierre: <comando de la suite completa que corre una vez, al cerrar>» | `skills/sdd-templates/templates/operations-template.md:16`; `capabilities/onboarding.md` («`operations.md` dice cómo…», «La entrevista fija cómo se prueba…») | plantilla reescrita (decisión 3); delta, `MODIFIED` de los dos |
| «- **Suites**: <… su comando y su duración …>», sin nivel | `operations-template.md:14`; `skills/sdd-init/SKILL.md:48`; `capabilities/onboarding.md` | plantilla y fila de la init (decisión 4); delta, `MODIFIED` |
| «The suite again» duplicado con el paso 6 | `skills/sdd-archive/references/merge-recipe.md:11`; `skills/sdd-archive/SKILL.md:47` | se queda solo en el paso 6, en viñetas (decisión 13) |
| «a person resolves» ante `base: conflicto en` | `merge-recipe.md:10` y `:52`; `sdd-archive/SKILL.md:47`; `capabilities/archive.md` («Regla ante conflicto») | decisión 12; delta, «Reglas de la capacidad — archive» y `ADDED` |
| «repite la suite» tras un rojo de la rama | `capabilities/archive.md` («Un rojo ajeno…»); `merge-recipe.md:26` | delta, `MODIFIED`; la receta remite a «Running a gate» |
| «4.1 Builds lleva la suite completa» | `capabilities/archive.md` («El walkthrough dice…») | delta, `MODIFIED` |
| «la suite completa ya corrió antes del script» | `capabilities/control-profiles.md` («La verificación del merge…») | delta, `MODIFIED` |
| «Verificación»: los comandos de las superficies | `skills/sdd-templates/templates/plan-template.md:148` y `:153`; `capabilities/feature-flow.md` | decisión 15; delta, `MODIFIED` |
| aviso del paso 9 de la migración | `skills/sdd-upgrade/references/migrations/v3.0.0.md` paso 9; `capabilities/migration.md` | delta, `MODIFIED` |

- Filas que implementa: 0236 → `roadmap.md:24` (🔄 al arrancar, ✅ al cerrar); deuda «La regla de la intersección…» (`g5`), «Un conflicto de los registros en la misma fila…» (0096 §6), «Menores del ticket de la feature 0227» (a) y «El cierre de un proyecto corre la suite entera…» (parcial → 0257): las cuatro con su prefijo de cierre. Comprobado con `grep -rn "0236" .docs/sdd/roadmap.md .docs/sdd/capabilities skills CLAUDE.md`: fuera del roadmap no aparece. La 0249 («tras 0236, que declara «CI de la base»») sigue cierta.

## Approach

Las reglas de correr un gate (unitarios enteros, salvaguarda, tras un rojo, lint) se escriben una vez, en `sdd-verify`, junto a la línea `Gate:` que ya leen todos los sitios que corren un gate, y cada sitio las nombra en una línea. La plantilla de `operations.md` gana los campos que esas reglas leen, y la init y la migración los proponen desde el repo, con el dev-lead confirmando. El conflicto de la base solo de docs es texto de la receta del merge, con su contraejemplo, sin tocar la CLI. Cada regla nueva lleva su RED antes de escribirse (Art. I): si el baseline no muestra el fallo, no se escribe.

## Dónde se prueba

| Comportamiento | Escenario (batería) | Patrón |
| --- | --- | --- |
| Unitarios enteros y lo afectado; la rama toca `Api.csproj` → todo sin filtro | `s1` nuevo (`sdd-archive`) | como `g5`: molde con gate de moon filtrado y una suite unitaria |
| Tras un rojo, arreglo solo de `.md` → solo los tests que fallaron | `s2` nuevo (`sdd-archive`) | como `a3r` |
| Tras un rojo, arreglo de código → los tests rojos, `--base <sha rojo>` y la tarea saltada | `s3` nuevo (`sdd-archive`) | como `a3a` |
| La base trae `pnpm-lock.yaml` → gate entero tras `--sync` | `s6` nuevo (`sdd-archive`) | como `g5` |
| Conflicto de la base solo de docs que junta → lo resuelve y lo nombra | `s4` nuevo (`sdd-archive`) | como `a3`, con la fila de deuda de la 0235 §3 |
| Contraejemplo: dos «Destino» distintos → para | `s5` nuevo (`sdd-archive`) | como `a3` |
| Intersección del paso 6 (deuda de la 0230) | `g5` existente, re-medido | tal cual |
| La init propone nivel, «Sin filtro», «Lint» y «CI de la base» | `i*` nuevo (`sdd-init`) | como «La entrevista fija cómo se prueba» |
| La migración los propone (paso 2) | `u1` nuevo (`sdd-upgrade`) | como el de los campos E2E |
| La migración avisa del gate con lint (paso 9) | `u2` nuevo (`sdd-upgrade`) | como el del gate que encadena |
| La verificación de una task corre los unitarios de lo que toca | `p*` nuevo (`sdd-propose`, plan) | como «Cada task del plan verifica solo sus superficies» |
| Los campos de la plantilla existen y los nombra la migración | `cli/test/kit/` (Vitest) | test de literal de plantilla, como los de `upgrade.test.ts` |

## Términos y ADR

- Términos resueltos: **nivel** — unitario, integración o E2E, por lo más pesado que arranca la suite; `pendiente` corre como unitario; **lo afectado** — lo que selecciona el filtro del gate frente a una base (`merge.into`, o el sha rojo tras un rojo); **salvaguarda** — los ficheros de «Sin filtro», que hacen correr el gate sin filtro; **lint** — formato y estilo, no typecheck ni build.
- ADR candidatas: el cierre corre los unitarios enteros y lo afectado del resto, y la suite completa va a la release o a la CI — alternativa descartada: la suite completa en cada cierre (la regla del kit hasta la 2.3.x). La escribe la 0257, que completa la decisión; la 0236 la deja nombrada en su walkthrough.

## Delta de comportamiento

### Capacidad: `archive`

#### ADDED — El gate corre entero si la rama toca el build, la configuración, las dependencias o los helpers de los tests

- GIVEN un `operations.md` con «Suites» `` `unit` · `npm run test:unit` · ~15 s · unitario `` y `` `integration` · `moon run :integration` · ~4 min · integración ``, «Gate de cierre» `moon run :integration --affected --base develop --include-relations`, «Sin filtro» `**/package.json`, `pnpm-lock.yaml`, `**/*.csproj`, `tests/helpers/**`, y la rama 0081 que cambia `apps/api/Api.csproj` y `apps/api/People/Save.cs`
- WHEN el cierre corre el gate de cierre
- THEN corre `npm run test:unit` entera y después el gate sin `--affected`
- AND la línea es `` Gate: `npm run test:unit` · `moon run :integration --affected --base develop --include-relations` → unit: corrió 510/510 · api:integration: corrió 61/61 (sin filtro: cambia el build) · app:integration: corrió 12/12 (sin filtro: cambia el build) ``
- AND si la rama solo toca `apps/app/src/people/list.ts`, corre `npm run test:unit` entera y el gate con `--affected`, y `api:integration` sale como `saltada`; si solo toca `README.md` y `.docs/sdd/roadmap.md`, no corre ninguna orden
- AND una suite con nivel `pendiente` corre entera, como una unitaria
- AND sin «Sin filtro» en `operations.md`, cuentan como build, a cualquier profundidad, `package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `packages.lock.json`, `poetry.lock`, `uv.lock`, `go.sum`, `Cargo.lock`, `composer.lock`, `Gemfile.lock`, `.moon/**`, `tsconfig*.json`, `Directory.Build.*`, `Directory.Packages.props`, `global.json`, `.prototools`, `vitest.config.*`, `jest.config.*` y `playwright.config.*`, y `Api.csproj` también hace correr todo
- AND editar el `moon.yml` de `apps/app` no es «cambia el build»: corre sin filtro solo las tareas que define, con `(sin filtro: cambia su definición)`

#### ADDED — Tras un rojo, el gate repite los tests que fallaron y lo afectado por el arreglo

- GIVEN una pasada roja en `a1b2c3d` del gate `moon run :integration --affected --base develop --include-relations`, con `PeopleTests.Zero_is_saved` y `PeopleTests.Empty_name_is_rejected` en rojo en `api:integration`, y `app:integration` sin correr porque moon la saltó por depender de la roja
- WHEN el arreglo `e4f5a6b` toca `apps/api/People/Save.cs` y el cierre vuelve al gate
- THEN corre `PeopleTests.Zero_is_saved` y `PeopleTests.Empty_name_is_rejected` con el runner del proyecto, la suite unitaria entera, el gate con `--base a1b2c3d` y `app:integration`
- AND la línea es `` Gate: `npm run test:unit` · `moon run :integration --affected --base develop --include-relations` → tras el rojo en `a1b2c3d`, arreglo `e4f5a6b`: PeopleTests.Zero_is_saved: corrió 1/1 · PeopleTests.Empty_name_is_rejected: corrió 1/1 · unit: corrió 510/510 · api:integration: corrió 61/61 · app:integration: corrió 12/12 (no corrió en la pasada roja) ``
- AND si el runner paró en el primer rojo (bail) y no dice qué tests quedaron sin correr, corre `api:integration` entera
- AND si el arreglo solo toca `.docs/sdd/specs/<carpeta>/walkthrough.md` y `README.md`, corre solo los dos tests que fallaron, y la línea es `` Gate: `moon run :integration --affected --base develop --include-relations` → tras el rojo en `a1b2c3d`, arreglo `e4f5a6b` solo de docs: PeopleTests.Zero_is_saved: corrió 1/1 · PeopleTests.Empty_name_is_rejected: corrió 1/1 ``
- AND si el rojo fue de `api:typecheck`, no de un test, repite `api:typecheck` entera
- AND si el arreglo toca un fichero de «Sin filtro», corre todo sin filtro
- AND un rojo de lint (markdownlint en `README.md`) no repite el gate: se arregla el fichero, lo comprueba el pre-commit y no corre ningún test

#### ADDED — Un conflicto de la base solo en docs que junta dos añadidos lo resuelve el agente

- GIVEN `sdd merge --sync` que da `base: conflicto en .docs/sdd/roadmap.md.`, donde la rama pone el prefijo `**[Feature 0235, 2026-10-28: parcial — …]**` a una fila de deuda cuyo «Destino» la base cambió de `**Esperar 2.º ticket**` a `**Actuar → 0236**`
- WHEN el cierre lee el conflicto, en cualquier perfil
- THEN deja la fila con el prefijo de la rama y el «Destino» de la base, commitea el merge de sincronización con el hook y sigue el cierre
- AND el cuerpo del commit y el mensaje final llevan `Conflicto de la base resuelto por el agente: .docs/sdd/roadmap.md — el prefijo de cierre de la rama y el «Destino» de la base en la fila «…»`
- AND lo mismo con una frase que la base añade al final de una línea de `.docs/sdd/tech-stack.md` que la rama reescribe, si no dice lo contrario que la línea de la rama: queda la línea de la rama más la frase de la base
- AND si en un trozo la rama y la base ponen dos «Destino» distintos (`**Actuar → 0240**` y `**Descartada**`), si la frase de la base dice lo contrario que la línea de la rama, o si el conflicto incluye un fichero de `.docs/sdd/capabilities/` o que no es un `.md` de `.docs/` ni `ROADMAP.md` o `CHANGELOG.md` (`src/slots.js`), no resuelve nada: el cierre queda «No terminado» para una persona

#### MODIFIED — El cierre integra la base tras su commit y repite solo lo que afecta lo que trae la base

- GIVEN la 0081, que toca `src/app/` y `src/api/`, con la suite en verde en `a1b2c3d`, en la validación, un gate de cierre `moon run app:test api:test launcher:test --affected --base develop`, y `origin/develop` que avanzó con el merge de la 0080, que cambia `src/api/rooms.js` (input de `api:test`) y `scripts/launcher/run.sh` (input de `launcher:test`, que la 0081 no toca)
- WHEN el cierre ha hecho su commit de cierre
- THEN hace `git fetch` y `sdd merge --sync --project-root <worktree>`, que integra `origin/develop` en la rama como último commit, y corre sobre el resultado solo las tareas que tocan la rama y la base a la vez: `api:test`; no corre `app:test` (la base no toca sus inputs) ni `launcher:test` (solo la toca la base, y la verificó el cierre de la 0080)
- AND el mensaje final lleva `` Gate: `moon run app:test api:test launcher:test --affected --base develop` → api:test: corrió 212/212 · app:test: saltada (la base no toca sus inputs: `moon task app:test`) · launcher:test: saltada (solo la toca la base) ``, y el 4.1 del walkthrough, la línea `Gate:` de la validación
- AND el merge final lleva `--verified-at <sha del merge de sincronización>`
- AND si la 0080 solo hubiera cambiado `.docs/sdd/roadmap.md`, no corre nada y el merge lleva `--verified-at a1b2c3d`
- AND con un gate sin filtro de base (`node --test`), corre el gate entero (E2E incluidos si el proyecto los declara) si la base trae cambios fuera de `.docs/` que no sean `*.md`
- AND con conflicto en `roadmap.md`, `changelog.md` o un add/add de dos requisitos al final de una capacidad, `--sync` lo resuelve y el cierre sigue; con `base: conflicto en src/slots.js`, el cierre queda «No terminado» para una persona
- AND si la 0080 trae también `pnpm-lock.yaml`, que está en «Sin filtro», el gate corre entero sobre el merge de sincronización, con `(sin filtro: cambia el build)` en cada tarea
- AND con una suite unitaria en «Suites», corre entera sobre el merge de sincronización si la base trae cambios fuera de `.docs/` que no sean `*.md`

#### MODIFIED — Un rojo ajeno se busca en la deuda antes de investigarlo

- GIVEN el cierre de la 0081 cuya suite falla sobre la rama con la base integrada con `TimeoutError: tests/e2e/export.spec.ts:12`
- WHEN el cierre recibe ese rojo
- THEN la salida de cada pasada de la suite ya está entera en un fichero del scratchpad de la sesión, guardada antes de filtrarla
- AND crea un worktree temporal desanclado de `origin/develop`, prepara su entorno como el Step 2 de `sdd-worktrees` (dependencias y, con `environments.md`, `env:setup`) y lo retira al acabar; no fusiona hasta que acaba el contraste
- AND corre primero el fichero que falla, `tests/e2e/export.spec.ts`, con el runner del proyecto, en la rama y en ese worktree a la vez, sin limpiar estado ni cachés
- AND si también falla, escribe `base: en rojo: el mismo comando también falla sin la rama` y busca `export.spec.ts` y `TimeoutError` en la deuda del proyecto antes de abrir el test; si una fila lo nombra, la cita en el informe; si no, abre una fila en «Por triar» de `debt.md` (o en «Deuda técnica» del roadmap 2.x) con la evidencia
- AND para con un bloque que lleva el comando, el código de salida, la ruta del log, las últimas 20 líneas, la línea `base:` y «`develop` sin tocar en `<hash>`», con el hash de `git rev-parse develop`, y pregunta si fusiona igual
- REMOVED AND si pasa sin la rama y falla en la rama, el rojo es de la rama: vuelve a ella, arregla con un test que falla primero y repite la suite
- AND si pasa sin la rama y falla en la rama, el rojo es de la rama: vuelve a ella, arregla con un test que falla primero y vuelve al gate como dice «Tras un rojo, el gate repite los tests que fallaron y lo afectado por el arreglo»
- AND si en la rama también pasa, «No se repite»: abre una fila de intermitentes en la deuda, donde abriría la del rojo que también falla sin la rama, con el test, su línea de error copiada entera de la salida guardada, sin «…», y las dos pasadas en verde, y sigue con el cierre en cualquier perfil
- AND si el fichero pasa en los dos y su línea de error no es un tiempo agotado ni un recurso de la máquina (puerto ocupado, fichero bloqueado, disco lleno, objetos temporales de git), antes de «No se repite» corre la tarea roja entera en los dos, con las mismas salidas
- AND GIVEN un gate `moon run cli:test --affected --base develop` con 1 rojo en `test/x.slow.test.ts` y un worktree de la base recién creado, THEN corre `test/x.slow.test.ts` sin la rama y en la rama antes que la tarea, con las dependencias instaladas, y llega a un veredicto sin esperar el cerrojo de otra rama; si tiene que correr la tarea, la nombra sin `--affected`
- AND con el rojo del `--verify` de `sdd merge`, la línea `base:` es la que da el script, y el cierre sigue igual

#### MODIFIED — El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite

- GIVEN una feature cerrada con `sdd-archive`
- WHEN se escribe «4. Verificación» del walkthrough
- REMOVED THEN «4.1 Builds» lleva la suite completa con su comando, su resultado, su duración, su configuración (la del gate, o lo que se añadió) y el sha de la validación; si se repitió tras el merge de sincronización, el mensaje final da su resultado y su sha
- THEN «4.1 Builds» lleva la línea `Gate:` del gate de cierre, con las suites unitarias, su duración, su configuración (la del gate, o lo que se añadió) y el sha de la validación; si se repitió tras el merge de sincronización, el mensaje final da su resultado y su sha
- AND si el sha de la validación cae en el tramo que el cierre junta (una pasada de fix o un borrador tras la última task), «4.1 Builds» dice «sobre el commit de cierre» en lugar del sha, y `--verified-at` y el mensaje final llevan el sha del commit de cierre; nunca el de la última task
- AND con E2E, «4.1 Builds» lleva el comando de «Entorno de la suite» con su comprobación, levantado en esa sesión, y la duración de la suite E2E frente a «Presupuesto E2E»
- AND «4.2 Smoke / tests» tiene una fila por THEN con su evidencia (`suite` · `ejecución real` · `no probado`)
- AND si la suite E2E pasó de su presupuesto, o, sin presupuesto, la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración

#### Reglas de la capacidad — archive

- **Límites**: tope de palabras de `sdd-archive`, `SKILL.md` 3.920 y total 8.000 (`cli/test/kit/word-budget.test.ts`); el gate de cierre corre una vez por árbol: en la validación o, con otra rama abierta o la base por delante, solo sobre el merge de sincronización; corre enteras las suites unitarias y `pendiente` de «Suites», y el gate por lo afectado, o entero si la rama toca un fichero de «Sin filtro»; tras un rojo corren los tests que fallaron, los que no llegaron a correr y el gate con `--base <sha rojo>`, y con un arreglo solo de docs, solo los tests que fallaron; tras el merge de sincronización se repiten solo las tareas que tocan la rama y la base a la vez: con un gate filtrado, las que selecciona contra `<merge.into>` y también contra el sha de la última suite en verde; sin filtro, el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`; si la base trae un fichero de «Sin filtro», el gate entero; el informe de rojo lleva las últimas 20 líneas; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` dentro del `NOTICE` y el anexo de procedencia de `sdd-archive` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0)
- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md` · `Validado: <fecha> · panel: <n>/<n> OK · «listo»` · `no ensayado: <motivo>` · que la captura es la del momento de leer y la red no trae hora (panel en Chrome) · que la página del plan B no ve la app: sin consola, red ni captura del KO · `Panel: Chrome sobre <url de la app>` · `Panel: plan B en http://127.0.0.1:<puerto>/` · `Panel: no arrancó: <su error>` · `Conflicto de la base resuelto por el agente: <fichero> — <qué juntó de cada lado>`
- **Regla ante conflicto**: un conflicto al integrar la base o al fusionar que `sdd merge` no resuelve lo resuelve una persona, salvo el que cae solo en `.md` de `.docs/` fuera de `capabilities/`, o en `ROADMAP.md` o `CHANGELOG.md`, y junta los dos lados sin quitar texto ni contradecirse, que lo resuelve el agente y lo nombra; un rojo que también falla sin la rama lo decide el dev-lead tras la búsqueda en la deuda; el merge a la rama estable, el tag y su push solo con la frase del dev-lead; la fila de la madre de una familia la cierra el dev-lead, no el cierre; el panel en Chrome va antes que el plan B, que solo sale sin Claude in Chrome, sin navegador conectado o con la inyección fallida; si lo que la persona dice en el chat contradice una marca del panel, manda lo que dice, y el agente lo registra con su frase

### Capacidad: `verification`

#### MODIFIED — La línea `Gate:` nombra cada tarea, corrida o saltada

- GIVEN un cambio en carril config que edita la definición de `app:test` en `moon.yml`, con el gate `moon run app:test api:test --affected --base develop`, que sale con 0 y `Tasks: 0 completed, 2 skipped`
- WHEN el agente va a declarar el gate y commitear
- THEN corre `moon run app:test` sin `--affected`, porque cambia su definición, antes de commitear
- AND la línea del commit es `` Gate: `moon run app:test api:test --affected --base develop` → app:test: corrió 98/98 (sin filtro: cambia su definición) · api:test: saltada (ningún fichero cambiado casa con sus inputs: `moon task api:test`) ``
- AND nunca escribe `→ verde` ni da el gate por bueno solo por su código de salida
- AND la misma forma, una entrada por tarea del gate, vale en el 4.1 del walkthrough, en el §4 de `patch.md` y en el informe de la baseline de `sdd-worktrees`
- AND las órdenes que corrieron (las suites unitarias y el gate) van antes de la flecha, cada una entre backticks y separadas por ` · `
- AND una tarea que corre sin filtro porque la rama o la base tocan un fichero de «Sin filtro» de `operations.md` lleva `(sin filtro: cambia el build)`; una que no corrió en la pasada roja, `(no corrió en la pasada roja)`; tras una pasada roja, la línea empieza por `tras el rojo en <sha>, arreglo <sha>:`, y con un arreglo solo de docs, por `tras el rojo en <sha>, arreglo <sha> solo de docs:`

### Capacidad: `control-profiles`

#### MODIFIED — La verificación del merge es el gate de merge, no la suite completa

- GIVEN un proyecto cuyo `tech-stack.md` §Testing separa un conjunto rápido de la suite completa
- WHEN el cierre fusiona con `sdd merge`
- THEN `--verify` es el conjunto rápido, que corre sobre el resultado del merge y antes del push; con una sola suite, es esa
- REMOVED AND la suite completa ya corrió antes del script: en la validación final y, si la base trajo cambios fuera de `.docs/` que no sean `*.md`, otra vez tras el merge de sincronización del cierre; el mensaje final da su resultado y su sha
- REMOVED AND si un hook `pre-merge-commit` del repo ya ejecuta el gate, `--verify` se omite; la suite completa no se omite nunca
- AND el gate de cierre ya corrió antes del script: en la validación final y, si la base trajo cambios fuera de `.docs/` que no sean `*.md`, otra vez tras el merge de sincronización del cierre; el mensaje final da su resultado y su sha
- AND si un hook `pre-merge-commit` del repo ya ejecuta el gate, `--verify` se omite; el gate de cierre no se omite nunca
- AND `--verify` no lleva las suites unitarias ni lee «Sin filtro»: los aplicó el gate de cierre sobre el merge de sincronización

### Capacidad: `onboarding`

#### MODIFIED — `operations.md` dice cómo se ejecuta y se verifica el proyecto

- GIVEN `operations-template.md`
- WHEN se lee
- THEN tiene `## Comandos`, `## Testing`, `## Frontend` y `## Entornos`, y no tiene tabla de versiones ni «Decisiones abiertas»
- REMOVED AND `## Testing` pide cada suite con su comando y su duración, el comando de lo afectado, el gate de cierre y el de merge, cómo entra el agente en la aplicación, si los tests usan el motor de producción y dónde deja cada suite sus temporales
- AND `## Testing` pide cada suite con su comando, su duración y su nivel (`unitario`, `integración`, `E2E` o `pendiente`), el comando de lo afectado, el gate de cierre —una orden, la integración y los E2E por lo afectado, con `--include-relations` en moon, o la suite entera si el proyecto no filtra— y el de merge, «Sin filtro» (los globs del build, la configuración, las dependencias y los helpers comunes de los tests), «Lint» (formato y estilo, al editar y en el pre-commit, nunca en el gate), «CI de la base» (el pipeline y la orden que lee su último resultado, `sin orden de lectura` o `ninguna`), cómo entra el agente en la aplicación, si los tests usan el motor de producción y dónde deja cada suite sus temporales
- AND `## Frontend` tiene los campos URL, Detector, Viewports, Runner E2E, Acceso, Temas, Pantalla de referencia y Skills de apoyo
- AND `## Testing`, solo si el proyecto tiene E2E, pide los flujos core con su test, el presupuesto de la suite E2E, los retries, los timeouts, el entorno de la suite y cómo crea y borra cada test sus datos; y cómo entra el agente nombra el usuario del agente, distinto del de la persona que valida

#### MODIFIED — La entrevista fija cómo se prueba el proyecto

- GIVEN una init con código cuyo `package.json` tiene los scripts `test` (`vitest run`) y `e2e` (`playwright test`), y un CI que ejecuta `npm test`
- WHEN genera `operations.md`
- REMOVED THEN `## Testing` propone las suites `unit` · `npm test` y `e2e` · `npm run e2e`, el gate de cierre y el de merge con esos comandos, y cada duración como `pendiente`
- THEN `## Testing` propone las suites `` `unit` · `npm test` · pendiente · pendiente `` y `` `e2e` · `npm run e2e` · pendiente · E2E ``, el gate de cierre y el de merge con esos comandos, y cada duración como `pendiente`
- AND el nivel de `unit` queda `pendiente` porque ni su config ni su código dicen qué arranca, y el dev-lead lo dice; `e2e` es E2E porque corre con Playwright
- AND propone «Sin filtro» con los manifiestos, lockfiles y configs que existen (`package.json`, `package-lock.json`, `vitest.config.ts`, `playwright.config.ts`) y las carpetas de helpers comunes de los tests que encuentre; «Lint» con el lint o el formato del pre-commit o de los scripts (`npm run lint`), o `ninguno`; y «CI de la base» con el pipeline encontrado (`.github/workflows/ci.yml`) y `gh run list --workflow ci.yml --branch develop -L 1 --json conclusion,headSha`, o `ninguna`
- AND con un `playwright.config.ts` sin `outputDir`, «Temporales» propone `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`, sin editar la config ni añadir filas al roadmap; una suite cuyo sitio no fijan ni su config ni el valor por defecto de su runner sale como `no declarado`, sin propuesta
- AND sin código, pregunta «¿Cómo se prueba?» con la recomendación que sale del stack; con «no sé», cada campo sin respuesta queda `no declarado`

### Capacidad: `migration`

#### ADDED — La migración a v3.0.0 propone el nivel de cada suite, «Sin filtro», «Lint» y «CI de la base»

- GIVEN un proyecto en 2.3.4 cuyo `tech-stack.md` §Testing declara las suites `backend` · `dotnet test` · ~13 min y `e2e` · `npx playwright test` · ~3 min, un `.husky/pre-commit` que corre `lint-staged`, un `azure-pipelines.yml`, y el dev-lead presente
- WHEN la migración llega a su paso 2
- THEN la tabla propone `## Testing` con cada suite y su nivel (`backend` · `dotnet test` · ~13 min · `pendiente`, porque no se ve si arranca el host; `e2e` · `npx playwright test` · ~3 min · E2E), «Sin filtro» con los `*.csproj`, `Directory.Build.props`, `package.json` y lockfiles que existan, «Lint» `lint-staged`, al editar y en el pre-commit, y «CI de la base» `azure-pipelines.yml` · `sin orden de lectura`
- AND no escribe nada antes del «sí»

#### MODIFIED — La migración a v3.0.0 avisa de un gate que encadena comandos

- GIVEN un proyecto 2.x cuyo §Testing declara `- **Gate de merge**: pnpm lint && pnpm test`
- WHEN acaba la migración a v3.0.0
- THEN el informe dice `Gate que encadena comandos: «pnpm lint && pnpm test» — sdd merge --verify ya no lo admite; hazlo una tarea de moon o un script de package.json`
- AND la línea del gate no cambia, el paso no tiene gate y no frena el marcador
- AND con `||`, `;`, `|`, `>` o `<` fuera de comillas, igual; con `$`, `%…%` o `~`, el informe dice `Gate con variables: «<línea>» — sdd merge --verify no las expande; ponlas en la tarea de moon o en el script`
- AND sin «Gate de merge» se lee «Gate de cierre»; «Lo afectado» no se lee; sin ningún gate que avisar, el paso se salta y lo dice
- AND con un «Gate de cierre» `moon run :test :lint`, el informe dice también `Gate con lint: «moon run :test :lint» — el lint va en «Lint», al editar y en el pre-commit; sácalo del gate`, sin tocar la línea; una tarea de typecheck o de build no avisa

### Capacidad: `feature-flow`

#### MODIFIED — Cada task del plan verifica solo sus superficies

- GIVEN una spec aprobada cuyo cambio toca BD, backend y frontend, y un proyecto con una suite de BD distinta de la de frontend
- WHEN se escribe el plan
- THEN cada task declara sus superficies (BD · backend · frontend · tooling · docs) y una verificación con los comandos de esas superficies y ninguno más
- AND la suite de BD solo aparece en las tasks cuyas superficies incluyen BD (migraciones, persistencia o dialecto)
- AND con «Suites» `unit` · `dotnet test Api.UnitTests` · ~20 s · unitario y `api` · `dotnet test Api.IntegrationTests` · ~1 min · integración, una task que cambia `Domain/Pricing.cs` sin escribir tests de integración verifica con `unit`, y `api` lo corre el gate de cierre si `--affected` lo marca; una task que escribe `Api.IntegrationTests/PeopleTests.cs` corre también ese fichero

## Topes de palabras

Medido con el conteo de `cli/test/kit/word-budget.test.ts` (tope × 1,25), 2026-10-29. Ningún tope sube.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-archive` SKILL.md / total | 4245 / 4900 · 8981 / 10000 | 655 · 1019 | sin cambio |
| `sdd-verify` SKILL.md / total | 3188 / 3825 · 9256 / 11400 | 637 · 2144 | sin cambio |
| `sdd-start-feature` SKILL.md / total | 1967 / 2395 · 11440 / 14152 | 428 · 2712 | sin cambio |
| `sdd-worktrees` SKILL.md | 1426 / 1625 | 199 | sin cambio |
| `sdd-propose` SKILL.md / total | 5349 / 6562 · 6893 / 8500 | 1213 · 1607 | sin cambio |
| `sdd-init` SKILL.md / total | 2496 / 3125 · 3093 / 3875 | 629 · 782 | sin cambio |
| `sdd-templates` total | 15770 / 19650 | 3880 | sin cambio |
| kit entero | 93178 / 114160 | 20982 | sin cambio |

## Enmiendas

- 2026-10-29 — Previsión de coste de la decisión 21: de ~11 $ con tope 15 $ a ~17 $ con tope 22 $ — el plan contó ~0,70 $ por sujeto de `sdd-archive`, no 0,31 $ — aprobada: opción «~17 $, tope 22 $»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-29 | aprobada (opción «Apruebo») |

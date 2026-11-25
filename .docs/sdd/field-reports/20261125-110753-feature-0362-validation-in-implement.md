---
kit_version: 3.0.4
lane: feature
id: 20261125-110753-feature-0362-validation-in-implement
task: 0362
mode: full
date: 2026-11-25
---

# Ticket para el kit — feature 0362: mover una fase entre skills dejó seis reglas y anclas sin dueño que solo cazó la revisión final

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo (`validation.mode: field`), Task 8 y cierre
- Skills del kit usadas: `sdd-implement`, `sdd-implement-native`, `sdd-validate`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `sdd-feedback`, `sdd-agent-writing`
- Proyecto: el propio kit (texto de skills, baterías de sujetos headless, un test pequeño de Vitest)
- Modelo del hilo: Sonnet 5.5, effort medium
- Modelos de los subagentes: Opus 5.5 (eje Spec, re-revisión) y Sonnet 5.5 (eje Código); sujetos de las baterías en Sonnet 5.5 salvo un escenario de Opus
- Coste en reloj: 4,56 h frente a 3 h estimadas (+52 %)
- Coste en tokens: 189 M del hilo y 16,4 M de subagentes (sesión 56,35 $); sujetos de las baterías ~92,4 $ frente a ~86 $ previstos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Al mover una fase de una skill a otra no viajaron sus reglas ni sus anclas, y ningún chequeo lo vio antes de la revisión final

- **Qué pasó**: la validación pasó del paso 1 de `sdd-archive` a la skill nueva `sdd-validate`. La revisión final devolvió 6 Important del eje Código y 10 del eje Spec, casi todos del mismo tipo: tres reglas del paso viejo no se mudaron (la decisión del dev-lead se pregunta sola, las reglas de la validación manual, la vigilancia de silencio de los implementadores), tres referencias «skill, sección» quedaron colgando, y cuatro textos vivos seguían diciendo lo contrario (la receta del merge mandaba arreglar el rojo de la rama en el cierre, `final-review-check.md` despachaba la revisión final, `sdd-verify` conservaba el disparador retirado). Con el gate verde (3/3 tareas, 2591 tests) y las baterías en 2/2. La pasada de fix y la re-revisión Opus encontraron además 4 Important nuevos metidos por la propia pasada.
- **Fuente**: `.docs/sdd/changes/20261124-155700-feature-0362-validation-in-implement/tasks.md` líneas `Revisión final:`, `Pasada de fix:` y `Re-revisión:`; `.temp` del ledger no se versiona, los `Final:` están en `## Rulings` del mismo fichero; `git log --oneline 8b0be17b5..b9f3b3961^` en la rama; `.docs/sdd/changes/20261124-155700-feature-0362-validation-in-implement/walkthrough.md` §3 y §4.2
- **Dónde en el kit**: `skills/sdd-plan-writing/SKILL.md` (cómo se escribe una task que mueve texto), `skills/sdd-verify/references/closing-the-review.md` (único lugar donde se cazó) y `cli/test/kit/skills.test.ts` (comprueba enlaces de fichero, no referencias «skill, sección»)
- **Por qué el kit no lo evitó**: las tasks 4 y 6 del plan decían qué skill y qué fichero cambiar, no qué reglas del texto viejo debían mudarse o borrarse; el test de enlaces comprueba rutas, no anclas de sección entre skills ni que una regla que existía en el paso viejo siga existiendo en algún sitio. La regla sobre una skill nueva («una pieza entra, otra sale») exige saldo de palabras, no de reglas.
- **Coste**: ~1 h de hilo y ~5 $ de subagentes (re-revisión Opus 0,9 M tokens, ejes 4,7 M y 6,1 M) más dos commits de arreglo; respaldado por `walkthrough.md` §2 y los commits `a87ba5c50`, `640f28a83` (juntados después en el cierre: ver `tasks.md`)
- **Propuesta**: (a) la task de un plan que mueve un paso o una sección entre skills lista, antes de editar, las reglas del texto viejo con `git grep -n` de sus frases y de las anclas que otras skills le citan, y su destino (una línea cada una: «se muda a X» o «se borra porque Y»); (b) un test que recorra `skills/**` y compruebe que cada referencia de la forma «`skill`, «Sección»» resuelve a un encabezado o párrafo en negrita existente de esa skill
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una task de plan que mueve el paso 1 de una skill a otra, WHEN el plan se escribe, THEN la task trae la tabla «regla → destino» con las frases del paso viejo; y GIVEN una referencia «`sdd-implement`, «Every dispatch»» sin esa sección, WHEN corre `skills.test.ts`, THEN falla nombrando el fichero y la línea

### 2. Un molde de batería con la señal que se mide ya dentro dejó 27,7 $ de GREEN sin evidencia

- **Qué pasó**: los moldes de la batería nueva de `sdd-validate` heredaban del `subject.mjs` de `sdd-archive` la línea `Validación en campo:` en el borrador del walkthrough, y la columna «Esperado» de diez escenarios movidos seguía apuntando a `sdd-archive`. La primera tanda de 35 sujetos corrió y se leyó parcialmente antes de verlo; se descartó y se repitió con 32 sujetos (24,17 $).
- **Fuente**: `tests/validation-in-implement-green.md` (primer párrafo, «Campaña de la Task 8»); `.docs/sdd/changes/20261124-155700-feature-0362-validation-in-implement/tasks.md`, ruling de la Task 8 «la primera tanda GREEN (35 sujetos, 27,7 $) se descarta»
- **Dónde en el kit**: `tests/headless/battery.mjs` (`DRY_RUN=1` monta cada molde sin gastar, pero no avisa de qué señal ya trae) y `skills/sdd-agent-writing/references/skill-testing.md` (lo que se comprueba antes de lanzar una tanda)
- **Por qué el kit no lo evitó**: `DRY_RUN` valida que el molde se monta, no que el estado que construye contenga ya lo que la rúbrica mide; la lectura de la puerta (`battery.mjs run`) salió verde en la tanda contaminada
- **Coste**: 27,7 $ y ~40 min; respaldado por el mismo ruling del `tasks.md`
- **Propuesta**: que una fila de la batería pueda declarar un `Molde sin:` con una regex sobre el estado montado (`file: <fichero> !/<regex>/`), que `DRY_RUN=1` comprueba, para que un molde con la señal ya dentro falle antes de gastar
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un escenario con `Molde sin: walkthrough.md !/Validación en campo:/` y un molde que escribe esa línea, WHEN corre `DRY_RUN=1 battery.mjs run`, THEN sale con código distinto de 0 y nombra el escenario sin lanzar ningún sujeto

### 3. Tres paros que `delegate` no admite y una regla que se perdió salieron en GREEN, no en el texto

- **Qué pasó**: con el texto de la skill nueva, tres sujetos pararon a preguntar si abrían la task de arreglo o lanzaban la revisión («¿Lanzo la revisión final ahora?», «¿Arranco la task de arreglo?», «¿Abro la Task 3 en `sdd-implement`?») y un cuarto mezcló la decisión del dev-lead con el guion. Una ronda de REFACTOR (7 sujetos, 7,88 $) arregló los cuatro con dos «sin preguntar» y una frase en `validation-modes.md`.
- **Fuente**: `tests/validation-in-implement-green.md` §«REFACTOR»; `skills/sdd-validate/SKILL.md` líneas 20 y 28; commit `f4763ee51` en la rama
- **Dónde en el kit**: `skills/sdd-propose/references/control-profiles.md` (tabla de paradas por perfil: no dice que abrir una task de arreglo o lanzar una revisión no son paradas de `delegate`) y `skills/sdd-validate/SKILL.md` pasos 3 y «A failure goes back»
- **Por qué el kit no lo evitó**: la tabla de paradas enumera lo que para, no lo que no para; cada skill nueva tiene que repetir «sin preguntar» donde hay una decisión de método
- **Coste**: 7,88 $ de REFACTOR más un commit; respaldado por `tests/validation-in-implement-green.md`
- **Propuesta**: una línea en la tabla de `control-profiles.md`, «Lo que no para en `delegate`: abrir la task de un arreglo, lanzar una revisión, despachar un subagente de método», para que las skills nuevas la citen en vez de repetirla
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `sdd-validate` sin la frase «without asking» en sus pasos 3 y de vuelta, WHEN corren `vf2` y `vf3` con un sujeto en `delegate`, THEN no pregunta antes de abrir la task ni de lanzar los ejes, porque lo dice la tabla de `control-profiles.md`

### 4. La reentrada del cierre tras un rojo posterior al commit de cierre choca con la regla de no squashear un merge

- **Qué pasó**: el requisito de la spec pedía que, al volver del rojo, `sdd-archive` «rehaga el commit de cierre y repita el sync». La re-revisión vio que el arreglo va encima del merge de sync, y rehacer el commit de cierre obligaría a aplastar un rango con un merge dentro, lo que el paso 6 prohíbe. Se reescribió como «el cierre reinicia desde «History» y repite el sync» sin que ninguna batería lo mida (`av2` solo mide la devolución).
- **Fuente**: `skills/sdd-archive/references/merge-recipe.md` línea 22; `.docs/sdd/changes/20261124-155700-feature-0362-validation-in-implement/spec.md` líneas 55 (decisión 15) y 617-622; `tasks.md` `Re-revisión:`
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md` «A red suite» y `skills/sdd-implement/references/commit-milestones.md` (guardas del squash)
- **Por qué el kit no lo evitó**: la spec escribió la reentrada sin comprobarla contra las guardas de `commit-milestones.md`
- **Coste**: ~15 min de hilo y un Important de la re-revisión; respaldado por `tasks.md`
- **Propuesta**: un escenario `av3` que devuelva un rojo tras el commit de cierre y compruebe el camino de vuelta contra el historial con un merge de sync dentro
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una rama con commit de cierre y merge de sync y un test rojo de la rama, WHEN el trabajo vuelve de `sdd-implement`, THEN el cierre no squashea un rango con merge y repite el sync con el `--verified-at` nuevo

## Lo que hice por iniciativa propia

- Excluí `dist/` del paquete de revisión de la revisión final (lo regenera `kit:build` desde `skills/`), lo que lo dejó en 1796 líneas en vez de 1879; funcionó, pero el recorte fue pequeño porque el diff de `dist/` casi duplica el de `skills/`.
- La ronda de REFACTOR cubrió también `v1a` y `g3`, que la tarea no nombraba, porque su contraejemplo era el mismo paro; funcionó (3/3).
- Pasé el gate otra vez con `--base <sha de la última pasada verde>` tras la pasada de fix, y los controles y el humo con el kit de la rama; funcionó.

## Funcionó, no tocar

- Leer las rúbricas con `grep` sobre `tools.txt` y `texts.txt` de cada sujeto (órdenes ejecutadas, mensaje final) en vez de leer cada informe entero.
- La puerta de `battery.mjs run` antes de leer la conducta, y `COST_CAP` por campaña.
- La re-revisión única con Opus tras la pasada de fix: cazó 4 Important que la pasada metió.

## Menores

- `wc -w` sobre `dist/` y el contador de `word-budget.test.ts` dan cifras distintas (el revisor midió 2674 donde el test da 2675) — `cli/test/kit/word-budget.test.ts`
- Un `Edit` tras un cambio de disco exige `Read` antes y el aviso del harness no dice qué cambió — no localizado (harness)
- Un hook del entorno rechaza un heredoc en `Bash` y manda a `Write`; el mensaje es claro pero no está en el kit — no localizado

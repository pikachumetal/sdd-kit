---
kit_version: 3.0.2
lane: feature
id: 20261118-231951-feature-0357-launch-prompt-open-items
task: 0357
mode: full
date: 2026-11-18
---

# Ticket para el kit — feature 0357: el prompt de arranque separa lo decidido de lo abierto

## Contexto

- Carril y modo: feature full, perfil `pair` hasta el plan y `delegate` desde la ejecución
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-parallel-agents`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en Node, baterías de sujetos headless); una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-opus-5-5 (revisor de dominio, eje Spec, re-revisión) y claude-sonnet-5-5 (revisores de spec, eje Código, revisión de enmienda); sujetos de batería en sonnet
- Coste en reloj: 0,92 h frente a 1,5 h estimadas
- Coste en tokens: 40.367.979 del hilo y 6.022.626 de subagentes; 18,32 $ de sesión y 2,77 $ en 23 sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La spec que edita una plantilla sale sin «Topes de palabras» aunque su skill tiene tope

- **Qué pasó**: la spec editaba `skills/sdd-templates/templates/launch-prompt-template.md`. El repaso de coherencia buscó tests que leyeran la plantilla (`git grep launch-prompt -- cli/test tests/headless`, vacío) y no el test que suma la skill entera. Dos rondas de review de spec y la revisión de la enmienda tampoco lo vieron. El pre-commit paró el commit de la Task 2, ya con el GREEN hecho: «mide 17648 y el tope es 17460: recorta, o sube el tope con la decisión del dev-lead escrita en la spec».
- **Fuente**: `cli/test/kit/word-budget.test.ts` (`'sdd-templates': { skillMd: 1614, total: 17460 }`); salida de `moon run cli:typecheck cli:test kit:roadmap kit:own kit:skill-size kit:copies` en PowerShell; spec y walkthrough de la 0357, «Enmiendas» y §5.
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md` (lo que se retira o cambia de forma) y la sección «Topes de palabras» de `skills/sdd-templates/templates/spec-template.md`.
- **Por qué el kit no lo evitó**: la regla existía (la plantilla de spec pide la tabla si un test pone tope a un fichero que la spec edita) y no la apliqué. «Un fichero que edita» no se lee como «una plantilla que cuenta para el total de su skill».
- **Coste**: una parada del dev-lead con una enmienda, y un desvío de conversación cuando el dev-lead creía retirados esos topes (walkthrough de la 0357, §3).
- **Propuesta**: que el repaso de coherencia corra `moon run cli:test -- word-budget` (o el conteo del test) sobre una copia con el cambio previsto cuando la spec edita algo bajo `skills/`, y que la tabla salga de esa medida. Si no, una línea en la plantilla de spec: «el total de una skill cuenta sus `references/` y sus plantillas».
- **Verificada**: sí — contrastado con el fallo del pre-commit de esta sesión
- **Criterio de aceptación**: GIVEN una spec que edita una plantilla de `sdd-templates` y deja la skill por encima de su `total` en `word-budget.test.ts` · WHEN el agente hace el repaso de coherencia · THEN la spec lleva «Topes de palabras» con la fila de `sdd-templates` antes del gate.

### 2. Una petición que pide recomendación y prompt no llega a `sdd-explore`

- **Qué pasó**: con «Quiero subir el mínimo de node en los engines de package.json y no sé si a 22 o a 24: recomiéndame tú y dame el prompt para hacerlo en otro worktree.», 0 de 6 sujetos entraron por `sdd-explore`: 3 sin cargar ninguna skill y 3 por `sdd-roadmap`. El control `e2` también falla 1 de 2 en la puerta (un sujeto sin skill) con el kit de `develop` y con el de la rama. Con «Estoy pensando en subir… ¿Rompe algo? Recomiéndame una y dame el prompt…» entraron 4 de 4.
- **Fuente**: `.docs/sdd/changes/20261118-215209-feature-0357-launch-prompt-open-items/{red,green,green2,ctl-develop,green3,red-e4b}/out/*.tools.txt` (primera línea `>>> Skill`); `tests/sdd-explore-0357-green.md`.
- **Dónde en el kit**: `skills/using-sdd/SKILL.md`, tabla de puertas (una pregunta frente a un cambio), y la descripción de `skills/sdd-explore/SKILL.md`.
- **Por qué el kit no lo evitó**: la tabla clasifica por la forma de pregunta («¿se puede…?»); una orden que pide recomendación y prompt no tiene fila. Que un sujeto no cargue ninguna skill es otro fallo, sin causa localizada.
- **Coste**: una enmienda con parada del dev-lead y 6 sujetos que no midieron la conducta: 0,61 $ (`red` e4 0,20 $, `green` e4 0,24 $ y `green2` 0,17 $, de los acumulados de `battery.mjs run` en los logs de la tanda).
- **Propuesta**: una fila en la tabla de puertas: «recomiéndame y dame el prompt» sin pedir el cambio → `sdd-explore`. Para los sujetos sin skill, medir la puerta de `e2` n=6 con el kit de `develop` antes de proponer nada.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN el molde `salas` · WHEN la petición original de `e4` · THEN el primer `Skill` de `tools.txt` es `sdd-kit:sdd-explore` en 2 de 2.

## Lo que hice por iniciativa propia

- Coordiné por `SendMessage` con la sesión de la 0356, que llevaba la otra mitad (qué hace la entrevista con lo abierto): ella confirmó que su regla trataría la sección «Abierto» y nombró la sección igual. Funcionó: la 0357 no tocó la entrevista.
- Lancé el control que falla con el kit de `develop` (`ctl-develop`) para separar el ruido de la puerta de una regresión. Funcionó: lo clasificó en 2 sujetos.

## Funcionó, no tocar

- Las dos rondas de review de spec: el revisor de dominio en Opus cazó que el criterio «dónde está escrito» dejaba pasar como del dev-lead lo que un agente escribió en un brief.
- El techo de sujetos de la previsión de coste paró dos tandas que la spec no preveía: obligó a escribirlas antes de gastar.
- El RED con el kit de la apertura enseñó la conducta con claridad: un sujeto llegó a escribir «Esta decisión es una propuesta del dev-lead» sobre una idea suya.

## Menores

- El RED de `sdd-roadmap` (`e4-2`) metió la recomendación del agente en «Decisiones ya tomadas» del brief de una fila nueva («24 sobre 22»): la misma mezcla en el brief, que la 0357 dejó fuera — `skills/sdd-roadmap/SKILL.md` («Something concrete»)
- Un sujeto GREEN usó el origen nuevo `agente por delegación` en un hecho comprobado sin delegación (`e2-1`), y otro (`m1-1`) sacó un canal supuesto sin «Abierto»: un caso cada uno — `skills/sdd-templates/templates/launch-prompt-template.md`
- La línea base de `sdd-worktrees` dio rojo por un test que `develop` ya había arreglado después de la base de la rama: ~5 min en repetirlo en `develop` — `skills/sdd-worktrees/SKILL.md` paso 3
- `sdd merge --push` falló una vez con «merge: git merge falló sin conflictos. fatal: stash failed» con el checkout de `develop` limpio; el reintento pasó — `cli/` (`sdd merge`), no localizado
- Los ejes de la revisión final salieron uno tras otro porque la spec, aprobada en `pair`, no llevaba la línea «Política de modelos» y el perfil pasó a `delegate` después — `skills/sdd-propose/references/control-profiles.md`

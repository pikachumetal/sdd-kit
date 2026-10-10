---
kit_version: 2.3.3
superpowers_version: 7.0.0 (en la caché; no cargó en la sesión)
lane: feature
id: 20261010-222401-feature-0147-implement-fork
task: 0147
mode: full
date: 2026-10-11
---

# Ticket para el kit — feature 0147: `sdd-implement`, fork de la implementación con el decálogo de calidad

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling` (leída), `sdd-rubber-duck` (leída), `sdd-start-feature` (pasos 6-7, el 6 desde su propio texto), `sdd-end-feature`, `sdd-feedback`; `brainstorming`, `writing-plans`, `executing-plans` y `subagent-driven-development` de superpowers 7.0.0, leídas desde la caché
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, Pester y Vitest), una persona
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: revisor final Opus; 27 sujetos válidos Sonnet en la batería nueva
- Coste en reloj: ~2,3 h de spec y plan + ~2,5 h de implementación y cierre, frente a 5 h estimadas para implementar ([walkthrough](../specs/20261010-174401-feature-0147-implement-fork/walkthrough.md) §2)
- Coste en tokens: 145 M (hilo 142 M + revisor final 3,1 M), 44,34 $; sujetos ~16,7 $ válidos + ~3 $ invalidados

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Con superpowers sin cargar, el kit tampoco carga y la sesión sigue sin avisar

- **Qué pasó**: la sesión arrancó en el worktree de la feature; `Skill superpowers:brainstorming` devolvió «Unknown skill … 1 plugin did not load in this session (unmet dependency)». El plugin que no cargó era el kit (`dependencies` en `plugin.json`): no hubo tipos `sdd-kit:effort-*` en toda la sesión, y `brainstorming`, `writing-plans`, `executing-plans` y `subagent-driven-development` se leyeron a mano de la caché 7.0.0. Las skills del kit se siguieron leyendo `skills/<nombre>/SKILL.md` del working tree, que salvó el flujo.
- **Dónde en el kit**: `CLAUDE.md` regla 1 de este repo y `Start-KitSession.ps1` / `.claude/hooks/Test-KitSessionSource.ps1` (el aviso del arranque); en los proyectos, el paso 7 de la preparación de `sdd-implement` (tipos de effort).
- **Por qué el kit no lo evitó**: el hook de `SessionStart` avisa si la sesión no salió del script, no si superpowers falta y el kit no cargó; nada lo detectó hasta el primer `Skill`.
- **Coste**: todos los despachos sin effort declarado (ruling del plan, decisión 3); ~5 min de diagnóstico. Sin respaldo de otro coste.
- **Propuesta**: el hook del repo (y el `sdd hook session-start` de los proyectos) comprueba que superpowers está cargado mientras el kit dependa de él, y lo dice con la orden para instalarlo.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una sesión de este repo sin superpowers instalado WHEN arranca THEN el primer mensaje del hook dice que el kit no cargará por la dependencia y cómo instalarla.

### 2. El molde de una batería nueva se lanzó con la suite de su base en rojo

- **Qué pasó**: el primer RED de `tests/batteries/sdd-implement/` salió con tres defectos del molde (tests de la base en rojo en `r1`-`r3`, un THEN de la spec sin datos que llevó `r4` y `h2` a la acción update, una «Verificación» mal sustituida en la 0014). Tres sujetos inválidos y dos relanzamientos.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Comprobación previa de cada escenario» (siete preguntas).
- **Por qué el kit no lo evitó**: ninguna de las siete preguntas pide pasar la suite del molde montado (en seco) y ver que solo fallan los RED del escenario; la (2) mira lo preexistente en el commit base, no que esté en verde. La comprobé con `DRY_RUN=1` solo después del primer RED.
- **Coste**: ~3 $ en sujetos invalidados y ~20 min ([walkthrough](../specs/20261010-174401-feature-0147-implement-fork/walkthrough.md) §2 y §3; [RED](../../../tests/sdd-implement-red.md), «Molde»).
- **Propuesta**: octava pregunta: «con `DRY_RUN=1`, ¿la suite del molde montado sale en verde salvo los RED que el escenario planta, y cada THEN del molde tiene de dónde sacar sus datos?».
- **Verificada**: sí — tras corregir el molde, la comprobación en seco (`node --test` en cada repo de `runs/dry/`) mostró solo los RED esperados y el relanzamiento midió lo que tocaba.
- **Criterio de aceptación**: GIVEN una batería nueva cuyo molde rompe un test de la base WHEN se aplica la comprobación previa THEN se ve antes del primer sujeto.

### 3. `tools.txt` no guarda el prompt de un despacho `Agent`

- **Qué pasó**: para medir si el encargo del implementador llevaba el decálogo en `h2` busqué en `h2-1.tools.txt` y no salía: lo di por fallo y escribí un REFACTOR de la skill. El stream crudo (`runs/green/h2-1.jsonl`) mostró después que 2/2 despachos lo llevaban; el de la ronda 0 ya estaba sobrescrito y quedó «no medible».
- **Dónde en el kit**: `tests/headless/extract.mjs` (`tools`), y `tech-stack.md`, «Baterías por skill».
- **Por qué el kit no lo evitó**: el extracto guarda la descripción del `Agent`, no su prompt, y nada lo decía; el aprendizaje ya está en `tech-stack.md` (0147).
- **Coste**: un REFACTOR por una lectura falsa y una medida perdida (~0,5 h, [GREEN](../../../tests/sdd-implement-green.md), Task 3).
- **Propuesta**: `extract.mjs tools` escribe, tras `>>> Agent`, las cabeceras `##` del prompt del despacho (o sus primeras N líneas).
- **Verificada**: sí — contrastado: el prompt solo está en el `.jsonl`.
- **Criterio de aceptación**: GIVEN un sujeto que despacha un `Agent` con `## Quality decalogue` en el prompt WHEN se genera `tools.txt` THEN la sección aparece bajo su línea `>>> Agent`.

### 4. Un traspaso de una línea a otra skill no se sigue

- **Qué pasó**: al mover el paso 6 de `sdd-start-feature` a `sdd-implement`, el paso quedó en «invoca `sdd-implement` con `Skill`: …»; en `u1`/`u2`, 0 de 4 sujetos la invocaron y resolvieron el desvío desde `sdd-start-feature` sin la acción update. Con «lo primero de este paso… no implementes nada desde aquí» y su red flag, 4 de 4.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 (ya arreglado en la 0147); como regla general, la futura `sdd-agent-writing` (0151).
- **Por qué el kit no lo evitó**: no hay regla de forma para un traspaso entre skills; el veredicto de la puerta de la batería salió verde porque la primera skill era la correcta.
- **Coste**: una ronda de REFACTOR, ~2,7 $ y ~15 min ([GREEN](../../../tests/sdd-implement-green.md), Task 2).
- **Propuesta**: en `sdd-agent-writing`: un paso que entrega a otra skill dice que es lo primero del paso y prohíbe seguir desde él; y la batería de una skill que recibe un traspaso mide que se invoca, no solo la primera puerta.
- **Verificada**: sí — RED 0/4, GREEN 4/4 en `tests/batteries/sdd-implement/` (`u1`, `u2`).
- **Criterio de aceptación**: GIVEN una skill A cuyo paso N entrega a la skill B WHEN un sujeto entra por «Invoca A y sigue: paso N» THEN el stream muestra `>>> Skill: B` antes de cualquier cambio.

## Lo que hice por iniciativa propia

- **Pedí al dev-lead un RED más duro antes de quitar una regla que él había decidido** (el decálogo, `r1` limpio): con `r1b` (task más grande sobre código enredado) falló 2/2 y la regla se escribió. Candidato a la batería del método: un RED limpio de una regla decidida por el dev-lead se repite con más presión antes de sacarla.
- **Arreglé siete minors en la pasada de fix de la revisión final**, contra la regla de Native (los minors van al ledger), porque cada uno era una línea; registrado como ruling. Si se repite, la regla podría admitir los de una línea con su test.

## Funcionó, no tocar

- Dar el paso 6 a una skill propia con su batería: el revisor final comparó regla a regla y no encontró ninguna perdida salvo la del encargo en las rondas de fix.
- El freno «fichero de la task cambiado en la base» con `roadmap.md` excluido: la base trajo el patch 0167 a mitad y el cruce dijo exactamente qué tasks se tocaban y cuáles no.
- La validación en campo: cerró sin parar, con el smoke por THEN distinguiendo `ejecución real`, `suite` y `no probado`.

## Menores

- Editar `subject.sh` con una tanda en marcha mató a un sujeto («unexpected EOF»); ya en `tech-stack.md` — no localizado en el kit antes.
- El gate falló en `cli:test-min` porque proto no tenía Node 22.18.0 (`proto install node 22.18.0`) — `tech-stack.md` no lo declara como requisito del gate.
- El techo de palabras que fijé (9.000) costó cuatro pasadas de recorte de ~5 min — Art. I, topes.
- `sdd-propose` paso 4 citaba la «Spec Self-Review» de `brainstorming`, que la 7.0.0 ya no tiene; lo arregló el patch 0167 en paralelo.

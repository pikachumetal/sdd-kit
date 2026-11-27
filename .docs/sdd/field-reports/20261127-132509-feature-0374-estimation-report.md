---
kit_version: 3.0.5
lane: feature
id: 20261127-132509-feature-0374-estimation-report
task: 0374
mode: full
date: 2026-11-27
---

# Ticket para el kit — feature 0374: un verbo de la CLI y una edición de skill, cerrados sin parar salvo en una pregunta técnica

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo.
- Skills del kit usadas: `sdd-propose`, `sdd-spec-writing`, `sdd-grilling`, `sdd-spec-approval`, `sdd-spec-review`, `sdd-parallel-agents`, `sdd-plan-writing`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-validate`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`.
- Proyecto: el repo del kit (CLI en TypeScript con Vitest y skills con baterías headless), una persona.
- Modelo del hilo: Opus 5.5, effort no registrado.
- Modelos de los subagentes: Sonnet 5.5 (revisores de la spec y eje Código), Opus 5.5 (ejes Spec y Arquitectura y re-revisión); sujetos de la batería en Sonnet.
- Coste en reloj: 1,14 h frente a 2,5 h estimadas (−54 %).
- Coste en tokens: hilo 61.310.290; subagentes 6.774.310 en 7 despachos; sesión 24,78 $; sujetos 1,58 $ en 7.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una pregunta técnica fuera de «Abierto» paró al dev-lead

- **Qué pasó**: el prompt de arranque traía tres puntos en «Abierto», los tres de método: atribución, versión del kit y medidas. Los pregunté uno por turno, como pide la skill, y el dev-lead respondió «1» a los tres. Después añadí por mi cuenta una cuarta pregunta, que no venía en «Abierto»: cómo filtra el verbo por release. El dev-lead contestó: «ni idea macho estas cosas son tecnicas tuyas tu tienes qu essaber responderlas».
- **Fuente**: «Decisiones tomadas con el dev-lead» y decisión 2 de `.docs/sdd/changes/20261127-120333-feature-0374-estimation-report/spec.md`, con la frase literal.
- **Dónde en el kit**: `skills/sdd-spec-writing/SKILL.md`, «First: What Do You Actually Know?». Separa la pila «menor» («an approach the project decides») de la «del dev-lead» («the answer changes the spec, the approach or the tasks»).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. El filtro por release es un enfoque que fija el proyecto, porque `sdd-retro` se invoca con `release <version>`. Pero «cambia el enfoque» también encaja, y la frontera entre las dos pilas no dice qué hacer con una decisión técnica que cambia la interfaz del verbo.
- **Coste**: un turno del dev-lead y su enfado; la cifra en minutos va «sin respaldo».
- **Propuesta**: en la pila del dev-lead, un punto que no viene en «Abierto» y no cambia lo que ve el usuario del producto va a ✋ con su porqué, no a una pregunta. «Cambia la interfaz de un verbo» no basta para preguntarlo.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un prompt de arranque con «Abierto» de tres puntos y un cuarto punto técnico que el agente descubre (un flag de la CLI) WHEN el agente escribe su mensaje de pilas THEN el cuarto va a «menor» o a ✋ con su porqué y no hay pregunta sobre él.

### 2. El primer RED de la batería se perdió por un molde que daba otra salida

- **Qué pasó**: el molde nuevo `corte-estimacion` reescribía el walkthrough de la 0040 a partir del literal base, sin la sustitución que el molde `corte` le aplica («Exportar salas a CSV»). El sujeto del RED vio que la fila del roadmap y el walkthrough no casaban y paró a preguntar. Nunca llegó a la estimación.
- **Fuente**: `red-molde-roto/out/r7-1.texts.txt` de la carpeta de la spec; `tests/batteries/sdd-retro/subject.mjs`, `estimateMold`.
- **Dónde en el kit**: `.docs/sdd/steering/operations.md`, «Comprobación previa de cada escenario», punto (6): «¿el molde ofrece al sujeto una salida … antes del punto medido?». También el `DRY_RUN=1` de `tests/headless/battery.mjs`, que evalúa las filas `mold:` antes de lanzar.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. No corrí `DRY_RUN=1` ni escribí una fila `mold:` para el molde nuevo, y la comprobación previa es prosa que nadie ejecuta.
- **Coste**: 0,16 $ y un relanzamiento (`red-molde-roto: 1 sujetos · 0.16 $` en el log de la campaña); unos 8 min de reloj, sin respaldo.
- **Propuesta**: que `battery.mjs run` rechace un escenario con un molde que no aparece en ninguna corrida anterior (`state.txt`) sin una fila `mold:` en la rúbrica. Así la comprobación previa del punto (6) se vuelve una orden que se ejecuta.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una batería con un molde nuevo y sin fila `mold:` WHEN se lanza `battery.mjs run` THEN sale con código distinto de 0 y nombra el molde, sin lanzar sujetos.

### 3. Un `node -e` entre comillas dobles de Git Bash rompió literales dos veces

- **Qué pasó**: dos ediciones de código con `node -e "…"` en Git Bash perdieron las barras y las comillas invertidas. Una dejó en `report.ts` `throw new DomainError()` sin mensaje (`tsc` → `error TS1109: Expression expected.`). La otra metió un salto de línea literal dentro de una cadena de un test. Las dos se arreglaron con Edit.
- **Fuente**: la salida de `pnpm exec tsc --noEmit -p .` en la sesión (`src/estimation/report.ts(150,59): error TS1109`); `Retro:` del walkthrough de la 0374.
- **Dónde en el kit**: `.docs/sdd/steering/operations.md:26` (el texto con escapes se escribe con las herramientas de edición) y `.claude/hooks/heredoc-guard.mjs`, que solo mira heredocs.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. El hook que la vuelve orden no ve un `node -e`. Es el tercer caso, tras la 0220 y la 0227 que cita esa línea.
- **Coste**: ~5 min, dos veces; sin respaldo.
- **Propuesta**: ampliar `heredoc-guard.mjs` para que bloquee un `node -e` o `node --eval` cuyo script lleve comillas invertidas o `\` y escriba ficheros (`writeFileSync`). Que remita a Edit o a un `.mjs` del scratchpad, como ya hice con éxito en esta sesión.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `node -e "require('fs').writeFileSync('a.ts', \`x\`)"` en Git Bash WHEN pasa por el hook THEN lo bloquea con el mensaje que da para el heredoc.

## Lo que hice por iniciativa propia

- Los briefs de los tres ejes de la revisión final y de la re-revisión llevaron la cabecera de restricciones, «How to review» y la frase del worktree, pegadas literales. El resto del brief se lo di como «lee `<ruta>/…-reviewer-prompt.md` y sigue su bloque», con los rellenos aparte. Los cuatro siguieron su plantilla, con el formato y los veredictos pedidos. Ahorra pegar ~2.000 palabras por eje; es candidato a forma permitida en `skills/sdd-verify/references/encargo-revision.md`.
- Las ediciones de varias líneas se hicieron con un `.mjs` del scratchpad que reemplaza literales y falla si no encuentra el ancla. Funcionó a la primera las dos veces.

## Funcionó, no tocar

- `sdd task done` rechazó un comando sin `--test-timeout` con un test `*.slow.test.ts` y dijo exactamente qué añadir.
- `sdd merge --push --verified-at` omitió el gate («desde e7bd6a704 solo cambian docs») y fusionó y publicó en un paso.
- La regla de «CI de la base» de `operations.md` resolvió un rojo de `develop` caído en la instalación de herramientas: `gh run rerun --failed` lo dejó en `success`.
- La segunda ronda de la review de spec cazó un Crítico falso (2.x en `docs/sdd/`) que el repaso con `git grep` en las migraciones refutó en un minuto.

## Menores

- Tras aceptar dos Críticos de la review escribí «no hay segunda ronda» y lo corregí en el mismo turno — `skills/sdd-spec-review/SKILL.md` §4.
- El pre-commit rechazó el primer commit de la Task 1 porque `dist/` no estaba reconstruido; `moon run kit:build` y repetir — ningún paso de `sdd-implement-native` lo recuerda en este repo, «no localizado».
- La campaña de sujetos acabó en 1,58 $ frente a 1,32 $ previstos (+0,26 $, 0,16 $ del molde roto), ya sin tandas por lanzar, así que no hubo parada — `.docs/sdd/steering/constitution.md` Art. I, previsión de coste.

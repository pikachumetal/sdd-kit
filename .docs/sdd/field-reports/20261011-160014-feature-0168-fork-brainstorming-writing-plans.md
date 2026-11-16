---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261011-160014-feature-0168-fork-brainstorming-writing-plans
task: 0168
mode: full
date: 2026-10-11
---

# Ticket para el kit — feature 0168: fork de brainstorming y writing-plans en referencias de sdd-propose

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native, validación en campo
- Skills del kit usadas: `sdd-init-brownfield` (migración a 2.3.4), `sdd-propose`, `sdd-grilling`, `sdd-rubber-duck`, `sdd-start-feature`, `sdd-implement`, `sdd-end-feature`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans` y `test-driven-development`
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (revisor de dominio de la spec y revisor final), Sonnet (revisor técnico de la spec y 33 sujetos headless)
- Coste en reloj: 2,3 h de implementación frente a 4 h estimadas; ~2 h antes, de entrevista, spec, review y plan
- Coste en tokens: hilo 156.046.409, subagentes 3.488.953; sesión 45,75 $ más 14,95 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Nueve sujetos no midieron nada porque el molde no llevaba al punto que se medía

- **Qué pasó**: los escenarios de una entrevista dependían de llegar a una decisión concreta en el primer turno, y 9 de 33 sujetos se quedaron antes. La petición pedía `--desde`/`--hasta` sobre un molde que solo guarda el día de la semana (el sujeto preguntó de dónde sale la fecha). Daba por hecho un estado que el molde no tenía (4 sujetos preguntaron de dónde sale). Quería 4 o más tasks, pero el sujeto contó 3 (2 sujetos). Y el cambio cumplía el predicado de lite, así que el sujeto preguntó el carril (2 sujetos). `DRY_RUN=1` pasó limpio en todos.
- **Dónde en el kit**: `tech-stack.md`, «Comprobación previa de cada escenario», y `tests/headless/` (`DRY_RUN`); lo roza la fila 0170 (a).
- **Por qué el kit no lo evitó**: la comprobación en seco recorre el montaje sin `claude -p`, y no puede ver si el primer turno llega a la decisión medida. La lista de comprobación previa no pregunta si la petición cierra todo lo que no se mide.
- **Coste**: 2,65 $ en sujetos invalidados (`tests/superpowers-fork-red.md`, «Invalidados por el molde»: 2,18 $; `tests/superpowers-fork-green.md`, Task 4: 0,47 $), dos subidas del techo de sujetos con parada al dev-lead (ledger, Task 4) y ~30 min de reloj, sin respaldo.
- **Propuesta**: una pregunta más en «Comprobación previa de cada escenario»: «¿qué tiene que decidir el sujeto antes de llegar a lo medido, y lo cierra la petición o el molde? (los datos que da por hechos, el recuento que dispara la regla, el carril)». Con un escenario de una entrevista, lanzar primero un único sujeto y leer dónde para antes de lanzar el resto.
- **Verificada**: sí — `red-molde/out/` y `green-molde/out/` de la carpeta de la spec, con la causa de cada uno.
- **Criterio de aceptación**: GIVEN un escenario cuya petición da por hecho un campo que el molde no guarda, WHEN se prepara la campaña con la comprobación previa, THEN la pregunta nueva lo señala antes del primer sujeto.

### 2. Un sujeto paró su servidor matando `node.exe` por nombre en la máquina de la campaña

- **Qué pasó**: con la regla nueva del boceto, el sujeto `sk-4` arrancó la app del molde y la paró con `pkill -f "src/server.mjs"; taskkill //F //FI "WINDOWTITLE eq *" //IM node.exe` (Git Bash), en la máquina del dev-lead, donde corrían la sesión, sus MCP y otros procesos de Node.
- **Dónde en el kit**: `tests/headless/lib.sh` (`subject_launch`) y `skills/sdd-grilling/SKILL.md`, regla del boceto.
- **Por qué el kit no lo evitó**: la regla de parar por PID o puerto vive solo en `sdd-implement` («Processes you start»), y una entrevista no la carga. El hook `deny-kill.mjs` de la feature 0036 existe, pero el lanzador de referencia no lo carga por defecto.
- **Coste**: no se vio daño en la sesión; el riesgo es matar procesos del dev-lead en cada campaña que arranque la app.
- **Propuesta**: (a) ya hecho en esta feature: `sdd-grilling` gana «stop what you started by its PID or port, never by name», sin GREEN propio. (b) Pendiente: `subject_launch` carga por defecto el `deny-kill.mjs` de la feature 0036 como hook `PreToolUse` del sujeto.
- **Verificada**: sí — `.docs/sdd/specs/20261011-130007-feature-0168-fork-brainstorming-writing-plans/green/out/sk-4.tools.txt`.
- **Criterio de aceptación**: GIVEN un sujeto headless lanzado con `tests/headless/run.sh`, WHEN intenta `taskkill //IM node.exe` o `pkill -f`, THEN el hook lo deniega y el sujeto no mata ningún proceso.

### 3. Toqué un fichero que la spec dejaba en «No entra» y lo registré como ruling

- **Qué pasó**: para que el README no contara `brainstorming` como invocada, cambié la frase de la prohibición de `sdd-explore`, que la spec aprobada dejaba en «No entra», y lo anoté en el ledger como `Ruling:`. La revisión final lo marcó como Important (trazabilidad y sin test), y hubo que parar al dev-lead para aprobar la enmienda ya en el cierre.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings», primer punto (ruling) frente al tercero (desvío, que incluye «No entra»).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. El ruling se define como «salir del plan sin cambiar la spec», y un cambio pequeño dentro de lo que la spec deja fuera se lee como salir del plan. La lista del desvío nombra «No entra», pero el punto del ruling no lleva contraejemplo (Art. II).
- **Coste**: una parada al dev-lead en el cierre y una enmienda a posteriori (`spec.md`, «Enmiendas», 2026-10-11, `sdd-explore`; Important 2 de la revisión final en el walkthrough).
- **Propuesta**: contraejemplo en el punto del ruling: «tocar un fichero que la spec nombra en "No entra" es un desvío, aunque el cambio sea de una frase».
- **Verificada**: sí — contrastado con `skills/sdd-implement/SKILL.md`, «Deviations and rulings».
- **Criterio de aceptación**: GIVEN una task cuya solución pide cambiar una línea de un fichero que la spec deja en «No entra», WHEN el hilo Native lo cambia, THEN para con la acción update antes del commit, no escribe un `Ruling:`.

### 4. Las sumas de coste de la evidencia, a mano, salieron mal tres veces

- **Qué pasó**: sumé a mano el coste de los sujetos de `tests/superpowers-fork-*.md` y me equivoqué en el RED válido (4,84 $ frente a 4,34 $), en los invalidados (1,68 $ frente a 2,18 $) y en el GREEN (9,61 $ frente a 8,42 $). Lo vi al recalcular desde los `.jsonl`, y la revisión final lo marcó como Minor.
- **Dónde en el kit**: `tests/headless/run.sh` (imprime un «coste acumulado» que no cuenta los sujetos sin línea `RESULTADO` en `tools.txt`) y `tech-stack.md`, «Sujetos headless»; no hay verbo que totalice una campaña por fase.
- **Por qué el kit no lo evitó**: el total de `run.sh` sale de `tools.txt`, que `extract.mjs` deja incompleto en algunos sujetos (hallazgo 5), y no separa válidos de invalidados.
- **Coste**: ~15 min y un Minor de la revisión final; el `estimation-log` habría heredado la cifra (walkthrough, §3, ruling de las cuentas).
- **Propuesta**: un verbo `sdd campaign cost --spec <carpeta>` que sume desde los `.jsonl` del scratchpad por fase y por carpeta de salida (`red`, `red-molde`, `green`…), o que `run.sh` lo imprima así al acabar.
- **Verificada**: sí — recalculado con un script de Node sobre `runs/<fase>/*.jsonl`.
- **Criterio de aceptación**: GIVEN una campaña con sujetos en `red/out` y `red-molde/out`, WHEN se pide el coste, THEN da el total por carpeta igual a la suma de `total_cost_usd` de sus `.jsonl`.

### 5. El gate de cierre con las cinco suites en paralelo da rojos que no son de la feature

- **Qué pasó**: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` (Git Bash) tardó 922 s. Fallaron «waits for the merge lock then publishes» y «el segundo proceso espera…» (`Error: Test timed out in 120000ms.`), y `kit:test` se cortó. Aislados, los dos lentos dieron 24/24 y `kit:test` 1094/1095. El único rojo, `FastSuiteBudget` (33,3 s frente a 30), falla igual en `develop` (32,9 s).
- **Dónde en el kit**: el gate de cierre de este repo (plan de la 0168, decisión 6, heredado de la 0147 y la 0160); `tests/FastSuiteBudget.Tests.ps1`.
- **Por qué el kit no lo evitó**: el gate se copia como un solo `moon run` con todo en paralelo, y los tests de cerrojos dependen del tiempo.
- **Coste**: ~25 min de repetir y aislar (walkthrough, §4.1).
- **Propuesta**: el gate de cierre del repo corre `cli:test-slow` y `cli:test-min` en serie y aparte de `kit:test`; patch para `SubjectOutputPrivacy.Tests.ps1` (9,1 s en el conjunto rápido) con `-Tag 'Slow'`.
- **Verificada**: sí — repetido aislado y comparado con `develop` en un worktree temporal.
- **Criterio de aceptación**: GIVEN el gate de cierre del repo, WHEN corre en una máquina sin otra carga, THEN termina sin rojos de tiempo en `lock-and-base.slow.test.ts` ni `publish.slow.test.ts`.

### 6. `tasks.md` no se creó antes de la Task 1

- **Qué pasó**: con un plan de 4 tasks, `tasks.md` nació en el paso 7, tras la revisión final, y no como registro vivo desde el principio.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, Setup, paso 4 («With more than one task, `tasks.md` is the living record»).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. Está al final de un paso de lectura («Read the plan once…»), sin un momento que la dispare, como sí lo tiene el anuncio del workspace.
- **Coste**: ~5 min, pero en Native sin compactación; con una caída a mitad, el registro durable habría sido solo el ledger.
- **Propuesta**: llevarla al paso 1 del bucle Native («Take the task»): «antes de la primera task, `tasks.md` existe».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un plan Native de 3 tasks, WHEN el hilo cierra la Task 1, THEN `tasks.md` existe con su fila `done` y el hash.

## Lo que hice por iniciativa propia

- **Para traer las mejoras de una fuente, comparar la fuente consigo misma** (superpowers 7.0.0 contra 7.1.0) y mapear con una tabla de procedencia, no comparar el fork con la fuente. El dev-lead lo aceptó, y la tabla quedó en el anexo de la spec, enlazada desde `THIRD_PARTY_NOTICES.md`. Candidato a una regla del Art. IX para todo fork.
- **Clonar en el scratchpad los repos de otros kits** (OpenSpec y Spec Kit, `--depth 1`, `core.longpaths=true`) para contrastar una afirmación de Context7. Corrigió una conclusión: OpenSpec no separa como dije con Context7.
- **Repetir un RED limpio con un molde más realista** (6 ADR en vez de 1) antes de recortar, siguiendo «Matices de campaña» de `tech-stack.md`. Confirmó el recorte.
- **Medir un rojo del gate en `develop`, en un worktree temporal**, para separar lo previo de lo de la feature. Bastó un minuto.

## Funcionó, no tocar

- «Lo primero de este paso: lee `references/…`» en los pasos 4 y 5 de `sdd-propose`: los sujetos leyeron la referencia en todos los escenarios que llegaron a esos pasos.
- La revisión adversarial con dos lentes, pedida por el dev-lead aunque la rúbrica daba «ninguna»: 20 hallazgos, 18 aceptados, 1 crítico real (secciones frente a las paradas de `delegate`).
- El pre-commit cazó dos tests que fijaban frases en su sitio viejo, `CommitMilestones` y `LocalConfig`; la «Verificación» de la task no los incluía. «Comprueba que el commit existe» de `sdd-implement` lo hizo visible.
- La regla de la decisión 5 del plan (si una regla decidida en la entrevista sale limpia en el RED, parar y enseñarla) dio al dev-lead la opción de otra tanda, que confirmó el recorte.

## Menores

- Tras el corte de luz, la sesión nueva cargó las skills de la caché del plugin; las leí de `skills/` de la rama con `Read`, como pide el `CLAUDE.md` del repo — `.claude/hooks/Test-KitSessionSource.ps1` avisó.
- `tests/headless/extract.mjs` no parsea una línea larga del stream (`SyntaxError: Expected ',' or '}' after property value in JSON at position 1745`) y deja `texts.txt` incompleto; hubo que leer el `.jsonl` a mano — `tests/headless/extract.mjs`.
- El techo de sujetos (`SUBJECT_CAP`) lo fijé yo en el plan, sin total en la previsión de la spec, y contaba también los invalidados; dos paradas para subirlo — `tech-stack.md`, «Sujetos headless», y Art. I (previsión «sujetos, minutos y dólares»).
- Lanzar `run.sh` con `&` dentro de un comando en primer plano lo mató al volver el comando; hubo que relanzarlo con `run_in_background` — no localizado.

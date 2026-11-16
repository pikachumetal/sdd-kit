---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261013-100039-feature-0175-restore-fork-pieces
task: 0175
mode: lite
date: 2026-10-13
---

# Ticket para el kit — feature 0175: devolver a dos forks el texto de su fuente choca con reglas del kit y desborda la previsión de humo

## Contexto

- Carril y modo: feature lite (alcance ampliado a «todo el diff» por decisión del dev-lead tras el diff contra la fuente)
- Skills del kit usadas: `sdd-propose`, `sdd-rubber-duck` (modo corto), `sdd-start-feature`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `add-to-changelog`, `sdd-end-feature`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown y CLI en TypeScript), una persona
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: revisor final opus con `sdd-kit:effort-high`; sujetos headless sonnet
- Coste en reloj: 1,2 h frente a 2,5–4 h estimadas
- Coste en tokens: hilo 50.717.065 y subagentes 3.174.759; sesión 19,54 $ y sujetos 3,23 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El texto de la fuente devuelto a un fork contradijo tres reglas del kit

- **Qué pasó**: al devolver a `sdd-implement` el texto de `executing-plans` y `subagent-driven-development`, tres frases chocaron con reglas del kit. (a) «A running plan does not wait on a human… a session parked on a question costs their whole day»: el humo `h1` decidió como ruling qué responde `cancelar` sin motivo, una salida observable que el kit para como freno de alcance, mientras `h2`, con el mismo kit, paró bien. (b) La racionalización «One line per task, in the same message as the commit» contradecía el paso 4 del bucle Native (commit, comprobar el commit y después `sdd task done` en su propia llamada). (c) El «Example Workflow» abría con «You: I'm using <skill>…», sin la línea `Workspace del plan` que el Overview exige en el primer mensaje. La (a) la destapó el humo; la (b) y la (c), la revisión final.
- **Dónde en el kit**: `.docs/sdd/decisions/0013-fork-keeps-source-text.md` (cómo se aplica) y la tabla «Regla de la fuente → dónde vive ahora» de la spec de cada fork; ningún paso de una skill pide contrastar una frase devuelta con las paradas y los contratos del kit.
- **Por qué el kit no lo evitó**: la ADR 0013 admite cambiar el texto «donde el kit trabaja distinto», pero no dice cómo encontrar esos sitios: las frases absolutas («only these», «does not wait», «in the same message») y los ejemplos que se imitan al pie de la letra no se ven como conflicto hasta que un sujeto o un revisor los ejecuta.
- **Coste**: la tanda de `h1` ×2 con el texto acotado (dentro de los 1,72 $ de la tanda de diagnóstico) y la pasada de fix de la revisión final, ~15 min (walkthrough de la feature 0175, §3, y commit `d08b7a5`).
- **Propuesta**: en la tabla del anexo de un fork, una pasada antes del humo que busque en el texto devuelto las frases absolutas y los ejemplos, y contraste cada una con las paradas de `control-profiles.md` y con los pasos del propio fork; cada choque se acota con el motivo «kit distinto» y su fila.
- **Verificada**: sí — con «rulings, not stalls» acotado, `h1` 2 de 2 conservan la salida sin motivo; las otras dos, con tres tests de frase en `tests/ImplementSkill.Tests.ps1` RED→GREEN.
- **Criterio de aceptación**: GIVEN un fork que devuelve «a running plan does not wait on a human» sin acotar, WHEN `h1` llega a una salida observable que la spec no fija, THEN para en el freno o conserva la salida existente (hoy 0 de 1 sin acotar, 2 de 2 acotado).

### 2. Un rojo de humo en un modo que la edición no toca no se separa de la deriva del modelo

- **Qué pasó**: el humo `s1` (modo corto de `sdd-rubber-duck`, sin tocar en esta feature) metió en el 🦆 el comando `exportar --mes 2026-03 --sala Norte` y la ruta `2026-03-norte.ics`, y falló R1. Los 4 `s1` de las features 0145 y 0160 estaban limpios. Hizo falta lanzar `s1` ×2 con el kit de la base para ver que también falla (2 de 2): es previo a la 0175. Con `w1` (el escenario nuevo) hicieron falta dos rondas más. La previsión era de 5 sujetos y fueron 12.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Baterías por skill» («Un rojo no se relanza para sacar verde: se lee»), y el Art. I (previsión de coste).
- **Por qué el kit no lo evitó**: la regla dice que se lee el rojo, pero no cómo leer uno de un modo que la edición no toca. Sin el kit de la base, la lectura no distingue una regresión de un cambio del modelo.
- **Coste**: 7 sujetos y 1,81 $ por encima de la previsión, ~30 min (walkthrough de la feature 0175, §2, «Coste de sujetos»).
- **Propuesta**: en «Baterías por skill», que un rojo de humo en un escenario que la edición no toca se contraste con el kit de la base (`git worktree add --detach <ruta> <apertura>` como `KIT_DIR`, n = 1–2) antes de cualquier ronda, y que esa tanda tenga su línea en la previsión.
- **Verificada**: sí — `s1` con el kit de la base dio 2 de 2 rojos, y la fila de deuda nueva lo recoge sin ronda en la 0175.
- **Criterio de aceptación**: GIVEN el humo de una edición con `s1` en rojo y el modo corto sin tocar, WHEN se lee el rojo, THEN corre un sujeto con el kit de la base antes de escribir una ronda.

### 3. En lite, la apertura y la baseline llegaron después de la primera edición

- **Qué pasó**: con la spec lite aprobada, edité `skills/sdd-implement/SKILL.md` sin haber hecho el commit de apertura y con la baseline todavía corriendo en segundo plano. La baseline dio 6 rojos, todos de la edición, y el commit de la spec sola tuvo que apartar las ediciones al workspace, devolver los ficheros, commitear y restaurarlas, porque el pre-commit corre la suite sobre el disco.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, paso 5 («Before writing the first task's RED tests, put the opening in a commit»), que es «*(full mode only)*»; en lite se pasa del paso 4 al 6 sin esa línea. También `skills/sdd-worktrees/SKILL.md`, paso 3, y `skills/sdd-start-feature/references/commit-milestones.md` («lite: antes de implementar»).
- **Por qué el kit no lo evitó**: la regla de la apertura en lite existe en `commit-milestones.md`, pero no está en el camino que recorre un lite. La de la baseline existía y no la apliqué: no esperé a que acabara.
- **Coste**: ~10 min (ledger de la 0175: «Ruling: baseline…», en el walkthrough, §3).
- **Propuesta**: en el paso 6 de `sdd-propose`, para lite: «put the spec in its opening commit before invoking `sdd-start-feature`»; en el paso 3 de `sdd-worktrees`: «wait for the baseline before the first edit».
- **Verificada**: sin verificar (contrastado con `skills/sdd-propose/SKILL.md`, paso 5, «*(full mode only)*»).
- **Criterio de aceptación**: GIVEN una spec lite aprobada en `delegate`, WHEN se invoca `sdd-start-feature`, THEN `git log` tiene el commit de apertura antes de la primera edición de código o de skill, y la baseline terminó antes.

### 4. El cierre no tiene salida cuando el documento de un aprendizaje está en su tope

- **Qué pasó**: el paso 4 de `sdd-end-feature` llevó dos aprendizajes a `tech-stack.md` y `architecture.md`, y el pre-commit bloqueó el commit de cierre: `moon run cli:typecheck cli:test kit:test-fast kit:roadmap` → «Topes de palabras.tech-stack.md cabe en su tope» (18.756 de 18.700) y «Topes de palabras.architecture.md cabe en su tope» (1.942 de 1.900). El Art. I solo deja subir un tope con la decisión del dev-lead escrita en la spec, y la de esta feature cubría las dos skills. Los aprendizajes acabaron en la procedencia de las baterías.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md`, paso 4, y `skills/sdd-end-feature/references/aprendizajes-skills.md`.
- **Por qué el kit no lo evitó**: el paso 4 dice adónde va cada aprendizaje, pero no qué hacer si el destino no cabe: ni «una pieza sale», ni otro destino, ni preguntar.
- **Coste**: ~5 min y un commit de cierre bloqueado (walkthrough de la feature 0175, §5).
- **Propuesta**: en el paso 4, si el destino está en su tope, el aprendizaje de una regla de una skill va a la procedencia de su batería, y si no, sale la pieza más vieja que ya vive en otro sitio o se pregunta al dev-lead; el walkthrough dice dónde fue.
- **Verificada**: sí — reproducido con el pre-commit en Git Bash.
- **Criterio de aceptación**: GIVEN `tech-stack.md` en su tope, WHEN el cierre vuelca un aprendizaje, THEN el commit de cierre pasa sin subir el tope y el walkthrough dice dónde quedó.

### 5. `sdd task start` no admite una spec lite

- **Qué pasó**: `node cli/bin/sdd.js task start .docs/sdd/specs/<carpeta>/spec.md 1` en Git Bash → `task 1 not found in .docs/sdd/specs/<carpeta>/spec.md (no heading matching 'Task 1')`. `sdd task done` con la misma spec sí registró la task.
- **Dónde en el kit**: `cli/src/tasks/` (`task start`) y `skills/sdd-implement/SKILL.md`, § Method («In lite mode, without a plan, `spec.md` is the plan»).
- **Por qué el kit no lo evitó**: la skill trata la spec lite como plan, y el verbo busca un encabezado de task que una spec no tiene.
- **Coste**: ~2 min, un ruling (BASE = la apertura).
- **Propuesta**: con `mode: lite` en el frontmatter, `task start` imprime la spec como brief y `HEAD` como BASE.
- **Verificada**: sí — reproducido con el comando de arriba.
- **Criterio de aceptación**: GIVEN `spec.md` con `mode: lite`, WHEN `sdd task start spec.md 1`, THEN imprime la ruta de la spec como brief y la BASE, y sale con 0.

### 6. El gate de cierre de este repo sigue sin declarar

- **Qué pasó**: `operations.md` no existe y `tech-stack.md` no tiene línea «Gate de cierre», así que la baseline y la validación usaron por precedente `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, como las features 0165, 0166 y 0173. `sdd-worktrees` dice que, sin gate declarado, se pregunte, y no pregunté: tomé el precedente como ruling.
- **Dónde en el kit**: `skills/sdd-worktrees/SKILL.md`, paso 3; el documento que falta es `.docs/sdd/tech-stack.md` §Testing de este repo.
- **Por qué el kit no lo evitó**: la regla de preguntar existía y no la apliqué; el precedente de tres features lo hizo parecer innecesario.
- **Coste**: ~2 min por feature, cuatro features seguidas (rulings en las 0165, 0166, 0173 y 0175).
- **Propuesta**: una línea «Gate de cierre: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`» en `tech-stack.md`, con el hueco de tope que haga falta.
- **Verificada**: sí — contrastado: `grep -n "Gate de cierre" .docs/sdd/tech-stack.md` no da nada.
- **Criterio de aceptación**: GIVEN este repo, WHEN `sdd-worktrees` llega al paso 3, THEN lee el gate de `tech-stack.md` sin ruling ni pregunta.

## Lo que hice por iniciativa propia

- Una comprobación de fidelidad: para cada frase de las fuentes, la cobertura de sus tramos de 5 palabras en el texto del fork, listando las de menos del 50 %. Tras reescribir `sdd-implement` encontró 7 frases perdidas, antes de la revisión final; el revisor, que comparó ~115 frases, encontró después 2 menores más. Candidato a verbo de la CLI para la Confirmación de la ADR 0013 (`sdd fork coverage <skill> <fuente…>`).
- Una copia del kit en un worktree desanclado en cada commit que se probaba (`git worktree add --detach`) como `KIT_DIR`, también una de la base para el contraste del hallazgo 2. Funcionó; no está escrito en «Baterías por skill».

## Funcionó, no tocar

- El diff contra la fuente antes de escribir la spec, y la pregunta de alcance con lo que encontró: el dev-lead amplió el alcance a «todo el diff» con una sola respuesta.
- Las paradas de `delegate` cayeron donde hacían falta: la spec, el alcance y el presupuesto de la prueba («Una ronda más»).
- La revisión final (opus, effort high) encontró tres Important reales en texto que el humo no ejercita (los ejemplos y una racionalización).
- `h2` paró en un freno de alcance legítimo, como manda el kit.
- La validación en campo y `sdd merge --push`, sin paradas de más.

## Menores

- Cada commit imprime ~100 líneas de avisos de `kit:roadmap` («“Destino” … no empieza por Actuar…») que entran en el contexto del hilo — `cli/src` (`roadmap check`) y `.githooks/pre-commit`.
- La spec decía que `w1` se califica con R1, R2 y R10, y la batería solo lo puso en R10; lo corregí antes del cierre — no localizado (no hay paso que contraste la rúbrica de la batería con la spec).
- Al cerrar, la spec se queda en `status: approved` (como en la 0173), aunque la plantilla lista `done` — `skills/sdd-end-feature/SKILL.md` y `spec-template.md`.
- Añadí a una decisión ✋ de la spec aprobada los topes medidos («Medido al terminar»): la plantilla no tiene sitio para lo medido frente a lo previsto — `spec-template.md`.
- No invoqué `sdd-grilling`: las decisiones venían en el prompt de arranque y la única pregunta, la de alcance, la hice con `AskUserQuestion` y la recomendada primero; sin coste observado — `skills/sdd-propose/SKILL.md`, paso 4.

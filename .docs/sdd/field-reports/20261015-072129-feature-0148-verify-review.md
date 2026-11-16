---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261015-072129-feature-0148-verify-review
task: 0148
mode: full
date: 2026-10-15
---

# Ticket para el kit — feature 0148: dos fallos de la Task 3 que solo ve el gate del cierre, y un desvío decidido como en `unattended`

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`, Native con 5 tasks
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-rubber-duck`, `sdd-parallel-agents`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify` (nacida en esta feature, leída con `Read`), `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, Pester y baterías de sujetos headless); una persona
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: revisión de la spec en `opus` y `sonnet`; revisión final en tres ejes (Spec `opus`, Código `sonnet`, Arquitectura `opus`, los tres con `effort-high`) y re-revisión en `opus`; sujetos de batería en `sonnet` y `opus`
- Coste en reloj: ~5,5 h frente a 5 h estimadas (+10 %), con una pausa de noche entre la revisión final y la pasada de fix
- Coste en tokens: hilo 258.057.015; subagentes 20.795.888 en 6 despachos; sesión 92,34 $; sujetos 32,74 $ en 49

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El pre-commit da por buena `cli:test` desde la caché de moon aunque cambien las skills que lee `docs-claims`

- **Qué pasó**: la Task 3 dejó en `skills/sdd-verify/references/spec-reviewer-prompt.md:41` el marcador `<salida de sdd capability index>`, que `docs-claims` lee como la orden `capability index>`. Los commits de las Tasks 3 a 5 se crearon con el pre-commit en verde, y en los de la pasada de fix y del cierre su salida dice `cli:test (cached, 9b7a3e0c)`. El fallo salió en el gate del cierre, en `cli:test-min`, después de la re-revisión: `FAIL test/docs-claims.test.ts > … spec-reviewer-prompt.md:41` → `AssertionError: capability index>: expected undefined to be defined`. Como llegó tras la única re-revisión, el arreglo fue a ✋ como `sin revisar`.
- **Fuente**: `git log -S "<salida de sdd capability index>" --oneline` → `baad233e` (Task 3); salida del pre-commit de `e950e885` y de `dfa25ac7` → `cli:test (cached, 9b7a3e0c)`; `cli/moon.yml` → las tareas `test`, `test-slow` y `test-min` sin `inputs`; `cli/test/docs-claims.test.ts:8` → `scannedRoots = ['skills', '.docs/sdd/capabilities']`; log del gate en el scratchpad → la línea `AssertionError` citada.
- **Dónde en el kit**: `cli/moon.yml` (tarea `test`, que corre el pre-commit de `.githooks/pre-commit`); en las skills, el paso 4 del bucle Native de `skills/sdd-implement/SKILL.md`, que confía en el pre-commit para lo que la «Verificación» de la task no cubre.
- **Por qué el kit no lo evitó**: moon calcula la caché de una tarea del proyecto `cli` con los ficheros de `cli/`. `docs-claims` lee `skills/` y `.docs/sdd/capabilities/`, que quedan fuera, así que un cambio de skill no invalida la caché y el test no se vuelve a ejecutar. La «Verificación» de la task corría Pester, no Vitest.
- **Coste**: un gate de cierre repetido (235 s) y ~10 min de diagnóstico; un `sin revisar` en la línea de validación (walkthrough §4.2). Estuvo oculto desde la Task 3.
- **Propuesta**: `inputs` explícitos en las tareas de test de `cli/moon.yml`: los de la CLI más `/skills/**/*.md` y `/.docs/sdd/capabilities/**/*.md`. Así un cambio de skill vuelve a ejecutar `docs-claims` en el pre-commit.
- **Verificada**: sí — contrastado con la salida del pre-commit de `e950e885`, que cambiaba `skills/sdd-verify/SKILL.md` y dio `cli:test (cached, 9b7a3e0c)`.
- **Criterio de aceptación**: GIVEN `cli:test` en caché y un commit que solo cambia una skill para que nombre una orden inexistente, WHEN corre el pre-commit, THEN `cli:test` no sale `cached` y falla en `docs-claims`.

### 2. Un test `Slow` que lee `git show` pasa en la sesión y falla con moon por la codificación de la consola

- **Qué pasó**: el test `Slow` de `tests/VerifySkill.Tests.ps1` compara los «Quick Diagnostic» del encargo con el clone de la fuente. Lo hace con `(git -C $clone show "v1.8.0:<skill>/SKILL.md") -join "`n"`. Pasó 5 de 5 en la sesión, pero con `moon run kit:test` fallaron los 3 cuyas tablas llevan caracteres fuera de ASCII («§», «—»). No lo ejecuta ningún paso antes del gate del cierre, porque `kit:test-fast` excluye `Slow`. El fallo se reprodujo con `pwsh -NoProfile -Command "[Console]::OutputEncoding = [Text.Encoding]::GetEncoding(850); Invoke-Pester -Path tests/VerifySkill.Tests.ps1 -TagFilter Slow"` en PowerShell → `2 pasan, 3 fallan`. Se arregló con el patrón de `tests/Battery.Tests.ps1:51-58`, que fija `[Console]::OutputEncoding` a UTF-8: después, `5 pasan`.
- **Fuente**: los dos comandos citados y su salida; `tests/Battery.Tests.ps1:51-58`; el log del gate → `[-] Encargos de los ejes.el Quick Diagnostic de clean-code es el de Wondel 1.8.0`, y lo mismo para `refactoring-patterns` y `software-design-philosophy`.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md` (cómo se testean las skills; no hay regla de codificación para Pester) y `skills/sdd-propose/references/plan-writing.md` (la «Verificación» de una task que añade un test `Slow` no dice cómo ejecutarlo).
- **Por qué el kit no lo evitó**: el patrón existe en un test, pero ninguna regla lo pide. La «Verificación» de la Task 3 ejecutó el test desde la herramienta PowerShell de la sesión, que está en UTF-8, y no desde moon.
- **Coste**: un tercer gate (235 s) y ~5 min. Otro `sin revisar`, en el mismo commit que el hallazgo 1.
- **Propuesta**: una línea en `tech-stack.md`: «un Pester que lee la salida de `git` o de `bash` fija `[Console]::OutputEncoding` a UTF-8 (patrón de `Battery.Tests.ps1`)». En `plan-writing.md`, la «Verificación» de una task que añade un test `Slow` lo ejecuta con `moon run kit:test`.
- **Verificada**: sí — reproducido con el comando citado en PowerShell, RED 2/5 → GREEN 5/5.
- **Criterio de aceptación**: GIVEN un Pester que captura `git show` de un fichero con «—», WHEN se ejecuta con la consola en la página 850, THEN pasa.

### 3. Un punto del Scope que el Art. I impide escribir se decidió como en `unattended`, sin parar en `delegate`

- **Qué pasó**: el Scope aprobado decía que `review-spec.md` ganaba un punto (las decisiones del dev-lead cubiertas enteras). El RED de la Task 5 salió limpio con el texto de la base, 2 de 2. El Art. I prohíbe escribir guía sin un fallo medido, así que no lo escribí y lo registré como «enmienda sin aprobar, se presenta al dev-lead en el cierre», que es la regla de `unattended`. En `delegate`, un desvío para. El dev-lead lo decidió unas 10 h después, en el cierre, y la decisión cambió además un THEN: de «Importante» a «Importante o Crítico».
- **Fuente**: `skills/sdd-start-feature/references/control-profiles.md:53` → la fila «Desvío»: `para · ## Enmiendas` en `pair` y `delegate`, y «opción más conservadora, enmienda sin aprobar» en `unattended`; `## Enmiendas` de la spec de la 0148 (`.docs/sdd/specs/20261014-163837-feature-0148-verify-review/spec.md`); ledger → `Task 5: Ruling: el punto 8 de review-spec.md … no se escribe`.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md:295`, «Deviations and rulings», y la tabla de `control-profiles.md:53`.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. El Art. I parecía dejar una sola salida posible, y ninguna regla dice que un RED limpio de un punto del Scope sigue siendo un desvío.
- **Coste**: no hubo tiempo perdido; la decisión llegó ~10 h tarde y en el cierre. Si el dev-lead hubiera querido el punto escrito, eran una ronda de sujetos (~2 $) y un commit más tras la re-revisión, `sin revisar`.
- **Propuesta**: en «Deviations and rulings», una frase que nombre el caso: «un punto del Scope que no se escribe porque su RED salió limpio (Art. I) es un desvío: para en `pair` y `delegate` con la medida en la pregunta; en `unattended`, enmienda sin aprobar».
- **Verificada**: sí — contrastado con `control-profiles.md:53`. La frase propuesta, sin verificar.
- **Criterio de aceptación**: GIVEN `delegate` y una task cuyo RED de un punto del Scope sale limpio, WHEN el hilo decide no escribirlo, THEN para con `AskUserQuestion` antes del commit de la task y no deja «enmienda sin aprobar».

### 4. Ningún eje revisa la prosa de las skills: el de Código la deja al de Spec, y el de Arquitectura, al de Código

- **Qué pasó**: en «Declined to judge», el eje Código escribió que la prosa de `sdd-verify` y de los encargos «no es código, y lo cubre el eje Spec». El eje Arquitectura escribió «Redacción, idioma y anatomía de cada frase de las skills: es del eje Código». El eje Spec juzgó el cumplimiento de la spec, no la forma de cada frase. En un repo cuyo producto es prosa para agentes, nadie leyó las frases contra la anatomía de `architecture.md`. Lo adjudiqué con un ruling: lo mide la batería.
- **Fuente**: los informes de los ejes Código y Arquitectura de la revisión final sobre `0bf5e6d`; `skills/sdd-verify/references/code-reviewer-prompt.md:30` → «leave their findings to them»; `architecture-reviewer-prompt.md:30`; ledger → `Final: Ruling: [Arquitectura] declinado «redacción y anatomía de cada frase de las skills»`.
- **Dónde en el kit**: `skills/sdd-verify/references/code-reviewer-prompt.md` (qué es «código» para el eje) y la tabla de ejes de `skills/sdd-verify/SKILL.md`, «Final review».
- **Por qué el kit no lo evitó**: los encargos reparten las fronteras entre ejes, pero no dicen quién lee los ficheros de instrucciones (`SKILL.md`, encargos, plantillas) cuando son el producto.
- **Coste**: ninguno observado; un ruling y un hueco de revisión en cada feature del kit que cambie skills.
- **Propuesta**: el encargo del eje Código cuenta como código los ficheros de instrucciones de agente, y los juzga contra la anatomía del documento de arquitectura del proyecto si la tiene.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un diff que solo cambia un `SKILL.md` con una regla resumida que pierde una condición, WHEN salen los ejes, THEN el eje Código lo marca, y no lo pone en «Declined to judge».

### 5. Los topes de palabras a cero de margen obligaron a condensar dos veces en el cierre

- **Qué pasó**: la spec fijó los topes «a lo que midan». La pasada de fix encontró `sdd-verify` a 17 palabras del total y `sdd-start-feature` y `sdd-end-feature` a 0, y se condensó texto en cada skill. Después, el arreglo del hallazgo 1 añadió `--path .docs/sdd` al marcador y `sdd-verify` se pasó en 2 palabras: segunda condensación.
- **Fuente**: `tests/WordBudget.Tests.ps1` → `sdd-verify` Total 8800, `sdd-start-feature` Total 11464, `sdd-end-feature` Total 4518; la medición con `-split '\s+'` antes de la pasada → 8783, 11464 y 4518; el gate → `[-] Topes de palabras.sdd-verify: la skill completa cabe en su tope`.
- **Dónde en el kit**: la previsión de coste del Art. I (`.docs/sdd/constitution.md:20`), que la spec repite; la fila de deuda «La previsión no mide el margen de palabras de lo que se edita» (quinto caso añadido en este cierre).
- **Por qué el kit no lo evitó**: la propuesta de esa fila (medir el margen y preguntar el tope) no ha entrado. Aquí se midió, pero el tope aprobado no dejó sitio para la pasada de fix.
- **Coste**: sin medir; dos rondas de recorte y un gate más (el del hallazgo 1).
- **Propuesta**: la de la fila, más una línea: el tope aprobado deja un margen para la pasada de fix de la revisión final, por ejemplo 1 %.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec que fija topes de las skills que edita, WHEN se escribe su previsión, THEN cada tope deja un margen por encima de lo medido y la spec lo dice.

### 6. Los ejes no pudieron leer el paquete en tramos de 400 líneas

- **Qué pasó**: el eje Arquitectura leyó el paquete en tramos de 25 a 175 líneas, porque el de 400 pasaba del límite de tokens. El eje Spec midió 39.722 tokens en 400 líneas por las filas largas del roadmap. Los dos tardaron 7 y 9 min.
- **Fuente**: los informes de los ejes Spec y Arquitectura; `sdd session tokens` → «Final review — Architecture axis … / 7 min», «Final review — Spec axis … / 9 min».
- **Dónde en el kit**: la receta del paquete de `skills/sdd-verify/references/encargo-revision.md`; fila de deuda «El paquete del revisor final no cabe cuando un fichero del diff tiene líneas muy largas» (segundo caso añadido).
- **Por qué el kit no lo evitó**: la fila espera, con prioridad baja.
- **Coste**: sin medir; la lectura en tramos pequeños alarga cada eje.
- **Propuesta**: la de la fila: sacar del diff los ficheros con líneas por encima de un umbral y nombrarlos en «Fuera del paquete».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un diff de `roadmap.md` con filas de más de 2.000 caracteres, WHEN se arma el paquete, THEN cada tramo de 400 líneas cabe en un `Read`.

## Lo que hice por iniciativa propia

- Para verificar el refactor de `subject.sh` de una batería, monté en seco los 12 escenarios antes y después. Usé `DRY_RUN=1` con `GIT_AUTHOR_DATE` y `GIT_COMMITTER_DATE` fijos, para que los sha salieran deterministas, y comparé argumentos, `git log --stat`, `git status` y el workspace: idénticos. Funcionó, y es candidato a regla para un hallazgo de calidad sobre código de batería, que no tiene un test que vea fallar.
- Un hallazgo de la revisión final («una línea del Review Focus no tiene la verificación que nombra») lo cerré con un sujeto RED (`f3n`) antes de escribir texto. Salió limpio y el escenario quedó como regresión, sin guía nueva (Art. I aplicado a un hallazgo de revisión). Costó 0,48 $.
- El encargo de la re-revisión se compuso solo con `re-review-prompt.md`, sin la cabecera de `encargo-revision.md`, porque esa plantilla ya lleva «Restricciones de código» y `sdd-verify` pide las dos. Así el bloque no sale duplicado (menor diferido en la fila de la 0148).

## Funcionó, no tocar

- El ledger con una línea `Final: pausa` (lo hecho, lo que faltaba y lo sin commitear) hizo que la sesión del día siguiente retomara la pasada de fix sin repetir nada.
- Los tres ejes encontraron cosas distintas, con un solo solape (el ejemplo de la línea de campo). El de Código, en `sonnet`, vio olores reales en el código de batería. El de Spec comparó 50 de 50 filas de los «Quick Diagnostic» con el clone de la fuente.
- `moon run kit:upstream` en el cierre destapó OpenSpec 1.14.2, que cambia justo la comprobación de `REMOVED` que forkea el eje Spec.
- `sdd merge --push` fusionó y publicó a la primera.

## Menores

- Los humos `h1` y `h2` commitean con `git add -A` — fila de deuda «Commits por ruta, sin `git add -A`».
- El ejemplo de `skills/sdd-verify/SKILL.md:208` nombra `sdd decision index` y `sdd capability index` sin `--path` — `skills/sdd-verify/SKILL.md`, «Final review».

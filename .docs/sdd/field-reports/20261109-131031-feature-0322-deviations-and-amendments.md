---
kit_version: 2.3.4
lane: feature
id: 20261109-131031-feature-0322-deviations-and-amendments
task: 0322
mode: full
date: 2026-11-09
---

# Ticket para el kit — feature 0322: el revisor de la enmienda entra; la regla del ruling no, con seis REDs limpios

## Contexto

- Carril y modo: feature full, perfil `delegate`, Native, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling` (no invocada: decisiones al ✋ en `delegate`), `sdd-parallel-agents`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`, `sdd-templates`
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, baterías headless), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (revisores de spec, eje Spec, re-revisión) y Sonnet 5.5 (revisores de spec, eje Código); sujetos Sonnet y Opus
- Coste en reloj: 2,20 h de esfuerzo real frente a 3 h estimadas de implementación (reloj de la sesión 2,61 h)
- Coste en tokens: 99.845.675 del hilo y 10.015.198 de subagentes en 7 despachos; 36,86 $ de sesión y 28,21 $ de sujetos en 59

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La review de spec salió con un revisor teniendo dos `MODIFIED`, y el dev-lead pidió las dos lentes

- **Qué pasó**: la spec tenía dos `MODIFIED` y unas 40 líneas de skill. Despaché un solo revisor con los siete puntos, leyendo «Small Scope» por el tamaño, y la presenté al ✋. El dev-lead pidió «haz revision opus dom tec sonnet». Las dos lentes trajeron 20 hallazgos, uno Crítico (una fila de rúbrica que no podía dar rojo), y ese Crítico obligó a una tercera lectura, con 9 hallazgos y otro Crítico.
- **Fuente**: `skills/sdd-propose/references/review-spec.md:23` («with fewer than ~50, and a delta that touches no public contract **and carries no `MODIFIED`**, one reviewer»); spec de la feature, «Hallazgos de la review» (tres rondas); `sdd session tokens` → revisores de spec 202.824 + 555.901 + 979.582 + 497.736 tokens.
- **Dónde en el kit**: `skills/sdd-propose/references/review-spec.md` §2.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. Leí la línea por el tamaño y me salté la condición del `MODIFIED`, que va al final de una frase larga.
- **Coste**: una parada del dev-lead y ~2,2 M tokens de dos rondas más (`sdd session tokens`), con dos Críticos que la primera ronda no vio.
- **Propuesta**: que el bloque «Review de spec propuesta» lleve una línea obligatoria `MODIFIED: <n>` antes del nivel, y que con n > 0 el nivel «un revisor» solo valga con la frase del dev-lead. Es el hueco de una plantilla, no una frase más (Art. II).
- **Verificada**: sí — contrastado con `skills/sdd-propose/references/review-spec.md:23`.
- **Criterio de aceptación**: GIVEN una spec con dos `MODIFIED` y ~40 líneas WHEN el agente escribe la propuesta de review THEN propone dos revisores, o uno con la frase del dev-lead citada.

### 2. La regla del ruling no se escribe: seis REDs limpios con sujetos recién arrancados frente a cinco casos de campo

- **Qué pasó**: el caso de la 0306 se midió en dos formas: `k4` (contar antes de escribir) y `k4r` (con la ronda de REFACTOR empezada y el tope en rojo). Salió limpio 3 de 3 en los dos: nadie quita las red flags que la spec deja, todos paran con la medida. Con `fr1`, `c10`, `d1` y `a1` son seis REDs limpios. Los cinco fallos de campo vienen de sesiones largas.
- **Fuente**: `tests/sdd-implement-0322-ruling.md` (`k4` y `k4r`); fila de deuda «Un freno que fija la spec se esquiva con un ruling» de `.docs/sdd/roadmap.md`.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings» y la red flag del ruling; método en `.docs/sdd/tech-stack.md`, «Un baseline limpio no reproduce los fallos de sesiones largas».
- **Por qué el kit no lo evitó**: el Art. I no deja escribir una regla sin un RED que falle, y el RED con sujetos frescos no reproduce el fallo. La fila de deuda no tiene salida.
- **Coste**: 6 sujetos Opus en esta feature (~3 $, `tests/sdd-implement-0322-ruling.md`), más los de la 0296, la 0291 y la 0186. Cada feature que la vuelve a medir repite el gasto.
- **Propuesta**: decisión del dev-lead sobre la fila. Una opción es un molde de sesión larga (contexto cargado y el tope descubierto tras varias tasks) con `TURN2`. Otra, cerrarla como posible falso negativo hasta un sexto caso de campo, que la reabre con su transcript como molde.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN el transcript de un caso de campo (0306 o 0310) recortado al turno anterior al ruling WHEN se reanuda con `--resume` y el kit de `develop` THEN el sujeto escribe el `Ruling:`, el RED que hoy no hay.

### 3. `c8` para en un freno de alcance con un THEN propuesto que nadie más lee

- **Qué pasó**: en `c8` (GREEN de la Task 1), los dos sujetos paran a preguntar qué texto responde `canceladas` sin canceladas. Proponen un THEN nuevo sin escribirlo en la spec y sin el revisor de la enmienda. La regla nueva solo despacha el revisor cuando hay una corrección escrita que cambia el delta. Si el dev-lead aprueba el THEN propuesto tal cual, entra sin otra lectura: es el caso de la 0297 por otra puerta.
- **Fuente**: `tests/sdd-implement-0322-amendment.md`, «Controles en la misma tanda»; `green/out/c8-1.texts.txt` y `c8-2.texts.txt` de la carpeta de la spec; revisión final, eje Spec, Important 2.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings» (la frase de la parada) y «Scope brakes».
- **Por qué el kit no lo evitó**: el revisor cuelga de «leave the correction in `spec.md`», y una parada de freno de alcance pregunta antes de escribir nada.
- **Coste**: ninguno medido en campo; en la batería, 2 de 2 sujetos.
- **Propuesta**: que la respuesta a un freno de alcance que añade o cambia un THEN pase por el mismo revisor antes de commitear la spec, en la línea que ya aplica la acción update a esa respuesta, sin una frase nueva.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `c8` con un `TURN2` que aprueba el THEN propuesto WHEN el hilo escribe la enmienda THEN despacha el revisor de spec antes de commitearla.

### 4. `f1` no reproduce el fallo del `-C`, y nadie ha medido que un hilo rellene `<worktree de la feature>`

- **Qué pasó**: con la receta nueva, el sujeto de `f1` creó el worktree de revisión pero ejecutó la receta desde el de la feature, sin `cd "$REVIEW_DIR"` y sin `-C`. El paquete cayó bien, pero el diff se calculó en la feature. Con el kit de `develop` hizo lo mismo. Xw da 0/1 con los dos kits, y el destino solo lo cubre la receta ejecutada con un script.
- **Fuente**: `tests/sdd-verify-0322-workspace.md`; `green/out/f1-1.tools.txt` y `control/out/f1-1.tools.txt` de la carpeta de la spec.
- **Dónde en el kit**: `skills/sdd-verify/references/encargo-revision.md` (receta del paquete, «The package recipe runs inside `$REVIEW_DIR`»); molde `f1` de `tests/batteries/sdd-verify/`.
- **Por qué el kit no lo evitó**: el molde no pone al sujeto donde se rompía en campo, dentro del worktree de revisión con la receta al pie de la letra.
- **Coste**: 2 sujetos sin medida útil (~3,3 $, `tests/sdd-implement-0322-tramo.md`, controles).
- **Propuesta**: un escenario que arranque con el worktree de revisión ya creado y el hilo dentro, y pida el paquete. Y que la receta guarde el worktree de la feature antes del `cd`, si el saldo de palabras lo permite.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN el hilo dentro de `review-<id>-<sha>` WHEN prepara el paquete con la receta THEN la llamada lleva `-C` con el worktree de la feature y el paquete sigue tras `git worktree remove`.

### 5. Un aprendizaje en `tech-stack.md` rompió el `sdd merge --sync` contra los topes exactos de la 0284

- **Qué pasó**: el cierre añadió un aprendizaje de baterías a `tech-stack.md`. El commit de sincronización lo paró el pre-commit: `word-budget.test.ts` → «mide 23301 y el tope es 23181». Lo moví a la procedencia de las baterías, rehíce el commit de cierre y repetí la sincronización.
- **Fuente**: salida de `sdd merge --sync` («Commit bloqueado: fallan las comprobaciones del kit») y de `moon run kit:build cli:test` sobre el merge reproducido en un worktree desanclado.
- **Dónde en el kit**: `skills/sdd-archive/references/learnings.md`, «A destination at its word cap».
- **Por qué el kit no lo evitó**: la regla existía, pero el tope de la rama aún tenía el margen del 25 %, y el exacto solo estaba en `develop` (la 0284 se fusionó a mitad de la feature). Nada mide el destino contra el tope de la base antes de escribir.
- **Coste**: ~15 min y una reconstrucción del commit de cierre (walkthrough, §5).
- **Propuesta**: que el bullet de aprendizajes de `sdd-archive` mida el destino con `word-budget.test.ts` sobre la base (`git show <remoto>/<merge.into>:<test>`) antes de escribir en él.
- **Verificada**: sí — reproducido con `moon run kit:build cli:test` en Git Bash sobre el merge de sincronización.
- **Criterio de aceptación**: GIVEN un destino a menos de N palabras de su tope en la base WHEN el cierre vuelca un aprendizaje de más de N palabras THEN lo manda a la procedencia de su batería antes del commit de cierre.

## Lo que hice por iniciativa propia

- RED a coste cero: antes de diseñar, leí los streams guardados de `c6` y `c10` de la 0222, la 0246 y la 0291 (0 revisores de spec en 15 sujetos). Después lo medí con el kit de `develop`, y esa tanda sirvió también de control. Funcionó: un solo gasto para RED y control.
- Guardé en la carpeta de la spec los encargos enteros de los despachos `Agent` de los sujetos (`agent-prompts.md`), sacados de los `.jsonl`, que no se versionan. La revisión final pedía poder comprobar los «siete puntos», y sin ellos no podía.
- Probé el RED del `-C` sin sujetos, con la receta ejecutada en un worktree de revisión real. Funcionó, y es lo único que mide el destino.

## Funcionó, no tocar

- La frase de la parada con el revisor: RED 0/5 → GREEN 5/5 en `c6` y `c10`, y U1r 2/2 a mitad de task. En los escenarios sin `Agent`, ningún sujeto se bloquea.
- La sustitución entera con saldo de palabras 0: la frase del REFACTOR, reescrita para compensar, mantiene `k2` y `k3` en verde.
- El paquete de esta misma revisión final se hizo con la receta nueva y quedó en el workspace de la feature.
- La regla de la decisión 13 (relanzar con `develop` un rojo del GREEN) separó `k1` y `a3` de un rojo nuevo. Pero no vale para una fila que mide el texto nuevo: lo vio el eje Spec.

## Menores

- La fila «Suma» de la previsión con «~59 sujetos» no la lee el lanzador («sin previsión legible»), y el primer RED salió sin sujetos por falta de `SUBJECT_CAP` — `skills/sdd-templates/templates/spec-template.md` (fila Suma) y `tests/headless/campaign.mjs`
- `battery.mjs verdict` no filtra por `SCENARIOS`, sino por pasos posicionales; tres intentos dentro de `sdd task done` — `.docs/sdd/tech-stack.md`, «Baterías por skill»
- `sdd task done -- bash -c '…'` resolvió el `bash` de WSL y la verificación falló sin salida; con la ruta de Git Bash pasó. `tech-stack.md` ya avisa de `bash` en Windows — no localizado en `sdd-implement-native`
- `a3` salió 1/3 con el kit de la rama y 2/3 con `develop`, los dos bajo el umbral: un sujeto de diferencia sin atribuir — `tests/batteries/sdd-implement/` (`a3`)
- `skills/sdd-propose/references/control-profiles.md` §Deviation describe la acción update sin el revisor de la enmienda (decisión 15 de la spec, para la 0311) — `skills/sdd-propose/references/control-profiles.md:74`

---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261101-115344-feature-0206-retire-start-skills
task: 0206
mode: full
date: 2026-11-01
---

# Ticket para el kit — feature 0206: retirar `sdd-start-feature` y `sdd-start-patch`

## Contexto

- Carril y modo: feature full, perfil `delegate`, Native
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (ejes Spec y re-revisión), Sonnet (eje Código y sujetos)
- Coste en reloj: 1,62 h frente a 3,5 h
- Coste en tokens: 35.500.653 del hilo y 15.396.647 de subagentes; 21,46 $ de sesión y ~27 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `battery.mjs` da verde en una fila de conducta que falla

- **Qué pasó**: `v1b` salió `1/1 · verde` dos veces sin 🦆 ni ✋ en ningún mensaje, y lo apunté como 1/1 en la evidencia. Lo cazó el eje Spec. Tampoco leí a mano las filas de `g6`, `c1`, `c2` y `p1`.
- **Fuente**: `green/out/v1b-1.texts.txt` y `fix/out/v1b-1.texts.txt` de la carpeta de la spec; `tests/headless/battery.mjs`, cabecera.
- **Dónde en el kit**: `tech-stack.md`, «Baterías por skill» y `tests/headless/battery.mjs`, `verdict`. Fuera de `skills/`.
- **Por qué el kit no lo evitó**: la regla «Dos veredictos» existe y no la apliqué: el `verde` de la salida se lee como veredicto final.
- **Coste**: una tanda más y una ronda de REFACTOR, ~2 $ y ~20 min; respaldo: `tests/retire-start-skills-green.md`, «Tras la revisión final».
- **Propuesta**: que `battery.mjs` escriba `puerta verde · conducta sin leer` cuando la fila de la rúbrica no es `tools:`.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una fila de rúbrica en prosa WHEN `battery.mjs run` da el veredicto THEN la línea no dice `verde` sin más.

### 2. La regla 7 de `CLAUDE.md` choca con el cierre: una rama publicada no se puede juntar

- **Qué pasó**: publiqué la rama para la CI antes del commit de cierre; `sdd-archive`, paso 5, pide juntar la pasada de fix en el cierre, y `git push -f` lo paró el hook del dev-lead con `matches dangerous pattern 'git push --force'`. La pasada de fix `144a9b2f` queda como commit propio.
- **Fuente**: `git log` de la rama; salida del hook en Bash.
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 5, y `CLAUDE.md` regla 7.
- **Por qué el kit no lo evitó**: la regla 7 dice «antes de cada `sdd merge`» sin decir que el primer push va tras el commit de cierre; yo empujé antes por adelantar la CI.
- **Coste**: un commit más en la historia; ~5 min.
- **Propuesta**: en la regla 7, «publícala tras el commit de cierre». Sustituye a «antes de cada `sdd merge`», sin alargarla.
- **Verificada**: sí — contrastado con `skills/sdd-archive/SKILL.md:48`
- **Criterio de aceptación**: GIVEN una feature con pasada de fix WHEN llega al merge THEN no hay ningún push antes del commit de cierre.

### 3. `spec-writing.md` pide secciones en `delegate`, y la regla 3 de `CLAUDE.md` no admite paradas

- **Qué pasó**: con más de 3 tasks, «Design by sections» dice que aplica en `delegate`; la regla 3 solo admite tres paradas y el encargo pedía proponer al presentar la spec. Me salté las secciones y lo dejé en la decisión 13.
- **Fuente**: `skills/sdd-propose/references/spec-writing.md:24-26`; `CLAUDE.md`, regla 3.
- **Dónde en el kit**: `skills/sdd-propose/references/spec-writing.md`, «Design by sections».
- **Por qué el kit no lo evitó**: dos reglas vigentes dicen lo contrario, y la skill las llama «turnos de entrevista» para no contarlas como parada.
- **Coste**: ninguno medido; una decisión sin respaldo.
- **Propuesta**: que un encargo con decisiones ya tomadas y una fila con requisitos quite las secciones, igual que la spec delegada.
- **Verificada**: sí — contrastado con `skills/sdd-propose/references/spec-writing.md:26`
- **Criterio de aceptación**: GIVEN `delegate` y un encargo que pide proponer al presentar la spec WHEN se prevén 4 tasks o más THEN va directo a la spec, sin saltarse una regla.

### 4. El repaso de coherencia busca nombres y no los pasos que citan

- **Qué pasó**: al retirar una skill busqué `sdd-start-feature` en las capacidades; cuatro requisitos de `feature-flow` citaban «paso 7» a secas y se escaparon. Salió en la revisión final y costó una enmienda sin aprobar.
- **Fuente**: `spec.md`, «Enmiendas»; informe del eje Spec, Important 3.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4, repaso de coherencia.
- **Por qué el kit no lo evitó**: la regla dice «search each name and each id»; un número de paso de la skill retirada no es un nombre.
- **Coste**: ~10 min.
- **Propuesta**: en esa frase, «each name, id and the step numbers it owns», sin alargar el paso.
- **Verificada**: sí — contrastado con `skills/sdd-propose/SKILL.md:60`
- **Criterio de aceptación**: GIVEN una spec que retira una skill con pasos numerados WHEN pasa el repaso THEN «Lo que se retira» lista los requisitos que citan esos pasos.

### 5. El lanzador de sujetos pide cosas que el método no dice de un tirón

- **Qué pasó**: el primer `battery.mjs run` falló con `la copia del kit lleva .docs/ o tests/: sácala con git archive`. Después, `SUBJECT_CAP` resultó acumulado por campaña: `techo de 40 sujetos alcanzado` paró la de enrutado, y una fase repetida dio `ya existe c1-1`.
- **Fuente**: salida de `battery.mjs` en Git Bash.
- **Dónde en el kit**: `tech-stack.md`, «Baterías por skill»; `tests/headless/campaign.mjs`.
- **Por qué el kit no lo evitó**: la cabecera de `battery.mjs` lista las variables sin decir la forma de `KIT_DIR`, que el techo acumula entre fases, ni que el id choca dentro de una fase entre baterías.
- **Coste**: tres relanzamientos; 3,07 $ de una tanda repetida.
- **Propuesta**: tres frases en la cabecera de `battery.mjs`.
- **Verificada**: sí — reproducido con `battery.mjs run` en Git Bash
- **Criterio de aceptación**: GIVEN un agente que lanza una batería por primera vez WHEN sigue la cabecera THEN el primer run no falla por `KIT_DIR` ni por el techo.

### 6. El heredoc de Git Bash volvió a romper un script dos veces

- **Qué pasó**: un `\n` en un heredoc rompió `subject.mjs` y un literal; otro heredoc se cortó con `here-document delimited by end-of-file`.
- **Fuente**: `node --check` → `SyntaxError: Invalid or unexpected token`.
- **Dónde en el kit**: `tech-stack.md`, «Un script de Python en un heredoc…».
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué; solo funcionó al usar `Write`.
- **Coste**: ~15 min; un RED perdido, sin coste de sujeto.
- **Propuesta**: ninguna en el texto: segundo caso de la regla; quizá un aviso del `Bash` con `\n` en un heredoc.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un heredoc con escapes WHEN se escribe código a disco THEN se usa la herramienta de edición.

## Lo que hice por iniciativa propia

- Generar el delta `MODIFIED` con un script desde los requisitos vivos: 0 líneas perdidas en la primera `capability merge`.
- Reutilizar `sr1` de la batería retirada para repasar el paralelo, porque `tools.txt` no separa respuestas.

## Funcionó, no tocar

- La tabla «regla → destino» de Art. I: destapó el paso 7, que el encargo daba por resuelto.
- Eje Spec con la tabla delante: cinco Important reales.
- `## Patch` como «lo primero», con `patch-flow.md` en referencia: 5 de 5 sujetos lo leyeron, y 0 revisores.
- Sujetos más baratos de lo previsto: el techo de 52 $ quedó en ~27 $.

## Menores

- El worktree de la línea base cayó dentro del repo por una ruta relativa con `git -C`; lo vi antes de la suite y lo rehíce como hermano — `skills/sdd-worktrees/SKILL.md` Step 3.
- `tests/batteries/sdd-verify/subject.mjs:114` sigue con `?? ''` en `compose-axis.mjs`, el mismo fallo silencioso que `compose-spec-review.mjs` — fuera de `skills/`.
- `v1b` mide la forma del mensaje en campo, no el momento: sale al final del cierre — `skills/sdd-archive/SKILL.md` paso 1.
- El registro `tasks.md` se quedó sin actualizar hasta la revisión final — `skills/sdd-implement/SKILL.md`, Native loop.

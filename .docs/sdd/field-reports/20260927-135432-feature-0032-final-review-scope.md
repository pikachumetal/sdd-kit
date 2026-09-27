---
kit_version: 1.1.0
superpowers_version: 6.4.2
lane: feature
id: 20260927-135432-feature-0032-final-review-scope
task: 0032
mode: lite
date: 2026-09-27
---

# Ticket para el kit — feature 0032: encargo del revisor final (paquete con la base actual y sin evidencia)

## Contexto

- Carril y modo: feature lite, perfil `delegate` del proyecto.
- Skills del kit usadas: `sdd-start-feature` (pasos 1-7), `sdd-templates` (scripts `Get-CapabilityIndex`, `Get-NextSddId -Reserve`, `Test-Capabilities`, `Measure-SessionTokens`, `Build-EstimationLog`), `add-to-changelog`, `sdd-end-feature`, `sdd-feedback`; de superpowers, `brainstorming` y la receta de revisión final de `executing-plans`.
- Proyecto: el repo del propio kit (skills en Markdown y tests Pester), una persona.
- Modelo del hilo: Opus 5.5.
- Modelos de los subagentes: revisor final `sdd-kit:effort-high` + `opus`, re-revisor `sdd-kit:effort-medium` + `sonnet`, 14 sujetos headless en Sonnet.
- Coste en reloj: ~1,5 h, spec incluida.
- Coste en tokens: 27,3 M del hilo y 1,5 M de subagentes, 11,23 $; sujetos, 9,79 $.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La primera pregunta separó «alcance» y «partir» en una fila con muchas piezas, y el dev-lead no la entendió

- **Qué pasó**: la fila del roadmap tenía unas 8 piezas y el enunciado nombraba solo una. La primera pregunta mezclaba «alcance» (solo la pieza, la fila entera o la pieza más otra) con modo y perfil. El dev-lead la rechazó para aclarar y preguntó «¿tenemos que partir la tarea?». Le respondí que no, pensando solo en la pieza. Después eligió «Toda la fila», y entonces tocaba proponer partir (más de 5 tasks). Lo leyó como una contradicción («¡pero si te acabo de preguntar si teníamos que partir!»). Hicieron falta 4 rondas de preguntas antes del brainstorming.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md`, paso 2, párrafo del recuento de tasks y de la propuesta de partir.
- **Por qué el kit no lo evitó**: el paso cuenta las tasks del enunciado, pero no dice qué hacer cuando el enunciado y la fila no coinciden. Con eso, el recuento sale de uno de los dos y la pregunta de partir llega después, según lo que se elija.
- **Coste**: ~15 min de hilo y la frustración del dev-lead en la primera parada.
- **Propuesta**: si la fila pendiente tiene más piezas que el enunciado, la primera pregunta ofrece una sola decisión, con las piezas listadas: «solo lo del enunciado (el resto a filas nuevas)», «partir la fila en N features (reparto)» y «la fila entera». No hay una pregunta de alcance separada de la de partir.
- **Criterio de aceptación**: GIVEN una rama `feature/<id>` cuya fila tiene 8 piezas y un enunciado que nombra una, WHEN el agente hace la primera pregunta, THEN una sola pregunta lista las piezas y ofrece esas tres salidas, y no vuelve a preguntar si se parte.

### 2. Una tanda más de sujetos con el mismo `SUBJECT` sobrescribe las salidas anteriores

- **Qué pasó**: para la tanda extra del RED lancé `SCENARIOS="r1 p1" SUBJECT=2`. `p1-2` ya existía y `run.sh` lo relanzó con la misma etiqueta: se perdieron sus salidas y su stream (0,62 $). El dato solo sobrevivió porque el `grep` del plan estaba en la sesión.
- **Dónde en el kit**: `tests/headless/run.sh` (etiqueta `<escenario>-<SUBJECT>`), y `subject_init` de `tests/headless/lib.sh`, que hace `rm -rf "$RUN"`.
- **Por qué el kit no lo evitó**: ni el lanzador ni `lib.sh` comprueban si la etiqueta ya tiene salida en `SPEC_DIR/<fase>/out/`.
- **Coste**: un sujeto sin evidencia versionada y una nota de reconstrucción en la evidencia.
- **Propuesta**: `run.sh` no lanza un sujeto cuya etiqueta ya tiene `<etiqueta>.tools.txt` en `out/` de la fase. Lo dice («ya existe p1-2: sube SUBJECT») y sigue con el resto.
- **Criterio de aceptación**: GIVEN `red/out/p1-2.tools.txt` existente, WHEN `SCENARIOS=p1 SUBJECT=2 DRY_RUN=1 bash tests/headless/run.sh`, THEN no crea el molde de `p1-2`, imprime el aviso y el fichero queda intacto.

### 3. `Measure-SessionTokens.ps1` no encuentra los transcripts de un perfil distinto de `~/.claude`

- **Qué pasó**: con la sesión en `CLAUDE_CONFIG_DIR=~/.claude-gco`, el paso 2 de `sdd-end-feature` dio «no medido» en las tres líneas. Hubo que pasar `-ProjectsRoot ~/.claude-gco/projects` a mano.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Measure-SessionTokens.ps1`, parámetro `-ProjectsRoot` (por defecto `$HOME/.claude/projects`); `skills/sdd-end-feature/SKILL.md`, paso 2.
- **Por qué el kit no lo evitó**: el script no lee `CLAUDE_CONFIG_DIR`. Ya está en la fila de deuda del perfil de configuración (ticket del patch 0082 §2), y esta sesión le añadió el script.
- **Coste**: un turno. Sin darme cuenta, habría escrito «no medido» en el walkthrough y el estimation-log habría perdido la fila de tokens.
- **Propuesta**: por defecto, `Join-Path ($env:CLAUDE_CONFIG_DIR ?? "$HOME/.claude") 'projects'`.
- **Criterio de aceptación**: GIVEN `CLAUDE_CONFIG_DIR` apuntando a una carpeta con `projects/<worktree>/<sesión>.jsonl`, WHEN se ejecuta el script sin `-ProjectsRoot`, THEN imprime tokens y no «no medido».

### 4. El gate de la spec no dice si «sigue», dicho como respuesta a «¿Apruebas la spec?», aprueba

- **Qué pasó**: el dev-lead contestó «sigue» dos veces. La primera, cuando la escritura de la spec estaba bloqueada: la tomé como permiso para escribir. La segunda, como respuesta directa a «¿Apruebas la spec?»: la tomé como aprobación y la registré literal. El paso 4 solo cuenta «un «sí» o un «apruebo» a la pregunta del gate».
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md`, paso 4, «Cuenta como aprobación…».
- **Por qué el kit no lo evitó**: la lista cerrada deja fuera las respuestas de avance («sigue», «adelante», «ok») a la pregunta del gate, que un dev-lead usa igual.
- **Coste**: ninguno visible; decidí yo, sin respaldo escrito.
- **Propuesta**: la respuesta que el usuario da sola a la pregunta del gate, sin otra pregunta abierta en el turno y sin pedir cambios, aprueba. El walkthrough registra la frase literal.
- **Criterio de aceptación**: GIVEN la spec presentada con «¿Apruebas la spec?» sola al final, WHEN el usuario responde «sigue», THEN el agente la aprueba con la frase literal y no repregunta. Y GIVEN «sigue» a otra pregunta, THEN la spec queda EN ESPERA.

### 5. La validación diferida que llega antes de ver el trabajo no cumple la letra de la condición 1

- **Qué pasó**: a mitad de la implementación, el dev-lead escribió «cuando acabes, validación diferida al uso, feedback, commit y merge». La condición 1 de la validación diferida pide que esté «presente y con el trabajo delante». Estaba presente, pero el trabajo no existía todavía. Lo di por diferido, concreté yo el disparador y lo digo en el cierre.
- **Dónde en el kit**: `skills/sdd-start-feature/references/control-profiles.md`, «Validación diferida», condición 1.
- **Por qué el kit no lo evitó**: la regla supone que la frase llega en la pregunta de validación del paso 7, no como una orden anticipada.
- **Coste**: ninguno visible, pero es una interpretación sin respaldo.
- **Propuesta**: decir si una orden anticipada de diferir cuenta (y el agente enseña igualmente el smoke en el mensaje de cierre) o si hay que preguntar en el paso 7 aunque ya la haya dado.
- **Criterio de aceptación**: GIVEN «cuando acabes, validación diferida al uso» dicho durante la ejecución, WHEN el agente llega al paso 7, THEN sigue la regla escrita (diferir con el smoke presentado, o preguntar) y la cita.

## Lo que hice por iniciativa propia

- Usé la receta nueva en la revisión final de esta misma rama, justo después de integrar `develop`: el paquete quedó en 7 ficheros y 37 KB, frente a ~6.800 líneas del diff completo. Probar el cambio sobre su propio cierre dio un RED/GREEN de campo gratis.
- Integré `develop` antes de la revisión final a propósito, para que la receta se probara con un merge real, y así vi el renombrado de capacidades del patch 0083 antes de fusionar el delta.
- Antes de escribir la receta con remoto, comprobé en un repo de juguete la semántica de `git merge-base` con tres argumentos: local atrasado, local adelantado, sin remoto y divergido.
- El paquete de la re-revisión lo construí a mano, sin las salidas de los sujetos: `review-package` las habría metido (53 KB frente a 30 KB).

## Funcionó, no tocar

- `Get-NextSddId.ps1 -Reserve -Count 2` para los ids de las partes (0085 y 0086) antes de dar sus prompts: las ramas salieron con id.
- Los moldes versionados de las features 0044 y 0057 se reutilizaron tal cual: el molde nuevo son ~90 líneas.
- El freno de alcance del paso 6 (`git diff --name-only` de la base) detectó el renombrado `task-flow` → `feature-flow` antes de cerrar.
- El techo de coste de `run.sh` cuenta todas las fases de la spec: sin llevar la cuenta a mano, supe que el control `f2-1` cabía en los 10 $.

## Errores míos, no huecos del kit

- La primera respuesta a «¿tenemos que partir?» fue «no», pensando solo en la pieza del enunciado, cuando el usuario preguntaba por la fila.
- El primer RED del test estático cortaba la sección por cualquier `^## ` y una comprobación pasó en vacío (el `## Cómo revisar` vive dentro de un bloque de código).
- Un `wc -c < $(ls …/*.diff)` sin fichero esperó en la entrada estándar y hubo que parar el comando.

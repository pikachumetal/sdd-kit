---
kit_version: 2.0.0 (marcador del repo; skills del working tree, plugin.json 2.1.0)
superpowers_version: 6.4.2
lane: patch
id: 20260929-172518-patch-0114-walkthrough-literal-cspell
task: 0114
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0114: la campaña de una línea de plantilla gastó dos sujetos en el molde

## Contexto

- Carril y modo: patch, perfil `delegate`
- Skills del kit usadas: `sdd-start-patch`, `sdd-templates` (`Get-NextSddId.ps1`, `Test-Capabilities.ps1`, `Build-EstimationLog.ps1`, `Invoke-SddMerge.ps1`), `sdd-end-patch`, `sdd-feedback`; arnés `tests/headless/run.sh` y `lib.sh`
- Proyecto: el propio kit (skills en Markdown, scripts PowerShell con Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: sujetos headless Sonnet (5)
- Coste en reloj: ~1,5 h
- Coste en tokens: hilo no medido; sujetos 1,14 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El sustituto de una herramienta del molde, si el sujeto lo puede leer, le da la respuesta

- **Qué pasó**: el molde imitaba el corrector del proyecto con `scripts/lint-md.mjs`, que llevaba en claro la lista de palabras que marcaba y la regex de `cspell:ignore`. El sujeto w1-1 lo leyó antes de escribir y excluyó las tres palabras exactas de antemano. RED limpio, pero por fuente incidental: se descartó, y el molde pasó a `node_modules/cspell/bin.mjs`, ignorado por git y con las palabras por hash. Con ese molde, el fallo se reprodujo.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, reglas de campaña («El fixture reproduce la ausencia, no solo el defecto», «Una primera tanda limpia no basta para recortar»). Ninguna habla de los sustitutos de herramientas.
- **Por qué el kit no lo evitó**: el Art. I pide mirar de dónde sacó el sujeto la conducta *después* del baseline limpio. No hay regla previa para que el sustituto no sea legible como respuesta.
- **Coste**: 1 sujeto (0,21 $) y una vuelta de molde.
- **Propuesta**: una línea en `tech-stack.md`: una herramienta del proyecto que el molde imita (un linter, un corrector, un gate) vive donde el proyecto real la tendría (`node_modules/.bin`, fuera de git) y no lleva en claro lo que va a marcar. Además, soporta la sintaxis real de la herramienta que el sujeto pueda usar (hallazgo 3).
- **Criterio de aceptación**: GIVEN una campaña cuyo molde imita un linter · WHEN se escribe el `subject.sh` siguiendo `tech-stack.md` · THEN el sustituto está fuera del árbol versionado del molde y ningún `Read` o `cat` del sujeto sobre ficheros del proyecto muestra la lista de lo que marca.

### 2. Nombrar el gate en la petición le quita el fallo al escenario

- **Qué pasó**: w1 pedía «haz el paso 1 y pasa el gate de docs del proyecto antes de parar». El sujeto w1-2 se adelantó y excluyó las palabras antes del primer lint. En campo nadie nombra el gate: salta en el commit. El escenario w2 («commitéalo en la rama», con el lint en un pre-commit del molde) reprodujo el fallo a la primera.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «El orden de los mensajes del caso de campo es parte del fixture» (task 0004). Cubre el orden de los mensajes, no las pistas que la petición añade.
- **Por qué el kit no lo evitó**: la regla existente habla del orden, no de que la petición no nombre lo que se mide.
- **Coste**: 1 sujeto (0,24 $).
- **Propuesta**: ampliar esa regla: la petición del escenario no nombra el gate ni la conducta que se mide. Si en campo el gate salta en un hook, el molde lo pone en ese hook.
- **Criterio de aceptación**: el RED de este patch: con w1 (gate nombrado) el sujeto no falla; con w2 (gate en el pre-commit) falla. Una regla que haga elegir w2 de entrada ahorra el sujeto.

### 3. El carril patch prohíbe la carpeta antes de reproducir, pero `run.sh` escribe en la carpeta y cuenta el techo en ella

- **Qué pasó**: `sdd-start-patch` paso 1 dice que sin reproducir el fallo no hay rama, carpeta ni id. `tests/headless/run.sh` exige `SPEC_DIR` y escribe en `SPEC_DIR/<fase>/out`; el techo de sujetos cuenta `SPEC_DIR/*/out`. Lo resolví con `SPEC_DIR` en el scratchpad y copiando `red/` a la carpeta del patch al reservar el id. Funcionó, pero ninguna regla lo dice.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 1, y la cabecera de `tests/headless/run.sh`.
- **Por qué el kit no lo evitó**: el arnés nació pensando en la spec de una feature, que existe antes del RED.
- **Coste**: bajo en esta sesión, porque lo resolví enseguida. Un agente que siga el paso 1 al pie de la letra no puede lanzar el arnés.
- **Propuesta**: una línea en la cabecera de `run.sh`: en un patch, `SPEC_DIR` va en el scratchpad hasta que el RED reproduce, y `red/` se copia a la carpeta del patch al abrirla.
- **Criterio de aceptación**: GIVEN un patch de skill que necesita sujetos · WHEN el agente sigue `sdd-start-patch` paso 1 y la cabecera de `run.sh` · THEN lanza el RED sin crear la carpeta del patch y, si reproduce, la evidencia acaba en `<carpeta del patch>/red/out/`.

## Lo que hice por iniciativa propia

- **Molde con el gate en un pre-commit** (`core.hooksPath .githooks` en el molde) para medir «el lint pasa a la primera» como el código de salida del primer `git commit`. Midió justo lo que pedía el ticket de campo. Funcionó.
- **Parar dos veces por el techo de sujetos** (GREEN y REFACTOR) con una pregunta cerrada, coste incluido, en vez de ampliar la previsión yo solo. El dev-lead autorizó los dos. Funcionó; cuesta dos turnos del dev-lead.

## Funcionó, no tocar

- La parada de `sdd-start-patch` «si no reproduce, STOP»: con dos RED limpios, obligó a revisar el molde antes de concluir que la guía sobraba, y el tercero reprodujo.
- El GREEN parcial destapó un hueco de la guía pedida («excluye sus palabras» deja al agente adivinar el diccionario). La regla del Art. II («una excepción lleva su contraejemplo») guió la corrección: «todas las palabras de la frase, no solo las que te parezcan erratas», 1/1 en REFACTOR.
- `Invoke-SddMerge.ps1 -Push` en `delegate`: merge y push en una orden, sin intervención.

## Errores míos, no huecos del kit

- El primer sustituto de cspell no soportaba `cspell:disable-line` ni `disable-next-line`: w1-2 recibió un fallo falso con una directiva válida.
- Ediciones del `subject.sh` con Python y cadenas no raw rompieron escapes (`\n`, `\.`) dos veces; hubo que rehacerlas a mano.
- El primer commit del fix, desde PowerShell con `git commit -F -` y una here-string, falló («pathspec … did not match»); rehecho con heredoc en Bash.

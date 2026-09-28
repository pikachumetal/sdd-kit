---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: patch
id: 20260928-161223-patch-0094-review-package-slim
task: 0094
mode:
date: 2026-09-28
---

# Ticket para el kit — patch 0094: RED de una guía que depende de cómo trunca `Read` el harness

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback` (y `superpowers:systematic-debugging` en la causa raíz, sin invocarla como skill)
- Proyecto: el propio kit (plugin de Claude Code en markdown + PowerShell/Bash, una persona)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: sujetos headless Sonnet (2 con resultado, 1 parado)
- Coste en reloj: ~1 h 25 min, cierre y ticket incluidos
- Coste en tokens: no medido (sujetos: 1,15 $ medidos + ~0,3 $ estimados del parado)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un `Read` sin `limit` ya no devuelve el error de 25.000 tokens: el harness lo trunca

- **Qué pasó**: el RED pedía reproducir `File content (28006 tokens) exceeds maximum allowed tokens (25000)` del ticket de campo. El revisor Sonnet hizo un `Read` sin `limit` sobre un paquete de 235.036 bytes y 2.018 líneas y recibió 270 líneas (40.205 caracteres) sin error. En el campo el revisor pasó `limit: 700`, y ese tramo sí pasaba de 25.000 tokens. Resultado: el criterio «ningún `Read` devuelve el error» salió limpio en el RED (0 de 1), y la guía de los tramos de 400 líneas quedó respaldada solo por el campo. El sujeto del RED, además, leyó a saltos 680 de las 2.018 líneas: el fallo real que sí se ve en el molde es la **lectura incompleta**, no el error.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md` §Testing (cómo se reproduce un fallo de campo en un molde); en el caso concreto, `tests/review-package-slim-red.md`.
- **Por qué el kit no lo evitó**: nada dice que un límite del harness se reproduce con los mismos parámetros de herramienta que en el campo, ni qué medir cuando la conducta del harness esquiva el fallo.
- **Coste**: una guía escrita sin RED propio (decisión anotada en `patch.md`), y una medición con Opus que no se lanzó por pasar del techo.
- **Propuesta**: una línea en tech-stack: si el fallo de campo es un límite de herramienta, el criterio del RED mide también lo que ese límite provoca y se ve siempre (aquí, cuántas líneas del paquete lee el revisor), además del error literal, que depende del parámetro que elija el sujeto.
- **Criterio de aceptación**: GIVEN el molde `legal` del patch 0094 con la receta anterior · WHEN un revisor Sonnet lo lee · THEN el RED cuenta las líneas del paquete que cubrió (680 de 2.018 hoy) y el GREEN las compara con la guía nueva (126 de 126).

### 2. Un fichero del molde fuera del cwd del sujeto bloquea su `Read` en headless

- **Qué pasó**: el `subject.sh` escribía el paquete en `$RUN/ws/`, fuera del molde `$R`. `Read` devolvió «Claude requested permissions to read from …» y el sujeto dio rodeos con `sed` y copias en `.tmpreview/`. Paré el sujeto, moví el workspace a `$R/.superpowers/sdd/spec/` y lo relancé.
- **Dónde en el kit**: `tests/headless/lib.sh`, `build_claude_args` (solo `--add-dir "$KIT"`).
- **Por qué el kit no lo evitó**: `lib.sh` documenta `RUNS_DIR` y el molde, pero no que todo lo que el sujeto debe leer vaya dentro de `$R`.
- **Coste**: ~0,3 $ y ~5 min, y un sujeto sin resultado.
- **Propuesta**: `build_claude_args` suma `--add-dir "$RUN"`, o el comentario de cabecera de `lib.sh` dice que lo que lee el sujeto va dentro de `$R`.
- **Criterio de aceptación**: GIVEN un `subject.sh` que deja un fichero en `$RUN/ws/` y pide leerlo · WHEN se lanza con `run.sh` · THEN el `Read` del sujeto devuelve el contenido, no la petición de permiso.

### 3. `run.sh` no cuenta el coste de un sujeto parado a mitad

- **Qué pasó**: paré el primer sujeto con `TaskStop` antes de `subject_save`. No dejó `tools.txt`, y `spent()` de `run.sh` solo suma el `=== RESULTADO` de los `tools.txt`: el techo de coste no lo vio. El `jsonl` sí existía, sin línea `result`.
- **Dónde en el kit**: `tests/headless/run.sh`, funciones `subjects()` y `spent()`.
- **Por qué el kit no lo evitó**: el techo asume que todo sujeto lanzado termina.
- **Coste**: ~0,3 $ fuera del techo; lo estimé a mano en la evidencia.
- **Propuesta**: `run.sh` avisa de cada `<etiqueta>.jsonl` sin `tools.txt` («sujeto sin resultado: coste no contado»), o lo cuenta como sujeto hacia `SUBJECT_CAP`.
- **Criterio de aceptación**: GIVEN un `RUNS_DIR` con `red/v1-1.jsonl` y sin `red/out/v1-1.tools.txt` · WHEN `run.sh` arranca otra fase · THEN lo avisa o lo cuenta.

### 4. `sdd-end-patch` paso 0 no prevé una validación parcial

- **Qué pasó**: el dev-lead contestó «he visto el state, y ok, el resto diferido al uso de la v2.0.1»: validó una parte y difirió el resto. Las tres salidas del paso 0 son excluyentes. Escribí las dos líneas (`Validado:` para lo que vio y `Validación diferida:` para el resto) y la fila del roadmap con 🧪.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 0; `skills/sdd-templates/templates/patch-template.md` §4.
- **Por qué el kit no lo evitó**: la validación diferida se pensó para todo o nada.
- **Coste**: bajo; una decisión de forma sin regla.
- **Propuesta**: una frase: con una validación parcial van las dos líneas, cada una con los casos que cubre, y manda la diferida (prefijo 🧪 en el roadmap).
- **Criterio de aceptación**: GIVEN la respuesta «he visto X y ok, el resto lo pruebo en Y» · WHEN el agente cierra el patch · THEN §4 lleva `Validado:` con X y `Validación diferida:` con Y, y la fila del roadmap empieza por `🧪`.

### 5. `Build-EstimationLog.ps1` lee «~1 h 20 min» como 1 h sin avisar

- **Qué pasó**: con `- Real: ~1 h 20 min (…)` en `patch.md` §5, el log salió con 1 h. Lo corregí a `1.3h` y regeneré.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Build-EstimationLog.ps1` (parser de §5).
- **Por qué el kit no lo evitó**: la plantilla pide `<Yh>`, pero el parser acepta un prefijo numérico y descarta el resto en silencio.
- **Coste**: bajo; un dato del log mal sin aviso si nadie mira el diff.
- **Propuesta**: aviso cuando la celda tiene texto de tiempo tras el número («20 min»), o que el parser sume horas y minutos.
- **Criterio de aceptación**: GIVEN `- Real: ~1 h 20 min` · WHEN se ejecuta el script · THEN escribe 1.33 o avisa de la celda.

## Lo que hice por iniciativa propia

- El `subject.sh` extrae la receta y «Cómo revisar» del `encargo-revision.md` del kit que mide, con `awk`, y rellena los huecos: el RED y el GREEN ejecutan el texto literal de cada versión, no una copia a mano. Funcionó: el mismo script dio 235.036 y 19.965 bytes.
- El `state.txt` lleva medidas deterministas del paquete (bytes, líneas de los borrados, sección «Ficheros borrados», tramo de 400 líneas más grande) además de la conducta del sujeto. El dev-lead validó con ese fichero.
- Ensayo en seco (`DRY=1`) de las dos versiones antes de gastar en sujetos.

## Funcionó, no tocar

- `run.sh` con `SUBJECT_CAP` y `COST_CAP` compartidos entre fases: los dos brazos en paralelo respetaron el techo.
- `SUPERPOWERS_DIR` aísla bien al sujeto de la configuración del dev-lead.
- `Invoke-SddMerge.ps1 -Push`: merge y push a la primera, con el pre-commit de la suite rápida.
- `Test-Capabilities.ps1 -Artifact` validó la fusión del `ADDED`.

## Errores míos, no huecos del kit

- En el molde, `printf "$1"` con un formato que empieza por `- [ ]`: `printf` lo tomó por opción. Salió en el ensayo en seco.
- Presenté la validación en texto y sin las tres opciones del paso 0 de `sdd-end-patch`, antes de invocar la skill.
- Escribí el tiempo de §5 en formato libre (hallazgo 5).

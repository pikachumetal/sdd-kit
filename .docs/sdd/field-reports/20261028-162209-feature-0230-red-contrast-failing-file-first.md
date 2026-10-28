---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261028-162209-feature-0230-red-contrast-failing-file-first
task: 0230
mode: lite
date: 2026-10-28
---

# Ticket para el kit — feature 0230: el contraste de un rojo corre primero el fichero que falla

## Contexto

- Carril y modo: feature lite (pedida como patch; `sdd-propose` la subió por dos comportamientos nuevos)
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-rubber-duck`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, baterías headless), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: ejes de la revisión final y re-revisión (Opus y Sonnet, effort high); 15 sujetos headless Sonnet
- Coste en reloj: 1,58 h de esfuerzo frente a 1,5 h estimadas (reloj de la sesión 2,69 h, 67 min de espera al dev-lead); el gate de cierre, después, 844 s
- Coste en tokens: 32.822.745 del hilo y 4.617.636 de subagentes, 13,75 $; sujetos 8,24 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un sujeto colgado detiene la tanda una hora: el lanzador corre sin tope de tiempo

- **Qué pasó**: en el GREEN, `g4-2` no escribió nada desde las 15:10. Su carpeta de trabajo la tenía bloqueada el servidor del panel (`sdd validation serve`) que dejó `g4-1`: `rm: cannot remove '…/.temp/r30/green/g4-1/repo': Device or resource busy`. La tanda siguiente (`a3r`, `g5`, `g3d`) esperó detrás. El proceso del sujeto era `timeout.exe 0 … claude -p --model sonnet …`, es decir, sin límite. El dev-lead: «que noacabamos nunca?». Lo paré por PID (`taskkill /PID 3616 /T /F`) a la hora y 6 min.
- **Fuente**: `Win32_Process` de la sesión (`timeout.exe` con `0` como duración, padre del `claude.exe` de `g4-2`); `green.log` de la campaña; `tests/red-contrast-0230-green.md`, fila `g4`
- **Dónde en el kit**: `tests/headless/run.sh` (o `run.mjs` tras la 0216), el lanzador de cada sujeto; `skills/sdd-archive/references/dev-validation.md` §4, que hace que el sujeto deje el servidor en segundo plano
- **Por qué el kit no lo evitó**: el lanzador no pone tope de reloj al sujeto, y nada para al acabar el sujeto lo que dejó escuchando (el `env-down` de `subject.sh` solo cubre el servidor del E2E, no el del panel)
- **Coste**: ~1 h de pared y un sujeto sin medir (`g4-2`); respaldo: `tests/red-contrast-0230-green.md`
- **Propuesta**: un tope por sujeto (p. ej. 30 min) en el lanzador, que lo para y lo marca «colgado»; y que `subject.sh` pare por su PID el servidor de `sdd validation serve` que deje el sujeto
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un sujeto cuyo `claude -p` no termina WHEN pasa el tope THEN el lanzador lo para, escribe `[<id>] colgado` y la tanda sigue con el siguiente

### 2. El molde de un gate que se traga la salida deja sin medir la regla que se prueba

- **Qué pasó**: el escenario nuevo `a3a` mide que el contraste corra «el fichero que falla». El `gate.mjs` del molde solo imprimía `▪ bookings:test (5 passed, 1 failed)`, sin el nombre del fichero. En el GREEN ningún sujeto pudo saber qué fichero falló, y C4 quedó «sin medir». Arreglarlo (el gate vuelca la salida de una tarea roja, como moon) y repetir `a3a` ×2 costó una parada del dev-lead y 1,27 $.
- **Fuente**: `tests/red-contrast-0230-green.md`, fila C4 y sección GREEN2; `tests/batteries/sdd-archive/fixtures/gate/gate.mjs`
- **Dónde en el kit**: `tests/batteries/sdd-archive/fixtures/gate/gate.mjs`; `.docs/sdd/tech-stack.md`, «Baterías por skill» (el ruido del molde)
- **Por qué el kit no lo evitó**: la regla del ruido del molde (task 0004) habla de lo que para al sujeto antes de la conducta, no de lo que el molde no le enseña. Y yo no corrí el molde a mano antes del RED para ver qué salida leía el sujeto
- **Coste**: 2 sujetos, 1,27 $, ~15 min y una parada del dev-lead; respaldo: enmienda y walkthrough de la 0230
- **Propuesta**: antes de lanzar el RED de un escenario nuevo, ejecutar el molde una vez y comprobar que la salida que leerá el sujeto contiene el dato que la rúbrica le pide usar
- **Verificada**: sí — `a3a` GREEN2 con el gate arreglado: C4 2/2 en el fichero solo
- **Criterio de aceptación**: GIVEN un escenario nuevo cuya rúbrica pide usar el dato X de una salida WHEN se prepara el RED THEN la evidencia del RED cita la línea del molde que lo enseña

### 3. `RUNS_DIR` en el scratchpad de la sesión da `Filename too long` a los sujetos

- **Qué pasó**: con la regla del dev-lead de temporales solo en el scratchpad, puse `RUNS_DIR` allí (~190 caracteres). Los sujetos del RED recibieron `error: unable to open loose object …: Filename too long` en `git clone`, `git worktree add` y `sdd merge`. `a3a-2` no pudo fusionar, y `a8-1` revisó sobre un `git archive`.
- **Fuente**: `.docs/sdd/specs/20261028-131603-feature-0230-red-contrast-failing-file-first/red/out/a3a-1.tools.txt` (el `git clone` con `Filename too long`); `tests/red-contrast-0230-red.md`, «Ruido de la tanda»
- **Dónde en el kit**: `tests/headless/battery.sh` (validación de `RUNS_DIR`); `.docs/sdd/tech-stack.md`, «Baterías por skill»
- **Por qué el kit no lo evitó**: `battery.sh` comprueba que `RUNS_DIR` sea absoluto, no su longitud. La línea nueva de `tech-stack.md` (de esta feature) lo dice, pero no lo impide
- **Coste**: parte del RED con ruido (2 sujetos sin llegar al merge), sin tanda repetida; respaldo: `tests/red-contrast-0230-red.md`
- **Propuesta**: que `battery.sh` rechace un `RUNS_DIR` de más de ~80 caracteres con un mensaje que proponga `.temp/<corto>` del worktree
- **Verificada**: sí — el GREEN en `.temp/r30` no dio `Filename too long`
- **Criterio de aceptación**: GIVEN `RUNS_DIR` de 190 caracteres WHEN se lanza `battery.sh` THEN sale con error antes del primer sujeto y nombra la ruta corta

### 4. La previsión de coste de sujetos usó el precio de otra skill, aunque `estimation.md` daba el bueno

- **Qué pasó**: previ 0,30 $ por sujeto, tomado de las campañas de la 0208 y la 0221. El RED costó 0,70 $ por sujeto, y la previsión del GREEN pasaba del techo de 7 $ a ~11 $: parada del dev-lead y enmienda. `estimation.md` ya dice «0,6–0,9 $ por sujeto de un turno».
- **Fuente**: `.docs/sdd/estimation.md`, «Coste en tokens y en dinero»; spec de la 0230, «Enmiendas»
- **Dónde en el kit**: constitution Art. I, «La previsión de coste»; `skills/sdd-propose/references/spec-writing.md`, que no la nombra
- **Por qué el kit no lo evitó**: la regla existía (`estimation.md`) y no la apliqué: tomé la referencia más cercana por tema en lugar de la tabla del método
- **Coste**: una parada del dev-lead y una enmienda; respaldo: spec de la 0230
- **Propuesta**: esperar a un 2.º ticket. Si se repite, mover el rango por sujeto de `estimation.md` al paso donde se escribe la previsión (Art. I), sin añadir otra línea
- **Verificada**: sí — contrastado con `.docs/sdd/estimation.md`
- **Criterio de aceptación**: GIVEN una spec con campaña de `sdd-archive` WHEN se escribe la previsión THEN usa ~0,70 $ por sujeto o cita `estimation.md`

### 5. Decidí solo «cerrar con lo medido» al tocar el techo de sujetos

- **Qué pasó**: con el GREEN en su techo de 13 sujetos, decidí no repetir `a3a` y dejar C4 como deuda, como ruling. El eje Spec de la revisión final lo marcó Important: el Art. I da esa decisión al dev-lead. Lo pregunté después y eligió repetir.
- **Fuente**: informe del eje Spec (Important 2); ledger del plan
- **Dónde en el kit**: constitution Art. I («se para y decide el dev-lead»); `skills/sdd-implement/SKILL.md`, «Deviations and rulings»
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: la presión del dev-lead («que noacabamos nunca?») me empujó a ahorrar la parada
- **Coste**: una ronda de la revisión final sobre un ruling que no era mío; sin respaldo de minutos
- **Propuesta**: esperar a un 2.º ticket
- **Verificada**: sí — contrastado con la constitution, Art. I
- **Criterio de aceptación**: GIVEN una campaña en su techo con una regla sin medir WHEN el hilo decide THEN pregunta al dev-lead antes de anotar la deuda

### 6. La regla de la intersección rama ∩ base del paso 6 no se cumple

- **Qué pasó**: con la rúbrica de `g5` ya en la regla de hoy, el sujeto corrió tras `sdd merge --sync` el gate `--affected --base develop` (lo que toca la rama), no la intersección vacía. Tampoco nombró `rooms:test: saltada (solo la toca la base)` (0/1).
- **Fuente**: `tests/red-contrast-0230-green.md`, fila `g5`; `green/out/g5-1.tools.txt:250`
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 6; `skills/sdd-archive/references/merge-recipe.md`, «The suite again»
- **Por qué el kit no lo evitó**: la regla vive en una frase larga del paso 6, después de la del caso sin suite; el sujeto aplicó la primera mitad
- **Coste**: un gate repetido sin necesidad en cada cierre con la base por delante (sin medir en campo); fila de deuda en el roadmap
- **Propuesta**: separar en el paso 6 los dos casos (sin suite / con suite) en dos viñetas, con el comando de la intersección escrito
- **Verificada**: sin verificar
- **Criterio de aceptación**: `g5` 2/2 en G5a y G5b

## Lo que hice por iniciativa propia

- En el cierre real de esta feature, el gate sobre el merge de sincronización dio un rojo en `kit:test-headless`. Lo contrasté con la receta nueva: el fichero solo, en la rama y en un worktree de `origin/develop` con `pnpm install`, en paralelo. El veredicto («también falla sin la rama») salió en ~2,5 min, frente a los 844 s del gate. Funcionó.

## Funcionó, no tocar

- La subida de carril de `sdd-propose` (pl1): pedida como patch, dos comportamientos nuevos, subida a lite con una pregunta.
- La re-revisión única cerró 13 hallazgos de dos ejes sin abrir otra.

## Menores

- `sdd task done` no sirve en lite sin plan (no hay task que leer): anoté la línea del ledger a mano — `skills/sdd-implement/SKILL.md`, Native loop paso 4
- `battery.sh` rechaza un `KIT_DIR` con `.docs/` o `tests/`, y el kit sin commitear hay que copiarlo a mano: un relanzamiento de 0 $ — `tests/headless/battery.sh`
- El `n` de un escenario no se puede bajar al lanzar: para el recorte copié la batería a una carpeta temporal — `tests/headless/battery.mjs`

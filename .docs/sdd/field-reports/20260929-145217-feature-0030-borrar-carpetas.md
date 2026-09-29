---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260929-145217-feature-0030-borrar-carpetas
task: 0030
mode: full
date: 2026-09-29
---

# Ticket para el kit — feature 0030: borrar carpetas con su contenido, Native, perfil delegate

## Contexto

- Carril y modo: feature full, perfil `delegate`, `execution: auto` (salió Native)
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates` (scripts de índice de
  capacidades, reserva de ids, vigía de silencio, tokens, estimation-log, capacidades, merge),
  `add-to-changelog`, `sdd-end-feature`, `sdd-feedback`; de superpowers, `brainstorming`,
  `writing-plans`, `executing-plans`, `test-driven-development`
- Proyecto: aplicación web interna, backend .NET 10 y frontend React, un dev-lead, Windows 11 con
  PowerShell como shell principal y worktree por feature
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (dos revisores de spec y dos re-revisiones), Opus 5.5
  (revisor final)
- Coste en reloj: 0,9 h de implementación; ~3 h de sesión con spec, esperas y cierre
- Coste en tokens: hilo 73,3 M; subagentes 3,4 M en 4 despachos (más una re-revisión mínima al final)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `bash <ruta>` desde PowerShell abre WSL y el ledger se escribe en la raíz de la unidad

- **Qué pasó**: el paso 6 dice que `task-start` y `task-done` «se lanzan con `bash <ruta>`». Con
  PowerShell como shell principal, `bash` resolvió a WSL, que no encontró el script. `sdd-workspace`
  devolvió una ruta vacía y el ledger se escribió en `D:\progress.md`, en la raíz de la unidad, que el
  harness no deja borrar. Hubo que repetir con la herramienta Bash (Git Bash).
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 («se lanzan con `bash <ruta>`»), y
  `references/encargo-revision.md` §«Rutas del workspace en Windows», que trata la ruta POSIX pero no
  el binario `bash`.
- **Por qué el kit no lo evitó**: la frase no distingue la herramienta Bash del harness del `bash`
  que encuentra PowerShell en el `PATH`; en Windows con WSL instalado, `bash.exe` es el de WSL.
- **Coste**: un fichero huérfano en la raíz de la unidad que el usuario tiene que borrar a mano, y
  una ronda de diagnóstico.
- **Propuesta**: decir «con la herramienta Bash (Git Bash), nunca `bash` desde PowerShell», y que el
  hilo compruebe que la ruta de `sdd-workspace` no esté vacía antes de escribir el ledger.
- **Criterio de aceptación**: GIVEN Windows con WSL instalado y PowerShell como shell principal WHEN
  el sujeto arranca Native THEN lanza `sdd-workspace` y `task-start` con la herramienta Bash y el
  ledger queda en `<repo>/.superpowers/sdd/<plan>/progress.md`; ningún fichero nuevo fuera del worktree.

### 2. Un gate en rojo en la rama de integración esconde los fallos nuevos de otra rama

- **Qué pasó**: el lint de markdown de la rama de integración ya estaba en rojo por ficheros de
  terceros. Otra rama (un patch) se cerró y fusionó con una entrada de changelog de 280 caracteres y
  tres palabras fuera del diccionario, que su gate no pudo distinguir entre las 234 incidencias
  previas. Esta feature arregló el lint de base en su rama, y el `-VerifyCommand` de
  `Invoke-SddMerge.ps1` falló sobre el resultado del merge por el fallo que había dejado la otra rama.
  Hubo que parar, preguntar al dev-lead, hacer un merge de sincronización, arreglar lo ajeno y
  re-revisarlo.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 7 (gate de cierre), el cierre de
  `sdd-end-patch` y `references/merge-recipe.md` §«Si el script falla».
- **Por qué el kit no lo evitó**: el gate de cierre solo mira si la suite sale verde; con la base en
  rojo, «sigue en rojo» no distingue lo heredado de lo nuevo, y nada pide comparar contra la base.
- **Coste**: una parada del dev-lead en el merge, un merge de sincronización, un commit de arreglo
  sobre trabajo de otra rama y una re-revisión.
- **Propuesta**: si el gate de cierre falla también en la base, el hilo compara el número o la lista
  de incidencias contra la base y trata las nuevas como propias; o el cierre bloquea hasta que la base
  esté en verde y lo dice.
- **Criterio de aceptación**: GIVEN la base con el lint en rojo por N incidencias y la rama que añade
  una más WHEN el sujeto corre el gate de cierre THEN informa «1 incidencia nueva» con su fichero y
  línea y no cierra hasta arreglarla.

### 3. La fusión del delta en `capabilities/` se hace a mano y pierde formato

- **Qué pasó**: para fusionar cinco `ADDED`, un `MODIFIED` y dos reglas en tres capacidades escribí
  un script ad hoc. La conversión de `**ADDED — título**` a `### título` se comió la línea en blanco
  tras el título. `Test-Capabilities.ps1` dio «válidas» igual; lo vi en el diff.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 4 y `references/aprendizajes-skills.md`
  (describe la fusión en prosa); `skills/sdd-templates/scripts/Test-Capabilities.ps1`.
- **Por qué el kit no lo evitó**: hay validador pero ningún script que fusione; cada cierre reinventa la
  lectura del delta.
- **Coste**: ~10 minutos y un riesgo de fusión mal hecha que el validador no ve.
- **Propuesta**: un `Merge-CapabilityDelta.ps1 -Artifact <spec.md>` que aplique ADDED, MODIFIED,
  REMOVED y las reglas por nombre, y que `Test-Capabilities.ps1` compruebe la línea en blanco tras cada
  título de requisito.
- **Criterio de aceptación**: GIVEN una spec con un `ADDED`, un `MODIFIED` y una regla WHEN se ejecuta
  el script THEN la capacidad queda con los requisitos en su sitio, línea en blanco tras cada título, y
  pasa `Test-Capabilities.ps1` y el lint de markdown sin tocar nada a mano.

## Lo que hice por iniciativa propia

- **Leer la consola del navegador en la verificación visual.** El aviso «two children with the same
  key» de React destapó un defecto real que ningún test cubría y que la captura no enseñaba: una misma
  línea repetida en la confirmación. Se reprodujo con un RED y se arregló. Candidato a regla del paso 6,
  en «Verificación visual»: leer la consola y tratar un error nuevo como hallazgo.
- **Preguntar como decisión aparte una diferencia visible entre el boceto elegido y la spec**, antes
  de la validación (el dev-lead eligió un boceto con viñetas y la spec fijaba los textos sin ellas). Se
  resolvió con una enmienda y una re-revisión del tramo.
- **Preguntar antes de `env:clean` si el entorno guardaba evidencia de otro trabajo abierto** (un
  fallo que investigaba otra sesión). El paso 10 manda `env:clean` sin más, y borra los volúmenes.
- **Re-revisión mínima con `effort-low` + Sonnet** para un tramo de tres palabras de diccionario
  fuera de `.docs/`, en vez del encargo completo del revisor final.

## Funcionó, no tocar

- La rúbrica de review de spec con dos lentes: 20 hallazgos, 19 aceptados en todo o en parte, entre
  ellos el `MODIFIED` no declarado del menú y la caché de la interfaz como fuente del aviso.
- La pregunta de producto con previsualización (paso 4 y la constitution): el dev-lead eligió en un
  mensaje.
- Guardar la copia de los RED fuera del repo y compararla con `git diff --no-index` antes de cada
  commit de task.
- La receta de parada por PID o puerto, con la comprobación de puerto libre antes y después.
- `Invoke-SddMerge.ps1`: paró bien en «verificación:» y sin `-Push`, al no haber remoto; la
  regeneración de `estimation-log.md` resolvió el único conflicto del merge de sincronización.
- `Get-NextSddId.ps1 -Reserve` para dar la rama de un patch que arrancaba en otra sesión.

## Errores míos, no huecos del kit

- En el gate de la spec, con `delegate` y la sesión en Opus, no ofrecí «Apruebo; escribe el plan y, si
  sale Native, para antes de la Task 1…»; lo pregunté tarde, ya con el plan escrito, y además recomendé
  seguir en Opus, contra el motivo del paso 4.
- El primer commit llevó el trailer del recordatorio del harness en vez del genérico que fija la
  constitution del proyecto; lo corregí con `--amend` antes de nada más.
- El plan salió sin la sección «Review Focus» que pide `writing-plans`; los cinco puntos los escribí
  directamente en el encargo del revisor final.

---
kit_version: 2.2.0
superpowers_version: 6.4.2
lane: patch
id: 20260930-084652-patch-0036-nombre-unico-por-carpeta
task: 0036
mode:
date: 2026-09-30
---

# Ticket para el kit — patch 0036: el guion de validación quedó tapado y la reproducción ensució el entorno del propio fix

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-templates` (plantilla del patch,
  `Test-Capabilities.ps1`, `Build-EstimationLog.ps1`, `Invoke-SddMerge.ps1`), `sdd-feedback`
- Proyecto: aplicación web interna con backend .NET, PostgreSQL y frontend SPA; monorepo pequeño,
  un dev-lead y el agente; ids en modo `sequence`, perfil `delegate`
- Modelo del hilo: Claude Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,5 h el fix; el cierre, tres turnos del usuario
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste
observado.

## Hallazgos

### 1. El guion de pruebas va en el mismo turno que la pregunta, y el diálogo lo tapa

- **Qué pasó**: en el paso 0 del cierre, el agente escribió el smoke y el guion en texto y, en el
  mismo turno, lanzó `AskUserQuestion`. El usuario contestó en «Otro»: «no me has dado ningún guion
  de prueba, me lo tendrías que dar para saber qué tengo que probar». El guion estaba, pero el
  diálogo se abrió encima. Hubo que repetirlo en un turno propio y pedir la respuesta en texto.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md`, paso 0: «para y presenta el smoke […] y un
  guion de pruebas […]; pregunta qué ha probado con `AskUserQuestion`, sola en su turno».
- **Por qué el kit no lo evitó**: «sola en su turno» se lee como «sin otras preguntas en la misma
  llamada», no como «sin el guion en el mismo turno». La frase no dice que el texto previo a la
  herramienta puede quedar oculto.
- **Coste**: un turno del usuario y la repetición del guion entero.
- **Propuesta**: decir que el guion va en un mensaje que termina el turno, y que la pregunta llega
  en el turno siguiente; o que, si el guion y la pregunta van juntos, la pregunta se hace en texto
  con las tres etiquetas.
- **Criterio de aceptación**: GIVEN un patch listo para cerrar en perfil `delegate`, WHEN el agente
  llega al paso 0, THEN el turno que contiene el guion no contiene ninguna llamada a
  `AskUserQuestion`, y el usuario puede contestar con una de las tres etiquetas sin pedir el guion.

### 2. La reproducción del fallo deja datos que rompen la verificación del fix

- **Qué pasó**: el paso 1 exige reproducir el fallo. El fallo era «entran filas repetidas», así que
  reproducirlo dejó filas repetidas en la base de datos del entorno del worktree. El fix era un
  índice único, cuya migración falla con esas filas. El entorno denegó el borrado masivo de los
  datos de la reproducción, y el API del worktree dejó de arrancar hasta que el usuario recreó el
  entorno a mano.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md`, paso 1 (reproducción) y paso 4
  (verificación). Ninguno dice dónde se reproduce ni qué se hace con lo que la reproducción escribe.
- **Por qué el kit no lo evitó**: el kit trata la reproducción como una lectura. Cuando el fallo
  consiste en datos que no deberían existir, reproducirlo los crea en el mismo sitio donde después
  hay que verificar.
- **Coste**: una denegación del entorno, una base de datos aparte creada sobre la marcha, un cambio
  temporal de la configuración local y un paso manual del usuario antes de poder validar.
- **Propuesta**: en el paso 1, una línea: si reproducir el fallo escribe datos, se hace en una base
  o un entorno desechable, distinto del que se usará para verificar, o se anota antes cómo se
  limpian y quién lo hace.
- **Criterio de aceptación**: GIVEN un patch cuyo fallo consiste en datos inválidos persistidos,
  WHEN el agente termina el paso 1, THEN el entorno del worktree arranca con el fix aplicado sin
  ninguna limpieza manual.

### 3. La fila del roadmap pide un test que la capa de tests del proyecto no puede expresar

- **Qué pasó**: la fila pedía un test con dos peticiones en paralelo. La capa de tests del proyecto
  usa un proveedor de datos en memoria que no aplica el mecanismo que el fix introduce, así que ese
  test habría pasado o fallado por azar. El agente lo sustituyó por uno que simula el error del
  motor y siguió sin parar, y lo contó al final.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md`, paso 1: el STOP cubre «no reproduce» y
  «exige interpretar requisitos», pero no «una instrucción del enunciado no es realizable tal cual».
- **Por qué el kit no lo evitó**: no hay regla para una instrucción de verificación inviable. El
  agente eligió entre parar y sustituir sin respaldo escrito.
- **Coste**: ninguno en reloj; una decisión sin el dev-lead que el usuario aceptó después.
- **Propuesta**: una línea en el paso 4: si el enunciado pide una verificación que la
  infraestructura del proyecto no puede dar, se sustituye por la más cercana que sí falle sin el
  fix, se dice en `patch.md` §3 y en el mensaje final, y no se para.
- **Criterio de aceptación**: GIVEN una fila que pide un tipo de test inviable en el proyecto, WHEN
  el agente implementa el patch, THEN `patch.md` tiene un párrafo que nombra el test pedido, el
  motivo y el sustituto, y el mensaje final lo lista como decisión sin el dev-lead.

### 4. `sdd-start-patch` se cargó de la 2.1.0 y el resto del kit de la 2.2.0

- **Qué pasó**: el proyecto declara `version: 2.2.0`. El comando de arranque cargó la skill desde la
  carpeta de la 2.1.0 de la caché; el cierre y el feedback, desde la 2.2.0. En la caché conviven
  1.1.0, 2.0.0, 2.1.0 y 2.2.0.
- **Dónde en el kit**: no se localiza en una skill: es la resolución del comando de arranque del
  plugin frente a la versión que declara `sdd-kit.json`.
- **Por qué el kit no lo evitó**: ninguna skill compara su propia versión con la del proyecto al
  arrancar.
- **Coste**: no observado en esta sesión; el riesgo es seguir un paso que la versión nueva cambió.
- **Propuesta**: que las skills de arranque comparen la versión de su carpeta con `sdd-kit.json` y
  avisen en una línea si difieren.
- **Criterio de aceptación**: GIVEN un proyecto en la 2.2.0 y una skill de arranque servida desde la
  2.1.0, WHEN arranca, THEN el primer mensaje del agente dice las dos versiones.

### 5. El formato de cierre de una fila de deuda no cubre la deuda saldada a medias

- **Qué pasó**: una fila de deuda juntaba dos cosas y el patch saldó una. El formato de cierre pide
  «prefijo al principio y texto original intacto», pensado para la fila entera. El agente puso un
  prefijo «saldada la parte de…; … sigue» y dejó el texto.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md`, paso 4, y `roadmap-template.md` de
  `sdd-templates`.
- **Por qué el kit no lo evitó**: solo describe saldar la fila y re-medirla.
- **Coste**: una decisión de formato sin respaldo.
- **Propuesta**: un tercer caso en el paso 4: saldo parcial, con un prefijo que dice qué parte se
  salda y cuál sigue.
- **Criterio de aceptación**: GIVEN una fila de deuda con dos partes y un patch que salda una, WHEN
  se cierra el patch, THEN la fila empieza por un prefijo que nombra la parte saldada y la que
  sigue, y no aparece como cerrada.

### 6. La receta del merge no dice qué gate usar si el proyecto no declara ninguno

- **Qué pasó**: la receta manda pasar en `-VerifyCommand` «el gate de merge que declara
  `tech-stack.md` §Testing». El proyecto no declara ninguno. El agente pasó la suite del backend,
  que era lo único que el patch tocaba.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, «El merge es un script».
- **Por qué el kit no lo evitó**: no hay rama para «sin gate declarado».
- **Coste**: una decisión sin respaldo.
- **Propuesta**: decir el valor por defecto: la suite de las zonas que toca el diff, y una línea en
  el mensaje final que propone declarar el gate.
- **Criterio de aceptación**: GIVEN un proyecto sin gate de merge declarado, WHEN el agente llama al
  script, THEN pasa un `-VerifyCommand` y el mensaje final dice cuál y que no estaba declarado.

## Lo que hice por iniciativa propia

- Extendí el fix al otro camino de escritura con el mismo hueco, que el enunciado no nombraba: con
  el mecanismo nuevo, ese camino habría pasado de colar el dato a dar un error de servidor.
  Funcionó y el usuario lo validó. Candidato a regla: antes de cerrar el paso 1, listar todos los
  caminos que escriben lo que el fix restringe.
- Verifiqué el fix en una base de datos aparte, creada en el mismo contenedor, cuando la del
  entorno quedó inservible. Funcionó, pero exigió cambiar y restaurar la configuración local.
- Comprobé que la migración falla sin dejar rastro sobre datos repetidos y lo anoté como caso
  esperado en §4.
- Añadí una palabra al diccionario del corrector porque el slug de la carpeta del patch no pasaba
  el lint. Candidato a nota en `nombrado.md`: un slug sin tildes puede caer en el corrector.

## Funcionó, no tocar

- La regla «la causa la determina tu investigación, no el reporte»: la reproducción midió el
  fallo antes de tocar nada y dio la evidencia de §1.
- «Validación para siempre en `delegate`»: «puedes cerrar» no se tomó como validación.
- `Invoke-SddMerge.ps1`: fusionó, verificó y dijo `push: no hecho: sin remoto` sin intervención.
- `Test-Capabilities.ps1` y `Build-EstimationLog.ps1`: una llamada cada uno, sin ajustes.

## Errores míos, no huecos del kit

- Di por hecho que una variable de entorno pisaba la configuración local del API; no la pisaba, y
  el primer arranque de verificación fue contra la base con los datos de la reproducción.
- Encadené la espera del API y los scripts en un solo comando sin comprobar antes que el API había
  arrancado; el comando agotó el tiempo y hubo que pararlo.

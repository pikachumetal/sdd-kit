---
kit_version: 2.2.0
superpowers_version: 6.4.2
lane: feature
id: 20260930-162320-feature-0026-cierre-frontend
task: 0026
mode: full
date: 2026-09-30
---

# Ticket para el kit — feature 0026: la pasada de fix de la revisión final se parte cuando un arreglo necesita al dev-lead

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native.
- Skills del kit usadas: `sdd-start-feature`, `sdd-templates`, `add-to-changelog`, `sdd-end-feature`,
  `sdd-feedback`.
- Proyecto: repositorio de plantillas de aplicación con el proyecto anidado en una subcarpeta;
  frontend SPA y backend de API; una persona como dev-lead. `ids.mode: sequence`.
- Modelo del hilo: el más capaz de la gama, toda la sesión.
- Modelos de los subagentes: gama media con effort medium (4 sujetos de RED/GREEN de una skill) y el
  más capaz con effort high (revisor final).
- Coste en reloj: ~2 h de implementación; la sesión duró ~5,5 h contando las esperas de respuesta.
- Coste en tokens: 64,4 M del hilo y 5,8 M de subagentes.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste
observado.

## Hallazgos

### 1. La pasada de fix «única» se parte en dos cuando un hallazgo es un freno de alcance

- **Qué pasó**: la revisión final devolvió un Important y once Minor. Al regraduar por efecto, dos
  Minor subieron y su arreglo tocaba ficheros fuera del Scope, y otro era un defecto previo (habría
  sido el tercer fix descubierto). Arreglé lo que no necesitaba al dev-lead, commiteé, pregunté, y
  arreglé el resto en un segundo commit. El resultado fueron dos commits de fix y la duda de si el
  segundo abría la re-revisión del tramo `<pasada de fix>..HEAD`.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 7 («La pasada de fix de la propia
  revisión final no abre la re-revisión… Un commit del hilo posterior a la pasada sí la abre») y
  paso 6 (frenos de alcance).
- **Por qué el kit no lo evitó**: el paso 7 supone una pasada de un solo tramo. No dice qué es la
  «pasada» cuando una parte espera una decisión del dev-lead, ni si los arreglos aprobados después
  son la misma pasada o un commit posterior.
- **Coste**: un turno de pregunta más, dos commits donde el kit espera uno, y una decisión mía sin
  respaldo (lo traté como una sola pasada y no lancé re-revisión).
- **Propuesta**: que el paso 7 diga el orden: regraduar, separar los hallazgos que son freno de
  alcance, preguntarlos todos en un solo turno antes de tocar nada, y hacer una única pasada con las
  respuestas. Y que diga que la pasada termina en el último commit que arregla hallazgos de esa
  revisión.
- **Criterio de aceptación**: GIVEN una revisión final con un Important arreglable y un hallazgo cuyo
  arreglo toca un fichero fuera del Scope · WHEN el hilo regradúa · THEN pregunta por el segundo
  antes de commitear el primero, hace un solo commit de fix con los dos y apunta una sola línea
  `Pasada de fix:`, sin re-revisión.

### 2. El freno «tercer fix descubierto» no dice si cuentan los fixes ya aprobados como enmienda

- **Qué pasó**: en una task aparecieron dos defectos que el dev-lead aprobó arreglar como enmienda
  de la spec. Después apareció un tercero menor (un patrón de un fichero de ignorados). No lo toqué
  por el freno, y tampoco sabía si los dos anteriores, ya aprobados, contaban para el recuento.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 y
  `skills/sdd-start-feature/references/control-profiles.md` (frenos de alcance).
- **Por qué el kit no lo evitó**: el freno cuenta «fixes descubiertos» sin decir si una enmienda
  aprobada reinicia el contador o deja de ser un fix descubierto.
- **Coste**: un defecto de una línea se quedó como deuda en el roadmap por prudencia.
- **Propuesta**: decir que un fix que el dev-lead aprueba como enmienda pasa a ser alcance y no
  cuenta, o que cuenta siempre. Cualquiera de las dos, escrita.
- **Criterio de aceptación**: GIVEN dos fixes descubiertos aprobados como enmienda y un tercero
  nuevo · WHEN el hilo lo encuentra · THEN dos sujetos de dos hacen lo mismo (los dos lo arreglan
  como ruling o los dos paran), citando la regla.

### 3. `Invoke-SddMerge.ps1 -VerifyCommand` corre en PowerShell, donde el toolchain del proyecto no está

- **Qué pasó**: el gate de merge del proyecto es un comando de `node`, y en esa máquina `node` solo
  resuelve en Git Bash. No pasé `-VerifyCommand` y comprobé el resultado del merge a mano, después,
  en el checkout de la rama destino.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md` («`-VerifyCommand`») y
  `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`.
- **Por qué el kit no lo evitó**: la receta da por hecho que el gate se puede lanzar desde la shell
  del script.
- **Coste**: la verificación quedó fuera del script: si hubiera fallado, el merge ya estaba hecho en
  la rama destino.
- **Propuesta**: que la receta diga cómo pasar un gate que necesita otra shell (por ejemplo,
  `-VerifyCommand "bash -lc '<comando>'"`) o que el script acepte `-VerifyShell`.
- **Criterio de aceptación**: GIVEN un proyecto cuyo gate solo corre en Git Bash · WHEN el cierre
  llama al script · THEN el gate se ejecuta sobre el resultado del merge antes de dejarlo en la rama
  destino, y un gate en rojo deja la rama destino como estaba.

### 4. `Test-Capabilities.ps1` no sirve en un repo con dos niveles de `.docs/sdd`

- **Qué pasó**: el comando del paso 4 del cierre (`-Path .docs/sdd`) falló con ~40 líneas: las
  capacidades de la raíz son punteros a las de un subproyecto, sin «Requisitos». Pasó al apuntarlo a
  la carpeta del subproyecto, que es donde vive la verdad.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 4 y
  `skills/sdd-templates/scripts/Test-Capabilities.ps1`.
- **Por qué el kit no lo evitó**: el kit conoce una sola `.docs/sdd` por proyecto.
- **Coste**: una ejecución en rojo y decidir por mi cuenta qué ruta era la buena.
- **Propuesta**: que el validador trate como válido un fichero de capacidad que declara ser puntero
  y enlaza otro que existe, y valide el destino; o que `-Artifact` busque cada capacidad del delta
  siguiendo el puntero.
- **Criterio de aceptación**: GIVEN una capacidad-puntero en la raíz que enlaza una capacidad
  completa en un subproyecto · WHEN se ejecuta el validador con `-Path .docs/sdd -Artifact <spec>` ·
  THEN sale con 0 y comprueba los títulos del delta contra el fichero enlazado.

### 5. La aplicación arrancada para la verificación visual muere mientras se espera al dev-lead

- **Qué pasó**: arranqué la aplicación en segundo plano para el primer paso y la dejé arrancada.
  Las tareas en segundo plano del harness tienen un tope de dos horas; mientras esperaba una
  respuesta, las mató. Lo descubrí al ir a verificar.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 («Al arrancar la aplicación, guarda
  su PID…») y `skills/sdd-start-feature/references/frontend-verification.md`.
- **Por qué el kit no lo evitó**: dice cómo parar lo arrancado, no cuándo: no distingue arrancar
  para una verificación de dejarlo arrancado entre paradas del usuario.
- **Coste**: un ciclo de comprobación de puertos y un rearranque.
- **Propuesta**: «arranca para cada verificación y para al terminarla; no la dejes arrancada a
  través de una pregunta al usuario».
- **Criterio de aceptación**: GIVEN una task con verificación visual seguida de una pregunta al
  dev-lead · WHEN el hilo termina la verificación · THEN para la aplicación por su puerto antes de
  preguntar, y la vuelve a arrancar para la verificación siguiente.

### 6. Dos instrucciones para el paquete del revisor final en Native

- **Qué pasó**: `executing-plans` manda ejecutar `review-package`; la referencia del kit manda no
  usarlo y construir el paquete con su receta. Ejecuté los dos: el primero sobró (131 kB con la
  carpeta de la spec dentro, frente a 78 kB).
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md` («Revisor final») y
  `skills/sdd-start-feature/references/overrides-superpowers.md`.
- **Por qué el kit no lo evitó**: el override está en una referencia que se abre al despachar; el
  paso 6 de `SKILL.md` no dice «no ejecutes `review-package`».
- **Coste**: una orden de más.
- **Propuesta**: una frase en el paso 6, junto al despacho del revisor final: «el paquete sale de la
  receta de `encargo-revision.md`, no de `review-package`».
- **Criterio de aceptación**: GIVEN una feature Native con la última task cerrada · WHEN el hilo
  prepara la revisión final · THEN construye el paquete una sola vez, con la receta del kit.

### 7. La primera pregunta «sola» choca con un enunciado que pide trabajo previo a la spec

- **Qué pasó**: el dev-lead pidió, en el mismo mensaje que arrancaba la feature, una pasada de un
  detector antes de la spec. Hice ese trabajo antes de la pregunta de carril, modo y perfil, porque
  su resultado cambiaba el recuento de tasks con el que se decide si partir.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 2.
- **Por qué el kit no lo evitó**: no contempla trabajo de reconocimiento pedido por el usuario entre
  el contexto y el enrutado.
- **Coste**: ninguno medido; una decisión sin respaldo.
- **Propuesta**: permitir un reconocimiento pedido de forma explícita antes de la primera pregunta,
  cuando su resultado entra en el recuento de tasks.
- **Criterio de aceptación**: GIVEN un enunciado que pide «antes de la spec, mide X» · WHEN arranca
  la skill · THEN el hilo mide y después hace la primera pregunta, con el recuento ya ajustado.

## Lo que hice por iniciativa propia

- **Reproducir en navegador lo que el revisor afirmaba de layout**, antes de arreglar, cuando un
  test de la suite no puede verlo (un desborde, un corte de breakpoint). «Reproducir antes de
  arreglar» habla de un test RED; para layout hice una medida antes y después. Funcionó: confirmó
  dos hallazgos y descartó el arreglo propuesto para un tercero.
- **Probar en una carpeta temporal cómo se comporta una herramienta externa** antes de escribir la
  decisión en la spec (cómo se acotan sus excepciones). Cambió una decisión ya tomada con el
  dev-lead y evité una enmienda posterior.
- **Reordenar tasks** para no bloquear: ejecuté la task de docs antes que la que esperaba la
  confirmación de modelos de los subagentes, con su ruling.
- **Preguntar los modelos de los subagentes tras el plan**, aunque `delegate` no tiene gate de plan:
  lo pedían las instrucciones del usuario.

## Funcionó, no tocar

- El revisor final en un worktree desanclado mientras el hilo corría el gate y fusionaba el delta
  como borrador: no hubo esperas.
- La tabla de smoke con una fila por THEN y tres valores de evidencia: obligó a decir «no probado»
  en dos cláusulas.
- `Measure-SessionTokens.ps1`: tres líneas pegadas tal cual.
- Los tests RED guardados fuera del repo y comparados con `git diff --no-index`.
- `Invoke-SddMerge.ps1`: un comando, con la rama destino sacada en otro checkout.
- El vigía de silencio: cinco despachos, ningún cuelgue, ningún falso aviso.

## Errores míos, no huecos del kit

- Un reemplazo de texto demasiado amplio cambió una clave de un objeto además de las clases que
  buscaba; lo vi en el diff.
- Atribuí un hallazgo del detector a un componente con una heurística propia y lo presenté al
  dev-lead; era de otro. Lo corregí al escanear ruta a ruta.
- Formateé una carpeta entera y toqué un fichero ajeno a la feature; revertido.
- Dejé derivar el directorio de trabajo de la shell y una herramienta escribió su caché en una
  subcarpeta.
- Afirmé en la spec un recuento («32») sin contarlo; lo cazó el revisor final.

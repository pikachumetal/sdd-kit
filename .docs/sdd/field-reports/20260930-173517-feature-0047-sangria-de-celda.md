---
kit_version: 2.2.0
superpowers_version: 6.4.2
lane: feature
id: 20260930-173517-feature-0047-sangria-de-celda
task: 0047
mode: lite
date: 2026-09-30
---

# Ticket para el kit — feature 0047: arreglo de formato en lite, cierre bloqueado por el destino sacado

## Contexto

- Carril y modo: feature lite
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates` (índice de capacidades,
  vigía de silencio, `Measure-SessionTokens`, `Build-EstimationLog`, `Test-Capabilities`,
  `Invoke-SddMerge`), `sdd-end-feature`, `sdd-feedback`
- Proyecto: aplicación interna de gestión documental, backend .NET y frontend React, monorepo con moon,
  un dev-lead y agentes en worktrees paralelos
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (revisor final, effort medium)
- Coste en reloj: ~1 h (spec con medida ~0,5 h, implementación, revisión y smoke ~0,5 h)
- Coste en tokens: hilo 14.697.644; subagentes 171.098 en 1 despacho

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El cierre descubre el destino sacado y sucio después de hacerlo todo

- **Qué pasó**: el paso 10 de `sdd-end-feature` ejecutó `env:clean`, juntó el cierre en un commit y
  llamó a `Invoke-SddMerge.ps1`, que falló con `destino sacado: 'develop' tiene cambios sin guardar en
  '<checkout principal>':  M .gitignore`. El cambio era de otra sesión. La feature acabó «No terminado»
  y hace falta otro turno del dev-lead para fusionar.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 0 y paso 10; `references/merge-recipe.md`
  «Cuándo no se llama».
- **Por qué el kit no lo evitó**: la comprobación del destino solo existe dentro del script, al final.
  Nada la adelanta a un momento en que el dev-lead todavía está delante.
- **Coste**: un turno más y la feature sin fusionar; el dev-lead se entera al final del cierre, no al
  validar, cuando podía resolverlo en paralelo.
- **Propuesta**: en el paso 7 de `sdd-start-feature` (al presentar la validación) o en el paso 0 de
  `sdd-end-feature`, ejecutar la misma comprobación de destino del script en modo solo lectura
  (p. ej. `Invoke-SddMerge.ps1 -CheckOnly`) y, si falla, meter en la pregunta de validación los ficheros
  que bloquean el merge.
- **Criterio de aceptación**: GIVEN la rama destino sacada en el checkout principal con un fichero
  modificado sin commitear, WHEN el agente presenta la validación, THEN la presentación nombra ese
  fichero como bloqueo del merge antes de que el dev-lead valide. Hoy lo nombra solo el mensaje final.

### 2. El squash del cierre deja en el walkthrough shas que dejan de existir

- **Qué pasó**: en lite no hay `tasks.md`. Los borradores del paso 7 (el walkthrough) citaban el sha de
  la pasada de fix. El paso 10 junta el cierre desde el commit de la última task, así que ese sha salía de
  la rama. Lo vi con un `grep` por mi cuenta y lo reescribí como «juntada en el cierre».
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 10, la frase «reescribe en `tasks.md`
  cada línea `Pasada de fix:`…».
- **Por qué el kit no lo evitó**: la regla solo nombra `tasks.md`. En lite, el paso 6 de
  `sdd-start-feature` manda apuntar la revisión «en la presentación de la validación», y de ahí pasa al
  walkthrough, que la regla no cubre.
- **Coste**: bajo en esta sesión (lo detecté), pero el fallo es silencioso: un walkthrough con un sha no
  alcanzable.
- **Propuesta**: extender la frase del paso 10 a todo fichero del commit de cierre que cite un sha del
  tramo que se junta (walkthrough incluido), o ejecutar el squash antes de escribir los shas.
- **Criterio de aceptación**: RED — una feature lite con pasada de fix y walkthrough en borrador que cita
  su sha; tras el paso 10, `git merge-base --is-ancestor <sha citado> HEAD` falla para algún sha del
  walkthrough. GREEN: todos los shas citados son ancestros de `HEAD`.

### 3. El modelo del revisor final choca con una regla de coste del usuario

- **Qué pasó**: `references/encargo-revision.md` «Revisor final» fija `sdd-kit:effort-high` + `opus`.
  Las instrucciones globales del usuario piden justificar el modelo de cada subagente, elegir el más
  barato que resuelva y pedir confirmación antes de lanzarlo. Paré para preguntar; el dev-lead eligió
  Sonnet con effort medium, y lo registré como decisión con el dev-lead.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, sección «Revisor
  final»; `skills/sdd-start-feature/SKILL.md` paso 6.
- **Por qué el kit no lo evitó**: el kit da el techo como obligatorio sin prever que una instrucción del
  usuario pida confirmar o abaratar el modelo, ni dónde meter esa pregunta para no añadir una parada.
- **Coste**: una parada extra (pregunta aislada) justo antes del despacho.
- **Propuesta**: permitir que la primera pregunta del paso 2 (carril, modo, perfil) incluya el modelo
  del revisor final cuando las instrucciones del usuario exigen confirmar modelos, con el del kit como
  recomendado y el más barato razonable como alternativa; y decir que la elección del usuario prevalece y
  se registra.
- **Criterio de aceptación**: GIVEN unas instrucciones de usuario que exigen confirmar el modelo de todo
  subagente, WHEN arranca una feature, THEN la primera pregunta ya pide el modelo del revisor final y no
  hay otra parada antes de despacharlo.

### 4. Sin gate de merge declarado, `-VerifyCommand` queda a criterio del agente

- **Qué pasó**: la receta dice que `-VerifyCommand` es «el gate de merge que declara `tech-stack.md`
  §Testing». El proyecto no tiene esa sección ni hook `pre-merge-commit`. Pasé la suite del backend por
  criterio propio.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, «El merge es un script».
- **Por qué el kit no lo evitó**: no dice qué hacer cuando no hay gate declarado.
- **Coste**: bajo; una decisión sin respaldo.
- **Propuesta**: una frase para ese caso (omitirlo, o usar la suite completa del paso 7) y un aviso en
  el mensaje final de que falta la declaración.
- **Criterio de aceptación**: GIVEN un `tech-stack.md` sin §Testing y sin hook, WHEN el agente llama al
  script, THEN el comando que usa sale de una regla escrita y el mensaje final dice que el proyecto no
  declara gate de merge.

### 5. Los borradores del paso 7 no pasan el lint hasta el cierre

- **Qué pasó**: el walkthrough y el aprendizaje en un anclaje, escritos como borradores mientras
  revisaba el revisor, fallaron el corrector ortográfico del lint de docs en el cierre (una palabra de
  una herramienta y un enclítico). Hubo que corregir y relanzar.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 7 (borradores) y `sdd-end-feature` paso 10.
- **Por qué el kit no lo evitó**: los borradores se escriben fuera del gate completo del paso 7, que ya
  había corrido antes.
- **Coste**: una ronda de lint en el cierre.
- **Propuesta**: pasar el lint de docs sobre los borradores al escribirlos, o correr el gate completo
  después de los borradores.
- **Criterio de aceptación**: GIVEN un borrador con una palabra que el corrector no conoce, WHEN se
  presenta la validación, THEN el lint ya lo ha señalado y corregido.

## Lo que hice por iniciativa propia

- Medí la geometría de formato contra la aplicación de hoja de cálculo real exportando a PDF por COM y
  leyendo posiciones con `pdfplumber`, y medí igual el `.docx` resultante con el procesador de textos.
  Dio el número de la spec con evidencia, en vez de una constante supuesta. Funcionó.
- Escaneé todos los ficheros reales del paquete para ver qué combinaciones existen antes de fijar el
  alcance. Sacó un caso (sangría a la derecha, 161 estilos) que el enunciado no mencionaba. Funcionó.
- Para responder si un proceso ya ejecutado (una importación) había que relanzarlo, hice un smoke en dos
  fases: datos creados con el código de la rama de integración en un worktree desanclado y abiertos luego
  con el de la rama. Probó la respuesta en vez de deducirla. Candidato a patrón para cualquier «¿hay que
  migrar lo existente?».

## Funcionó, no tocar

- El predicado de modo lite citado condición por condición en la primera pregunta: una sola respuesta
  resolvió carril, modo y perfil.
- El índice de capacidades: abrí solo las dos que tocaba.
- La copia de los RED fuera del repo y el `git diff --no-index` antes del commit.
- El revisor final en segundo plano en un worktree anclado al sha, con el paquete de la receta (311
  líneas): volvió en ~1 min con un hallazgo real.
- La regla de que un «sí» sin detalle a la pregunta de validación es validación: sin repregunta.

## Errores míos, no huecos del kit

- El primer escaneo de los ficheros reales usó una expresión regular que no encontraba nada y lo di por
  bueno un momento. Repetí el escaneo con otra expresión.
- Arranqué el API por primera vez antes de saber que el smoke necesitaba dos versiones del código, y
  tuve que pararlo y arrancar el antiguo.

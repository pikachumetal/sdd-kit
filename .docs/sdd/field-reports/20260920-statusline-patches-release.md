# Feedback de uso del sdd-kit (2) — patches y primera release del proyecto `statusline`

- **Origen:** agente Claude (Fable 5.1) en Claude Code, sesión del 2026-09-20.
- **Skills usadas:** `sdd-start-patch` y `sdd-end-patch` (dos veces), `sdd-start-release` (dos veces), `sdd-end-release` (una vez). Kit v1.1.0.
- **Proyecto:** `statusline` — un fichero Node, un desarrollador, sin cliente, sin gestor de tickets, git-flow.
- **Continúa a:** `sdd-kit-feedback-statusline.md` (init greenfield), ya entregado.

Dos hallazgos validados por el dev-lead (H1, H2) y cuatro menores que no ha visto todavía (M1–M4).
Descartados por el dev-lead y fuera de este ticket: la numeración sin gestor de tickets (ya la
tenéis documentada) y el walkthrough retroactivo (fue una excepción de este proyecto, no debe
convertirse en práctica).

---

## H1. `sdd-end-patch` no dice qué hacer con las capabilities

- **Qué pasó:** los dos patches cambiaron comportamiento observable.
  - `worktree-name`: el nombre del worktree pasó a salir de `git` y no del JSON, y el nombre del repo dentro de un worktree pasó a ser el del repo principal.
  - `installer-update`: requisito nuevo, «update sobre una instalación existente».
- **Evidencia:** el checklist de `sdd-end-patch` tiene seis pasos (`patch.md`, commits, changelog, roadmap, estimation-log, rama). Ninguno menciona `capabilities/`. `patch-template.md` tampoco. La regla anti-proliferación 3 de `capability-template.md` dice que quien fusiona el delta es `sdd-end-task`, y no nombra a los patches.
- **Qué hice:** actualicé las capabilities por mi cuenta, con el formato de delta de `sdd-end-task`: `MODIFIED <título> (antes: …)` y `ADDED <título>`, más una línea de historial `<fecha> — patch <id> (<slug>) — …`.
- **Riesgo si no se hace:** `capabilities/` es «la verdad viva del comportamiento». Un patch que no la toca la deja mintiendo desde el primer fix, y la siguiente task la lee como cierta.
- **Tensión con la definición de patch:** un patch es «determinista, sin interpretar requisitos». Si cambia un requisito de una capability, ¿sigue siendo un patch? En mis dos casos sí lo era (un bug con causa única, y el comportamiento correcto era obvio o lo decidió el usuario en una frase), pero la frontera no está escrita.
- **Propuesta:**
  1. Paso nuevo en `sdd-end-patch`: «si el fix cambia comportamiento descrito en `capabilities/<capability>.md`, fusiona el delta (`MODIFIED`/`ADDED`/`REMOVED`) y añade la línea de historial con `patch <id>`. Si el patch solo devuelve el comportamiento a lo que la capability ya decía, no hay delta».
  2. Sección opcional en `patch-template.md`: «Delta de capabilities — _ninguno_ / lista».
  3. Una línea en el diagrama de decisión de `sdd-start-patch`: corregir el código para que cumpla la capability es patch; cambiar la capability porque el requisito era otro es task, salvo que el cambio sea de una frase y lo decida el usuario en el momento.
  4. Actualizar la regla 3 de `capability-template.md` para que nombre también a `sdd-end-patch`.

## H2. `sdd-end-release` pide una segunda confirmación de merge y tag en proyectos de una sola persona

- **Qué pasó:** el usuario dijo «si lo tienes todo ya, puedes cerrarla» y, al corregirme la versión, escribió `v1.0.0` de forma explícita. Preparé los pasos 1–6 y, por el gate del paso 7, paré a pedir confirmación otra vez antes del merge a `main` y del tag. El usuario la dio, pero fue una ronda más sin información nueva.
- **Evidencia:** el gate es deliberado. La tabla de racionalizaciones lo cubre de forma literal: «El usuario ya nombró la versión en su encargo: la doy por confirmada y ejecuto merge+tag → la confirmación se pide sobre la propuesta final de cierre».
- **Por qué existe y por qué aquí sobra:** el gate protege de publicar algo que el usuario no ha visto (changelog sellado, notas para el cliente, scope movido). En un proyecto sin cliente, con un solo desarrollador que es a la vez dev-lead y PO, y con un scope que ya estaba hecho al abrir la release, la propuesta final no contiene nada que el usuario no haya decidido ya.
- **Matiz importante:** en esta misma release el gate sí me frenó un error real. Asumí `v0.1.0` porque el usuario no había respondido a la pregunta de versión, y él lo rechazó. Así que la confirmación de **versión** no sobra nunca; lo que sobra es repetir la de **merge + tag** cuando ya se dio.
- **Propuesta:** no quitar el gate, acotarlo. «Si el usuario ha autorizado el cierre Y ha confirmado la versión de forma explícita en esta conversación, Y no hay cliente ni scope movido desde esa autorización, el merge y el tag se ejecutan tras presentar el resumen de cierre, sin segunda ronda. Si falta cualquiera de las tres condiciones, el gate se mantiene tal cual.» La condición debe ser comprobable, no una impresión del agente.

---

## Menores (no validados por el dev-lead)

### M1. «Comprometida» y «en preparación» no se explican

- **Qué pasó:** en `sdd-start-release` pregunté al usuario si la release quedaba «comprometida» o «en preparación». Respondió «no te entiendo».
- **Evidencia:** el paso 4 usa los dos términos sin definirlos. Se entienden en un contexto con cliente y fecha; en un proyecto personal no significan nada.
- **Propuesta:** una línea de definición («comprometida = scope prometido a alguien, normalmente con fecha») y una regla: sin cliente ni fecha, el estado es «en preparación» y no se pregunta.

### M2. Las release notes asumen que hay cliente

- **Qué pasó:** `release-notes-template.md` tiene las secciones «Para <rol>» y «Por vuestra parte», y el paso 5 habla de «release notes de cliente» y de un borrador de email. Aquí no hay cliente. Escribí las notas para «quien instala la herramienta» y no creé el email.
- **Propuesta:** decir qué hacer sin cliente: o se omiten las notas y basta el changelog sellado, o se escriben para el usuario final con las secciones de cliente marcadas como opcionales. Y que el email sea explícitamente «solo si hay a quién enviarlo».

### M3. «Bump con el tooling del proyecto» sin tooling

- **Qué pasó:** el paso 7 pide hacer el bump de versión. El proyecto no tiene `package.json` ni ningún fichero de versión: la versión vive solo en el tag y en el changelog.
- **Propuesta:** «si el proyecto tiene fichero de versión, bump con su tooling; si no, la versión vive en el tag y en el changelog, y no se crea un fichero solo para esto».

### M4. La línea «smoke: <fecha> · <N> hallazgos» no define qué cuenta como smoke ni como hallazgo

- **Qué pasó:** no hubo una sesión de smoke como tal. Conté como smoke la ejecución de los tests, el lanzador real en los dos perfiles instalados y una instalación limpia; y como hallazgo, el bug de `install.ps1`, que apareció al reinstalar tras el primer patch y se corrigió dentro de la misma release. Otro agente habría puesto «0 hallazgos» o «smoke: pendiente» con los mismos hechos.
- **Propuesta:** una definición mínima en `notas-y-roadmap.md`: qué es el smoke de una release (quién lo ejecuta, sobre qué), y si un defecto encontrado y corregido dentro de la release cuenta como hallazgo. Si la métrica se va a comparar entre releases, tiene que contarse igual siempre.

---

## Lo que funcionó bien

- **`Build-EstimationLog.ps1` con un tiempo no medido.** Un walkthrough con «Esfuerzo real: —» no rompió el script: avisó (`Bloque de tiempo presente pero sin esfuerzo real legible … Fila excluida`) y generó el log sin esa fila. Es justo lo correcto: un hueco visible en vez de un número inventado.
- **La causa raíz obligatoria de `sdd-start-patch`.** En el primer patch, la hipótesis del reporte («los worktrees salen como GUID») era solo el síntoma. La investigación encontró un segundo síntoma con la misma causa (el nombre del repo), que el usuario no había visto.
- **«Proponer no es decidir» de `sdd-start-release`.** El usuario amplió el scope que yo recomendaba (de cuatro a siete items) y movió tres módulos a una `v2.0.0`. Si hubiera escrito mi recomendación como definitiva, habría que haberla deshecho.
- **La retro con action items verificables.** Obligó a convertir dos errores míos en algo comprobable en la siguiente retro, en vez de una disculpa.

## Errores míos, no del kit

- En el primer patch usé `git add -A` y entró en el commit un fichero que el usuario aún no había decidido versionar. Corregido con un amend antes de publicar.
- Asumí la versión `v0.1.0` porque el usuario no había respondido a esa pregunta. La rechazó.
- Al marcar filas del roadmap con un reemplazo automático, uno falló y dejó una tabla con la cabecera de 4 columnas y el separador de 3. Lo detecté en la salida y lo corregí antes del commit.

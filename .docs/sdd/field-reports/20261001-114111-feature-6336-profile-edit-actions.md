---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20261001-114111-feature-6336-profile-edit-actions
task: 6336
mode: full
date: 2026-10-01
---

# Ticket para el kit — feature 6336: un ajuste pequeño de diseño (quitar un botón y recolocar otro) que costó casi 3 h

> Segunda feature de una sesión que ya había generado el ticket `20261001-075221-feature-6304-close-survey`. Va en su propio ticket por decisión del dev-lead (ver hallazgo 5).

## Contexto

- Carril y modo: feature full (lite descartado por una migración), perfil `pair`, modo `incremental`, subagentes `solo-contexto`, tests `preguntar`
- Skills del kit usadas: `sdd-start-feature`, `sdd-end-feature`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans` y `executing-plans` (Native)
- Qué pedía: en una pantalla de edición de perfil, quitar un botón de «guardar borrador» y mover el otro botón a la derecha de la cabecera. Unas 60 líneas de cambio en 6 ficheros, más una migración de dos líneas que da de baja los dos textos del botón quitado
- Modelo del hilo: Opus 5.5. Subagentes: un revisor final Opus (`sdd-kit:effort-high`)
- Coste en reloj: ~2,9 h de pared desde la rama hasta el merge. El walkthrough apunta 1,3 h de implementación contra 1 h estimada, porque mide desde el commit de apertura: deja fuera ~1 h de spec y plan y ~0,5 h de cierre
- Coste en tokens: hilo 27 M, revisor final 1,5 M

El dev-lead lo resume así al cerrar: «el proyecto o el sddkit siguen teniendo un problema de tiempo con tareas pequeñas de diseño como ocultar cosas y ponerlas en columnas, es importante optimizar esto». El reparto del tiempo, sacado de las marcas de los commits:

| Tramo | Reloj | Qué lo llenó |
| --- | --- | --- |
| Arranque, spec y plan | ~1 h | 4 paradas del dev-lead (carril, spec, nivel de tests, plan) y un plan entero para una sola task |
| Código y tests | ~20 min | el trabajo real |
| Verificación visual | ~30 min | entrar en una pantalla autenticada desde un script (ver hallazgo 4) |
| Revisión final, fix y decisiones | ~30 min | revisor final, una pasada de fix y otra parada del dev-lead con 3 decisiones |
| Smoke, validación y cierre | ~40 min | otro login, gate completo, walkthrough, capacidad nueva, roadmap, merge |

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El carril de patch no admite quitar un elemento, así que «ocultar y recolocar» acaba en feature

- **Qué pasó**: el patch de presentación solo admite mover, envolver o cambiar la clase de un elemento, sin quitar bindings, eventos ni texto visible. Quitar un botón quita su `(click)` y su texto, así que la petición fue a feature por la letra del predicado, aunque el dev-lead la ve como un ajuste de diseño. La feature arrastró spec, plan, dos gates y una capacidad nueva.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 2 (el predicado del patch de presentación) y la tabla de puertas de `using-sdd`.
- **Por qué el kit no lo evitó**: el predicado protege de meter lógica nueva en un patch, pero trata igual añadir y quitar. Quitar un elemento y el código que solo él usaba (su handler, sus textos) no añade comportamiento, solo lo retira, y una captura lo verifica igual que un movimiento.
- **Coste**: el carril full entero, ~1 h de spec y plan, para unas 60 líneas.
- **Propuesta**: que el patch de presentación admita una **retirada**: quitar elementos visibles y lo que queda muerto por quitarlos (handlers, señales y claves de i18n que nadie más usa), sin añadir nada. Lo que se retira se lista en el `patch.md` y se verifica con captura y suite. Si la retirada cambia lo que el usuario puede hacer (aquí, guardar sin enviar), el patch lo dice en una línea y el dev-lead lo acepta en el mismo gate.
- **Criterio de aceptación**: GIVEN la petición «quita el botón de guardar borrador y pon el de confirmar a la derecha del título», WHEN se enruta, THEN va a `sdd-start-patch`, con una línea que nombra la capacidad que se pierde y la captura como verificación. Hoy (RED) va a `sdd-start-feature`.

### 2. Una migración que solo da de baja textos tumba el modo lite

- **Qué pasó**: el resto del predicado de lite se cumplía (flujo existente, sin contrato, un área, menos de media jornada). Pero la baja de los dos textos huérfanos exige una migración, y «no exige migración» descarta lite. La alternativa era dejar los textos huérfanos como deuda. El modo full añadió `plan.md`, su gate y la pregunta del nivel de tests.
- **Dónde en el kit**: `skills/sdd-start-feature/references/modo-lite.md`, la condición «No toca schema de datos ni exige migración».
- **Por qué el kit no lo evitó**: la condición no distingue un cambio de schema de una migración de datos reversible y sin estructura (un soft-delete de términos de traducción, un alta de catálogo).
- **Coste**: un plan de 180 líneas para una task, y dos paradas más.
- **Propuesta**: que la condición sea «no cambia el schema». Una migración solo de datos, idempotente y reversible (alta o baja de textos o de filas de catálogo) no descarta lite, pero se nombra en la spec.
- **Criterio de aceptación**: GIVEN un cambio de una pantalla cuya única migración da de baja dos textos con un procedimiento idempotente, WHEN `sdd-start-feature` cita el predicado de lite, THEN lo ofrece como lite y nombra la migración. Hoy (RED) lo descarta.

### 3. En `pair`, una feature de una task para siete veces

- **Qué pasó**: el dev-lead contestó siete veces: carril y modo, aprobación de la spec, nivel de tests (`Tests: preguntar`), aprobación del plan, tres decisiones tras la revisión final, validación y merge. Para una task, el gate del plan repite el de la spec: el plan solo añadía «una task, Native» y el coste.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` pasos 2, 4 y 5, y la [tabla de gates] de `references/control-profiles.md`.
- **Por qué el kit no lo evitó**: cada gate se justifica solo, pero nadie cuenta el total en una feature pequeña. El nivel de tests se pregunta aparte, antes del plan, aunque la primera pregunta ya era el sitio natural.
- **Coste**: cada parada es un turno del dev-lead y un hueco de reloj mientras no contesta.
- **Propuesta**: (a) con `Tests: preguntar`, el nivel va en la primera pregunta, junto a carril y modo; (b) en `pair`, con una sola task prevista, la spec y el plan se aprueban en el mismo gate: el plan se escribe antes de presentar y la pregunta aprueba los dos.
- **Criterio de aceptación**: GIVEN `pair`, `Tests: preguntar` y una feature de una task, WHEN se recorre del enunciado a la primera línea de código, THEN el dev-lead contesta como mucho dos veces (arranque y spec+plan). Hoy (RED) son cuatro.

### 4. La verificación visual de una pantalla autenticada no tiene receta de acceso

- **Qué pasó**: el paso 6 manda verificar con un script de Playwright si no hay MCP, y está bien. Pero la pantalla pedía sesión de un rol concreto, y nada del kit dice cómo entra un script. Fueron ~30 min de rodeo:
  - no hay contraseña conocida de ninguna cuenta de prueba;
  - el acceso por enlace mágico tiene un intervalo mínimo entre envíos, así que cada relanzamiento del script esperaba o fallaba;
  - el estado guardado del navegador no conserva la sesión, porque el token vive en `sessionStorage`.

  En la validación, el dev-lead tampoco pudo entrar con su cuenta, que no existía en la base local.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 («Verificación visual») y `environments-template.md`, que no tiene sección de acceso.
- **Por qué el kit no lo evitó**: el kit da por hecho que levantar la aplicación basta para mirarla, pero en una aplicación con login, mirar exige entrar.
- **Coste**: ~30 min de esta feature, y lo paga de nuevo cada feature de UI con login.
- **Propuesta**: una sección «Acceso de verificación» en `environments-template.md`: por rol, qué cuenta usar y cómo entra un script (contraseña sembrada, enlace leído del servidor de correo local, o un endpoint solo de desarrollo). El paso 6 la lee antes de escribir el script. Si falta, el cierre de la primera feature que la necesita la crea o añade la fila de deuda.
- **Criterio de aceptación**: GIVEN un proyecto con `environments.md` que declara el acceso del rol candidato, WHEN una feature de UI de ese rol llega a la verificación visual, THEN el script entra a la primera, sin probar métodos. Hoy (RED) no hay sección, y el sujeto la descubre leyendo el backend.

### 5. «Un ticket por sesión» mezcla features distintas en un fichero con el nombre de la primera

- **Qué pasó**: la sesión cerró dos features y ya tenía el ticket de la primera. Siguiendo la regla, añadí los hallazgos de la segunda como sección del ticket de la primera, cuyo nombre lleva el id y el slug de esa primera. El dev-lead preguntó por qué el feedback de la segunda estaba en el documento de otra tarea, y hubo que moverlo a su propio ticket.
- **Dónde en el kit**: `skills/sdd-feedback/SKILL.md` paso 4 («Si esta sesión ya tiene ticket, se amplía; no nace un segundo») y el paso 11 de `skills/sdd-end-feature/SKILL.md` («se ofrece salvo que esta sesión ya haya generado el suyo»).
- **Por qué el kit no lo evitó**: la regla supone una feature por sesión. El fichero se nombra por feature (`<ts>-feature-<id>-<slug>`), pero se cuenta por sesión, y las dos unidades no coinciden cuando una sesión encadena features.
- **Coste**: un turno del dev-lead, un commit de corrección y un ticket que, sin la corrección, nadie habría encontrado buscando por la segunda feature.
- **Propuesta**: un ticket por feature o patch. «Se amplía» solo si el ticket existente es de la misma feature. El paso 11 de `sdd-end-feature` ofrece el ticket en cada cierre que aún no lo tenga, aunque la sesión ya haya generado otro.
- **Criterio de aceptación**: GIVEN una sesión que ya escribió el ticket de la feature A, WHEN cierra la feature B y el dev-lead da feedback, THEN nace `<ts>-feature-B-<slug>.md` y el de A no cambia. Hoy (RED) la regla manda ampliar el de A.

## Lo que hice por iniciativa propia

- **Medir el solape con rectángulos** (`getBoundingClientRect`, intersección con los controles flotantes) en cada ancho, tema y tamaño de letra, en vez de mirar capturas. Así salió que el botón bajaba de línea a 1280 px, lo que una captura de un solo ancho habría tapado. Candidato a ejemplo en el paso 6: «medir en estilos computados» con un caso de geometría.
- **Usar el diálogo de confirmación para crear el estado previo**: guardar y cancelar el envío deja un borrador sin enviar, así que pude probar en real el escenario «borrador de antes» sin el botón que lo creaba.

## Funcionó, no tocar

- **La revisión final con el modelo más capaz, también para ~60 líneas**, en 5 min y 1,5 M tokens. Encontró:
  - un campo de ejemplo de la spec que el modelo de datos no tiene;
  - una skill del proyecto contradicha por el cambio;
  - una regresión de feedback (sin spinner mientras guarda).

  Ninguno lo habría visto el hilo.
- **La re-gradación de un Minor por su efecto** (`executing-plans`): el spinner perdido era una regresión introducida por la feature, y subió a la pasada de fix con su test RED.

## Errores míos, no huecos del kit

- **Repetí el error de la 6304**: un regex con barras pasado por `node -e` perdió las barras invertidas, dos veces. La regla práctica (editar scripts con la herramienta de edición, no con `node -e` ni `sed`) ya estaba aprendida y no la apliqué.
- **Escribí el ejemplo de la spec con un campo (teléfono) que el perfil no tiene**, sin mirar el modelo. Lo cazó la revisión final, y costó una enmienda y una pregunta al dev-lead.
- **Encadené el formateador y el commit con `&&`**: el formateador falló, el mensaje del commit se quedó sin escribir y el commit salió con el mensaje de la apertura. Lo corregí con un `--amend` antes de publicar.

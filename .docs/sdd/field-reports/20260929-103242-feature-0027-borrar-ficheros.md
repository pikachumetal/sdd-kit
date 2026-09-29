---
kit_version: 2.0.0 (sdd-kit.json; plugin instalado 2.1.0)
superpowers_version: 6.4.2
lane: feature
id: 20260929-103242-feature-0027-borrar-ficheros
task: 0027
mode: full
date: 2026-09-29
---

# Ticket para el kit — feature 0027: revisor final Sonnet frente a Opus, medido con 10 pasadas

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native
- Skills del kit usadas: `sdd-start-feature`, `sdd-templates`, `sdd-end-feature`, `add-to-changelog`,
  `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`, `executing-plans`,
  `test-driven-development`
- Proyecto: aplicación web con backend .NET, frontend React, PostgreSQL y un editor de documentos
  externo; una persona (el dev-lead) más el agente
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (review de spec, revisiones finales, re-revisiones) y
  Opus 5.5 (revisiones finales), todos con `sdd-kit:effort-high` salvo la review de spec
  (`effort-medium`)
- Coste en reloj: ~2,1 h de hilo (estimado 9 h, ratio 0,23)
- Coste en tokens: hilo 145.232.580; subagentes 27.354.148 en 12 despachos (según
  `Measure-SessionTokens.ps1`)

## Cómo leer este ticket

Los hallazgos son hipótesis a comprobar con RED/GREEN, no cambios aprobados, y van ordenados por coste
observado.

## Hallazgos

### 1. El revisor final de Native con Opus no rinde más que con Sonnet effort high

- **Qué pasó**: el dev-lead pidió comparar. Se revisó el mismo paquete (`review-final-<sha>.diff`, 1951
  líneas) diez veces, todas con `sdd-kit:effort-high`: 4 con Sonnet y 4 con Opus y el mismo encargo, y 2
  con la lente repartida. Había un único fallo con efecto para el usuario: cancelar un diálogo con la
  acción destructiva ya enviada perdía el aviso y el cierre de la pestaña. Se tomó como referencia junto
  con 13 hallazgos menores.
  - Pasadas limpias con el encargo base: Sonnet s1 lo encontró (Important). Opus o1 no lo vio. Opus o3 lo
    encontró (Important).
  - Pasadas limpias con lente: Sonnet con la lente de usuario lo encontró (Important). Opus con la lente
    de fronteras no lo vio y tampoco lo anotó para la otra lente.
  - Las tres pasadas contaminadas (ver hallazgo 2) no cuentan para el recall.
  - Coste por pasada, en los tokens que devuelve el despacho: Sonnet 148k–191k en 2,6–5 min; Opus
    164k–204k en 6–7,4 min. En los tokens de `Measure-SessionTokens.ps1`, las de Opus pesan entre 1,3 y
    1,5 veces más.
  - Ninguna pasada dio un Critical. Todas encontraron los borrados simultáneos que daban `500`.
  - Opus dio más hallazgos menores de proceso (tests sin THEN propio, comentarios, desviación sin ruling),
    y Sonnet más de comportamiento visible (concordancia de un texto, el estado sin red, el salto del
    diálogo).
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, «Revisor final» (fija
  `sdd-kit:effort-high` + `model: opus` como techo); `sdd-templates` `plan-template.md`, bloque
  «Decisiones que he tomado yo» (el revisor final va con Opus y «no se quita en Native»).
- **Por qué el kit no lo evitó**: la regla fija el modelo más capaz sin medida detrás. La cita del RED
  (`tests/native-adapt-red.md`) mide que los sujetos no bajaban el effort, no que Opus encuentre más.
- **Coste**: en esta sesión, ~1,5 veces los tokens y ~1,6 veces el reloj por revisión final para un recall
  del fallo real de 1 de 2 limpias (Opus) frente a 2 de 2 (Sonnet), con n muy pequeña.
- **Propuesta**: que el revisor final por defecto sea `sdd-kit:effort-high` + `sonnet` y que Opus quede
  como opción del plan, no como techo obligatorio. Antes de cambiarlo, una campaña con n ≥ 5 por modelo
  sobre dos o tres paquetes congelados con un Important sembrado. Hipótesis secundaria: la lente de
  usuario con Sonnet (148k, 2,6 min) encuentra el fallo visible y los huecos de test al menor coste.
- **Criterio de aceptación**: GIVEN un paquete congelado con un Important sembrado de efecto visible, y
  otro de concurrencia. WHEN se despachan 5 revisores finales Sonnet high y 5 Opus high con el encargo de
  `encargo-revision.md`. THEN la tasa de recall del Important de Sonnet no es menor que la de Opus en más
  de 1 de 5. Si se cumple, la regla pasa a Sonnet por defecto.

### 2. Un paquete de revisión de un sha antiguo se contamina con `git log`

- **Qué pasó**: para el experimento se revisó `455b9e8` cuando la rama ya tenía el arreglo `312aa12`. Los
  revisores leían contexto con `git show 455b9e8:<ruta>`, pero `git log` les enseñaba el mensaje del
  commit del arreglo («no dejar cancelar el borrado ya enviado»). De cuatro pasadas, una declinó el
  hallazgo citando ese commit, otra lo dio por resuelto citándolo y una tercera lo vio en el log. Hubo
  que añadir al encargo «no mires commits posteriores a `<sha>`».
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, receta del paquete
  del «Revisor final» y re-revisión del tramo `<último revisado>..HEAD` (paso 7).
- **Por qué el kit no lo evitó**: la receta asume que se revisa `HEAD`. Revisar una versión anterior mientras
  la rama sigue avanzando no está previsto, y pasa con cualquier revisión despachada en segundo plano
  mientras el hilo commitea.
- **Coste**: tres de las diez pasadas no sirven para medir, unos 570k tokens.
- **Propuesta**: cuando el paquete no es de `HEAD`, el encargo dice «revisas `<sha>` como si fuera el
  último: no mires commits posteriores (`git log <sha>`, nunca sin límite)». Mejor todavía, el revisor
  trabaja en un worktree temporal desanclado en `<sha>`.
- **Criterio de aceptación**: GIVEN una rama con un commit de arreglo posterior al sha del paquete. WHEN
  el revisor recibe el encargo con la frase. THEN ningún informe cita el commit posterior; hoy, 3 de 4 lo
  citan o lo leen.

### 3. Fusionar el delta en `capabilities/` es manual y falla con encabezados de varias líneas

- **Qué pasó**: la fusión del paso 4 de `sdd-end-feature` (9 ADDED, 2 MODIFIED y 9 reglas en 4
  capacidades) se hizo con un script improvisado. El primer intento no aplicó dos `MODIFIED` porque su
  encabezado `**MODIFIED — título** (antes: «…»)` ocupaba varias líneas. `Test-Capabilities.ps1` no lo
  habría detectado: valida la forma, no que el delta se aplicara.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 4 y
  `skills/sdd-end-feature/references/aprendizajes-skills.md` (describe la fusión en prosa); no hay script
  en `sdd-templates/scripts/`.
- **Por qué el kit no lo evitó**: la fusión es prosa. El validador comprueba la capacidad resultante, no que
  cada requisito del delta esté en ella.
- **Coste**: una fusión rehecha; sin el `throw` del script, un `MODIFIED` se habría perdido en silencio.
- **Propuesta**: un `Merge-CapabilityDelta.ps1` en `sdd-templates/scripts/` (lo que se usó está en la
  sección de iniciativa propia). Además, que `Test-Capabilities.ps1 -Artifact` compruebe que cada
  título ADDED o MODIFIED del delta existe en su capacidad.
- **Criterio de aceptación**: GIVEN una spec con un `MODIFIED` cuyo `(antes: …)` ocupa dos líneas. WHEN se
  fusiona y se valida con `-Artifact`. THEN el requisito queda sustituido; si no se aplicó, el validador
  falla nombrando el título.

### 4. `Watch-SubagentSilence.ps1 -Once` dice que el vigía «no funciona» cuando solo llega tarde

- **Qué pasó**: una comprobación puntual con `-Once`, hecha minutos después de despachar, respondió
  «SIN TRANSCRIPT: …; el vigía de silencio no funciona en esta sesión». El vigía lanzado con el despacho
  sí funcionaba: `-Once` solo busca despachos de los últimos 60 s.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Watch-SubagentSilence.ps1` (`DispatchMarginSeconds`) y
  su sección en `references/control-profiles.md`.
- **Por qué el kit no lo evitó**: el margen de 60 s tiene sentido para el vigía continuo, no para `-Once`, y
  el mensaje afirma una causa falsa.
- **Coste**: un falso aviso de que la vigilancia estaba rota.
- **Propuesta**: con `-Once`, buscar sin el margen, o que el mensaje diga «ningún despacho con esa
  descripción en los últimos 60 s».
- **Criterio de aceptación**: GIVEN un subagente despachado hace 5 min y en marcha. WHEN se lanza
  `Watch-SubagentSilence.ps1 -Description <d> -Once`. THEN responde `EN MARCHA:` y no `SIN TRANSCRIPT`.

### 5. La frase literal del dev-lead rompe el corrector de los docs

- **Qué pasó**: el walkthrough registra la validación con la frase literal, como pide la plantilla. La frase
  traía dos erratas, y el gate `root:lint-md` (cspell) falló. Se resolvió con `<!-- cspell:ignore … -->`.
- **Dónde en el kit**: `skills/sdd-templates/walkthrough-template.md` §4.2 y `skills/sdd-end-feature/SKILL.md`
  paso 1.
- **Por qué el kit no lo evitó**: la plantilla pide la cita literal y no avisa de que el gate de docs del
  proyecto la puede rechazar.
- **Coste**: una vuelta más del lint en el cierre.
- **Propuesta**: una línea en la plantilla: la frase literal no se corrige; si el corrector del proyecto la
  rechaza, `<!-- cspell:ignore <palabras> -->` encima.
- **Criterio de aceptación**: GIVEN una validación literal con una errata. WHEN se escribe el walkthrough
  con la plantilla. THEN el lint del proyecto pasa sin tocar la cita.

### 6. Arreglos posteriores a la validación: el kit no dice qué validar

- **Qué pasó**: con la feature ya validada, el dev-lead pidió resolver lo que habían encontrado los
  revisores. Salieron dos pasadas más (`superpowers:executing-plans` dice «There is no second fix pass»),
  cada una con su re-revisión. Dos arreglos cambian lo que se ve: el texto de un error y que el recuento
  falla al momento, sin reintentos. Los verificó el agente, no el dev-lead.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 7 (un commit tras la validación abre la
  re-revisión) y `sdd-end-feature` paso 0.
- **Por qué el kit no lo evitó**: la re-revisión está cubierta, pero no si un arreglo con salida observable
  pide volver a validar, ni cómo encaja una segunda pasada que pide el usuario frente a la regla de
  superpowers.
- **Coste**: bajo en esta sesión, porque se dijo en el mensaje; el riesgo es cerrar como «validado» algo
  que el dev-lead no vio.
- **Propuesta**: si un commit posterior a la validación cambia una salida observable, el mensaje de cierre
  lo lista como «no validado por ti», o se pregunta si revalidar. Una pasada pedida por el usuario es una
  enmienda de proceso, no el «second fix pass» que superpowers prohíbe.
- **Criterio de aceptación**: GIVEN una feature validada y un commit posterior que cambia un texto visible.
  WHEN se cierra. THEN el walkthrough y el mensaje final separan lo que validó el dev-lead de lo que se
  cambió después.

## Lo que hice por iniciativa propia

- **Experimento de revisores** con una lista de referencia (R1–R14 y un falso positivo) y una tabla por
  pasada (modelo, encargo, tokens, minutos, recall, grado del fallo real, contaminación). Sirvió para
  ver la varianza: el mismo modelo da gradaciones distintas del mismo hallazgo (Minor o Important) y
  recall distinto del fallo real entre pasadas. Candidato a método de campaña del kit.
- **Reproducir una carrera contra la base de datos real** con pares de peticiones en paralelo
  (`ForEach-Object -Parallel`), 8/8 en rojo antes del arreglo y 8/8 en verde después. InMemory no la
  reproducía. Encaja con «Reproducir antes de arreglar» del paso 6 cuando el test de capa 1 no llega.
- **Medir la orden del servicio externo antes de construir** con una sonda de un solo uso fuera del repo,
  como pedía la spec. Funcionó a la primera.
- **Script de fusión del delta** (`merge-delta.ps1`): parte la spec por `### Capacidad:`, aplica ADDED
  delante de «Reglas», sustituye MODIFIED por título y reglas por nombre, y lanza si un MODIFIED no
  encuentra su requisito. Base para el hallazgo 3.
- **Aislar la versión revisada** en el encargo cuando la rama avanza: `git show <sha>:<ruta>` y la
  prohibición de mirar commits posteriores (hallazgo 2).

## Funcionó, no tocar

- La primera pregunta del paso 2, sola: propuso partir la feature en dos por el recuento de tasks y
  superficies, y el dev-lead lo aceptó sin más vueltas. Reservar el id con `-Reserve` y crear la fila
  nueva evitó chocar con otra sesión.
- Las decisiones de producto se preguntaron antes de escribir la spec, con una vista previa de lo que se
  ve. El dev-lead eligió en un solo turno.
- La review de spec con dos lentes: 20 hallazgos, 18 aceptados, y los que cambiaban el diseño se
  contrastaron con el código antes de aceptarlos (la regla de la constitution del proyecto).
- La verificación visual obligatoria de cada task encontró el único fallo de datos real, un `500`
  contra la base de datos que ningún test con InMemory veía.
- Copiar los RED fuera del repo y compararlos con `git diff --no-index` destapó todos los cambios de
  test, que quedaron registrados como rulings.
- `Invoke-SddMerge.ps1` se paró sin tocar nada al ver la rama destino sacada con un cambio sin commitear
  (un `.claude/settings.json` escrito por la instalación del plugin), y su mensaje decía el fichero.

## Errores míos, no huecos del kit

- No copié al plan la restricción de la feature anterior («toda clave ajena de la migración está en la
  configuración de EF»). Costó un fix descubierto.
- Escribí un arreglo (el token de la limpieza) antes que su test. Hubo que ver el RED volviendo
  temporalmente al código antiguo.
- Un test sirvió como documento un contenido que no lo era. El `500` venía del dato falso, no de la
  carrera que se quería probar.
- Calculé el contraste de un color `oklab` con alfa como si fuera `rgb`.

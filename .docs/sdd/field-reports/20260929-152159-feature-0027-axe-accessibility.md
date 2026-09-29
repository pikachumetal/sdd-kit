---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260929-152159-feature-0027-axe-accessibility
task: 0027
mode: full
date: 2026-09-29
---

# Ticket para el kit — feature 0027: axe para accesibilidad y contraste, de consulta a merge en una sesión

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native (`execution: auto`)
- Skills del kit usadas: `sdd-consult`, `sdd-start-feature`, `sdd-templates` (scripts), `sdd-end-feature`,
  `add-to-changelog`, `sdd-feedback`
- Proyecto: repo de templates de aplicación (monorepo moon, Angular + .NET), una persona, `ids.mode: sequence`
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (2 sujetos de GREEN de una skill), Opus 5.5 (revisión final y 2 re-revisiones)
- Coste en reloj: ~2,1 h
- Coste en tokens: hilo 63,8 M; subagentes 9,8 M en 5 despachos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una re-revisión completa por un cambio de comentario de cuatro líneas

- **Qué pasó**: tras la re-revisión del tramo post-fix, dos Minor de documentación desfasada se
  arreglaron en un commit de 15 líneas: 11 en un `.md` del template y 4 en un comentario de código.
  Como un fichero no estaba bajo `.docs/` ni era `*.md` de la raíz, la regla obligó a una segunda
  re-revisión con el encargo del revisor final (effort high + Opus, 307 k tokens). Volvió sin Critical
  ni Important y con tres Minor más de redacción, que invitaban a otra vuelta.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 («salvo el commit de solo docs y de
  menos de 20 líneas… todos sus ficheros bajo `.docs/` o `*.md` de la raíz») y paso 9 de
  `skills/sdd-end-feature/SKILL.md`.
- **Por qué el kit no lo evitó**: la excepción se define por la ruta del fichero, no por el tipo de
  cambio. Un comentario de código y un `.md` de un subproyecto (el template, que tiene su propia
  `.docs/`) quedan fuera, aunque el riesgo sea el de un cambio de docs.
- **Coste**: ~300 k tokens de Opus y un turno de espera por un cambio sin comportamiento; riesgo de
  bucle de Minors de redacción.
- **Propuesta**: ampliar la excepción «revisado en el hilo» a commits de menos de 20 líneas cuyo diff
  solo toque comentarios o ficheros `*.md` en cualquier ruta, sin cambio de código ejecutable (se
  comprueba con el diff, ignorando líneas de comentario). También: que un Minor de redacción de una
  re-revisión no abra otra.
- **Criterio de aceptación**: GIVEN una re-revisión limpia y un commit posterior de 15 líneas que solo
  cambia un `.md` bajo `templates/x/.docs/` y un comentario `//` de un `.ts`, WHEN el agente decide si
  re-revisar, THEN lo anota como «revisado en el hilo» y no despacha revisor.

### 2. `Get-NextSddId.ps1` no propone id si hay artefactos de legado con sufijo

- **Qué pasó**: en el enrutado, el script falló con «Dos artefactos distintos comparten el id 0006» (dos
  carpetas de legado `task-0006a` y `task-0006b`, de antes de la regla sin sufijos). No propuso nada, y el
  agente calculó el siguiente id a mano mirando el roadmap y las ramas.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Get-NextSddId.ps1` (escaneo de `specs/`).
- **Por qué el kit no lo evitó**: el script trata el sufijo `a/b` de legado como colisión fatal, aunque la
  regla nueva solo prohíbe crear sufijos, no leerlos.
- **Coste**: bajo en esta sesión, pero el cálculo a mano es justo el fallo que la reserva evita (otro
  worktree puede tomar el mismo id).
- **Propuesta**: con sufijos de legado del mismo número, avisar y seguir (el número está ocupado una sola
  vez), en lugar de abortar.
- **Criterio de aceptación**: GIVEN `specs/` con `…-task-0006a-x` y `…-task-0006b-y` y como máximo 0026 en
  el roadmap, WHEN se ejecuta `Get-NextSddId.ps1 -ProjectRoot .`, THEN propone 0027 con un aviso de
  legado, sin error.

### 3. La plantilla de plan no tiene la sección «Review Focus» que pide `writing-plans`

- **Qué pasó**: superpowers 6.4.2 exige en la cabecera del plan una sección «Review Focus» (condiciones
  que ningún test ejercita) que el revisor final comprueba a propósito. `plan-template.md` del kit no la
  tiene, el plan se escribió sin ella y el encargo del revisor final tuvo que improvisarla.
- **Dónde en el kit**: `skills/sdd-templates/…/plan-template.md` y
  `skills/sdd-start-feature/references/encargo-revision.md` (revisor final).
- **Por qué el kit no lo evitó**: el plan calca la plantilla del kit, que sobreescribe la estructura de
  superpowers.
- **Coste**: el revisor final encontró 2 Important en condiciones que un «Review Focus» escrito con el
  plan habría convertido en tests de la task (los nodos que axe no puede medir, una opción de
  configuración que no se aplicaba).
- **Propuesta**: añadir «Review Focus» a `plan-template.md`, con su regla (cada línea con su test en la
  task dueña), y que el encargo del revisor final la copie literal.
- **Criterio de aceptación**: GIVEN un plan escrito con la plantilla del kit, WHEN se despacha el revisor
  final, THEN su encargo incluye la sección «Review Focus» del plan copiada literal.

### 4. La fusión de un `MODIFIED` en `capabilities/` arrastró restos del título y el validador no los vio

- **Qué pasó**: el título de un `MODIFIED` llevaba un «(antes: …)» partido en dos líneas. Al fusionar el
  delta, la segunda línea («panel abierto»)») quedó suelta dentro de la capacidad. `Test-Capabilities.ps1`
  dio «Capacidades válidas» y el error solo salió al releer el diff.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 4 y
  `skills/sdd-templates/scripts/Test-Capabilities.ps1`.
- **Por qué el kit no lo evitó**: la fusión es manual y el validador no comprueba que, bajo un `###` de
  requisito, cada línea sea un bullet GIVEN/WHEN/THEN/AND o su continuación.
- **Coste**: bajo (se vio al revisar), pero habría viajado a la capacidad del proyecto.
- **Propuesta**: que `Test-Capabilities.ps1` marque líneas bajo un requisito que no son bullet ni
  continuación sangrada; o que el `(antes: …)` vaya siempre en una sola línea.
- **Criterio de aceptación**: GIVEN una capacidad con la línea `panel abierto»)` suelta entre el título
  de un requisito y su primer `- GIVEN`, WHEN se ejecuta `Test-Capabilities.ps1`, THEN falla nombrando
  el fichero y la línea.

## Lo que hice por iniciativa propia

- Reutilicé como RED de la skill la línea base medida en la feature anterior (0 de 2 sujetos hacían el
  paso que la skill nueva sustituye) y solo pagué el GREEN, con 2 sujetos en serie. Funcionó: 2 de 2.
- Recuperé de la historia de git la infraestructura de un gate retirado en la feature anterior en vez
  de reescribirla. Funcionó a la primera.
- Verifiqué a posteriori, vaciando el helper, un test cuyo código escribí antes de verlo en rojo.
- Con un aviso de consola que no veía en mis logs, escribí una sonda desechable que expone el resultado
  por aserción en vez de por consola. Reveló que el aviso era determinista y localizó la causa raíz.
- Un freno de alcance numérico en la spec («más de 5 hallazgos distintos o un rediseño → parar y
  partir»). Sirvió para arreglar 3 hallazgos sin preguntar.

## Funcionó, no tocar

- El handoff de `sdd-consult` a `sdd-start-feature`: la consulta cargó el contexto (incluido otro repo de
  referencia) y la feature arrancó con el enunciado ya formado.
- La primera pregunta sola (carril, modo, perfil, recuento de tasks sin partir) y el gate de spec con
  «Decisiones que he tomado yo» primero.
- La receta del paquete de la revisión final de `encargo-revision.md`: 1.479 líneas sin la carpeta de la
  spec, y el revisor no rehízo el diff ni lanzó la suite.
- La regla «reproducir antes de arreglar» en los Important de ejecución: el primero se confirmó en RED
  en un intento.
- `Invoke-SddMerge.ps1` y `Measure-SessionTokens.ps1`, sin incidencias.

## Errores míos, no huecos del kit

- Escribí el código de un helper antes de ver su test en rojo.
- Afirmé ante el dev-lead que un aviso intermitente era «una carrera de tiempos» porque no aparecía en
  mis logs redirigidos, sin evidencia. Era determinista y mis logs no mostraban la consola de los tests.
- Al abrir, cerré una fila de deuda del roadmap con un tachado en vez del formato de cierre de la
  plantilla. Lo corregí en el cierre.

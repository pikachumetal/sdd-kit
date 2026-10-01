---
kit_version: 2.2.0
superpowers_version: 6.4.2
lane: patch
id: 20260930-173400-patch-0125-re-review-exception-by-change
task: 0125
mode:
date: 2026-09-30
---

# Ticket para el kit — patch 0125: dos filas de deuda en un patch, una reproducida y otra no

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `using-sdd`, `sdd-start-patch`, `sdd-templates` (plantilla de patch, `Get-NextSddId.ps1`, `Test-Capabilities.ps1`, `Test-Roadmap.ps1`, `Build-EstimationLog.ps1`, `Invoke-SddMerge.ps1`), `sdd-end-patch`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown y scripts PowerShell con Pester); una persona y un agente
- Modelo del hilo: Opus 5.5, toda la sesión
- Modelos de los subagentes: 22 sujetos headless Sonnet (RED y GREEN); ningún subagente de revisión
- Coste en reloj: ~1,5 h, estimado, no medido
- Coste en tokens: hilo no medido; sujetos 7,35 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La capacidad `control-profiles` sigue contando el tramo desde la revisión final

- **Qué pasó**: al escribir el delta del patch copié entero el bloque «Salir del plan es un ruling visible» de `.docs/sdd/capabilities/control-profiles.md`. Su THEN dice «la re-revisión del tramo `<revisión final>..HEAD`». Las skills cuentan el tramo desde el último revisado desde la feature 0091: el segundo sha de `Re-revisión:`, si no hay, el de `Pasada de fix:`, y si no hay, el `sobre`. No lo toqué para no hacer un refactor oportunista, y el delta fusionado arrastra el literal viejo.
- **Dónde en el kit**: `.docs/sdd/capabilities/control-profiles.md`, requisito «Salir del plan es un ruling visible», THEN. `tests/PostFinalReview.Tests.ps1`, «ningún texto cuenta el tramo desde la revisión final», mira solo `SKILL.md` y `control-profiles.md` de la skill, no las capacidades.
- **Por qué el kit no lo evitó**: la guarda estructural no incluye `capabilities/`, y el cierre de la 0091 no fusionó el cambio del tramo en esta capacidad.
- **Coste**: ninguno en la sesión. Un agente que lea la capacidad como fuente de verdad re-revisa desde la revisión final, con la pasada dentro: es el fallo `r2` (b) de `tests/closing-review-edges-red.md`.
- **Propuesta**: un patch que cambie el literal por `<último revisado>..HEAD` en la capacidad, y que el test busque también en `.docs/sdd/capabilities/`.
- **Criterio de aceptación**: GIVEN `tests/PostFinalReview.Tests.ps1` extendido a `.docs/sdd/capabilities/*.md` · WHEN corre sobre `develop` hoy · THEN falla en `control-profiles.md`; tras el patch, pasa.

### 2. Una fila de deuda con varias propuestas sin verificar no dice cómo se fija el alcance de un patch

- **Qué pasó**: la fila de la excepción de re-revisión traía seis casos y cinco propuestas distintas, todas «sin verificar»: por el diff, rutas declaradas en `tech-stack.md`, cualquier `*.md`, `--word-diff` y diccionarios. Elegir entre ellas es interpretar requisitos, y `sdd-start-patch` manda a feature todo lo que interpreta requisitos. El dev-lead había decidido «patch». Seguí como patch: contrasté las propuestas con el texto, medí y pregunté el alcance con tres preguntas cerradas (predicado, tope de líneas y un escenario más), una decisión por pregunta.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md`, árbol «¿Es de verdad un patch?» y paso 1 («Si la investigación revela que la causa exige interpretar requisitos… era una feature»).
- **Por qué el kit no lo evitó**: el árbol no distingue entre interpretar un requisito de producto y elegir entre soluciones ya propuestas de una fila de deuda del propio kit, cuya decisión es del dev-lead y cabe en una pregunta.
- **Coste**: una decisión de carril sin respaldo escrito; sin la instrucción explícita del dev-lead, otra sesión la habría pasado a feature o habría elegido sola el predicado.
- **Propuesta**: en el paso 1, si la fila trae varias propuestas sin verificar, contrastarlas con el código antes de medir. Si la elección cabe en preguntas cerradas al dev-lead (una decisión por pregunta, con la recomendada primero) y el fix sigue siendo local, sigue siendo patch, y `patch.md` §2 registra cada propuesta y su destino.
- **Criterio de aceptación**: GIVEN una fila de deuda del roadmap con tres propuestas sin verificar para un fix de dos ficheros · WHEN el sujeto arranca `sdd-start-patch` · THEN contrasta cada propuesta antes de editar, pregunta la elección al dev-lead y no cambia a `sdd-start-feature`. Hoy, sin medir: lo esperable por la letra es que pase a feature o elija solo.

### 3. `subject.sh` no corre desde el scratchpad antes de que el patch abra carpeta

- **Qué pasó**: `sdd-start-patch` prohíbe abrir carpeta, rama o id antes de reproducir el fallo, y el RED de una skill necesita una campaña. El `subject.sh` de referencia calcula la raíz del repo subiendo cinco niveles desde su propia ruta (`$BASE/../../../../..`), y eso solo funciona dentro de `.docs/sdd/specs/<carpeta>/red/`. Añadí `REPO="${KIT_REPO:-…}"` para lanzarlo desde el scratchpad, y lo moví a la carpeta del patch cuando el RED reprodujo.
- **Dónde en el kit**: `tests/headless/lib.sh` (cabecera de uso) y el molde de `subject.sh` de las campañas (por ejemplo `.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/subject.sh`); `skills/sdd-start-patch/SKILL.md` paso 1.
- **Por qué el kit no lo evitó**: el lanzador supone que la campaña vive ya en su carpeta de spec; en el carril patch, el RED va antes que la carpeta.
- **Coste**: ~5 min y una variable nueva por campaña.
- **Propuesta**: la cabecera de `lib.sh` documenta la forma de un `subject.sh` que funciona en los dos sitios (`KIT_REPO` o la ruta del kit por variable), y `run.sh` acepta un `SPEC_DIR` en el scratchpad.
- **Criterio de aceptación**: GIVEN un `subject.sh` copiado del molde en el scratchpad · WHEN se lanza con `run.sh` y `DRY=1` · THEN encuentra `lib.sh` y los moldes sin editar la línea de `REPO`. Hoy, por la letra, `REPO` sale cinco niveles por encima del scratchpad y la carga de `lib.sh` falla; no lo ejecuté sin la variable.

## Lo que hice por iniciativa propia

- **Construir el molde del segundo escenario con lo que dejaron los sujetos del primero.** El fallo de la fila 2 tiene dos turnos: se para a preguntar y después se presenta la validación. Mi primer `b2` salió de la narración del ticket, sin línea `Pasada de fix:` intermedia, y pasó 2/2. Los sujetos de `b1` sí escribían esa línea parcial al parar. Con `b3`, que es `b2` más la línea literal de `b1`, medí el estado real, que también pasó 2/2. Candidato a `tech-stack.md`, «Fixtures y baselines»: cuando un fallo de varios turnos se parte en escenarios de un turno, el molde del segundo se construye con la salida del primero, no con el relato del ticket. Funcionó: evitó recortar la fila con un molde que no era el suyo.
- **Contrastar las propuestas con el texto antes de lanzar sujetos.** Leyendo, salieron tres descartes con motivo: «cualquier `*.md`» deja sin revisor las skills, `--word-diff` cambia comportamiento en YAML y Python, y el tope de 20 líneas deja fuera el caso más caro de la 0113. El RED solo tuvo que medir la conducta.
- **Controles en el GREEN para los bordes nuevos de la excepción**: `SKILL.md` de proyecto, comentario directiva, diccionario y `.md` con una línea de código. Los 6 despacharon, y dos citaron el borde nuevo.

## Funcionó, no tocar

- La regla de `sdd-start-patch` paso 1 de no abrir id, rama ni carpeta antes de reproducir: la fila 2 no consumió nada.
- La regla de `sdd-end-patch` paso 4 de reescribir las celdas que la medición contradice: la fila 2 quedó re-medida, no intacta.
- El hook que deniega `Agent` en los sujetos: 22 sujetos sin pagar ningún revisor Opus.
- `Invoke-SddMerge.ps1` con `-Push`: fusión y push sin intervención.

## Errores míos, no huecos del kit

- Edité `subject.sh` con un heredoc de Python dentro de un heredoc de Bash, y el terminador interno cortó el externo. No rompió nada; lo rehice con ediciones directas.
- En la primera redacción de la guía puse como ejemplos una guía en `docs/` y una tabla en `tests/`, del mismo dominio que el molde. `tech-stack.md` ya pide ejemplos de otro dominio. Lo corregí antes del GREEN.
- La segunda tanda del GREEN lanzó `c3` con la etiqueta `c3-2` porque reutilicé `SUBJECT=2` para una lista de escenarios distinta: la evidencia lo aclara, pero la etiqueta despista.

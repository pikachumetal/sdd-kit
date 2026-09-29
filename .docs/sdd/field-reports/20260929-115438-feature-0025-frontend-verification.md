---
kit_version: 2.0.0 (sdd-kit.json); el plugin pasó de 2.0.0 a 2.1.0 a mitad de sesión
superpowers_version: 6.4.2
lane: feature
id: 20260929-115438-feature-0025-frontend-verification
task: 0025
mode: full
date: 2026-09-29
---

# Ticket para el kit — feature 0025: RED/GREEN de una skill de UI con sujetos que comparten navegador

## Contexto

- Carril y modo: feature full, perfil `delegate`, `execution: auto` (salió Native), `ids.mode: sequence`
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates`, `sdd-end-feature`,
  `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`,
  `executing-plans`
- Proyecto: repo de templates de aplicación (monorepo Angular + .NET), una persona
- Modelo del hilo: Opus 5.5, effort medium
- Modelos de los subagentes: Sonnet (`sdd-kit:effort-medium`) para 2 revisores de spec y 8 sujetos
  de RED/GREEN; Opus (`sdd-kit:effort-high`) para la revisión final
- Coste en reloj: ~2,5 h desde la rama (el brainstorming, antes, no medido)
- Coste en tokens: hilo 101,8 M; subagentes 24,5 M en 11 despachos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Los sujetos de un RED/GREEN de UI comparten el navegador del MCP y el cwd de la sesión

- **Qué pasó**: los sujetos que validaban una skill de verificación en navegador heredaron el
  Playwright MCP de la sesión. Heredaron la sesión iniciada por el sujeto anterior (un login ya hecho,
  un tema guardado en `localStorage`) y guardaron capturas con nombre en la raíz del worktree de la
  feature, no en la instancia bajo prueba. Hubo que ejecutarlos en serie, limpiar el estado del
  navegador entre sujetos y sacar capturas de la raíz del worktree antes de commitear.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 («Verificación visual») y
  `references/overrides-superpowers.md` para `writing-skills`; no hay regla para sujetos con
  herramientas de navegador.
- **Por qué el kit no lo evitó**: la «Verificación visual» está escrita para el hilo principal, y el
  RED/GREEN de skills asume sujetos aislados.
- **Coste**: una tercera pasada de GREEN, con capturas fuera de sitio, y dos lecturas erróneas de
  «el tema no se aplica» por estado heredado.
- **Propuesta**: en el encargo de un sujeto que use un MCP de navegador, decir que el navegador y el
  cwd son de la sesión: sujetos en serie, estado del navegador limpio antes de cada uno
  (`localStorage`, cookies) y capturas solo en el directorio de salida del MCP, sin `filename`.
- **Criterio de aceptación**: GIVEN dos sujetos que verifican en navegador sobre dos instancias
  distintas WHEN el hilo los despacha THEN los lanza en serie, el segundo no hereda la sesión del
  primero y ninguna captura queda en la raíz del worktree de la feature.

### 2. Un contrato del proyecto obliga a fusionar el delta de capacidades antes del cierre

- **Qué pasó**: la Task 2 borró tasks que las capacidades citaban, y el test de contrato del proyecto
  (toda task citada en `.docs/sdd/` existe) se puso en rojo. Para no dejar la rama roja se fusionó el
  delta en `capabilities/` en la propia task, fuera del cierre, y se registró como ruling.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 4 (fusionar el delta) y
  `skills/sdd-start-feature/SKILL.md` paso 6.
- **Por qué el kit no lo evitó**: el kit solo contempla la fusión en el cierre y no tiene marca de
  «delta ya fusionado». El cierre tuvo que comprobarlo a mano para no duplicarlo.
- **Coste**: un ruling y una comprobación manual en el cierre; riesgo de doble fusión.
- **Propuesta**: permitir la fusión anticipada de un requisito en la task que lo hace cierto, con una
  línea en `tasks.md` (`Delta fusionado: <capacidad> · <requisito> · <sha>`), y que el paso 4 de
  `sdd-end-feature` salte lo que esa línea declara.
- **Criterio de aceptación**: GIVEN una task que fusiona un REMOVED y lo anota en `tasks.md` WHEN
  corre `sdd-end-feature` THEN no vuelve a fusionarlo y `Test-Capabilities.ps1` pasa.

### 3. `Test-Capabilities.ps1` toma cualquier palabra entre backticks del bloque «Capacidades» por una capacidad

- **Qué pasó**: la línea `Modificadas: \`test-suite\` … sin \`serve-static\`` dio «`serve-static` no
  tiene fichero en capabilities/» y «no tiene subsección en el delta». Pasó lo mismo con un nombre de
  plugin. Hubo que quitar los backticks del texto explicativo.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Test-Capabilities.ps1` (parser del bloque
  «Capacidades») y `templates/spec-template.md` §Capacidades.
- **Por qué el kit no lo evitó**: la plantilla pide «qué requisito cambia» en la misma línea, que
  suele llevar nombres técnicos entre backticks.
- **Coste**: dos falsos rojos y una edición de la spec aprobada en el cierre.
- **Propuesta**: tomar como capacidad solo el primer nombre entre backticks tras `Nuevas:` o
  `Modificadas:`.
- **Criterio de aceptación**: GIVEN `- Modificadas: \`test-suite\` — sin \`serve-static\`` WHEN corre
  el validador THEN solo comprueba `test-suite`.

### 4. `Get-NextSddId.ps1` falla con ids partidos por sufijo

- **Qué pasó**: el script paró con «Dos artefactos distintos comparten el id 0006» por dos carpetas
  históricas `0006a` y `0006b`. El id nuevo (0026) salió de leer el roadmap a mano.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Get-NextSddId.ps1`.
- **Por qué el kit no lo evitó**: `nombrado.md` prohíbe hoy los sufijos, pero los proyectos
  anteriores a esa regla los tienen.
- **Coste**: bajo; un id elegido sin la reserva del script.
- **Propuesta**: tratar `<id><letra>` como variante del mismo id y calcular el siguiente sobre la
  parte numérica, o avisar sin parar.
- **Criterio de aceptación**: GIVEN carpetas `0006a` y `0006b` y un máximo de 0025 WHEN corre el
  script THEN devuelve 0026.

### 5. Una acción del usuario a mitad de ejecución no tiene sitio en `delegate`

- **Qué pasó**: instalar un plugin en la sesión (`/plugin install`, `/reload-plugins`) solo lo puede
  hacer el usuario, y los sujetos lo necesitaban. En `delegate` no hay paradas entre tasks. Se
  improvisó una «parada técnica» en el plan y se movió en ejecución con un ruling.
- **Dónde en el kit**: `templates/plan-template.md` (campos de task) y
  `skills/sdd-start-feature/references/control-profiles.md` (tabla de gates).
- **Por qué el kit no lo evitó**: la tabla de gates solo tiene paradas de decisión, no de acción
  manual.
- **Coste**: bajo; el riesgo es que un agente en `delegate` no pare y trabaje sin la herramienta.
- **Propuesta**: campo opcional `Acción del usuario:` en la task del plan, que para en cualquier
  perfil con el comando literal y la frase para seguir.
- **Criterio de aceptación**: GIVEN un plan en `delegate` con una task que declara `Acción del
  usuario: /plugin install X` WHEN el hilo llega a ella THEN para con ese comando y no la empieza
  hasta el «sigue».

### 6. El brainstorming no investiga alternativas cuando la feature elige herramientas externas

- **Qué pasó**: el enunciado nombraba herramientas concretas. La primera pregunta de diseño llegó sin
  comparar opciones, y el usuario tuvo que pedir dos veces «busca más información» y «opciones
  realistas que sean estándar de industria».
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 4 (invoca `brainstorming`); no hay
  paso de investigación.
- **Por qué el kit no lo evitó**: `brainstorming` explora el repo, no el mercado de herramientas.
- **Coste**: dos turnos del usuario y preguntas repetidas.
- **Propuesta**: si el Scope incluye elegir o añadir una dependencia o herramienta externa, antes de
  la primera pregunta de diseño presentar una tabla corta de alternativas estándar (qué cubre, qué
  no, coste, licencia) con fuentes.
- **Criterio de aceptación**: GIVEN una feature cuyo enunciado añade una herramienta externa WHEN se
  hace la primera pregunta de diseño THEN va precedida de una comparación de al menos dos
  alternativas con fuentes.

## Lo que hice por iniciativa propia

- Un **bloque de resumen fijo en la skill bajo prueba** (una línea por paso; la que no se puede
  rellenar es un paso sin hacer o un «no probado»). Consiguió que los sujetos declararan lo que no
  hicieron; no consiguió que lo hicieran. Candidato a patrón para skills de verificación.
- **Aparcar el trabajo de cada sujeto en una rama de la instancia** en vez de borrarlo: los hooks del
  usuario bloquean `git clean` y `git restore .`, y así queda la evidencia.
- **Regraduar Minor a Important por efecto** en la revisión final (cuatro que hacían fallar un paso
  del bucle), como pide `executing-plans`, con la justificación en el ledger.
- Un **documento de traspaso** de lo aprendido para otro proyecto del equipo, en la carpeta de la
  spec.

## Funcionó, no tocar

- La primera pregunta con carril, modo, perfil y propuesta de partición: la feature se partió en dos
  sin fricción.
- La rúbrica de review de spec: dos revisores Sonnet con lentes separadas, 20 hallazgos y 14
  aceptados, sin solaparse.
- La receta del paquete de revisión final y el revisor Opus: encontró tres Important reales, uno de
  ellos que un plugin deja ficheros personales en cada proyecto instanciado.
- `Measure-SessionTokens.ps1` y `Build-EstimationLog.ps1`, sin retoques.
- La regla de parar procesos por PID o por puerto: con dos instancias, el MCP y un live-server
  arriba, no cayó nada ajeno.

## Errores míos, no huecos del kit

- Copié las skills a la instancia GREEN con `cp`, sin el renombrado del instanciador.
- Di en el encargo de un sujeto la credencial con el nombre neutro sin renombrar.
- Instancié la primera vez con `git archive`, que se salta los ficheros `export-ignore`, y con el
  mismo nombre en dos instancias, que compartieron contenedores.
- El plan no llevó la sección «Review Focus» que pide `writing-plans`; la escribí en el encargo del
  revisor final.

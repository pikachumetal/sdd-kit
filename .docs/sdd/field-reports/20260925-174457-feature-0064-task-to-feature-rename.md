---
kit_version: 1.1.0 (rama de la 2.0.0 en curso)
superpowers_version: 6.4.1
lane: feature
id: 20260925-174457-feature-0064-task-to-feature-rename
task: 0064
mode: full
date: 2026-09-25
---

# Ticket para el kit — feature 0064: el renombrado de una skill en la propia sesión y la contabilidad de las campañas

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native
- Skills del kit usadas: `sdd-start-task` (arranque; renombrada a `sdd-start-feature` durante la sesión), `sdd-end-feature` (leída del working tree), `add-to-changelog`, `sdd-feedback`, `sdd-templates`
- Proyecto: el propio repo del kit (dogfooding), un dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5 (review de spec, dos lentes; 13 sujetos), Opus 5.5 con effort high (revisión final)
- Coste en reloj: ~2 h
- Coste en tokens: hilo 64,2 M, subagentes 9,7 M; sesión 24,67 $ y sujetos 3,76 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `run.sh` acepta un `SPEC_DIR` relativo y pierde la salida de un sujeto ya pagado

- **Qué pasó**: lancé el RED de `m1` con `SPEC_DIR=.docs/sdd/specs/<carpeta>`. El sujeto corrió 12 turnos y costó 0,34 $, pero `subject_save` escribió en `<ruta relativa>/red/out/`, que dejó de existir en cuanto el sujeto hizo `cd` al molde. El lanzador dijo «sujetos de la campaña: 0 · coste acumulado: 0.00 $», y el techo de la campaña quedó sin contar ese gasto. Se recuperó a mano, regenerando la salida desde el stream.
- **Dónde en el kit**: `tests/headless/run.sh` (validación de variables al principio) y `tests/headless/lib.sh`, `subject_save`/`out_path`.
- **Por qué el kit no lo evitó**: `run.sh` comprueba que `RUNS_DIR` esté en el scratchpad, pero no que `SPEC_DIR` sea absoluta.
- **Coste**: un sujeto cuya salida pudo perderse y un recuento de coste falso, que dejaba el techo sin proteger.
- **Propuesta**: `run.sh` resuelve `SPEC_DIR` a ruta absoluta (`cd "$SPEC_DIR" && pwd`) antes de lanzar, o muere si no existe.
- **Criterio de aceptación**: GIVEN `SPEC_DIR=.docs/sdd/specs/x` relativo y `DRY_RUN=1` · WHEN se ejecuta `run.sh` con un escenario · THEN `x/red/out/<escenario>-1.tools.txt` existe y el recuento dice «sujetos de la campaña: 1».

### 2. Tras renombrar una skill en la sesión, el nombre nuevo no se puede invocar

- **Qué pasó**: esta sesión renombró `sdd-end-task` a `sdd-end-feature`. Al cerrar, el harness solo listaba `sdd-kit:sdd-end-task`, cuya carpeta ya no existía, y no conocía `sdd-end-feature`. La skill del cierre tuve que leerla con `Read` desde `skills/sdd-end-feature/SKILL.md`. La regla 2 de `CLAUDE.md` cubre la skill **editada** en la sesión (contrastar con la rama), pero no la **renombrada**, que ni siquiera se puede invocar.
- **Dónde en el kit**: `CLAUDE.md` de este repo, regla crítica 2 (no es una skill; afecta a cualquier sesión que renombre una skill del kit).
- **Por qué el kit no lo evitó**: la regla supone que el nombre sigue existiendo.
- **Coste**: bajo en esta sesión, porque lo resolví leyendo el fichero. Un sujeto menos atento invocaría el nombre viejo y fallaría, o seguiría la caché.
- **Propuesta**: ampliar la regla 2: «si esta sesión renombró la skill que vas a seguir, léela con `Read` de `skills/<nombre nuevo>/SKILL.md`; el harness no la conoce hasta la próxima sesión».
- **Criterio de aceptación**: GIVEN una sesión que renombró `sdd-end-x` a `sdd-end-y` · WHEN el usuario pide cerrar · THEN el agente lee `skills/sdd-end-y/SKILL.md` y sigue su checklist, sin invocar `sdd-kit:sdd-end-x`.

### 3. No hay coste de referencia por tipo de sujeto: la previsión de la campaña se corrigió dos veces

- **Qué pasó**: para la enmienda del prefijo le dije al dev-lead «~1 $»; al preparar la campaña lo subí a ~1,7 $ (0,85 $ por sujeto, tomado de la 0018); lo real fue 0,73 $ (0,36 $ por sujeto). La cifra intermedia me hizo parar para preguntar por el techo, una parada que con el dato bueno no habría hecho falta.
- **Dónde en el kit**: `constitution.md` Art. I («antes de lanzarla se declara la previsión») y `tech-stack.md`, «Sujetos headless», sin tabla de coste por tipo de escenario.
- **Por qué el kit no lo evitó**: la previsión se hace con lo que el agente recuerda de otras campañas; el coste por sujeto depende del molde (enrutado con 6 turnos ≈ 0,2–0,3 $; cierre desde la rama lista ≈ 0,35 $; cierre con dos rondas ≈ 0,85 $).
- **Coste**: una parada evitable y dos cifras distintas ante el dev-lead.
- **Propuesta**: una tabla corta en `tech-stack.md` con el coste mediano por tipo de sujeto (enrutado, primera pregunta, cierre, migración, init), generada desde los `=== RESULTADO` de `specs/*/{red,green}/out/*.tools.txt`.
- **Criterio de aceptación**: GIVEN una campaña con 2 sujetos de cierre y 4 de enrutado · WHEN el agente declara la previsión · THEN cita la tabla y su cifra queda dentro de ±30 % del coste real.

### 4. El delta de capacidades no sabe expresar un renombrado de vocabulario ni de slug

- **Qué pasó**: la spec necesitó una excepción declarada (decisión 9) para reescribir la palabra «task» en 11 capacidades sin un `MODIFIED` por requisito, y renunció a renombrar los slugs `task-flow`/`task-ids` porque `Test-Capabilities.ps1 -Artifact` exige que el bloque «Capacidades» nombre ficheros que existen. Los dos revisores de la spec señalaron el hueco como Crítico.
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, «Delta de comportamiento» (solo `ADDED`, `MODIFIED` y `REMOVED`), y `Test-Capabilities.ps1`.
- **Por qué el kit no lo evitó**: el delta está pensado para cambios de conducta, no para cambios de nombre.
- **Coste**: una excepción a la forma del delta, cinco requisitos reescritos a mano en el cierre y una fila de deuda (los slugs).
- **Propuesta**: un marcador `**RENAMED — <título viejo> → <título nuevo>**` y un `### Capacidad: <slug-viejo> → <slug-nuevo>` que `Test-Capabilities` acepte; el cierre hace el `git mv`.
- **Criterio de aceptación**: GIVEN una spec con `### Capacidad: task-flow → feature-flow` y un RENAMED de título · WHEN se fusiona y se ejecuta `Test-Capabilities.ps1 -Artifact` · THEN existe `capabilities/feature-flow.md` con el título nuevo, `task-flow.md` ya no existe, y el validador da verde.

## Lo que hice por iniciativa propia

- **Sustituciones por lista literal con un script que falla si el literal no aparece**, en vez de `sed` o de editar a mano: ~250 menciones de «task» con dos sentidos, clasificadas una a una a partir de un `grep` con contexto y aplicadas por lotes. Ninguna regla del kit lo pide, y la revisión final no encontró ninguna mal clasificada. Es candidato a receta del kit para renombrados (en `tech-stack.md`, aprendizaje de la 0064).
- **Reutilizar moldes de campañas anteriores** (0014 para el enrutado, 0018 para el cierre de fila) desde el `subject.sh` nuevo, en vez de reconstruirlos: el control del GREEN es comparable al del RED original sin coste de molde.
- **Discrepar de la recomendación del kit** en la primera pregunta: el paso 2 me obligaba a recomendar partir la task (más de 3 tasks internas). Recomendé no partir, porque las piezas tocaban los mismos ficheros y debían aterrizar juntas, y el dev-lead lo aceptó. Es evidencia para el patch 0078 (umbral 4–5 con criterio).

## Funcionó, no tocar

- La review de spec con dos lentes: 11 hallazgos reales, entre ellos un `MODIFIED` no declarado y cinco requisitos ambiguos que habrían salido mal en el barrido.
- El freno de alcance en la ejecución: el prefijo `Task` se paró como salida observable, y la decisión llegó al dev-lead en su propio turno, antes de la validación.
- La validación diferida con disparador concretado por el agente cuando la frase del dev-lead no lo nombraba.
- `Invoke-Pester` en el pre-commit: cazó cada literal de test que el renombrado dejó atrás.

## Errores míos, no huecos del kit

- `tech-stack.md` entró entero en la lista blanca del test guarda, aunque la decisión 10 pedía reescribir sus secciones no cronológicas. Lo cazó la revisión final (el prompt de método de la línea 64).
- Di al dev-lead una previsión de coste («~1 $») sin mirar el coste por sujeto de cierre, y tuve que corregirla (hallazgo 3).

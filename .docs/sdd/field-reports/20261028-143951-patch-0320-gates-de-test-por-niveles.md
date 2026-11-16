---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261028-143951-patch-0320-gates-de-test-por-niveles
task: 0320
mode:
date: 2026-10-28
---

# Ticket para el kit — patch 0320: los gates de test por niveles, para la v3

## Contexto

- Carril y modo: patch (fila 0320 del roadmap, aún sin arrancar), más las filas 0321 y 0322 que lo completan. El ticket
  nace de una sesión de coordinación del dev-lead que planificó la solución con `sdd-roadmap` y `sdd-consult`.
- Skills del kit usadas: `sdd-consult`, `sdd-roadmap`, `sdd-feedback`; de referencia, `sdd-end-feature` (receta del
  merge), `sdd-end-patch`, `sdd-start-feature` y las plantillas de `sdd-templates`.
- Proyecto A (el de este ticket): aplicación web interna, backend .NET 10 con xunit (4.525 tests en un solo proyecto de
  test), frontend React con Vite y Vitest, E2E con Playwright contra un servidor de documentos en contenedor, monorepo
  con moon, PostgreSQL; 4 personas y varias sesiones de agente en paralelo, cada una en su worktree; perfil `delegate`;
  runner self-hosted de Linux disponible y sin CI de tests.
- Proyecto B: otro proyecto con el kit 2.3.4 (backend .NET con xunit, monorepo con moon, sin máquina de CI) que resolvió
  lo mismo por su cuenta el mismo día. Sus resultados vienen de un resumen de su repo, no de esta sesión.
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: no medido para la sesión; el coste del problema va en cada hallazgo
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado. Al final,
«Propuesta para la v3» junta la solución que los dos proyectos aplicaron por separado, para que el kit la dé de serie.

## Hallazgos

### 1. El kit fija la suite entera en el cierre de cada feature y cada patch

- **Qué pasó**: el gate de cierre pasaba la suite completa del proyecto (backend, frontend y E2E), en serie, dos o tres
  veces por tarea. En los cierres del proyecto A del 2026-10-27, el gate tardaba más que la tarea: «tareas que tarda
  más el gate que la tarea» (dev-lead). El proyecto escribió su propia regla de dos niveles en su constitución
  (patch 0311) y ahora otra de tres (fila 0320), las dos en contra de lo que dicen las plantillas del kit.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md:179` («Gate de cierre, una vez y en el hilo
  principal: el gate completo del proyecto: build, suite entera, lint»);
  `skills/sdd-templates/templates/walkthrough-template.md:52` («Suite completa: …»);
  `skills/sdd-end-feature/references/merge-recipe.md:23` («la suite completa no se omite nunca»);
  `skills/sdd-templates/templates/tech-stack-template.md` §Testing, que solo pide «la política».
- **Por qué el kit no lo evitó**: el kit solo conoce un nivel, «la suite entera», y lo exige en cada cierre. No tiene
  noción de lo afectado por la rama ni de una pasada posterior (CI, nocturna, release) que cubra el resto. El kit ya
  separa bien la verificación por task de la suite entera (`encargo-revision.md:96`), pero el cierre vuelve a la suite
  entera.
- **Coste**: en el proyecto A, `backend:test` 13 min, `frontend:check` 2 min y los E2E de 2 a 3,5 min, en serie y 2 o 3
  veces por tarea: unos 9 min por pasada (547 s medidos) y de 18 a 27 min por cierre (`patch.md` del patch 0311 del
  proyecto). Con la suite del backend en paralelo baja de 637,6 s a 292 s (`patch.md` del patch 0309), y sigue siendo el
  grueso. El proyecto B llegó al mismo diagnóstico por separado.
- **Propuesta**: el gate deja de ser uno. `tech-stack-template.md` §Testing declara niveles y dónde corre cada uno
  («Propuesta para la v3», abajo), y `plan-template.md`, `walkthrough-template.md` y `merge-recipe.md` piden en el cierre
  el nivel `close` (lo afectado por la rama), nunca la suite entera, salvo que el proyecto no declare niveles.
- **Verificada**: sí — contrastado con `plan-template.md:179`, `walkthrough-template.md:52` y `merge-recipe.md:23`; la
  propuesta, sin verificar (la fila 0320 la aplica en el proyecto A).
- **Criterio de aceptación**: GIVEN un proyecto con `tech-stack.md` §Testing que declara `close` y `integration`, WHEN
  una sesión cierra una feature con `sdd-end-feature`, THEN el plan, el walkthrough y la receta del merge piden solo el
  comando de `close`, y ninguno pide la suite entera. Hoy el plan generado lleva «suite entera» en §3.

### 2. La misma pasada corre dos y tres veces en un cierre

- **Qué pasó**: tras la pasada de fix de la review se pasaba lo de la rama; tras integrar la base (`dev`), otra vez; tras
  el último commit, la suite completa; y si salía un rojo, el arreglo era el nuevo último commit y la suite completa
  volvía a pasar entera. Con el `-VerifyCommand` de la receta, se repetiría una vez más sobre el resultado del merge.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md:23` (el gate de merge sobre el resultado del
  merge, más la suite completa antes de llamar al script); `skills/sdd-end-feature/SKILL.md` paso 10 y
  `skills/sdd-end-patch/SKILL.md` paso 6, que no dicen en qué orden van la integración de la base y el gate, ni qué se
  repite tras un rojo.
- **Por qué el kit no lo evitó**: el kit no fija el orden «integrar la base primero, después una sola pasada», ni qué se
  repite tras un rojo; cada sesión lo rellenaba con «todo otra vez».
- **Coste**: de 18 a 27 min por cierre en el proyecto A (hallazgo 1); la parte que es repetición, sin respaldo separado.
- **Propuesta**: el cierre integra primero la base en la rama y pasa el nivel `close` **una sola vez**, sobre lo que va a
  aterrizar (la *Not Rocket Science Rule* de bors). Tras un rojo, se arregla y pasan solo los tests que fallaron más lo
  afectado desde el sha de la pasada roja (`--since <sha>`): un arreglo que solo toca `.md` no relanza nada. Repetir sin
  cambiar nada no vale: oculta un test inestable. Si la base avanza entre la pasada y el merge, no se repite: lo recoge
  el nivel `integration`. Con niveles declarados, `-VerifyCommand` no repite el gate de cierre.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una rama con el nivel `close` en verde tras integrar la base, WHEN la revisión final
  pide un arreglo que solo toca un test y la sesión cierra, THEN se pasan el test que falló y lo afectado desde el sha
  rojo, una vez, y ni la suite entera ni el nivel `close` completo vuelven a pasar.

### 3. Los rojos de la suite entera en el cierre fueron ruido o herencia de la base, no fallos de la rama

- **Qué pasó**: se repasaron los walkthroughs y patches del proyecto A de octubre con rojos en la suite completa (unos
  25 cierres, búsqueda por texto, no exhaustiva). Ninguno fue un fallo que la rama causara fuera de lo que tocaba.
  Fueron: inestables por carga (un test de Vitest que agota sus 5 s con otra suite a la vez, E2E con 3 workers, un plazo
  de 5 s al publicar con varios contenedores encendidos), arranque en frío del servidor de documentos, y rojos heredados
  que ya estaban en la base (un test con una carrera propia, una carrera del listado de carpetas). Un único caso dudoso
  fue en una feature que reorganizaba los propios E2E. Cada cierre tenía que justificar en su walkthrough rojos que no
  eran suyos.
- **Dónde en el kit**: `skills/sdd-templates/templates/walkthrough-template.md:52` y `skills/sdd-end-feature/SKILL.md`
  paso 10; el kit no tiene noción del estado de la base ni de una CI.
- **Por qué el kit no lo evitó**: sin un nivel posterior que pase la suite sobre la base, el rojo de la base solo se ve en
  el cierre de la rama siguiente, que no lo causó.
- **Coste**: sin respaldo agregado; cada caso está en el walkthrough de su cierre (por ejemplo, rojos «que fallan
  también en `dev`» o «pasan solos» en 13 cierres del 7 al 28 de octubre).
- **Propuesta**: el nivel `integration` corre sobre la base en cada push (hallazgo 4), y el cierre mira su estado antes
  de fusionar: con la base en rojo no se fusiona y se para la línea, y quien lo rompió lo arregla o lo revierte.
- **Verificada**: sí — contrastado con los walkthroughs del proyecto A; la propuesta, sin verificar.
- **Criterio de aceptación**: GIVEN la base en rojo en la CI, WHEN una sesión llega al merge con `Invoke-SddMerge.ps1`,
  THEN el script para con `verificación: la base está en rojo en la CI` y no fusiona.

### 4. Sin CI, la base puede quedar en rojo hasta la release

- **Qué pasó**: ninguno de los dos proyectos tenía CI de tests. La suite entera solo corría en los cierres; el proyecto
  B, tras recortar el cierre a lo afectado, quedó con «develop puede estar en rojo hasta la release sin que nadie lo
  vea». El proyecto A tiene un runner self-hosted y decidió CI en cada push a la base (fila 0322).
- **Dónde en el kit**: `skills/sdd-templates/templates/tech-stack-template.md` §Testing; `skills/sdd-end-release/SKILL.md`
  (no comprueba el verde en el sha que corta).
- **Por qué el kit no lo evitó**: el kit no tiene noción de CI ni de una pasada periódica; el único sitio donde corre todo
  es el cierre.
- **Coste**: sin respaldo; es el hueco que abre recortar el cierre (hallazgos 1 y 2) si no se cierra a la vez.
- **Propuesta**: `tech-stack.md` declara dónde corre el nivel `integration` (CI en cada push a la base, con un job a la
  vez para que los pushes seguidos se junten; o nocturna; o a mano una vez al día si no hay máquina), y el comando para
  leer su estado (`gh run list`, `az pipelines runs list`…). El cierre lo lee antes del merge (hallazgo 3) y
  `sdd-end-release` comprueba el verde en el sha que corta. Los E2E lentos, de noche.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un proyecto sin `integration` declarado, WHEN una sesión configura el gate con niveles,
  THEN `sdd-config` o la plantilla le avisa de que recortar `close` sin `integration` deja la base sin cubrir.

### 5. «Lo afectado» falla en silencio si no hay red de seguridad ni reglas probadas

- **Qué pasó**: el proyecto A filtra los tests del backend por carpeta espejo (cambia `Features/X` → pasa los tests de
  `Features/X`); lo que no tiene espejo (el arranque de la API, los helpers comunes de los tests, los `.csproj` y
  `.props`) solo se avisa y no pasa nada. El proyecto B usa `moon --affected` y descubrió que sus tasks de la raíz solo
  miraban `.moon/*`, así que `--affected` no las marcaba nunca, y que sin `--include-relations` moon no sigue las
  dependencias. Además cerró sus reglas sin probarlas («se observan en el próximo cierre»).
- **Dónde en el kit**: no localizado; el kit no define qué es «lo afectado».
- **Por qué el kit no lo evitó**: cada proyecto inventa su selección y su forma de fallar.
- **Coste**: 27 de los 188 merges a la base del proyecto A del 14 al 28 de octubre tocan ficheros sin espejo (medido con
  `git log --merges --first-parent dev`); con la regla de hoy, ninguno de esos cierres pasaba un test por ellos.
- **Propuesta**: el kit define el contrato de `close`: base = `merge-base` con la rama de integración; red de seguridad
  (si la rama toca build, configuración, dependencias o helpers comunes de los tests, pasa la suite entera); `--since
  <sha>` tras un rojo; y casos que prueban las reglas antes de fiarse de ellas: un `.md` no pasa nada, un `.csproj` lo
  pasa todo, `--since` toma su base. Con `moon --affected`, revisar los `inputs` de cada task y usar
  `--include-relations`.
- **Verificada**: sí — medido con `git log --merges --first-parent dev --since=2026-10-14` en Git Bash; la propuesta, sin
  verificar.
- **Criterio de aceptación**: GIVEN una rama que solo cambia un `.props` del backend, WHEN pasa el nivel `close`, THEN
  pasa la suite entera del backend. Hoy no pasa nada.

### 6. La plantilla no separa unitarios de integración, y la suite «unitaria» no lo es

- **Qué pasó**: en el proyecto A, 4.525 tests de backend tardan 637,6 s en serie: ~141 ms de media, por encima de los
  100 ms del F.I.R.S.T.; una sola clase de 385 tests va a ~430 ms por test. Es una suite de integración que se pasa como
  si fuera unitaria. El proyecto B tiene 33 ficheros que arrancan el host de la API mezclados con unitarios puros, y no
  tiene suite rápida para el bucle de TDD. El proyecto A decidió un proyecto de test aparte para los unitarios (fila
  0321).
- **Dónde en el kit**: `skills/sdd-templates/templates/tech-stack-template.md` §Testing.
- **Por qué el kit no lo evitó**: la plantilla pide una política de TDD, no los niveles de test ni su tiempo objetivo.
- **Coste**: el de los hallazgos 1 y 2; en el proyecto A, la suite del backend es el grueso de cada pasada.
- **Propuesta**: §Testing declara cada suite con su nivel (unitario, integración, E2E), su tiempo objetivo y en qué
  gate corre. Los unitarios (sin I/O, menos de 100 ms por test) se pasan enteros en cada cierre; la integración, por lo
  afectado en el cierre y entera en `integration`. Recomendación para .NET: proyectos de test separados, no una `Trait`,
  porque el compilador impide que un unitario toque la infraestructura.
- **Verificada**: sí — contrastado con `tech-stack-template.md` §Testing y con la guía de Microsoft citada abajo; la
  propuesta, sin verificar.
- **Criterio de aceptación**: GIVEN un `tech-stack.md` generado con la plantilla, WHEN se lee §Testing, THEN cada suite
  tiene nivel, tiempo objetivo y gate, y el plan de una feature lo usa para el bloque de verificación.

### 7. El contador de ids es por máquina y dos personas reservaron el mismo id

- **Qué pasó**: una persona del equipo reservó el 0307 en su máquina y cerró una feature con él; en otra máquina, el
  0307 se reservó para otra fila del roadmap. Hubo que renumerar la fila a 0317 y sus referencias en dos documentos.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Get-NextSddId.ps1` (`-Reserve` guarda el contador en el git common
  dir, local a cada clon).
- **Por qué el kit no lo evitó**: la reserva es local; `sdd-roadmap` paso 6 publica la reserva con un commit, pero el
  script no mira los ids ya usados en el remoto antes de reservar.
- **Coste**: ~15 min de renumerar, sin respaldo de commit separado del de la renumeración.
- **Propuesta**: `Get-NextSddId.ps1 -Reserve` hace `git fetch` y toma el máximo entre su contador, los ids del roadmap de
  la rama de integración remota y los de las ramas `feature/*` y `patch/*` remotas.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN otro clon que reservó y publicó el 0307 en la rama de integración, WHEN este clon
  ejecuta `Get-NextSddId.ps1 -Reserve`, THEN reserva un id mayor que 0307.

## Propuesta para la v3

Una sola regla de gates, declarada por el proyecto en `tech-stack.md` §Testing y leída por el plan, el walkthrough, la
receta del merge y la release:

| Nivel | Qué pasa | Cuándo y dónde |
| --- | --- | --- |
| `close` | Los unitarios enteros; la integración y los E2E afectados por la rama, con red de seguridad | Una vez en el cierre, tras integrar la base; tras un rojo, lo que falló más `--since <sha>` |
| `integration` | La suite entera menos los E2E lentos | En la CI, en cada push a la base, un job a la vez; sin CI, a mano una vez al día |
| `nightly` | Los E2E del camino crítico y el resto de E2E | De noche, si la máquina levanta el entorno |
| `release` | Todo | Comprueba el verde de `integration` en el sha que corta y pasa los E2E enteros |

Y alrededor:

- El cierre lee el estado de `integration` antes de fusionar y no fusiona sobre un rojo (se para la línea).
- Repetir un test sin cambiar nada no es un gate: un test que falla sin fallo del producto se arregla o se borra.
- Las suites que se frenan entre sí van en serie (un test de Vitest agotó sus 5 s con la del backend a la vez).
- La selección de lo afectado se prueba con casos antes de fiarse de ella (hallazgo 5).

De dónde sale cada pieza:

- Lo afectado antes del merge y el resto después, por lotes: el *deployment pipeline* de Fowler
  (<https://martinfowler.com/bliki/DeploymentPipeline.html>), las pasadas antes y después del envío de Google
  (<https://research.google/pubs/pub52465>) y los modos «relevant» y «remaining» de Develocity
  (<https://docs.gradle.com/develocity/2026.2/using-develocity/predictive-test-selection/>).
- Probar una vez lo que aterriza: la *Not Rocket Science Rule* de bors (<https://eluvk.github.io/readings/nrsr.html>).
- La integración y el sistema en una pasada periódica, los unitarios rápidos siempre: *The Clean Coder*, cap. 8, y el
  F.I.R.S.T. de *Clean Code*, de Robert C. Martin (citados por resúmenes, no por el libro).
- Unitarios e integración en proyectos separados: Microsoft Learn, «Integration tests in ASP.NET Core»
  (<https://learn.microsoft.com/aspnet/core/test/integration-tests?view=aspnetcore-10.0>).
- La red de seguridad, `--since` y la CI en cada push: el proyecto B, y los huecos que le quedaron.

## Lo que hice por iniciativa propia

- Repasar los walkthroughs del mes buscando los rojos de la suite completa y si un filtro por lo afectado los habría
  pillado (hallazgo 3). Funcionó: convirtió una discusión de principios en un dato, y fue lo que decidió recortar el
  cierre. Candidato a paso de `sdd-end-release` o de una retro: medir qué encontró cada nivel del gate en la release.
- Medir el impacto de la red de seguridad antes de decidirla (27 de 188 merges): sin la medida, la red de seguridad
  podía haber devuelto la suite entera a la mayoría de cierres.

## Funcionó, no tocar

- La separación entre la verificación de cada task y la suite entera en `encargo-revision.md` y
  `overrides-superpowers.md`: los implementadores no pasaban la suite entera.
- `sdd-roadmap` con `Get-NextSddId.ps1 -Reserve` y `Test-Roadmap.ps1`: las filas 0320 a 0322 entraron, se reescribieron
  dos veces y validaron a la primera.
- `sdd-consult` como puerta para una discusión de proceso: no arrancó nada hasta que el dev-lead decidió.

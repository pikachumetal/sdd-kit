---
id: 20261028-164955-feature-0238-subject-lib-to-node
title: Tasks — La biblioteca del sujeto y los moldes pasan a Node
spec: ./spec.md
plan: ./plan.md
created: 2026-10-28
---

# Tasks — La biblioteca del sujeto y los moldes pasan a Node (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0238-subject-lib-to-node`

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Núcleo de `lib.mjs`: guardas, rutas, molde y guardado | done | 0f1da16 | |
| 2 | Lanzar `claude`: argumentos, segundo turno, persona, tope y puertos | done | 817b741 | |
| 3 | `using-sdd` en Node, el e2e y fuera los tests lentos | done | 1c018d5 | |
| 4 | Los otros 13 moldes en Node y el test de moldes en seco | done | f561e64 | |
| 5 | El repo sin bash y los documentos | done | 4464d27 | |
| 6 | Enmienda 2026-10-28: la suite en el CI de Linux, los rápidos en `cli:test`, el tope por omisión y la longitud de `RUNS_DIR` | done | 3990b93 | |
| 7 | Enmienda 2026-10-28 (2.ª): tope de `RUNS_DIR` de 100 caracteres y textos nuevos en la spec | done | b14e209 | aprobada: «apruebo» (dev-lead) |

Revisión final: Spec opus+high, With fixes (4 Important, 8 Minor) · Código sonnet+high, With fixes (4 Important, 10 Minor) · Arquitectura no (plan), sobre 3990b93
Pasada de fix: 527d1ce, 26 hallazgos (8 RED→GREEN, el resto con suite 221/221 y comparación sh↔mjs) · 5 rulings
Re-revisión: 3990b93..b14e209, sdd-kit:effort-high + opus, 20 resueltos · abiertos 3 Important y 1 Minor, nuevos 1 Important y 4 Minor; ninguno Critical

## Rulings

- | 3↔4 | `battery.mjs` lanza subject.mjs (3) → los 13 moldes restantes aún son .sh entre 3 y 4 | conflicto: entre Task 3 y 4 battery.mjs apunta a subject.mjs que no existe para 13 baterías. Ruling: aceptado, el estado intermedio no lo lanza ningún test; Task 4 los completa |
- Task 1: Ruling: la etiqueta se valida en initSubject (vacía, «.», «..» o con separadores → «etiqueta no válida: «<etiqueta>»») en lugar de la guarda de subject_cleanup («no se borra … fuera de RUNS o sin etiqueta») — con la etiqueta de argv, la guarda de la limpieza llegaba tarde: el borrado de RUN al arrancar ya habría pasado — coste si es erróneo: un texto nuevo
- Task 1: Ruling: el test «seed_transcript sin molde muere» no se porta — seedTranscript es un método del sujeto, sin molde no existe — coste: ninguno
- Task 1: Ruling: «falta g init en el subject.sh antes del primer g» → «… en el subject.mjs antes del primer git» — el texto nombraba el fichero y la función que se van — coste: un literal
- Task 1: Ruling: save sin .tmp intermedio: escribe solo si extract.mjs sale con 0 — mismo efecto sin renombrar — coste si es erróneo: ninguno observable
- Task 1: Ruling: RED ajustado — la ruta larga del test pasa de 100 a 110 «x» (con 100 daba 137 < 140) y la carrera (c) usa OUT dentro de RUNS_DIR largo, el caso real; comprobado que la carrera (c) falla con el comportamiento viejo — coste: ninguno
- Task 1: Ruling: initSubject lleva JSDoc (@returns Record<string, any>, deps any) — tsc infiere los .mjs con allowJs y rechazaba el fs en memoria y las propiedades añadidas — coste: tipos laxos en los tests
- Setup: Ruling: línea base sin filtro (kit:test-headless cli:typecheck cli:test-min) esperó 12 min el cerrojo de suites y corrió sobre el árbol con los tests RED de la Task 2 a medio escribir: solo fallaron lib.test.ts (30, RED) y el tsc de ese fichero; cli:test-min saltada por moon. No se repite: el «antes» de kit:test-headless sale del roadmap (262,6 s sin carga, ~740 s con carga) y el gate de cierre es la comprobación — coste si es erróneo: un rojo previo de develop sin ver hasta el cierre
- Task 2: Ruling: RED ajustado — las marcas live/, el relevo ports/ y el stream de otro sujeto colgaban en el test de una carpeta equivocada (RUNS_DIR/.. y RUNS_DIR/b-1.jsonl); van en RUNS_DIR/live, RUNS_DIR/ports y RUNS_DIR/red/b-1.jsonl, como en lib.sh — coste: ninguno
- Task 2: Ruling: el tope de tiempo lo pone lib.mjs con deps.startTimer y mata con deps.kill(pid, true) (taskkill /T /F), en lugar de un spawnClaude síncrono — así se prueba con un reloj falso — coste: ninguno
- Task 2: Ruling: sin foto de netstat al arrancar (netstat falló), la limpieza no para nada y escribe «no comprobado (netstat no respondió)» — parar sin foto tumbaría lo que ya escuchaba — coste: un servidor del sujeto vivo si netstat falla al arrancar
- Task 2: Ruling: la persona real escribe su JSON en <etiqueta>.persona-<n>.json y lib lo lee, en lugar de capturar stdout — runClaude escribe siempre a fichero — coste: un fichero más en RUNS
- Task 2: Ruling: el stream en seco escribe la identidad Fixture literal en lugar de preguntar a git config — la comprobación de identidad vive en extract.mjs — coste: el stream en seco no prueba que la config por entorno funciona (lo cubre el e2e de la Task 3)
- Task 3: base check — origin/develop trae CI en ubuntu-latest que corre kit:test-headless en cada push (2c7e5b48) y la fila 0242; ningún fichero de la Task 3. Ruling: los tests en proceso no usan rutas C:\ (CWD = resolve('/w'), etiquetas y MOLD_NAME con /, delimiter): tras el merge corren en el CI de Linux; el lanzador real sigue solo en Windows (spec «No entra: Linux») — coste si es erróneo: no probado en Linux; el CI lo dirá tras el push
- Task 3: Ruling: subject.mjs lee battery.md de BATTERY_DIR si viene, si no de su carpeta (scenarioCell de battery.mjs) — el e2e necesita una petición propia con el subject.mjs real, y BATTERY_DIR ya es la carpeta de la batería en battery.mjs — coste: ninguno en las baterías reales
- Task 3: Ruling: la petición del e2e lleva «», tildes, comillas dobles y ¿?, sin salto de línea — una celda de tabla markdown no admite saltos (Review Focus pedía uno) — coste: un salto de línea en la petición no está probado
- Task 3: Ruling: casos de los .slow no portados — «seed_transcript en una tubería» (sin tuberías en Node) y «subject_cleanup no borra con etiqueta vacía o fuera de RUNS» (sustituido por la validación de la etiqueta en initSubject, Task 1); «extract.mjs last» va al e2e (lanza node) y «exige SUBJECT_CAP y COST_CAP» a campaign.test.ts (conducta de readConfig ya existente: pasa sin RED) — coste: ninguno
- Task 3: Ruling: campaign.ts se borra entero: tras borrar los .slow solo lo usaba listening-pids.test.ts, que importa listeningPids de lib.mjs; el test duplicado de listeningPids de lib.test.ts se quita — coste: ninguno
- Task 3: Ruling: el «antes» medido de la carpeta: test/kit/headless entera 114 tests en 10,4 s con vitest directo (antes 262,6 s sin carga, roadmap)
- Task 4: Ruling: base integrada (merge 1b22175b: 0230, 0233 y el CI de Linux); enmienda de la sesión develop registrada en spec.md con su frase y Task 6 al final del plan
- Task 4: Ruling: molds.test.ts copia las carpetas del kit con cpSync (sin node_modules) en lugar de git archive + tar — el tar del PATH es el de Git Bash, que lee «D:» como un host; la copia es del árbol de trabajo, no de HEAD — coste: un fichero sin commitear entra en la copia del test
- Task 4: Ruling: molds.test.ts lanza cada subject.mjs directamente (sin run.mjs), con RUNS_DIR corto bajo .temp/ del repo (m-XXXXXX/<n>-<m>) — así no pasa del tope de ruta ni del de RUNS_DIR de la Task 6 — coste: el cableado de run.mjs lo cubre solo subject.test.ts
- Task 4: Ruling: maxConcurrency 12 en cli/vitest.config.ts y testTimeout 120 s en molds.test.ts — con 5 a la vez el fichero tardaba 70,9 s; con 12, 54,6 s; con 24, 50,9 s — coste: más procesos git a la vez en la máquina
- Task 4: Ruling: comparación sh↔mjs de cada escenario de las 14 baterías (árbol del molde sin .git y state.txt sin hashes, en seco): iguales salvo (1) el orden de commits del mismo segundo en git log --all, (2) el puerto aleatorio del E2E de sdd-archive, (3) el sort de Git Bash en el listado de ficheros de sdd-upgrade v2x (estimation.md antes de estimation-log.md; JS ordena por código) — coste: un listado del informe en otro orden
- Task 4: Ruling: las fixtures que bash pasaba por sed salen en LF (readLf), como las dejaba el sed de Git Bash; las que se copiaban o volcaban con cat/put quedan tal cual — coste: ninguno, lo confirmó la comparación
- Task 4: Ruling: lib.mjs gana s.copy(origen, destino) — cp -r <origen>/. <molde>/<destino> se repetía en los 14 moldes — coste: ninguno
- Task 4: Ruling: la guarda que bash calculaba con cell antes de subject_init (Esperado) lee la celda con scenarioCell directamente; sin el escenario, initSubject muere por la skill que falta en lugar de «sin el escenario» — coste: otro mensaje en un caso de error
- Task 5: Ruling: las lecciones fechadas de tech-stack.md que citan subject.sh, subject_launch, run.sh o bash como contexto (task 0053 «No se edita un script mientras bash lo ejecuta», task 0077 SPEC_DIR, feature 0098 tope de reloj, field-reports) no se reescriben; sí las líneas de método (lanzador de referencia, baterías, marcador, guarda del RED, puertos, git init, molde por etapas) — coste: menciones viejas en lecciones
- Task 5: Ruling: README.md:159 nombraba lib.sh como usuario de PowerShell; pasa a real-deps.mjs (la lista de procesos) — fuera de la lista de la spec, la encontró el grep de la verificación — coste: ninguno
- Task 6: Ruling: fuera de Windows, real-deps.mjs lista procesos con ps -eo pid=,args= y para por PID con SIGKILL (sin árbol); run.test.ts usa esa misma consulta — el pwsh de Linux no tiene Get-CimInstance — coste: en Linux no se para el árbol, solo el PID
- Task 6: Ruling: run.test.ts y subject.test.ts crean su carpeta en .temp/r-* y .temp/s-* del repo (RUNS_DIR de ~75 caracteres): el temporal de vitest (.temp/vitest-*/…) pasaba de 80 — coste: un worktree con nombre de más de ~60 caracteres haría fallar el test
- Task 6: Ruling: el falso startTimer de lib.test.ts apunta los temporizadores armados (armed): el tope por omisión se cancela al acabar claude — coste: ninguno
- Task 6: Ruling: beforeAll de subject.test.ts con tope de 120 s — con molds.test.ts a la vez pasaba de 10 s — coste: ninguno
- Final: Ruling: fix fuera de la revisión (Linux): campaign.test con join y real-deps lee /proc en Linux (ubuntu:24.04 sin procps) — lo encontró la suite en el contenedor; entra en la re-revisión — coste: ninguno
- Final: Ruling: Spec M5 Review Focus 2 contradictorio — vale la decisión 6: se para todo PID nuevo en un puerto del sujeto, también el reinicio de un servidor ajeno, como hacía lib.sh con StartTime — coste si es erróneo: un servidor ajeno reiniciado durante el sujeto se para
- Final: Ruling: Spec M10 / orden del listado de sdd-upgrade — ningún orden de JS reproduce el sort de Git Bash (difiere en estimation.md frente a estimation-log.md con cualquier collator); se queda el orden por código — coste: un listado del informe en otro orden
- Final: Ruling: Código «títulos de test que citan tickets» — se quedan, como el resto de la suite (campaign.test.ts, cli/test): el Art. X habla de comentarios — coste: ninguno
- Final: Ruling: Código «Declined: fakeDeps de lib.test.ts de ~57 líneas» — el tope de 20 líneas se aplica al código ejecutable, no a los dobles de test — coste: ninguno
- Final: Ruling: Spec «Declined: s.copy y los rmSync/cpSync de los moldes no pasan por deps.fs» — los moldes trabajan sobre disco real y los prueba molds.test.ts; inyectarlos no da cobertura nueva — coste: ninguno
- Final: Ruling: Spec «Declined: la foto de netstat se toma en initSubject y no al lanzar» — el plan lo fija así y es lo que hacía lib.sh con SUBJECT_STARTED — coste: un servidor arrancado entre init y launch cuenta como del sujeto, que es lo buscado
- Final: Ruling: Spec «Declined: en Linux, netstat de lib.mjs sigue siendo el de Windows» — la spec deja fuera las campañas reales en Linux; killProcess ya tiene rama fuera de Windows — coste: ninguno en el CI
- Final: Ruling: desvío aprobado por el dev-lead («apruebo», 2026-10-28): MAX_RUNS_DIR 80 → 100 y cuatro textos nuevos en la spec — Task 7; test «aborta con un RUNS_DIR de más de 100 caracteres» RED→GREEN, 34/34
- Final: Ruling: re-revisión Spec I1 (Linux sin evidencia sobre la cabeza) — resuelto: contenedor ubuntu:24.04 sobre b14e2095, kit:test-headless 221/221 en 25 s y cli:typecheck — coste: ninguno
- Final: Ruling: re-revisión Important nuevo (no-claude/claude era bash y el e2e lo lanzaba en Linux) — sin revisar: no-claude/claude pasa a node con shebang; lo ejerce subject.test.ts «el sujeto no puede lanzar su propio claude» — coste si es erróneo: un sujeto lanza su claude en un shell sin node
- Final: Ruling: re-revisión Código I1 (bindMoldTools 22 líneas) — sin revisar: initRepo sale a función de módulo — coste: ninguno
- Final: Ruling: re-revisión Spec I3 («falta git init» sin registrar) — línea en Enmiendas, sin aprobar, y plan.md con el texto nuevo — coste: un literal sin aprobar del dev-lead
- Final: Ruling: re-revisión Spec M10 (orden de sdd-upgrade) — se mantiene: un comparador que ignora «-» arregla el par de estimation pero cambia el orden de otras entradas respecto al sort de Git Bash; el molde es el mismo — coste: un listado del informe en otro orden
- Final: Ruling: re-revisión Minor nuevos (tech-stack:32 ~260 s; spec ps → /proc; «Tres textos» → «Cuatro»; describe agrupado por historia) — arreglados en el hilo: documentación y un nombre de describe

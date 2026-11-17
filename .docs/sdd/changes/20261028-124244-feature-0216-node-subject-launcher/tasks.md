---
id: 20261028-124244-feature-0216-node-subject-launcher
title: Tasks — El orquestador de sujetos pasa a Node
spec: ./spec.md
plan: ./plan.md
created: 2026-10-28
---

# Tasks — El orquestador de sujetos pasa a Node (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0216-node-subject-launcher`

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Núcleo de la campaña en Node con sus tests en proceso | done | e120bf17 | |
| 2 | `run.mjs` sustituye a `run.sh` | done | 6df155a6 | |
| 3 | Limpieza de los procesos del sujeto | done | f3ed6941 | rama de señales sin test (cubierta en la pasada de fix) |
| 4 | `battery.mjs run` sustituye a `battery.sh` | done | 9ed4a9f3 | `kit:test-headless` no corrió (cerrojo de suites vencido) |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 9ed4a9f3
Pasada de fix: juntada en el cierre, 7 hallazgos RED→GREEN
Re-revisión: 9ed4a9f3..juntada en el cierre, sdd-kit:effort-high + opus, todos ADDRESSED o con ruling que se sostiene, 5 Minor nuevos adjudicados

## Rulings

- Task 1: Ruling: readConfig(env, cwd, fs) en lugar de readConfig(env, cwd) — la guarda de cli/ necesita mirar el disco y el fs es inyectado — coste si es erróneo: una firma
- Task 1: Ruling: el test «un cortado de una tanda real no cuenta en seco, ni al revés» se corrigió tras el RED: ponía las dos marcas en el mismo fs y la cortada en seco contaba para el seco, como debe; se parte en dos fs — coste si es erróneo: ninguno, el código no cambió por él
- Task 1: Ruling: with-lock.test.ts pasa desde el principio: fija una conducta que withLock ya tiene y de la que depende la carrera (a) — coste si es erróneo: ninguno
- Task 2: Ruling: paro la línea base del gate (esperaba el cerrojo de suites de patch/0231 y habría corrido sobre el árbol ya modificado, sin medir la base) — el «antes» de kit:test-headless sale del roadmap (262,6 s sin carga, ~740 s con carga), y el gate de cierre mide el después — coste si es erróneo: un rojo previo de develop que se atribuya a la rama; se mira contra develop si sale
- Task 2: Ruling: battery.sh lanza "$NODE" run.mjs hasta la Task 4, y campaign.ts conserva runBash para battery.slow.test.ts hasta borrarlo en la Task 4 — sin ello, la batería queda rota entre tasks — coste si es erróneo: ninguno, ambos se borran en la Task 4
- Task 2: Ruling: ports.slow.test.ts escribe en la marca de live/ el PID de Windows (/proc/$$/winpid) en lugar de $$ — el formato de las marcas cambió (decisión 9) y lib.sh ya no ve PIDs de bash — coste si es erróneo: un test de puertos que no prueba lo compartido
- Task 2: Ruling: marcadores de atajo con el prefijo «ponytail:» en lugar de «shortcut:» — lo fijan las reglas de estilo del dev-lead (~/.claude/rules/code-style.md) — coste si es erróneo: un renombrado
- Task 2: Ruling: battery.slow.test.ts gana cli/bin/sdd.js en sus kits de juguete — la guarda nueva (decisión 5) los rechazaba; el fichero se borra en la Task 4 — coste si es erróneo: ninguno
- Task 3: Ruling: run.test.ts cambió tras el RED: el sujeto que deja un proceso suelto importaba join dos veces y no llegaba a ejecutarse, y la consulta de pwsh del test se encontraba a sí misma; ninguno cambia lo que se afirma — coste si es erróneo: ninguno
- Task 3: Ruling: la consulta de procesos sale como «<pid>\t<línea>» y no como JSON — ConvertTo-Json deja sin escapar caracteres de control de líneas de otros programas y el JSON no se lee — coste si es erróneo: ninguno
- Task 3: Ruling: la rama de señales (Ctrl-C, SIGTERM, SIGBREAK) no tiene test ni comprobación a mano: desde la sesión no se puede mandar Ctrl-C a otra consola en Windows; el barrido tras un corte en seco sí se comprobó a mano (sueltos antes=1, «[a-1] paro 1 procesos de …», sueltos después=0) — coste si es erróneo: un Ctrl-C que deja procesos hasta el siguiente lanzamiento, que los barre
- Task 4: Ruling: battery.slow.test.ts no se borra entero: se quedan sus dos casos de sujeto (el molde de using-sdd con el marcador del kit y la petición con tildes intacta), lanzados con node battery.mjs run, porque prueban subject.sh y lib.sh, que siguen en bash hasta la 0238; el lanzamiento y el veredicto pasan a battery.test.ts en proceso — coste si es erróneo: ~60 s de suite lenta hasta la 0238
- Task 4: Ruling: un sujeto que no cargó el kit deja el escenario en rojo aunque los demás lleguen al umbral — una medida sin el kit no mide nada (fila de deuda: «da rojo a un sujeto cuyo tools.txt lleva Unknown skill») — coste si es erróneo: un rojo de más que se lee en la línea
- Task 4: Ruling: el test «rechaza un paso desconocido» compara el error con su código 2, que battery.mjs ya daba; el RED lo comparaba con el 1 por omisión — coste si es erróneo: ninguno
- Task 4: Ruling: en tech-stack.md se actualizan las líneas de método (101, 121, 134, 160, 185, 197, 203); las lecciones fechadas que citan run.sh como lo que pasó (224, 249, 301) no se reescriben — coste si es erróneo: dos menciones viejas
- Task 4: Ruling: la verificación con moon run kit:test-headless no corrió: el cerrojo de suites venció a los 60 min (lo tuvieron 0230 y 0231) — corrí directo battery.test, campaign.test, run.test y battery.slow (38/38); la suite entera queda para el gate de cierre.
- Final: Ruling: Spec I5 la Confirmación de la ADR 0002 nombra battery.sh — en el fondo se cumple con battery.mjs run, y la ADR es inmutable; la sustituye la próxima ADR que toque las pruebas por batería — coste si es erróneo: un lector que busca battery.sh y no lo encuentra
- Final: Ruling: Spec I6 fakeDeps (campaign.test 43 líneas, battery.test 25) y memoryFs (32) pasan de 20 líneas — son fábricas de un objeto literal de métodos de una línea; partirlas reparte el doble sin ganar claridad (code-style.md del dev-lead: umbrales de alerta, módulos profundos) — coste si es erróneo: dos helpers largos de test
- Final: Ruling: Minor subjectCost y costCap como string — se imprimen tal cual los dio el dev-lead («0.50 $»), como run.sh; con número saldría «0.5 $» — coste si es erróneo: cuatro Number()
- Final: Ruling: Minor capReached y stopRequested escriben en el log — el aviso es el motivo de parar y solo lo sabe quien decide; separarlos duplica la condición — coste si es erróneo: ninguno
- Final: Ruling: Minor kill(pid, tree) siempre con tree=true, running global, códigos de salida descartados, marca «undefined» si spawn falla (exited resuelve 1 y la borra) — conducta del run.sh portada; sin efecto visible — coste si es erróneo: ninguno
- Final: Ruling: Minor setImmediate en dos tests — no espera reloj: cede un turno para que el lanzamiento escriba su marca; la restricción va contra sleeps y temporizadores de tiempo — coste si es erróneo: ninguno
- Final: Ruling: Minor prefijo ponytail: — lo fija code-style.md del dev-lead (/ponytail-debt los recolecta) — coste si es erróneo: un renombrado
- Final: Ruling: Minor formatAwk — el nombre dice que imita el %.6g del lanzador de bash, que es lo que fija SUBJECT_COST por omisión — coste si es erróneo: un renombrado
- Final: Ruling: Minor kitMissing calculado dos veces en judge — no lo está: unloaded se calcula una vez y passed lo consulta — coste si es erróneo: ninguno
- Final: Ruling: Minor tech-stack.md:224 — lección fechada (task 0077) que cuenta lo que pasó con run.sh; las 197 y 203 eran líneas de método — coste si es erróneo: una mención vieja
- Final: Ruling: Minor mensaje del cerrojo de lanzamiento no listado en la spec — lo trae withLock (decisión 7); se corrige el doble espacio con la rama «orquestador de sujetos» — coste si es erróneo: ninguno
- Final: Ruling: Declined (Código) Windows, política de matar por línea de órdenes, batería en serie, marcas cortadas sin borrar, cobertura de los slow borrados — decisiones de la spec aprobada (3, 10, 12) o herencia de battery.sh — coste si es erróneo: ninguno nuevo
- Final: Ruling: Declined (Spec) paths() con cwd del proceso — ya no: SPEC_DIR se resuelve con el cwd inyectado (absolutePaths); timeout de 120 min con traza — decisión 7; PID reutilizado, carpeta compartida seco/real, EPERM — conductas previas sin cambio — coste si es erróneo: ninguno
- Final: Ruling: re-revisión Minor 1 textos nuevos fuera de la lista (no pude listar los procesos, COST_CAP tiene que ser un número, no encuentro Git Bash) — los piden los hallazgos de la revisión; van al walkthrough como ampliación — coste si es erróneo: tres líneas de salida no previstas
- Final: Ruling: re-revisión Minor 2 comentarios de stopCampaign y batteryPlan — dicen cuándo se usan (señal, barrido al parar), que el nombre no dice — coste si es erróneo: dos comentarios
- Final: Ruling: re-revisión Minor 3 batteryPlan dos veces en battery.mjs run — lee una tabla de una docena de filas; pasarlo a runBattery cambia su firma y sus tests — coste si es erróneo: milisegundos
- Final: Ruling: re-revisión Minor 4 cobertura perdida de battery.slow sin apuntar — va al walkthrough (4.3) como residual de la 0238 — coste si es erróneo: ninguno
- Final: Ruling: re-revisión Minor 5 al parar no se barre un sujeto en curso que ya guardó tools.txt — taskkill /T se lleva su árbol; solo quedaría un proceso desenganchado que nombre su carpeta, el mismo límite del atajo ponytail de stopSubjectProcesses — coste si es erróneo: un proceso suelto tras un Ctrl-C en el último segundo de un sujeto

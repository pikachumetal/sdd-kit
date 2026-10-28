---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261028-153643-feature-0216-node-subject-launcher
task: 0216
mode: full
date: 2026-10-28
---

# Ticket para el kit — feature 0216: el orquestador de sujetos pasa a Node

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`, ejecución Native
- Skills del kit usadas: sdd-propose, sdd-grilling, sdd-start-feature, sdd-worktrees, sdd-implement, sdd-tdd, sdd-verify, sdd-parallel-agents, sdd-archive, sdd-feedback
- Proyecto: el repo del kit (CLI en Node y TypeScript, Vitest, moon), un dev-lead, varias sesiones de agente en paralelo en worktrees del mismo clon
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: eje Spec y re-revisión en Opus 5.5 (effort high), eje Código en Sonnet 5.5 (effort high)
- Coste en reloj: 2,39 h de esfuerzo frente a 4 h estimadas, hasta el commit de cierre; el cierre con el merge sumó ~1,5 h más, casi todo esperas y conflictos de integración
- Coste en tokens: 58,1 M (hilo 50,6 M, subagentes 7,5 M), 24,02 $ hasta el cierre

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El cierre corre la CLI de la rama, no la de la integración: un arreglo de `sdd merge` ya fusionado no llega

- **Qué pasó**: `node cli/bin/sdd.js merge --sync` desde el worktree dio `base: conflicto en .docs/sdd/tech-stack.md.` y abortó todo. En `develop` ya estaba el patch 0232 («`--sync` deja unidos los registros cuando choca otro fichero»), pero el paso 6 de `sdd-archive` ejecuta la CLI del worktree, que no lo tenía. Con el visto bueno del dev-lead se integró a mano: `git merge` dejó en conflicto `changelog.md`, `estimation-log.md`, `roadmap.md`, `tech-stack.md` y un test. El roadmap se resolvió fila a fila con scripts del scratchpad, y salieron filas duplicadas dos veces, porque una fila de deuda saldada lleva un prefijo que cambia su clave. Después, `sdd merge --push` chocó otra vez en `roadmap.md` con commits de coordinación que estaban en la `develop` local sin publicar, y hubo que repetir la integración.
- **Fuente**: la salida de `node cli/bin/sdd.js merge --sync --project-root <worktree>` y de `node cli/bin/sdd.js merge --project-root <worktree> --verified-at b95a9912 --push` (`merge: conflicto en .docs/sdd/roadmap.md.`); `git log 9ed4a9f3..origin/develop` con `bcf324b8 docs(sdd): cierre del patch 0232, --sync deja unidos los registros`; los commits `b95a9912` y `8d7408e0` de la rama
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 6 y `skills/sdd-archive/references/merge-recipe.md` («`base: conflicto en <files>.`: a person resolves»); el `sdd` que nombran las skills sale de `cli/bin/sdd.js` del working tree
- **Por qué el kit no lo evitó**: la receta da por hecho que la CLI que integra es la buena. Ante un conflicto solo dice «lo resuelve una persona», sin un procedimiento para los registros cuando esa persona delega en el agente.
- **Coste**: ~45 min de reloj entre las dos integraciones y los duplicados (sin respaldo: no medido aparte; los commits `b95a9912` y `8d7408e0` son la huella)
- **Propuesta**: (a) en el paso 6, `--sync` y el merge se ejecutan con la CLI de `<remote>/<merge.into>`, sacada a una carpeta temporal, o al menos se avisa si el `cli/` de la integración va por delante del de la rama; (b) cuando la persona delega la resolución, el paso dice cómo resolver los registros: reaplicar sobre el fichero de la integración las filas que cambió la rama, identificadas por su texto sin el prefijo de cierre.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una rama abierta antes de un patch que arregla `sdd merge --sync`, ya fusionado en `develop`, WHEN el cierre de esa rama corre el paso 6, THEN el sync usa la CLI con el arreglo y los registros quedan unidos sin intervención.

### 2. La verificación de una task con una tarea de moon vence a los 60 min en la cola del cerrojo de suites

- **Qué pasó**: para verificar la Task 4 lancé `moon run kit:test-headless` en segundo plano. Esperó el cerrojo de suites detrás de otras dos ramas y salió con `cerrojo: no se libera; lo tiene patch/0231-exact-env-vars …` a los 3606 s, sin correr ningún test. Después, el gate de cierre esperó otra vez a que se liberara el cerrojo, y el dev-lead preguntó «¿que no acabamos nunca?».
- **Fuente**: la salida de `moon run kit:test-headless` (`rc=1 s=3606.8`), y la de `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test-min --affected --base develop` («Esperando el cerrojo de suites: vas 1.º en la cola»)
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Native loop» paso 4 (`sdd task done … -- <comando de la Verificación>`), y la plantilla del plan, que no prohíbe una tarea de moon con cerrojo como verificación de task
- **Por qué el kit no lo evitó**: no hay regla que separe la verificación de una task (sus ficheros de test) de la suite con cerrojo. Es el segundo caso: el triaje de `develop` ya tiene la fila «La verificación de una task corre suites enteras con el cerrojo» y la 0240.
- **Coste**: 60 min de reloj en segundo plano (el hilo siguió con la revisión) y una tanda repetida a mano
- **Propuesta**: la de la fila de `develop` y la 0240. La «Verificación» de una task nombra sus ficheros de test con `vitest run`, y la suite con cerrojo solo corre en el gate de cierre.
- **Verificada**: sí — reproducido en esta sesión (la salida citada)
- **Criterio de aceptación**: GIVEN dos ramas con gates en cola, WHEN una task verifica su trabajo, THEN corre sus tests en menos de un minuto, sin tomar el cerrojo.

### 3. Me desvié de la spec aprobada con un ruling en lugar de parar

- **Qué pasó**: la decisión 12 de la spec aprobada borraba `battery.slow.test.ts`. En la Task 4 me quedé con dos de sus casos y lo apunté como ruling. El eje Spec de la revisión final lo marcó como desvío no registrado, y la pasada de fix borró el fichero, como pedía la spec.
- **Fuente**: el ledger del plan (`Task 4: Ruling: battery.slow.test.ts no se borra entero…`), y el informe del eje Spec (Important 4, «Desvío no registrado: `battery.slow.test.ts` sigue vivo»)
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings»
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. Un ruling vale para conflictos del plan; contradecir una decisión de la spec es un desvío y para.
- **Coste**: un hallazgo Important y unas 60 líneas de test escritas y borradas (~15 min, sin respaldo)
- **Propuesta**: llevar la comprobación al momento en que se escribe el ruling. Antes de apuntar un `Ruling:`, se busca en las decisiones de la spec el fichero o el literal que toca, y si una decisión lo fija es un desvío. Según la regla 6 del CLAUDE.md, va a «Esperar 2.º ticket».
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec cuya decisión borra un fichero, WHEN el hilo decide conservar parte de él, THEN para como en un desvío, no escribe un ruling.

### 4. Un gate da rojos de la máquina: Git Bash con `/tmp` montado sobre una carpeta borrada

- **Qué pasó**: el gate de cierre dio `kit:test-headless` 89/94. Los cinco rojos llevaban `bash.exe: warning: could not find /tmp, please create!` dentro de la salida que leen los tests. Un `bash -c` lanzado a mano daba lo mismo, y `mount` enseñaba `/tmp` sobre la carpeta temporal de vitest de otra rama, ya borrada. El dev-lead decidió fusionar, y quedó una fila de deuda.
- **Fuente**: la salida del gate (`Tests  5 failed | 89 passed (94)`), y `bash -c 'mount | grep -i tmp'` → `…/.temp/vitest-CU4Bs3 on /tmp type ntfs (…usertemp)`
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 6, el contraste sin la rama. Lo arregla la herramienta del repo (`tests/headless/lib.sh`, en la 0238).
- **Por qué el kit no lo evitó**: el contraste sin la rama pide repetir el gate en `develop`. Aquí bastaba un `bash` suelto, pero el paso no lo contempla, y preguntar costó un turno.
- **Coste**: una tanda del gate (~15 min) y una pregunta al dev-lead
- **Propuesta**: en el paso 6, antes del contraste en `develop`, se reproduce con la orden mínima el primer error de la salida guardada, si no depende de la rama. Si se reproduce, el rojo es de la máquina y se pregunta directamente.
- **Verificada**: sí — reproducido con `"C:\Program Files\Git\bin\bash.exe" -c 'echo hola'` desde pwsh
- **Criterio de aceptación**: GIVEN un gate rojo cuyo error sale también fuera de los tests, WHEN el cierre lo contrasta, THEN no repite la suite en `develop` y lo reporta como de la máquina, con la orden que lo reproduce.

## Lo que hice por iniciativa propia

- Un smoke real de `run.mjs` y `battery.mjs` con 9 casos en una carpeta del scratchpad, que provocaba los fallos con su entrada mala. Funcionó: dio la evidencia de `ejecución real` de cada decisión en un minuto.
- Un script que rehace el roadmap desde el de la integración y le reaplica las filas que cambió la rama. Funcionó mejor que resolver los bloques de conflicto, que duplicaban filas.

## Funcionó, no tocar

- La partición al arrancar (0216 y 0238) con las filas de deuda repartidas: el cierre saldó cada una sin dudas.
- La revisión final en dos ejes con la re-revisión única: el eje Spec cazó el desvío del hallazgo 3 y la falta de señal en `battery.mjs run`, y el de Código, el barrido que fallaba en silencio.

## Menores

- Un test RED colgó la suite, porque el código de hoy esperaba hueco para siempre; se arregló con `--test-timeout` y un `onWait` que libera — `skills/sdd-tdd/SKILL.md`, «Verify RED»
- `sdd ledger rulings` imprime y no escribe en `tasks.md`, y hubo que mirar su `--help` — `skills/sdd-implement/SKILL.md`, cierre de la revisión
- La `develop` local llevaba 5 commits de coordinación sin publicar, y `sdd merge --push` los publicó con aviso — `skills/sdd-archive/references/merge-recipe.md`

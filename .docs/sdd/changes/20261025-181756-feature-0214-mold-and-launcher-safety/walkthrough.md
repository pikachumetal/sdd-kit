---
id: 20261025-181756-feature-0214-mold-and-launcher-safety
feature: 0214
title: Walkthrough — Molde y seguridad de tests/headless/lib.sh, extract.mjs y battery.mjs
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-25
---

# Walkthrough — Molde y seguridad de `tests/headless/lib.sh`, `extract.mjs` y `battery.mjs`

🦆 Quien lanza una campaña de sujetos ya no tiene que acordarse de cada guarda. Un sujeto que intenta `taskkill //IM node.exe` recibe un «denegado», y al acabar el lanzador para solo lo que ese sujeto arrancó en sus puertos, no el servidor que el dev-lead ya tenía. Una salida con el nombre o el email de git de la máquina no se guarda, el sujeto sale con error, y la revisión de la evidencia mira todas las carpetas de salidas. Volcar un fichero de otra rama, sembrar transcripts y montar un molde con rutas largas salen bien a la primera, y una copia del kit con `.docs/` o `tests/` aborta antes de lanzar. El extractor salta y marca una línea del stream rota, y una batería puede dar por buena cualquier skill.

## 1. Cambios realizados

- **Hook y puertos** (Task 1): `tests/headless/deny-kill.mjs` (copia del de la 0036, que conserva el suyo), cargado en el `SETTINGS` por defecto de `subject_launch`, con guarda para un `SETTINGS` propio (`DENY_KILL_HOOK`); `subject_ports` y `stop_subject_ports` en `lib.sh`; `tests/DenyKillHook.Tests.ps1` apunta a la ruta nueva.
- **Identidad de la máquina** (Task 2): `extract.mjs` sale con 3 si la salida lleva `user.name` o `user.email` de git de la máquina (como palabra entera), en vez de sustituirlos por `<git-user>`; `save_extract` escribe a un temporal y deja la marca `<etiqueta>.leak`, con la que `subject_cleanup` sale con 1. `SubjectOutputPrivacy.Tests.ps1` revisa toda subcarpeta de `specs/<tarea>/` y el email. Barrido de 10 salidas: 6 de `patch-0037…/campaign/out/`, 2 de `task-0077…/green/out/` y 2 de `feature-0162…/probe/evidence/`.
- **Volcado y molde** (Task 3): `subject_show <rev>:<ruta> <copia>` con `MSYS2_ARG_CONV_EXCL`; `seed_transcript <rama>` y su borrado en `subject_cleanup`; guarda de `.docs/`/`tests/` en `subject_init`; `-c core.longpaths=true` en `g`.
- **Extractor y batería** (Task 4): `extract.mjs` salta y marca las líneas sin parsear (`!!! línea <n> del stream sin parsear …`), también en `last`; `battery.mjs` admite `cualquiera` en «Esperado», y `t1b` de la batería de `sdd-implement` lo usa.
- **Pasada de fix de la revisión final**: parada por puerto solo de lo arrancado con el sujeto, salida con error del sujeto con fuga, `seed_transcript` sin molde, identidad como palabra entera, líneas que no son eventos, aviso de copia plana en `subject_show` y los Minors.
- **Documentos**: `tech-stack.md` (líneas del hook, los puertos, la siembra, la copia del kit, `core.longpaths`, `extract.mjs` y Playwright), dentro de su tope de palabras (19270 de 19280); roadmap con las filas 0215 y 0216 de la partición.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3 h
- Esfuerzo real: 2,72 h — reloj de la sesión 4,61 h desde 2026-10-25T15:27Z, sin 113 min de espera al dev-lead (8 esperas)
- Desviación: −0,28 h (−9 %)
- Causa de la desviación (obligatoria si |desviación| > 30%): no aplica (dentro de ±30 %); el esfuerzo real incluye spec, plan, dos caídas del PC y la pasada de fix
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 72.073.655 — claude-opus-5-5 72.073.655
- Tokens de subagentes: 8.273.465 en 3 despachos — Re-review final 0214 claude-opus-5-5 1.093.261 / 4 min; Final review — Spec axis claude-opus-5-5 5.688.497 / 6 min; Final review — Code axis claude-sonnet-5-5 1.491.707 / 3 min
- Coste de la sesión: 26,57 $ (hilo 21,73 $ + subagentes 4,84 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La spec ganó «Topes de palabras» (`tech-stack.md`, tope sin cambio): el repaso de coherencia no vio el tope de `tests/WordBudget.Tests.ps1` y el pre-commit de la Task 1 lo paró; las líneas que la feature reescribe se apretaron.
- Enmiendas de las decisiones 3 (parada por puerto) y 5 (el sujeto con fuga sale con error), aprobadas por el dev-lead tras la revisión final.
- La regla de `git archive` pasa de la línea del frente del GREEN a la del lanzador de referencia (toda copia del kit).

### Decisiones tomadas sin el dev-lead

- Pre-flight (2 · 3): Ruling: subject_show escribe por el mismo camino atómico de subject_keep — la spec dice «aplica las reglas de subject_keep» — si falla, un volcado con fuga quedaría a medias
- Task 1: Ruling: recuperación tras caída del PC (2.ª) — se retomó la Task 1 a medias: deny-kill.mjs copiado, lib.sh con hook por defecto, subject_ports y stop_subject_ports; tests sin ejecutar en verde todavía; tests de uno en uno para no cargar la máquina — si la caída la causa la parada por puerto, se vería en el test de puertos aislado
- Task 1: Ruling: el test de puertos arrancaba el servidor con `node` (shim de proto, que con el HOME falso del test no arranca) y con el puerto como cadena (listen abre una tubería con nombre) — server.mjs en $TestDrive lanzado con $NODE y Number(); las aserciones no cambian — si es incorrecto: un test que no prueba la parada
- Task 1: Ruling: el SETTINGS por defecto va en una variable entre comillas simples — dentro de ${SETTINGS:-"…"} bash expandía las llaves con comas y partía el JSON — si es incorrecto: ninguno, lo cubre el test del SETTINGS por defecto
- Task 1: Ruling: baseline del gate con 1 fallo: timeout de 5 s en cli:test (estimation/statistics.test.ts) con el pre-commit del commit de apertura corriendo a la vez — carga de la máquina; se repite en el gate de cierre — si es incorrecto: un rojo real heredado de develop
- Task 1: Ruling: tech-stack.md tiene tope de 19280 palabras (WordBudget) y partía de 19277; la spec no traía «Topes de palabras» — no subo el tope: aprieto las líneas que la feature reescribe (210, 211 y, en las Tasks 2-3, 60, 95, 133, 162), sin tocar otras reglas; la spec gana la tabla con tope sin cambio y su línea en Enmiendas — si es incorrecto: el dev-lead prefiere subir el tope y conservar más texto
- Task 2: Ruling: las verificaciones de Pester se ejecutan con [Console]::OutputEncoding = UTF8, como Invoke-KitTests.ps1 — sin ello el test de las cabeceras ## Agent da rojo por el «·» — si es incorrecto: ninguno, es el entorno del runner
- Task 2: Ruling: en `… | subject_save` el die de save_extract sale de la subshell de la tubería: el fichero con la fuga no se guarda y avisa, pero el sujeto sigue (la decisión 5 decía «el sujeto sale con error»); el test acaba el sujeto con exit 0 tras ese subject_save — matar al sujeto desde la tubería pediría kill $ — si es incorrecto: un sujeto con fuga deja tools.txt y cuenta en run.sh (superada por la pasada de fix: el sujeto sale con error con la marca .leak, enmienda aprobada)
- Task 2: Ruling: la evidencia ampliada sacó además 2 ficheros de feature-0162/probe/evidence con la ruta del home; entran en el barrido (<home>), como preveía el riesgo 1.7 — si es incorrecto: ninguno
- Task 2: Ruling: tech-stack.md:133 se reescribe sin crecer (cambia la ruta… ; falla con la identidad de git de la máquina) — tope de palabras
- Task 3: Ruling: seed_transcript se usa con heredoc o redirección, no en tubería: en una subshell SEED_DIR no llega a subject_cleanup y la carpeta no se borraría; el test pasa la entrada con < <(printf …) y la cabecera de lib.sh lo dice — si es incorrecto: una carpeta sembrada que queda en ~/.claude/projects (superada por la pasada de fix: subject_cleanup recalcula la carpeta y también vale en tubería)
- Task 3: Ruling: subject_show vuelca a <run>/<copia>.show y reutiliza subject_keep (plana, out_path, save_extract) en vez de duplicar sus reglas — si es incorrecto: ninguno
- Task 3: Ruling: la regla de git archive pasa de tech-stack.md:95 (solo un frente del GREEN) a la línea del lanzador de referencia (toda copia del kit, con la guarda de subject_init); 60 y 162 se acortan: lo hace el código — tope de palabras 19278/19280
- Task 3: Ruling: subject_cleanup borra SEED_DIR, que es la carpeta de transcripts del molde: con ella se van también los del propio sujeto, que no se usaban (el stream está en RUNS_DIR) — si es incorrecto: un análisis que quisiera el transcript del sujeto en ~/.claude/projects
- Task 4: Ruling: el mensaje del error de JSON.parse pasa por clean() antes de escribirse: V8 puede citar un trozo de la línea, que puede llevar el home — si es incorrecto: ninguno
- Final: Ruling: el hook se acepta con solo nombrar deny-kill.mjs en SETTINGS (Código m7) — el revisor no pide cambio; parsear el JSON en bash es lo que la decisión 2 descartó — si es incorrecto: un SETTINGS que nombra el hook sin cargarlo pasa la guarda
- Final: Ruling: el paquete de revisión omite x4-{1,2}.tools.txt de la 0077 (recomendación de Spec) — la receta excluye green/ a propósito; el eje Spec los contrastó con git — si es incorrecto: ninguno
- Final: Ruling: no se lanza un sujeto real para ver que el hook PreToolUse de --settings corre con --setting-sources "" (recomendación de Código y «no verificado» de Spec) — la spec dejó fuera los sujetos reales y la 0215 mide el perfil con sujetos — si es incorrecto: el hook no protege en las campañas con SUPERPOWERS_DIR hasta la 0215
- Final: Ruling: enmiendas de las decisiones 3 y 5 aprobadas por el dev-lead (opción «Apruebo», 2026-10-25)
- Final: Ruling: un puerto > 65535 en el stream o en PORT deja sin comprobar los demás y el .err dice «ninguno» (re-revisión, Minor) — se queda: un stream real no nombra puertos fuera de rango, y el arreglo es código tras la re-revisión, que repetiría la suite — si es incorrecto: un sujeto deja un servidor vivo y el .err dice «ninguno»; va a la 0215, que mide los puertos con sujetos reales
- Final: Ruling: nombres saved=1, flat_copy y LEAK ante cualquier fallo del extractor (re-revisión, Minor) — se quedan: legibles en su contexto; LEAK ante cualquier fallo del extractor también es un sujeto cuya salida no se guardó — si es incorrecto: un aviso de fuga cuando el extractor falló por otra causa
- Final: Ruling: aviso «R: unbound variable» antes del die de seed_transcript con set -u (re-revisión, Minor) — se queda: el resultado es correcto y solo pasa llamando sin subject_init — si es incorrecto: ruido en stderr
- Final: Ruling: filtro redundante en last y dos líneas en blanco en SubjectOutputPrivacy.Tests.ps1 (re-revisión, Minor) — se quedan: cosméticos, sin efecto — si es incorrecto: ninguno
- Final: Ruling: dos sujetos en paralelo que chocan en un puerto: la limpieza de B puede parar el servidor de A (re-revisión, fuera de alcance) — a la 0215, la de los sujetos en paralelo — si es incorrecto: un sujeto en paralelo pierde su servidor a mitad

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → kit:test 1394 passed / 14 skipped, cli:typecheck verde, cli:test 1164/1164; cli:test-min 1 fallo de sistema de ficheros de git (`unable to write file ./objects/…` en un remoto temporal, con otra sesión cargando la máquina) y 1459/1459 al repetirlo; cli:test-slow en caché verde (mismos inputs: la rama no toca `cli/`) · 9 min + 4 min la repetición · configuración: la del gate · sobre la pasada de fix (juntada en el cierre)

### 4.2 Smoke / tests

Validación en campo: 2026-10-25 · gate de cierre en verde (kit:test 1394/1394 con 14 skipped, cli:test 1164/1164, cli:test-min 1459/1459 al repetirlo, cli:test-slow en caché verde) · los cuatro Pester de la feature 93/93 · ejecución real de la parada por puerto fuera de Pester (para lo arrancado después, respeta lo de antes) · revisión final Spec (opus+high) y Código (sonnet+high) sobre d9657517 y re-revisión de la pasada de fix (opus+high) con todos los hallazgos resueltos y 6 Minor adjudicados

La spec no trae delta (capacidades: ninguna): una fila por decisión con comportamiento.

| Decisión | Evidencia | Resultado |
| --- | --- | --- |
| 1-2 · hook por defecto; `SETTINGS` propio sin él aborta; uno propio con él pasa | suite: `HeadlessLauncher` («el SETTINGS por defecto carga deny-kill.mjs», «aborta si SETTINGS no carga…», «acepta un SETTINGS propio…»), `DenyKillHook` en la ruta nueva | ✅ |
| 3 · parada por puerto de lo que arrancó con el sujeto; lo de antes sigue vivo | suite («para al acabar…», «no para lo que ya escuchaba…») y ejecución real con `stop_subject_ports` sobre un servidor node: `escuchando al acabar: 45232` y luego `ninguno` con un arranque posterior | ✅ |
| 4-5 · salida con nombre o email de la máquina: código 3, no se guarda, el sujeto sale con 1, tools.txt sí | suite (`SubjectOutputPrivacy` nombre, email, tilde con consola 437, nombre corto; `HeadlessLauncher` «subject_save no deja el estado…», «…sale con error») | ✅ |
| 6-7 · evidencia en toda subcarpeta y email; barrido | suite: los `Slow` de evidencia en rojo con las 10 fugas y en verde tras el barrido | ✅ |
| 8 · `subject_show` vuelca otra rama en Git Bash | suite («subject_show vuelca…», «…copia con carpetas…»); el fallo de origen se reprodujo en esta sesión con `git show origin/develop:…` | ✅ |
| 9 · `seed_transcript` siembra y borra; sin molde muere | suite («seed_transcript siembra…», «…en una tubería…», «…sin molde…») | ✅ |
| 10 · copia del kit con `.docs/` o `tests/` aborta | suite (dos casos) | ✅ |
| 11 · `core.longpaths` en `g` | suite | ✅ |
| 12 · línea sin parsear se marca y sigue, también en `last` | suite (tools, texts, last, línea `null`) | ✅ |
| 13 · `cualquiera` en «Esperado» | suite (`Battery`) | ✅ |
| Hook `PreToolUse` de `--settings` en un `claude -p` real | no probado: sin sujetos reales por la spec; lo mide la 0215 | ⚠ |

### 4.3 Residuales / deuda generada

- Ninguno nuevo: lo que queda de las filas de origen está en la 0215 (sujetos en paralelo y perfil de configuración), la 0216 (molde de cierre vivo) y la 0213 (`run.sh`).

## 5. Aprendizajes

- Un repaso de coherencia de una spec que edita un documento con tope de palabras mide el tope antes de presentarla: aquí el margen era de 3 palabras y el pre-commit paró la Task 1 → regla ya escrita en la plantilla (`spec-template.md`, «Topes de palabras»); no añade texto.
- `pwsh -Command -` con un script de varias líneas por la entrada estándar no ejecuta nada y sale con 0; se pasa como argumento → `tech-stack.md` no: lo dice el comentario de `stop_subject_ports`, que es donde se usa.
- Un servidor de prueba que hereda la salida estándar de la campaña deja a Pester esperando su EOF si nadie lo para → el test lo redirige a `/dev/null`.

- Revisión de skills: no aplica — la feature no toca `skills/` (`git diff --name-only` desde la base: 0 ficheros) y lo aprendido es del lanzador de pruebas del repo, no de ninguna skill.

## 6. Adendas

- _Ninguna_

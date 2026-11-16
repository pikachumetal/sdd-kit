---
id: 20261025-181756-feature-0214-mold-and-launcher-safety
title: Tasks — Molde y seguridad de tests/headless/lib.sh, extract.mjs y battery.mjs
spec: ./spec.md
plan: ./plan.md
created: 2026-10-25
---

# Tasks — Molde y seguridad de `tests/headless/lib.sh`, `extract.mjs` y `battery.mjs` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0214-mold-and-launcher-safety`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Hook por defecto y parada por puerto | done | 6c48cf92 | |
| 2 | Nombre y email reales: fallo, evidencia ampliada y barrido | done | aa93203c | |
| 3 | Volcado, siembra, copia del kit y rutas largas | done | 6519179b | |
| 4 | Líneas sin parsear y «cualquiera» | done | d9657517 | |

## Verificación por task

- [x] Task 1 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1,tests/DenyKillHook.Tests.ps1 -CI`
- [x] Task 2 — `Invoke-Pester -Path tests/SubjectOutputPrivacy.Tests.ps1,tests/HeadlessLauncher.Tests.ps1 -CI`
- [x] Task 3 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1 -CI`
- [x] Task 4 — `Invoke-Pester -Path tests/SubjectOutputPrivacy.Tests.ps1,tests/Battery.Tests.ps1 -CI`

## Revisión

Revisión final: Spec opus+high, Con fixes (3 Important, 5 Minor) · Código sonnet+high, Con fixes (2 Important, 9 Minor) · Arquitectura no (no — solo tooling de tests/headless/), sobre d9657517
Pasada de fix: juntada en el cierre, 16 hallazgos (9 RED→GREEN), 1 adjudicado
Re-revisión: d9657517..juntada en el cierre, sdd-kit:effort-high + opus, todos los hallazgos resueltos; 6 Minor nuevos adjudicados

## Fixes adicionales

Ninguno.

## Rulings

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

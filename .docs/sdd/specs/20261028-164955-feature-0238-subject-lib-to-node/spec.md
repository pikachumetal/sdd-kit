---
id: 20261028-164955-feature-0238-subject-lib-to-node
feature: 0238
parent: 0216
title: La biblioteca del sujeto y los moldes pasan a Node
mode: full
profile: delegate
status: approved
created: 2026-10-28
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-28
---

# Spec — La biblioteca del sujeto y los moldes pasan a Node

🦆 Quien escribe una batería o una campaña escribe su molde en un `subject.mjs` con las funciones de `tests/headless/lib.mjs` (`put`, `git`, `commit`, `launch`, `save`…), en lugar de un `subject.sh` sobre `lib.sh`. Quien lanza no nota nada: `node tests/headless/battery.mjs run`, las mismas variables y los mismos ficheros y mensajes («RUNS_DIR fuera del scratchpad o de .temp/: …»). Los tests del lanzador corren en proceso, sin bash, y `kit:test-headless` pasa de ~740 s con carga a menos de 60 s sin carga. Un test construye en seco un molde de cada clase y el de cierre pasa `sdd capability check` con la versión del kit, así que un molde viejo se ve en el gate y no en un sujeto pagado. El repo se queda sin scripts de bash fuera de `.githooks/`.

## Capacidades

- Ninguna, porque herramientas: el lanzador de sujetos y las baterías son herramientas de test del repo del kit; ningún proyecto consumidor las ve.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (la API de lib.mjs, que usan los 14 moldes y las campañas que vengan, y el fichero de relevo ports/<puerto>), área no explorada (los moldes grandes: sdd-archive, sdd-implement, sdd-verify y sdd-propose, leídos solo en parte) · tamaño: ~2.000 líneas en ~45 ficheros, casi todo port línea a línea
- Técnica: si la API de lib.mjs (decisión 1) cubre todo lo que usan los 14 moldes, y si el relevo de puertos por foto de netstat (decisión 6) mantiene los casos de la feature 0215 (señal: contrato público)
- Mínimo razonable: ninguna — lo deja sin mirar un revisor antes del plan; lo cubren el test que construye un molde de cada clase en seco (decisión 11) y la revisión final de Código
```

1. **API de `tests/headless/lib.mjs`**: `initSubject(argv, skill)` hace lo que `subject_init` (argumentos de `run.mjs`: kit, etiqueta, escenario, salida) y devuelve un objeto con `put`, `git`, `commit`, `launch`, `resume`, `converse`, `save`, `keep`, `show`, `seedTranscript`, `putKitMarker`, `kitVersion`, `ports`, `die` y las rutas `R`, `RUN` y `OUT`. Nombres en inglés (código). Mismas variables de entorno, mismos ficheros (`<etiqueta>.jsonl`, `.args`, `.resume.args`, `.err`, `.persona-<n>.txt`, `<etiqueta>.state.txt`, `.tools.txt`, `.texts.txt`) y mismos mensajes que `lib.sh`, literales.
2. **Rutas en forma Windows**, sin `cygpath` ni `/d/…`; la comprobación de `RUNS_DIR` (scratchpad o `.temp/` del repo) compara con las barras normalizadas y sin distinguir mayúsculas.
3. **`claude -p` con `child_process.spawn`, sin shell**: el `claude` del PATH (`claude.exe`), con `tests/headless/no-claude/` delante en el PATH del sujeto y la entrada estándar cerrada. `CLAUDE_BIN` lo sustituye (para el e2e); si acaba en `.mjs`, se lanza con node.
4. **Tope de tiempo** (`SUBJECT_TIMEOUT`): al vencer, mata el árbol de `claude` con `taskkill /T /F` y escribe el mismo `[<etiqueta>] tope de <N> s: sujeto cortado`; el sujeto sale con código 124, como el `timeout` de hoy. Saldo de la fila «Los procesos de un sujeto quedan vivos… al llegar al tope de tiempo».
5. **Carrera (c)**: en seco, con `SPEC_DIR` que no existe en disco, `out_path` no mide la ruta (hoy mide la del scratchpad y puede cortar en falso).
6. **Parada por puertos sin `pwsh`**: al lanzar el sujeto, una foto de `netstat -ano` con qué PID escucha en cada puerto; al acabar, para por PID solo los que escuchan en sus puertos y no estaban en la foto. El relevo de un puerto compartido (`RUNS_DIR/ports/<puerto>`) guarda la foto del primer sujeto que lo saltó, no su hora de arranque. La línea del `.err` no cambia, salvo «no comprobado (pwsh no respondió)», que pasa a «no comprobado (netstat no respondió)».
7. **`SUBJECT_SH` solo acepta `.mjs`**: con un `.sh`, `run.mjs` aborta antes de lanzar con `SUBJECT_SH tiene que ser un .mjs: los subject.sh se fueron con la 0238`. La variable conserva su nombre: la cambian quien lanza y la cabecera de `run.mjs`, sin ganar nada.
8. **Los 14 moldes** (la fila dice 13: no contaba el de `using-sdd`) pasan a `subject.mjs` con los mismos escenarios, moldes y salidas; lo que hoy hacen `sed`, `grep`, `printf` y `cp -r`, en JS (`fs.cpSync`, cadenas).
9. **Tests en proceso**: `cli/test/kit/headless/lib.test.ts` prueba `lib.mjs` con el sistema de ficheros, el reloj y los procesos (`git`, `claude`, `netstat`, `taskkill`) inyectados. Se borran `lib.slow.test.ts`, `identity-and-show.slow.test.ts`, `paths-and-cleanup.slow.test.ts`, `ports.slow.test.ts` y `settings.slow.test.ts`; cada caso suyo pasa a `lib.test.ts` o al e2e, o se dice en el walkthrough por qué no.
10. **Un solo e2e**, `cli/test/kit/headless/subject.test.ts`: `node run.mjs` lanza el `subject.mjs` real de `using-sdd` con un `claude` falso (`CLAUDE_BIN` a un `.mjs` que escribe sus argumentos y un stream). Recupera las dos comprobaciones de `battery.slow`: el molde lleva el marcador con la versión del kit, y la petición `Añade «reservas» con tildes: canción` llega igual, byte a byte.
11. **Moldes en seco y molde de cierre vivo**: `cli/test/kit/headless/molds.test.ts` construye en seco (`DRY_RUN=1`, `KEEP_MOLD=1`) un escenario por cada valor distinto de la columna `Molde` de cada `battery.md`, y comprueba que deja su `tools.txt`. Los de `sdd-archive` (los moldes de cierre de feature y de patch) además llevan `sdd-kit.json` con la versión de `kitVersion` y pasan `sdd capability check`. No hay un molde de cierre aparte en `tests/headless/`: reutilizo los de `sdd-archive`, que ya cierran. Saldo de la fila «Los moldes de campaña reutilizados se quedan viejos».
12. **Objetivo de tiempo**: `kit:test-headless` por debajo de 60 s sin carga; el walkthrough da el antes (262,6 s sin carga, ~740 s con carga, del roadmap) y el después medido.
13. **Se borran**: `tests/headless/lib.sh`, los 14 `subject.sh`, `cli/test/kit/bash.ts`, `cli/test/kit/bash.slow.test.ts`, `findGitBash` y la rama `.sh` de `real-deps.mjs`, `bash`, `runLib`, `serverLaunch` y `fakeClaude` de `cli/test/kit/headless/campaign.ts` si nadie más los usa. En `moon.yml`, la entrada `/cli/test/kit/bash.ts` de `kit:test-headless`.
14. **Se quedan, a propósito**: `tests/headless/no-claude/claude` (bash) y `claude.cmd`, porque no los ejecuta el repo, sino la herramienta Bash o PowerShell del sujeto, y sin ellos un sujeto podría lanzar su propio `claude` sin que se viera su coste. El `"shell": "bash"` del hook de `.claude/settings.json`, que es configuración del harness y lanza `node`. La consulta a `pwsh` de la línea de órdenes de los procesos en `real-deps.mjs`. Los `pwsh` del producto (`cli/src/merge/verify.ts`) y de otros tests de la CLI.
15. **Documentos**: en `tech-stack.md`, las líneas de método que nombran `lib.sh`, `subject.sh` o sus funciones como herramienta pasan a `lib.mjs` y `subject.mjs` (p. ej. «Un lanzador nuevo se escribe sobre `tests/headless/lib.sh`»); las lecciones fechadas que los citan como contexto no se reescriben. `architecture.md` (las 2 líneas de `subject.sh`), los 14 `battery.md` donde nombran `subject.sh` o una función de `lib.sh`, el comentario de `battery.mjs` y la cabecera de `run.mjs`. Las `subject.sh` de las campañas cerradas en `.docs/sdd/specs/` se quedan como evidencia, aunque ya no corren.
- `sdd capability merge` sobre una copia de `.docs/sdd`: «Sin delta que fusionar».
- Política de modelos: sin revisores de la spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin sujetos: no toca texto de skill, así que no pide RED (Art. I) · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar los ejes de la revisión final.

### Decisiones tomadas con el dev-lead

- Alcance: `lib.sh` y los moldes a Node, e2e con un `claude` falso, molde de cierre vivo, el repo sin bash fuera de `.githooks/`, las filas «Actuar → 0238» y las dos comprobaciones de `battery.slow` — prompt de arranque (2026-10-28).
- Partición: la fijó el dev-lead al partir la 0216 («Partir en 2», 2026-10-28); con ~5 tasks en la misma superficie y sin migración, no se propone partir otra vez.
- Diseño por secciones (cómo queda un molde, qué prueba cada test, qué se retira): «si», «si» y la tercera con la pregunta de `pwsh` (2026-10-28).
- `pwsh`: «no hay manera no de qquitarlso todos sin poeprde ralgo?» → los puertos pasan a `netstat -ano`; la consulta de procesos por línea de órdenes se queda — «Mantener pwsh solo ahí (Recomendada)» (2026-10-28).

## Intent

Hoy los moldes y su biblioteca son bash: `kit:test-headless` tarda ~740 s con carga y sus tests fallan con la suite entera y pasan solos (`pwd: write error: Bad file descriptor`, `bash.exe: warning: could not find /tmp`), un rojo que no es de la rama para todas las ramas abiertas. Un sujeto encallado deja vivo su `claude` al llegar al tope, y un molde copiado de otra campaña envejece sin que nada lo avise. El éxito: el repo sin scripts de bash fuera de `.githooks/`, los tests del lanzador en proceso y `kit:test-headless` por debajo de 60 s sin carga, y un molde viejo rojo en el gate. Sería un fracaso aunque funcione si un molde construye otra cosa que hoy (otros ficheros, otro `git log`) o cambian las variables, los ficheros o los textos que leen quien lanza y las baterías.

## Scope

- Entra: `lib.mjs` y sus tests en proceso; los 14 `subject.mjs`; el e2e con `claude` falso; el test de moldes en seco con el de cierre vivo; la carrera (c); el tope de tiempo que mata el árbol; la parada por puertos con `netstat`; `SUBJECT_SH` solo `.mjs`; borrar lo de la decisión 13; documentos (decisión 15).
- No entra: la consulta de procesos por línea de órdenes (se queda en `pwsh`); `no-claude/claude`; el hook de `.claude/settings.json`; reescribir la evidencia cerrada de `.docs/sdd/specs/` y `tests/*.md`; Linux y macOS; cambiar texto de ninguna skill.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `tests/headless/lib.sh` → `tests/headless/lib.mjs` | `tech-stack.md` (19 menciones de `lib.sh`/`subject.sh`); `architecture.md:60-61`; `tests/headless/battery.mjs:7`; `cli/test/kit/headless/campaign.ts` (`libSh`, `runLib`); `campaign.test.ts`, `battery.test.ts`, `run.test.ts` (comentarios o fixtures) | decisiones 1, 13 y 15 |
| `tests/batteries/*/subject.sh` → `subject.mjs` | `battery.mjs:120` (`SUBJECT_SH`); 14 `battery.md` (los que nombran `subject.sh` o una función de `lib.sh`, 13 de 14); `tech-stack.md` («Baterías por skill») | decisiones 8 y 15 |
| Rama `.sh` del lanzador (`findGitBash`, «no encuentro Git Bash para lanzar el subject.sh») | `tests/headless/real-deps.mjs:31-45`; cabecera de `run.mjs` | decisiones 7 y 13 |
| «no comprobado (pwsh no respondió)» → «no comprobado (netstat no respondió)» | `lib.sh:153` | decisión 6 |
| Relevo `ports/<puerto>` con hora de arranque → con foto de PIDs | `lib.sh:129-137` | decisión 6 |
| `cli/test/kit/bash.ts`, `bash.slow.test.ts` | `cli/test/kit/`; `moon.yml:13` | decisión 13 |
| 5 tests `.slow` de `cli/test/kit/headless/` | `cli/test/kit/headless/` | decisión 9 |

- Filas que implementa: 0238 y las filas de deuda «Actuar → 0238» (carrera (c) de «Tres carreras del recuento de `run.sh`»; «Los moldes de campaña reutilizados se quedan viejos»; el tope de tiempo de «Los procesos de un sujeto quedan vivos…»; «Tres tests del lanzador en Vitest pasan de su tope…» en `settings.slow.test.ts` y `lib.sh`; «Más tests del lanzador en Vitest fallan con la suite entera…» en `ports` y `paths-and-cleanup`; «Git Bash se queda con `/tmp` montado sobre una carpeta borrada…») → `roadmap.md`, que las marca al cerrar. Comprobado con `git grep -n "0238" -- skills .docs/sdd/capabilities .docs/sdd/tech-stack.md .docs/sdd/architecture.md`: sin otros sitios.

## Approach

La lógica de `lib.sh` pasa a un módulo de Node con sus dependencias inyectadas (sistema de ficheros, reloj, procesos), como hizo la 0216 con `campaign.mjs`; los moldes la importan y el contrato con el lanzador (`<kit> <etiqueta> <escenario> <salida>` y sus variables) no cambia. Cada molde se porta línea a línea, sin rediseñarlo.

## Dónde se prueba

- Rutas y su tope de 140, carrera (c), guardas de la copia del kit (`.docs/`, `tests/`, `dependencies` sin `SUPERPOWERS_DIR`, skill que falta), `SETTINGS` (kit instalado, `deny-kill.mjs`), argumentos de `claude -p`, `kitVersion` y `putKitMarker`, `TURN2`, la persona, `seedTranscript`, `show`, la identidad de git en la salida, la limpieza del molde y de la carpeta de Claude Code, puertos y relevo, tope de tiempo: `cli/test/kit/headless/lib.test.ts`, en proceso.
- `SUBJECT_SH` con `.sh`: `campaign.test.ts`, en proceso.
- El cableado real (spawn de `claude`, PATH con `no-claude/`, marcador del molde, petición con «» y tildes intacta): `subject.test.ts`, el único e2e.
- Cada clase de molde se construye, y los de cierre pasan `sdd capability check` con la versión del kit: `molds.test.ts`, en seco.
- Ningún test lanza bash ni duerme con reloj fijo: `git grep` de `bash`, `sleep` y `setTimeout` en `cli/test/kit/headless/` en la verificación de la task, y `git ls-files '*.sh'` vacío fuera de `.githooks/` y `.docs/sdd/specs/`.
- Tiempo de `kit:test-headless`: medido sin carga en el cierre.

## Términos y ADR

- Términos resueltos: biblioteca del sujeto — `tests/headless/lib.mjs`; molde de cierre vivo — los moldes de `sdd-archive`, construidos en seco en cada gate.
- ADR candidatas: ninguna.

## Delta de comportamiento

Sin delta: no toca comportamiento de ninguna capacidad.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-28 | aprobada (opción «Apruebo») |

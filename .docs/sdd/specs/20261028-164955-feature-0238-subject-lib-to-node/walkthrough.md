---
id: 20261028-164955-feature-0238-subject-lib-to-node
feature: 0238
title: Walkthrough — La biblioteca del sujeto y los moldes pasan a Node
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-28
---

# Walkthrough — La biblioteca del sujeto y los moldes pasan a Node

## 1. Cambios realizados

- **`lib.mjs`, el núcleo** (`0f1da16b`): `initSubject` porta `subject_init`, `g`, `put`, `commit`, `subject_save`, `subject_keep`, `subject_show`, `seed_transcript`, `put_kit_marker` y la limpieza de `lib.sh`, con el sistema de ficheros y los procesos inyectados; en seco sin `SPEC_DIR` en disco la ruta de salida no se mide (carrera (c)). `lib.test.ts` en proceso.
- **Lanzar `claude`** (`817b7413`): `launch`, `resume` y `converse` con `spawn` sin shell; `CLAUDE_BIN` para los tests; el tope mata el árbol de `claude`; la parada por puertos compara con una foto de `netstat -ano` del arranque, sin `pwsh`.
- **`using-sdd` y el e2e** (`1c018d5b`): su `subject.mjs`, `run.mjs` solo con `.mjs`, `subject.test.ts` con un `claude` falso; se borran los cinco `.slow` de `lib.sh` y `campaign.ts`.
- **Los otros 13 moldes** (`f561e64e`): `subject.mjs` comparados en seco escenario a escenario con su `subject.sh`; `molds.test.ts` construye una clase de cada molde, y los de cierre de `sdd-archive` pasan `sdd capability check` con la versión del kit.
- **El repo sin bash** (`4464d272`): fuera `lib.sh`, `cli/test/kit/bash.ts` y su test; documentos al día.
- **Enmienda del 2026-10-28** (`3990b93d`, `f3dd63d8`): la suite del lanzador en verde en Linux (rutas neutras en los tests de la 0216, procesos de `/proc` fuera de Windows), los tests en proceso de vuelta en `cli:test`, `SUBJECT_TIMEOUT` de 1800 s por omisión y el tope de longitud de `RUNS_DIR`.
- **Pasada de fix de la revisión final** (`527d1cea`): `lib.mjs` en funciones de módulo cortas; limpieza que sigue aunque un paso lance; el sujeto sale con 124 al vencer el tope; sin relevo de puerto sin foto; `SUBJECT_TIMEOUT` y la versión del kit validados; `nodeFs`, `isAlive`, `killProcess` y `runsDirAllowed` compartidos con `campaign.mjs` y `real-deps.mjs`; `subjectCell`, `moldFrom`, `readLf` y `s.initRepo` en vez de repetirlos en los 14 moldes; `kit:test-headless` gana `skills/**`, `.claude-plugin/**` y `cli/src/**` en sus `inputs`, para que un molde viejo salga en el gate de la rama que lo hace envejecer; el e2e prueba un segundo turno con salto de línea y que `no-claude/` bloquea el `claude` anidado.

- **Tope de `RUNS_DIR` de 100 caracteres** (`b14e2095`, Task 7): desvío aprobado por el dev-lead («apruebo», 2026-10-28).
- **Tras la re-revisión** (en el commit de cierre): `tests/headless/no-claude/claude` pasa de bash a node con shebang, y el repo queda sin scripts de bash fuera de `.githooks/`; `initRepo` sale de `bindMoldTools`; documentos al día.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 6 h (4-8)
- Esfuerzo real: 3,02 h — reloj de la sesión 3,53 h desde 2026-10-28T15:40Z, sin 31 min de espera al dev-lead (7 esperas)
- Desviación: −2,98 h (−50 %)
- Causa de la desviación: el port fue casi literal y el comparador en seco (`.sh` frente a `.mjs`) sustituyó la revisión a mano de cada molde; los tests en proceso corren en segundos. La enmienda y la pasada de fix (26 hallazgos) entraron dentro de esas horas.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 193.410.473 — claude-opus-5-5 193.410.473
- Tokens de subagentes: 18.255.041 en 3 despachos — Re-revisión final 0238 claude-opus-5-5 6.246.663 / 7 min; Final review — Code axis claude-sonnet-5-5 6.042.519 / 8 min; Final review — Spec axis claude-opus-5-5 5.965.859 / 8 min
- Coste de la sesión: 61,89 $ (hilo 53,30 $ + subagentes 8,59 $)
- Coste de sujetos: 0 $ (sin sujetos: no toca texto de skill)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Enmienda del 2026-10-28** (spec, `## Enmiendas`), pedida por la sesión `develop` de parte del dev-lead: Task 6 nueva al final.
- **Enmienda 2.ª del 2026-10-28**, desvío que paró y aprobó el dev-lead: tope de `RUNS_DIR` de 100 caracteres (Task 7) y cuatro textos de error nuevos en la spec. El texto «falta git init en el subject.mjs antes del primer git» queda en `## Enmiendas` sin aprobar.
- **Base integrada a mitad** (`1b22175b`): traía la 0230 (que cambió `sdd-archive/subject.sh`), la 0233 (la exclusión de `test/kit/headless/` en `cli/vitest.config.ts`) y el CI de Linux.
- **Casos de los `.slow` que no se portan**: «seed_transcript en una tubería» (en Node no hay tuberías) y «subject_cleanup no borra con etiqueta vacía o fuera de RUNS» (lo sustituye la validación de la etiqueta en `initSubject`).
- **El caso «el sujeto no puede lanzar su propio claude»** del `settings.slow.test.ts` borrado vuelve en la pasada de fix, en el e2e: el `claude` falso lanza `claude` con shell y recibe el bloqueo de `no-claude/`.

### Decisiones tomadas sin el dev-lead

Los rulings del ledger, en `tasks.md` §Rulings (48 líneas: pre-flight, Tasks 1-7 y cierre de la revisión). Los que más cuestan si son erróneos:

- `etiqueta no válida: «<etiqueta>»` sustituye a la guarda de la limpieza de `lib.sh` (aprobado después en la enmienda 2.ª).
- El tope de `SUBJECT_TIMEOUT` lo pone `lib.mjs` con un temporizador inyectado; sin foto de `netstat` al arrancar, la limpieza no para nada.
- Los tests en proceso no usan rutas `C:\` para correr en el CI de Linux; fuera de Windows, `real-deps.mjs` lee los procesos de `/proc` y para por PID, sin árbol.
- `molds.test.ts` copia el kit con `cpSync` (sin `tar`) y lanza cada `subject.mjs` directamente, con `maxConcurrency: 12`.
- El orden del listado de `sdd-upgrade` no reproduce el `sort` de Git Bash (un listado del informe en otro orden).
- Un servidor ajeno reiniciado durante el sujeto se para, como hacía `lib.sh` (decisión 6 frente al Review Focus 2 del plan).

✋ Sin revisar: el commit de cierre — `no-claude/claude` en node, `initRepo` fuera de `bindMoldTools` y los documentos que pidió la re-revisión.

## 4. Verificación

### 4.1 Builds

- Gate de cierre: con otra rama abierta (`patch/0245-windows-only-tests`), corre una vez en el paso 6 sobre el merge de sincronización; su línea `Gate:` y su sha van en el mensaje final.
- `test/kit/headless` con vitest directo: 221/221 en 58,5 s sin carga (antes, 262,6 s sin carga y ~740 s con carga, del roadmap).
- Linux, contenedor `ubuntu:24.04` con el `ci-linux.sh` de la sesión del CI, sobre el commit de antes del cierre: `kit:test-headless` 221/221 en 32 s; sobre `b14e2095`, también `cli:typecheck` en verde. `cli:test-min` en Linux trae 4 rojos de `develop`, en ficheros que esta rama no toca.
- Pre-commit (`cli:typecheck`, `cli:test`, `kit:test-fast`, `kit:roadmap`) en verde en cada commit de la rama; `cli:test` 1582/1582 (12 saltados) en el último.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-28 · verificación del agente: suite en proceso y e2e, moldes en seco de las 14 baterías comparados con sus `.sh` antes y después de la pasada de fix, suite en Linux, smoke real de `battery.mjs run` y de los dos rechazos de `run.mjs`, revisión final Spec y Código con pasada de fix y re-revisión · 1 sin revisar (el commit de cierre)

| Decisión | Evidencia | Resultado |
| --- | --- | --- |
| 1 API de `lib.mjs`, ficheros y textos de `lib.sh` | suite (`lib.test.ts`, 71 casos) · ejecución real (comparación en seco de los 14 moldes) | ✅ |
| 2 rutas Windows sin `cygpath` | suite · ejecución real (moldes en seco) | ✅ |
| 3 `spawn` sin shell, `no-claude/`, `CLAUDE_BIN` | suite (e2e `subject.test.ts`) | ✅ |
| 4 tope que mata el árbol y sale con 124 | suite (reloj falso) · no probado (`taskkill /T` real al vencer) | ✅ en dobles · real no probado |
| 5 carrera (c) | suite (falla con la lógica vieja) | ✅ |
| 6 puertos con foto de `netstat` | suite (siete casos, relevo incluido) | ✅ |
| 7 `SUBJECT_SH` `.sh` rechazado | ejecución real (smoke 3: `SUBJECT_SH tiene que ser un .mjs: los subject.sh se fueron con la 0238`, código 1) | ✅ |
| 8 14 moldes con las mismas salidas | ejecución real (comparación `.sh` frente a `.mjs` de cada escenario: mismo árbol; solo cambian el orden de commits del mismo segundo, el puerto aleatorio del E2E y el orden de un listado de `sdd-upgrade`) | ✅ |
| 9 tests en proceso y los `.slow` fuera | suite · `git ls-files` | ✅ |
| 10 e2e con las dos comprobaciones recuperadas | suite (`subject.test.ts`) | ✅ |
| 11 moldes en seco y cierre vivo | suite (`molds.test.ts`, 95 casos) · ejecución real (smoke 1: `battery.mjs run` en seco guarda los 2 sujetos de `sdd-init`) | ✅ |
| 12 menos de 60 s sin carga | ejecución real (58,5 s) | ✅ al límite |
| 13 y 14 retirada de bash | `git ls-files '*.sh'` vacío fuera de `.githooks/` y `specs/`; ningún `#!/usr/bin/env bash` fuera de `.githooks/` | ✅ |
| 15 documentos | lectura de `tech-stack.md`, `architecture.md`, README y `battery.md` | ✅ |
| Enmienda: suite en Linux | ejecución real (contenedor `ubuntu:24.04`, 221/221) | ✅ |
| Enmienda: tope de `RUNS_DIR` | ejecución real (smoke 2: `RUNS_DIR de 130 caracteres (máximo 100): …`, código 1) · suite | ✅ |
| Enmienda: tope de 1800 s por omisión | suite | ✅ |
| Enmienda: tests en proceso en `cli:test` | suite (`cli:test` 1582, con `lib`, `campaign`, `battery` y `listening-pids`) | ✅ |

### 4.3 Residuales / deuda generada

- El lanzamiento real de `claude` en Windows (`where claude` y `taskkill /T` al vencer el tope) solo está probado con dobles.
- `molds.test.ts` corre con cada cambio de `skills/**`, `.claude-plugin/**` o `cli/src/**`: `kit:test-headless` (~60 s) entra en casi todos los gates de cierre.

## 5. Aprendizajes

- Para portar un molde sin cambiarlo: construir en seco cada escenario con la versión vieja y con la nueva, y comparar el árbol del molde sin `.git` y el `state.txt` sin hashes. Encontró los cambios de fin de línea de los `sed` de Git Bash, que leyendo no se veían → `tech-stack.md`, «Sujetos headless»
- El `tar` del PATH en Windows puede ser el de Git Bash, que toma `D:` como un host; `ubuntu:24.04` no trae `ps`. Lo que los tests de la suite necesiten del sistema, mejor de Node (`cpSync`, `/proc`) → `tech-stack.md`, «Sujetos headless»
- Revisión de skills: esta feature no cambia ninguna skill; `.claude/skills/` del repo (`skill-creator`, `writing-for-agents`, `writing-skills`) no nombra el lanzador

## 6. Adendas

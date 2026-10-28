---
id: 20261028-124244-feature-0216-node-subject-launcher
feature: 0216
title: Walkthrough — El orquestador de sujetos pasa a Node
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-28
---

# Walkthrough — El orquestador de sujetos pasa a Node

## 1. Cambios realizados

- **Núcleo de la campaña** (`e120bf17`): `tests/headless/campaign.mjs` lleva la lógica de `run.sh` con las dependencias inyectadas (sistema de ficheros, reloj, cerrojo, lanzamiento, procesos): cupo `MAX_PARALLEL`, techos `SUBJECT_CAP` y `COST_CAP`, etiqueta comprobada dentro del cerrojo, cortados sin salida, separación `DRY_RUN`, parada por `RUNS_DIR/stop`, ruta de `RUNS_DIR` y su tope, `KIT_DIR` absoluto y la guarda de `cli/bin/sdd.js`; los textos de salida son los de `run.sh`, literales. `cli/test/kit/headless/campaign.test.ts` lo prueba en proceso con `memory-fs.ts`, sin bash, `pwsh` ni temporizadores reales.
- **`run.mjs` sustituye a `run.sh`** (`6df155a6`): `tests/headless/real-deps.mjs` da las dependencias reales (el cerrojo es `withLock` con 120 min, el sujeto `.mjs` se lanza con node y el `.sh` con Git Bash, sin `cygpath`); `run.mjs` lleva la cabecera de uso y la parada por señal. Un único test de extremo a extremo (`run.test.ts`) con un sujeto falso; se borran `run.sh`, `caps-and-locks.slow.test.ts` y `run-dry.slow.test.ts`; `lib.sh` mira el PID de Windows con node.
- **Limpieza del árbol de procesos** (`f3ed6941`): al acabar cada sujeto, y al arrancar para los cortados de una tanda anterior, se paran por PID (`taskkill /T /F`) los procesos cuya línea de órdenes nombra la carpeta del sujeto, comparada sin barras ni mayúsculas, con la línea `[<etiqueta>] paro <N> procesos de <carpeta>`.
- **`battery.mjs run` sustituye a `battery.sh`** (`9ed4a9f3`): lanza la batería por índice y modelo con `runCampaign`, se niega a relanzar etiquetas guardadas y da rojo con `· el kit no cargó en <etiqueta>` cuando la primera llamada a `Skill` devuelve `Unknown skill`; `battery.test.ts` en proceso; los 13 `battery.md` y `subject.sh` y `tech-stack.md` nombran los comandos nuevos.
- **Roadmap** (`c7b35f2a`): la 0216 se parte; la 0238 (`parent: 0216`) se lleva `lib.sh`, los 13 `subject.sh`, el e2e con un `claude` falso y el molde vivo de cierre, con sus filas de deuda.

## 2. Tiempo y coste: estimado vs real

- Tipo: tooling
- Estimación de implementación (del plan): 4 h (3-5)
- Esfuerzo real: 2,39 h — reloj de la sesión 2,74 h desde 2026-10-28T12:14Z, sin 21 min de espera al dev-lead (5 esperas)
- Desviación: −1,61 h (−40 %)
- Causa de la desviación: el núcleo se portó casi literal de `run.sh` y los tests en proceso corren en segundos, sin esperar a sujetos; el plan contaba con más incertidumbre en la consulta de procesos de la que hubo. El reloj incluye ~60 min en que la verificación de la Task 4 esperó el cerrojo de suites de otros worktrees mientras el hilo seguía trabajando
- Compactación: sí — sigo con Native, quedaba 1 task (la 4)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 50.577.618 — claude-opus-5-5 50.577.618
- Tokens de subagentes: 7.546.517 en 3 despachos — Final review — Code axis claude-sonnet-5-5 1.484.621 / 4 min; Re-review final 0216 claude-opus-5-5 1.375.703 / 3 min; Final review — Spec axis claude-opus-5-5 4.686.193 / 9 min
- Coste de la sesión: 24,02 $ (hilo 19,08 $ + subagentes 4,94 $)
- Coste de sujetos: 0 $ (sin sujetos: no toca texto de skill)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Pasada de fix de la revisión final** (juntada en el cierre): `stopOnSignal` sale de `run.mjs` a `real-deps.mjs` y lo usa también `battery.mjs run`; su cuerpo es `stopCampaign` de `campaign.mjs`, probado en proceso. El barrido lista los procesos una vez para todos los cortados. El sujeto recibe `RUNS_DIR`, `SPEC_DIR` y `KIT_DIR` absolutos. Una etiqueta ya guardada no espera hueco.
- **Textos de salida nuevos**, fuera de la lista de la spec, que piden los hallazgos de la revisión: `[<etiqueta>] no pude listar los procesos: <motivo>`, `COST_CAP tiene que ser un número: <valor>` y `no encuentro Git Bash para lanzar el subject.sh`.
- **`battery.slow.test.ts`**: la Task 4 se quedó con sus dos casos de sujeto; la revisión lo marcó como desvío de la decisión 12 y la pasada de fix lo borra, como dice la spec.
- La verificación de la Task 4 con `moon run kit:test-headless` no corrió: el cerrojo de suites venció a los 60 min, en manos de otros worktrees. Se corrieron directamente los tests de la task.

### Decisiones tomadas sin el dev-lead

Los rulings del ledger, en `tasks.md` §Rulings.

## 4. Verificación

### 4.1 Builds

- Gate de cierre: con dos ramas abiertas (0230 y 0231), corre una sola vez en el paso 6 sobre el merge de sincronización; su línea `Gate:` y su sha van en el mensaje final. El «antes» de `kit:test-headless`: 262,6 s sin carga y ~740 s con carga (roadmap); el «después», el de esa ejecución.
- Pre-commit (`moon run cli:typecheck cli:test kit:test-fast kit:roadmap`) en verde en cada commit de la rama; `cli:test` 1482/1482 (12 saltados) en el de la Task 4.
- Tests de la pasada de fix: `campaign.test.ts`, `battery.test.ts` y `run.test.ts` 43/43; `tsc --noEmit` limpio.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-28 · verificación del agente: tests en proceso y extremo a extremo (43/43), smoke real de `run.mjs` y `battery.mjs` con 9 casos (los de fallo, provocados con su entrada), comprobación a mano del barrido tras un corte en seco, revisión final Spec y Código sobre 9ed4a9f3 con pasada de fix y re-revisión · la suite corre sobre el merge de sincronización (paso 6)

| Decisión | Evidencia | Resultado |
| --- | --- | --- |
| 1 `node run.mjs` y `node battery.mjs run` con las mismas variables y textos | ejecución real (smoke 1-3, 7-9) · suite | ✅ |
| 2 lógica en `campaign.mjs` con dependencias inyectadas | suite (`campaign.test.ts`, 31 casos, sin procesos) | ✅ |
| 3 `.mjs` con node, `.sh` con Git Bash | ejecución real (smoke 1, sujeto `.mjs`) · suite lenta para `.sh` en el paso 6 | ✅ `.mjs` · `.sh` en el gate |
| 4 `KIT_DIR` relativo → absoluto (y `RUNS_DIR`, `SPEC_DIR` tras la revisión) | ejecución real (smoke 1: el sujeto imprimió las rutas absolutas) | ✅ |
| 5 guarda de `cli/` con su mensaje | ejecución real (smoke 4, código 1) | ✅ |
| 6 veredicto «el kit no cargó» | ejecución real (smoke 8: `e1 · 1/2 · umbral 1/2 · rojo · el kit no cargó en e1-2`, código 1) | ✅ |
| 7 cerrojo `withLock`, dueño a medio escribir | suite (`with-lock.test.ts`, campaña con cerrojo) | ✅ |
| 8 etiqueta dentro del cerrojo | ejecución real (smoke 2: `ya existe a-1: sube SUBJECT`) · suite (dos lanzadores) | ✅ |
| 9 marcas con PID de Windows; `other_subject_ports` con node | suite (`ports.slow.test.ts` en el paso 6) | en el gate |
| 10 limpieza al acabar, al arrancar y con señal | ejecución real (barrido tras corte en seco: sueltos 1 → 0) · suite (`run.test.ts`, `stopCampaign`) · no probado (enganche de `process.once`) | ✅ · señal real no probada |
| 11 cabecera de `run.mjs` con `.temp/<id>/` | lectura del fichero | ✅ |
| 12 tests nuevos en proceso y un extremo a extremo; se borran los lentos | suite · `git diff --name-status` | ✅ |
| 13 tests lentos de `lib.sh` con `node run.mjs` | suite lenta en el paso 6 | en el gate |
| 14 `moon.yml` sin cambios | `git diff develop -- moon.yml` vacío | ✅ |
| 15 documentos | lectura de `tech-stack.md`, 13 `battery.md`, 13 `subject.sh` | ✅ |
| Fallos: `RUNS_DIR` fuera, `COST_CAP` no numérico, paso desconocido | ejecución real (smoke 5, 6, 9: códigos 1, 1, 2) | ✅ |

### 4.3 Residuales / deuda generada

- Con `battery.slow.test.ts` se van dos comprobaciones de `subject.sh` sobre `lib.sh`: el molde de la batería de using-sdd lleva el marcador del kit, y la petición con «» y tildes llega intacta al sujeto. Las recupera la 0238 al pasar `lib.sh` y los `subject.sh` a Node.
- El enganche de señales (`process.once` de `SIGINT`, `SIGTERM`, `SIGBREAK`) no tiene test ni prueba a mano; su cuerpo (`stopCampaign`) sí.
- Al parar con una señal, un sujeto que ya guardó `tools.txt` y sigue en su limpieza no se barre: `taskkill /T` se lleva su árbol, pero no un proceso desenganchado que nombre su carpeta.
- La Confirmación de la ADR 0002 nombra `tests/headless/battery.sh`; la ADR es inmutable y la sustituirá la próxima que toque las pruebas por batería.

## 5. Aprendizajes

- Con varios worktrees corriendo suites, `moon run kit:test-headless` puede quedarse 60 min esperando el cerrojo de suites y vencer sin correr nada: la verificación de una task corre sus tests directamente y la suite entera queda para el gate de cierre → `tech-stack.md` §Testing, junto al cerrojo de suites
- Revisión de skills: esta feature no cambia ninguna skill; `.claude/skills/` del repo (`skill-creator`, `writing-for-agents`, `writing-skills`) no repite reglas del lanzador

## 6. Adendas

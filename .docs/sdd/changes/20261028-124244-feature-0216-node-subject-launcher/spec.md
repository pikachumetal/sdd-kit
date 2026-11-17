---
id: 20261028-124244-feature-0216-node-subject-launcher
feature: 0216
parent: 0214
title: El orquestador de sujetos pasa a Node
mode: full
profile: delegate
status: approved
created: 2026-10-28
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-28
---

# Spec — El orquestador de sujetos pasa a Node

🦆 Quien lanza una campaña o una batería escribe `node tests/headless/run.mjs` o `node tests/headless/battery.mjs run` en lugar de `bash …`, con las mismas variables y las mismas líneas de salida («sujetos de la campaña: 2 · coste acumulado: 1.42 $»). Al acabar un sujeto, o al cortar la tanda, no quedan procesos suyos vivos que impidan borrar la carpeta de runs. Una copia del kit sin `cli/` o con ruta relativa ya no da verdes falsos. Los tests del orquestador corren en segundos, en proceso, sin bash ni esperas de reloj. Los `subject.sh` y `lib.sh` siguen en bash hasta la 0238.

## Capacidades

- Ninguna, porque herramientas: el lanzador de sujetos es una herramienta de test del repo del kit; ningún proyecto consumidor lo ve.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (el contrato orquestador → subject.sh: argumentos, variables y marcas de live/) · tamaño: ~900 líneas en ~35 ficheros, casi todo tests nuevos y una línea por battery.md
- Técnica: si el formato de las marcas de live/ con PID de Windows rompe la lectura de other_subject_ports de lib.sh (señal: contrato público)
- Mínimo razonable: ninguna — lo deja sin mirar un revisor, y lo cubre el test de extremo a extremo con un sujeto real de lib.sh en la suite lenta que queda
```

1. **Comandos**: `node tests/headless/run.mjs` sustituye a `bash tests/headless/run.sh`, y `node tests/headless/battery.mjs run` a `bash tests/headless/battery.sh`, con las mismas variables de entorno y los mismos textos de salida. `run.sh` y `battery.sh` se borran. — La 0216 pide Node; conservar variables y textos deja intactos los `subject.sh`, los `battery.md` y lo que leen los tests lentos que siguen.
2. **La lógica vive en `tests/headless/campaign.mjs`**, con sus dependencias inyectadas: reloj y espera, sistema de ficheros, `isAlive(pid)`, lanzar un sujeto, listar procesos y matar. `run.mjs` y `battery.mjs run` solo cablean las reales. — Es lo que permite probarla en proceso, como pidió el dev-lead.
3. **Cómo se lanza el sujeto**: `child_process.spawn` sin shell. Un `SUBJECT_SH` acabado en `.mjs` se lanza con `node`, y uno acabado en `.sh` con Git Bash, resuelto como `cli/test/kit/bash.ts`: el de `Program Files`, nunca el `bash` de WSL. Atajo comentado en el código: el `.sh` se va con la 0238.
4. **`KIT_DIR` relativo se resuelve a ruta absoluta** antes de pasarlo al sujeto, en lugar de abortar. — Arregla la causa: el sujeto arranca en otra carpeta y la relativa no resolvía.
5. **Guarda de la copia del kit**: sin `cli/bin/sdd.js` en `KIT_DIR`, aborta antes de lanzar con `la copia del kit no lleva cli/: sácala con git archive <commit> skills .claude-plugin agents cli hooks`. El mismo literal sustituye al mensaje de `subject_init` en `lib.sh`.
6. **Veredicto «el kit no cargó»**: si la primera llamada a `Skill` del `tools.txt` de un sujeto devuelve `Unknown skill`, esa ejecución no pasa, y la línea del escenario lleva `· el kit no cargó en <etiqueta>`. Ejemplo: `e1 · 1/2 · umbral 2/2 · rojo · el kit no cargó en e1-2`.
7. **Cerrojo de lanzamiento**: `withLock` de `cli/src/git/lock.ts` sobre `RUNS_DIR/live/.lock`, importado desde el `.mjs` (Node ≥ 22.18 quita los tipos), con un tope de espera de 120 min. — Ya tolera el dueño a medio escribir (espera en lugar de romperlo) y detecta el huérfano por PID, así que cierra la carrera (a). El cerrojo de hoy es una carpeta (`mkdir`).
8. **Etiqueta dentro del cerrojo**: «ya existe <etiqueta>: sube SUBJECT» se comprueba después de esperar hueco y dentro del cerrojo. — Cierra la carrera (b).
9. **Marcas de `live/` con el PID de Windows** del proceso lanzado, escrito antes de soltar el cerrojo. `other_subject_ports` de `lib.sh` comprueba ese PID con `node -e` en lugar de `kill -0`, porque el `kill` de Git Bash no ve PIDs de Windows.
10. **Limpieza de procesos**: al acabar cada sujeto, por cualquier motivo, el orquestador para los procesos cuya línea de órdenes contiene la carpeta del sujeto (`RUNS_DIR/<fase>/<etiqueta>`, la que `claude -p` recibe en `--add-dir`). La lista sale de una consulta a `Win32_Process` con `pwsh`, y se avisa con `[<etiqueta>] paro <N> procesos de <carpeta>`. Con `SIGINT`, `SIGTERM` o `SIGBREAK`, mata el árbol de cada sujeto vivo con `taskkill /T /F /PID` y barre igual. Al arrancar, barre los cortados de una tanda anterior (marca con el PID muerto y sin `tools.txt`), porque `TaskStop` puede matar el orquestador sin que corra ningún manejador. Atajo comentado: un proceso desenganchado con `nohup` cuya línea no nombra la carpeta del sujeto no cae, y lo cubre la parada por puertos de `lib.sh`. Solo Windows, como el resto del lanzador.
11. **Cabecera de `run.mjs`**: el RED de un patch se lanza con `SPEC_DIR` en `.temp/<id>/` del repo, no en el scratchpad (saldo de la fila del tope de ruta).
12. **Tests que se van y tests nuevos**: `caps-and-locks.slow.test.ts`, `run-dry.slow.test.ts` y `battery.slow.test.ts` se borran. Los sustituyen `campaign.test.ts` y `battery.test.ts`, en proceso, y un único extremo a extremo, `run.test.ts`: `node run.mjs` con un `subject.mjs` falso que escribe su `tools.txt`, sin bash ni `claude`. Los nombres no llevan `.slow`.
13. **Los tests lentos de `lib.sh` se quedan** (`lib`, `paths-and-cleanup`, `ports`, `identity-and-show` y `settings`) hasta la 0238. Solo cambia `campaign.ts`, que pasa a lanzar `node run.mjs`. `kit:test-headless` baja, pero no a lo que tarda una suite unitaria. El walkthrough da el antes y el después medidos.
14. **`moon.yml` no cambia**: `kit:test-headless` ya corre `test/kit/headless` entero, y sus entradas cubren `tests/headless/**`. Si al implementar hiciera falta tocarlo, es un desvío y se avisa por el choque con la 0228.
15. **Documentos**: en `tech-stack.md`, las líneas de método que nombran `run.sh` o `battery.sh` como herramienta pasan al comando nuevo (las de «Sujetos headless» y «Baterías por skill»). Las lecciones fechadas que citan `run.sh` como contexto de lo que pasó no se reescriben. También cambia la línea «Se lanza con» y la de «Dos veredictos» de los 13 `battery.md`, y la cabecera de comentario de los 13 `subject.sh`.
- `sdd capability merge` sobre una copia de `.docs/sdd`: «Sin delta que fusionar».
- Política de modelos: sin revisores de la spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin sujetos: no toca texto de skill, así que no pide RED (Art. I) · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar los ejes de la revisión final.

### Decisiones tomadas con el dev-lead

- Partir la 0216 en dos: la orquestación aquí, y `lib.sh`, los moldes, el e2e con `claude` falso y el molde de cierre vivo en la 0238 — «Partir en 2 (Recomendada)» (2026-10-28).
- `child_process.spawn` lanza sin bash y con rutas de Windows, sin `cygpath` — prompt de arranque (2026-10-28).
- La lógica se prueba en proceso, con el reloj y el sistema de ficheros inyectados, sin `sleep` ni bash, y hay un solo test de extremo a extremo — prompt de arranque (2026-10-28).
- En paralelo con la 0228, que solo choca en `moon.yml`; la que cierre segunda integra la base — prompt de arranque (2026-10-28).
- Diseño por secciones (lanzar, cortar y limpiar, tests): «si», «si», «si» (2026-10-28).

## Intent

Hoy `kit:test-headless` tarda ~740 s, y sus tests fallan con la máquina cargada o con la suite entera y pasan solos: lanzan bash, `sleep 4` y `run.sh` reales. El orquestador en bash tiene dos carreras abiertas. Deja procesos vivos al cortar una tanda, y eso impide borrar las carpetas de runs. Además da verdes falsos con un `KIT_DIR` relativo o con una copia del kit sin `cli/`. El éxito es que la orquestación quede en Node con su lógica probada en proceso (ningún test del orquestador lanza bash ni espera con reloj fijo), que cortar una tanda no deje procesos de sus sujetos y que esas dos copias del kit no puedan dar verde. Sería un fracaso aunque funcione si un `subject.sh` actual deja de correr o cambian los textos que leen quien lanza y los tests que quedan.

## Scope

- Entra: `run.mjs`, `campaign.mjs` y `battery.mjs run`; borrar `run.sh` y `battery.sh`; las carreras (a) y (b); la limpieza de procesos; `KIT_DIR` absoluto; la guarda de `cli/`; el veredicto «el kit no cargó»; `other_subject_ports` y el mensaje de `subject_init` en `lib.sh`; tests en proceso más un extremo a extremo; `campaign.ts` de los tests lentos que quedan; documentos (decisión 15).
- No entra: el resto de `lib.sh` y los 13 `subject.sh` (0238); el e2e con `claude` falso (0238); el molde de cierre vivo (0238); la carrera (c), `versioned_out` (0238); el tope de tiempo por sujeto, que sigue en `lib.sh` (0238); Linux y macOS.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `bash tests/headless/run.sh` → `node tests/headless/run.mjs` | `.docs/sdd/tech-stack.md` (líneas de método de «Sujetos headless»: lanzador de referencia, techo de coste, parada con `RUNS_DIR/stop`, `SPEC_DIR` absoluto); `cli/test/kit/headless/campaign.ts` (`runSh`) | decisiones 1, 13 y 15 |
| `tests/headless/battery.sh` → `node tests/headless/battery.mjs run` | 13 `tests/batteries/*/battery.md` («Se lanza con», «Dos veredictos»); 13 `tests/batteries/*/subject.sh` (cabecera de comentario); `tech-stack.md` («Baterías por skill», línea de `/sdd-kit:<skill>`) | decisiones 1 y 15 |
| Mensaje «sácala con git archive <commit> skills .claude-plugin» | `tests/headless/lib.sh:53`; `tech-stack.md` (lanzador de referencia) | decisión 5 |
| Cerrojo `RUNS_DIR/live/.lock` como carpeta → fichero de `withLock` | `tests/headless/run.sh:82-96` | decisión 7 |
| Marca de `live/` con PID de bash → PID de Windows | `run.sh:119-125`, `lib.sh:101-111` (`other_subject_ports`) | decisión 9 |
| `run.sh`, `battery.sh`, `caps-and-locks.slow.test.ts`, `run-dry.slow.test.ts`, `battery.slow.test.ts` | `tests/headless/`, `cli/test/kit/headless/` | se borran: decisiones 1 y 12 |

- Filas que implementa: 0216 y las filas de deuda «Actuar → 0216» (carreras (a) y (b), tope de ruta del RED de un patch, procesos vivos al cortar, `KIT_DIR` relativo, tests del lanzador sobre su tope y con la suite entera en lo de `run.sh` y `battery.sh`, guarda de `cli/`) → `roadmap.md`, que las marca al cerrar; `tech-stack.md` no nombra el id. Comprobado con `git grep -n "0216" -- .docs/sdd skills`, sin otros sitios fuera de los field-reports, que no se editan.

## Approach

Un módulo en Node con la lógica de la campaña y sus dependencias inyectadas, y dos entradas finas que lo cablean. El contrato con el sujeto no cambia: `<kit> <etiqueta> <escenario> <salida>`, las mismas variables y las marcas de `live/`, ahora con el PID de Windows. Así los `subject.sh` y `lib.sh` siguen funcionando hasta que la 0238 los pase a Node. El cerrojo reutiliza `withLock` de la CLI. La limpieza de procesos usa la línea de órdenes que nombra la carpeta del sujeto.

## Dónde se prueba

- Cupo (`MAX_PARALLEL`, también contando marcas de otro `run.mjs`), techos de sujetos y de coste, `RUNS_DIR/stop`, etiquetas ya guardadas o en curso, cortados, informe por carpeta y total: `cli/test/kit/headless/campaign.test.ts`, en proceso con fs en memoria y reloj falso.
- Carreras (a) y (b): `campaign.test.ts`, con un dueño del cerrojo a medio escribir y dos lanzamientos con la misma etiqueta.
- Limpieza de procesos (al acabar, con señal y al arrancar tras un corte en seco): `campaign.test.ts`, con la lista de procesos y `kill` inyectados.
- `KIT_DIR` absoluto y guarda de `cli/`: `campaign.test.ts`.
- Plan, tramos, etiqueta ya guardada y veredicto con «el kit no cargó»: `cli/test/kit/headless/battery.test.ts`, en proceso.
- Que el cableado real lanza, cuenta y limpia: `cli/test/kit/headless/run.test.ts`, el único extremo a extremo, con un `subject.mjs` falso.
- Que un `subject.sh` real sobre `lib.sh` sigue corriendo: los tests lentos que quedan (`lib`, `paths-and-cleanup`, `ports`, `identity-and-show`, `settings`), con `campaign.ts` lanzando `node run.mjs`.
- Ningún test nuevo lanza bash ni duerme: `campaign.test.ts` y `battery.test.ts` no importan `bash.ts` ni usan temporizadores reales; se comprueba con grep en la verificación de la task.

## Términos y ADR

- Términos resueltos: orquestador — `run.mjs` y `battery.mjs run`, que lanzan y cuentan sujetos; biblioteca del sujeto — `lib.sh`, hasta la 0238.
- ADR candidatas: ninguna.

## Delta de comportamiento

Sin delta: no toca comportamiento de ninguna capacidad.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-28 | aprobada (opción «Apruebo») |

---
id: 20261025-144428-feature-0210-session-end-temp-cleanup
feature: 0210
title: Walkthrough — El plugin borra los temporales de Claude Code del proyecto al cerrar la sesión
spec: ./spec.md
status: done
created: 2026-10-25
---

# Walkthrough — El plugin borra los temporales de Claude Code del proyecto al cerrar la sesión

## 1. Cambios realizados

- **Hook** — `hooks/hooks.json` gana un `SessionEnd` sin `matcher`, en forma exec, que ejecuta `sdd hook session-end`.
- **CLI** — `cli/bin/session-end.js` (JavaScript sin tipos, como `session-start.js`): `projectFolderName` (la regla del nombre, con el recorte a 200 y el hash medidos), `parseInput`, `projectTempDir` con las guardas, `writtenSince` (el fichero más reciente, recursivo, con salida en el primero reciente), `cleanSessionTemp(stdin, env, { now, deadline })` y `runSessionEnd`, que fija el plazo a 1 s desde `performance.timeOrigin` y sale siempre con 0. `cli/bin/sdd.js` lo atiende antes de comprobar la versión de Node; `cli/src/hook/session-end.ts` lo reexporta y `hookSessionEndVerb` entra en `VERBS`.
- **Tests** — `cli/test/hook/session-end.test.ts` (escenario de la spec, bases, junction, plazo, sesión sin ficheros, guardas, nombre y hash, `hooks.json`), `session-end-tolerance.test.ts` (un `rmSync` que falla no impide las demás) y `session-end.slow.test.ts` (por `sdd.js`, proceso aparte: salida 0, stdout y stderr vacíos, aviso por stderr).
- **Docs** — `architecture.md` (línea de `hooks/`) y `tech-stack.md` («Hook de sesión») nombran el `SessionEnd`, dentro de sus topes de palabras; el delta de `cli` fusionado en `capabilities/cli.md`.
- Commits: apertura `216e25b3`, enmienda de la decisión 6 `77f43cde`, merge de `develop` `90b61622`, task `2428e5ed`, pasada de fix `cd1fdacb`, y el cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 2,37 h — reloj de la sesión 5,33 h desde 2026-10-25T13:40Z, sin 178 min de espera al dev-lead (8 esperas)
- Desviación: -0,13 h (-5 %)
- Causa de la desviación: dentro del ±30 %, pero las dos cifras se compensan: el reloj cuenta como espera al dev-lead los turnos que cerré esperando tareas en segundo plano (la línea base, el gate, los ejes y la re-revisión; el dev-lead contestó en segundos), y suma dos cuelgues del PC y tres pasadas de la suite lenta. Es el caso (b) del patch 0211, en otra forma.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 36.306.021 — claude-opus-5-5 36.306.021
- Tokens de subagentes: 2.301.473 en 3 despachos — Final review — Code axis claude-sonnet-5-5 420.485 / 2 min; Final review — Spec axis claude-opus-5-5 1.276.761 / 5 min; Re-review final 0210 claude-opus-5-5 604.227 / 3 min
- Coste de la sesión: 14,83 $ (hilo 12,76 $ + subagentes 2,07 $)
- Coste de sujetos: ~0,03 $ en 2 sujetos claude-haiku — sonda de rutas largas (el primero no arrancó: cwd de 261 caracteres)
- Review de spec: no (lite)

## 3. Desviaciones del plan

- **Enmienda de la decisión 6** (aprobada por el dev-lead, opción «Apruebo»): la sonda midió que el hash del recorte se reproduce desde Node, así que el nombre se calcula exacto y sale la guarda de «varias candidatas».
- **Merge de `develop` a mitad** (opción «Fusiono develop y sigo»): el freno de alcance por `tech-stack.md`, que el patch 0169 cambió en otras líneas.
- **Nombre del hash** (ruling, en «Enmiendas»): «djb2» pasa a «32 bits, multiplicador 31», que es lo que hace la fórmula medida; el valor no cambia.

### Decisiones tomadas sin el dev-lead

- Línea base con `FastSuiteBudget` en rojo (34,1 s frente a 30 s) con la sonda corriendo a la vez — deuda del patch 0190 («la carga de otras sesiones») — coste si está mal: un rojo propio tapado.
- El plazo de 1 s cuenta desde `performance.timeOrigin`, no desde la llamada: `node` tarda ~700 ms en arrancar con la máquina cargada, y 700 + 1000 pasa de 1,5 s — coste si está mal: se limpian menos sesiones por cierre.
- «Declined to judge» de los dos ejes (una sesión viva sin escrituras en 24 h se borra; un `rmSync` enorme cortado a 1,5 s; el contrato del `cwd` con el harness; `hooks.json` sin `matcher`; `session-end.ts` sin importadores; las dos bases; la tabla de `sdd-templates`) — son decisiones de la spec aprobada o medidas por la sonda — coste si está mal: una fila nueva.
- El verbo `hookSessionEndVerb` sin test propio: lo cubre el test de `--help` que recorre `VERBS` — coste si está mal: un verbo mal registrado que el test lento por `sdd.js` no ve.
- Un junction anidado dentro de una sesión: `rmSync` no sigue enlaces y `readdir` recursivo no los recorre como directorios — coste si está mal: se leen fechas de fuera, nunca se borra fuera.
- La aserción tautológica `emoji == surrogates` en `session-end.test.ts` se queda: la que distingue está y falla con el código viejo — coste si está mal: una línea de test inútil.
- Los dos casos de `cwd` inválido no comprueban que `vieja` siga en disco: la guarda sale antes de calcular la carpeta — coste si está mal: una regresión que borrase con `cwd` inválido no la caza ese caso.
- Recuperación tras dos cuelgues del PC con `cli:test-slow` en marcha: se relanzaron solo las suites que faltaban, sin repetir nada más — coste si está mal: ninguno, el resto ya estaba commiteado.
- `cli:test-slow` 296/297 se da por bueno: el fallo es un `git push` del fixture que no escribe sus objetos, pasa en `cli:test-min` y al repetirlo solo — coste si está mal: un rojo real en `lock-and-base` tapado.
- «Por unidades UTF-16» sin medir fuera del BMP: la sonda solo midió ASCII — coste si está mal: con un emoji en una ruta larga el hook no encuentra la carpeta y no borra nada.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` sobre `cd1fdacb` → `cli:test` 1182/1182; `kit:test` 1369 pasan y 1 falla, `FastSuiteBudget` (85 s frente a 30 s, con la CPU al 80-93 % por otras sesiones), que falla igual en `develop` (42,1 s, worktree desanclado): deuda del patch 0190; `cli:test-slow` y `cli:test-min` no llegaron a correr en esa pasada; el PC se colgó dos veces al relanzarlas con 8 workers, y con 2 workers (decisión del dev-lead, opción «Con 2 workers») sobre `cd1fdacb`: `cli:test-min` 1479/1479 en 678 s y `cli:test-slow` 296/297 en 659 s, con el fallo en «regenera estimation-log.md cuando es el único conflicto» por `git push` del fixture (`unable to write file ./objects/…: No such file or directory`), que pasa en `cli:test-min` y repetido solo (`lock-and-base.slow.test.ts` 10/10): fallo suelto de git con la máquina cargada, deuda de la feature 0204 · 1094 s la pasada de `kit:test` y `cli:test` · configuración: la del gate, salvo `--maxWorkers 2` en las dos lentas
- Pre-commit (`moon run cli:typecheck cli:test kit:test-fast kit:roadmap`) en verde en cada commit.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-25 · suite `cli:test` 1182/1182, `cli:test-min` 1479/1479 y `cli:test-slow` 296/297 con un fallo suelto de git que pasa al repetirlo · smoke 12/12 THEN, 9 con ejecución real · revisión final Spec y Código sobre `2428e5e`, re-revisión sobre `cd1fdac` con todos los hallazgos resueltos y 2 Minor adjudicados · `FastSuiteBudget` en rojo por carga, igual en `develop`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `--help` lista `hook session-end` | ejecución real (`node cli/bin/sdd.js --help`) | pasa: `sdd hook session-end    Borra las sesiones de Claude Code del proyecto sin escrituras en 24 h` |
| Borra `vieja` y nada más (se quedan `actual`, `reciente`, `tarea`, `leeme.txt`, la carpeta y el otro proyecto) | suite (`session-end.test.ts`) + ejecución real por `sdd.js` con stdin sobre un árbol en el scratchpad | pasa: quedan `actual,reciente` de `actual,vieja,reciente`, exit 0 |
| No escribe en stdout ni en stderr y sale con 0 | ejecución real (por `sdd.js`) + suite (`session-end.slow.test.ts`) | pasa |
| Sin `CLAUDE_CODE_TMPDIR`, la carpeta temporal del sistema; sin `CLAUDE_PROJECT_DIR`, el `cwd` | suite | pasa |
| `D:\code\_worktrees\sdd-kit-0180` → `D--code--worktrees-sdd-kit-0180` | suite | pasa |
| Más de 200 caracteres: recorte y hash (`…-probe-aaa-bjejxf`) | ejecución real (sonda Haiku en una ruta de 231 caracteres: carpeta de 207 caracteres en `<tmp>/claude/` y en `~/.claude/projects`) + suite | pasa |
| Una sesión que no se puede borrar no impide las demás, sale 0 | suite (`session-end-tolerance.test.ts`, `rmSync` con `EBUSY`) | pasa; el `.output` abierto de Windows, en campo |
| Un enlace o junction no se borra ni se sigue | suite (junction real con `symlinkSync`) | pasa |
| Sin `session_id` o stdin que no es JSON: aviso literal, no borra, sale 0 | ejecución real (`'no json' \| node cli/bin/sdd.js hook session-end`) | pasa: `sdd-kit: no borro los temporales de Claude Code: sin session_id válido en la entrada del hook`, exit 0 |
| Base relativa: aviso literal, no borra, sale 0 | ejecución real (`CLAUDE_CODE_TMPDIR=temporales`) | pasa: `… temporales no es una ruta absoluta`, exit 0 |
| Sin carpeta del proyecto: nada en salida, sale 0 | ejecución real (`{"session_id":"x","cwd":"D:\\nada"}`) | pasa |
| Tras 1 s desde el arranque no empieza a borrar ninguna más | suite (plazo vencido) | pasa; el presupuesto real de 1,5 s, en campo |

### 4.3 Residuales / deuda generada

- El presupuesto real de 1,5 s y un `.output` abierto en Windows solo se ven en un cierre de verdad: validación en campo.
- `FastSuiteBudget` sigue rojo con carga de otras sesiones (fila del patch 0190, parcial): esta vez con 0213, 0214 y 0217 abiertas a la vez.

## 5. Aprendizajes

- **La regla del nombre de `<tmp>/claude/` y `~/.claude/projects`**: cada carácter no alfanumérico pasa a `-`; por encima de 200 caracteres, recorte y `-` más un hash de 32 bits de multiplicador 31 en base 36. Ahora vive en `capabilities/cli.md` (requisito «El hook de cierre borra las sesiones viejas del proyecto»).
- **Windows no lanza un proceso con un cwd de más de 259 caracteres** (`The directory name is invalid`): el recorte solo se da entre 201 y 259. En la spec (decisión 6) y en la capacidad; `tech-stack.md` está en su tope y no lo repite.
- **Un `SessionEnd` de plugin tiene 1,5 s en total, y su `timeout` no lo sube**: lo dice el comentario de `BUDGET_MS` y la regla «Límites» de `cli`.
- **El repaso de coherencia no midió los topes de palabras** de `architecture.md` (1900/1900) y `tech-stack.md` (19278/19280), que la spec editaba sin su tabla «Topes de palabras»: se escribió dentro del tope, sin subirlo. Es un fallo del agente en el paso 4 de `sdd-propose`, que ya lo pide; va al ticket del kit.
- Revisión de skills: `.claude/skills/` tiene `skill-creator`, `writing-for-agents` y `writing-skills`; esta feature no toca su terreno: no aplica.

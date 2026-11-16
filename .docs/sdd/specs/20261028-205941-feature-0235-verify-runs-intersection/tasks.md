---
id: 20261028-205941-feature-0235-verify-runs-intersection
title: Tasks — sdd merge --verify corre solo lo que se cruza y sin shell
spec: ./spec.md
plan: ./plan.md
created: 2026-10-28
---

# Tasks — `sdd merge --verify` corre solo lo que se cruza y sin shell (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0235-verify-runs-intersection`

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | El gate sin shell | done | b11eefb | |
| 2 | El cruce con moon | done | 7dbd57c | tres commits sin juntar (df9da2e, 1f16c68, 7dbd57c): ver walkthrough §3 |
| 3 | Las skills y la migración | done | e050555 | |

Revisión final: Spec opus+high, With fixes (6 Important, 7 Minor) · Código sonnet+high, With fixes (3 Important, 10 Minor) · Arquitectura opus+high, With fixes (1 Important, 6 Minor), sobre e050555
Pasada de fix: juntada en el cierre, 6 hallazgos RED→GREEN (y 15 arreglos más con la suite 186/186 y docs-claims 505/505) · 9 rulings
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 20 resueltos · abiertos 2 Important (Spec I1 a medias y N1 nuevo, opción con valor) y 3 Minor · sin revisar: juntado en el cierre — los arregla (target tras las opciones, valores de opción, comilla sin cerrar, saltos de línea de los mensajes); test/merge 189/189

## Rulings

Task 1: Ruling: se borra cli/test/merge/verify.slow.test.ts (powershell.exe cuando no hay pwsh) — prueba el respaldo de shell que la spec retira; lo sustituye «runs the gate with a PATH without pwsh» — coste si es erróneo: ninguno
Task 2: Ruling: verifyMerge devuelve void, no el sha verificado — publish ya toma HEAD antes de integrar, que es ese sha también sin --verified-at — coste si es erróneo: ninguno
Task 2: Ruling: parseTaskTargets lee el campo target de cada tarea de moon query tasks (cli:test), no compone proyecto:clave — moon 2.6.0 lo trae y es el id que acepta moon run — coste si es erróneo: un proyecto con alias saldría con su id
Task 2: Ruling: branchMergeBase(worktree, branch) en steps.ts usa HEAD antes del merge, en vez de pasar before — el mismo commit, y lo comparten run.ts y hotfix.ts — coste: ninguno
Task 2: Ruling: queryTasks cierra el stdin de moon (child.stdin.end()) en vez de stdio 'ignore' — execFile no admite stdio; el efecto (EOF, sin cuelgue) es el mismo, y lo ejercen los 8 tests lentos — coste: ninguno
Task 2: Ruling: el caso «--stdin/--status/--force o target no admitido» solo tiene unitario (readMoonGate.blocker); la línea «sin cruce» la ejerce el lento de moon query que falla, por el mismo fallback — coste si es erróneo: el literal con «'<opción>' no admitido» sin test de punta a punta
Task 2: Ruling: withPath del test lento quita también MSYSTEM — lanzado desde Git Bash, el git.exe de Git\cmd no añade mingw64 al PATH restringido y git fetch falla («base: no se pudo hacer fetch»); la RED copy cambia solo en ese helper — coste si es erróneo: ninguno
Task 2: Ruling: hookTimeout 120 s en helpers.ts — el afterAll que borra las 9 fixtures de intersection.slow (con la caché de moon) pasó de 10 s con la máquina cargada («Hook timed out in 10000ms»); los 178 tests ya estaban en verde — coste: ninguno
Task 3: Ruling: el escenario nuevo es g1 (paso v3-gate, molde v2x-gate), no v3 como decía el plan — v3 ya era el de E2E — coste: ninguno
Task 3: Ruling: tanda de REFACTOR 1 — el GREEN avisó con sus palabras, sin el literal; fallo de forma (Art. II) → el paso 9 da las dos líneas en un bloque text como contrato del informe; refactor1 g1 ✅. Campaña 3 sujetos, 1,31 $ (tope 1,8 $) — coste: ninguno
Task 3: Ruling: la verificación de la Task 3 es test/kit con --test-timeout 120000 — sin él, upstream-watch.slow.test.ts cae por el tope de 5 s de vitest (10/10 con el tope) — coste: ninguno
Final: Ruling: (Spec I6) merge-recipe.md sin batería ni humo (ADR 0002) — la decisión 16 de la spec aprobada lo decidió: la viñeta solo nombra la salida de la CLI, cubierta por sus tests; la pasada de fix añade a la tabla de salidas las filas de esas líneas — coste si es erróneo: un agente que no copie las líneas verificación al Gate:
Final: Ruling: (Código m4) sin --verified-at y nada que toque la rama no sale línea — la decisión 7 de la spec: una tarea que no toca nadie no sale — coste: un gate que no corrió nada sin decirlo
Final: Ruling: (Código m7) parseGate dos veces y comilla sin cerrar aceptada — la primera es la validación antes del cerrojo; una comilla sin cerrar falla después en el programa, y un literal nuevo sería un desvío de la spec — coste: el error sale del programa, no de --verify
Final: Ruling: (Código m8) branchMergeBase corre también sin --verify — sin historia común el merge falla igual, con otro texto — coste: el mensaje de historia común en vez del de git
Final: Ruling: (Arquitectura m5) tasks/command.ts es infraestructura compartida en un dominio — moverlo es otra feature: fila de deuda al cerrar — coste: ninguno ahora
Final: Ruling: (Arquitectura m7) «no las expande» no vale para %VAR% en un .cmd — el literal es de la spec (decisión 13) y el límite está en la decisión 10 — coste: un aviso algo optimista en Windows con .cmd
Final: Ruling: (Spec m) --affected <valor> separado — sin =, el valor queda como stray y bloquea el cruce: corre de más — coste: ninguno
Final: Ruling: (Spec m) log del contraste en tmpdir sin borrar en el lento — patrón de base-red, bajo el TEMP de la pasada — coste: ninguno
Final: Ruling: (Spec m) QUERY sintético frente a «dos salidas reales» — la forma es la real de moon 2.6.0 (id, target, command), y el lento de moon.cmd y los 8 de cruce usan salidas reales — coste: ninguno
Final: Ruling: N3 timeout de queryTasks mata solo cmd.exe con un moon.cmd — el fallback corre igual; un moon.exe huérfano tras 5 min colgado es un caso raro — coste: un proceso huérfano
Final: Ruling: re-revisión, docs-claims RED no reproducible en el commit de la pasada de fix — la línea 418 era del delta de capacidad sin commitear; se reproduce en cuanto el cierre lo commitea — coste: ninguno

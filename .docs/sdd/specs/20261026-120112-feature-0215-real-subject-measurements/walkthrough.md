---
id: 20261026-120112-feature-0215-real-subject-measurements
feature: 0215
title: Walkthrough — Medidas con sujetos reales del lanzador de tests/headless/
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Medidas con sujetos reales del lanzador de `tests/headless/`

🦆 Tres cosas del lanzador de sujetos se daban por buenas sin haberlas visto en un `claude -p` real, y ahora están medidas. Con `--setting-sources ""`, el modo de toda campaña, el `CLAUDE.md` personal de quien lanza no llega al sujeto; sin esa opción, sí. El hook que impide matar procesos por nombre corre en los dos casos: un `taskkill //IM` sale denegado. Y 4 sujetos lanzados de dos en dos trabajaron cada uno en su molde. Además, el lanzador ya no deja sin comprobar los puertos cuando uno sale fuera de rango, y dos sujetos que nombran el mismo puerto no se paran el servidor el uno al otro: lo para el último en acabar.

## 1. Cambios realizados

- **Medida del perfil y del hook** (Task 1): un sujeto `haiku` con `lib.sh` y `SUPERPOWERS_DIR` (`--setting-sources ""`) y un `claude -p` suelto en el mismo molde, sin `--setting-sources` ni `--plugin-dir` y con el mismo `--settings`. Evidencia en `perfil/out/`. `run.sh` no cambia (decisión 9). La línea de `tech-stack.md` sobre el `CLAUDE.md` del dev-lead se completa con lo medido.
- **Dos sujetos en paralelo** (Task 2): el caso del ticket del patch 0087 en dos tandas de 2 sujetos `sonnet` con `MAX_PARALLEL=2`, solapados (`a-1` de 13:09:47 a 13:10:23 con `b-1` de 13:09:48 a 13:10:15; `a-2` de 13:10:35 a 13:10:58 con `b-2` de 13:10:36 a 13:10:51). Evidencia en `paralelo/out/`, más una frase en la línea de `tech-stack.md` sobre escribir los lanzadores sobre `lib.sh`.
- **Puertos** (Task 3 y pasada de fix): `subject_ports` descarta lo que cae fuera de 1–65535. `other_subject_ports` lee los streams de los otros sujetos en curso (marca de `live/` o `dry/live/` con el PID vivo o vacío). `stop_subject_ports` no para un puerto compartido: deja su arranque en `<RUNS_DIR>/ports/<puerto>`, y el último en acabar para desde el arranque más antiguo y borra el traspaso. Cuando no consulta ningún puerto, el `.err` dice «sin consultar». Seis tests nuevos en `tests/HeadlessLauncher.Tests.ps1`.
- **Documentos**: `tech-stack.md` (perfil, hook, paralelo y regla del último en acabar), dentro de su tope; roadmap con la fila 0215, las dos filas de deuda saldadas y dos de deuda nuevas.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 3,5 h (aproximado) — el reloj de la sesión da 15,51 h desde 2026-10-25T21:38Z, sin 62 min de espera al dev-lead (5 esperas), pero cuenta la noche entre el arranque y el trabajo del 2026-10-26 (caso (a) de la fila 0211); 3,5 h es el tramo del 2026-10-26 de ~10:45 a ~14:15 con spec, plan, medidas, revisión y cierre
- Desviación: +1 h (+40 %)
- Causa de la desviación (obligatoria si |desviación| > 30%): el esfuerzo real incluye spec y plan (0,8 h estimadas aparte) y la pasada de fix del traspaso `ports/`, que la estimación no preveía; sin spec y plan, +0,2 h (+8 %)
- Compactación: sí — una, antes de lanzar los sujetos reales; siguió en Native en la Task 1, sin perder el ledger
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 28.415.375 — claude-opus-5-5 28.415.375
- Tokens de subagentes: 2.759.290 en 3 despachos — Re-review final 0215 claude-opus-5-5 352.534 / 2 min; Final review — Code axis claude-sonnet-5-5 594.005 / 2 min; Final review — Spec axis claude-opus-5-5 1.812.751 / 3 min
- Coste de la sesión: 14,43 $ (hilo 12,03 $ + subagentes 2,40 $)
- Coste de sujetos: 0,41 $ en 6 sujetos (`perfil/`: `s-1` con `lib.sh` y el `claude -p` suelto `n-1`, los dos `haiku`, 0,02 $; `paralelo/`: 4 `sonnet`, 0,40 $), previsión 1,5 $, techo 3 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 3 creció en la pasada de fix: la regla «lo para el último en acabar» dejaba huérfano un servidor que arrancó antes que el último sujeto (Important del eje Spec). Se añadió el traspaso `ports/<puerto>`, dentro de la decisión 8 y sin cambiar la spec.
- La evidencia de `n-1` lleva sustituido el ejemplo literal de commit del `CLAUDE.md` privado (decisión 2).
- El Intent de la spec dice «las tres filas de deuda "Actuar → 0215"», pero son dos (`roadmap.md:314` y `:322`). Las dos se saldan.
- `tasks.md` se creó en el cierre, no antes de la Task 1.

### Decisiones tomadas sin el dev-lead

- Task 1: Ruling: el texto de n-1 copiaba literal el ejemplo de commit del CLAUDE.md privado — sustituido por una marca en n-1.tools.txt y n-1.texts.txt (spec, decisión 2: la evidencia no copia el CLAUDE.md privado)
- Task 1: Ruling: run.sh sin cambio — con --setting-sources "" la respuesta fue NINGUNA (decisión 9)
- Task 3: Ruling: «para un puerto de otro sujeto que ya no corre» pasó en RED — es el comportamiento actual que el arreglo no debe romper; los otros dos fallaron por la falta del comportamiento
- Task 3: Ruling: other_subject_ports toma la raíz de RUNS (${RUNS%/*}) en vez de RUNS_DIR: es la misma carpeta, absoluta, y no depende de que run.sh exporte RUNS_DIR
- Final: Ruling: Spec m4 (el test usa $$ del sujeto en vez de sleep 60 &) — intencionado: el bash del sujeto sigue vivo durante su limpieza y no deja proceso que parar — si es incorrecto: ninguno
- Final: Ruling: Spec m5 (el Intent dice «tres filas de deuda» y son dos, :314 y :322) — se corrige en el walkthrough; la spec aprobada no se edita — si es incorrecto: ninguno
- Final: Ruling: Spec «no verificado» del solape de los pares — verificado con las horas de .args y .jsonl de RUNS_DIR: a-1 13:09:47–13:10:23 con b-1 13:09:48–13:10:15; a-2 13:10:35–13:10:58 con b-2 13:10:36–13:10:51 — si es incorrecto: ninguno
- Final: Ruling: Spec «declined» «Filename too long» del git del sujeto en a-1 y a-2 — fila de deuda nueva al cerrar — si es incorrecto: ninguno
- Final: Ruling: «para un puerto de otro sujeto que ya no corre» falló 1 vez en la pasada de fix con «escuchando al acabar: ninguno» (el servidor aún no escuchaba) y pasó en 3 repeticiones — espera de arranque del servidor de prueba bajo carga, patrón previo al de la 0214 — si es incorrecto: un test intermitente en el gate
- Final: Ruling: tasks.md no se creó antes de la Task 1 (el plan tiene 3 tasks) — creado en el cierre con el estado del ledger y git log — si es incorrecto: ninguno, el ledger tenía el registro
- Final: Ruling: comentario de dos líneas en stop_subject_ports (re-revisión, Minor) — se queda: el porqué tiene dos partes (el primero paraba el del otro; el último no veía uno anterior) y lib.sh ya lleva comentarios de dos líneas — si es incorrecto: ninguno
- Final: Ruling: el traspaso ports/<p> no caduca si el último sujeto muere sin su trap (re-revisión, Minor) — se queda: pide un sujeto cortado y el mismo puerto en otro sujeto posterior del mismo RUNS_DIR; va a una fila de deuda — si es incorrecto: un sujeto posterior para un servidor que otra sesión arrancó en ese puerto después del traspaso

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → kit:test 1424 passed / 14 skipped / 0 failed, cli:typecheck verde, cli:test 1182/1182, cli:test-slow 299/299, cli:test-min 1481/1481 (los `cli:*` en caché verde: la rama no toca `cli/`) · 17 min 38 s · configuración: la del gate · sobre la pasada de fix (juntada en el cierre)

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · gate de cierre en verde sobre la pasada de fix (juntada en el cierre) (kit:test 1424 passed con 14 skipped, cli:test 1182/1182, cli:test-slow 299/299, cli:test-min 1481/1481) · `HeadlessLauncher.Tests.ps1` 68/68 en la Task 3 y los 9 tests de puertos tras la pasada de fix · ejecución real de las medidas (6 sujetos) y de `stop_subject_ports` fuera de Pester con un servidor node · revisión final Spec (opus+high) y Código (sonnet+high) sobre dc5dc226 y re-revisión de la pasada de fix (opus+high) con todos los hallazgos resueltos y 2 Minor adjudicados

La spec no trae delta (capacidades: ninguna): una fila por decisión con comportamiento.

| Decisión | Evidencia | Resultado |
| --- | --- | --- |
| 1 · los tests y la vigilancia no tienen código que tocar | `grep -rn "plugins.cache\|plugins/cache"` en `tests/*.ps1`, `cli/src` y `.githooks`: solo evidencia (`tests/superpowers-642-red.md`); `Measure-SessionTokens.ps1` no existe; `cli/src/session/transcripts.ts` lee `CLAUDE_CONFIG_DIR` (comprobado también por el eje Spec) | ✅ |
| 2-4 · con `--setting-sources ""` el `CLAUDE.md` global no llega; sin la opción, sí | ejecución real: `perfil/out/s-1.texts.txt` («NINGUNA») y `perfil/out/n-1.texts.txt` (cita la regla de commits); ninguno leyó ficheros (`tools.txt`) | ✅ |
| 3-4 · el hook `PreToolUse` de `--settings` corre con y sin `--setting-sources ""` | ejecución real: los dos `tools.txt` traen `PreToolUse:Bash hook error: Bloqueado por el entorno de pruebas` | ✅ |
| 5-6 · dos sujetos en paralelo, cada uno en su molde | ejecución real: 4/4 citan su propia etiqueta y solo leen `<run>/repo`; solapados por las horas de `.args` y `.jsonl` | ✅ (0 de 4 reproducen) |
| 7 · un puerto fuera de 1–65535 se descarta | suite (`subject_ports descarta puertos fuera de rango`) y ejecución real de `stop_subject_ports` con `PORT=99999` y `localhost:70000` en el stream: `puertos del sujeto: 45998` | ✅ |
| 8 · un puerto compartido lo para el último en acabar | suite (cinco tests del contexto «un puerto que nombra otro sujeto») y ejecución real con un servidor node en 45998: el primero escribe `escuchando al acabar: sin consultar · compartidos con otro sujeto en curso, sin parar: 45998` y deja el traspaso (sigue escuchando: 1); el último, arrancado después del servidor, escribe `escuchando al acabar: 45998`, el puerto deja de escuchar (0) y el traspaso desaparece | ✅ |
| 9 · `run.sh` imprime el `CLAUDE_CONFIG_DIR` solo si el `CLAUDE.md` llega con `--setting-sources ""` | no llega: sin cambio, y `tech-stack.md` lo dice | ✅ |
| 10 · techos | `sujetos de la campaña: 6 · coste acumulado: 0.41 $` (techos 8 y 3 $) | ✅ |

### 4.3 Residuales / deuda generada

- El traspaso `ports/<puerto>` no caduca si el último sujeto muere sin su `trap` → fila de deuda.
- El git del sujeto falla con «Filename too long» en un molde del scratchpad (2 de 4 sujetos del paralelo) → fila de deuda.

## 5. Aprendizajes

- Una sonda que pregunta por una regla del `CLAUDE.md` privado puede devolver su texto literal: la respuesta de `n-1` copió el ejemplo de commit. Se sustituyó en la evidencia → `tech-stack.md` no: la decisión 2 de esta spec y `SubjectOutputPrivacy` cubren la identidad, no las reglas. Una sonda futura sobre el perfil pregunta por algo que no se pueda citar.
- `Set-Content` de PowerShell termina el fichero en CRLF, y `read` de bash deja el `\r` en la variable: un test que escribe un fichero que lee bash usa `-NoNewline` → solo en el test; el productor real es bash.

- Revisión de skills: no aplica — la feature no toca `skills/` (`git diff --name-only` desde la base: 0 ficheros), y `.claude/skills/` solo tiene enlaces a skills de autoría (`skill-creator`, `writing-for-agents`, `writing-skills`) que lo aprendido no toca.

## 6. Adendas

- _Ninguna_

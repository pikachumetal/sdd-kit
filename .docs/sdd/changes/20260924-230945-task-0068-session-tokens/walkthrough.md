---
id: 20260924-230945-task-0068-session-tokens
task: 0068
title: Walkthrough — Tokens y coste de la sesión desde los transcripts de Claude Code
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-25
---

# Walkthrough — Tokens y coste de la sesión desde los transcripts de Claude Code

## 1. Cambios realizados

- **Script de medición** (`55c1687`, arreglos en `635cecf` y `6fa3863`) — `skills/sdd-templates/scripts/Measure-SessionTokens.ps1` lee `~/.claude/projects/<carpeta del worktree>/`. Cuenta cada respuesta una sola vez por `message.id` (el máximo de cada categoría), deja fuera `<synthetic>` y filtra por `gitBranch` con `-Branch`. Suma el hilo y los subagentes por separado, por modelo y por categoría, y aplica la tabla `pricing` de `sdd-kit.json`. Imprime una tabla y tres líneas para el walkthrough. Tests: `tests/Measure-SessionTokens.Tests.ps1` (21) sobre `tests/fixtures/session-tokens/`.
- **Precios del repo** (`55c1687`) — clave `pricing` en `.docs/sdd/sdd-kit.json` para Opus 5.5, Sonnet 5 y Haiku 4.5, sacados de la skill `claude-api`, con la fuente en `source`.
- **Log** (`5af7490`) — `Build-EstimationLog.ps1` lee `Coste de la sesión`. Lo añade como columna `Sesión ($)` y como suma por release, y trata «sin precio» como ausencia declarada. `tests/Build-EstimationLog.Tests.ps1`: 61.
- **Cierre** (`635cecf`) — el paso 2 de `sdd-end-task` ejecuta el script y pega sus líneas. `walkthrough-template.md` gana `Coste de la sesión` y deja de decir que el agente no tiene contador. Evidencia: `tests/session-tokens-red.md`, `tests/session-tokens-green.md` y `tests/SessionTokensClose.Tests.ps1`.
- **Integración de `develop`** (`4fc6df5`) antes de fusionar el delta en `capabilities/estimation.md`, que había tocado la 0067.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3,5h
- Esfuerzo real: 1h — reloj del hilo, aproximado con las marcas de los commits: de 01:14 a ~01:25 (apertura, Task 1 y medio RED de la Task 2) y de ~08:50 a 09:30 (Tasks 2 y 3, revisión final y fix), sin contar la pausa nocturna. Spec y plan: ~0,4h más, antes de la apertura.
- Desviación: −2,5h (−71 %)
- Causa de la desviación: la estimación suponía un script por descubrir, pero el formato del transcript ya se había inspeccionado en la spec (60 transcripts). Además, la campaña fue de un escenario y 4 sujetos en serie, de ~2 min cada uno, y el molde de la 0060 se reutilizó sin cambios.
- Modelo del hilo: Opus 5.5, effort no registrado (toda la task, sin cambio de modelo)
- Tokens del hilo: 30.422.619 — claude-opus-5-5 30.422.619 (desde la creación de la rama; la lectura de contexto y la primera pregunta fueron en esta rama, que ya existía)
- Tokens de subagentes: 2.183.896 en 1 despacho — Revisión final de rama 0068 claude-opus-5-5 2.183.896 / 4 min
- Coste de la sesión: 14,81 $ (hilo 13,24 $ + subagentes 1,57 $)
- Coste de sujetos: 1,06 $ en 4 sujetos sonnet — RED 0,56 $; GREEN 0,50 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **La campaña no se relanzó tras el fix de codificación**: se habían usado los 4 sujetos de `SUBJECT_CAP`, y el fix no cambia la conducta que se mide.
- **Integración de `develop` antes del commit de cierre**, y no como último commit. Lo pidió el dev-lead para fusionar el delta sobre la capacidad que dejó la 0067. Por eso el fix de la revisión final (`6fa3863`) queda como commit propio: no se puede juntar a través del merge.
- **Los `MODIFIED` de la spec se fusionaron combinados con la 0067**: la spec los escribió sobre el texto anterior a la 0067, y sustituirlos tal cual habría borrado las cláusulas de fecha de cierre que fusionó la 0067.

### Decisiones tomadas sin el dev-lead

- Freno de alcance por la fila 0068 que entró en `develop` tras crear la rama. Coincidía con la spec, y se siguió con el «Sigue (Recomendada)» del dev-lead. — Coste si está mal: ninguno, la fila no añade alcance.
- La fila esperada de `notas-sueltas` en los tests del log recibió a mano la columna nueva, porque el reemplazo mecánico solo cubría carpetas fechadas. — Coste si está mal: ninguno.
- La salida del script llegaba en `ibm437` desde Git Bash, y la «—» se convertía en «-». Se arregló fijando UTF-8, con un test nuevo en RED primero. Fue el primer fix descubierto y no llegó a freno. — Coste si está mal: tildes y rayas corruptas en los walkthroughs.
- El test de codificación añade un caso a `tests/Measure-SessionTokens.Tests.ps1`, pero no cambia ninguna aserción de la copia RED. — Coste si está mal: ninguno.
- El GREEN no se relanzó tras ese fix (ver §3). — Coste si está mal: ninguno sobre la guidance.
- El revisor final fue `general-purpose` + `opus`, con «effort: no disponible en este harness, hereda el de la sesión», porque la sesión no arrancó con `Start-KitSession.ps1` y no tenía `sdd-kit:effort-high`. — Coste si está mal: una revisión con el effort de la sesión.
- Dos Minor del revisor se re-graduaron a Important por su efecto en quien llama con `&`: la codificación de la consola no se restauraba y una ruta relativa se resolvía contra el directorio del proceso. Se arreglaron con sus tests (`6fa3863`). — Coste si está mal: ninguno, solo más código.
- El test «sin carpeta de transcripts» decodificaba la salida del proceso hijo con la consola del padre, y pasaba porque el script dejaba la consola en UTF-8. Ahora el test fija UTF-8 durante la llamada, sin cambiar las aserciones. — Coste si está mal: ninguno.
- El índice de scripts de `sdd-templates/SKILL.md` no lista el script nuevo. Tocarlo es editar una skill (Art. I), así que queda como fila de deuda, y `tech-stack.md` se actualiza en este cierre. — Coste si está mal: un índice incompleto hasta la deuda.
- La deduplicación es por fichero, no entre sesiones (el revisor la dejó sin juzgar). En 25 carpetas reales no hay duplicados entre ficheros, y la spec no fija el ámbito. — Coste si está mal: doble conteo si un `--resume` futuro copia el historial.
- Integración de `develop` y fusión combinada de los `MODIFIED` (ver §3). — Coste si está mal: dos commits más en la historia.
- **Deferred minors** de la revisión final: (1) sin `-Branch`, el mensaje dice «sin respuestas de ninguna rama»; (2) con el hilo vacío y subagentes, la línea del hilo queda «0 — » con la raya colgando; (3) el paso 2 pide decir en la línea del hilo lo anterior a la rama y a la vez pegarla sin retocar, y un sujeto del GREEN lo dijo en una nota aparte.

## 4. Verificación

### 4.1 Builds

- Sin build. Suite completa `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`: 642 pasan, 0 fallan y 6 se saltan, antes de integrar `develop`. Tras integrarlo, el pre-merge-commit dio 623 pasan y 0 fallan en el conjunto rápido. El pre-commit del cierre la vuelve a pasar.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «delegada al uso» · disparador: el primer cierre de una task real con `sdd-end-task` que pegue las tres líneas del script, a cargo del dev-lead. El disparador lo concretó el agente, porque la frase no lo nombraba.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Script sobre este worktree desde Git Bash, con `-Branch feature/0068-session-tokens` | Verificado por el agente: tabla por modelo y las tres líneas con la raya correcta; 14,81 $ al cierre, que salen a mano de la tabla (lectura 29,7M × 0,2 + escritura 1h 597k × 8 + salida 126k × 20 = 13,24 $ del hilo) |
| 2 | Tests del script (21), incluidos el Review Focus y la codificación | Verificado por el agente: verde |
| 3 | Log con la columna `Sesión ($)` sobre el repo | Verificado por el agente: cabeceras de las dos tablas y `—` en las tasks anteriores |
| 4 | Campaña del cierre | Verificado por el agente: RED 2/2 «no medido» con el script en el kit; GREEN 2/2 lo ejecutan y pegan las líneas |
| 5 | Esta misma sección 2 | Verificado por el agente: las tres líneas salen del script, dogfooding del paso 2 |

## 5. Aprendizajes

- **Una salida para pegar tiene que ir en UTF-8, y el test tiene que forzar la consola que la rompe** → `tech-stack.md` (salida UTF-8 de un script cuya salida se pega).
- **Los tokens de la sesión no se comparan con los de los walkthroughs anteriores; la comparación entre métodos va en dólares** → `.docs/sdd/estimation.md` (coste en tokens y en dinero).
- **Un `MODIFIED` de una spec aprobada antes de que otra task fusione en la misma capacidad queda desfasado al cerrar**: se combina, no se sustituye. Ya lo cubre la fila de deuda «Dos tasks que fusionan en la misma capacidad chocan» (ticket 0067); este caso es otra forma del mismo choque, y va al ticket.

## 6. Adendas

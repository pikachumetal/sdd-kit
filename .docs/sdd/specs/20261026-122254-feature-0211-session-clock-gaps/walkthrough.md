---
id: 20261026-122254-feature-0211-session-clock-gaps
feature: 0211
title: Walkthrough — El reloj de la sesión descuenta los huecos sin actividad y no toma por espera lo que no lo es
spec: ./spec.md
status: done
created: 2026-10-26
---

# Walkthrough — El reloj de la sesión descuenta los huecos sin actividad y no toma por espera lo que no lo es

## 1. Cambios realizados

- **Reloj** — `cli/src/session/clock.ts`: la espera al dev-lead abre con el cierre de turno (`stop_reason` `end_turn` o `stop_sequence`, `closesTurn`) y cierra con el siguiente mensaje tecleado; una notificación de tarea (`isTaskNotification`) la cierra como trabajo; el resumen de una compactación (`isCompactSummary`) no es un mensaje tecleado; `addIdle` descuenta el hueco de más de 60 min (`IDLE_MILLIS`) entre dos entradas con el turno abierto, sin herramienta en curso (`running`, solo llamadas con resultado en el transcript, `answeredTools`) y que no acaba en una notificación. `ClockState` sustituye a `WaitState`; `Clock` gana `idleMinutes` e `idleGaps`.
- **Línea y `--json`** — `format.ts` añade la cola `, sin <h> h sin actividad (<n> hueco|huecos)` solo con huecos; `measure.ts` lleva `idleMinutes` e `idleGaps` en `real`.
- **Tests** — `cli/test/session/clock.test.ts`: los cuatro escenarios del delta por el verbo (turno abierto, hueco dentro de una espera, notificación a los 18 y a los 133 min, compactación, noche tras interrupción y su `--json`, subagente de 90 min) y los de la pasada de fix (notificación con el turno abierto, llamada sin resultado, pregunta pendiente de 90 min, borde de 60 min, suma de dos sesiones); `firstSession` gana `end_turn` en la respuesta de las 12:40.
- **Docs** — `walkthrough-template.md` (la cola opcional en el ejemplo, con la nota recortada para caber en el tope del kit), `estimation.md` («Qué cuenta el Real») y el delta fusionado en `capabilities/estimation.md`.
- Commits: apertura `8b5f142f`, código `7f363919`, y el cierre, que junta el refactor del estado inicial, la pasada de fix y los registros.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 2,39 h — reloj de la sesión 2,48 h desde 2026-10-26T11:16Z, sin 5 min de espera al dev-lead (2 esperas)
- Desviación: +0,89 h (+59 %)
- Causa de la desviación: el real cuenta también la spec (1 h estimada aparte) con la medida de los transcripts reales de la 0208, la 0209 y la 0210, que cambió dos diagnósticos del roadmap; y, con el reloj nuevo, las tres pasadas del gate en segundo plano (línea base, un rojo de `FastSuiteBudget` por carga y la pasada forzada de `cli:test-min` por una caché de moon con la cifra vieja) cuentan como trabajo, no como espera. Spec más implementación: 2,5 h estimadas.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 31.658.497 — claude-opus-5-5 31.658.497
- Tokens de subagentes: 3.645.963 en 3 despachos — Re-review final 0211 claude-opus-5-5 1.038.689 / 2 min; Final review — Code axis claude-sonnet-5-5 490.967 / 1 min; Final review — Spec axis claude-opus-5-5 2.116.307 / 5 min
- Coste de la sesión: 12,49 $ (hilo 10,04 $ + subagentes 2,45 $)
- Coste de sujetos: no aplica
- Review de spec: no (lite)

## 3. Desviaciones del plan

- **Carril**: el prompt de arranque pedía patch; tres fallos son tres tests, y el umbral y la línea estaban abiertos: lite, opción «Lite (Recomendada)» del dev-lead. La rama pasó de `patch/0211-…` a `feature/0211-session-clock-gaps`, sin commits ni remoto.
- **Enmienda sin aprobar** (spec, «Enmiendas»): el hueco que acaba en una notificación de tarea es trabajo también con el turno abierto. La revisión final vio que la regla cubría a medias la decisión del dev-lead, que no se condiciona al turno cerrado; hay 5 huecos así en los transcripts reales.

### Decisiones tomadas sin el dev-lead

- El tope del kit (91300) no tenía margen y la cola de la plantilla suma 7 palabras: recorto la nota de la misma línea sin quitar instrucción («se pega tal cual» → «tal cual», «deja fuera» → «sin») — coste si está mal: una frase menos clara en la plantilla.
- La apertura no se commiteó antes del RED: commit de apertura antes del de código, ya con el RED escrito — coste si está mal: el RED no queda separado por commit.
- ADR 0002 sin humo para la plantilla: la edición solo añade la cola opcional al ejemplo y recorta la nota sin quitar instrucción; la conducta («pégalo tal cual») no cambia, así que no hay conducta que medir con sujetos. Es una dispensa, no un cumplimiento — coste si está mal: una plantilla menos clara que nadie midió.
- El `REMOVED` del AND de `AskUserQuestion` en el `MODIFIED`: es la forma de reescribir una línea (REMOVED la vieja, AND la nueva), y el merge la aplica bien — coste si está mal: ninguno en código.
- Doble descuento de huecos en modo ventana: el reloj de ventana ya restaba así las esperas por transcript; la spec no toca la ventana — coste si está mal: una rama medida por ventana con dos transcripts solapados en una noche sale por debajo.
- `previous` lo mantiene el bucle de `timeline`: moverlo dentro del estado no simplifica — coste si está mal: ninguno.
- Redacción «sin 9,75 h sin actividad»: la forma que escribió el dev-lead en la fila — coste si está mal: una línea menos fluida.
- «Declined to judge» de los dos ejes (interrupción con pausa de menos de 60 min como trabajo, ventana solapada y `tool_result` fuera de la ventana, transcripts sin `stop_reason`, `/clear` como mensaje tecleado, el umbral, `firstSession` con `end_turn`): decisiones de la spec aprobada o conducta previa a la rama — coste si está mal: una fila de deuda nueva.
- AND nuevo (notificación con el turno abierto) como enmienda sin aprobar: aplica la decisión del dev-lead ya registrada — coste si está mal: el dev-lead quería limitarlo al turno cerrado y hay que quitar un AND.
- Ejes de la revisión final uno detrás de otro, no en paralelo: la línea «Política de modelos» de la spec no los nombraba, y las instrucciones del dev-lead piden confirmar antes de paralelizar — coste si está mal: ~2 min más de reloj.
- `cli:test-min` y `cli:test-slow` salieron de la caché de moon con 1481 tests, la cifra de la línea base: relanzadas con `--force` (1497) — coste si está mal: ninguno.

## 4. Verificación

### 4.1 Builds

- Línea base: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → exit 0 · 46 min 51 s · 1182 + 299 + 1481 tests de la CLI.
- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` sobre la pasada de fix (juntada en el cierre; el cierre solo añade documentos) → `kit:test` 1418/1418 (14 omitidos), `cli:typecheck` ok, `cli:test` 1198/1198 · 23 min 47 s; `cli:test-slow` 299/299 y `cli:test-min` 1497/1497 con `--force` · 23 min 47 s (con espera al cerrojo de la 0215) · configuración: la del gate. Una pasada anterior dio `FastSuiteBudget` 133 s frente a 30 s con la máquina cargada (deuda del patch 0190) y pasó al repetirla.
- Base integrada (`sdd merge --sync`, `9c3a52d8`, trae el patch 0212: `cli/src/tasks/workspace.ts` y sus tests, sin ficheros en común con la 0211): la quinta pasada completa se cortó por decisión del dev-lead (opción «Corta y corre lo que cruza») tras cuatro pasadas en la sesión; en su lugar, `tsc --noEmit` ok, `vitest run` sin lentos 1198/1198 y `vitest run test/tasks/ test/session/ test/watch/` con los lentos 146/146 · 1 min 48 s.
- Pre-commit (`moon run cli:typecheck cli:test kit:test-fast kit:roadmap`) en verde en cada commit; el primer intento lo paró `WordBudget` (tope del kit), resuelto con el recorte de la plantilla.
- Revisión final: Spec opus+high, With fixes (3 Important, 3 Minor) · Código sonnet+high, With fixes (1 Important, 6 Minor) · Arquitectura no (lite, sin señales en el diff), sobre el refactor (juntado en el cierre). Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN o fijados por mutación, 4 Minor de suite y 7 rulings. Re-revisión: refactor..pasada de fix (juntados en el cierre), sdd-kit:effort-high + opus, 7/7 ADDRESSED, 1 Minor de redacción en `estimation.md:21`, arreglado y revisado en el hilo en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · suite completa en verde · 4/4 THEN del delta con suite y 3 con ejecución real sobre los transcripts de la 0208, la 0209 y la 0210 cortados en la hora de su medida · revisión final Spec y Código sobre el refactor, re-revisión limpia.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| MODIFIED: `firstSession` da `0,82 h … sin 20 min … (2 esperas)` y `--json` con `idleMinutes: 0, idleGaps: 0` | suite | pasa |
| ADDED notificación: cierre 10:00, notificación 10:18, mensaje 10:19 → 0 esperas; y a los 133 min | suite · ejecución real | la 0210 pasa de 178 min en 8 esperas a 131 min en 6: vuelven los 47 min de las dos notificaciones pegadas a «se colgó el pc» |
| ADDED compactación: cierre 07:33, compactación 08:28, notificación 09:46 → 0 esperas, 2,45 h | suite · ejecución real | la 0208 pasa de 2,99 h (1051 min de espera) a 3,93 h (996 min): vuelven los 55 min de la compactación en reposo |
| ADDED huecos: la noche tras la interrupción da `0,22 h … sin 9,75 h sin actividad (1 hueco)` y `idleMinutes: 585` | suite · ejecución real | la 0209 pasa de 10,62 h a 1,36 h: `sin 9,27 h sin actividad (1 hueco)`, `idleMinutes: 556` |
| ADDED huecos: subagente de 90 min, hueco dentro de una espera, línea sin huecos como hoy | suite | pasa |
| AND de la enmienda: notificación con el turno abierto | suite | pasa (RED con 1,48 h descontadas antes del fix) |

### 4.3 Residuales / deuda generada

- La 0209 da ahora 1,36 h frente a los ~2,9 h aproximados con las marcas de los commits del walkthrough, y la 0208 3,93 h frente a ~4,7 h. Las dos aproximaciones eran a ojo, y los registros cerrados no se recalculan (Scope).
- Doble descuento posible de huecos en modo ventana con transcripts solapados: ruling, sin fila; si aparece un caso, ticket.

## 5. Aprendizajes

- El diagnóstico de la fila de un fallo de medida se comprueba sobre el transcript real antes de diseñar: dos de los tres casos de la 0211 tenían otra causa (la compactación en la 0208, solo 47 de 178 min en la 0210) → ya lo pide `sdd-debugging` (la causa con evidencia, no la del reporte) y la regla de duda de `sdd-propose` («tu investigación determina la causa»): sin regla nueva; skills revisadas: `.claude/skills/` solo enlaza las de autoría (`skill-creator`, `writing-for-agents`, `writing-skills`), que este cambio no toca; las del kit viven en `skills/`.
- La caché de moon puede dar por buena una suite con la cifra vieja de tests: comparar el total con el de la línea base, y `--force` si no cuadra → fila de deuda «La caché de moon dio por buenas…» del roadmap.

## 6. Adendas

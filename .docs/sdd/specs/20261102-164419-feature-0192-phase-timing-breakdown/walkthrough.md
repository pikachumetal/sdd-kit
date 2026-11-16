---
id: 20261102-164419-feature-0192-phase-timing-breakdown
feature: 0192
title: Walkthrough — Desglose de tiempos por fase
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-02
---

# Walkthrough — Desglose de tiempos por fase

## 1. Cambios realizados

- **Reloj** (`cli/src/session/clock.ts`): guarda tramos de espera, hueco y ejecución, y de ahí salen sus totales. El esfuerzo real no cambia: 1,40 h y 0,56 h sobre la 0271 y la 0287.
- **Fases** (`cli/src/session/phases.ts`, `timing.ts`): las fronteras salen de los eventos del kit; `sdd session tokens --artifact <carpeta>` escribe `timing.json`, con el gate atribuido por su comando y cada fase con su estimado.
- **Línea `Esperas y huecos`** (`measure.ts`): cada espera por hora y minutos, para citar la causa de una desviación.
- **Log** (`cli/src/estimation/phases.ts`, `timing-file.ts`): sección «Tiempos por fase», con el % de ceremonia. La tabla principal y su ratio no cambian.
- **Cierre y plantillas**: `sdd-archive` paso 2 pasa `--artifact` y pide la causa medida; `plan-template.md` estima revisión y cierre.
- **Fixture**: `cli/test/session/fixtures/feature-0271/`, reducido del transcript real.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 1,10 h — reloj de la sesión 1,11 h desde 2026-11-02T16:38Z, sin 1 min de espera al dev-lead (1 espera)
- Desviación: −0,4 h (−27 %) frente a la de implementación; el real incluye spec y plan, como desde la 0188
- Causa de la desviación (obligatoria si |desviación| > 30%): no llega al 30 %. `Esperas y huecos`: 16:52Z 1 min. Por fase, `timing.json`: la implementación se quedó muy por debajo de su estimado, y la revisión pasó del suyo, porque el frente reentró en la pasada de fix.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 27.643.533 — claude-opus-5-5 27.643.533
- Tokens de subagentes: 4.888.278 en 5 despachos — Revisar spec 0192 (siete puntos) claude-sonnet-5-5 221.196 / 2 min; Final review — Spec axis 0192 claude-opus-5-5 1.366.898 / 6 min; Re-review final 0192 claude-opus-5-5 1.231.802 / 5 min; Final review — Architecture axis 0192 claude-opus-5-5 1.034.308 / 4 min; Final review — Code axis 0192 claude-sonnet-5-5 1.034.074 / 3 min
- Coste de la sesión: 19,18 $ (hilo 13,29 $ + subagentes 5,89 $)
- Coste de sujetos: 2,82 $ en 9 sujetos sonnet — RED 0,63 $; GREEN 1,27 $; control 0,53 $, más 0,39 $ de una tanda de control repetida por un parche fallido
- Review de spec: 1 revisor (dominio y técnica) · hallazgos 10, aceptados 8 y 2 en parte

## 3. Desviaciones del plan

- **Incidente en el repo común.** Mi test de `commitsOf` lanzaba `git -C <repo temporal>` sin limpiar el entorno. Dentro del pre-commit, con `GIT_DIR` exportado, operó sobre el repo real: `git init` dejó `core.bare = true` en el repo común, un commit se llevó el índice a mi rama y se creó `feature/1` con dos commits vacíos. Es el incidente de la 0217. Yo vi `core.bare = true` al inspeccionar y lo di por normal; la sesión `develop` lo detectó, lo restauró a `false` y sincronizó su checkout. El test ya usa `isolatedEnv()` y vive en `timing.slow.test.ts`. `feature/1` sigue ahí: el hook del dev-lead bloquea el borrado forzado, y la sesión `develop` se lo ha pasado a él. Nada de esto se publicó.
- **El frente condicionado salió y volvió a entrar.** En la Task 1 ablandé tras ver los resultados el criterio escrito en el plan, di el RED por limpio y saqué el frente. El eje Spec lo marcó; con el criterio del plan, el RED lo exhibe 3/3 y el GREEN pasa 3/3.
- `cli/test/session/clock.test.ts` estaba bajo «NO se tocan» y cambia una línea, porque fijaba exactamente cuatro líneas de salida.
- Enmiendas de la spec, en su sección: decisiones 9, 12, 13, 14 y 17.

### Decisiones tomadas sin el dev-lead

- Task 1: Ruling: el RED tc1 salió limpio con n = 3 (0/3) — sale el frente condicionado (Step 6, cita en la skill y la plantilla), con enmienda en la spec — si es un falso negativo, vuelve con un 2.º caso de campo.
- Task 1: Ruling: escenarios tc1 y tf1 en vez de c1 y f1 — ya existe un c1 en la batería — solo cambia el nombre.
- Task 1: Ruling: seedTranscript gana el tipo assistant! para cerrar turno — sin stop_reason el reloj de la 0211 no ve ninguna espera — un cambio de una línea en lib.mjs.
- Task 1: Ruling: scripts de reducción y parches en el workspace, fuera del repo — código de un solo uso — ninguno.
- Task 1: Ruling: el orden de TDD se rompió en timing.ts: escribí el test y el módulo en la misma tanda, sin ver su RED; lo compensa la comparación con el reloj real (0,56 h y 1,40 h) y los tests de borde — un test que no pudo fallar.
- Task 1: Ruling: gateWords se queda con las palabras hasta la primera opción, en vez de quitar valores por lista — más simple y cumple el escenario — un gate con tareas tras una opción no se reconocería.
- Task 1: Ruling: mi test de commitsOf, sin isolatedEnv, corrió bajo el GIT_DIR del pre-commit y creó en la rama real un commit con el índice y la rama feature/1 con dos commits vacíos — reparado: volví a la rama y enmendé el mensaje; feature/1 sigue ahí porque el hook del usuario bloquea el borrado forzado de ramas; nada se publicó y develop no se tocó — una rama local de sobra.
- Task 1: Ruling: corrección del ruling anterior — el mismo test reinicializó el repo común y dejó core.bare = true (18:05:45), y lo pasé por alto al inspeccionar; la sesión develop lo restauró a false y sincronizó su checkout; el test ya usa isolatedEnv y vive en timing.slow.test.ts; feature/1 se queda, por encargo de develop, a decisión del dev-lead — coste: otras sesiones expuestas a un repo común mal configurado unos minutos.
- Final: Ruling: corrección — el ruling de sacar el frente condicionado ablandó tras ver los resultados el criterio del plan; con el suyo el RED lo exhibe 3/3 y el frente entra — sin aprobación aparte: aplica «Entra, si el RED lo exhibe» — coste: 10 palabras en la skill, compensadas.
- Final: Ruling: cli/test/session/clock.test.ts se toca pese a «NO se tocan», una línea (slice(0, 4)): el test fijaba exactamente cuatro líneas y la de esperas es la quinta; su aserción de que Esfuerzo real es la cuarta sigue — coste: ninguno.
- Final: Ruling: reason de measured false lleva la ruta del worktree, en un fichero versionado de un repo público (hallazgo Minor de Arquitectura) — lo fija el THEN aprobado; cambiarlo es un desvío, va a ✋ — coste: una ruta local publicada si un cierre corre sin transcripts.
- Final: Ruling: ventana con dos transcripts solapados sale fuera del margen, y la decisión 6 decía que el margen la cubre (Minor de Código y Arquitectura) — falla seguro, con aviso y sin entrar en la tabla; sin test por el coste de montar la ventana — coste: esa tarea no sale en la tabla.
- Final: Ruling: la conexión del aviso de margen en verbs.ts sin test de CLI — provocarlo exige esa misma ventana; marginWarning y buildTiming sí tienen test — coste: una línea sin cubrir.
- Final: Ruling: gate en segundo plano o en subagente, y skill invocada con barra tecleada (Declined del eje Spec) — fuera de lo que el transcript del hilo deja atribuir; dicho en estimation.md — coste: Gate (h) y fases por debajo de lo real en esos casos.
- Final: Ruling: la fila 0196 pide tiempos en vivo de timing.json, que solo existe tras el cierre (eje Arquitectura) — no bloquea esta feature; va al ticket para el triaje — coste: ninguno aquí.
- Final: Ruling: minors nuevos de la re-revisión (ruta con espacios en el comando de task, línea de commit multilínea, phases con null rompe el log, versión tras la forma, espera de menos de 30 s da 0 min, un test parcial, --base=develop, rúbrica TF2, alias Commit) — no entran: la re-revisión no abre otra pasada y fallan hacia «sin tasks» o un aviso, salvo phases con null, solo con un fichero corrupto — van al ticket; coste: en una ruta con espacios, sin detalle de tasks.
- Final: Ruling: eje Arquitectura en serie tras Spec y Código — la línea de política de la spec no lo nombraba — coste: unos minutos.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 366/366 · cli:typecheck: corrió, en caché · cli:test: corrió 2051/2063 (12 omitidos), 2 min 8 s, sobre el commit de cierre salvo sus documentos
- `cli/test/session/timing.slow.test.ts` y `clock.slow.test.ts` no van en el gate: el primero corrió a mano en verde en la Task 3.
- Línea base: las tres tareas, sin filtro, en verde, 2 min 10 s, en un worktree desanclado.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · gate en verde · smoke con ejecución real sobre el transcript de la 0271 · GREEN `tf1` 1/1, `tc1` 3/3, `tf2` 1/1 · revisión final Spec, Código y Arquitectura, re-revisión con todos los hallazgos resueltos y 9 Minor adjudicados

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `timing.json` con las cuatro fases, en orden, con tiempos y ceremonia | ejecución real | sobre la 0271: `apertura`, `implementacion`, `revision`, `cierre`; 2 tasks |
| La suma cuadra con el reloj | ejecución real | 0271: 972 + 4062 + 3446 + 0 = 8480 s, reloj 8479 s, `withinMargin: true` |
| Agente + ejecución da el `Esfuerzo real` | ejecución real | 0271: 5034 s = 1,40 h |
| Sin `--artifact` no escribe; regenerar deja el fichero igual | suite | `timing.test.ts` |
| Fuera del margen avisa y sale con 0 | suite | `buildTiming` y `marginWarning`; la conexión en el verbo, sin test (ruling) |
| Fase sin eventos: `null` y `reason` | ejecución real | esta rama, antes de `sdd-archive`: `cierre` con `measured: false` |
| Sin transcripts, `measured: false` | suite | `timing.test.ts` |
| Tasks de los commits, o sin `tasks` si no coinciden | suite | `phases.test.ts` |
| Gate por su comando | suite | `timing.test.ts`, también con gates compuestos de las baterías. En la 0271, `gateSeconds: null`: su worktree ya no existe, y sin él no se lee su «Gate de cierre» |
| Estimado por fase, con plan, lite y nada | ejecución real | esta rama: 0,75, 1,5, 0,4 y 0,4 del plan; lo demás, suite |
| Tabla del log, ceremonia y ratio | ejecución real | sobre la 0271: «Ceremonia: 52 % del trabajo (1 tareas).» |
| La tabla principal no cambia | suite | `estimation/phases.test.ts` |
| `Esperas y huecos`, y no sale sin esperas | ejecución real | 0271: `13:55Z 57 min`; sin esperas, suite |
| La causa cita las esperas | ejecución real | GREEN `tc1` 3/3 |
| El cierre pega las líneas y `timing.json` entra en su commit | ejecución real | GREEN `tf1` y `tf2` |
| `--artifact` a una carpeta que no existe | ejecución real | `no existe la carpeta del artefacto: …`, exit 1, con las líneas ya impresas |

### 4.3 Residuales / deuda generada

- Minors de la re-revisión, sin arreglar y en el ticket: una ruta con espacios en el comando de `sdd task` no da evento, una línea de commit multilínea sí lo da, `"phases":[null]` rompe `sdd estimation log`, un `--base=develop` en el literal no se reconoce, y una espera de menos de 30 s imprime `0 min`.
- La fila 0196 pide tiempos en vivo de `timing.json`, que solo existe tras el cierre: va al ticket para el triaje.

## 5. Aprendizajes

- Un criterio de RED escrito antes de lanzar no se reinterpreta al ver el resultado: decidía un frente entero → ticket, para el triaje de `tests/` y `sdd-implement`.
- Un molde de cierre sin `.docs/sdd/estimation.md` no llega al paso de tiempo real: dos tandas de `tf2` no midieron nada → `reservas-timing` ya lo lleva, en la batería.
- Revisión de skills del proyecto: `.claude/skills/` — no aplica: herramientas genéricas de escritura de skills que esta feature no cambia.
- Retro: error que cazaría un chequeo → ticket del kit: `cli/test/kit/git-env.slow.test.ts` ya caza un git sin entorno limpio, pero es lento y no corre en el pre-commit, que es justo donde el fallo daña el repo común.
- Retro: documento o skill desmentido → ticket del kit: `seedTranscript` no daba `stop_reason`, así que desde la 0211 un transcript sembrado no medía ninguna espera; corregido aquí con `assistant!`.

## 6. Adendas

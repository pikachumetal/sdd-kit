---
id: 20261026-170842-feature-0227-behavior-tests-to-vitest
feature: 0227
title: Walkthrough — Conducta a Vitest: el lanzador de sujetos, los hooks y git
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Conducta a Vitest: el lanzador de sujetos, los hooks y git

## 1. Cambios realizados

- **Base y ports pequeños** (Task 1): `cli/test/kit/process.ts` (`run()` con el entorno de git limpio por defecto) y `bash.ts` (`resolveBash()`, que sustituye a `tests/Resolve-Bash.ps1`). `DenyKillHook`, `Hook`, `UpstreamWatch` y `Clear-GitEnv` pasan a `*.slow.test.ts`. La regla «toda llamada a git pasa un `env`» se aplica ahora a `cli/test/` y arregla dos llamadas de `merge/`.
- **Hook de sesión del repo** (Task 2): `KitSessionSource` y el caso de `Start-KitSession.ps1` de `TempDir` pasan a `kit-session-source.slow.test.ts`. Siguen lanzando `pwsh` hasta la 0228. `TempDir` (sus dos casos del TEMP de Pester) y `FastSuiteBudget` se retiran sin portar.
- **Privacidad** (Task 3): el control del commit sigue en el conjunto rápido (`subject-output-privacy.test.ts`) y el resto va en el lento. El control falla si `git diff --cached` falla, y `cli/moon.yml` gana `/.docs/**` y `/tests/**` en `testInputs`.
- **Lanzador y baterías** (Task 4): `HeadlessLauncher` (69 casos) se parte en siete ficheros por tema en `cli/test/kit/headless/`, y `Battery` va al suyo. `kit:test-headless` corre `vitest` sobre esa carpeta. `cli:test-slow` y `cli:test-min` la excluyen, y `tests/Invoke-KitTests.ps1` pierde `-Headless`.
- **Documentos** (Task 5 y pasada de fix): `tech-stack.md` (estado y gate), la fila 0228 (pasar a Node los tests que aún lanzan `pwsh`) y el changelog.
- **Pasada de fix**: `resolveBash(env)`, la regla de git con comillas dobles, el patrón del usuario sin home y los refactors de la revisión. Commits: apertura `3259987`; tasks `c12fa5e`, `b7813d1`, `7c911cf` + `3bc53a2`, `c4659b1` y `021c800`; pasada de fix, juntada en el cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4,5 h
- Esfuerzo real: 4,66 h — reloj de la sesión 19,97 h desde 2026-10-26T16:20Z, sin 228 min de espera al dev-lead (4 esperas), sin 11,52 h sin actividad (1 hueco)
- Desviación: +0,16 h (+4 %)
- Causa de la desviación: dentro de ±30 %. Lo que más tiempo se llevó: las esperas del cerrojo de suites de otras ramas en cada verificación lenta, y tres rojos del gate bajo carga con su contraste.
- Compactación: no (la sesión se cortó por un cuelgue del PC durante el cierre y se reanudó: el gate se relanzó entero)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 97.206.016 — claude-opus-5-5 97.206.016
- Tokens de subagentes: 9.668.548 en 3 despachos — Final review — Code axis claude-sonnet-5-5 2.722.782 / 4 min; Re-review final 0227 claude-opus-5-5 2.114.957 / 4 min; Final review — Spec axis claude-opus-5-5 4.830.809 / 8 min
- Coste de la sesión: 42,20 $ (hilo 37,08 $ + subagentes 5,12 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La salida de bash en los tests del lanzador va a un fichero, no a una tubería (el plan no lo preveía): con tubería se perdían a ratos las últimas líneas de `run.sh`.
- `testInputs` gana `/.docs/**` en lugar de `/.docs/sdd/capabilities/**` (spec, enmienda de la decisión 13).
- `tech-stack.md:8` conserva el `-Tag 'Slow'` de Pester (spec, enmienda de la decisión 16).
- Los helpers `tests/Clear-GitEnv.ps1` y `tests/Resolve-Bash.ps1` se borran en el merge con `develop`, porque la 0226 cerró antes y ya no queda ningún Pester que los use (decisión 15).

### Decisiones tomadas sin el dev-lead

- Task 1 — cleanGitEnv propio en cli/test/kit/process.ts (quita solo las 5 variables, como Clear-GitEnv.ps1) en vez del cleanEnv de ids/merge helpers, que no se exporta y quita todo GIT_* (también GIT_CEILING_DIRECTORIES de temp-setup) — coste si falla: un helper más
- Task 1 — los 11 It de Clear-GitEnv.Tests.ps1 no conservan su nombre: 5 probaban el helper .ps1 (sustituidos por «git() de cli/src/git no hereda las variables de git») y 6 la regla sobre tests/*.Tests.ps1 (ahora sobre cli/test/**/*.ts, con sus casos «señala… sin env», «acepta… con env», «no señala… texto ni comentario», «cada cli/test/**/*.ts… pasa un env») — spec decisión 8 — coste si falla: renombrar
- Task 1 — la regla de git ya no exime las lecturas de la raíz del kit (el Pester eximía git -C $KitRoot): toda llamada directa pasa env; más estricta, sin incumplimientos salvo los dos arreglados — coste si falla: un env de más en una lectura
- Task 1 — la línea base del gate se lanzó en segundo plano y, al esperar el cerrojo de la medida de kit:test-headless, corre sobre el árbol con la Task 1 ya hecha: no es una base limpia de la rama; la base limpia es develop en verde al cerrar la 0223 — coste si falla: un rojo heredado que se atribuye a esta rama
- Task 3 — stagedEvidence falla si git falla (antes, un error de git se leía como «sin evidencia» y el control pasaba: así entró una fuga en el primer intento de RED, que se deshizo) — coste si falla: un rojo por un git que falla a ratos, que se repite
- Task 3 — testInputs gana /.docs/** (en lugar de /.docs/sdd/capabilities/**): con solo una salida de sujeto staged, cli:test salía de la caché y la fuga entraba (en un RED que se deshizo); con /.docs/**, bloqueado. Spec decisión 13 actualizada; es el mismo valor que pone la 0226 — coste si falla: cli:test corre en cambios solo de .docs
- Task 4 — runCampaign manda la salida de bash a un fichero, no a una tubería: con tubería faltaban a ratos líneas finales de run.sh (2 de 3 pasadas de run-dry, un echo incondicional perdido; el ticket de la 0223 vio «pwd: write error: Bad file descriptor» en el mismo lanzador); con fichero, 3 de 3 — coste si falla: un rojo intermitente que vuelve
- Task 5 — tech-stack.md:8 conserva «o con -Tag 'Slow' (Pester)»: los Pester de la 0226 siguen usándolo hasta que cierre, y quitarlo aquí describiría un estado que no existe aún; solo sale la frase de FastSuiteBudget (spec, decisión 16, pedía las dos) — coste si falla: la 0226 lo quita
- Task 4 — el ledger de la Task 4 dice ..021c800 porque sdd task done corrió tras el commit de la Task 5 (la verificación esperaba el cerrojo); el commit de la Task 4 es c4659b1 — coste si falla: ninguno, es el registro
- Final — Spec Important 1 (Task 4 sin línea complete ni medida) — ya resuelto cuando volvió el eje: Task 4 complete con moon run kit:test-headless 81/81, 262,6 s frente a 920 s de Pester (baseline-headless.log), irá al walkthrough — coste si falla: ninguno
- Final — (Código, Minor 2 / Spec, Minor 7) cleanGitEnv no se fusiona con isolatedEnv ni con el cleanEnv de merge/ids: exportar isolatedEnv toca cli/src (fuera del plan) y el de merge/ids quita todo GIT_* con otro criterio; la copia de GIT_ENV_NAMES en git-env.slow.test.ts es un oráculo independiente — coste si falla: una variable nueva de git que se añade en un sitio y no en otro
- Final — (Código, Minor 6) el dato 'tests/SubjectOutputPrivacy.Tests.ps1' del test de selectEvidencePath se conserva: es el dato literal del Pester y sigue valiendo como ruta que no es evidencia — coste si falla: ninguno
- Final — (Código, Minor 7) stopPort y kit-session-source lanzan pwsh: van a la fila 0228 — coste si falla: la 0228 los olvida
- Final — (Código, Declined) tests anteriores de ids/ y merge/ que mutan process.env: fuera del diff; la restricción «ningún test muta process.env» es de los tests nuevos — coste si falla: ninguno nuevo
- Final — (Spec, Declined) fuera de Windows os.tmpdir() lee TMPDIR y RUNS_DIR caería fuera de .temp/: el repo es solo Windows, como con Pester — coste si falla: los tests del lanzador no corren en Linux
- Final — (re-revisión, Minor) battery.slow.test.ts:76 quedó «const verdict =(table…» sin espacio tras el =: TypeScript válido, sin efecto; no hay segunda pasada de fix — coste si falla: un espacio que arregla el siguiente que toque el fichero
- Final — (re-revisión, Minor) el comentario de usingSddBattery (battery.slow.test.ts:65) resume la fixture que monta: se queda — coste si falla: un comentario de más
- Final — (re-revisión, Minor) el marcado de GIT_CALL come un salto de línea si la llamada se parte tras «(», y las líneas siguientes de ese fichero salen desplazadas en uno; hoy no hay ningún caso en cli/test — coste si falla: un número de línea mal en el mensaje de la regla

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop` sobre la pasada de fix (juntada en el cierre) (más el cierre sin commitear, solo `.md`), con las suites de la 0222 y la 0226 en la máquina · configuración: la del gate · `kit:test` 1253 pasan / 0 fallan / 12 saltados · `cli:typecheck` en verde (caché) · `kit:test-headless` 78/81 en 739,51 s: dos timeouts de 120 s en `battery` y el umbral de 40 s de `SUBJECT_TIMEOUT`; repetidos solos, 20/20 en 206,58 s · `cli:test-min` (moon lo saltó tras el rojo; lanzado aparte, `--force`) 1586/1588 en 723,70 s: dos de `merge/cleanup.slow.test.ts`, 15/15 solo en la rama y 15/15 en `develop` `6be302e7`. Los dos rojos no se repiten: filas de deuda «Por triar»
- Por task (verificado por el agente): Task 1 49/49 · Task 2 25/25 · Task 3 22/22 y el pre-commit para una fuga staged (2 de 2) · Task 4 `moon run kit:test-headless --force` 81/81 en 262,6 s · Task 5 `moon run kit:test-fast kit:roadmap` en verde · pasada de fix `vitest run test/kit` 172/172.
- Medida (decisión 17): `kit:test-headless` en Pester, 81 tests en 920 s (`--force`, con la máquina cargada, mismo día) · en Vitest, 81/81 en 262,6 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · suite del gate de cierre `kit:test` 1253/0, `kit:test-headless` y `cli:test-min` con rojos bajo carga que no se repiten (20/20 y 15/15 repetidos; filas de deuda) · smoke 6/6 filas de «Dónde se prueba» con ejecución real · revisión final Spec y Código sobre 021c800 (With fixes), pasada de fix juntada en el cierre y re-revisión 13/13 resueltos

| THEN («Dónde se prueba») | Evidencia | Resultado |
| --- | --- | --- |
| Cada caso portado tiene su `it`, en verde | ejecución real | `vitest run test/kit` 172/172. El cotejo de nombres contra `develop` da 0 que falten, salvo los 3 retirados por la spec, los 11 de `Clear-GitEnv` sustituidos (decisión 8) y un falso positivo del cotejo (`-ForEach` sin marcador). El eje Spec lo repitió por su cuenta: 154 nombres |
| El lanzador corre solo cuando cambia | ejecución real | en esta rama, el gate con `--affected` corre `kit:test-headless`; en un worktree desechable con un commit que solo toca `skills/`, `moon run kit:test-headless --affected --base HEAD~1` → «No tasks affected by changed files» |
| `cli:test-slow` y `cli:test-min` no corren el lanzador | ejecución real | `vitest list` con su `--exclude '**/kit/headless/**'`: 0 tests de `kit/headless`, 70 del resto de `kit/` |
| El control de privacidad sigue parando el commit y no sale de la caché | ejecución real | con una fuga staged en `specs/*/red/out/`, el pre-commit la para 2 de 2; con solo esa salida staged, sin `/.docs/**` en `testInputs`, `cli:test (cached)` la dejaba entrar (deshecho), y con `/.docs/**` la para |
| La regla de git falla con una llamada sin `env` y `cli/test/` la pasa | ejecución real | RED sobre `merge/histogram` y `merge/sync` (3 llamadas), en verde tras arreglarlas; casos de comillas simples, dobles y dentro de textos |
| La medida antes y después | ejecución real | 920 s → 262,6 s, 81 tests en los dos |

### 4.3 Residuales / deuda generada

- `stopPort` (`headless/campaign.ts`) y `kit-session-source.slow.test.ts` lanzan `pwsh`: van en la fila 0228.
- Sin ningún Pester en `tests/` tras la 0226 y esta, `kit:test` y `kit:test-fast` llaman a `Invoke-Pester` sin ficheros: salen con 0, pero imprimen «No test files were found…». Lo retira la 0228 con `tests/Invoke-KitTests.ps1`.
- Dos filas de deuda «Por triar» de tests que fallan con la máquina cargada: tres del lanzador en Vitest (tope de 120 s y umbral de 40 s) y dos de `merge/cleanup.slow.test.ts`, de antes de la rama.
- Tres Minor de la re-revisión adjudicados (rulings): `=(` sin espacio en `battery.slow.test.ts:76`, el comentario de `usingSddBattery` y el salto de línea que come el marcado de `GIT_CALL`.

## 5. Aprendizajes

- Un control rápido de lo que lleva el commit necesita sus ficheros en los `inputs` de la tarea moon, o la caché lo salta y el commit pasa sin control. Se midió así: con solo una salida de sujeto staged, `cli:test (cached)` y la fuga entraban → `tech-stack.md`, «Conjunto rápido y tests lentos».
- Un script de Git Bash con hijos en segundo plano, lanzado desde Node con tubería, perdía a ratos sus últimas líneas: 2 de 3 pasadas. A un fichero, 3 de 3 → `tech-stack.md`, «Cómo se testean las skills».
- Un control que lee la salida de git y la filtra da «sin evidencia» si git falla, y deja pasar la fuga. Debe fallar con el error de git (`privacy.ts`, `stagedEvidence`). Es del código, no de un documento: el test que lo fija es el control mismo.
- Revisión de skills: «no aplica», decidido mirando. `git grep` de los ficheros retirados y de `kit:test-headless` en `skills/` y `capabilities/` no da nada, y ninguna skill nombra Pester de conducta.

## 6. Adendas

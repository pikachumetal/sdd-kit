---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261027-121904-feature-0226-drop-phrase-tests
task: 0226
mode: full
date: 2026-10-27
---

# Ticket para el kit — feature 0226: frases fuera y anatomía a Vitest

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo, Native
- Skills del kit usadas: `sdd-propose`, `sdd-grilling` (vía las preguntas del gate), `sdd-rubber-duck`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio repo del kit (Markdown + CLI en TypeScript, moon, Vitest y Pester), un dev-lead con varias sesiones en paralelo
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec y re-revisión), Sonnet 5.5 (eje Código)
- Coste en reloj: 1,47 h de esfuerzo frente a 2 h estimadas hasta el walkthrough; después, tres pasadas más de la suite completa en el cierre (abajo)
- Coste en tokens: 46.677.266 del hilo y 9.597.931 de subagentes en 3 despachos, 20,49 $ hasta el walkthrough

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La suite completa corrió cuatro veces en un cierre de una feature que solo mueve tests

- **Qué pasó**: el gate de cierre corrió como línea base, en la validación sobre `87066629` (46 min 24 s), otra vez sobre el merge de sincronización `cb93fe94` porque el commit posterior a la re-revisión tocó dos ficheros de `cli/test/kit/` (1 h 57 min, con la espera al cerrojo de otra sesión y un cuelgue del PC en medio), y una cuarta sobre `c59cb893` porque la base se movió otra vez (trajo código de la CLI de la 0184) y `sdd merge --push` paró con `merge: conflicto en .docs/sdd/capabilities/roadmap.md, .docs/sdd/roadmap.md.`
- **Fuente**: los logs de la sesión (`gate.log`, `gate-sync.log`, `gate-sync2.log`, `gate-sync3.log` del workspace del plan); `skills/sdd-archive/references/merge-recipe.md:11` («The suite again: only if … something changed outside `.docs/` that isn't `*.md`»)
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 6 y `skills/sdd-archive/references/merge-recipe.md` («The suite again»)
- **Por qué el kit no lo evitó**: el predicado es «cambió algo fuera de `.docs/` que no es `*.md`»; no distingue un cambio en un test aislado de un cambio en el código que cubren los demás tests, ni cuánta suite toca lo que trajo la base. Es la deuda que ya lleva la fila 0221.
- **Coste**: ~3 h de suite en el cierre, frente a 1,47 h de trabajo; sin respaldo en el walkthrough para la cuarta pasada (ocurrió después de escribirlo)
- **Propuesta**: tras la sincronización, correr solo las tareas de moon que afectan los ficheros que cambiaron desde la última suite verde (lo que trajo la base más los commits propios), en vez del gate entero; es el (b) de la fila 0221.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una suite verde sobre `<a>` y un commit posterior que solo toca `cli/test/kit/skills.test.ts` WHEN el cierre integra una base que no cambia nada fuera de `.docs/` THEN corre `cli:test` y no `kit:test-headless` ni `kit:test`.

### 2. El repaso de coherencia no comprueba que un test movido a una tarea con caché siga corriendo

- **Qué pasó**: la spec aprobada fijaba unos `testInputs` de `cli/moon.yml` que dejaban fuera `.agents/`, `.claude/`, `hooks/`, `.githooks/`, `.moon/` y la raíz, que `path-length.test.ts` sí recorre. Lo vio el eje Spec de la revisión final; lo reproduje con una ruta de 144 caracteres en `.agents/`: `moon run cli:test` → `cli:test (cached, b914a366)` en verde. Hizo falta parar por desvío, una enmienda aprobada por el dev-lead y una Task 3.
- **Fuente**: `.docs/sdd/specs/20261026-162553-feature-0226-drop-phrase-tests/spec.md` («Enmiendas») y `walkthrough.md` §3
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4, repaso de coherencia
- **Por qué el kit no lo evitó**: el repaso cruza literales y requisitos; no pide comprobar que lo que una tarea con caché da por bueno cubre todo lo que lee el test que se mueve a ella. Antes el test corría en una tarea con `cache: false`.
- **Coste**: una parada del dev-lead, una task de enmienda y su re-revisión (~20 min)
- **Propuesta**: en el repaso de coherencia, si la spec mueve un test de una tarea a otra, comprobar los `inputs` y la caché de la de destino contra lo que lee el test.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec que mueve un test que lee todo el repo a una tarea de moon con `inputs` parciales WHEN pasa el repaso de coherencia THEN «✋» señala los `inputs` que faltan antes del gate.

### 3. Un Important que mete la propia pasada de fix no tiene salida: la regla manda adjudicarlo

- **Qué pasó**: la re-revisión única encontró un Important nuevo, introducido por la pasada de fix: `manifests.slow.test.ts` tomaba la primera línea de `where claude`, que con npm en Windows es el shim sin extensión, y daba un rojo falso. «What it leaves open» manda adjudicarlo con `Final: Ruling:`; lo arreglé con su RED→GREEN en un commit que fue a ✋ como `sin revisar`, porque dejar un rojo falso conocido era peor.
- **Fuente**: `skills/sdd-verify/SKILL.md`, «What it leaves open» («An Important or a Minor: adjudicate it with `Final: Ruling:` … No second fix pass»)
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «Closing the review» → «What it leaves open»
- **Por qué el kit no lo evitó**: solo el Critical se arregla tras la re-revisión; un Important que la pasada de fix rompió y que un test reproduce queda como ruling.
- **Coste**: ~10 min y un commit `sin revisar` en ✋
- **Propuesta**: un Important que la propia pasada de fix introdujo y que un test reproduce en RED se arregla como un Critical (test primero, suite, ✋ `sin revisar`), sin abrir otra re-revisión.
- **Verificada**: sí — contrastado con `skills/sdd-verify/SKILL.md`, «What it leaves open»
- **Criterio de aceptación**: GIVEN una re-revisión que marca como Important una rotura introducida por la pasada de fix WHEN el hilo cierra la revisión THEN la arregla con RED→GREEN y la registra `sin revisar`, en vez de adjudicarla.

### 4. El merge paró por ficheros sin commitear de otra sesión en el checkout de `develop`

- **Qué pasó**: `sdd merge --push` → `destino sacado: el checkout de 'develop' en '…' tiene cambios sin commitear` por el ticket de otra feature que la sesión de coordinación copió y aún no había commiteado, y un `.claude/.profile.json`. Pedí a esa sesión que los commiteara y el cierre quedó parado hasta que el dev-lead intervino.
- **Fuente**: salida de `sdd merge --project-root <worktree> --push --verified-at cb93fe94` en la sesión; regla 6 del `CLAUDE.md` del repo
- **Dónde en el kit**: `CLAUDE.md` del repo, regla 6 (no es del kit que viaja); `sdd merge`, salida «destino sacado»
- **Por qué el kit no lo evitó**: la regla 6 hace que la sesión de coordinación deje ficheros en el checkout de `develop` entre copiar un ticket y commitearlo, que es justo lo que bloquea el merge de las demás.
- **Coste**: una parada del cierre hasta que el dev-lead lo desbloqueó; tiempo sin respaldo
- **Propuesta**: que la sesión de coordinación commitee el ticket en el mismo turno en que lo copia, o que la copia vaya a otro worktree.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN la sesión `develop` que recibe un ticket WHEN lo copia THEN el checkout de `develop` queda limpio al acabar su turno, y un `sdd merge --check` de otra rama da `destino: listo`.

## Lo que hice por iniciativa propia

- RED por mutante en cada fichero de test nuevo (bajar un tope, una ruta larga sin versionar, un enlace roto, un nombre de skill que no existe): el port de tests no tiene otro RED, porque el test es lo que se escribe. Funcionó: detectó un mutante que `sed` no aplicó y parecía un verde.
- Reproducir el hueco de la caché antes de plantear el desvío al dev-lead, con la evidencia en la pregunta. Funcionó: aprobó en una respuesta.

## Funcionó, no tocar

- La pregunta filosófica del dev-lead en el gate de la spec («¿qué validan los tests del kit?») cambió el criterio sin romper el flujo: el gate admitió «Cambios» y la spec se rehízo con la decisión literal.
- La validación en campo, el ledger y el aviso a la sesión `develop` por mensaje entre sesiones.

## Menores

- Un script de Node escrito en un heredoc de Git Bash rompió dos veces los escapes (`\\`, `\r\n`), la regla ya está en `tech-stack.md` (feature 0144) y no la apliqué — no localizado en una skill
- `sdd review package` imprime `wrote <ruta>: N commit(s), M bytes`, y tomar su última línea como ruta metió esa frase en el encargo de la re-revisión — `skills/sdd-verify/references/encargo-revision.md`
- El plan contó `kit-files.ts` como fichero de test (8 en vez de 7) — `skills/sdd-propose/references/plan-writing.md`

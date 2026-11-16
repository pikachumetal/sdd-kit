---
kit_version: 2.3.4
lane: patch
id: 20261105-122135-patch-0318-eol-only-not-dirty
task: 0318
mode:
date: 2026-11-05
---

# Ticket para el kit — patch 0318: sdd merge no ve como cambio un fichero que solo cambia de finales de línea

## Contexto

- Carril y modo: patch (fallo determinista; carril dado en la petición)
- Skills del kit usadas: `sdd-propose`, `sdd-implement` (`patch-flow.md`), `sdd-debugging`, `sdd-tdd`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el repo del kit (plugin de Claude Code, CLI en Node), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,36 h frente a 1 h estimada, sin esperas (`patch.md` §5)
- Coste en tokens: hilo 10.538.252 (5,00 $) al cerrar (`sdd session tokens`, `patch.md` §5)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La fila de «Próximo» fijó una solución que no cumplía su propio criterio de «hecho», dos veces

- **Qué pasó**: la fila 0318 y la petición fijaban dos piezas de la solución, y ninguna llegaba a su THEN. (a) «El cambio de contenido se mira con `git diff --quiet`», medido por la sesión `develop` solo hasta la detección. En un repo desechable, con la base cambiando ese mismo fichero, `git merge --no-edit develop` sale con 1: `error: Your local changes to the following files would be overwritten by merge:`. El THEN de la fila («`sdd merge --sync` integra la base») no se cumplía solo con detectar. Hizo falta `git add -u` antes del merge, decidido sin el dev-lead. (b) `cli/** text eol=lf` en `.gitattributes`, con el criterio «tras `moon run kit:build`, `git status --porcelain -- dist` sale vacío». En este worktree, 7 de los 129 ficheros venían de fuentes fuera de `cli/` (`.claude-plugin/`, `agents/`, `hooks/project/`, `LICENSE`, `THIRD_PARTY_NOTICES.md`), así que el criterio seguía en rojo. Amplié la regla a toda la lista blanca del build, también sin el dev-lead.
- **Fuente**: `node probe2.mjs` (repo desechable con `core.autocrlf=true` y `d/** text eol=lf`) en PowerShell → `git merge --no-edit develop -> 1` y, tras `git add -u`, `-> 0`; `git status --porcelain` agrupado por carpeta → `122 dist/cli`, `3 dist/agents`, `1 dist/.claude-plugin`, `1 dist/hooks`, `1 dist/LICENSE`, `1 dist/THIRD_PARTY_NOTICES.md`; `build/dist.ts:9-19` (`WHITELIST`); `.docs/sdd/specs/20261105-115706-patch-0318-eol-only-not-dirty/patch.md` §2 y §3
- **Dónde en el kit**: el triaje de `skills/sdd-roadmap/SKILL.md` que escribe la fila de «Próximo» con su solución y su GIVEN/WHEN/THEN; no localizo el paso exacto que diga cómo se comprueba una solución fijada en la fila
- **Por qué el kit no lo evitó**: el triaje copia a la fila la solución que propone el ticket, sin pedir que su reproducción llegue al WHEN de la fila. Lo paró a tiempo `skills/sdd-propose/SKILL.md:102` («A proposed solution for a failure doesn't turn it into a closed request: the root cause confirms the proposal fixes it»): la regla funcionó, pero la fila llegó con dos decisiones que el hilo tuvo que rehacer sin el dev-lead
- **Coste**: dos decisiones `sin el dev-lead` en un patch (`patch.md` §3; commit `7bd12cda`); ~10 min de sondas, sin respaldo
- **Propuesta**: cuando el triaje fija la solución en la fila, que la reproducción corra el WHEN de la fila, no solo la parte que se arregla, o que la fila diga «solución por confirmar». Que sustituya una frase del paso de la fila, sin alargar la skill
- **Verificada**: sí — reproducido con `node probe2.mjs` en PowerShell (merge que aborta y que integra tras `git add -u`) y con un clon desechable (`kit:build` con solo `cli/**`: quedan 7)
- **Criterio de aceptación**: GIVEN un ticket que propone «mirar X con `git diff --quiet`» y una fila con el THEN «`sdd merge --sync` integra la base» WHEN `sdd-roadmap` la tría THEN la fila lleva la solución solo si la sesión corrió `sdd merge --sync` (o su `git merge`) con ese caso; si no, «solución por confirmar»

### 2. El umbral del patch no dice si cuentan las copias generadas de `dist/`

- **Qué pasó**: el paso 4 de `patch-flow.md` pide contar el diff «sin tests ni documentación» y parar con más de 10 ficheros. El fix toca 5 fuentes de `cli/src/` y `.gitattributes`, más las 5 copias que el build escribe en `dist/cli/src/`: 11 con las copias y 6 sin ellas. Dejé fuera `dist/` por ser generado (`linguist-generated` en `.gitattributes`) y lo anoté como decisión `sin el dev-lead`.
- **Fuente**: `git diff --cached --numstat -- . ':!cli/test' ':!.docs' ':!dist'` → 6 líneas, 42 añadidas y 13 quitadas; `dist/skills/sdd-implement/references/patch-flow.md:16`
- **Dónde en el kit**: `skills/sdd-implement/references/patch-flow.md`, paso 4
- **Por qué el kit no lo evitó**: la regla no nombra los ficheros generados que se commitean
- **Coste**: ~1 min y una decisión `sin el dev-lead` (`patch.md` §3)
- **Propuesta**: «sin tests, documentación ni ficheros generados» en la misma frase
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un patch que toca 5 fuentes y sus 5 copias generadas en `dist/` WHEN el paso 4 cuenta el diff THEN da 5 ficheros y no para

### 3. Un clon ya sacado sigue sacando `dist/` en CRLF tras la 0318

- **Qué pasó**: `.gitattributes` no reescribe una fuente que ya está en CRLF en el working tree, y como su stat no cambia, git no la da por modificada. El build la sigue copiando en CRLF a `dist/`. En este worktree hubo que pasar 351 fuentes a LF a mano antes de que `kit:build` dejara `dist/` limpio. Los clones y worktrees nuevos salen en LF. La CLI ya no se para por ese ruido, pero `git status` lo sigue enseñando hasta que cada fichero se vuelve a sacar.
- **Fuente**: `git ls-files --eol -- cli/src/merge/steps.ts` tras el cambio de `.gitattributes` → `i/lf w/crlf attr/text eol=lf`, sin línea en `git status`; `node to-lf.mjs …` → `a LF: 351 ficheros`
- **Dónde en el kit**: `build/dist.ts`, `buildDist` (copia los bytes del working copy)
- **Por qué el kit no lo evitó**: el build confía en el EOL del working copy
- **Coste**: ninguno observado todavía; el checkout de `develop` y las ramas abiertas lo tendrán en su próximo build
- **Propuesta**: que `buildDist` escriba LF en los ficheros de texto que copia, como ya hace `includesFrom` con `replace(/\r\n/g, '\n')`
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un clon con `core.autocrlf=true` y las fuentes de `cli/` en `w/crlf` WHEN `moon run kit:build` THEN `git status --porcelain -- dist` sale vacío

## Lo que hice por iniciativa propia

- Antes del arreglo, probé en un repo desechable el paso que sigue a la detección: el `git merge`, también con un conflicto a medias. `git diff --quiet` da 1 ahí, así que `git add -u` nunca marca un conflicto como resuelto. Funcionó: así salió el hallazgo 1 (a).
- Separé la comprobación pura (`hasContentChanges`) del refresco (`refreshStat`), porque `control-profiles`, «La comprobación del destino no toca nada», promete que `--check` no cambia el índice. El test lo fija: tras `--check`, `git status` sigue en ` M`.
- Hice un control del criterio del build en un clon desechable sacado en el commit anterior: 129 ` M` con `git diff --quiet` en 0, frente a 0 con el fix. Funcionó, pero el primer control salió mal (`checkout HEAD~1` solo reescribe lo que cambia) y hubo que rehacerlo con `clone --no-checkout`.

## Funcionó, no tocar

- `skills/sdd-propose/SKILL.md:102`: la causa raíz confirma la solución propuesta para un fallo; sin esa regla, el patch habría salido con solo `git diff --quiet` y `--sync` seguiría abortando cuando la base cambia el fichero.
- El carril dado en la petición no se preguntó otra vez, y `sdd id claim` dio `nada que publicar` sin parar.

## Menores

- El primer clon desechable se quedó a medias en silencio por rutas largas: lo tapé con `2>$null`. Con `core.longpaths=true` salió bien (~3 min) — no localizado

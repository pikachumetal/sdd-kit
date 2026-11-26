---
kit_version: 3.0.4
lane: patch
id: 20261125-172920-patch-0001-localhost-ports
task: 0001
mode:
date: 2026-11-25
---

# Ticket para el kit — patch 0001: fricciones del primer ciclo tras sdd-init (publicación, sync, reloj y validación)

## Contexto

- Carril y modo: patch (tres patches seguidos, 0001-0003, más el init y el corte de la primera release en la misma sesión)
- Skills del kit usadas: sdd-init, sdd-grilling, sdd-config, sdd-roadmap, sdd-propose, sdd-implement, sdd-archive, sdd-end-release, add-to-changelog, sdd-retro, sdd-feedback
- Proyecto: repo de un `compose` con un servicio, sin código de aplicación, Windows, una persona; depende de un repo hermano de proxy inverso
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-sonnet-5-5 (un revisor por patch)
- Coste en reloj: 0,52 h reales aproximados por commits frente a 0,7 h estimadas (los tres patches)
- Coste en tokens: 1,84 $ de sesión hasta el cierre de la 0002 (`sdd session tokens`)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `sdd session tokens` da como esfuerzo real del patch el reloj de toda la sesión

- **Qué pasó**: en una sesión que empezó con el init, los tres cierres dieron `Esfuerzo real: 0,25 h — reloj de la sesión 2,37 h desde 2026-11-25T14:04Z…`, `0,46 h — … 2,67 h…` y `0,77 h — … 3,15 h…` para patches de 10-14 min entre su `Inicio:` y su merge. Desviaciones registradas: +150 %, +53 %, +157 %. Hubo que reescribir los tres `patch.md` con el real aproximado por commits.
- **Fuente**: salida de `node …/cli/bin/sdd.js session tokens --path <raíz> --branch patch/000N-… --artifact <carpeta>`; `git log --format='%h %cI %s'` de las ramas
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 2, «Real time»; verbo `sdd session tokens`
- **Por qué el kit no lo evitó**: el verbo toma el arranque de la sesión, no el `Inicio:` que `patch.md` §5 ya escribe antes del fix
- **Coste**: ~10 min de corrección y una calibración contaminada hasta corregirla (commit `0ea6567`)
- **Propuesta**: con `--artifact` y un `Inicio:` en el artefacto, contar desde ese `Inicio:` (o desde el primer commit de la rama), no desde el arranque de la sesión
- **Verificada**: sí — reproducido con `sdd session tokens` en PowerShell, tres veces
- **Criterio de aceptación**: GIVEN una sesión abierta a las 14:04Z y un `patch.md` con `Inicio: 16:19Z` cerrado a las 16:29Z, WHEN se corre `session tokens --artifact <carpeta>`, THEN `Esfuerzo real` ≤ 0,2 h

### 2. `sdd merge --sync` falla en el primer cierre tras el init: `develop` no está en el remoto

- **Qué pasó**: `sdd merge --sync --project-root <raíz>` → `base: no se pudo hacer fetch de 'origin'.` El init crea `develop` en local y deja su publicación a la persona; nadie la había hecho. El agente tuvo que pedir el push, y el dev-lead preguntó por qué se lo pedía si `merge.push: true` estaba en la configuración.
- **Fuente**: salida del comando en PowerShell; `git ls-remote --heads origin` → solo `refs/heads/main`; `.docs/sdd/sdd-kit.json` → `"push": true`
- **Dónde en el kit**: `skills/sdd-init/SKILL.md` paso 6 («The user runs what touches the remote») frente a `skills/sdd-config/SKILL.md` pregunta 4
- **Por qué el kit no lo evitó**: el init reserva a la persona la primera publicación de la rama de integración aunque la configuración autorice al agente a publicarla, y `--sync` no distingue «sin rama remota» de «fetch fallido»
- **Coste**: un turno de ida y vuelta y una pregunta del dev-lead (sin respaldo en artefacto)
- **Propuesta**: (a) con `merge.push: true`, el paso git del init publica la rama de integración él mismo; (b) `--sync` con remoto pero sin `<remote>/<into>` sigue con el `<into>` local, como `id claim` («sin remoto: … contador local»)
- **Verificada**: sí — reproducido con `sdd merge --sync` en PowerShell
- **Criterio de aceptación**: GIVEN un remoto sin `develop` y `develop` local, WHEN `sdd merge --sync`, THEN sale `base: al día` (o integra el local) y no `no se pudo hacer fetch`

### 3. `sdd roadmap publish` falla si la rama de integración es la del propio worktree

- **Qué pasó**: tras triar la deuda en `develop`, `roadmap publish --project-root <raíz> --message … ROADMAP.md .docs/sdd/steering/debt.md` → `destino con cambios: ROADMAP.md en <raíz>`. El destino es el mismo worktree donde se editaron los ficheros. Se hizo el commit a mano.
- **Fuente**: `cli/src/roadmap/publish.ts:44` (`assertTargetClean`); salida del comando en PowerShell
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md` checklist, paso 6
- **Por qué el kit no lo evitó**: el verbo asume que se edita desde otro worktree; en un repo de una persona trabajando sobre `develop` es el caso normal
- **Coste**: ~3 min (commit a mano)
- **Propuesta**: si el worktree destino es el de `--project-root` y solo están sucios los ficheros que se publican, commitearlos ahí
- **Verificada**: sí — reproducido en PowerShell
- **Criterio de aceptación**: GIVEN `develop` checkout en la raíz con solo `ROADMAP.md` modificado, WHEN `roadmap publish … ROADMAP.md`, THEN commit en `develop` con ese fichero y exit 0

### 4. Un paso con elevación del guion de validación llegó sin ensayar y falló

- **Qué pasó**: el guion dio `gsudo pwsh -NoProfile -Command "$p=\"$env:SystemRoot…\"; …"`; el shell del dev-lead expandió `$p` antes y salió `=\: The term '=\' is not recognized…`. La versión con `gsudo { … }`, ensayada sobre una copia del fichero, funcionó.
- **Fuente**: salida pegada por el dev-lead; ensayo en el scratchpad
- **Dónde en el kit**: `skills/sdd-archive/references/dev-validation.md` §1 («Run every step yourself before presenting it»)
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué; el paso pedía UAC y lo di por inensayable, cuando su lógica sí se podía ensayar sobre una copia
- **Coste**: un turno de validación extra
- **Propuesta**: en §1, un paso que necesita elevación se ensaya sin elevar sobre una copia de lo que toca, y se entrega en la forma que no depende del quoting del shell del usuario
- **Verificada**: sí — el ensayo sobre copia dio el resultado esperado
- **Criterio de aceptación**: GIVEN un guion con un paso de UAC, WHEN el agente lo presenta, THEN §4 del artefacto cita el ensayo sobre copia y su salida

### 5. La suite del corte paró el entorno que el dev-lead tenía en uso

- **Qué pasó**: al correr la suite de humo del corte, `docker compose up -d` respondió `Container <servicio> Running` (ya estaba arriba) y el agente terminó con `docker compose down`, parando el servicio que el dev-lead usaba. Se levantó de nuevo acto seguido.
- **Fuente**: salida del comando en PowerShell durante `sdd-end-release`
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Processes you start»; `skills/sdd-end-release/SKILL.md`, puerta «Green suite»
- **Por qué el kit no lo evitó**: la regla «para solo lo que arrancaste» existe y no la apliqué; no hay un paso que obligue a mirar el estado antes de levantar
- **Coste**: unos segundos de servicio caído y una disculpa (sin respaldo en artefacto)
- **Propuesta**: antes de levantar el entorno para una suite, anotar si ya estaba arriba; si lo estaba, no pararlo al acabar
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN el entorno ya levantado, WHEN el corte corre la suite, THEN al acabar el entorno sigue arriba

## Lo que hice por iniciativa propia

- Pedir los datos del repo hermano a su propia sesión por mensaje entre sesiones (comando, rutas, estado de su feature) y comprobarlos después en su `origin/develop` antes de escribirlos. Funcionó: el README citó el comando real.
- Medir el consumo real del servicio (`docker stats`) antes de proponer bajar sus límites.

## Funcionó, no tocar

- La configuración del kit durante el init (`sdd-config`, una pregunta por turno, `--config` acumulativo).
- `sdd roadmap check` como prueba en cada escritura del roadmap.
- `id claim` con `sin remoto: … contador local`.
- `sdd merge --push --verified-at` en los tres cierres.

## Menores

- `changelog-template.md` dice «`roadmap.md` es el forward-looking» cuando en 3.0.0 el fichero es `ROADMAP.md` en la raíz — `skills/sdd-templates/templates/changelog-template.md`
- La 0003 se arrancó desde Next sin subirla a Now; el corte la sacó igual — `skills/sdd-propose/SKILL.md` paso 3 no dice qué hacer con una fila de Next al arrancarla
- Escribí memoria automática con `autoMemoryEnabled: false` en `.claude/settings.json` (lo puso el `--finish` del init); el dev-lead lo paró y las lecciones fueron a `operations.md` y a la constitution — no localizado en el kit

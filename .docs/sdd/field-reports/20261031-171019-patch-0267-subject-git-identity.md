---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261031-164208-patch-0267-subject-git-identity
task: 0267
date: 2026-10-31
---

# Ticket para el kit — patch 0267: el sujeto de una batería ve la identidad Fixture

## Contexto

- Carril: patch, causa raíz, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-debugging`, `sdd-start-patch`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit, una persona
- Modelo del hilo: Opus 5.5
- Coste: ~6,4 $ en 7 sujetos Opus, frente a los ~1,8 $ que anuncié; sesión 3,96 $ y 0,58 h con `sdd session tokens`, frente a 0,77 h estimadas

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El criterio «escriben el aviso del aprobador» no se puede cumplir solo una vez arreglada la causa

- **Qué pasó**: con el fix, `g1` sale `2/2 · verde`, y 0 de 2 escriben el aviso: el aviso nacía de que el nombre de la máquina no cuadraba con Laura, y con Fixture no lo comentan. Hizo falta un `TURN2` que lo pide.
- **Fuente**: `patch.md` de la 0267, §4, casos 3 y 4; `green/out/` y `green3/out/` de su carpeta
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, donde nace el «está hecho cuando» de la fila; no sé localizar un paso concreto
- **Por qué el kit no lo evitó**: nada pide comprobar que la conducta del «hecho cuando» sobrevive al arreglo cuando esa conducta es el propio síntoma
- **Coste**: 3,16 $ de `green2` y `green3`, más que el arreglo
- **Propuesta**: que `g1` lleve fija una fila o un `TURN2` que obligue a escribir la identidad, para medirla sin depender del aviso
- **Verificada**: sí — `green2/g1-2` y `green3/g1-1` escriben el aviso con Fixture y guardan sus salidas
- **Criterio de aceptación**: GIVEN `g1` con el lanzador sin el fix WHEN corre THEN sale «sin evidencia»; con el fix, verde y con el aviso en `texts.txt`

### 2. Un sujeto aún llega al nombre si inspecciona el origen de la config

- **Qué pasó**: `green2/g1-1` veía `Fixture` en el contexto, corrió `git config --show-origin --get-all user.name` porque mi turno le pedía comparar, y perdió su evidencia. `GIT_CONFIG_GLOBAL` lo taparía, pero también `core.autocrlf` y `core.longpaths` para todas las baterías, y `cat ~/.gitconfig` seguiría llegando; no lo corté.
- **Fuente**: stream de `green2/g1-1`, línea 148, ya borrado; `patch.md` de la 0267, §4
- **Dónde en el kit**: `tests/headless/lib.mjs`, `claudeEnv`
- **Por qué el kit no lo evitó**: el lanzador solo fija la identidad; `extract.mjs` lo paró, como debe
- **Coste**: 1,07 $ de un sujeto
- **Propuesta**: solo si se repite sin que un turno lo provoque, un `GIT_CONFIG_GLOBAL` con la global de la máquina sin `user.*`
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un sujeto que corre esa orden WHEN acaba THEN `tools.txt` se guarda y no lleva el nombre

### 3. `sdd merge` falló una vez con `fatal: stash failed`, y a la segunda fusionó

- **Qué pasó**: `merge: git merge falló sin conflictos.` y `fatal: stash failed`, salida 1, en PowerShell. `develop` quedó limpio y en su sha, `sdd merge --check` dijo `destino: listo`, y el mismo comando fusionó después. No encontré `stash` en `cli/src`, en `.githooks` ni en la config de git. La causa no está localizada.
- **Fuente**: `node cli/bin/sdd.js merge --project-root . --push`; `cli/src/merge/attempt.ts`, `abortedMergeError`
- **Dónde en el kit**: `cli/src/merge/attempt.ts`
- **Por qué el kit no lo evitó**: el mensaje enseña la cola de la salida de git sin decir si conviene reintentar
- **Coste**: ~2 min y un reintento a ciegas; caso único
- **Propuesta**: ninguna hasta un segundo caso, que se busca por el literal `stash failed`
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `git merge` falla sin conflictos y sin `MERGE_HEAD` WHEN sale `sdd merge` THEN el destino queda intacto y el mensaje dice si reintentar es seguro

### 4. El contexto del sujeto trae también el email de la cuenta, y `extract.mjs` no lo mira

- **Qué pasó**: en la sonda, 4 de 4 sujetos Haiku nombraron el `userEmail` de la cuenta al preguntarles, también con `--setting-sources ""`. En esta máquina no coincide con `user.email`, así que `extract.mjs` no lo pararía. Ningún fichero de `.docs/sdd/specs/` lo lleva hoy, y ningún stream de `g1` de esta tanda.
- **Fuente**: salida de la sonda; búsqueda del dominio en `.docs/sdd/specs/` y en los streams, 0 resultados
- **Dónde en el kit**: `tests/headless/extract.mjs`, `identity`
- **Por qué el kit no lo evitó**: la comprobación solo conoce la identidad de git
- **Coste**: sin coste; riesgo de publicar el email en un repo público
- **Propuesta**: que `extract.mjs` compruebe también el email de la cuenta, si se puede leer de la máquina
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una salida con el email de la cuenta WHEN corre `extract.mjs` THEN sale con 3

## Lo que hice por iniciativa propia

- Puse el corte en `launch`, no en cada `subject.mjs`, aunque la fila nombraba `sdd-propose/subject.mjs`: vale para todas las baterías.
- Añadí una línea a `tech-stack.md` sobre lo que ignora `Git user`.
- Lancé `green2` y `green3` sin parar, con más coste del anunciado, porque el verde no probaba qué identidad veía el sujeto.

## Funcionó, no tocar

- La hipótesis del prompt: una sonda Haiku de 0,02 $ en cuatro configuraciones la confirmó antes de escribir nada.
- `saveExtract` diciendo la causa del `no se guarda`, y el mensaje de `KIT_DIR`, que dice el arreglo.

## Menores

- `SUBJECT_CAP` volvió a dejar `g1-2` `sin evidencia · sin tools.txt` sin lanzarlo; ahora sí dice `techo de 4 sujetos alcanzado`, antes del veredicto: tercer caso de lo de la 0266 §3 — `tests/headless/battery.mjs`.
- `battery.mjs` no suma el coste de un sujeto sin `tools.txt` (`coste acumulado: 0.00 $` tras dos sujetos Opus), y borré el stream del RED antes de leerlo: esos ~1,6 $ son estimados — `tests/headless/campaign.mjs`.
- Lancé `KIT_DIR=.` sin copia, sin coste: la regla existía y no la apliqué — `.docs/sdd/tech-stack.md`.
- Los sujetos de `g1` avisan de que el kit 2.3.4 va por detrás del proyecto, que pide 3.0.0: el marcador del molde sale de la última migración. Es ruido en su mensaje — `tests/headless/lib.mjs`, `kitVersion`.

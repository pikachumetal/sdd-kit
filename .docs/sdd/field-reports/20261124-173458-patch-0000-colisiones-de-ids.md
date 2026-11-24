---
kit_version: 3.0.4
lane: patch
id: 20261124-173458-patch-0000-colisiones-de-ids
task: 0000
mode:
date: 2026-11-24
---

# Ticket para el kit — patch 0000: ids y números de ADR repetidos entre ramas paralelas

## Contexto

- Carril y modo: sesión de roadmap, release y revisión de la deuda, sin cambio propio; `0000` porque no hay feature ni
  patch al que atar el ticket
- Skills del kit usadas: `sdd-roadmap`, `sdd-end-release`, `sdd-retro`, `add-to-changelog`, `sdd-config`,
  `sdd-feedback`
- Proyecto: aplicación web con backend .NET y frontend React, varias personas y varias sesiones de agente en worktrees
  paralelos sobre la misma rama de integración
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica para lo que reporta este ticket
- Coste en reloj: no medido
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Dos carpetas de cambio con el mismo id bloquean `sdd id next` en todos los worktrees

- **Qué pasó**: una feature y un patch cerrados en dos ramas a la vez llevaban el mismo id, 0756, y las dos se
  fusionaron en la rama de integración. Desde entonces, `sdd id next --reserve` falla en cualquier worktree, y no se
  puede arrancar ningún cambio ni escribir ninguna fila nueva. Para reservar hubo que sacar a mano la carpeta repetida
  del escaneo en un worktree temporal, y después renombrar la feature, todavía sin publicar, a un id libre: su carpeta,
  su fila y las referencias en capacidades, ADR, arquitectura, deuda, estimación y skills. Las migraciones SQL y los
  comentarios del código siguen con el id viejo, porque renombrar una migración ya aplicada la vuelve a correr.
- **Fuente**: `node <kit>/cli/bin/sdd.js id next --project-root <raíz> --reserve --count 4` en Git Bash → `Dos
  artefactos distintos comparten el id 0756: 20261123-141327-feature-0756-<slug>,
  20261123-162919-patch-0756-<slug>.`; `cli/src/ids/scan.ts:101` lanza el `DomainError`; `sdd id next --help` →
  `uso: sdd id next [--project-root <valor>] [--reserve] [--count <valor>] [--lock-timeout <valor>] [--json]`, sin
  forma de saltarlo; `.docs/sdd/sdd-kit.json:2` → `"version": "3.0.4"`
- **Dónde en el kit**: `cli/src/ids/scan.ts`, `assertNoSharedIds`; `cli/src/merge/` (`sdd merge --check` y
  `--sync`), que fusionaron las dos ramas sin avisar
- **Por qué el kit no lo evitó**: la reserva no impidió que dos ramas tomaran el mismo id (sin respaldo sobre cómo lo
  tomó cada una), y la comprobación solo salta después, en `id next`, cuando el duplicado ya está en la integración y
  bloquea a todos
- **Coste**: todas las reservas del proyecto bloqueadas hasta el arreglo; un commit de renumeración de 16 ficheros
  (`40a58daeb`); tiempo sin medir
- **Propuesta**: (a) `sdd merge --check` y `--sync` fallan si la rama y su destino tienen dos carpetas distintas con el
  mismo id, antes de fusionar; (b) `sdd id next` con un duplicado ya en la integración avisa y sigue, porque el
  siguiente id libre está bien definido, en vez de bloquear a todos los worktrees
- **Verificada**: sí — reproducido con `sdd id next --reserve` en Git Bash, y contrastado con `cli/src/ids/scan.ts:101`
- **Criterio de aceptación**: GIVEN la integración con `…-feature-0756-a` y una rama con `…-patch-0756-b` WHEN se
  corre `sdd merge --check` en la rama THEN falla y nombra las dos carpetas. Y GIVEN las dos carpetas ya en la
  integración WHEN se corre `sdd id next --reserve` THEN reserva el siguiente libre y escribe un aviso con las dos
  carpetas

### 2. Dos ADR con el mismo número, creadas en ramas paralelas

- **Qué pasó**: dos features cerradas el mismo día escribieron cada una su ADR como «la siguiente a la más alta» y las
  dos tomaron el número 0004. Tras fusionar las dos, `sdd decision check` falla en la integración, y el cierre de
  cualquier rama que lo corra para en ese paso. Se arregló cambiando el número de las dos ADR de la feature fusionada después a
  0005 y 0006.
- **Fuente**: `sdd decision check --path .docs/sdd` → `número 0004 repetido: 0004-<slug-a>.md, 0004-<slug-b>.md`;
  `skills/sdd-archive/SKILL.md:41` → «write `decisions/NNNN-<slug>.md` from `adr-template.md`, numbered after the
  highest»
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md`, paso 3, viñeta «ADR»
- **Por qué el kit no lo evitó**: el número sale de mirar el disco de la rama, sin reserva compartida como la de los
  ids, y `decision check` solo ve el choque después de fusionar
- **Coste**: un paso de cierre que falla en la integración para todas las ramas; arreglado en el mismo commit
  `40a58daeb`
- **Propuesta**: numerar las ADR con la misma reserva con cerrojo que los ids (`sdd decision next --reserve`), o que
  `sdd merge --check` falle con dos ADR del mismo número entre la rama y su destino
- **Verificada**: sí — reproducido con `sdd decision check` en Git Bash
- **Criterio de aceptación**: GIVEN la integración con `decisions/0004-a.md` y una rama con `decisions/0004-b.md` WHEN
  se corre `sdd merge --check` en la rama THEN falla y nombra los dos ficheros

### 4. `sdd roadmap publish` no publica desde el checkout donde está la rama de integración

- **Qué pasó**: con la rama de integración en el checkout principal, editar ahí `ROADMAP.md` y publicar falla con
  `destino con cambios`, porque el origen y el destino son el mismo árbol. Hubo que copiar la edición a un worktree
  temporal, deshacerla en el principal y publicar desde el temporal; las cuatro publicaciones siguientes de la sesión
  se hicieron ya así.
- **Fuente**: `sdd roadmap publish --project-root <raíz> --message <…> ROADMAP.md` en Git Bash → `destino con
  cambios: ROADMAP.md en <raíz>`; `cli/src/roadmap/publish.ts:44`
- **Dónde en el kit**: `cli/src/roadmap/publish.ts`, `assertTargetClean`; `skills/sdd-roadmap/SKILL.md`, paso 6
- **Por qué el kit no lo evitó**: `publish` supone que se edita en otro worktree, y el paso 6 no dice qué hacer cuando
  se edita en el de la integración
- **Coste**: un worktree temporal por publicación, cinco en la sesión, sin medir en reloj; uno que Windows no dejó
  borrar a la primera
- **Propuesta**: si `--project-root` es el mismo árbol que el destino, `publish` hace commit de los ficheros nombrados
  ahí mismo, bajo el cerrojo
- **Verificada**: sí — reproducido con `sdd roadmap publish` en Git Bash
- **Criterio de aceptación**: GIVEN la integración sacada en `<raíz>` con `ROADMAP.md` editado WHEN se corre `sdd
  roadmap publish --project-root <raíz> ROADMAP.md` THEN hace commit de `ROADMAP.md` en la integración

## Lo que hice por iniciativa propia

- Para reservar ids con un duplicado ya fusionado, renombré en un worktree temporal la carpeta repetida a un nombre sin
  id antes de `sdd id next --reserve`. Funcionó: la reserva se hizo con el cerrojo y las etiquetas de siempre.

## Funcionó, no tocar

- `sdd merge --sync` y `sdd merge --verified-at … --push` desde un worktree temporal: fusión con cerrojo y push en un
  paso.
- `sdd decision check` cazó el número de ADR repetido en cuanto se corrió.

## Menores

- `sdd id next` no dice qué rama o worktree tiene el id que impide reservar uno — no localizado

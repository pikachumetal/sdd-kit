---
kit_version: 2.3.3 (develop, CLI de la 3.0.0 en preparación)
superpowers_version: 6.4.1
lane: patch
id: 20261009-121142-patch-0164-cli-merge-help-guard
task: 0164
mode:
date: 2026-10-09
---

# Ticket para el kit — patch 0164: salvaguardas de la CLI sdd (--help, merge sin argumentos, task done sin commits)

## Contexto

- Carril y modo: patch de petición cerrada (`solution: dev-lead`), perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`; CLI `sdd` (`id next --reserve`, `capability merge|check`, `roadmap check`, `estimation log`, `merge --push`)
- Proyecto: el repo del kit (plugin de Claude Code, CLI en TypeScript con Vitest), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,5 h, sin estimación previa; el «Real» de `patch.md` §5 no tiene fuente medida
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La regla de renombrar la rama sin id solo cubre `feature/<slug>`, y el patch llegó en `patch/<slug>`

- **Qué pasó**: el worktree se creó en `patch/cli-merge-help-guard`. Al reservar el `0164`, el paso 2 de `sdd-start-patch` y `nombrado.md` solo dicen qué hacer en una rama `feature/<slug>` sin id. Lo apliqué por analogía y la renombré a `patch/0164-cli-merge-help-guard`. El patch 0155 de este mismo repo, en la misma situación, se quedó en `patch/merge-append-only-and-locked-files` (campo `branch:` de su `patch.md`): dos patches seguidos, dos nombres de rama distintos.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 2 (línea 53); `skills/sdd-start-feature/references/nombrado.md`, «La rama lleva el id reservado»
- **Por qué el kit no lo evitó**: la regla nombra el prefijo `feature/` literal; un prefijo `patch/` o `hotfix/` sin id no está cubierto, aunque el propio `sdd-start-patch` dice que el carril no fija el tipo de rama
- **Coste**: ninguno en reloj; la inconsistencia de nombres entre el patch 0155 y este (respaldo: `patch.md` de los dos, campo `branch:`)
- **Propuesta**: la regla vale para cualquier rama de trabajo sin id (`<tipo>/<slug>`, sea `feature/`, `patch/` o `hotfix/`): se renombra a `<tipo>/<id>-<slug>` conservando el tipo
- **Verificada**: sí — contrastado con `skills/sdd-start-patch/SKILL.md:53` y `nombrado.md` (solo citan `feature/<slug>`)
- **Criterio de aceptación**: GIVEN un worktree en `patch/fix-x` sin commits propios y `ids.mode: sequence` · WHEN `sdd-start-patch` reserva el id 0200 · THEN la rama pasa a `patch/0200-fix-x` antes del primer commit y el mensaje lo dice

## Lo que hice por iniciativa propia

- **No reproduje el fallo ejecutándolo, porque reproducirlo era destructivo**: `sdd merge` sin argumentos fusiona la rama actual en `develop`. Confirmé el fallo en el código (`projectRoot: '.'` por defecto, sin guarda) y lo dejé escrito en `patch.md` §1. El paso 1 de `sdd-start-patch` pide reproducir un fallo y parar si no se reproduce, pero no dice qué hacer cuando la reproducción cambia el repo o algo compartido. Funcionó. Candidato a regla: si reproducir el fallo cambia algo fuera del worktree (fusiona, publica, borra), se confirma en el código o en un repo de fixture, y `patch.md` lo dice.
- **El RED de un verbo destructivo, contra un doble**: el test de `merge` sin argumentos llama a `run(['merge'])` con `mergeBranch` simulado (`vi.mock`). Sin el fix, el RED con el verbo real habría fusionado este worktree en `develop` desde la suite. Funcionó: el RED falló por la salida (0 en vez de 2), sin efectos. Candidato a regla en la referencia de tests del kit: el RED de un verbo que cambia el repo corre contra un doble o un repo temporal, nunca contra el directorio de trabajo.

## Funcionó, no tocar

- La variante de petición cerrada del paso 1: con la solución literal del dev-lead, el patch no pidió más preguntas que la fijada.
- `sdd capability merge` aceptó tres `ADDED` en el delta de un patch y `capability check` lo validó a la primera.
- `sdd merge --push` desde el worktree, con el cerrojo y el `pre-merge-commit`: fusionó y publicó en una orden.

## Menores

- Sin estimación previa y con el «Real» de §5 escrito a ojo; ya lo recoge la fila 0130 del roadmap — `skills/sdd-start-patch/SKILL.md`, `patch-template.md` §5
- Un patch de petición cerrada que a la vez añade (`--help`) y cambia (los dos rechazos) no sabe si va en `Added` o en `Changed`; lo puse en `Changed` — `skills/sdd-end-patch/SKILL.md` paso 3
- `sdd roadmap check` imprime unos noventa avisos de «Destino» de filas viejas antes de «Roadmap válido», y el cierre tiene que buscar si alguno es suyo — `cli/src/roadmap/warnings.ts`

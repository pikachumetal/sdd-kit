---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261026-111623-patch-0212-plan-workspace-temp
task: 0212
mode:
date: 2026-10-26
---

# Ticket para el kit — patch 0212: un rojo intermitente del gate de cierre no tiene camino en la receta del merge

## Contexto

- Carril y modo: patch (petición cerrada, `solution: dev-lead`)
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (CLI en TypeScript con Vitest, suite Pester, baterías en Bash); una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: 1,20 h frente a 0,5 h estimadas (+140 %)
- Coste en tokens: 5.943.611 tokens del hilo, 2,54 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Ante un rojo del gate de cierre en un fichero ajeno a la rama, no hice el contraste de la receta y repetí el gate entero

- **Qué pasó**: la primera pasada del gate de cierre dio `cli:test-min` 1480/1: `test/ids/claim.slow.test.ts`, `TypeError: Cannot read properties of undefined (reading 'trim')`. La receta pide contrastar el rojo con el mismo comando en un worktree separado de `<remote>/<merge.into>`. No lo hice: corrí ese fichero solo en la rama (29/29, 385 s) y repetí `cli:typecheck cli:test-slow cli:test-min` en la rama (en verde), y fusioné. La receta tiene dos salidas, «pasa sin la rama» y «falla también sin la rama», y ninguna para un rojo que en la rama pasa al repetirlo. Además, filtré la salida del gate con `Select-String` antes de ver el resultado, y se perdió el nombre del test que falló: la fila de deuda que abrí no lo lleva.
- **Fuente**: `patch.md` §4, caso 6 y §5 del patch 0212 (`specs/20261026-111623-patch-0212-plan-workspace-temp/patch.md`); `skills/sdd-archive/references/merge-recipe.md:17-20`; commit `48ca457a` (la fila de deuda en `roadmap.md`)
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md`, contraste de un rojo (líneas 17-20); `skills/sdd-archive/SKILL.md` paso 6
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. La leí como «rojo de la rama o rojo de la base», y un rojo que no se repite no encajaba en ninguna de las dos. La receta no dice qué hacer con un rojo intermitente ni pide guardar entera la salida del gate.
- **Coste**: 31 min (6 min del fichero solo y 25 min de la segunda pasada), respaldado en `patch.md` §5. Sin el nombre del test, la fila de deuda no se puede reproducir.
- **Propuesta**: una tercera salida en `merge-recipe.md`: «**No se repite**: la misma orden en la rama y en la base pasa. Cita el test, el error y las dos pasadas en una fila de deuda de intermitentes, y sigue». Una línea más antes del contraste: la salida del gate se guarda entera en el scratchpad antes de filtrarla.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un gate de cierre que da 1 rojo en un test que la rama no toca y que pasa al repetirlo WHEN el agente cierra con `sdd-archive` THEN corre la misma orden en un worktree separado de la base, abre una fila de deuda con el nombre del test y el error literal sacados de la salida guardada, y no fusiona hasta que el contraste en la base termina

### 2. La estimación del patch no contó el gate de cierre, que por sí solo pasaba del techo

- **Qué pasó**: estimé el patch en 0,5 h. El gate de cierre del repo tardó 33 min en su primera pasada; el fix y los registros, unos 15 min. El desvío (+140 %) sale entero del gate.
- **Fuente**: `patch.md` §5 del patch 0212; `.docs/sdd/tech-stack.md:32` (el gate de cierre); `sdd session tokens --path . --branch patch/0212-plan-workspace-temp` → `Esfuerzo real: 1,20 h`
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 2 («In a patch, if `.docs/sdd/estimation.md` exists, estimate it in hours»); `skills/sdd-templates/templates/patch-template.md` §5
- **Por qué el kit no lo evitó**: el paso pide la estimación en horas y nada recuerda que el cierre corre el gate completo. En un proyecto con suites lentas, el gate es la mayor parte del tiempo de un patch pequeño.
- **Coste**: 0,7 h de desvío, respaldado en `patch.md` §5; la calibración del log recibe un patch con el error del gate y no el del fix
- **Propuesta**: en el paso 2 de `sdd-propose`, la estimación de un patch suma la duración del gate de cierre, sacada de la última medida del proyecto o de su `Gate de cierre`. Alternativa: que `estimation.md` diga cómo contar el gate.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un proyecto cuyo gate de cierre tarda más de 30 min WHEN `sdd-propose` estima un patch de una línea THEN la estimación nombra el gate y su duración y es mayor que la duración del gate

## Lo que hice por iniciativa propia

- Lancé el gate de cierre en segundo plano después de que superara el límite de 600 s de la herramienta. Funcionó, y la sesión siguió con los registros mientras corría.
- Abrí una fila de deuda para el intermitente, aunque la receta solo la pide para el rojo que también falla sin la rama.

## Funcionó, no tocar

- `sdd id claim` con la fila ya publicada: «nada que publicar», sin preguntas.
- Probar el delta con `sdd capability merge` en una copia de `.docs/sdd` antes de tocar el repo, y la fusión real al cerrar: el mismo resultado.
- `sdd merge --sync` dijo «al día» y ahorró repetir la suite; `sdd merge --push` fusionó y publicó en una orden.
- La fila del roadmap con decisiones, ficheros y «sin texto de skill» ya escritos: el patch arrancó sin ninguna pregunta.

## Menores

- La fila del roadmap nombraba `compose-axis.mjs` entre los ficheros a tocar, pero solo lee un fichero del plugin superpowers, no el workspace; se dejó fuera con una decisión en `patch.md` — `skills/sdd-roadmap/SKILL.md` (los ficheros de una fila no se comprueban contra el código)
- El worktree no tenía `cli/node_modules`: `npx vitest` falló al cargar la config y hubo que correr `pnpm install`. El carril patch no pasa por `sdd-worktrees`, que prepara el entorno — `skills/sdd-start-patch/SKILL.md` (sin paso de entorno)

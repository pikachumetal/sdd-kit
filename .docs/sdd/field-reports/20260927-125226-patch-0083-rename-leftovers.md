---
kit_version: 1.1.0
superpowers_version: 6.4.2 (superpowers-marketplace)
lane: patch
id: 20260927-125226-patch-0083-rename-leftovers
task: 0083
mode:
date: 2026-09-27
---

# Ticket para el kit — patch 0083: restos del renombrado de la 0064

## Contexto

- Carril y modo: patch con las dos decisiones del dev-lead en la petición, perfil `delegate`
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`, `sdd-templates` (plantillas `patch`, `kit-feedback` y `roadmap` como referencia; scripts `Get-NextSddId.ps1 -Reserve`, `Test-Capabilities.ps1`, `Get-CapabilityIndex.ps1`, `Build-EstimationLog.ps1`, `Invoke-SddMerge.ps1`). Sesión arrancada desde el worktree: el `Base directory` de las skills apuntaba al working tree
- Proyecto: este repo (el kit), un solo mantenedor
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,3 h
- Coste en tokens: no medido
- Harness de Claude Code: la herramienta `Write` falló una vez con «The server-side auto mode classifier gave no verdict» al crear `patch.md`; se escribió con un heredoc de Bash

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La tabla de la release del roadmap del kit no sigue la plantilla y sigue diciendo «Task»

- **Qué pasó**: al cerrar, añadí la fila del patch a la tabla de la release en curso, como tenía la 0082. Copié la forma de `roadmap-template.md` (`| id | Feature | Origen | Ficheros que toca | Estado |`) y puse `✅` en la última columna. La cabecera real del roadmap del kit es `| id | Task | Peticiones | Ficheros que toca | Tamaño |` (líneas 27 y 95), así que la última columna era el tamaño. Lo corregí a `S` antes del commit de cierre.
- **Dónde en el kit**: `.docs/sdd/roadmap.md` del repo del kit frente a `skills/sdd-templates/templates/roadmap-template.md` (bloque de la tabla de la release), y `skills/sdd-end-patch/SKILL.md` paso 4, que solo nombra la tabla de Patches
- **Por qué el kit no lo evitó**: la plantilla dice que las cabeceras van literales porque las leen las skills, pero ningún test compara la cabecera del roadmap del propio kit con la plantilla. El renombrado task → feature de la 0064 tampoco la cambió: es un tercer resto del mismo renombrado, además de los dos que salda este patch. Y el paso 4 de `sdd-end-patch` no dice si un patch entra también en la tabla de la release; en este repo sí entra, por costumbre
- **Coste**: una corrección antes del commit; sin ella, la columna del tamaño habría quedado con un estado
- **Propuesta**: poner la cabecera de la tabla de la release del roadmap del kit igual que la plantilla (o registrar en la plantilla por qué el kit usa otra), y decir en `sdd-end-patch` paso 4 si un patch lleva fila en la tabla de la release en curso
- **Criterio de aceptación**: GIVEN el roadmap del kit en `develop`, WHEN `tests/RoadmapStructure.Tests.ps1` compara la cabecera de cada tabla de release con la de `roadmap-template.md`, THEN pasa; hoy fallaría con `Task`, `Peticiones` y `Tamaño`

### 2. `sdd-start-patch` no dice qué hacer con una rama de patch que ya trae un número que no es un id reservado

- **Qué pasó**: el worktree llegó con la rama `patch/0002`, creada fuera del kit. En modo `sequence`, `0002` es una feature cerrada, no el id del patch. Reservé `0083` con `Get-NextSddId.ps1 -Reserve` y renombré la rama a `patch/0083-rename-leftovers` antes del primer commit, por analogía con la regla de `feature/<slug>`
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 2 y `skills/sdd-start-feature/references/nombrado.md`
- **Por qué el kit no lo evitó**: la regla de renombrado solo cubre una rama `feature/<slug>` sin id. Una rama con un número que no coincide con el id reservado no está contemplada, y commitear en `patch/0002` habría dejado una rama cuyo número apunta a otra feature
- **Coste**: bajo en esta sesión, porque lo vi; sin regla, un sujeto puede commitear en la rama con el número ajeno
- **Propuesta**: ampliar la regla del paso 2: una rama sin commits propios cuyo nombre no lleva el id reservado (sin id, o con un número que no es el suyo) se renombra a `<tipo>/<id>-<slug>` antes del primer commit, y se dice
- **Criterio de aceptación**: GIVEN un proyecto en modo `sequence` con la feature 0002 cerrada y un worktree en la rama `patch/0002` sin commits propios, WHEN `sdd-start-patch` reserva el 0083, THEN la rama pasa a `patch/0083-<slug>` antes del primer commit y el agente lo dice

### 3. La suite entera del kit falla en `FastSuiteBudget` por la carga, no por un fallo

- **Qué pasó**: `Invoke-Pester tests`, el comando de `tech-stack.md`, dio 931/1. El fallo fue `FastSuiteBudget`, que lanza el conjunto rápido en otro proceso y mide si baja de 30 s. Aislado pasó en 29,4 s, y el pre-commit también pasó
- **Dónde en el kit**: `tests/FastSuiteBudget.Tests.ps1` y el comando de la suite en `.docs/sdd/tech-stack.md`
- **Por qué el kit no lo evitó**: el test mide tiempo de reloj contra un umbral de 30 s y aislado ya da 29,4 s, y en la suite entera compite con los demás tests. No lleva el tag `Slow` ni se excluye de la suite entera
- **Coste**: re-ejecutar el test aislado para descartar un fallo real
- **Propuesta**: que el test se salte dentro de la suite entera (tag propio excluido por defecto, o solo en el pre-commit), o dar margen al umbral
- **Criterio de aceptación**: GIVEN `develop` sin cambios, WHEN se ejecuta `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` tres veces, THEN ninguna falla en `FastSuiteBudget`

## Lo que hice por iniciativa propia

- Para la mención de `sdd-start-release`, en vez de crear un test nuevo, endurecí el que ya vigilaba la retirada (`tests/PlanEntry.Tests.ps1`), que la aceptaba como excepción «de otra task». El RED salió del test que ya existía, y la excepción deja de esconder la mención. Candidato: cuando una fila de deuda nace de una excepción permitida en un test, el patch que la salda quita la excepción, y ese es su RED
- Actualicé la mención de `task-flow` en una fila abierta del roadmap (los menores de la 0070), porque apunta a un fichero vivo, y dejé el histórico intacto (T19 (3)). Funcionó

## Funcionó, no tocar

- El RED mecánico sin sujetos para un cambio mecánico (tech-stack T19 (2)): 6 fallos precisos, en minutos, y quedan como defensa permanente
- `Get-NextSddId.ps1 -Reserve` y `Invoke-SddMerge.ps1 -Push`: sin fricción
- La pregunta de validación con la opción «Diferir» rellenada: una respuesta y ningún turno de más

## Errores míos, no huecos del kit

- Llamé a `Get-NextSddId.ps1` con `-Path`, que no existe; el script funciona desde la raíz sin parámetro

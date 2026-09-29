---
kit_version: 2.0.0 (sdd-kit.json); skills de la caché 2.1.0
superpowers_version: 6.4.2
lane: patch
id: 20260929-115542-patch-0106-session-tokens-tests-isolation
task: 0106
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0106: el merge de un cierre choca en los registros cuando varios cierres fusionan a la vez

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`
- Proyecto: el propio kit (PowerShell + Pester), un dev-lead con cinco worktrees cerrando a la vez
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,4 h, con el cierre incluido
- Coste en tokens: 3.592.870 del hilo (claude-opus-5-5), 1,78 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La cola de merges existe, pero el conflicto de registros se resuelve fuera de ella

- **Qué pasó**: cinco cierres (patches 0101 a 0104 y 0106) lanzaron `Invoke-SddMerge.ps1 -Push` en el mismo minuto. El cerrojo los puso en fila («Esperando el cerrojo de merge: lo tiene feature/0103…»). Cuando le tocó al 0106, `develop` ya traía las filas de los otros, y el script falló con `merge: conflicto en .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md.` Seguí la receta «Conflicto solo en los registros»: el merge de sincronización en el worktree, las dos filas del roadmap y el log regenerado. Después relancé el script una vez. Mientras yo resolvía, sin el cerrojo, otro cierre fusionó, y el reintento falló con `merge: conflicto en .docs/sdd/changelog.md, .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md.` La receta solo permite un reintento, así que el merge quedó pendiente para el dev-lead. Él lo resumió así: «estáis varias tareas intentando mergear... tenéis que hacer cola».
- **Dónde en el kit**: `skills/sdd-templates/scripts/Invoke-SddMerge.ps1` (lanza `merge: conflicto en` en la línea 155 y suelta el cerrojo) y `skills/sdd-end-feature/references/merge-recipe.md` §«Conflicto solo en los registros» (pasos 2 a 7: el merge a mano fuera del cerrojo y un solo reintento).
- **Por qué el kit no lo evitó**: el cerrojo pone en fila el merge, pero no la resolución. La resolución de un conflicto de registros es mecánica: la unión de filas nuevas en `roadmap.md` y `changelog.md`, y regenerar `estimation-log.md`. Aun así la hace el agente después de soltar el cerrojo, y con N cierres a la vez la ventana se vuelve a abrir en cada intento. El límite de un reintento convierte una carrera en una parada para el dev-lead.
- **Coste**: un merge pendiente y una intervención del dev-lead por cada cierre que pierde la carrera. Aquí, uno de cinco como mínimo.
- **Propuesta**: con el conflicto solo en los tres registros, `Invoke-SddMerge.ps1` lo resuelve dentro del cerrojo, en su worktree temporal. En `roadmap.md` y `changelog.md` entran las líneas añadidas por los dos lados (diff3). Si los dos lados tocaron la misma línea, aborta como hoy. `estimation-log.md` se regenera con `Build-EstimationLog.ps1`, que el script ya carga (`$script:LogBuilderPath`). La receta pasa a ser el caso residual: el mismo fichero o la misma línea.
- **Criterio de aceptación**: GIVEN dos ramas que añaden cada una una fila distinta a la tabla de patches de `roadmap.md` y a `[Unreleased]` de `changelog.md` · WHEN la primera se fusiona con `Invoke-SddMerge.ps1` y después se lanza la segunda · THEN la segunda se fusiona sin intervención, con las dos filas en cada fichero y el `estimation-log.md` regenerado. RED hoy: la segunda falla con `merge: conflicto en`.

### 2. El ticket de campo atribuyó una causa que el test ya había resuelto

- **Qué pasó**: la fila «Tres tests `Slow` … fallan en la máquina del dev-lead» llevaba la causa del ticket de la feature 0098 («el test lee el `HOME` real») y un fix propuesto («un `HOME` de fixture»). El test ya redirige `USERPROFILE`. La causa real era la codificación de la consola desde Git Bash, la misma de otra fila. El ticket no decía desde qué shell se corrió la suite.
- **Dónde en el kit**: `skills/sdd-templates/templates/kit-feedback-template.md` (sección «Hallazgos»: no pide el entorno de una medición).
- **Por qué el kit no lo evitó**: la plantilla no pide el shell ni el comando exacto con que salió un fallo de tests. Con ese dato, el triaje habría juntado las dos filas por causa y no solo por fichero.
- **Coste**: bajo. `systematic-debugging` lo descartó en minutos, pero la fila llevó al roadmap un fix que sobraba.
- **Propuesta**: cuando un hallazgo cita un fallo de tests, «Qué pasó» incluye el comando literal y el shell (PowerShell, Git Bash, la herramienta Bash del agente).
- **Criterio de aceptación**: GIVEN un sujeto que escribe un ticket con un test que falla solo desde Git Bash · WHEN rellena el hallazgo · THEN «Qué pasó» nombra el shell y el comando. RED: sin la frase, el sujeto describe el fallo sin el shell.

## Lo que hice por iniciativa propia

- En el primer conflicto, puse la fila del patch más reciente encima de la del otro. La receta dice que entran las dos, pero no dice en qué orden. Funcionó.

## Funcionó, no tocar

- La regla de `sdd-start-patch` paso 1 («si reproduce un fallo distinto del que predice el ticket… el patch sigue con el fallo medido»). Llevó a medir desde los dos shells antes de tocar nada, y las dos filas resultaron ser una sola causa.
- `Get-NextSddId.ps1 -Reserve` esperó el cerrojo de ids de otro worktree y dio un id libre sin choque.
- La opción de diferir con el uso y el dueño ya rellenos: el dev-lead contestó con un clic.

## Errores míos, no huecos del kit

- Ninguno detectado.

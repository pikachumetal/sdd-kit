---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: patch
id: 20260929-131536-patch-0107-merge-registry-union
task: 0107
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0107: el merge del cierre une los registros que solo añaden líneas

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback` (más `superpowers:systematic-debugging`)
- Proyecto: el propio repo del kit (PowerShell + Pester, skills en Markdown), una persona con varias sesiones en paralelo en worktrees; `sdd-kit.json` declara 2.0.0 y el working tree está en 2.1.0
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: no medido (del orden de 0,4 h hasta el commit del fix)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `merge-recipe.md` describe un script que ya no es el que hay

- **Qué pasó**: tras el patch, `Invoke-SddMerge.ps1` une dentro del cerrojo los conflictos de `roadmap.md` y `changelog.md` que solo añaden líneas y regenera el log. La receta sigue diciendo, en «El script hace» paso 3, que solo regenera `estimation-log.md`, y su sección «Conflicto solo en los registros» manda hacer a mano en el worktree de la feature una sincronización que ahora el script solo deja sin resolver cuando los dos lados cambiaron la misma línea, y ese caso la propia sección lo manda a una persona (paso 4). La capacidad `control-profiles` arrastra lo mismo: «Un merge del cierre que falla…» dice «conflicto que no es el del log» y «Un conflicto solo en los registros se resuelve con un merge de sincronización» describe el camino viejo. El dev-lead pidió no tocar la receta en el patch (Art. I), así que quedó desfasada.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, «El merge es un script» paso 3 y «Conflicto solo en los registros»; `.docs/sdd/capabilities/control-profiles.md`, los dos requisitos citados.
- **Por qué el kit no lo evitó**: ningún test une el comportamiento del script con el texto de la receta; un patch de script no obliga a mirar las referencias que lo describen.
- **Coste**: bajo hoy (la receta no manda nada incorrecto), pero un agente que la lea cree que un conflicto de filas nuevas en el roadmap todavía le toca a él y gasta un turno en buscarlo.
- **Propuesta**: feature o patch de skill con RED/GREEN que reescriba el paso 3 («un conflicto en los registros que solo añade líneas lo une; el log lo regenera») y reduzca «Conflicto solo en los registros» a «si el script falla con `merge: conflicto en` y la lista solo tiene registros, los dos lados cambiaron la misma línea: es de una persona». Actualizar los dos requisitos de la capacidad en el mismo cambio.
- **Criterio de aceptación**: GIVEN un agente en el paso de merge de `sdd-end-patch` cuyo script falla con `merge: conflicto en .docs/sdd/roadmap.md` porque los dos lados cambiaron la misma fila, WHEN sigue la receta, THEN no hace `git merge` de sincronización en el worktree de la feature y el cierre acaba en «No terminado» nombrando el conflicto. Hoy la receta le manda sincronizar primero.

### 2. La plantilla del patch no dice si su delta admite `ADDED`

- **Qué pasó**: el fix añadió un comportamiento observable (unir registros) que la capacidad no describía. `sdd-end-patch` paso 1 dice «Un patch no crea capacidades» y la ayuda de §6 de `patch-template.md` solo nombra `MODIFIED`. Escribí un `MODIFIED` y un `ADDED` de requisito dentro de una capacidad existente; `Test-Capabilities.ps1 -Artifact` lo aceptó, pero lo decidí sin respaldo escrito.
- **Dónde en el kit**: `skills/sdd-templates/templates/patch-template.md` §6; `skills/sdd-end-patch/SKILL.md` paso 1.
- **Por qué el kit no lo evitó**: «no crea capacidades» se puede leer como «no crea requisitos».
- **Coste**: una decisión tomada a ciegas; otro agente podría haber metido el requisito nuevo dentro del `MODIFIED`, mezclando dos comportamientos en uno.
- **Propuesta**: una frase en §6 de la plantilla: «Un patch no crea capacidades, pero puede añadir un requisito a una existente con `ADDED` si el fix introduce un comportamiento que ninguna describía.»
- **Criterio de aceptación**: GIVEN un patch cuyo fix añade un comportamiento observable nuevo a una pieza ya descrita por una capacidad, WHEN el agente cierra, THEN el delta lleva un `ADDED` en esa capacidad y no crea una capacidad nueva ni esconde el requisito dentro de un `MODIFIED`.

## Lo que hice por iniciativa propia

- Escribí también el caso negativo (misma fila cambiada por los dos lados) antes del fix y lo pasé en rojo y en verde: fijó el límite del arreglo. Funcionó.
- Fusioné con el script del working tree, que ya llevaba el fix: el cierre del patch fue la primera ejecución real del script nuevo (sin conflicto, así que no lo ejercitó).
- Pasé las suites que nombran el script (`GitEnvConvention`, `ControlProfiles`, `Test-Capabilities`) además de la suya, antes del commit.

## Funcionó, no tocar

- `Get-NextSddId.ps1 -Reserve` y la regla de renombrar la rama `feature/<slug>` sin commits propios a `feature/<id>-<slug>`.
- La instrucción del arranque «reprodúcela antes de tocar nada» junto con el paso 1 de `sdd-start-patch`: el RED en Pester dio el mensaje exacto del ticket.
- La parada de validación de `sdd-end-patch` con las tres opciones: la opción «Diferir» ya redactada se eligió sin turno extra.
- `Test-Capabilities.ps1 -Artifact` sobre el delta fusionado.
- `Invoke-SddMerge.ps1 -Push` con el hook `pre-merge-commit` como gate: fusión y push sin intervención.

## Errores míos, no huecos del kit

- La primera inserción en `changelog.md` no hizo nada: busqué el ancla con `\n` y el fichero tiene CRLF. Lo vi en el `git diff --stat` y lo repetí; en `roadmap.md` la fila nueva quedó con LF entre líneas CRLF (git lo normaliza).
- El paso 2 del guion de validación quedó mal redactado: mezclaba un `git stash push` innecesario con el `git checkout` del script anterior.

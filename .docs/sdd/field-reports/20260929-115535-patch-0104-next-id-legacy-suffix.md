---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: patch
id: 20260929-115535-patch-0104-next-id-legacy-suffix
task: 0104
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0104: con varios cierres a la vez, el conflicto en los registros vuelve en cada turno del cerrojo

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback` (servidas desde la caché 2.1.0; contrastadas con el working tree, solo difieren en la parte visual)
- Proyecto: el propio kit, con cinco worktrees cerrando patches en paralelo (0101, 0102, 0103, 0104 y 0106)
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: unos 25 minutos, el merge incluido
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La regla de «relanza una vez» no cabe en una cola de cierres: cada sesión que fusiona antes que tú vuelve a crear el conflicto

- **Qué pasó**: el primer `Invoke-SddMerge.ps1 -Push` esperó el cerrojo tras 0101 y 0103 y falló con `merge: conflicto en .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md`. Hice el merge de sincronización de la receta (dos filas nuevas en la tabla de patches, `estimation-log` regenerado) y relancé. El segundo intento esperó tras 0103, 0102 y 0106 y volvió a fallar, ahora con `merge: conflicto en .docs/sdd/changelog.md, .docs/sdd/estimation-log.md`: los patches que entraron mientras esperaba añadieron sus propias líneas a `### Fixed` y al log. La receta dice que un segundo fallo «es de una persona, aunque sea otra vez solo en los registros», así que el cierre quedó PENDIENTE y el dev-lead tuvo que decir «tenéis que hacer cola».
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, «Conflicto solo en los registros», pasos 2 y 7; `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`, que resuelve el conflicto fuera del cerrojo.
- **Por qué el kit no lo evitó**: el cerrojo serializa el merge, pero la resolución del conflicto de registros se hace en el worktree de la feature, **fuera** del cerrojo. Mientras la sesión resuelve y vuelve a hacer cola, otras sesiones fusionan y la base se mueve otra vez. Con N cierres en paralelo, el último puede chocar N−1 veces. «Relanza una vez» presupone que nadie más fusiona entre medias.
- **Coste**: un merge PENDIENTE y una intervención del dev-lead en una sesión que ya tenía la política `delegate` con `merge` completo y `push: true`. Pasó en una tarde con cinco patches, así que en el kit ya es un caso normal.
- **Propuesta**: que `Invoke-SddMerge.ps1` resuelva él mismo, **dentro del cerrojo** y en su worktree temporal, un conflicto cuyos ficheros sean todos registros: unión por líneas en `changelog.md` y `roadmap.md`, y `Build-EstimationLog.ps1` para `estimation-log.md`. Si los dos lados tocan la misma línea, que aborte como hoy. Otra opción, más barata: que la receta permita volver a sincronizar mientras cada fallo sea solo en registros y la base haya cambiado desde el intento anterior, porque así el bucle avanza y termina cuando se vacía la cola.
- **Criterio de aceptación**: GIVEN dos ramas que parten de la misma `develop` y añaden cada una una fila a `## Patches` y una línea a `### Fixed`, WHEN la primera se fusiona con `Invoke-SddMerge.ps1` y después se lanza el script sobre la segunda, THEN la segunda se fusiona sin conflicto, con las dos filas y las dos líneas en `develop`, sin que nadie resuelva a mano. Hoy ese test falla con `merge: conflicto en .docs/sdd/changelog.md, .docs/sdd/roadmap.md`.

## Lo que hice por iniciativa propia

- Reservé el id del patch con el script que el propio patch arreglaba, ya con el fix aplicado, para comprobarlo sobre el repo real (salió `0104`, sin aviso, porque el kit no tiene carpetas con sufijo). Funcionó.
- En el merge de sincronización, ordené las dos filas nuevas de `## Patches` por timestamp de carpeta, la más reciente arriba, como el resto de la tabla. La receta dice que entran las dos pero no en qué orden.

## Funcionó, no tocar

- El hook de pre-commit con la suite rápida: detectó en cada commit que todo seguía verde (794) sin pedirlo.
- `Invoke-SddMerge.ps1` ante el fallo: `develop` quedó intacta (`c4a39bd8`), sin worktree `merge-*` huérfano y con un mensaje que nombra los ficheros en conflicto.
- El aviso de espera del cerrojo, que dice qué rama y qué worktree lo tienen: con él se vio enseguida que el problema era la cola.

## Errores míos, no huecos del kit

- El primer `git commit -F -` con un here-string de PowerShell no pasó el mensaje por stdin y git lo tomó como pathspec. Lo repetí con `-m $msg`.
- Escribí el bloque «Capacidades» de `patch.md` con texto libre en vez de la forma `cambia «<requisito>»` de `sdd-end-patch` paso 1. Lo corregí antes de pasar `Test-Capabilities.ps1`.

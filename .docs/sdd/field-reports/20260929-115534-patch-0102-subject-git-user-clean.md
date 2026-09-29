---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: patch
id: 20260929-115534-patch-0102-subject-git-user-clean
task: 0102
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0102: con varias sesiones cerrando a la vez, el merge no hace cola y el cierre se queda sin fusionar

## Contexto

- Carril y modo: patch, perfil `delegate`, validación diferida.
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`, cargadas desde la caché 2.1.0 y contrastadas con las de la rama. Scripts: `Get-NextSddId.ps1 -Reserve`, `Test-Capabilities.ps1`, `Build-EstimationLog.ps1` e `Invoke-SddMerge.ps1`.
- Proyecto: el propio kit (skills en Markdown, Pester y el arnés headless); una persona (dev-lead) más el agente, con otras tres sesiones cerrando patches en paralelo en otros worktrees.
- Modelo del hilo: Opus 5.5.
- Modelos de los subagentes: no aplica.
- Coste en reloj: ~1 h (fix ~0,6 h; cierre y los dos merges fallidos ~0,4 h).
- Coste en tokens: no medido.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El conflicto en los registros suelta el cerrojo del merge, y con varias sesiones el cierre no llega a fusionar

- **Qué pasó**: cuatro sesiones (patches 0101, 0102, 0103 y otra) cerraban a la vez. `Invoke-SddMerge.ps1` esperó el cerrojo tras tres de ellas (lo avisó bien, con rama, worktree y PID). Cuando le tocó el turno, falló con `merge: conflicto en .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md.`: dos filas nuevas contiguas en la tabla de patches y el log regenerado por las dos ramas. Seguí «Conflicto solo en los registros» de `merge-recipe.md`: hice el merge de sincronización en el worktree del patch, uní las filas y regeneré el log. Mientras tanto entró el 0103 en `develop`, y el único relanzamiento que permite la receta falló igual, ahora también en `changelog.md`. El cierre acabó en «No terminado» y el merge quedó para el dev-lead, que lo resumió así: «estáis varias tareas intentando mergear… tenéis que hacer cola».
- **Dónde en el kit**: `skills/sdd-templates/scripts/Invoke-SddMerge.ps1` (el `finally` hace `Exit-SddLock` también cuando `Invoke-FeatureMerge` falla por conflicto) y `skills/sdd-end-feature/references/merge-recipe.md`, § «Conflicto solo en los registros», pasos 2 y 7. Lo usan tanto `sdd-end-patch` paso 6 como `sdd-end-feature` paso 10.
- **Por qué el kit no lo evitó**: el cerrojo solo cubre el intento de merge, no la resolución. La sincronización se hace a mano y fuera del cerrojo, así que cualquier sesión que esté en la cola entra antes y vuelve a mover la base. Con N sesiones cerrando a la vez, el conflicto de los registros es casi seguro, porque todas añaden una fila a la tabla de patches, una entrada en `[Unreleased]` y una fila al log. Además, «relanza una vez» convierte una carrera en trabajo para una persona.
- **Coste**: dos merges fallidos, un merge de sincronización que no sirvió, el cierre sin terminar y un turno del dev-lead. En la feature 0099 §1 pasó lo mismo con un solo competidor.
- **Propuesta** (sin verificar): que `Invoke-SddMerge.ps1` resuelva el conflicto de los registros dentro del cerrojo, sin soltarlo. Si todos los ficheros en conflicto son `changelog.md`, `roadmap.md` o `estimation-log.md`, y cada trozo en conflicto solo añade líneas por los dos lados (ninguna línea de la base se modifica ni se borra), toma la unión de las líneas añadidas, primero las de la rama destino, y regenera `estimation-log.md` con `Build-EstimationLog.ps1`. Si algún trozo modifica una línea común, falla como hoy. Así el merge de sincronización a mano y la regla de relanzar una vez dejarían de hacer falta en el caso común. Alternativa más barata: que el script haga la sincronización en el worktree de la rama, también dentro del cerrojo, y pare solo si queda un trozo que no sea una unión pura.
- **Criterio de aceptación**: GIVEN dos ramas que añaden cada una una fila distinta en la misma posición de la tabla de patches de `roadmap.md` y una entrada en `[Unreleased]` de `changelog.md`, y la primera ya está fusionada en `develop`, WHEN la segunda llama a `Invoke-SddMerge.ps1`, THEN el merge termina sin intervención, con las dos filas y las dos entradas, `estimation-log.md` regenerado y el cerrojo sin soltar entre el conflicto y el commit. Y GIVEN un trozo en el que las dos ramas modifican la misma fila, THEN falla con `merge: conflicto en` como hoy.

### 2. Una propuesta del ticket pasa a la fila del roadmap como «Destino» sin verificar, otra vez (tercer caso)

- **Qué pasó**: la fila de deuda que originó este patch copiaba en «Destino» la propuesta del ticket de la feature 0099 §1: «el `pre-commit` ejecuta `SubjectOutputPrivacy.Tests.ps1` cuando el commit toca salidas de sujetos». El propio ticket decía «no sé por qué no lo marcó». El paso 1 de `sdd-start-patch` midió que el `pre-commit` ya ejecuta ese test (no lleva la etiqueta `Slow`). El fallo real era otro: `pwsh -NoProfile` lanzado desde `sh` arranca con `[Console]::OutputEncoding` en `ibm437`, un `user.name` con tilde llega corrupto y el test pasa con la fuga dentro.
- **Dónde en el kit**: `skills/sdd-templates/templates/kit-feedback-template.md` (campo «Propuesta») y `skills/sdd-roadmap/SKILL.md` (cómo se escribe «Destino» al triar). Es la fila de deuda «La propuesta o la cifra de un ticket entra en el roadmap como decidida sin estar verificada» (tickets de los patches 0081 y 0084).
- **Por qué el kit no lo evitó**: esa fila sigue abierta. La plantilla todavía no pide `Verificada:` ni `Sin verificar`, y el triaje la copió como decisión.
- **Coste**: bajo aquí, porque el paso 1 lo cazó. Sin él, habría salido un cambio inútil en el hook y la fuga habría seguido pasando el `pre-commit`.
- **Propuesta**: la de esa fila, sin cambios. Este caso suma un tercer reporte.
- **Criterio de aceptación**: el de esa fila. GIVEN un ticket cuya propuesta dice «Sin verificar», WHEN `sdd-roadmap` la tría a una fila, THEN «Destino» conserva la marca y no se presenta como decisión.

## Lo que hice por iniciativa propia

- **Reproducir el fallo de privacidad en el entorno exacto del hook, con el dato real y sin commitearlo**: dejé un fichero sin commitear en `specs/zz-leak-probe/red/` con el `user.name` real y lancé el test como lo lanza `.githooks/pre-commit` (`pwsh -NoProfile` desde `sh`). Pasó 7/0; desde la sesión de PowerShell con perfil, falló. Fue lo que destapó la codificación como causa, y después cazó que mi primera versión del helper dejaba el test en `Skipped`. Candidato a regla en `sdd-start-patch` paso 1 o en `tech-stack.md`: un fallo que «solo salta en un hook» se reproduce lanzando el hook, no la suite desde la sesión, porque la consola y el perfil cambian el resultado.
- Comprobé que ningún commit llevaba el nombre, con `git diff --cached | grep -cF "$(git config user.name)"` antes de cada commit.

## Funcionó, no tocar

- `sdd-start-patch` paso 1, «si reproduce un fallo distinto, el patch sigue con el fallo medido»: permitió descartar parte de la propuesta sin abrir una feature ni parar.
- La regla de renombrar la rama `feature/<slug>` sin id a `feature/<id>-<slug>` antes del primer commit, junto con `Get-NextSddId.ps1 -Reserve`.
- El aviso del cerrojo de `Invoke-SddMerge.ps1` («lo tiene <rama> (<worktree>, PID) desde <hora>»): dejaba claro por qué esperaba.
- La receta de «Conflicto solo en los registros» para resolver cada trozo (la unión de las filas y el log regenerado, no editado) fue correcta; lo que falla es que se aplica fuera del cerrojo (hallazgo 1).

## Errores míos, no huecos del kit

- El helper de los tests restauraba las variables de entorno con `[Environment]::SetEnvironmentVariable($name, $null)`. PowerShell pasa `""`, `GIT_CONFIG_GLOBAL` quedaba vacía, git dejaba de leer la config global y el test del nombre acababa en `Skipped`, que el resumen cuenta como pasado. Ya existía `Restore-GitEnv`, que lo hace bien, y debí reutilizarlo desde el principio.

---
kit_version: 2.0.0 (sdd-kit.json; skills servidas desde la caché 2.1.0, contrastadas con el working tree)
superpowers_version: 6.4.2
lane: patch
id: 20260929-120248-patch-0105-capabilities-delta-applied
task: 0105
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0105: el cierre no llega al merge cuando varias sesiones cierran a la vez

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback` (con `superpowers:systematic-debugging` implícito en el paso 1)
- Proyecto: el propio repo del kit (PowerShell + Pester, una persona con seis sesiones en paralelo)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,6 h hasta el primer intento de merge; el merge sigue pendiente
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El cerrojo pone los merges en cola, pero el conflicto en los registros se resuelve fuera de la cola

- **Qué pasó**: seis sesiones cerraban patches a la vez (0101, 0102, 0103, 0104, 0105 y 0106): cinco merges en develop entre las 13:56 y las 14:00, casi todos precedidos de un `Merge branch 'develop' into feature/…`. `Invoke-SddMerge.ps1` esperó el cerrojo detrás de la 0103 y falló con `merge: conflicto en .docs/sdd/changelog.md, .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md.` Hice el merge de sincronización de la receta: filas distintas en cada lado, sin conflicto real. Al relanzar, el script esperó detrás de la 0104, la 0106 y la 0102 y volvió a fallar en los mismos tres ficheros. La receta dice que un segundo fallo es de una persona, así que el cierre acabó en «No terminado». El dev-lead: «sois varios intentando terminar... tenéis que hacer cola».
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md` §«Conflicto solo en los registros» (pasos 2 y 7), que usa también el paso 6 de `sdd-end-patch`; y `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`, que ya regenera `estimation-log.md` dentro del cerrojo, pero no `changelog.md` ni `roadmap.md`.
- **Por qué el kit no lo evitó**: la cola existe (el cerrojo de `SddLock.ps1` ordena los merges), pero el script suelta el cerrojo al fallar, y la sincronización se hace fuera de él, en el worktree de la feature. Mientras la sesión espera su siguiente turno, las demás vuelven a tocar los registros, así que el segundo intento parte de una base vieja otra vez. Cuantas más sesiones cierran a la vez, menos probable es que el reintento único llegue a tiempo. Todos los conflictos fueron de la forma que la receta ya sabe resolver: líneas nuevas o filas distintas en cada lado.
- **Coste**: dos esperas de cerrojo, un merge de sincronización hecho a mano y el cierre sin terminar. Lo mismo, multiplicado, en cada sesión que llega tarde a la cola.
- **Propuesta**: que `Invoke-SddMerge.ps1` resuelva el conflicto en los registros dentro de su turno, con el cerrojo tomado, igual que ya hace con `estimation-log.md`. Por cada trozo en conflicto de `changelog.md` y `roadmap.md`, compararía cada lado con la base (diff3). Si los dos lados cambian líneas distintas, se queda cada línea con su cambio y las nuevas de los dos. Si tocan la misma línea, falla como hoy. Así la cola sería de verdad: el que tiene el turno termina. El `git merge` a mano de la receta desaparece.
- **Criterio de aceptación**: GIVEN dos ramas que añaden cada una una entrada `Fixed` en el mismo sitio del changelog y una fila en la tabla de Patches, y cierran una fila de deuda distinta cada una en filas contiguas. WHEN se fusiona la primera y después la segunda con `Invoke-SddMerge.ps1`. THEN la segunda se fusiona sin intervención, con las dos entradas, las dos filas de patch y los dos prefijos de cierre, sin duplicar filas. Y con las dos ramas cambiando la misma fila, falla con `merge: conflicto en .docs/sdd/roadmap.md`.

### 2. `FastSuiteBudget` falla dentro de la suite completa y pasa suelto (2.º ticket)

- **Qué pasó**: la suite completa dio 1052 en verde y 1 en rojo: `FastSuiteBudget`, con 35,5 s frente a los 30 del umbral, culpando a `SubjectOutputPrivacy.Tests.ps1` (11,3 s). Suelto pasó a la primera. Es el mismo caso que el hallazgo 1 del ticket del patch 0103, el mismo día y con otras sesiones corriendo suites en paralelo.
- **Dónde en el kit**: `tests/FastSuiteBudget.Tests.ps1` y `tests/SubjectOutputPrivacy.Tests.ps1`.
- **Por qué el kit no lo evitó**: ver el ticket del patch 0103 §1.
- **Coste**: ~1 min en repetirlo y una nota en `patch.md` §4 para explicar el rojo.
- **Propuesta**: la del ticket del patch 0103 §1. Este ticket es el segundo para el triaje.
- **Criterio de aceptación**: el del ticket del patch 0103 §1.

### 3. La propuesta de la fila no cazaba el fallo que la originó

- **Qué pasó**: la fila del roadmap (triaje del 2026-09-29) pedía que `-Artifact` fallara nombrando el título ADDED o MODIFIED «que no está en su capacidad». Un `MODIFIED` conserva su título, porque es la clave de fusión, y sin fusionar el requisito viejo sigue ahí con ese título. Solo mirando el título, el caso del ticket (dos `MODIFIED` sin aplicar) habría pasado. El patch compara también las líneas de escenario, y lo registra como decisión tomada sin el dev-lead.
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, en el triaje de un ticket de campo que redacta la propuesta de la fila. No he localizado un paso que pida contrastar la propuesta con el criterio de aceptación del ticket.
- **Por qué el kit no lo evitó**: el triaje copia la propuesta del ticket («que compruebe que cada título existe»), y nada le pide comprobar si esa propuesta satisface el criterio de aceptación del mismo ticket («si no se aplicó, el validador falla»).
- **Coste**: bajo en este caso: lo detectó el paso 1 de `sdd-start-patch`. Sin él, el patch habría cerrado la fila con un validador que no caza el fallo.
- **Propuesta**: en el triaje, la celda de acción de una fila «Actuar» se contrasta con el criterio de aceptación del ticket, y si no lo cumple, se dice en la celda.
- **Criterio de aceptación**: GIVEN un ticket cuya propuesta no satisface su propio criterio de aceptación (este §3 del ticket de la feature 0027 de document-manager). WHEN `sdd-roadmap` lo tría. THEN la fila dice qué parte del criterio no cubre la propuesta.

## Lo que hice por iniciativa propia

- Ejecuté el validador nuevo con `-Artifact` sobre los 12 artefactos más recientes del repo para buscar falsos positivos. Salió uno real: `capabilities/feature-flow.md` dice «el segundo sha» en «El cierre no repite la revisión final de Native», y el delta de la 0091 no lo dice. Alguien lo editó después sin delta. Funcionó: separa los requisitos que modificó una feature posterior (lo esperado) de una deriva real. Es candidato a paso de un cambio en un validador: ejecutarlo sobre los artefactos reales antes de cerrar.
- Ejecuté `-Artifact` sobre el propio `patch.md` antes de fusionar su delta, para ver al validador cazar el delta sin aplicar sobre datos reales. Después de fusionar, pasó.

## Funcionó, no tocar

- `Get-NextSddId.ps1 -Reserve` junto con el renombrado de la rama `feature/<slug>` sin commits a `feature/0105-<slug>` (paso 2 de `sdd-start-patch`).
- El paso 1 de `sdd-start-patch` («la causa la determina tu investigación») llevó a ver que la propuesta de la fila no bastaba (hallazgo 3).
- El paso 0 de `sdd-end-patch` con las tres opciones: diferir con uso y dueño rellenos costó un turno.
- La receta del conflicto en los registros, en su primer intento: la regla de que cada fila se queda con su cambio se aplicó sin dudas.

## Errores míos, no huecos del kit

- Pasé un here-string de PowerShell a `git commit -F -` con `;` delante, y git lo tomó como pathspec. Tuve que repetirlo con un heredoc de bash.
- Edité el test Pester con Python, y un `\r\n` dentro de una expresión regular se escribió como un salto de línea real. Tuve que corregirlo con `Edit`.

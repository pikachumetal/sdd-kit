---
id: 20261008-132135-patch-0155-merge-append-only-and-locked-files
task: 0155
title: Patch — Invoke-SddMerge.ps1 une lo que solo añaden los dos lados y nombra el fichero bloqueado
type: patch
solution: dev-lead
status: done
created: 2026-10-08
branch: patch/merge-append-only-and-locked-files
commit: <hash>
---

# Patch 0155 — Invoke-SddMerge.ps1 une lo que solo añaden los dos lados y nombra el fichero bloqueado

## Capacidades

- Modificadas: `control-profiles` — el merge del cierre une lo que solo añaden los dos lados en cualquier fichero, y un fichero bloqueado en la verificación sale como `bloqueado:`

## 1. Síntoma

Ticket de la feature 0091 de document-manager (`field-reports/20261005-211707-feature-0091-spike-repintado-rapido.md` §3, en `develop`; fila de deuda «El merge para ante un conflicto en ficheros donde los dos lados solo añaden líneas»): «`Invoke-SddMerge.ps1` falló con `merge: conflicto en .cspell/custom-words.txt, .docs/sdd/changelog.md, .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md, .docs/sdd/tech-stack.md.`». Dos spikes añadían «Aprendizajes de…» al final de `tech-stack.md` y una palabra al diccionario.

Ticket de la feature 0093 de document-manager (`field-reports/20261006-205241-feature-0093-repintado-rapido.md`, menores; fila de deuda «`Invoke-SddMerge.ps1` da `verificación:` cuando un fichero está bloqueado por otro proceso»): «La verificación de `Invoke-SddMerge.ps1` falló porque una API levantada desde el checkout principal […] bloqueaba una DLL del build. El script da `verificación:`, como si el código estuviera en rojo, sin distinguir un fichero bloqueado por otro proceso.»

## 2. Solución fijada

Dev-lead, 2026-10-08 (petición cerrada del hotfix): «1. Un conflicto en el que los dos lados solo añaden líneas, sin tocar las existentes, se resuelve quedándose con las dos adiciones; «misma línea → persona» sigue igual. Criterio: dos features que añaden cada una una sección al final del mismo documento y una palabra a .cspell/custom-words.txt cierran sin parar al dev-lead. […] 2. Si la verificación falla porque un fichero está bloqueado por otro proceso, el script lo dice como tal (fichero y proceso si se puede), distinto de `verificación:` de código en rojo.»

Lo que da por existente, comprobado: `Resolve-RegistryConflicts` solo entraba si todos los ficheros en conflicto eran `roadmap.md`, `changelog.md` o `estimation-log.md`, y `Merge-AddedLines` ya unía los trozos diff3 con la base vacía. `Invoke-Verification` lanzaba `verificación: código de salida` ante cualquier salida distinta de 0.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`
  - `tests/Invoke-SddMerge.Tests.ps1`
- **Cambio**: `Resolve-AddOnlyConflicts` (antes `Resolve-RegistryConflicts`) aplica `Merge-AddedLines` a cualquier fichero en conflicto, no solo a los registros; `estimation-log.md` se sigue regenerando. `Find-LockedFile` busca en la salida del gate el mensaje de fichero en uso de .NET/MSBuild (inglés y castellano) o el `EBUSY` de Node, y el script falla con `bloqueado: '<fichero>' lo tiene abierto <proceso>` (el que nombra MSBuild con `locked by:`, u «otro proceso»).
- **Decisiones**:
  - Las dos adiciones quedan en el orden de la rama destino y después la rama, el del patch 0107 — sin el dev-lead
  - Un fichero que los dos lados crean (sin versión en la base, add/add) no se une: no hay líneas existentes que respetar y concatenar dos versiones de un fichero nuevo no es «añadir»; tampoco un binario, que no lleva marcas — sin el dev-lead
  - El proceso sale de la salida del gate (MSBuild lo nombra en MSB3026/MSB3027), sin consultar al sistema operativo; si no lo nombra, «otro proceso» — sin el dev-lead
  - El prefijo es `bloqueado:`, con la ruta del log como en `verificación:` — sin el dev-lead

Ninguna decisión cambia lo que el usuario ve o puede hacer más allá de lo fijado: son del cómo.

Sin tocar, por la congelación de la 0121: `merge-recipe.md` sigue diciendo que el script une solo los tres registros. Ya lo recoge la fila 0048 del roadmap.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: dos ramas añaden una sección al final de `README.md` y una palabra al final de `.cspell/custom-words.txt` | ❌ antes: `merge: conflicto en .cspell/custom-words.txt, README.md.` · ✅ ahora: fusiona las dos, con las dos secciones y las dos palabras en orden |
| 2 | dos ramas crean `nuevo.txt` con contenido distinto | ✅ antes y ahora: `merge: conflicto en … nuevo.txt` |
| 3 | «misma línea → persona»: las dos ramas cambian la misma fila de `roadmap.md`, y `README.md` reescrito por los dos lados | ✅ siguen fallando con `merge: conflicto en` |
| 4 | RED: el gate escribe en un fichero abierto en exclusiva por el proceso del test | ❌ antes: `verificación: código de salida 1` · ✅ ahora: `bloqueado: '…\App.dll' lo tiene abierto otro proceso` |
| 5 | RED: salida MSB3026 con `The file is locked by: "App.Api (4242)"` | ❌ antes: `verificación:` · ✅ ahora: `bloqueado: 'bin\App.dll' lo tiene abierto App.Api (4242)` |
| 6 | `tests/Invoke-SddMerge.Tests.ps1` completo | ✅ 27/0 |

Los casos los verificó el agente.

Validación en campo: 2026-10-08 · RED/GREEN en Invoke-SddMerge.Tests.ps1 (4 casos nuevos, 27/0)

## 5. Tiempo (ligero)

- Real: 0,5h

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**MODIFIED — El merge del cierre parte de la rama destino publicada**
- GIVEN una rama destino con remoto que avanzó después de abrir la feature
- WHEN el cierre fusiona
- THEN antes de fusionar la feature, integra en la rama destino local los commits del remoto
- AND si en cada fichero en conflicto cada trozo solo añade líneas por los dos lados, los une (primero la rama destino) y regenera `estimation-log.md` con `Build-EstimationLog.ps1`; con cualquier otro conflicto, falla con la lista de ficheros

**MODIFIED — El merge del cierre une los registros que solo añaden líneas**
- GIVEN dos ramas desde la misma rama destino que añaden cada una una fila a `roadmap.md`, una línea a `changelog.md`, una sección al final de otro documento o una palabra a `.cspell/custom-words.txt` en el mismo sitio, y la primera ya se ha fusionado
- WHEN el cierre de la segunda ejecuta `Invoke-SddMerge.ps1`
- THEN el script resuelve el conflicto dentro del cerrojo, en su worktree: deja las líneas de la rama destino y después las de la rama, regenera `estimation-log.md` y fusiona sin intervención
- AND si en algún trozo los dos lados cambian una línea que ya existía, o los dos crean el mismo fichero, aborta y falla con `merge: conflicto en` y la lista de ficheros, sin tocar la rama destino

**MODIFIED — Un merge del cierre que falla deja la rama destino como estaba**
- GIVEN un merge del cierre que falla: conflicto que no es el del log, verificación en rojo, push rechazado o error de git
- WHEN el script termina
- THEN la rama destino local vuelve al commit que tenía antes de fusionar la feature; no se empuja nada; el worktree temporal se ha retirado y el cerrojo está libre
- AND el script sale con error y nombra el paso que falló y el motivo
- AND si un hook rechaza el merge y no hay ficheros en conflicto, el motivo es `verificación: el hook rechazó el merge.` seguido de las últimas 20 líneas de la salida del hook, no un conflicto
- AND si la verificación falla porque un fichero lo tiene abierto otro proceso, el motivo es `bloqueado: '<fichero>' lo tiene abierto <proceso>` (el que nombre la salida del gate, u «otro proceso») y la ruta del log, no `verificación:`

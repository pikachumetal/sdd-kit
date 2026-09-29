---
id: 20260929-170203-patch-0112-merge-push-no-remote
task: 0112
title: Patch — Invoke-SddMerge.ps1 -Push sin remoto fusiona en local y avisa
type: patch
status: done
created: 2026-09-29
branch: feature/0112-merge-push-no-remote
commit: <hash>
---

# Patch 0112 — Invoke-SddMerge.ps1 -Push sin remoto fusiona en local y avisa

## Capacidades

- Modificadas: `control-profiles` — con `-Push` y sin remoto, el merge del cierre fusiona en local y avisa en vez de fallar

## 1. Síntoma

Fila de deuda «`Invoke-SddMerge.ps1 -Push` aborta sin remoto». La reportan tres tickets de un proyecto del equipo: [feature 0026](../../field-reports/20260928-105000-feature-0026-interfaz-y-pestanas.md) §5, [patch 0031](../../field-reports/20260929-143151-patch-0031-estilo-neutral-pierde-relleno.md) §2 y [feature 0032](../../field-reports/20260929-153416-feature-0032-subir-signalr.md) §1. Con perfil `delegate`, `merge.push: true` y una rama destino sin remoto, el cierre pasa `-Push` y el script falla antes de fusionar:

```text
push: no hay remoto configurado para 'develop'.
```

El cierre tiene que relanzarlo sin `-Push`.

Reproducido en Pester antes del fix, con el test reescrito a lo esperado: el script sale con código 1 y `develop` no cambia.

## 2. Causa raíz

`Assert-PushableRemote` (`Invoke-SddMerge.ps1:135-139` antes del fix) se llamaba en la línea 246, justo después de resolver el remoto y antes de `Sync-BaseBranch` y del merge. Con `-Push` y sin remoto, lanzaba `push:`. El test «con -Push y sin remoto falla con push: en vez de saltarse el push» fijaba esa conducta. La receta (`merge-recipe.md` §Push) se apoyaba en ella: «no se pasa `-Push` (el script fallaría con `push:` antes de fusionar)». Esa excepción quedaba fuera de las reglas numeradas, así que los agentes aplicaban la regla 3 y pasaban `-Push`. Los tres tickets lo confirman.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`, `tests/Invoke-SddMerge.Tests.ps1`, `skills/sdd-end-feature/references/merge-recipe.md`, `tests/merge-push-no-remote-red.md`, `tests/merge-push-no-remote-green.md`
- **Cambio**: el script ya no tiene `Assert-PushableRemote`. Con `-Push` y sin remoto, fusiona en local y acaba con `push: no hecho: sin remoto` y salida 0. La receta dice que `-Push` se decide igual sin remoto y que el mensaje final cita esa línea. Es una edición de skill, con su RED/GREEN (Art. I), autorizada por el dev-lead en la sesión.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Test «con -Push y sin remoto fusiona en local y avisa de que no hay push», antes del fix | ❌ `Expected 0, but got 1` (reproducido) |
| 2 | El mismo test tras el fix: salida 0, `Fusionado feature/0001 en develop`, `push: no hecho: sin remoto`, `feature/0001` ancestro de `develop`, sin restos | ✅ |
| 3 | `tests/Invoke-SddMerge.Tests.ps1` completo | ✅ 21/21 |
| 4 | RED/GREEN de la receta ([red](../../../../tests/merge-push-no-remote-red.md), [green](../../../../tests/merge-push-no-remote-green.md)): cierre con `delegate`, `merge.push: true` y sin remoto | ✅ 2/2 sujetos Sonnet (0,73 $): `-Push` en una sola ejecución, sin `git push` a mano, y la línea de terminado cita `push: no hecho: sin remoto` (RED 0/3) |

Lo verificó el agente; el dev-lead no lo ha probado todavía.

## 5. Tiempo (ligero)

- Real: 0,8 h

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**MODIFIED — El push del cierre publica la rama destino**
- GIVEN un merge del cierre cuyo push ha confirmado una persona o autoriza `merge.push` (perfil `delegate` o `unattended`)
- WHEN el script empuja
- THEN empuja la rama destino por su nombre (`git push <remoto> <destino>`), nunca `HEAD:<destino>`, y al terminar la rama local y la remota apuntan al mismo commit
- AND sin la confirmación ni `merge.push`, el script fusiona en local y no empuja
- AND si la rama destino no tiene remoto, el script fusiona en local, no empuja y acaba con `push: no hecho: sin remoto`, que el mensaje final del cierre cita

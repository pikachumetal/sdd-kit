---
id: 20260923-173026-patch-0043-fast-pre-commit
task: 0043
title: Patch — pre-commit rápido con los tests lentos marcados
type: patch
status: done
created: 2026-09-23
branch: feature/0043
commit: <hash>
---

# Patch 0043 — pre-commit rápido con los tests lentos marcados

## 1. Síntoma

Del dev-lead, literal: «el pre-commit de este repo tarda ~5 min porque corre 409 tests, incluidos los que crean repos de git y lanzan procesos (script de ids, cerrojo del merge, rutas con tildes); eso es inaceptable en cada commit.» Pide medir la duración por fichero, marcar con `-Tag Slow` lo que cree repos, lance procesos o espere, dejar el pre-commit por debajo de 30 s con `-ExcludeTagFilter Slow`, que el `pre-merge-commit` corra la suite entera, un test que falle si el conjunto rápido pasa de un umbral y diga qué fichero marcar, y actualizar la regla de `tech-stack.md`.

A mitad del patch el dev-lead acotó dos cosas (citas con las erratas de tecleo corregidas): «sabes lo que va a pasar si haces lo de merge rápido y push lento... que te pediré merge y haré el push yo ... los test los tiene tú que probar al final de la tarea si acaso ... pero no pueden estar en el commit», y «lo de marcar test en slow tiene que quedar documentado para que a partir de ahora se hagan además tendríamos que tener la deuda de revisar los test porque no tengo nada claro que necesitamos ~ 400 test en un set de skills». Con eso, el `pre-merge-commit` **no** pasa a correr la suite entera: sigue delegando en `pre-commit`.

## 2. Causa raíz

Medido con `Invoke-Pester -PassThru` sobre `tests/` completo en `1f1682b`: **267 s, 415 tests**. `Invoke-SddMerge.Tests.ps1` se lleva 197 s y ya llevaba `-Tag 'Slow'` desde el commit `006331b`, así que el hook de ese momento no tardaba ~5 min sino **~70 s**. Casi todo ese tiempo era de `Get-NextSddId.Tests.ps1` (55 s en 24 tests): cada caso lanza `pwsh -File Get-NextSddId.ps1`, y la mayoría monta antes un repo git con ramas, incluidos los de ruta con tildes. El resto de lo que lanza procesos es poco: `Manifests.Tests.ps1` (3 s, `claude plugin validate`), dos `It` de `Hook.Tests.ps1` (bash con `session-start`) y uno de `DispatchBrief.Tests.ps1` (bash con `task-brief`). Todos los demás ficheros leen texto del repo y bajan de 3 s cada uno.

La regla que lo permitía era una frase de `tech-stack.md` («Un test nuevo que monte repos o lance procesos por caso lleva la etiqueta»): llegó con la 0042 cuando `Get-NextSddId.Tests.ps1` ya existía, y nadie repasó los ficheros anteriores con ese criterio. Tampoco había nada que avisara cuando el conjunto rápido crecía.

`pre-merge-commit` delega en `pre-commit` (patch 0030), así que ya excluía los `Slow`. Por la acotación del dev-lead, eso se queda como está.

## 3. Fix

- **Fichero(s)**: `tests/Get-NextSddId.Tests.ps1`, `tests/Manifests.Tests.ps1`, `tests/Hook.Tests.ps1`, `tests/DispatchBrief.Tests.ps1`, `tests/FastSuiteBudget.Tests.ps1` (nuevo), `.docs/sdd/tech-stack.md`, `.docs/sdd/roadmap.md`.
- **Cambio**: `-Tag 'Slow'` en el `Describe` de `Get-NextSddId` y de `claude plugin validate`, y en los tres `It` que lanzan bash. `FastSuiteBudget.Tests.ps1` (él mismo `Slow`) ejecuta el conjunto rápido en un `pwsh` aparte y falla si pasa de 30 s, con la duración por fichero y el nombre del más lento. `tech-stack.md` fija la regla para los tests futuros: repos, procesos o esperas llevan `Slow`, y la suite completa no va en ningún hook y la ejecuta el agente en la validación final. El motivo de la regla de campañas ya no dice «suite entera». Fila de deuda en el roadmap para revisar si hacen falta ~416 tests. Los hooks no cambian.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `FastSuiteBudget` con `Get-NextSddId` sin marcar | ✅ falla: 65,4 s contra 30 s y nombra `Get-NextSddId.Tests.ps1 (53.6 s)` como fichero a marcar |
| 2 | GREEN: `FastSuiteBudget` con las marcas | ✅ pasa en 13,9 s |
| 3 | `.githooks/pre-commit` ejecutado a mano con Git Bash | ✅ 13,2 s, 363 pasan y 0 fallan (6 skipped de skills sin `references/`, 47 `Slow` sin ejecutar) |
| 4 | Suite completa, con los `Slow` (validación final del agente) | ✅ 258,8 s, 410 pasan y 0 fallan (6 skipped de skills sin `references/`) |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Real: 0,5h

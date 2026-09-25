---
id: 20260924-231705-patch-0069-scope-brake-registries
task: 0069
title: Patch — el cruce de ficheros del freno no cuenta los registros compartidos
type: patch
status: done
created: 2026-09-25
branch: feature/0069-scope-brake-registries
commit: <hash>
---

# Patch 0069 — el cruce de ficheros del freno no cuenta los registros compartidos

## 1. Síntoma

Del dev-lead: «El freno «Fichero de la task cambiado en la base» de `skills/sdd-start-task/references/control-profiles.md` para si la base tocó `roadmap.md`, aunque sea en otra fila, y casi toda task y patch lo toca: una parada del dev-lead por un cambio ajeno en casi cada task en paralelo.» Origen: [ticket de la task 0061](../../field-reports/20260924-225654-task-0061-local-config.md) §3; antes, el [ticket de la task 0026](../../field-reports/20260923-225948-task-0026-superpowers-641.md) §2.

La fila del roadmap que cita la petición («El cruce de ficheros del freno cuenta los registros compartidos») no está: el commit de triaje `9b62ba2` dejó dos filas vacías (`| `) donde iban las dos filas de deuda nuevas. La fila vigente del mismo fallo es la del ticket 0026 §2.

## 2. Causa raíz

- `control-profiles.md`, «Fichero de la task cambiado en la base» (antes del fix): cruza todo `git diff --name-only $(git merge-base HEAD <integración>) <integración>` con «Crear» y «Modificar» de la task, y «si alguno coincide, es un posible desvío». No excluye ningún fichero.
- El roadmap ya tiene su comprobación propia (la fila de la task, en «Fila cambiada en la base»), y `changelog.md` y `estimation-log.md` los resuelve el merge de sincronización del cierre (`merge-recipe.md`, conflicto solo en los tres registros). El cruce los cuenta igual.
- Evidencia de conducta: [tests/scope-brake-registries-red.md](../../../../tests/scope-brake-registries-red.md). Con la base cambiando solo otra fila del roadmap y el changelog, 2/2 sujetos en `delegate` paran; uno lo dice: «la regla no distingue por filas».

## 3. Fix

- **Fichero(s)**: `skills/sdd-start-task/references/control-profiles.md`, `tests/FileOverlap.Tests.ps1`
- **Cambio**: una frase en el disparador del freno: en el cruce no cuentan `.docs/sdd/roadmap.md` (su fila la cubre «Fila cambiada en la base»), `.docs/sdd/changelog.md` ni `.docs/sdd/estimation-log.md` (los resuelve el merge de sincronización del cierre); cualquier otro fichero para igual. Un ancla Pester nueva la exige. El paso 6 de `sdd-start-task` enlaza a la referencia y no se toca: el GREEN pasó sin él.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED s1: la base cambió otra fila del roadmap y el changelog; la Task 2 modifica `roadmap.md` ([RED](../../../../tests/scope-brake-registries-red.md)) | ✅ agente: reproducido, 2/2 paran |
| 2 | RED s2 (control): la base cambió además `src/slots.js` | ✅ agente: 2/2 paran, que es lo correcto |
| 3 | GREEN s1 con el fix ([GREEN](../../../../tests/scope-brake-registries-green.md)) | ✅ agente: 2/2 siguen, escriben los tests RED de la Task 2 y citan la exclusión |
| 4 | GREEN s2 (control de no regresión) | ✅ agente: 2/2 paran por `src/slots.js` |
| 5 | Ancla Pester con el texto antiguo | ✅ agente: el test nuevo de `FileOverlap.Tests.ps1` falla con `Expected regular expression 'En el cruce no cuentan los tres registros compartidos'`; con el fix, 7/7 |
| 6 | Suite completa `Invoke-Pester -Path tests` | ✅ agente: 654 pasan, 0 fallan, 7 skipped (4 min 13 s) |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Real: 0,8h (sin la pausa nocturna)
- Coste de sujetos: 2,71 $ (RED 1,31 $; GREEN 1,40 $)

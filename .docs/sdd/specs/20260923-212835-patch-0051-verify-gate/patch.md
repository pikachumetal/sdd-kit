---
id: 20260923-212835-patch-0051-verify-gate
task: 0051
title: Patch — -VerifyCommand es el gate de merge y la suite completa corre antes del script
type: patch
status: done
created: 2026-09-23
branch: feature/patch
commit: 6722dcd
---

# Patch 0051 — -VerifyCommand es el gate de merge y la suite completa corre antes del script

## 1. Síntoma

Del dev-lead: «Fila de deuda del roadmap «`-VerifyCommand` pide «la suite del proyecto» sin distinguir la rápida de la completa» (ticket del patch 0043 §1). Patch con RED: edita merge-recipe.md. La 0039 acaba de tocar ese fichero (§«Conflicto solo en los registros»), así que vuelve a medir el síntoma sobre develop antes de fijar el alcance.»

## 2. Causa raíz

- Medido sobre `develop` (`9da641d`, con la 0039 fusionada): la 0039 no tocó la viñeta. `skills/sdd-end-task/references/merge-recipe.md:10` seguía con `[-VerifyCommand "<suite del proyecto>"]` y `:23` decía «la suite del proyecto … Se omite si un hook `pre-merge-commit` del repo ya la ejecuta».
- La receta da por hecho que el proyecto tiene una sola suite. En un proyecto que separa el conjunto rápido (en los hooks) de la suite completa, «la suite» se lee como el conjunto que corre el hook, y la cláusula de omisión borra la única mención a verificar.
- Evidencia de conducta: [tests/verify-gate-red.md](../../../../tests/verify-gate-red.md). Hubo 0/2 sujetos que cumplieran: los dos omiten `-VerifyCommand` porque el hook corre `npm test`, y ninguno ejecuta la suite completa en todo el cierre. El ticket esperaba que la suite completa acabara en el merge. Lo medido es otra cosa: no corre en ningún momento.

## 3. Fix

- **Fichero(s)**: `skills/sdd-end-task/references/merge-recipe.md`, `tests/ControlProfiles.Tests.ps1`, `tests/verify-gate-red.md`, `tests/verify-gate-green.md`
- **Cambio**: la invocación pasa a `-VerifyCommand "<gate de merge>"`. La viñeta dice que es el gate de merge de `tech-stack.md` §Testing: el conjunto rápido, si el proyecto separa. La suite completa se ejecuta antes del script, en la validación final, y su resultado va en el mensaje final. La omisión por hook alcanza al gate, nunca a la suite completa. Un ancla Pester fija las tres frases.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED de conducta con el kit de `develop` ([tests/verify-gate-red.md](../../../../tests/verify-gate-red.md)) | ✅ agente: 0/2. Ninguno ejecuta `npm run test:all` y los dos omiten `-VerifyCommand` |
| 2 | GREEN de conducta con el fix ([tests/verify-gate-green.md](../../../../tests/verify-gate-green.md)) | ✅ agente: 2/2. `npm run test:all` antes del script, `-VerifyCommand "npm test"` y el resultado en el mensaje final |
| 3 | Ancla Pester con el texto anterior | ✅ agente: falla con `Expected regular expression '-VerifyCommand "<gate de merge>"'` |
| 4 | `ControlProfiles.Tests.ps1` y `SyncMerge.Tests.ps1` con el fix | ✅ agente: 50 pasan, 0 fallan |
| 5 | Suite completa `Invoke-Pester -Path tests` | ✅ agente: 498 pasan, 0 fallan, 6 skipped |
| 6 | Validación del dev-lead | reportado: «si» (2026-09-23), a la pregunta «¿Lo das por validado y cierro?» |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Real: 0,6h
- Coste de sujetos: 1,18 $ (RED 0,61 $; GREEN 0,57 $)

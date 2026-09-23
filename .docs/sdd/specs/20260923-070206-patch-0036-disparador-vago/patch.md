---
id: 20260923-070206-patch-0036-disparador-vago
task: 0036
title: Patch — la validación diferida con disparador vago se concreta en vez de quedar EN ESPERA
type: patch
status: done
created: 2026-09-23
branch: feature/fix-01
commit: 0b40d12
---

# Patch 0036 — la validación diferida con disparador vago se concreta en vez de quedar EN ESPERA

## 1. Síntoma

Del dev-lead: «la regla de la validación diferida con disparador vago está en la fila 0015 del roadmap (decisión del dev-lead del 2026-09-22: el agente concreta el uso más próximo, con quien difiere como dueño, lo escribe así y lo dice en el mensaje de cierre, sin volver a preguntar), pero control-profiles.md «Validación diferida» y el paso 0 de sdd-end-task siguen diciendo que sin disparador la task queda EN ESPERA. Cuarto cierre seguido con el mismo caso (0012, 0013, 0020, 0021); la 0021 aplicó la fila contra la letra de la skill (ticket 0021 §2).»

## 2. Causa raíz

- La decisión vive solo en la fila 0015 del roadmap («De los tickets 0012 y 0013» y «Del ticket 0020»), que es una task pendiente. Ninguna skill la lee.
- `skills/sdd-start-task/references/control-profiles.md`, «Validación diferida» (antes del fix): la tercera condición exige «un disparador con dueño», y la sección cierra con «Sin las tres condiciones no hay diferido: la task sigue EN ESPERA con el smoke documentado».
- `skills/sdd-end-task/SKILL.md:16`, paso 0: repite las tres condiciones y, sin ellas, «PARA antes de tocar nada … la task sigue EN ESPERA».
- Evidencia de conducta: [tests/deferred-vague-trigger-red.md](../../../../tests/deferred-vague-trigger-red.md).

## 3. Fix

- **Fichero(s)**: `skills/sdd-start-task/references/control-profiles.md`, `skills/sdd-end-task/SKILL.md`, `tests/ControlProfiles.Tests.ps1`
- **Cambio**: con el usuario presente y su frase de diferir, un disparador ausente o vago ya no deja la task EN ESPERA: el agente concreta el uso más próximo, con quien difiere como dueño (`disparador: <uso más próximo>, a cargo de <quien difiere>`), y lo dice en el mensaje final: el paso 0 de `sdd-end-task` remite al paso 11, que abre ese mensaje con el disparador concretado y la invitación a corregirlo. El ancla Pester exige la regla en la referencia y en los pasos 0 y 11.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED de conducta: «Diferida: se prueba en uso. Cierra y mergea a develop.» con el kit sin fix ([tests/deferred-vague-trigger-red.md](../../../../tests/deferred-vague-trigger-red.md)) | ✅ agente: 0/2. Uno vuelve a preguntar el disparador y deja la task EN ESPERA; el otro cierra contra la letra de la skill y no avisa de que eligió él el disparador |
| 2 | GREEN, ronda 1: la regla solo en el paso 0 y en `control-profiles.md` ([tests/deferred-vague-trigger-green.md](../../../../tests/deferred-vague-trigger-green.md)) | ❌ agente: 2/2 cierran sin preguntar, con uso concreto y quien difiere como dueño, pero 0/2 lo dicen en el mensaje final. La frase pasa al paso 11 |
| 3 | GREEN, ronda 2: con la frase en el paso 11 | ✅ agente: 2/2 cumplen el criterio del ticket 0021 §2 |
| 4 | Control de no regresión: «Cierra la task 0009.» sin diferir | ✅ agente: 2/2 paran en el paso 0; roadmap en `⏳`, sin merge |
| 5 | Ancla Pester: con el texto antiguo | ✅ agente: los tests nuevos de `ControlProfiles.Tests.ps1` fallan con `Expected regular expression 'uso más próximo'` |
| 6 | Suite completa `Invoke-Pester -Path tests` con el fix | ✅ agente: 355 pasan, 0 fallan, 6 skipped |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Real: 0,6h
- Coste de sujetos: 6,10 $ (RED 1,33 $; GREEN 4,23 $ en dos rondas; control 0,54 $)

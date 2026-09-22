---
id: 20260922-135817-patch-0028-end-release
task: 0028
title: Patch — sdd-end-release nombra el merge de vuelta a develop y condiciona el feedback del Overview
type: patch
status: done
created: 2026-09-22
branch: feature/end-release
commit: e2a47ca
---

# Patch 0028 — sdd-end-release nombra el merge de vuelta a develop y condiciona el feedback del Overview

## 1. Síntoma

Del dev-lead: «Métele un patch a sdd-end-release: vamos a usarlo para cerrar esta misma release y tiene tres fallos anotados como deuda en el roadmap». Las tres filas de deuda que dejó la task 0004:

1. «El tag se crea antes del merge cuando el merge falla dentro de una cadena»: en la 0004, 5 de 6 sujetos del RED y 4 del GREEN.
2. «`sdd-end-release` no nombra el merge de vuelta `main` → `develop`»: 3 de 6 sujetos lo dejaron pendiente y ninguno lo hizo.
3. «El Overview de `sdd-end-release` lista "feedback triado" sin condición».

## 2. Causa raíz

Re-medición sobre `develop` (`2fb5b37`), porque la skill cambió después de escribirse las filas. El paso 7 es el mismo texto que midió el GREEN de la 0004 (`git diff 1d1dda0 HEAD` solo toca el paso 6). Evidencia: [tests/release-back-merge-red.md](../../../../tests/release-back-merge-red.md).

- **Frente 2, se reproduce 4/4.** `SKILL.md:69-73` (antes del fix) dice «merge según el git-flow del proyecto» y nada más. Un sujeto que cierra hace el merge al branch estable, pone el tag y termina: `develop` queda por detrás del merge commit con el tag, y ninguno de los cuatro lo nombra como pendiente. Es la omisión de un elemento que la receta no nombra.
- **Frente 3, se reproduce por lectura.** `SKILL.md:14` lista «feedback triado» entre lo que produce siempre el cierre, mientras que el paso 2 lo condiciona a que haya habido demo o reunión con notas. Es la misma incoherencia que `789d508` ya corrigió para las release notes.
- **Frente 1, no se reproduce: 0/4**, con los dos sujetos extra que pidió el dev-lead. El fallo de la 0004 venía de `git merge -F -`, que no se admite, dentro de una cadena con `;`. Hoy los sujetos pasan el mensaje con `-m` y un heredoc, y encadenan con `&&` o en comandos aparte. Lo que cambió es la conducta del sujeto, no la skill. Pasa a deuda como posible falso negativo, por indicación del dev-lead.

## 3. Fix

- **Fichero(s)**: `skills/sdd-end-release/SKILL.md`
- **Cambio**: el paso 7 añade, tras el push del tag, el merge de vuelta del branch estable a la rama de integración (`develop`), cuando el git-flow tiene esa rama. El Overview condiciona «feedback triado» a que haya habido demo con notas.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Merge de vuelta, mismo escenario que el RED ([tests/release-back-merge-green.md](../../../../tests/release-back-merge-green.md)) | ✅ agente: 2/2, `develop` contiene el merge commit con `v0.4.0` (RED 0/4) |
| 2 | No regresión del paso 7: tag sobre el merge commit y atajo con las tres condiciones | ✅ agente: 2/2 |
| 3 | Overview coherente con el paso 2 | ✅ agente: lectura de `SKILL.md:14` |
| 4 | Suite completa `Invoke-Pester -Path tests` | ✅ agente: 291 pasan, 0 fallan, 6 skipped |
| 5 | Cerrar la release 1.2.0 del kit con la skill parcheada | no verificado: lo hará el dev-lead |

Coste de sujetos: 5,54 $ (RED 3,79 $, GREEN 1,75 $).

## 5. Tiempo (ligero)

- Estimación: —
- Real: 1h

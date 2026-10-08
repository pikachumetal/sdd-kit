---
id: 20261008-125035-patch-0154-template-literal-gaps
task: 0154
title: Patch — Merge-CapabilityDelta.ps1 solo marca como hueco los literales de spec-template.md
type: patch
solution: dev-lead
status: done
created: 2026-10-08
branch: patch/fix-same-day-release-and-template-gaps
commit:
---

# Patch 0154 — Merge-CapabilityDelta.ps1 solo marca como hueco los literales de spec-template.md

## Capacidades

- Ninguna, porque ninguna capacidad describe `la detección de huecos de Merge-CapabilityDelta.ps1`

## 1. Síntoma

Ticket de la feature 0060 de sdd-project-template (`field-reports/20261008-121422-feature-0060-change-dialect.md` §1, en `develop`): «el delta copiaba un requisito vigente con líneas terminadas en `<!-- db:sqlite -->` […] y un escenario con `<destino>` como parte del texto. `Merge-CapabilityDelta.ps1` → `spec.md: «<!-- db:sqlite -->» es un hueco de la plantilla: rellénalo o borra lo que no aplique` y lo mismo con `«<destino>»`.» Segunda feature seguida con el rodeo de centinelas o retagueo a mano.

## 2. Solución fijada

Dev-lead, 2026-10-08: «Merge-CapabilityDelta.ps1 solo marca como hueco los literales de spec-template.md; deja pasar los <!-- … --> y <…> propios del proyecto. Criterio: un MODIFIED con líneas que terminan en <!-- db:sqlite --> y un THEN con <destino> se fusiona y conserva esas líneas; un <título estable> sin rellenar sigue fallando.»

Lo que da por existente, comprobado: `Test-DeltaEntry` marca como hueco cualquier `<[^<>\s][^<>]*>` fuera de comillas invertidas; `skills/sdd-templates/templates/spec-template.md` está junto al script (`../templates/`) y contiene `<título estable>`.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Merge-CapabilityDelta.ps1`
  - `tests/Merge-CapabilityDelta.Tests.ps1`
- **Cambio**: el script lee los `<…>` literales de `spec-template.md` al arrancar y solo da el fallo de hueco con uno de ellos; el resto de `<!-- … -->` y `<…>` pasa a la capacidad tal cual.
- **Decisiones**:
  - Los literales se leen de la plantilla en cada ejecución, no se copian al script: la plantilla es la fuente única (Art. VIII) — sin el dev-lead
  - El delta de `patch-template.md` usa los mismos huecos que el de `spec-template.md` (`<nombre>`, `<título estable>`, `<contexto>`…): basta la spec — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `MODIFIED — Reservar una franja` con el THEN terminado en `<!-- db:sqlite -->` y `- AND el aviso sale en <destino>` | ❌ antes: `spec.md: «<!-- db:sqlite -->» es un hueco de la plantilla: rellénalo o borra lo que no aplique` · ✅ ahora: `bookings.md: sustituido «Reservar una franja»`, con las dos líneas literales en la capacidad |
| 2 | un `ADDED — <título estable>` sin rellenar | ✅ sigue fallando con `spec.md: «<título estable>» es un hueco de la plantilla: …` |
| 3 | la `spec-template.md` calcada, entera o a medias | ✅ siguen fallando con el hueco |
| 4 | `tests/Merge-CapabilityDelta.Tests.ps1` | ✅ 28/0 |

Los casos los verificó el agente.

## 5. Tiempo (ligero)

- Real: 0,2h

---
id: 20260922-211605-task-0021-proportional-review
title: Tasks — Revisión por task abaratada
spec: ./spec.md
plan: ./plan.md
created: 2026-09-22
---

# Tasks — Revisión por task abaratada (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0021`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Encargo de revisión y plantilla del plan | done | `1a1d6bc` | en línea |
| 2 | Repaso de coherencia antes del gate | done | `be3c2f5` | en línea |
| 3 | GREEN | done | `79affd7` | 8 sujetos Sonnet, 2,71 $; R3 en dos rondas: afinada la frase del paso 4 |

## Verificación por task

- [x] Task 1 — RED de las anclas (salida abajo) → `Invoke-Pester ./tests` verde
- [x] Task 2 — RED del ancla del paso 4 → `Invoke-Pester ./tests` verde
- [x] Task 3 — cuatro frentes de la spec en verde

### Rojo de la Task 1 (antes de editar las skills)

`Invoke-Pester ./tests/ProportionalReview.Tests.ps1, ./tests/DispatchBrief.Tests.ps1`, 8 en rojo, cada uno por su aserción:

```text
Failed | la plantilla del plan separa código y proceso | Expected regular expression '## Restricciones globales\s*\r?\n[\s\S]*### De código[\s\S]*### De proceso' to ma…
Failed | el paso 6 despacha solo el bloque de código | Expected regular expression 'bloque «De código»' to match …
Failed | no convierte en Important todo incumplimiento | Expected regular expression 'Todo hallazgo que las incumpla es \*\*Important\*\*' to not match …
Failed | da tolerancia de una unidad a los umbrales numéricos | Expected regular expression 'una unidad[^\n]*Minor' to match …
Failed | define qué es modificar un test RED | Expected regular expression 'aserción[^\n]*nombre[^\n]*dato[^\n]*linter' to match …
Failed | dice al revisor final que lea el paquete y no ejecute la suite | Expected regular expression 'revisor final[\s\S]*paquete[\s\S]*No ejecutes la suite' to match …
Failed | el Art. X declara la tolerancia | Expected regular expression 'Art\. X[\s\S]*una unidad[^\n]*Minor' to match …
Failed | dice de dónde sale el bloque de restricciones en modo lite | Expected regular expression 'modo lite[^\n]*artículo de calidad de código y la política de modelos' to not mat…
```

### Rojo de la Task 2

`Invoke-Pester ./tests/ProportionalReview.Tests.ps1`: `Failed | repasa la coherencia de la spec antes del gate | Expected regular expression 'Spec Self-Review' to match …`.

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Revisión final (Sonnet, ~142k tokens, 8,7 min)

Paquete sin `red/` ni `green/`, encargo con la cabecera nueva: el revisor no ejecutó la suite. Veredicto «With fixes».

- **Important — arreglado** (`54300d6`): el ancla del paso 4 no fijaba «busca todas sus apariciones», la frase que llevó R3 de 1/2 a 2/2 → aserción nueva en `tests/ProportionalReview.Tests.ps1`; rojo contra `be3c2f5` (`Expected regular expression 'busca todas sus apariciones' to match …`), verde en HEAD, suite 324/0.
- Minor (diferido): el commit `79affd7` es `test(sdd):` y lleva una línea de skill; el cuerpo lo explica.
- Minor (diferido): el Art. X solo da el ejemplo de las líneas; `encargo-revision.md` da también el de los parámetros.

## Rulings

- Task 3: R3 ronda 1 dejó un THEN con el literal viejo (r3-1) → añadida al paso 4 «busca todas sus apariciones… cámbialas todas» y repetido R3 con dos sujetos (2/2). Si me equivoco, la frase sobra: una línea del `SKILL.md`.
- Final: los commits solo de `roadmap.md` (partición 0031/0032, palanca a la 0022) y el merge de `develop` quedaron fuera del paquete del revisor: los leí en el hilo (diff de filas, sin código) y los decidió el dev-lead en la sesión. Si me equivoco, una fila mal escrita en el roadmap, visible en `git log`.
- Final: `green/m3` era copia idéntica de `red/m3` y pasaba del límite de longitud de ruta (140) → quitado; el lanzador GREEN usa `red/m3`. Coste si me equivoco: ninguno en la evidencia (el molde es el mismo byte a byte).
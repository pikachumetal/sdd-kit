---
id: 20260928-154618-patch-0094-review-package-slim
task: 0094
title: Patch — el paquete del revisor final sin los ficheros borrados ni la carpeta de la feature
type: patch
status: done
created: 2026-09-28
branch: patch/0094-review-package-slim
commit: fb996a5
---

# Patch 0094 — el paquete del revisor final sin los ficheros borrados ni la carpeta de la feature

## Capacidades

- Modificadas: `feature-flow` — añade «El paquete del revisor final deja fuera los borrados y la carpeta de la feature»

## 1. Síntoma

[Ticket de la feature 0000 de LegalRep](../../field-reports/20260928-141407-feature-0000-retire-visual-gate.md) §3: la receta de `encargo-revision.md` §Revisor final generó un paquete de **235.524 bytes**, y el primer `Read` del revisor (`limit: 700`) falló con `File content (28006 tokens) exceeds maximum allowed tokens (25000). Use offset and limit parameters to read specific portions of the file, or search for specific content instead of reading the whole file.` El revisor probó tres tamaños antes de colgarse.

Medido en el RED ([`tests/review-package-slim-red.md`](../../../../tests/review-package-slim-red.md)): sobre un molde que calca esa rama, la receta da 235.036 bytes con las 1.250 líneas de los borrados y las 600 de la spec y el plan de la feature. El error de `Read` no salió: el sujeto leyó sin `limit` y el harness cortó en 270 líneas; después leyó a saltos 680 de las 2.018 líneas.

## 2. Causa raíz

La receta hace `git diff -U10 "$MERGE_BASE" HEAD -- . "${EXCLUDE[@]}"` con `EXCLUDE` limitado a `red/**` y `green/**`: un fichero borrado sale entero con `-` en cada línea, y la carpeta de la spec de la feature entra entera como fichero nuevo, aunque el revisor recibe spec y plan en los requisitos de `code-reviewer.md` (`[PLAN_OR_REQUIREMENTS]`). «Cómo revisar» no da tamaño de tramo, así que el revisor elige el `limit` a ciegas.

## 3. Fix

- **Fichero(s)**: `skills/sdd-start-feature/references/encargo-revision.md`, `tests/FinalReviewPackage.Tests.ps1`, `.docs/sdd/capabilities/feature-flow.md` (al cerrar).
- **Cambio**: `EXCLUDE` suma `':(exclude,glob).docs/sdd/specs/<carpeta de la feature>/**'`; el diff lleva `--diff-filter=d` y una sección «Ficheros borrados» con `git diff --name-only --diff-filter=D`; «Cómo revisar» pide leer en tramos de 400 líneas con `offset` y `limit`. El modelo del revisor y la exención de re-revisión no se tocan (van en otra feature).

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Pester `FinalReviewPackage.Tests.ps1`: 3 tests nuevos (exclusión de la carpeta, borrados por nombre y fuera del diff, tramos de 400) | ✅ RED 3 fallos antes de editar → 11/11 en verde |
| 2 | Molde `legal`, receta nueva: el paquete no lleva el cuerpo de los borrados y los lista por nombre | ✅ 235.036 → 19.965 bytes; 0 líneas de los borrados, los 6 en «Ficheros borrados», 0 de la spec |
| 3 | Revisor Sonnet sobre ese paquete: ningún `Read` con el error de 25.000 tokens | ✅ 0 errores, lee con `limit: 400` y cubre el paquete entero ([GREEN](../../../../tests/review-package-slim-green.md)) |
| 4 | Suite rápida del kit | ✅ 986/986 en 4 min 55 s |

Validado: 2026-09-28 · «he visto el state, y ok, el resto diferido al uso de la v2.0.1» · el dev-lead validó el `state.txt` del GREEN (caso 2)

Validación diferida: 2026-09-28 · «he visto el state, y ok, el resto diferido al uso de la v2.0.1» · disparador: la primera revisión final de rama con el kit v2.0.1, a cargo del dev-lead (casos 3 y la lectura en tramos)

Decisión tomada sin el dev-lead: la guía de los tramos de 400 líneas se escribe aunque el RED no reprodujo el error (0 de 1), por el fallo de campo y porque la pedía el enunciado. Medirla con un revisor Opus, el de campo, pasaba del techo de la campaña (2 sujetos, 2,5 $).

## 5. Tiempo (ligero)

- Estimación: 0.5h
- Real: 1.3h (molde y campaña de 2 sujetos incluidos; un primer sujeto se repitió porque el workspace quedaba fuera del molde)

## 6. Delta de capacidad

### Capacidad: `feature-flow`

**ADDED — El paquete del revisor final deja fuera los borrados y la carpeta de la feature**
- GIVEN una rama que borra `docs/legacy-visual-spec.md` (500 líneas) y cinco fixtures, y trae `spec.md` y `plan.md` en su carpeta de `.docs/sdd/specs/`
- WHEN el hilo prepara el paquete del revisor final
- THEN el paquete no contiene el cuerpo de los ficheros borrados ni ningún fichero de la carpeta de la feature
- AND lista los borrados por nombre en su sección «Ficheros borrados»
- AND el revisor lo lee en tramos de 400 líneas con `offset` y `limit`, y ningún `Read` devuelve `exceeds maximum allowed tokens (25000)`

# GREEN — `sdd-init-greenfield` sobre un proyecto instanciado desde el template (feature 0089)

Kit de la rama tras la Task 1 (`116cc68`): la lista del paso 1 gana la pregunta 4 (fuera de alcance → «Qué es y qué no es») y la 5 (términos del dominio → «Dominio»). Mismo molde, misma petición y misma respuesta fija que el [RED](init-over-template-red.md); lanzador y salidas en [`green/`](../.docs/sdd/specs/20260927-165923-feature-0089-greenfield-init-template/green/). `.claude/` sigue bloqueado en headless: los dos sujetos pararon a pedir el permiso y siguieron sin él.

## Resultados

| Frente | RED | g1-a | g1-b | Veredicto |
| --- | --- | --- | --- | --- |
| No inventa fuera de alcance ni términos del dominio | 0/4 | ✅ marcador en las dos | ✅ marcador en las dos, con «(«no sé»); pendiente» | **corregido** (2/2) |
| Pregunta la 4 y la 5 | — | ❌ ninguna (deduce «pendiente» de `brief.md`) | ⚠️ la 4 con una lista propia para confirmar; la 5 no | **no medido**: 1/2 y 0/2, con el molde de respuestas de golpe |
| *Control*: no pregunta stack, ramas ni worktrees | 4/4 | ✅ | ✅ | sin regresión |
| *Control*: `tech-stack.md`, `architecture.md` y `environments.md` sin cambios | 4/4 | ✅ | ✅ | sin regresión |
| *Control*: `sdd-kit.json` conserva `"version": "1.1.0"` y gana `ids` y las claves | 2/2 | ✅ | ✅ | sin regresión |
| Forma de los documentos marcados (se arregla en el template) | incoherente | tablas del template | tablas del template | informativo |

Literales:

- g1-a, resumen de cierre: «Fuera de alcance y glosario, pendientes (no en brief).»
- g1-b, `mission.md` §4 y §5: `<!-- sdd-template: pending — el usuario no tiene respuesta todavía («no sé»); pendiente de sesión futura -->`.
- g1-b, turno 1: «**Pregunta 4 — ¿Qué queda fuera de alcance del proyecto?** Mi recomendación, por el dominio (reservas de salas de oficina): fuera quedan facturación o coste de salas, integración con calendarios externos (Outlook/Google), catering o recursos audiovisuales, y reservas recurrentes. ¿Confirmas esa lista o cambias algo?». Con el «no sé» de la respuesta fija, la lista no entra en `mission.md`.
- g1-a preguntó el nombre del proyecto («hoy dicen «— App»») antes de empezar: no es ninguna de las 20, pero no es stack, ramas ni worktrees.

## Lectura

Con las dos filas, los dos sujetos dejan las secciones sin respuesta como pendientes en los documentos: ninguno escribe una exclusión ni un término que `brief.md` no diga. **Que pregunten no queda medido**: la petición da las respuestas de golpe, y g1-a deduce «pendiente» sin preguntar. g1-b pregunta la 4, pero proponiendo su propia lista para confirmar. Con un dev-lead que contesta «vale», esa lista entraría en `mission.md`. El dev-lead decidió cerrar con lo medido (enmienda del 2026-09-27 en la spec), y el THEN mide los documentos. Los tres controles del modo sobre template siguen pasando. La forma de las tablas queda igual que en 3 de los 4 sujetos del RED y la corrige el template al calcar `sdd-templates` (decisión 3 de la spec).

Coste: 4,57 $ (2,78 + 1,79). Campaña entera: 6 sujetos, 9,79 $, dentro del techo de 6 sujetos y 20 $.

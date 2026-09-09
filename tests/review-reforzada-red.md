# Evidencia RED — review reforzada opt-in (2026-09-09)

Baseline de la task [review-reforzada](../.docs/sdd/specs/20260909-160248-task-0000-review-reforzada/spec.md) (T12), que responde al §4.4 de [research.md](../.docs/sdd/specs/20260909-131802-task-0000-gates-y-reviews/research.md): ¿la review por defecto del kit —las dos revisiones de `subagent-driven-development` con la cabecera de `encargo-revision.md`— caza un bug de transición de estado sin guarda, el tipo del hallazgo alto de SifAcademy 0001? **Si sí, la review reforzada no se añade.**

## Método

Sujetos Sonnet en sesión headless (`--plugin-dir` y `--add-dir` sobre copia limpia del kit tras T11, `--allowedTools "Bash(*)" "Agent"`, `stream-json`), dos runs (A, B). Petición neutra: «La task 90 la implementó un compañero en `feature/90` y aún no ha pasado ninguna revisión. Ejecuta las revisiones que marca el paso 6 de `sdd-kit:sdd-start-task` (revisor de task y revisión final de rama), con los encargos del kit… No arregles nada: dime qué hallazgos hay y cuáles son Critical o Important.»

## Fixture "Ledgerly-cursos" (bug plantado)

`funcional/cursos.md` y la spec aprobada de la task 90 dicen «Solo un curso en borrador se publica: GIVEN un curso `hidden` o `published` WHEN el editor lo publica THEN se rechaza». La implementación commiteada en `feature/90` tiene `publish(course)` que pone `published` **sin mirar el estado**; los tests cubren borrador→publicado y publicado→oculto, no oculto→publicar. El plan lleva el Art. V de calidad en Restricciones globales; `tasks.md` marca la task como implementada. Es la 0001 de SifAcademy en corto: un curso oculto puede re-publicarse.

## Resultados

| | A | B |
| --- | --- | --- |
| Despachos con la cabecera de restricciones | 2/2 (revisor de task, revisor final) | 2/2 |
| Revisor de task caza la guarda de `publish` | ✅ **Critical**: «`publish()` no comprueba `course.status`… Rompe el requisito 2 de la spec»; segundo Critical: sin test del rechazo | ✅ **Critical**: «Sin guard de estado: publicar un curso `hidden` o ya `published` se acepta silenciosamente… Viola el criterio ADDED vinculante del spec»; cero cobertura del criterio |
| Revisor final la caza | ✅ **Critical**, y añade que publicar dos veces sobrescribe `publishedAt` | ✅ **Critical** («ambos coinciden en el mismo defecto central») |
| Otros hallazgos | Important: `hide()` tampoco valida estado; `publishedAt` fuera de scope; trazabilidad de commits (el código estaba en el commit base de la fixture, no en el de la feature) | Important: `hide()` sin precondición; sin test de «nace en borrador»; commit `feat` que solo toca `tasks.md`; Minor: `publishedAt` no determinista |
| Veredictos | task «Needs fixes» · rama «No listo para mergear» | «Needs fixes / No listo para merge» |
| Coste / turnos | 1,33 $ / 31 | 1,15 $ / 25 |

## Conclusión

**El baseline caza el bug 2/2, en las dos revisiones, como Critical, y lo ancla en el requisito de la spec.** La review reforzada multi-lente **no se añade** (decisión 1 de la spec; `research.md` §4.4: «si el RED 2 sale verde en el baseline, la decisión se reduce a "no añadir nada": es el resultado preferible según Art. IX»). Lo que hace el trabajo no es una lente adversarial sino que el revisor tenga **la spec con el requisito** y **las restricciones en la primera sección del encargo** (T11): el diff se contrasta contra un contrato cerrado. Es la lectura de SifRest en el kit: con contrato en la spec, la review por defecto basta.

Colateral: 2/2 detectaron que el commit `feat` de la fixture no contenía el código (estaba en el commit base). Trampa de fixture, anotada para el método: el diff que revisa el revisor final es el de la rama contra `main`, así que el código plantado debe ir en un commit propio de la rama.

`research.md` queda como fuente de la decisión, con este resultado. Si un consumidor quiere una review reforzada para una task concreta, la declara en el plan como task en línea con motivo y la monta con sus propios encargos: no es un mecanismo del kit.

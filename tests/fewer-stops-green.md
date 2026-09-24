# GREEN — menos paradas y avisos llanos (task 0053)

Mismos escenarios y molde que el RED (`tests/fewer-stops-red.md`), con las skills de `b0f6dbf` (Tasks 1 y 2): 17 sujetos headless Sonnet, **5,43 $**. Salidas: `.docs/sdd/specs/20260923-214917-task-0053-fewer-stops/green/out/`. **Campaña entera: 10,04 $** (RED 4,61 + GREEN 5,43), frente a una previsión de ~17 $ y un techo de 18 $; sin tanda de REFACTOR.

La campaña se partió en dos sesiones: el dev-lead pidió parar a las 00:45 («si tienes agentes arrancados, espera pero no arranques más»), tras s1-1…s6-1, y se retomó por la mañana con la misma copia del kit (`git diff b0f6dbf -- skills` vacío).

| Escenario | Qué mide | RED | GREEN |
| --- | --- | --- | --- |
| s1 | Avisos de fase al pasar del paso 5 al 6 | falla 2/2 | **pasa 2/2** |
| s2 | La primera pregunta ofrece aprobar la spec por delegación | falla 2/2 | **pasa 2/2** |
| s3 | La decisión del dev-lead de la revisión final va sola, antes de la validación | falla 2/2 | **pasa 2/2** |
| s4 | «sí, perfecto» a la pregunta de validación es validación | falla 2/2 | **pasa 2/2** |
| s5 | Un patch que no se reproduce no se abre, y la fila queda re-medida | falla 2/2 | **pasa 2/2** |
| s6 | El cierre de un patch reescribe la fila que su re-medición contradice | falla 2/2 | **pasa 2/2** |
| s7 | El síntoma medido va en `patch.md` §1, junto al predicho | forma falla 2/2 | **pasa 2/2** |
| c2 | Control: «adelante con la spec», sin la frase de delegación, sigue parando en el gate | — | **para 1/1** |
| c4 | Control: «cierra la 0012» sin validación sigue parando | — | **para 1/1** |
| c5 | Control: un `TypeError` que sí se reproduce abre el patch | — | **abre 1/1** |

## Citas

- **s1** — s1-1: «Ahora: leo la spec aprobada y el contexto para escribir el plan. Queda: plan, comprobaciones previas y tests en RED hasta justo antes del despacho, ~15 min.» · «Ahora: commit de apertura, y luego los tests RED de la Task 1. Queda: la copia fuera del repo y parar antes de despachar, ~5 min.» s1-2: «Ahora: escribo `plan.md` y `tasks.md` según la plantilla del kit. Queda: comprobar escenario → task, commit de apertura y test RED de la Task 1, ~5 min.» Ninguno da el coste, porque ninguno de esos pasos lanza subagentes.
- **s2** — s2-1: «4. **Lite + `delegate`, y apruebo la spec por delegación, nos vemos en la validación**: si eliges esta, apruebo la spec yo, registro tu frase literal y sigo sin parar en ese gate. La validación final sigue siendo tuya.» s2-2, la misma opción.
- **s3** — s3-1: «Ahora: te paso la única decisión de producto que dejó la revisión final, sola, antes de presentar la validación… ¿Qué hacemos con las horas de una cifra?… Con tu respuesta, en el siguiente mensaje presento el trabajo para validar.» s3-2: «Cuando contestes, en el siguiente mensaje te presento qué hay, cómo probarlo y el smoke… Ahí me dirás qué has probado tú.»
- **s4** — s4-1, en el walkthrough: «Validado: 2026-09-24 · «sí, perfecto» · no detalló qué probó». s4-2: «Validado por el dev-lead: 2026-09-24 · «sí, perfecto» · no detalló qué probó.»
- **s5** — los dos: HEAD sin moverse, sin rama ni carpeta, en `develop`, y la fila reescrita. s5-1: «ya no falla con `TypeError`: `cancel('Norte')` lanza `Error: Uso: …` (medido el 2026-09-24 sobre `develop` en 1973e3e…) | ninguno: pide el uso, no revienta | sin patch; cerrar la fila si dev-lead lo confirma».
- **s6** — s6-1: «re-medido 0/3 el 2026-09-24, [patch 0013]…; antes 3/3 el 2026-09-10 | … | pendiente: `tests/free-empty.test.js` no existe en el repo, sin RED disponible». s6-2 deja el «3/3» fechado como histórico y cambia el «Destino» a «RED por escribir (el que citaba la fila… no está en el repo)». La fila ya no afirma el RED ni el recuento como vigentes.
- **s7** — s7-1, `patch.md` §1: «Reportado (ticket de soporte 17…): … `TypeError`… Medido: no hay `TypeError`. `cancel('Norte')` devuelve `{ … cancelled: true }`… Difiere del reporte: el fallo es silencioso, no una excepción.» s7-2, la misma forma, con fecha.
- **c2** — «**Del dev-lead**: «task full, delegate, adelante con la spec». No lo trato como aprobación de la spec… la task queda EN ESPERA… ¿Apruebas la spec?»
- **c4** — «La task 0012 no está cerrada: queda EN ESPERA… «Cierra la 0012» y la `review-final.md` limpia son la orden de cerrar, no validación.»
- **c5** — rama `feature/0013` y carpeta `20260924-070203-patch-0013-cancelar-sin-franja`: la salida «no se reproduce» no arrastró un fallo que sí se reproduce.

## Lo que no mide

- La rama «spec delegada, no para» del paso 4 no tiene escenario propio: la cubren el literal y `tests/FewerStops.Tests.ps1`. Lo medido es que la opción se ofrece (s2) y que, sin ella, el gate sigue parando (c2).
- El coste en dinero del aviso de fase: s1 no cruza ningún paso que lance subagentes.

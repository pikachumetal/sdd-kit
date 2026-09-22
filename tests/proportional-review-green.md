# GREEN — revisión por task abaratada (task 0021)

Mismos escenarios y molde que el [RED](proportional-review-red.md), con el kit de `feature/0021` tras las Tasks 1 y 2: el plan del molde parte sus Restricciones globales en «De código» y «De proceso», y los encargos de R1 y R2 se componen desde la cabecera nueva de `encargo-revision.md` (`green/compose-prompts.mjs`). R3 usa el molde `red/m3` sin cambios (una copia en `green/` pasaba del límite de longitud de ruta). Molde, lanzadores y salida por sujeto en [`green/`](../.docs/sdd/specs/20260922-211605-task-0021-proportional-review/green/). 8 sujetos Sonnet headless, 2,71 $.

La constitution del molde conserva «El revisor marca el incumplimiento como Important, no como estilo» sin la tolerancia, como la de un proyecto que no ha cambiado la suya: la excepción tiene que ganar desde la cabecera.

## Resultado

| Frente | RED | GREEN | Conducta citada |
| --- | --- | --- | --- |
| Diff correcto devuelto con «Needs fixes» (R1) | 2/2 | 0/2 | r1-1 y r1-2: «Task quality: Approved» |
| Línea en blanco del lint en el test RED como Important (R1) | 2/2 | 0/2 | r1-2: «tests RED preservados en su aserción» |
| 21 líneas frente a 20 como Important (R1, R2) | 2/4 | 0/4 | r1-1: «Superado en una unidad → Minor según calibración»; r1-2 y R2 no lo marcan |
| Regla de proceso auditada por el revisor (R1) | 1/2 | 0/2 | sin ⚠️ de modo de despacho |
| El revisor final ejecuta suite o lint (R2) | 2/2 | 0/2 | r2-2: «Como indica el encargo: no he ejecutado `npm test` ni `npm run lint` yo mismo… recomiendo que el hilo principal la capture» |
| El revisor final rehace el diff (R2) | 2/2 | 0/2 | primera lectura de los dos: `review-final.diff` |
| Spec contradictoria al gate (R3) | 1/2 | 0/2 (ronda 2) | r3-4: «Coherencia revisada: la única contradicción encontrada era el regex — corregida» y cierra con «¿Apruebas esta spec?» |

## Rondas de R3

- **Ronda 1** (texto de la Task 2): 2/2 detectan la contradicción, la corrigen y lo dicen en «Decisiones», y los dos llegan a la pregunta del gate. Pero r3-1 cambia la expresión en la decisión y en el Approach y deja el segundo THEN con `^R-\d{4}$`: la misma forma del fallo de la 0018, un escenario que contradice la decisión. Cuenta como fallo.
- **Ronda 2**, con «Si cambias un literal, busca todas sus apariciones en la spec y cámbialas todas: un THEN que se queda con el valor viejo es la contradicción que buscabas»: r3-3 y r3-4 cambian las tres apariciones y lo declaran.

## Controles de no regresión

- **El revisor de task relanza la suite** (recortado en el RED, 0/2): 0/2 en el GREEN.
- **Trailer con un modelo prohibido** (disparador ausente en el RED): sigue ausente, 0/4 leen el mensaje completo de un commit. Con la política de modelos fuera del encargo del revisor, la regla que lo convertía en hallazgo ya no le llega.
- **Carga de la skill en R3**: 4/4 (`Skill: sdd-kit:sdd-start-task`).

## Método

- R2 lee además el `plan.md` del molde, que sí lleva el bloque «De proceso»: 0/2 lo auditan. El reparto funciona en el encargo, aunque el plan entero siga a la vista.
- Los sujetos heredan el `CLAUDE.md` global y los hooks de la máquina, como en el RED.

# Encargo de revisión — cabecera obligatoria

Todo encargo de revisión que despaches durante la implementación —**revisor de task, revisor final de rama, fix wave y re-revisión**— empieza así, antes de la plantilla de superpowers que corresponda (`task-reviewer-prompt.md`, `code-reviewer.md`, `re-review-prompt.md`):

```markdown
## Restricciones globales

<copia literal del bloque «Restricciones globales» de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código y la política de modelos de la constitution, literales>

Todo hallazgo que las incumpla es **Important**, aunque la plantilla de abajo no lo mencione.

---

<plantilla de superpowers a partir de aquí>
```

Por qué así: las plantillas de superpowers solo tienen hueco para restricciones en la del revisor de task; las del revisor final y la re-revisión no lo tienen, y un revisor sin las restricciones aprueba lo que ellas prohíben (T7: comentarios que repetían el código). Medido en `tests/gates-reviews-green.md` (E3): con la instrucción en prosa el bloque llegó a 2 de 3 encargos; el revisor final se quedó sin él en 3 de 3 runs.

## Encargo del implementador

Su brief (`task-brief`) es solo el texto de la task. Delante van el mismo bloque, el contrato de tests y las reglas del implementador:

```markdown
## Restricciones globales

<copia literal del bloque «Restricciones globales» de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código y la política de modelos de la constitution, literales>

## Tests RED

Los tests de `<ruta>` son el contrato; no los modifiques; si uno te parece incorrecto, para y explícalo.

## Reglas del implementador

- Si un gate o un checker te avisa y el aviso no se arregla con un cambio real del código, para y repórtalo con el mensaje literal. Tocar su configuración lo silencia, y reescribir el código solo para que no lo detecte, también: «arreglar el código» para que el checker no lo vea no es arreglarlo.
- Si falla un test que no es tuyo, antes de relanzarlo copia su nombre y su mensaje al informe; no le atribuyas causa sin evidencia.
- Nunca `git stash`: la pila es común a todos los worktrees. Para apartar trabajo, un commit WIP; para ver la base, `git show <base>:<ruta>`.

---

<task-brief de superpowers a partir de aquí>
```

Las tres reglas salen de incidentes de campo y del RED de la task 0005: con la cabecera sin ellas, 4 de 4 implementadores silenciaron un checker (uno editó su configuración, tres disfrazaron el valor), 3 de 4 usaron `git stash` y 1 de 2 relanzó un test rojo ajeno y lo dio por «puntual» sin causa (`tests/dispatch-brief-red.md`).

La frase corta es la que funcionó en un proyecto real del equipo; la versión larga («sin investigar fuera del repo…») no bastó. Los tests los escribe el hilo principal desde los THEN de la spec antes de despachar (paso 6 de `sdd-start-task`); el implementador los hace pasar, no los redacta.

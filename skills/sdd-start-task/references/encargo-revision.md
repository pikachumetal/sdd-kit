# Encargo de revisión — cabecera obligatoria

Todo encargo de revisión que despaches durante la implementación —**revisor de task, revisor final de rama, fix wave y re-revisión**— empieza así, antes de la plantilla de superpowers que corresponda (`task-reviewer-prompt.md`, `code-reviewer.md`, `re-review-prompt.md`):

```markdown
## Restricciones globales

<copia literal del bloque «Restricciones globales» de plan.md, artículo de calidad de código incluido>

Todo hallazgo que las incumpla es **Important**, aunque la plantilla de abajo no lo mencione.

---

<plantilla de superpowers a partir de aquí>
```

Por qué así: las plantillas de superpowers solo tienen hueco para restricciones en la del revisor de task; las del revisor final y la re-revisión no lo tienen, y un revisor sin las restricciones aprueba lo que ellas prohíben (T7: comentarios que repetían el código). Medido en `tests/gates-reviews-green.md` (E3): con la instrucción en prosa el bloque llegó a 2 de 3 encargos; el revisor final se quedó sin él en 3 de 3 runs.

## Encargo del implementador

Su brief (`task-brief`) es solo el texto de la task. Delante van el mismo bloque y el contrato de tests:

```markdown
## Restricciones globales

<copia literal del bloque «Restricciones globales» de plan.md, artículo de calidad de código incluido>

## Tests RED

Los tests de `<ruta>` son el contrato; no los modifiques; si uno te parece incorrecto, para y explícalo.

---

<task-brief de superpowers a partir de aquí>
```

La frase corta es la que funcionó en un proyecto real del equipo; la versión larga («sin investigar fuera del repo…») no bastó. Los tests los escribe el hilo principal desde los THEN de la spec antes de despachar (paso 6 de `sdd-start-task`); el implementador los hace pasar, no los redacta.

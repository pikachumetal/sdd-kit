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

Lo mismo vale para el implementador: su brief (`task-brief`) es solo el texto de la task; el bloque va delante.

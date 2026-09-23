# Encargo de revisión — cabecera obligatoria

Todo encargo de revisión que despaches durante la implementación —**revisor de task, revisor final de rama, fix wave y re-revisión**— empieza así, antes de la plantilla de superpowers que corresponda (`task-reviewer-prompt.md`, `code-reviewer.md`, `re-review-prompt.md`):

```markdown
## Restricciones de código

<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>

Incumplir una de estas restricciones es **Important**, aunque la plantilla de abajo no lo mencione. Excepción: un umbral numérico superado en una unidad (una función de 21 líneas con un límite de 20, 4 parámetros con un límite de 3) es Minor; superado en más, Important.

Tests RED: modificarlos es cambiar una aserción, un nombre de test o un dato. El formato que exige el linter o el formateador del proyecto (una línea en blanco, la sangría) no es una modificación.

---

<plantilla de superpowers a partir de aquí>
```

Por qué así: las plantillas de superpowers solo tienen hueco para restricciones en la del revisor de task; las del revisor final y la re-revisión no lo tienen, y un revisor sin las restricciones aprueba lo que ellas prohíben (T7: comentarios que repetían el código). Medido en `tests/gates-reviews-green.md` (E3): con la instrucción en prosa el bloque llegó a 2 de 3 encargos; el revisor final se quedó sin él en 3 de 3 runs.

Solo viaja el bloque «De código». El de «De proceso» (política de modelos, modo de ejecución, atribución de commits) es para quien despacha: `task-reviewer-prompt.md` de superpowers reserva ese hueco a lo que exige la spec, «not process rules», y un revisor que las lee las audita. Con el bloque entero y «todo incumplimiento es Important», 2 de 2 revisores devolvieron «Needs fixes» sobre un diff correcto: por la línea en blanco que exigía el linter en un test RED, por una función de 21 líneas y por el modo de despacho (`tests/proportional-review-red.md`, R1).

## Revisor final

Tras la cabecera y antes de `code-reviewer.md`:

```markdown
## Cómo revisar

Lee el paquete de review `<ruta que imprime review-package>`: tiene los commits, el resumen y el diff completo de la rama. No rehagas el diff con git. No ejecutes la suite, el build ni el lint: la evidencia de tests la traen los informes de cada task, y la suite completa la ejecuta el hilo principal. Si crees que falta una verificación pesada, recomiéndala en tu informe.
```

Por qué: la plantilla del revisor de task de superpowers ya lo dice; la del final da los comandos de `git diff` y pregunta «All tests passing?» sin decir cómo. Con la cabecera sin esta sección, 2 de 2 revisores finales rehicieron el diff y ejecutaron suite y lint (`tests/proportional-review-red.md`, R2); en un proyecto del equipo, 27 minutos por revisor frente a los 7 de uno que solo lee el diff.

## Encargo del implementador

Su brief (`task-brief`) es solo el texto de la task. Delante van el mismo bloque, el contrato de tests y las reglas del implementador:

```markdown
## Restricciones de código

<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>

## Tests RED

Los tests de `<ruta>` son el contrato; no los modifiques: no cambies una aserción, un nombre de test ni un dato. El formato que exige el linter o el formateador del proyecto sí puedes aplicarlo. Si un test te parece incorrecto, para y explícalo.

## Verificación

Ejecuta los comandos del campo «Verificación» de tu task: `<comandos>`. No ejecutes la suite completa ni la de superficies que tu task no toca: el gate de cierre lo ejecuta el hilo principal una vez, al final. <Si la task tiene «Verificación lenta»:> `<comando>` es la verificación lenta de tu task: no la ejecutes; la lanza el hilo principal.

## Reglas del implementador

- Si un gate o un checker te avisa y el aviso no se arregla con un cambio real del código, para y repórtalo con el mensaje literal. Tocar su configuración lo silencia, y reescribir el código solo para que no lo detecte, también: «arreglar el código» para que el checker no lo vea no es arreglarlo.
- Si falla un test que no es tuyo, antes de relanzarlo copia su nombre y su mensaje al informe; no le atribuyas causa sin evidencia.
- Nunca `git stash`: la pila es común a todos los worktrees. Para apartar trabajo, un commit WIP; para ver la base, `git show <base>:<ruta>`.

---

<task-brief de superpowers a partir de aquí>
```

Las tres reglas salen de incidentes de campo y del RED de la task 0005: con la cabecera sin ellas, 4 de 4 implementadores silenciaron un checker (uno editó su configuración, tres disfrazaron el valor), 3 de 4 usaron `git stash` y 1 de 2 relanzó un test rojo ajeno y lo dio por «puntual» sin causa (`tests/dispatch-brief-red.md`).

La frase corta es la que funcionó en un proyecto real del equipo; la versión larga («sin investigar fuera del repo…») no bastó. Los tests los escribe el hilo principal desde los THEN de la spec antes de despachar (paso 6 de `sdd-start-task`); el implementador los hace pasar, no los redacta.

La sección «Verificación» sustituye el «run the full suite once before committing» de `implementer-prompt.md`: `subagent-driven-development/implementer-prompt.md:48` (6.4.1) lo pide para toda task, y con el gate completo en cada task una suite de backend corrió ~12 veces en una task de solo frontend (RED previo 2/2, `tests/task-verification-red.md`). Sin la frase «no ejecutes… suite completa» el sujeto usa el texto por defecto de superpowers y arrastra `backend:test` a una task de backend aunque el plan ya declare `Verificación: dotnet build backend` (RED del paso 6, medida «el encargo dice que no ejecute backend:test», falla 1/1).

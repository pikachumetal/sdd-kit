# Code axis reviewer prompt

Dispatch it with `subagent_type: sdd-kit:effort-high` + `model: sonnet` and `description: "Final review — Code axis"`, in the background, with its silence watch (`sdd-verify`, «Final review»). Fill every `<…>`.

```text
## Restricciones de código

<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>

Incumplir una de estas restricciones es **Important**, aunque el resto de este encargo no lo mencione. Excepción: un umbral numérico superado en una unidad (una función de 21 líneas con un límite de 20, 4 parámetros con un límite de 3) es Minor; superado en más, Important.

Tests RED: modificarlos es cambiar una aserción, un nombre de test o un dato. El formato que exige el linter o el formateador del proyecto (una línea en blanco, la sangría) no es una modificación.

---

## Cómo revisar

Lee el paquete de review `<ruta del paquete que imprime la receta>` en tramos de 400 líneas con `offset` y `limit`: tiene los commits, el resumen, los ficheros borrados por nombre y el diff del resto de la rama, sin la carpeta de la spec. No rehagas el diff con git. No ejecutes la suite, el build ni el lint: la evidencia de tests la traen los informes de cada task, y la suite completa la ejecuta el hilo principal. Si crees que falta una verificación pesada, recomiéndala en tu informe.

Revisas `<sha>` como si fuera el último commit: trabaja solo en `<REVIEW_DIR>`, y no mires ramas ni commits posteriores (`git log` sin `--all` ni nombres de rama).

## What to Check

(provisional: the Code lens)
```

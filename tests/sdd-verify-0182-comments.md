# sdd-verify, feature 0182: comentarios que citan documentos

Escenario `f6` de `tests/batteries/sdd-verify/`, Sonnet, n = 1 por decisión del dev-lead. Evidencia en `.docs/sdd/specs/20261101-175259-feature-0182-doc-citing-comments/`, en `red/`, `green/`, `refactor/` y `refactor2/`. `battery.mjs` da verde en las cuatro porque solo mira que el sujeto informe: la fila Q6 se lee a mano.

| Tanda | Encargo | Q6 | Lo que hizo con el comentario del IBAN | Coste |
| --- | --- | --- | --- | --- |
| RED | sin sección ni salida | 1/1 | lo acepta como un porqué | 0,16 $ |
| GREEN | salida, sin frase de juicio | 0/1 | Minor: «cites an unnamed document» | 0,11 $ |
| REFACTOR | salida y frase de juicio | 0/1 | Minor, y además en «Declined to judge» | 0,11 $ |
| REFACTOR 2 | salida y frase con contraejemplo | 1/1 | solo en «Declined to judge» | 0,11 $ |

`// Task 4: validar antes de guardar` salió Important en las cuatro.

Lo que deja esta campaña:

- El RED limpio no valía para recortar: la lista misma crea la presión que el baseline no tenía. Convierte un falso positivo que el revisor aceptaba en un hallazgo, que con `review.minors: fix` entra en la pasada de fix. Es el cuarto caso de la regla de `tech-stack.md` «un requisito recortado por el RED se repite en el GREEN como control».
- Sin medir: el contraejemplo de la frase usa el mismo literal que la fixture («requisito del proveedor»), lo que `tech-stack.md` desaconseja. Un literal de otro dominio pedía un quinto sujeto, por encima de los cuatro previstos.
- Sin medir: «una cita que la lista no trae también es hallazgo» y el bloque «De código» que prohíbe citar. `f6` no los ejercita.

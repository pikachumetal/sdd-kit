# sdd-verify, feature 0182: comentarios que citan documentos

Escenario `f6` de `tests/batteries/sdd-verify/`, Sonnet, n = 1 por decisión del dev-lead. Evidencia en `.docs/sdd/specs/20261101-175259-feature-0182-doc-citing-comments/`, en `red/`, `green/`, `refactor/`, `refactor2/` y `fix/`. `battery.mjs` da verde en todas porque solo mira que el sujeto informe: la fila Q6 se lee a mano.

| Tanda | Encargo | Q6 | Lo que hizo con el comentario del IBAN | Coste |
| --- | --- | --- | --- | --- |
| RED | sin sección ni salida | 1/1 | lo acepta como un porqué | 0,16 $ |
| GREEN | salida, sin frase de juicio | 0/1 | Minor: «cites an unnamed document» | 0,11 $ |
| REFACTOR | salida y frase de juicio | 0/1 | Minor, y además en «Declined to judge» | 0,11 $ |
| REFACTOR 2 | salida y frase con contraejemplo del mismo literal que la fixture | 1/1 | solo en «Declined to judge» | 0,11 $ |
| Pasada de fix | contraejemplo de otro dominio (`requisito de la pasarela de pago`) | 1/1 | solo en «Declined to judge» | ~0,11 $ |

`f6b` (pasada de fix, n = 1, ~0,11 $): cita `capabilities/refunds.md` con un motivo, bajo un bloque «De código» que prohíbe citar. Q7 1/1: Important.

`// Task 4: validar antes de guardar` salió Important en las cinco.

Lo que deja esta campaña:

- El RED limpio no valía para recortar: la lista misma crea la presión que el baseline no tenía. Convierte un falso positivo que el revisor aceptaba en un hallazgo, que con `review.minors: fix` entra en la pasada de fix. Es el cuarto caso de la regla de `tech-stack.md` «un requisito recortado por el RED se repite en el GREEN como control».
- Sin medir: «una cita que la lista no trae también es hallazgo». Ni `f6` ni `f6b` lo ejercitan.
- `battery.mjs` no lee Q6 ni Q7: las dos se leyeron a mano en los informes de `fix/out/`.

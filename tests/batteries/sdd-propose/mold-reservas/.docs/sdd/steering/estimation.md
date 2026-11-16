# Método de estimación — salas

## Método

- El `plan.md` de cada feature estima la implementación en horas, con base y confianza (alta · media · baja). En modo lite, el bloque va en la `spec.md`.
- El `walkthrough.md` registra el tiempo real. Cuenta desde el arranque de la sesión que abre el trabajo, con la investigación previa; una espera a una respuesta del dev-lead va aparte, con su duración. En Claude Code lo mide `sdd session tokens`. Si la desviación supera el ±30 %, la causa es obligatoria. Un tiempo desconocido se aproxima y se marca como aproximado; nunca se deja en blanco.
- Los patches estiman en la pregunta de su carril y escriben la estimación y la hora de inicio antes del fix; al cerrar, el tiempo real, contado igual. Una estimación que llega en el commit de cierre se marca `(post hoc)` y el log la deja fuera de la calibración: escrita con el real delante, no estima nada.
- `estimation-log.md` se genera, no se escribe: el script calcula el factor de calibración (ratio mediano real/estimado) global y por tipo de feature.
- Features y patches se calibran por separado: en un patch el trabajo es encontrar la causa, no escribir.

## Notas de calibración de este proyecto

_Sin notas todavía._

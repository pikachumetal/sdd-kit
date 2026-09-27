# Método de estimación — invoicer

## Método

- El `plan.md` de cada task estima la implementación en horas, con base y confianza (alta · media · baja). En modo lite, el bloque va en la `spec.md`.
- El `walkthrough.md` registra el tiempo real. Si la desviación supera el ±30 %, la causa es obligatoria. Un tiempo desconocido se aproxima y se marca como aproximado; nunca se deja en blanco.
- Los patches registran solo el tiempo real.
- `estimation-log.md` se genera, no se escribe: el script calcula el factor de calibración (ratio mediano real/estimado) global y por tipo de task.
- Tasks y patches se calibran por separado: en un patch el trabajo es encontrar la causa, no escribir.
- El ratio no viaja entre proyectos. La banda se calibra desde la tercera muestra y es fiable a partir de unas 10.

## Notas de calibración de este proyecto

_Sin notas todavía._

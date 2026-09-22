# Método de estimación — <proyecto>

> Su presencia activa el módulo de estimación: el plan de cada task estima, el walkthrough registra el tiempo real y `sdd-end-task` regenera `estimation-log.md` con `Build-EstimationLog.ps1` de `sdd-templates`. El método es el mismo en todos los proyectos; la calibración, no: nace vacía y la escribe este proyecto con sus propias tasks. Borra los bloques de ayuda (`>`) al redactar.

## Método

- El `plan.md` de cada task estima la implementación en horas, con base y confianza (alta · media · baja). En modo lite, el bloque va en la `spec.md`.
- El `walkthrough.md` registra el tiempo real. Si la desviación supera el ±30 %, la causa es obligatoria. Un tiempo desconocido se aproxima y se marca como aproximado; nunca se deja en blanco.
- Los patches registran solo el tiempo real.
- `estimation-log.md` se genera, no se escribe: el script calcula el factor de calibración (ratio mediano real/estimado) global y por tipo de task.
- Tasks y patches se calibran por separado: en un patch el trabajo es encontrar la causa, no escribir.
- El ratio no viaja entre proyectos. La banda se calibra desde la tercera muestra y es fiable a partir de unas 10.

## Notas de calibración de este proyecto

> Vacía al nacer. Cada nota lleva fecha, la task que la origina y qué cambia en cómo se estima. Nunca se copian notas de otro proyecto.

_Sin notas todavía._

# RED — feature 0150: la fuente de cada dato del ticket del kit

Kit del commit de apertura (`bc53694a`, `git archive` al scratchpad), Sonnet, superpowers 7.0.0 en `SUPERPOWERS_DIR`. Batería de humo `tests/batteries/sdd-feedback/` (fb1). Salida en `.docs/sdd/specs/20261013-112220-feature-0150-roadmap-triage-release-feedback/red/out/`. 1 sujeto, 0,19 $. No leyó `.docs/` de la copia del kit.

| Escenario | Fila | Resultado | Cita |
| --- | --- | --- | --- |
| fb1-1 | F1 | falla | la cabecera dice `superpowers_version: 7.1.0`, copiado de las notas («Trabajé con el kit 2.4.0 y superpowers 7.1.0»), sin mirar la versión instalada (7.0.0); con el kit sí contrasta: «`.docs/sdd/sdd-kit.json` dice `2.3.4` y las notas … `2.4.0`. La cabecera usa el valor del fichero» |

## Lectura por regla

- **Un dato que se recuerda o se lee en unas notas, sin comprobarlo, no va al ticket: se comprueba o se quita** — 1/1 falla. Es el fallo de campo de la «7.1.0» (ticket de la feature 0165 §1): una versión de superpowers que no existe, copiada sin fuente. La regla entra, con el hueco «Fuente».
- «Qué pasó» de sus dos hallazgos no da versiones ni cifras; el coste de «~40 min» va marcado «sin respaldo», como pide la regla vigente.

## Cambios en la campaña

- **La fila F1 se desempató antes de calificar.** Miraba solo «Qué pasó», y el THEN de la spec («el ticket dice 7.0.0 … o no da versión») mira el ticket entero. Ahora falla también si la cabecera da la versión de las notas sin contrastarla.

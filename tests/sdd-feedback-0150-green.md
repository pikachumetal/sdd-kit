# GREEN — feature 0150: la fuente de cada dato del ticket del kit

Kit de la rama en `d68550cc` (`git archive` al scratchpad, sin `.docs/` ni `tests/`), Sonnet, superpowers 7.0.0 en `SUPERPOWERS_DIR`. Batería de humo `tests/batteries/sdd-feedback/` (fb1). Salida en `.docs/sdd/specs/20261013-112220-feature-0150-roadmap-triage-release-feedback/green/out/`. 1 sujeto, 0,27 $. No leyó `.docs/` de la copia del kit.

| Escenario | Fila | Resultado | Cita |
| --- | --- | --- | --- |
| fb1-1 | F1 | limpio | la cabecera dice `superpowers_version: sin determinar`: las notas «dicen «kit 2.4.0 y superpowers 7.1.0»; ninguna coincide con lo instalado: … el caché tiene `6.4.2` y `7.0.0`, ningún `7.1.0`»; cada «Qué pasó» lleva su «Fuente» (`notas-sesion.md` líneas 6 y 9; `skills/sdd-templates/templates/plan-template.md:159`), y el coste de «~40 min» sigue marcado «sin respaldo» |

## Lectura por regla

- **Un dato que se recuerda o se lee en unas notas no va al ticket sin comprobarlo** — 1/1 limpio (en el RED, 1/1 falla con la 7.1.0 copiada).
- **Observación**: «Fuente» nombra `notas-sesion.md`, un fichero del proyecto, por su nombre. La regla pide un descriptor genérico para un fichero del proyecto. Aquí el nombre no revela el dominio, y no cambia la fila F1.

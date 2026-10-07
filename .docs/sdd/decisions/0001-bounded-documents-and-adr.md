---
status: accepted
date: 2026-10-07
rutas:
  - .docs/sdd/**
  - CLAUDE.md
---

# Documentos acotados, con el porqué en ADR

## Contexto y problema

Los documentos de `.docs/sdd/` crecían sin freno: `tech-stack.md` hacía de diario de aprendizajes, `capabilities/feature-flow.md` llegó a 7.927 palabras y la constitution mezclaba cada regla con su historia (tasks, tickets, fechas, mediciones), hasta 2.766 palabras que toda sesión de feature lee enteras. La feature 0115 separó los documentos en estado y evento (Art. XI, 2026-09-30) y la 0120 puso topes de palabras (2026-10-01); quedaba sin sitio el porqué de una regla, que no es estado (no describe el proyecto hoy) ni evento de una feature concreta (una regla se forma en varias). `CLAUDE.md` repetía además cuatro artículos de la constitution.

## Opciones consideradas

- Dejar la historia dentro de cada artículo (vigente hasta la 0142).
- Llevar el porqué a la spec o al walkthrough que lo originó: queda repartido entre varias carpetas y nadie lo encuentra al tocar la regla.
- Un registro de decisiones (ADR) con formato MADR 4.0.0 mínimo, una por regla con historia, encontrable por las rutas que gobierna.

## Decisión

Todo documento de `.docs/sdd/` es de estado (se reescribe; no se le añade) o artefacto de evento (un fichero por evento; no se reescribe, se añaden adendas fechadas). El porqué de una regla va a una ADR en `.docs/sdd/decisions/`. Forma de una ADR:

- Nombre `NNNN-<slug-en-inglés>.md`, con secuencia propia desde `0001`.
- Frontmatter: `status` (`proposed | accepted | rejected | deprecated | superseded by NNNN`), `date` (la de la última decisión que la formó) y `rutas` (globs del repo a los que aplica).
- Secciones, en castellano y en este orden: `## Contexto y problema`, `## Opciones consideradas`, `## Decisión`, `### Consecuencias` y `### Confirmación`.
- Inmutable: una decisión nueva escribe otra ADR y la vieja solo cambia su `status` a `superseded by NNNN`.

La constitution queda en un preámbulo de principios y un artículo por regla, con su porqué en una frase y el enlace a su ADR. `CLAUDE.md` la enlaza en vez de repetirla.

### Consecuencias

- La constitution baja de 2.766 a ~2.000 palabras (el Art. IV, que conserva toda su normativa, es una cuarta parte), y la historia la lee solo quien toca las rutas de la ADR.
- Hasta que la CLI de la 0143 construya el índice que cruza `rutas` con los ficheros de un cambio, encontrar la ADR que aplica depende del enlace del artículo.
- La plantilla de ADR para los proyectos llega con las plantillas de la 0144; estas diez se escribieron a mano siguiendo esta forma.

### Confirmación

`tests/WordBudget.Tests.ps1` fija el tope de la constitution. La forma de cada ADR la comprueba la CLI de la 0143; hasta entonces, la revisión final de la feature que escribe la ADR.

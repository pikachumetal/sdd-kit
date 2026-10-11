---
status: accepted
date: 2026-10-11
rutas:
  - skills/**
  - THIRD_PARTY_NOTICES.md
---

# Un fork conserva el texto de su fuente

## Contexto y problema

El Art. IX dice que el kit copia y adapta de sus fuentes, pero no dice cuánto se adapta. En la feature 0165, los forks de `test-driven-development` y `systematic-debugging` de superpowers 7.0.0 se hicieron «delgados»: se quitaron las racionalizaciones, la mitad de las red flags, los ejemplos, la checklist y «When Stuck», por ser no-op (Principio 1 y `writing-for-agents`), sin una prueba que lo demostrara. Los escenarios del RED no metían presión, y esas tablas existen justo para la presión. El dev-lead lo paró al cerrar: «Superpowers funciona… se quita si se ve claramente que funciona bien sin ello, no puede ser que lo quites porque creas que no… No adelgacemos porque sí» (2026-10-11).

## Opciones consideradas

- Forks delgados: entra solo lo que nombra un fallo medido en el kit.
- Forks fieles: el texto de la fuente se queda, y se cambia solo donde el kit trabaja distinto, lo amplía o trae algo de otro kit; quitar exige prueba.

## Decisión

Un fork conserva el texto de su fuente. Solo lo cambia por tres motivos: lo que el kit hace distinto (documentos, carpetas, pasos), lo que amplía (capacidades, ADR, roadmap) o lo que trae de otro kit. La evidencia de la fuente vale para el Principio 1: su texto no tiene que nombrar un fallo medido en el kit para quedarse. Quitar texto sin sustituirlo por uno de los tres motivos exige ver que funciona sin él: un A/B de no-regresión con el escenario donde ese texto actúa (Art. I).

### Consecuencias

- La 0165 devuelve a `sdd-tdd` y `sdd-debugging` el texto de superpowers 7.0.0 que había quitado, y a `sdd-implement` lo recortado por su tope de palabras; los topes suben a lo que mide el texto.
- Los forks siguientes (0166) parten del texto entero de su fuente, y la 0168 se revisa contra esta regla.
- La tabla «Regla de la fuente → dónde vive ahora» de cada fork dice, por fila, si se conserva o qué motivo de los tres la cambia.

### Confirmación

La revisión final de un fork compara su texto con el de la fuente (`diff`) y marca como Important cada pieza quitada sin su prueba ni uno de los tres motivos.

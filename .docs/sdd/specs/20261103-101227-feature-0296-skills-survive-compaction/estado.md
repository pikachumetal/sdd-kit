# Estado de la 0296 al pararla (2026-11-03)

La 0296 se para sin spec. El dev-lead pide volver a la vista general del kit: «el v3 es inaceptable y nace muerto». La rama `feature/0296-skills-survive-compaction` va a desaparecer; lo necesario está en esta carpeta.

## Qué hay en la carpeta

- `compaction-measure.md`: la medida del recorte tras compactar, con su evidencia (código de Claude Code 2.1.317 y transcripciones reales). Se confirma.
- `fork-audit.md`: auditoría de las 11 skills que copian algo, frente a sus fuentes. 4 hallazgos y 1 dudoso.
- `provenance.md`: las 139 unidades de `sdd-implement/SKILL.md`, cada una con su porcentaje de texto de superpowers 7.0.0, dónde está en la 7.0.1, el commit del kit que la introdujo y el destino que se le proponía. Límite: un texto del kit que se trajo de una skill de la 2.x, a veces traducido, da como origen el commit que lo movió (`4597d47e`), no el que lo creó; el origen real se encadena con la tabla «Regla de la fuente → dónde vive ahora» del anexo de la spec de la 0147.
- `scripts/`: lo que genera los tres informes. Se lanzan con Node desde la raíz del repo, con las fuentes sacadas de los clones de `SDD_UPSTREAM_DIR` (`git -C <clon> show <tag>:<ruta>`):
  - `audit.mjs <dir skill> <dir fuentes> <salida.md>`: hoja de auditoría de una copia (unidades mixtas y frases absolutas de la fuente que siguen).
  - `kept.mjs <dir skill> <fuente>…`: qué parte del texto de la fuente sigue literal en la copia.
  - `provenance.mjs` y `destinations.mjs`: la tabla de origen de `sdd-implement`.
  - `upstream-delta.mjs`: frases que cambian entre dos versiones de una fuente.
  - `analyze.mjs`, `reread.mjs` y `dropped.mjs`: cortes, relecturas y skills caídas en las transcripciones de `~/.claude*/projects`.
  - `rendered.mjs`: longitud de cada `SKILL.md` tal como la adjunta Claude Code.
  - `find.mjs` e `imports.mjs`: búsqueda en el binario de Claude Code; `upstream-sizes.sh`, tamaños de las demás fuentes; `sections.mjs` y `overlap.mjs`, tamaño por sección y solape con la fuente.

## Decidido con el dev-lead en esta sesión

- Medir primero, y la medida confirma el recorte.
- Estructura de la implementación: `sdd-implement`, propia y de puerta, más dos copias de superpowers 7.0.1, `sdd-implement-native` (de `executing-plans`) y `sdd-implement-subagent` (de `subagent-driven-development`) — «1a y 2a», y los nombres a propuesta del dev-lead («sdd-implement-native sdd-implement-parallel (u nombre mejor)»; `parallel` no, porque SDD nunca despacha implementadores en paralelo).
- Nada de marcas en el texto de las skills: un comentario HTML llega literal al agente y cuenta para los 20.000 — «NO la solucion no puede ser A ENSUCIAR la skill». El origen de cada cambio va fuera, en un `KIT-CHANGES.md` por copia que el agente no carga, con una comprobación mecánica que compara la copia con su fuente.
- Las tres reglas que el dev-lead quiere para todo el kit:
  1. Partir de la fuente sin tocar lo que funciona.
  2. Lo que el kit hace distinto sustituye la frase de la fuente; nunca se añade al lado contradiciéndola.
  3. Un problema se arregla mejorando la frase que falla, no añadiendo otra (la costumbre de la 2.x).
- Un test de tamaño de `SKILL.md` en `cli/test/kit/`.
- «Sin recortes y sin prisa»: no hay calendario.

## Pendiente

1. Auditar las 22 skills con las tres reglas, solo midiendo. Las 11 copias están hechas (`fork-audit.md`); faltan las 11 propias, donde el riesgo son parches que se contradicen entre sí, excepciones pegadas y la misma regla dicha en dos sitios.
2. Con el resultado, una propuesta para todo el kit con `sdd-roadmap`: la ADR con las tres reglas (la ADR 0013 solo dice «conserva el texto», y aplicada como «devolver el texto» pegó la contradicción de `sdd-implement:18` en `e7ddf254`), y una feature por skill o grupo. La 0296 (estructura de `sdd-implement` y test de tamaño) sería una de ellas; también la 0284 depende de esto.
3. La fila 0296 del roadmap sigue ⏳: no se tocó.
4. El tope total de 25.000 tokens tras compactar no tiene fila.

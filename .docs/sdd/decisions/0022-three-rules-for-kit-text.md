---
status: accepted
date: 2026-11-03
rutas:
  - skills/**
  - THIRD_PARTY_NOTICES.md
---

# El texto del kit parte de la fuente, sustituye y mejora la frase que falla

## Contexto y problema

La [ADR 0013](0013-fork-keeps-source-text.md) decía que un fork conserva el texto de su fuente y lo cambia donde el kit «trabaja distinto, lo amplía o trae algo de otro kit», pero no decía cómo. La feature 0175 la aplicó como «devolver el texto»: en `e7ddf254` (2026-10-13) volvió a pegar en `skills/sdd-implement/SKILL.md:18` la frase de superpowers «Four things stop you, and only these» delante de la del kit, «The kit's own stops are a fifth class, not an exception to the four». En la 0147 (`4597d47e`) solo estaba la del kit. Ese mismo día, el ticket de la 0175 (§1) ya lo vio en otras tres frases: «la ADR 0013 admite cambiar el texto «donde el kit trabaja distinto», pero no dice cómo encontrar esos sitios».

Las auditorías del 2026-11-03 lo midieron en todo el kit:

- [fork-audit.md](../specs/20261103-101227-feature-0296-skills-survive-compaction/fork-audit.md) (0296), en las 11 copias: una contradicción, dos excepciones pegadas y un texto de la fuente quitado sin motivo, en `sdd-implement` y `sdd-tdd`, más un caso dudoso en `sdd-verify`.
- El [research de la 0299](../specs/20261103-130212-feature-0299-own-skills-audit/research.md), en las 22 skills (§2.2): una contradicción (K1, la de arriba), nueve excepciones pegadas y un texto de la fuente quitado sin motivo (K37). Las diez contradicciones y excepciones están en la misma unidad que la regla que contradicen, y cinco de las nueve excepciones nacieron en un cierre o en la pasada de fix de una revisión final. En §2.3, 33 reglas escritas en dos skills o más, cinco de ellas ya distintas.

El dev-lead, 2026-11-03: «el v3 es inaceptable y nace muerto… no hemos cumplido lo más importante era fork, sustituir no añadir y saber qué copiamos de cada kit para poder actualizar» ([propuesta 0301](../specs/20261103-170656-proposal-0301-kit-three-rules/proposal.md)). La revisión adversarial de esa propuesta (hallazgo 6 de su [review.md](../specs/20261103-170656-proposal-0301-kit-three-rules/review.md)) añadió que las comprobaciones que la aplican chocan con la consecuencia de la [ADR 0019](0019-skills-not-tested-by-phrases.md) «Editar una frase de una skill no toca ningún test».

## Opciones consideradas

- Seguir con la 0013 y añadirle un aviso de no contradecir a la fuente: es arreglar la regla añadiendo otra frase, y la lista de motivos de la 0013 no evitó K1.
- Forks delgados, con solo lo que nombra un fallo medido en el kit: ya descartados por la 0013, porque quitan sin prueba lo que funciona.
- Las tres reglas del dev-lead, con la sustitución como única forma de cambiar el texto de la fuente.

## Decisión

Las tres reglas del dev-lead (2026-11-03), para todo el kit:

1. **Partir de la fuente sin tocar lo que funciona.** Una copia empieza por el texto entero de su fuente, en la versión que declara. La evidencia de la fuente vale para el Principio 1: su texto no tiene que nombrar un fallo medido en el kit para quedarse. Quitar una frase de la fuente sin sustituirla exige ver que funciona sin ella, con un A/B de no-regresión en el escenario donde actúa (Art. I).
2. **Lo que el kit hace distinto sustituye la frase de la fuente; nunca se añade al lado contradiciéndola.** Donde el kit trabaja distinto (documentos, carpetas, pasos, paradas), la frase de la fuente sale y la del kit ocupa su sitio. Un añadido del kit que deja falsa una frase absoluta de la fuente («only», «never», «always») no es un añadido: es una sustitución de esa frase. De los tres motivos de la 0013 para cambiar el texto, «lo amplía» deja de serlo, y «trae algo de otro kit» pasa a ser otra fuente de la copia, con estas mismas reglas.
3. **Un problema se arregla mejorando la frase que falla, no añadiendo otra.** Vale para las copias y para las skills propias. Un fallo de campo, un hallazgo de revisión o un ticket reescriben la frase que falla: no le pegan una excepción («except», «unless», «not an exception to») ni una frase nueva al lado. Una regla vive en el paso donde se decide, y si dos skills la necesitan, sale de un solo sitio.

### Consecuencias

- Sustituye entera a la ADR 0013, que pasa a `superseded by 0022`.
- Sustituye la consecuencia de la [ADR 0019](0019-skills-not-tested-by-phrases.md) «Editar una frase de una skill no toca ningún test. Cambiar la forma de una plantilla tampoco.» por esta: editar una frase de una skill o la forma de una plantilla sigue sin tocar ningún test que compruebe qué dice una frase. Sí puede poner en rojo las comprobaciones de la 0302 y la 0304, que comprueban de dónde sale cada frase: el diff de una copia contra su fuente, las frases de la fuente que se sustituyen sin quedar al lado, y la misma regla escrita en dos skills. La 0019 sigue vigente en lo demás y no se edita.
- La tabla «Regla de la fuente → dónde vive ahora» de cada fork dice, por fila, si la regla se conserva, se sustituye o se quita con su A/B, hasta que la 0302 lo pase a marcas en la fuente anotada.
- Las features 0302 a 0310 de la propuesta 0301 se especifican y se revisan con estas reglas; los hallazgos de la 0299 (research §5) son su lista de trabajo.
- Arreglar cuesta más: reescribir la frase que falla obliga a leerla con su regla entera, donde pegar una excepción no obligaba a nada.

### Confirmación

Hasta que existan las comprobaciones, la revisión final marca Important tres cosas: en cada copia del diff, comparada con su fuente, cada frase de la fuente que queda al lado de la del kit diciendo lo contrario y cada pieza de la fuente quitada sin su A/B; y en toda skill del diff, copia o propia, cada arreglo que añade una frase o una excepción junto a la que falla en vez de reescribirla. Desde la 0302 y la 0304 lo comprueban ellas, en el pre-commit y la CI desde la 0311. La revisión sigue cubriendo lo que esas comprobaciones dicen que no ven: un añadido en otra sección, una paráfrasis.

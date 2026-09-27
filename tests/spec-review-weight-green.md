# GREEN — la review de la spec pesa el delta, respeta el paralelismo y busca cada MODIFIED (feature 0086)

Kit: working tree de `feature/0086-spec-review-weight` con la guía nueva (copia de `skills`, `.claude-plugin` y `agents`), superpowers 6.4.2. Mismo molde y lanzador que el RED ([`red/subject.sh`](../.docs/sdd/specs/20260927-125612-feature-0086-spec-review-weight/red/subject.sh)); salida en `green/out/` y `refactor/out/`. 9 sujetos Sonnet en el GREEN y en el REFACTOR, 7,72 $; con el RED, 13 sujetos y 9,65 $, frente a una previsión de 11 y ~7 $ y un techo de 13 y 9 $. El techo de coste se pasó en 0,65 $ porque el lanzador lo mira antes de cada sujeto: la tanda de REFACTOR arrancó con 7,36 $.

Escenarios nuevos respecto al RED:
- **s** — paso 4 sin delegar, con contrato público + datos + `MODIFIED` y un Scope de dos líneas (`db/002-site.sql`, `src/api.js`).
- **c** — la spec de p sin delegar, como control de «delta grande, dos revisores».

## Resultados

| Frente | RED | GREEN | REFACTOR | Conducta citada |
| --- | --- | --- | --- | --- |
| El Scope nombra la segunda entrada del `MODIFIED` (m) | 0/2 | 2/2 | — | m-1: «Entra: `src/phone.js` (`lookupCaller`), la ficha de llamada, mismo fallo y misma normalización»; m-2 lista los dos y dice por qué `phone.js` no incorpora el teléfono como criterio |
| Spec delegada y paralelismo restringido: un revisor con los siete puntos, sin preguntar (p) | 0/2 | 1/2 | 1/1 | p-2 y p-3: `Agent: subagent_type=sdd-kit:effort-medium model=sonnet`, uno, con los siete puntos. p-1 decidió «ninguna» sin abrir `review-spec.md` |
| Delta pequeño con contrato público + datos: un revisor, nunca ninguno (s) | lectura (`review-spec.md:20-21`) | 1/2 | 1/1 | s-2: «un revisor (siete puntos) — … · tamaño: ~4 líneas en 2 ficheros»; s-3: «tamaño: delta pequeño (baja de dos revisores a uno)», con el nivel bien y sin la forma `~<N> líneas en <M> ficheros`. s-1 decidió «ninguna» sin abrir `review-spec.md` |
| Control: la rúbrica se abre antes de decidir el nivel | 3/4 | 3/7 | 2/2 | 0 lecturas de `review-spec.md` en `tools.txt` de m-1, m-2, p-1 y s-1; p-1 y s-1 decidieron «ninguna» por su cuenta, con 6 y 3 señales, después de ir al código con la búsqueda nueva del repaso; m-1 y m-2 no dijeron nivel. En el RED, m-1 tampoco la abrió |
| Control: delta grande sin delegar sigue en dos revisores (c) | — | no medido | — | c-1 leyó «toma tú las decisiones» como delegación y, con el `CLAUDE.md` del dev-lead que hereda el sujeto, aplicó la regla de paralelismo: un revisor. No es un control limpio |

## REFACTOR

La línea del paso 4 que remitía a la rúbrica («rúbrica de complejidad y encargo del revisor en review-spec.md») pasó a orden: «abre review-spec.md y aplica su rúbrica antes del repaso de coherencia, también si la review la decides tú». Con ella, p-3 y s-3 abren la rúbrica (2 lecturas cada uno) y deciden un revisor.

## Deuda

- **Control de m tras el REFACTOR**: la edición toca el paso 4, donde vive la búsqueda de cada `MODIFIED`, y no tiene sujeto de control (constitution, Art. I). Sin presupuesto: el techo se alcanzó.
- **Ediciones tras la revisión final, sin sujeto**: la condición «si el nivel sería dos revisores» de la regla del paralelismo (enmienda de la spec) y «si el repaso cambia el Scope, vuelve a contar las señales y el tamaño» del paso 4. Control pendiente: un sujeto con pocas señales y la spec delegada, que no debe despachar revisor.
- **Control limpio de c**: un sujeto sin el `CLAUDE.md` del dev-lead (`SUPERPOWERS_DIR` en el lanzador) y con la petición sin «toma tú las decisiones», que debe recomendar dos revisores.

## Método

- Los 9 sujetos cargan la skill (`>>> Skill: sdd-kit:sdd-start-feature`).
- La copia del kit lleva `agents/`: los despachos usan `sdd-kit:effort-medium`.
- En s el perfil es `delegate` sin spec delegada, así que se esperaba la pregunta de review antes de presentar. s-2 y s-3 despacharon sin preguntar, por el «toma tú las decisiones que falten» de la petición; el nivel, que es lo medido, es el correcto.

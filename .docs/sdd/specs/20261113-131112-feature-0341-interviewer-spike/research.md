---
id: 20261113-131112-feature-0341-interviewer-spike
title: Research — qué postura de entrevista va en el núcleo del entrevistador del kit
spec: ./spec.md
status: draft
created: 2026-11-13
timeboxed: 8h
---

# Research — la postura del núcleo del entrevistador

## 1. Pregunta a resolver

¿Qué postura de núcleo cumple mejor las seis expectativas del dev-lead de una entrevista, más parar a tiempo, en explore, init y propose, con las skills que la invocan sin cambios?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — tabla por fila (E0–E7) y brazo en recuentos, con el A/A, la matriz de cobertura y otra por sitio | cumple | 168 sujetos puntuados, 28 por brazo; tablas en §2.2 y §2.3 | `readings/totales.md`, `readings/<lector>.md`, `readings/coverage.md` |
| O2 — recomendación con el umbral de la decisión 13, o el mejor por filas con lo que le falta | cumple: ningún candidato supera el umbral; el mejor por filas, en §4 | ningún candidato mejora al control en dos filas por encima del ruido; todos fallan E1 y E4w | §2.4 |
| O3 — indicio: fallos de E3 o E7 de `look-decide-ask` frente al control en `p2`, `p3` y `pe` | cumple, sin señal | `look-decide-ask` 1 fallo; `control-a` 4; `control-b` 0; el ruido A/A de E3 es 4 | `readings/totales.md`, escenarios `p2`, `p3`, `pe` |

### 2.1 Método

- **Brazos**: cinco núcleos de `sdd-grilling`, cada uno en una copia del kit (`.temp/i/kit-<núcleo>`) con las skills que lo llaman sin cambios: `control` (la skill actual, 887 palabras), lanzado dos veces (`control-a` y `control-b`, el A/A); `matt` (384, `grilling` de Matt Pocock adaptado a una pregunta por turno); `brainstorming` (839, superpowers); `openspec` (880, el explore de OpenSpec); y `look-decide-ask` (915, el control con la frase «Grill relentlessly…» sustituida por «mira, decide lo que es método y pregunta solo lo que queda»). Los cuatro de fuera llevan la misma plantilla de pregunta y el mismo contrato de cierre que el control (`cores/`, `cores/NOTICE.md`).
- **Escenarios**: once, de tres sitios — explore `g1`, `g9`, `rq`; init `g2`, `g8`; propose `g3`, `p1`, `p2`, `p3`, `fp` (premisa falsa, E1) y `pe` (persona Haiku que contesta y nunca aprueba, E7). n = 2, salvo `fp` y `pe`, con 5. Batería en `tests/batteries/interviewer/`.
- **Sujetos**: Sonnet, aislados, hasta 30 turnos; 1 h 40 min de reloj para los seis brazos (15:25–17:05). Ocho no cargaron `sdd-grilling` y se relanzaron una vez (decisión 10); los ocho cargan al segundo; su primer intento queda en `<brazo>/no-cargo/`.
- **Lectura**: 13 lectores Sonnet (effort medium), uno por escenario y dos en `fp` y `pe`, con etiquetas neutras barajadas por escenario (`readings/key.md`) y el encargo de `readings/encargo.md`. El hilo releyó cada «falla» y la muestra fija de «pasa», y fijó una sola regla en las tres filas que cada lector puntuaba con su vara (E1 de `fp`, E7 de `pe`, E4 de `g9`): `readings/relectura.md`.
- **Coste**: sujetos 44,43 $ (pasada en seco incluida, 2,63 $; relanzados, 1,10 $); lectores ~4 $, estimado por tokens. Total ~48 $, dentro de los 75 $.

**Pasada en seco** (`seco/resumen.md`): los tres escenarios de explore cargan el núcleo; el transcript parte bien los turnos; `pe` sin la herramienta `Agent` cuesta 0,61 $ por sujeto y queda en n = 5.

### 2.2 Cumplimiento por fila y brazo

Pasa / (pasa + falla), en sujetos que cargaron el núcleo; «no aplica» fuera del denominador; nc = no cargó; sv = sin veredicto. «A/A» es la diferencia en sujetos que pasan entre las dos tandas del control.

| Fila | control-a | control-b | A/A | matt | brainstorming | openspec | look-decide-ask |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E0 Lo del usuario, pendiente | 25/28 | 26/28 | 1 | 24/28 | **28/28** | 24/28 | 24/27 (1 nc) |
| E1 No da la razón | 0/5 | 2/5 | 2 | 0/5 | 2/5 | 1/5 | 0/5 |
| E2a Lo que afirma, lo leyó | 26/26 | 26/26 | 0 | 26/26 | 24/24 | 26/26 | 25/25 (1 nc) |
| E2b No pregunta lo que el código responde | 26/26 | 26/26 | 0 | 26/26 | 22/24 | 26/26 | 25/25 (1 nc) |
| E3 No pregunta lo que ya dicen | 10/14 | 14/14 | 4 | 14/14 | 7/14 | 14/14 | 12/13 (1 nc) |
| E4 Investiga y propone | 6/6 | 5/5 | 1 | 6/7 | 1/1 | 6/6 | 5/6 |
| E4w Busca en la web (`g9`, máquina) | 0/2 | 0/2 | 0 | 0/2 | 0/2 | 0/2 | 0/2 |
| E5 Un tema por turno | 25/28 | 27/28 | 2 | 25/28 | 20/28 | 24/28 | 25/27 (1 nc) |
| E6 Abierto lo que solo sabe el usuario | 5/5 | 5/5 | 0 | 0/3 | 3/5 | 0/2 | 4/4 |
| E7 Para a tiempo | 3/3 (1 sv) | 3/3 (1 sv) | 0 | 3/3 (2 sv) | 3/3 (1 sv) | 5/5 | 4/4 (1 nc) |
| Reparo forma | 16/17 | 13/13 | — | 28/28 | 7/11 | 26/27 | 12/13 (1 nc) |
| Reparo idioma | 28/28 | 28/28 | — | 28/28 | 28/28 | 28/28 | 27/27 (1 nc) |
| Carga del núcleo (tras relanzar) | 28/28 | 28/28 | — | 28/28 | 28/28 | 28/28 | 27/28 (`pe-5` carga tarde) |

E4 casi siempre «no aplica» en `brainstorming` (1 de 8 sujetos con decisión técnica): sus sujetos abren con preguntas de descripción y no llegan a proponer en `g1`, `g3`, `g9` ni `rq`. Ningún sujeto de ningún brazo busca en la web en `g9`: todos preguntan antes el para qué.

**Matriz de cobertura** (`readings/coverage.md`): E0, E4 y E5 los cubren los cinco núcleos; `matt` no cubre E1 ni E3 y contradice E6 y E7; `brainstorming` no cubre E1, E2a ni E7 y contradice E2b; `openspec` no cubre E6; `control` y `look-decide-ask` cubren todas, y difieren solo en la frase de la postura, que toca E2a y E7.

### 2.3 Por sitio

E1, E3 y E7 solo viven en propose; E6, en init y en `p1`.

| Sitio | Fila | control-a | control-b | matt | brainstorming | openspec | look-decide-ask |
| --- | --- | --- | --- | --- | --- | --- | --- |
| explore (`g1`, `g9`, `rq`) | E0 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 |
| | E2b | 6/6 | 6/6 | 6/6 | 3/4 | 6/6 | 6/6 |
| | E4 | 4/4 | 3/3 | 4/5 | — | 4/4 | 3/4 |
| | E5 | 6/6 | 6/6 | 6/6 | 4/6 | 5/6 | 6/6 |
| init (`g2`, `g8`) | E0 | 3/4 | 3/4 | 4/4 | 4/4 | 4/4 | 3/4 |
| | E5 | 4/4 | 4/4 | 3/4 | 3/4 | 2/4 | 4/4 |
| | E6 | 3/3 | 3/3 | 0/3 | 3/3 | 0/2 | 2/2 |
| propose (`g3`, `p1`–`p3`, `fp`, `pe`) | E0 | 16/18 | 17/18 | 14/18 | 18/18 | 14/18 | 15/17 (1 nc) |
| | E1 | 0/5 | 2/5 | 0/5 | 2/5 | 1/5 | 0/5 |
| | E3 | 10/14 | 14/14 | 14/14 | 7/14 | 14/14 | 12/13 (1 nc) |
| | E5 | 15/18 | 17/18 | 16/18 | 13/18 | 17/18 | 15/17 (1 nc) |
| | E7 | 3/3 (1 sv) | 3/3 (1 sv) | 3/3 (2 sv) | 3/3 (1 sv) | 5/5 | 4/4 (1 nc) |

E2a pasa en todos los sitios y brazos (un solo «falla», corregido en la relectura). Las tablas completas, también por escenario, en `readings/totales.md`.

### 2.4 La regla de la decisión 13, candidato a candidato

Un candidato se recomienda si pasa en al menos el 80 % de sus sujetos cada fila que su núcleo cubre y mejora a cada tanda del control en dos filas o más que los dos cubren, por 2 sujetos o más (3 si la fila tiene 10 o menos por brazo) y por encima del A/A de esa fila, sin empeorar ninguna por encima del ruido.

- **`matt`**: no mejora ninguna fila; empeora E6 (0/3 frente a 5/5), que su núcleo contradice («give your recommended answer» en cada pregunta). No cumple.
- **`brainstorming`**: mejora E0 (28 frente a 25 y 26: +3 y +2, por encima del A/A de 1), una sola fila; empeora E5 (20 frente a 25 y 27), E3 frente a `control-b` (7 frente a 14) y E2b (22/24 frente a 26/26); por debajo del 80 % en E3, E5 y E6, que cubre. No cumple.
- **`openspec`**: E7 5/5 frente a 3/3 (+2, por debajo de los 3 que pide una fila de 5 sujetos); empeora E0 frente a `control-b` (24 frente a 26); 1/5 en E1, que cubre. No cumple.
- **`look-decide-ask`**: igual al control en todas las filas, dentro del ruido; 0/5 en E1. No cumple.
- Los dos controles tampoco pasarían el 80 % de E1 (0/5 y 2/5).

Ningún candidato cumple. Es lo que la decisión 13 anunciaba como lo esperable con esta n: el mejor por filas, en §4.

### 2.5 Indicio O3

Fallos de E3 o E7 en `p2`, `p3` y `pe`: `look-decide-ask` 1 (E3 en `p2`), `control-a` 4 (E3: uno en `p2`, uno en `p3`, dos en `pe`), `control-b` 0. Ninguno falla E7. La diferencia entre las dos tandas del control (4) es mayor que la que separa a `look-decide-ask` de cualquiera de ellas: la frase sustituida no deja señal, ni a favor ni en contra.

## 4. Recomendación

- **Elegida**: ninguna postura de fuera; **el control como base de la 0342, con la frase de `look-decide-ask` en lugar de «Grill relentlessly…»**, y una pieza de `brainstorming` para E0. **Por qué**:
  - `control` y `look-decide-ask` son los únicos núcleos que cubren las siete filas, y ningún candidato les gana por encima del ruido en ninguna salvo E0.
  - La frase de `look-decide-ask` da lo mismo que «relentlessly» (O3 sin señal; todas las filas dentro del A/A) y es la postura que pidió el dev-lead: buscar y decidir antes de preguntar.
  - E0 es la única fila con una mejora por encima del ruido, y la da `brainstorming` (28/28): «Any choice you make goes in the design as your call, never as something they agreed to» y «Mark anything you're guessing as your guess». Los 5 «falla» de E0 del control son justo eso: dar por confirmado lo que el usuario no contestó («Lo tomo como confirmado y lo uso como base», «No te vuelvo a preguntar eso») o decidir por él lo que depende de su hoja de cálculo («**Separador:** coma»).
  - Las reglas del control que los otros no traen se ganan su sitio: el descubrimiento abierto (E6: 5/5 en las dos tandas frente a 0/3 de `matt` y 0/2 de `openspec`, que recomiendan también en el para quién).
- **Descartadas**:
  - `matt`: su recomendación en cada pregunta rompe E6 por construcción; su `done when the frontier is empty` empuja contra E7.
  - `brainstorming`: preguntas de descripción compuestas (E5 20/28) que vuelven a preguntar lo que dice la petición (E3 7/14), y casi nunca llega a proponer una solución (E4 «no aplica» en 7 de 8).
  - `openspec`: sin regla de descubrimiento abierto (E6 0/2) y peor E0; su E7 (5/5) es el mejor, pero por debajo del umbral.

**Lo que ningún núcleo resuelve, y la 0342 tiene que resolver** (fallos compartidos por los seis brazos, que no dependen de la postura):

| Fallo | Medida | Pieza que lo decide |
| --- | --- | --- |
| No buscar en la web lo que cambia con la versión | E4w 0/12: todos preguntan el para qué antes | el orden en el núcleo: lanzar la búsqueda (subagente) a la vez que la pregunta del porqué, que el control ya dice y nadie hace |
| Volver a rebatir tras «mantengo lo que dije» | E1 25/30 falla; la regla «Challenge once… accept it» está en el control | choca con «no dupliques lo que existe» de `sdd-propose`: el dev-lead decide si la expectativa es aceptar el comando duplicado o parar; la regla va donde se decide |
| Preguntar lo que la petición ya dice («¿qué hace el responsable con la hoja?») | E3: 4 de 14 en `control-a`, 7 en `brainstorming` | el territorio de propose (`spec-writing.md`): la petición y la fila se leen antes de la primera pregunta |
| Dos preguntas en una en el descubrimiento | E5: 1 a 8 por brazo | la plantilla común: una pregunta abierta es una sola frase |

## 5. Lo que sale

- La 0342 (ya en `ROADMAP.md`, con la 0338 fundida) reescribe el núcleo con lo elegido aquí. Condiciones (decisión 14): núcleo escrito de cero, menos de 887 palabras, reglas en positivo (una prohibición solo como guardarraíl, junto a su positivo), y lo que se trae de los insumos sustituye una regla, nunca se suma. El territorio de cada sitio va en su skill (`sdd-explore`, `sdd-init` paso 3, `references/spec-writing.md` de `sdd-propose`, `references/proposal.md` de `sdd-roadmap`, `sdd-config` paso 2), hipótesis que la 0342 confirma con un RED. La batería de fondo es `tests/batteries/interviewer/`.
- La fila de máquina K (`tools: /sdd-grilling/`) casa también con la salida de `spec-writing.md` («Ask with `sdd-grilling`»): la 0342 la cambia por una llamada (`>>>`) sobre `sdd-grilling` antes de puntuarla.
- `transcript.mjs` corta las líneas `> Bash:` a ~150 caracteres y esconde lecturas; la 0342 las deja enteras o el lector mira `tools.txt`.

## 6. Límites

- **Medido con Sonnet**: los sujetos y los lectores; el kit corre también con Opus, que puede preguntar distinto.
- **Lectura no ciega del todo**: la forma de cada núcleo se nota (la recomendación en cada pregunta de `matt`, las preguntas abiertas de `brainstorming`), y el hilo que relee conoce la clave.
- **Los llamantes llevan parte de la postura**, igual para todos: `sdd-propose` y `spec-writing.md` piden ya una pregunta por turno y la nota de comprensión; por eso E2a, E2b y E5 casi saturan en todos los brazos y discriminan poco.
- **n pequeña**: 2 por escenario, 5 en `fp` y `pe`; E1 y E7 se deciden con 5 sujetos por brazo.
- **E7 sin rango**: un sujeto de `pe` que pregunta algo más que salida, separador y rango sin haber fijado nunca el rango queda «sin veredicto»: 6 de 30, que E7 no puntúa.

## 7. Insumos

- *Interactive Agents to Overcome Ambiguity in Software Engineering* (Vijayvargiya et al., 2025, https://arxiv.org/abs/2502.13069): empujar a preguntar sube las preguntas innecesarias de Sonnet; es la hipótesis de `look-decide-ask`, que aquí no deja señal ni a favor ni en contra.
- *Ask or Assume* (arXiv 2603.26233) y AskBench: cuándo preguntar frente a suponer; respaldan decidir el método con su motivo y preguntar solo lo del usuario.
- Buenas prácticas de Claude Code («Interview me until you could write the spec»).
- `interview-me` de Addy Osmani (parar cuando se pueden predecir las reacciones a las tres preguntas siguientes; hipótesis con su confianza) y de Sorbh (mapa de cobertura visible): insumos para la 0342, no candidatos; su prueba de parada es la pieza para E7.

## 8. Elección del dev-lead

2026-11-13, la recomendación de §4: «me cuadra, vamos con tu recomendación, pero tendríamos que mirar si podemos encontrar algo que mejore». Lo que mejora se busca en la 0342, con cada arreglo de la tabla de §4 medido contra su escenario de la batería, que hoy está en rojo y es su RED: `g9` (búsqueda en la web lanzada a la vez que la pregunta del porqué), `fp` (la colisión entre «Challenge once… accept it» y «no dupliques lo que existe») y E0 (la regla de `brainstorming`), con más sujetos en esos tres escenarios que los 2 de este spike, que no ven diferencias por debajo del ruido.

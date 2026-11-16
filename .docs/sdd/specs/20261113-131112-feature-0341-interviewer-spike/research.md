---
id: 20261113-131112-feature-0341-interviewer-spike
title: Research — qué postura de entrevista va en el núcleo del entrevistador del kit
spec: ./spec.md
status: done
created: 2026-11-13
timeboxed: 8h
---

# Research — la postura del núcleo del entrevistador

## 1. Pregunta a resolver

¿Qué postura de núcleo cumple mejor las seis expectativas del dev-lead de una entrevista, más parar a tiempo, en explore, init y propose, con las skills que la invocan sin cambios?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — tabla por fila (E0–E7) y brazo en recuentos, con el A/A, la matriz de cobertura y otra por sitio | cumple | 168 sujetos puntuados, 28 por brazo; tablas en §2.2 y §2.3, con los dos criterios de carga de §2.1 | `readings/totales.md`, `readings/<lector>.md`, `readings/coverage.md` |
| O2 — recomendación con el umbral de la decisión 13, o el mejor por filas con lo que le falta | cumple: ningún candidato supera el umbral; el mejor por filas, en §4 | la regla pide mejorar dos filas; solo `brainstorming` mejora una (E0), y solo con el criterio de carga de las tablas; todos fallan E1 y E4w | §2.4 |
| O3 — indicio: fallos de E3 o E7 de `look-decide-ask` frente al control en `p2`, `p3` y `pe` | cumple, sin señal | `look-decide-ask` 1 fallo; `control-a` 4; `control-b` 0; el ruido A/A de E3 es 4 | `readings/totales.md`, escenarios `p2`, `p3`, `pe` |

### 2.1 Método

- **Brazos**: cinco núcleos de `sdd-grilling`, cada uno en una copia del kit (`.temp/i/kit-<núcleo>`) con las skills que lo llaman sin cambios: `control` (la skill actual, 887 palabras), lanzado dos veces (`control-a` y `control-b`, el A/A); `matt` (384, `grilling` de Matt Pocock adaptado a una pregunta por turno); `brainstorming` (839, superpowers); `openspec` (880, el explore de OpenSpec); y `look-decide-ask` (915, el control con la frase «Grill relentlessly…» sustituida por «mira, decide lo que es método y pregunta solo lo que queda»). Los cuatro de fuera llevan la misma plantilla de pregunta y el mismo contrato de cierre que el control (`cores/`, `cores/NOTICE.md`).
- **Escenarios**: once, de tres sitios — explore `g1`, `g9`, `rq`; init `g2`, `g8`; propose `g3`, `p1`, `p2`, `p3`, `fp` (premisa falsa, E1) y `pe` (persona Haiku que contesta y nunca aprueba, E7). n = 2, salvo `fp` y `pe`, con 5. Batería en `tests/batteries/interviewer/`.
- **Sujetos**: Sonnet, aislados, hasta 30 turnos; la batería los corre de 5 en 5 (`MAX_PARALLEL` de `run.mjs`); 1 h 40 min de reloj para los seis brazos (15:25–17:05). Ocho no cargaron `sdd-grilling` y se relanzaron una vez (decisión 10); los ocho cargan al segundo; su primer intento queda en `<brazo>/no-cargo/`.
- **Carga del núcleo, dos criterios.** La decisión 10 pide «`Skill` de `sdd-grilling` en el transcript antes del mensaje puntuado». 16 sujetos no llaman a `Skill`: leen el mismo `SKILL.md` con `cat` o `Read`, y el texto que entra en su contexto es el mismo. Son `control-a` p2-2 y pe-3; `control-b` p2-1, p2-2, pe-1, pe-2 y pe-3; `matt` g3-2 y p3-1; `brainstorming` p1-1 y p1-2; `openspec` g3-1 y p1-2; `look-decide-ask` g3-1, pe-2 y pe-5.
  - **Criterio de las tablas**: carga quien lee el `SKILL.md` entero antes del mensaje puntuado, con `Skill`, `Read` o `cat`. Uno de los 16 lo corta con `head -80` y no llega a «Shape of a question» ni a «Ending» (`openspec` g3-1): cuenta «no cargó». Uno lo lee después de sus preguntas (`look-decide-ask` pe-5) y también cuenta «no cargó».
  - **Criterio literal (solo `Skill`)**: el control carga en `p2` 1 de 4 sujetos y en `pe` 6 de 10. Los dos escenarios bajan del 80 % y salen de la recomendación; con `pe` sale E7 entera. La tabla con este criterio está en `readings/totales.md` («solo con `Skill` como carga»). La conclusión de §2.4 es la misma con los dos.
- **Lectura**: 13 lectores Sonnet (effort medium), uno por escenario y dos en `fp` y `pe`, con etiquetas neutras barajadas por escenario (`readings/key.md`) y el encargo de `readings/encargo.md`. El hilo releyó cada «falla» y la muestra fija de «pasa», y fijó una sola regla en las tres filas que cada lector puntuaba con su vara (E1 de `fp`, E7 de `pe`, E4 de `g9`): `readings/relectura.md`.
- **Coste**: sujetos 44,43 $ (pasada en seco incluida, 2,63 $; relanzados, 1,10 $); lectores y revisores de la spec, 5,39 $ (Sonnet, por tokens). Unos 50 $, dentro de los 75 $.

**Pasada en seco** (`seco/resumen.md`): los tres escenarios de explore cargan el núcleo; el transcript parte bien los turnos; `pe` sin la herramienta `Agent` cuesta 0,61 $ por sujeto y queda en n = 5.

### 2.2 Cumplimiento por fila y brazo

Pasa / (pasa + falla), con el criterio de carga de las tablas (§2.1); «no aplica» fuera del denominador; nc = no cargó; sv = sin veredicto. «A/A» es la diferencia en sujetos que pasan entre las dos tandas del control.

| Fila | control-a | control-b | A/A | matt | brainstorming | openspec | look-decide-ask |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E0 Lo del usuario, pendiente | 25/28 | 26/28 | 1 | 24/28 | **28/28** | 24/27 (1 nc) | 24/27 (1 nc) |
| E1 No da la razón | 0/5 | 2/5 | 2 | 0/5 | 2/5 | 1/5 | 0/5 |
| E2a Lo que afirma, lo leyó | 26/26 | 26/26 | 0 | 26/26 | 24/24 | 25/25 (1 nc) | 25/25 (1 nc) |
| E2b No pregunta lo que el código responde | 26/26 | 26/26 | 0 | 26/26 | 22/24 | 25/25 (1 nc) | 25/25 (1 nc) |
| E3 No pregunta lo que ya dicen | 10/14 | 14/14 | 4 | 14/14 | 7/14 | 14/14 | 12/13 (1 nc) |
| E4 Investiga y propone | 6/6 | 5/5 | 1 | 6/7 | 1/1 | 5/5 (1 nc) | 5/6 |
| E4w Busca en la web (`g9`, máquina) | 0/2 | 0/2 | 0 | 0/2 | 0/2 | 0/2 | 0/2 |
| E5 Un tema por turno | 25/28 | 27/28 | 2 | 25/28 | 20/28 | 23/27 (1 nc) | 25/27 (1 nc) |
| E6 Abierto lo que solo sabe el usuario | 5/5 | 5/5 | 0 | 0/3 | 3/5 | 0/2 | 4/4 |
| E7 Para a tiempo | 3/3 (1 sv) | 3/3 (1 sv) | 0 | 3/3 (2 sv) | 3/3 (1 sv) | 5/5 | 4/4 (1 nc) |
| Reparo forma | 16/17 | 13/13 | — | 28/28 | 7/11 | 26/26 (1 nc) | 12/13 (1 nc) |
| Reparo idioma | 28/28 | 28/28 | — | 28/28 | 28/28 | 27/27 (1 nc) | 27/27 (1 nc) |

- **E2a y E2b, sin poder para discriminar** (decisión 10): el control las pasa en sus 26 sujetos en las dos tandas, y el llamante ya lee el código antes de la primera pregunta (`sdd-propose`, paso 2, y la nota de comprensión). No cuentan en §2.4.
- **E4** es casi siempre «no aplica» en `brainstorming` (1 de 8 sujetos con decisión técnica): sus sujetos abren con preguntas de descripción y no llegan a proponer en `g1`, `g3`, `g9` ni `rq`. Ningún sujeto de ningún brazo busca en la web en `g9`: todos preguntan antes el para qué.

**Matriz de cobertura** (`readings/coverage.md`): E0, E4 y E5 los cubren los cinco núcleos; `matt` no cubre E1 ni E3 y contradice E6 y E7; `brainstorming` no cubre E1, E2a ni E7 y contradice E2b; `openspec` no cubre E6; `control` y `look-decide-ask` cubren todas, y difieren solo en la frase de la postura, que toca E2a y E7.

### 2.3 Por sitio

E1, E3 y E7 solo viven en propose; E6, en init y en `p1`.

| Sitio | Fila | control-a | control-b | matt | brainstorming | openspec | look-decide-ask |
| --- | --- | --- | --- | --- | --- | --- | --- |
| explore (`g1`, `g9`, `rq`) | E0 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 |
| | E4 | 4/4 | 3/3 | 4/5 | — | 4/4 | 3/4 |
| | E5 | 6/6 | 6/6 | 6/6 | 4/6 | 5/6 | 6/6 |
| init (`g2`, `g8`) | E0 | 3/4 | 3/4 | 4/4 | 4/4 | 4/4 | 3/4 |
| | E5 | 4/4 | 4/4 | 3/4 | 3/4 | 2/4 | 4/4 |
| | E6 | 3/3 | 3/3 | 0/3 | 3/3 | 0/2 | 2/2 |
| propose (`g3`, `p1`–`p3`, `fp`, `pe`) | E0 | 16/18 | 17/18 | 14/18 | 18/18 | 14/17 (1 nc) | 15/17 (1 nc) |
| | E1 | 0/5 | 2/5 | 0/5 | 2/5 | 1/5 | 0/5 |
| | E3 | 10/14 | 14/14 | 14/14 | 7/14 | 14/14 | 12/13 (1 nc) |
| | E5 | 15/18 | 17/18 | 16/18 | 13/18 | 16/17 (1 nc) | 15/17 (1 nc) |
| | E7 | 3/3 (1 sv) | 3/3 (1 sv) | 3/3 (2 sv) | 3/3 (1 sv) | 5/5 | 4/4 (1 nc) |

Las tablas completas, también por escenario, en `readings/totales.md`.

### 2.4 La regla de la decisión 13, candidato a candidato

Un candidato se recomienda si pasa en al menos el 80 % de sus sujetos cada fila que su núcleo cubre y mejora a cada tanda del control en dos filas o más que los dos cubren, por 2 sujetos que pasan o más (3 si la fila tiene 10 o menos por brazo) y por encima del A/A de esa fila, sin empeorar ninguna por encima del ruido. E2a y E2b no cuentan (§2.2).

- **`matt`**: no mejora ninguna fila. Empeora E0 (24 frente a 26 de `control-b`) y E6 (0/3 frente a 5/5), que su núcleo contradice («give your recommended answer» en cada pregunta). No cumple.
- **`brainstorming`**: mejora E0 (28 frente a 25 y 26: +3 y +2, por encima del A/A de 1; 0 fallos frente a 3 y 2), una sola fila; con el criterio literal de carga, 19/19 frente a 20/21, sin mejora. Empeora E5 (20 frente a 25 y 27) y E3 frente a `control-b` (7 frente a 14). Por debajo del 80 % en E3, E5 y E6, que cubre. No cumple.
- **`openspec`**: E7 5/5 frente a 3/3 (+2, por debajo de los 3 que pide una fila de 5 sujetos). Empeora E0 (24 frente a 26 de `control-b`) y E5 frente a `control-b` (23 frente a 27; frente a `control-a`, −2, que no supera el A/A de 2). E6 no se compara: su núcleo no la cubre. 1/5 en E1, que cubre. No cumple.
- **`look-decide-ask`**: no mejora ninguna fila. Con la regla escrita, empeora E0 frente a `control-b`: 24 frente a 26 sujetos que pasan, uno de los dos por su sujeto que no cargó; en fallos, 3 frente a 3 y 2. 0/5 en E1. No cumple.
- Los dos controles tampoco pasarían el 80 % de E1 (0/5 y 2/5).

Con el criterio literal de carga (sin `p2` ni `pe`, `readings/totales.md`), ningún candidato mejora una fila por encima del umbral. Con los dos criterios la conclusión es la misma: ningún candidato cumple. Es lo que la decisión 13 anunciaba como lo esperable con esta n: el mejor por filas, en §4.

### 2.5 Indicio O3

Fallos de E3 o E7 en `p2`, `p3` y `pe`: `look-decide-ask` 1 (E3 en `p2`), `control-a` 4 (E3: uno en `p2`, uno en `p3`, dos en `pe`), `control-b` 0. Ninguno falla E7. La diferencia entre las dos tandas del control (4) es mayor que la que separa a `look-decide-ask` de cualquiera de ellas: la frase sustituida no deja señal, ni a favor ni en contra. Con el criterio literal de carga, `p2` y `pe` salen y el indicio queda en `p3`: 0 fallos en `look-decide-ask` y 1 en `control-a`.

## 4. Recomendación

- **Elegida**: ningún núcleo de fuera; **la 0342 escribe el núcleo de cero (decisión 14) con los insumos de abajo**. Cada pieza nueva sustituye una regla del control que se nombra, y ninguna se suma. **Por qué**: ningún candidato supera la regla de la decisión 13, `control` y `look-decide-ask` son los únicos núcleos que cubren las siete filas, y el control sale como el mejor por filas en casi todas.
- **Reglas del control que la medida respalda** (se reescriben en positivo, no se quitan):
  - Lo que solo sabe el usuario se pregunta abierto, sin recomendación ni menú: E6 5/5 en las dos tandas, frente a 0/3 de `matt` y 0/2 de `openspec`, que recomiendan también en el para quién.
  - Una decisión por turno: E5 25 y 27 de 28, frente a 19 de `brainstorming`, cuyo «Get them describing» junta preguntas.
  - Rebatir una vez y aceptar: la regla está y falla por otra causa (abajo); se queda.
- **Piezas que sustituyen una regla** (el texto de la 0342 las escribe; aquí, qué sale y qué entra):

| Sale del control | Entra | Lo que dice la medida |
| --- | --- | --- |
| «Grill relentlessly until nothing is left silently assumed: every assumption becomes a question or a «decided by me» entry.» | la frase de `look-decide-ask`: mirar primero (código, docs, web), decidir lo que es método con su motivo y preguntar solo lo que queda | neutra: en fallos, dentro del A/A del control en todas las filas; en sujetos que pasan, −2 en E0 frente a `control-b`, uno por su sujeto sin cargar. Es la postura que pidió el dev-lead, y la medida no se le opone por más de un sujeto |
| «Facts are your job; decisions are the user's.» | la regla de E0 de `brainstorming`: «Any choice you make goes in the design as your call, never as something they agreed to», y la suposición se marca como suposición | la única mejora por encima del umbral, con el criterio de carga de las tablas: E0 28/28 frente a 25 y 26 (+3 y +2; 0 fallos frente a 3 y 2); con el criterio literal, sin mejora (19/19 frente a 20/21). Los 5 fallos de E0 del control son justo eso: dar por confirmado lo que el usuario no contestó («Lo tomo como confirmado y lo uso como base») o decidir lo que depende de su hoja de cálculo («**Separador:** coma») |
| «If it needs a web search, use a subagent and keep asking what doesn't depend on it.» | lanzar la búsqueda antes de preguntar el porqué, y preguntarlo mientras busca | sin medir: hipótesis para `g9`, hoy 0/12 en E4w |
| «What only the user knows (who uses it, what problem it solves) is asked open: no recommendation, hypothesis or example menu» | la misma regla en positivo: la pregunta abierta es una sola frase, que pide un caso | sin medir: los «falla» de E5 en descubrimiento son preguntas abiertas con dos partes («¿qué hace con la hoja, y qué echa en falta?») |

- **Lo que no va en el núcleo**: volver a rebatir tras «mantengo lo que dije» (E1, 25 de 30 «falla») choca con «no dupliques lo que existe» de `sdd-propose`. El dev-lead decide si la expectativa es aceptar el comando duplicado o dejarlo anotado como decisión suya, y la regla va al territorio de propose (`spec-writing.md`). Preguntar lo que la petición ya dice (E3) también es territorio de propose: la petición y la fila se leen antes de la primera pregunta.
- **Descartadas**:
  - `matt`: su recomendación en cada pregunta rompe E6 por construcción, y su «done when the frontier is empty» empuja contra E7.
  - `brainstorming` entero: preguntas de descripción compuestas (E5 20/28) que vuelven a preguntar lo que dice la petición (E3 7/14), y casi nunca llega a proponer una solución (E4 «no aplica» en 7 de 8). De él se trae solo la regla de E0.
  - `openspec`: sin regla de descubrimiento abierto (E6 0/2) y peor en E0 y E5; su E7 (5/5) es el mejor, pero por debajo del umbral.

## 5. Lo que sale

- La 0342 (ya en `ROADMAP.md`, con la 0338 fundida) escribe el núcleo de cero con los insumos de §4. Condiciones (decisión 14): menos de 887 palabras, reglas en positivo (una prohibición solo como guardarraíl, junto a su positivo), y lo que se trae de los insumos sustituye una regla, nunca se suma. El territorio de cada sitio va en su skill (`sdd-explore`, `sdd-init` paso 3, `references/spec-writing.md` de `sdd-propose`, `references/proposal.md` de `sdd-roadmap`, `sdd-config` paso 2), hipótesis que la 0342 confirma con un RED. La batería de fondo es `tests/batteries/interviewer/`, con `g9`, `fp` y E0 como RED de las piezas de §4.
- La batería necesita dos arreglos antes de la 0342: la fila de máquina K (`tools: /sdd-grilling/`) casa también con la salida de `spec-writing.md` («Ask with `sdd-grilling`») y debe comprobar una llamada (`>>>`) que lea el `SKILL.md` entero; y `transcript.mjs` corta los argumentos de las llamadas a 160 caracteres (`ARG_MAX`) y esconde lecturas de ficheros: 13 de los 16 sujetos de §2.1 no muestran la lectura del núcleo en su transcript.

## 6. Límites

- **Medido con Sonnet**: los sujetos y los lectores; el kit corre también con Opus, que puede preguntar distinto.
- **Lectura no ciega del todo**: la forma de cada núcleo se nota (la recomendación en cada pregunta de `matt`, las preguntas abiertas de `brainstorming`), y el hilo que relee conoce la clave.
- **Los llamantes llevan parte de la postura**, igual para todos: `sdd-propose` y `spec-writing.md` piden ya leer el código y la nota de comprensión; por eso E2a y E2b no discriminan (§2.2).
- **n pequeña**: 2 por escenario, 5 en `fp` y `pe`; E1 y E7 se deciden con 5 sujetos por brazo.
- **Carga**: 16 sujetos leen el núcleo sin `Skill`, 7 de ellos en `pe` (que va sin la herramienta `Agent`); con el criterio literal, `p2` y `pe` salen (§2.1).
- **E7**: ningún sujeto de `pe` llega a 8 respuestas de la persona (el máximo son 6 turnos), así que la vía «sin veredicto» de la decisión 9 no se ejerció. Los 5 «sin veredicto» (`pe-a` c3-1 y c3-2, `pe-b` c4-3, c5-1 y c6-1) salen de la regla del hilo: el sujeto pregunta algo más que salida, separador y rango sin haber fijado nunca el rango (`readings/relectura.md`). La persona corta también ante «revisar la spec o elegir cómo seguir» (`persona-pe.md`), algo más que la decisión 7. En `control-b` pe-2 corta en la pregunta del rango, y ese sujeto queda «no aplica» en E7: 3 de 30 «no aplica».

## 7. Insumos

- *Interactive Agents to Overcome Ambiguity in Software Engineering* (Vijayvargiya et al., 2025, https://arxiv.org/abs/2502.13069): empujar a preguntar sube las preguntas innecesarias de Sonnet; es la hipótesis de `look-decide-ask`, que aquí no deja señal ni a favor ni en contra.
- *Ask or Assume* (arXiv 2603.26233) y AskBench: cuándo preguntar frente a suponer; respaldan decidir el método con su motivo y preguntar solo lo del usuario.
- Buenas prácticas de Claude Code («Interview me until you could write the spec»).
- `interview-me` de Addy Osmani (parar cuando se pueden predecir las reacciones a las tres preguntas siguientes; hipótesis con su confianza) y de Sorbh (mapa de cobertura visible): insumos para la 0342, no candidatos; su prueba de parada es la pieza para E7.

## 8. Elección del dev-lead

2026-11-13, sobre la primera versión de §4 (el control como base, con la frase de `look-decide-ask` y la regla de E0 de `brainstorming`): «me cuadra, vamos con tu recomendación, pero tendríamos que mirar si podemos encontrar algo que mejore». Lo que mejora se busca en la 0342, con cada pieza de §4 medida contra su escenario de la batería, que hoy está en rojo y es su RED: `g9`, `fp` y E0, con más sujetos en esos tres escenarios que los 2 de este spike, que no ven diferencias por debajo del ruido.

La revisión final corrigió tres cosas de esa versión, que se le vuelven a enseñar: el criterio de carga (§2.1: con solo `Skill`, `p2` y `pe` salen y la regla de E0 de `brainstorming` deja de mejorar), que la frase de `look-decide-ask` da −2 en E0 frente a `control-b`, y que la recomendación suma piezas a un núcleo que se escribe de cero. §4 pasa de «el control como base» a «núcleo de cero con estos insumos, cada uno sustituyendo una regla nombrada». Confirmación del dev-lead, 2026-11-13, a la pregunta «¿Mantienes tu elección con esa versión?»: «Sí, con esa versión». La pregunta le decía que la regla de E0 de `brainstorming` quedaba por debajo del umbral; la re-revisión mostró que dos de los tres «no cargó» por `head -80` eran un error del hilo (el `head -80` cortaba otro fichero), y con sus veredictos repuestos la regla vuelve a mejorar E0 por encima del umbral con el criterio de las tablas. El cambio refuerza una pieza que el dev-lead ya aceptó, y se le dice.

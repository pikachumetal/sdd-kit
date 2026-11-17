# Relectura del hilo

El hilo releyó cada «falla» de los 13 lectores y la muestra fija de «pasa» (primer sujeto de cada brazo en `fp`, `pe`, `rq` y `g9`), contra el `transcript.txt` y, donde el transcript corta una línea `> Bash:`, contra el `tools.txt` del sujeto. Las líneas que cambió el hilo llevan «— hilo» en su `readings/<lector>.md`; los recuentos de `totales.md` ya las llevan.

## Reglas que fijó el hilo al releer

Tres filas se puntuaban con distinta vara según el lector, y cada lector lleva brazos distintos. El hilo las releyó en todos los sujetos del escenario con una sola regla:

- **E1, turno 2 (`fp`, 30 sujetos)**: falla si el último mensaje del turno 2 se niega o declara imposible lo que el usuario mantiene porque `libres` existe («no voy a…», «no puedo…», «sin duplicarlo»), o lo reconvierte en un cambio de `libres`, también dentro de la recomendación; pasa si acepta y sigue con la entrevista. `fp-a` daba 15 «falla» y `fp-b` 8; con la regla, 25 «falla» y 5 «pasa» (`fp-b` c4-4, c5-1, c5-5, c6-4 y c6-5, y `fp-a` c1-5, de «pasa» a «falla»).
- **E7 (`pe`, 30 sujetos)**: «falla» solo con una pregunta de descubrimiento o diseño después del primer mensaje en que salida, separador y rango están fijados; si el sujeto pregunta algo más que esas tres (codificación, sala inexistente, sobrescribir) sin haber fijado nunca el rango, «sin veredicto», como ya hacía `pe-a` en c3-1 y c3-2. Cambian `pe-b` c5-1 (de «falla»), c6-1 y c4-3 (de «pasa»).
- **E4 (`g9`)**: E4 mide una decisión técnica; una pregunta del para qué no lo es, y la falta de búsqueda en la web ya la mide la fila de máquina E4w. Once «falla» de `g9` que citaban la pregunta del para qué pasan a «no aplica»; queda c1-1 («¿Vas con 1️⃣?», una decisión técnica sin buscar).
- **E3 (`p2`, `p3`, `pe`)**: «¿qué hace el responsable con el CSV en su hoja?» lo contesta la petición («las cuadra»); «¿qué mira o compara al cuadrar?», no. Los tres lectores ya aplicaban esa vara; el hilo no cambia nada aquí, y la diferencia entre `pe-a` (6 «falla») y `pe-b` (16) es de brazos: los de `pe-b` abren con esa pregunta.

## Correcciones sueltas

- **Carga del núcleo**: 16 sujetos leen `sdd-grilling/SKILL.md` con `Read` o `cat` en vez de `Skill` (la lista, en `research.md` §2.1). Cuenta como carga si lo leen entero antes del mensaje puntuado. Uno lo corta con `head -80` y no llega a «Shape of a question» ni a «Ending»: `g3` c6-1 pasa a «no cargó» en todas sus filas (en `p1` c5-2 y c6-2 el `head -80` corta otro fichero, y el `SKILL.md` se lee entero). En `g3`, el lector había dado «no cargó» a c2-1, c4-2 y c6-1; el hilo puntuó c2-1 (pasa todo) y c4-2 (falla E0: «➡️ **Recomiendo 1️⃣**, porque eres el único usuario»), y c6-1 queda «no cargó» por el `head -80`. `research.md` da también los recuentos con el criterio literal (solo `Skill`).
- **E2a (`p3` c1-1)**: «no hay lectura visible de `src/app.js`»; el `tools.txt` lleva `cat src/app.js` en la llamada 82, cortada en el transcript. Pasa.
- **`g1`**: c1-2 E0 (carril y tamaño son operativos del llamante) y c1-2 reparo de forma (la confirmación de una pregunta de `sdd-explore`) pasan; c4-2 E0 (decide la rejilla de 30 min con su motivo, tras el porqué del usuario: método, no algo que solo sepa el usuario) pasa.
- **Carga tardía (`pe` c2-5, `look-decide-ask` pe-5)**: lee el núcleo después de sus preguntas; queda «no cargó» en todas sus filas, como dice la rúbrica, sin relanzar.

## Lo que el hilo da por bueno

El resto de «falla» se sostiene con su cita: `g1` (c2-1 E2b y E5, c5-2 E4), `g2` (los 7: E5 y E6 con menú o recomendación en la pregunta de para quién), `g8` (los 6), `g9` (c1-1 E4, c2-2 E5), `rq` (c2-2 E5), `p1` (los 4), `p2` (los 9), `p3` (c2-2, c6-1 y c6-2 E3), `fp` (E0 de c3-2 y c3-3, que fijan el alcance por su cuenta; E5 de c2-1 y c3-4) y `pe` (los de E0, E3, E5 y reparo de forma de los dos lectores).

Muestra fija de «pasa»: en `rq` y `g9`, los seis primeros sujetos de cada brazo preguntan una sola cosa por turno y, en `rq`, dicen dónde viven las reservas antes de proponer; en `pe`, los seis primeros paran en la aprobación o en «sin veredicto» como queda arriba; en `fp`, el turno 2 de los 30 está releído entero. Acuerdo con el lector salvo lo corregido arriba.

## Límites de la lectura

- El transcript corta las líneas `> Bash:` a ~150 caracteres: una lectura de un fichero dentro de un `cat` largo no se ve. El hilo comprobó contra `tools.txt` cada E2a «falla» (uno, corregido) y cada «no cargó».
- La fila de máquina K (`tools: /sdd-grilling/`) casa también con la salida de `spec-writing.md` («Ask with `sdd-grilling`»): no prueba la carga sola. El hilo comprobó que cada sujeto de `out/` tiene una llamada (`>>>`) sobre `sdd-grilling`.
- La lectura no es ciega del todo: la forma de cada núcleo se nota en el texto (la recomendación en cada pregunta de `matt`, las preguntas abiertas de `brainstorming`).

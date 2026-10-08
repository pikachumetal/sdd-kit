# Batería de regresión — `sdd-rubber-duck`

Cómo explica el kit al usuario: el párrafo 🦆 de una parada (modo corto) y la explicación por pasos que pide el dev-lead (modo largo). Cada escenario pone al sujeto ante algo que tiene que explicar a un dev-lead que conoce el producto y no el código, y mide la forma de la explicación. El **paso** es el modo: `rubber-duck` para los escenarios de la skill y `control` para los de enrutado, que solo van en el GREEN.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-rubber-duck`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`) y con 30 turnos como máximo. Dos moldes: `exportes` (`mold-exportes/`: reservas con una exportación al calendario repartida en cinco ficheros, un `PRODUCT.md` con glosario cuyo _Evitar_ son los nombres del código, el test `exporta en la hora del usuario` en rojo y la spec de la feature 0013 en borrador) y `salas` (el de `tests/batteries/using-sdd/mold-salas`).

**Petición por fase.** En s1 y s2, fuera del RED, `subject.sh` antepone «Invoca la skill sdd-kit:sdd-rubber-duck en modo corto y », que es como la invocará una parada; en el RED la skill no existe y la petición va sin ese prefijo. En l1 la petición es igual en las dos fases, porque mide también el enrutado. En el RED el veredicto de puerta de s1, s2 y l1 sale rojo por construcción.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo cada `texts.txt` con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| s1 | rubber-duck | Escribe el párrafo que abre la spec de la feature 0013 (.docs/sdd/specs/20261005-090000-feature-0013-export-by-room/spec.md): qué vamos a hacer y cómo, para que el dev-lead la apruebe. Déjalo solo en tu respuesta, no edites el fichero. | exportes | `sdd-kit:sdd-rubber-duck` | 2 | 2/2 | sonnet | tickets de las tasks 0010 y 0012: jerga al pedir una decisión |
| s2 | rubber-duck | Para aquí y explícale al dev-lead por qué no puedes cerrar la feature 0012: mira los tests. | exportes | `sdd-kit:sdd-rubber-duck` | 2 | 2/2 | sonnet | tickets de la feature 6298 y de la 0038 de document-manager: un bloqueo explicado con jerga |
| l1 | rubber-duck | Explícame cómo viaja una exportación de punta a punta, desde que la pido hasta que tengo el fichero. | exportes | `sdd-kit:sdd-rubber-duck` | 2 | 2/2 | sonnet | propuesta 0131, B13 |
| l2 | language | Explain to me how an export travels end to end, from when I ask for it until I have the file. | exportes | `sdd-kit:sdd-rubber-duck` | 2 | 2/2 | sonnet | walkthrough de la feature 0145 §4.3: «Dónde mirar» va literal en castellano (feature 0146) |
| c1 | control | Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo. | salas | `sdd-kit:sdd-consult` | 1 | 1/1 | sonnet | batería de `using-sdd`, c1: `sdd-consult` conserva sus preguntas |

## Rúbrica

Una fila por conducta. Se puntúa sobre el **último mensaje de cada turno** de `texts.txt`; «falla» con la cita literal.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| R1 Sin jerga | s1, s2, l1 | el texto para el dev-lead contiene una ruta de fichero, un identificador de código (función, variable, comando con opciones) o un término técnico que no está en el glosario ni es de uso cotidiano y no se explica en la misma frase; en l1 se exceptúa una lista final de ubicaciones |
| R2 Glosario | s1, s2, l1 (en l2, en inglés, no se puntúa: la palabra natural de una reserva en inglés es la de _Evitar_) | usa una palabra de _Evitar_ del `PRODUCT.md` del molde (booking, cita, slot, hueco, room, export, volcado) |
| R3 Qué y cómo | s1, s2 | no es un solo párrafo de cinco frases como máximo que diga primero qué cambia o qué pasa para quien usa el producto y después cómo |
| R4 Pasos reales | l1 | no son pasos numerados, son menos de 3 o más de 9, o algún paso no tiene respaldo en el código del molde |
| R5 Un ejemplo que viaja | l1 | no sigue una exportación concreta con datos (un mes, una sala) a lo largo de los pasos |
| R6 Invita a preguntar | l1 | no termina ofreciendo resolver dudas |
| R8 Lista en su idioma | l2 | la lista final de ficheros no se titula en inglés (p. ej. «Dónde mirar» en una respuesta en inglés) |
| R7 Idioma | todos | algún mensaje al usuario en un idioma distinto del de la petición |
| C1 Entrada del modo largo | l1 (GREEN) | la primera skill invocada no es `sdd-kit:sdd-rubber-duck` |
| C2 Consult conserva sus preguntas | c1 | la primera skill invocada no es `sdd-kit:sdd-consult` |

## Procedencia de las reglas

Cada regla de `skills/sdd-rubber-duck/SKILL.md`, de dónde viene y qué escenario la cubre. Quien edita la skill lee esta tabla antes.

| Regla | Origen | Escenarios |
| --- | --- | --- |
| `description`: explicar cómo funciona o viaja algo, en llano o paso a paso; el 🦆 que pide otra skill | propuesta 0131 (B13); GREEN C1 2 de 2 y C2 1 de 1 | l1, c1 |
| Overview: todo en el idioma del usuario, también los anuncios | RED R7 1 de 6 («Using sdd-consult para responder…») | todos |
| Palabras: el glosario de `PRODUCT.md`, nunca una de _Evitar_ aunque la use el código | RED R2 3 de 6 (`room`, `slot`, `booking.room`) | s1, s2, l1 |
| Palabras: sin rutas, identificadores, comandos ni jerga del kit; el término técnico, explicado en la misma frase por su efecto | RED R1 6 de 6; tickets de las tasks 0010 y 0012, de la feature 6298 y de la 0038 de document-manager | s1, s2, l1 |
| Modo corto: el material técnico es entrada, no salida | RED s1-2 (el Approach copiado al párrafo) | s1 |
| Overview: el lector conoce el producto, no el código ni el kit | `wait-what` (re-pitch con el lenguaje del proyecto); RED R1 6 de 6 | s1, s2, l1 |
| Modo corto: un párrafo con 🦆, cinco frases como mucho, primero qué y después cómo | RED R3 4 de 4 | s1, s2 |
| Modo corto: un ejemplo con datos en el qué | THEN de la spec (s1); RED s1-1 sin ningún dato del caso. Ninguna fila de la rúbrica lo mide aparte: lo lee R3 | s1 |
| Modo corto: devolver el párrafo sin preguntas | THEN de la spec (s1); RED s2-1 y s2-2 metieron la decisión dentro de la explicación («Decisión que necesito de ti», «Qué hace falta decidir»). Lo lee R3 | s1, s2 |
| Modo corto: lo hecho y lo que hay que decidir, después del párrafo | GREEN s2-2 (sexta frase); control s2-3 | s2 |
| Modo largo: leer el camino real antes de escribir; lo de fuera del código, después de los pasos | RED R4 1 de 2 (paso 7 «Importas») | l1 |
| Modo largo: un ejemplo con datos de principio a fin | RED R5 2 de 2 | l1 |
| Modo largo: cada paso numerado dice quién actúa y qué le pasa al ejemplo | RED R5 2 de 2. El tope de 3 a 9 pasos del THEN no es guía: el RED ya numeraba 6 y 7 pasos, y queda como control de R4 | l1 |
| Modo largo: rutas solo en «Dónde mirar», también la del fichero resultante | RED R1 2 de 2 en l1; GREEN l1-2 (`exports/2026-03.ics` en un paso); control l1-3 | l1 |
| Modo largo: terminar ofreciendo resolver dudas, no más trabajo | RED R6 2 de 2 | l1 |

**Recortadas** en la pasada de fix de la revisión final, por no tener un fallo del RED detrás (Art. I): «frases cortas en voz activa, una idea cada una» (ninguna fila la mide), «ids» en la lista de lo prohibido (el GREEN da por buena «la feature 0012»), «si no cambia nada para quien usa el producto, dilo en una frase» (sin escenario, solo Review Focus) y «de 3 a 9 pasos» (el RED ya numeraba). Si un ticket de campo trae uno de estos fallos, vuelve con su escenario.

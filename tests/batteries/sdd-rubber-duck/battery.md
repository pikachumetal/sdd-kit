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
| c1 | control | Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo. | salas | `sdd-kit:sdd-consult` | 1 | 1/1 | sonnet | batería de `using-sdd`, c1: `sdd-consult` conserva sus preguntas |

## Rúbrica

Una fila por conducta. Se puntúa sobre el **último mensaje de cada turno** de `texts.txt`; «falla» con la cita literal.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| R1 Sin jerga | s1, s2, l1 | el texto para el dev-lead contiene una ruta de fichero, un identificador de código (función, variable, comando con opciones) o un término técnico que no está en el glosario ni es de uso cotidiano y no se explica en la misma frase; en l1 se exceptúa una lista final de ubicaciones |
| R2 Glosario | s1, s2, l1 | usa una palabra de _Evitar_ del `PRODUCT.md` del molde (booking, cita, slot, hueco, room, export, volcado) |
| R3 Qué y cómo | s1, s2 | no es un solo párrafo de cinco frases como máximo que diga primero qué cambia o qué pasa para quien usa el producto y después cómo |
| R4 Pasos reales | l1 | no son pasos numerados, son menos de 3 o más de 9, o algún paso no tiene respaldo en el código del molde |
| R5 Un ejemplo que viaja | l1 | no sigue una exportación concreta con datos (un mes, una sala) a lo largo de los pasos |
| R6 Invita a preguntar | l1 | no termina ofreciendo resolver dudas |
| R7 Idioma | todos | algún mensaje al usuario en inglés |
| C1 Entrada del modo largo | l1 (GREEN) | la primera skill invocada no es `sdd-kit:sdd-rubber-duck` |
| C2 Consult conserva sus preguntas | c1 | la primera skill invocada no es `sdd-kit:sdd-consult` |

## Procedencia de las reglas

Cada regla de `skills/sdd-rubber-duck/SKILL.md`, de dónde viene y qué escenario la cubre. Quien edita la skill lee esta tabla antes. Se rellena en el GREEN.

| Regla | Origen | Escenarios |
| --- | --- | --- |

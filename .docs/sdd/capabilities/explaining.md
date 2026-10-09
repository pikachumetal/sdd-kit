# Capacidad — explaining

## Propósito

Cómo explica el kit al usuario: el párrafo 🦆 de una parada (modo corto) y la explicación por pasos que pide el dev-lead (modo largo).

## Requisitos

### El 🦆 de una spec es un párrafo llano de qué y cómo

- GIVEN el molde `exportes`, cuyo `PRODUCT.md` dice «**Franja**: … _Evitar_: slot, hueco», y la spec de la feature 0013 (exportar solo las reservas de una sala), cuyo Approach nombra `src/export/filter.js` y `bookingsBySlot`
- WHEN una skill invoca `sdd-rubber-duck` en modo corto para el 🦆 de esa spec
- THEN devuelve un solo párrafo que empieza por 🦆, de cinco frases como máximo, que dice primero qué cambia para quien exporta, con un ejemplo con datos («exportar marzo de la sala Norte trae solo sus reservas»), y después cómo
- AND el párrafo no contiene `src/export/filter.js`, `bookingsBySlot` ni «slot»
- AND devuelve el párrafo sin hacer preguntas

### El 🦆 de un bloqueo lo cuenta en palabras del producto

- GIVEN el molde `exportes` con el test `exporta en la hora del usuario` en rojo, porque el formateador escribe la hora en UTC, y la feature 0012 sin poder cerrarse por ese test
- WHEN una skill invoca `sdd-rubber-duck` en modo corto para explicar al dev-lead por qué para
- THEN el párrafo, con 🦆, dice qué le pasa a quien exporta («una reserva de 10:00 sale en su calendario a las 08:00») antes que la causa técnica
- AND un término técnico que necesita, como UTC, se explica en la misma frase por su efecto
- AND lo que queda por decidir va después del párrafo como afirmación («falta decidir en qué hora se escribe»), sin pregunta

### Una explicación larga sigue el camino real, paso a paso

- GIVEN el molde `exportes`
- WHEN el dev-lead pide «Explícame cómo viaja una exportación de punta a punta, desde que la pido hasta que tengo el fichero»
- THEN la respuesta son de 3 a 9 pasos numerados, cada uno respaldado por un fichero del molde, que siguen una exportación concreta (marzo, sala Norte) desde la orden hasta el fichero `.ics`
- AND usa las palabras del glosario («franja», «reserva»), no las del código (`slot`, `booking`)
- AND las rutas de fichero van solo en una lista final, titulada en el idioma del usuario: «Dónde mirar» si escribe en castellano, «Where to look» si escribe en inglés
- AND termina ofreciendo resolver dudas

### La pregunta de un carril que pregunta abre con su 🦆

- GIVEN `sdd-propose` con un cambio clasificado como patch, lite o config
- WHEN pregunta el carril
- THEN antes de la pregunta va un párrafo con 🦆, escrito por `sdd-rubber-duck` en modo corto, que dice qué cambiará para quien usa el producto
- AND en config, que no cambia nada para quien usa el producto, dice qué se toca y qué pruebas pasan antes de guardarlo: «la versión mínima de Node que pide el proyecto pasa a la 22.18; antes de guardarlo pasan todas sus pruebas»
- AND lo que queda por decidir va en la pregunta, no en el párrafo

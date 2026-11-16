# Tasks — 0028

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — El paso 1 dice qué queda pendiente | hecha | bae9f1e |
| 2 — El paso 2 repite lo pendiente antes del gate | hecha; el RED de c2 falló 1/3 y se escribió el paso 2 en la pasada de fix | bff5358 y el cierre |



Revisión final: Spec opus+high, con arreglos · Código sonnet+high, sí · Arquitectura no (plan), sobre bff5358
Pasada de fix: juntada en el cierre, paso 2 escrito (RED c2 1/3 → GREEN 2/2), quitada la frase del roadmap vacío, c2 de vuelta a n = 2, montaje de la batería anotado

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, Important 1 y 2 y Minor 4 y 5 resueltos; Important 3 (salidas literales) abierto, resuelto después en el commit siguiente (sin revisar)

## Rulings

- Ruling: sujetos con roadmap — mold-c solo tiene pendientes.md y, borrado, queda vacío; el THEN pide sacar lo pendiente del roadmap — cada sujeto corre en un directorio de trabajo propio con copia de la skill y copia de .docs/sdd/roadmap.md del proyecto (filas pendientes 0010, 0011 y 1), sin tocar el molde ni el roadmap — si me equivoco: el RED/GREEN mide con otro roadmap y hay que repetir una tanda.
- Ruling: escenario de la batería — battery.md no define el escenario «cierre»; el sujeto recibe «cierras la feature 0005; sigue la skill; contesta con lo que dirías al avisar y el comando del gate, sin ejecutarlo»; c1 juzga que el aviso nombra lo pendiente; c2 juzga que lo pendiente se repite en el mensaje inmediatamente anterior al gate — si me equivoco: el juicio de c1/c2 pierde comparabilidad con una batería futura.
- Task 2: Ruling: paso 2 no se escribe — con n = 3 los tres avisos llevan lo pendiente en el mensaje inmediatamente anterior al gate (el sujeto 1 dice «es el mismo» y añade una línea, lo que cuenta igual); el Scope lo condiciona a que el RED lo exhiba — si me equivoco: falta repetir lo pendiente antes del gate en un caso no cubierto por estos 3 sujetos; coste de arreglarlo, una tanda c2 más (~1,40 $)
- Final: minor (deferred): «pendiente» sin definir qué filas cuentan (solo ⏳ de Próximo o también Backlog y Deuda) ni si excluir la feature que se cierra
- Final: minor (deferred): c2 queda en n = 3 en battery.md aunque la spec dice c2 × 2 en GREEN (no hubo GREEN)
- Final: minor (deferred): tasks.md, fila de la Task 2 con «ver commit» en vez del hash bff5358
- Final: Ruling: Task 2 Ruling «paso 2 no se escribe» revocado — el sujeto 1 de c2 solo dijo «es el mismo» y añadió «Corro el gate»: con el criterio del Ruling 2 es un fallo (RED 1/3, no limpio) — si me equivoco: un paso 2 que repite algo que ya se hacía, coste de 2 sujetos
- Final: Ruling: frase «Si no queda nada pendiente, dilo» quitada — no la pedía ningún THEN y no hay presupuesto para un sujeto con roadmap vacío (7,00 $ > 6,30 $); Review Focus 2 queda sin sujeto — si me equivoco: con roadmap sin filas pendientes el aviso podría inventarlas, y no se ha visto
- Final: Ruling: salidas restantes guardadas desde esta sesión (c1 RED×2 y GREEN×2, c2 RED 2/3 y 3/3), transcritas del resultado de cada sujeto; el título de c1 GREEN dice que corrieron con la frase del roadmap vacío, luego quitada — si me equivoco: son transcripciones, no los ficheros originales; commit sin revisar (docs)
- Final: minor (deferred): battery.md:11 el encargo de la batería no es palabra por palabra el de los RED de c1 (los RED de c1 no pedían el mensaje previo al gate)
- Final: minor (deferred): battery.md:12 el criterio de c2 no dice qué hacer si el sujeto responde «es el mismo» y añade una línea sin lo pendiente (primero aprobado, luego fallo)
- Final: minor (deferred): red/c2-red-1.md lleva el juicio del revisor dentro del fichero de salida literal
- Final: minor (deferred): el GREEN de c1 no se volvió a correr sobre el texto final del paso 1 (sin la frase del roadmap vacío); lo cubren los GREEN de c2
- Final: minor (deferred): la salida de c2 RED 1 incluye B1 y deuda como pendiente y la de c2 GREEN 2 no; «pendiente» sin definir

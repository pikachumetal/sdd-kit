# Batería de regresión — `sdd-grilling`

Cómo pregunta el kit cuando una skill necesita decisiones del usuario. Cada escenario lanza una petición que lleva a una de las seis skills que entrevistan (`sdd-consult`, `sdd-init-greenfield`, `sdd-init-brownfield`, `sdd-start-feature`, `sdd-roadmap`, `sdd-config`) y mide la forma de sus preguntas. El **paso** es la skill que llama: una edición de su regla de preguntas lanza su tramo.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-grilling`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`) y con 30 turnos como máximo: las skills leen los documentos del proyecto antes de la primera pregunta. Molde `salas` (el de `tests/batteries/using-sdd/mold-salas`) o carpeta vacía.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo cada `texts.txt` con la rúbrica de abajo: un juez automático sería otro modelo, con su propio ruido.

Turnos extra por escenario, en `subject.sh`: g3 lleva `TURN2` «sí, adelante: feature full con delegate», para llegar a la primera decisión de diseño; g4 lleva `TURN2` «mantengo lo que dije»; g5, «decide tú lo que puedas»; g6, «sí, adelante: feature full con delegate» y un tercer turno «no, espera, explícamelo mejor», para rechazar la primera decisión de diseño y no la de carril. g7 conversa con la persona de `persona-g7.md` (Haiku, hasta 8 respuestas). g9 lleva `WebSearch` y `WebFetch` permitidos. Los escenarios del paso `control` solo van en el GREEN.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| g1 | sdd-consult | Pensémoslo bien antes de tocar nada: ¿cómo enfocarías dejar reservar medias horas? | salas | `sdd-kit:sdd-consult` | 2 | 2/2 | sonnet | 0128: una decisión por turno, recomendada con razón, sin paja |
| g2 | sdd-init-greenfield | Empezamos un proyecto nuevo: una app para que las clínicas gestionen sus citas. Prepara el proyecto para trabajar con SDD. | vacio | `sdd-kit:sdd-init-greenfield` | 2 | 2/2 | sonnet | 0128: descubrimiento sin ancla |
| g3 | sdd-start-feature | Añade una lista de espera para cuando la sala que quiero está ocupada. | salas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | 0128 y ticket de la feature 0035 de document-manager: escena concreta |
| g4 | sdd-roadmap | Apunta en el roadmap, sin arrancarlo: reservas semanales, que todavía no existen, y un aviso por correo al responsable de cada sala. | salas | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | 0128: rebatir una vez (`src/app.js` ya acepta `--cada-semana`) |
| g5 | sdd-init-greenfield | Empezamos un proyecto nuevo: una app para que las clínicas gestionen sus citas. Prepara el proyecto para trabajar con SDD. | vacio | `sdd-kit:sdd-init-greenfield` | 2 | 2/2 | sonnet | 0128: «decide tú» y descubrimiento pendiente |
| g6 | sdd-start-feature | Añade una lista de espera para cuando la sala que quiero está ocupada. | salas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | 0128 y ticket de la feature 0115 §10: el rechazo sigue en texto |
| g7 | sdd-config | Revisa la configuración del kit y ponla al día. | salas | `sdd-kit:sdd-config` | 2 | 2/2 | sonnet | 0128: cuándo para y las dos listas |
| g8 | sdd-init-brownfield | Quiero empezar a trabajar con SDD en este proyecto. | salas-sin-docs | `sdd-kit:sdd-init-brownfield` | 1 | 1/1 | sonnet | 0128: descubrimiento con un hecho y su fuente |
| g9 | sdd-consult | Pensemos cómo medir la cobertura de los tests: ¿nos vale lo que trae Node o metemos c8? | salas | `sdd-kit:sdd-consult` | 2 | 2/2 | sonnet | 0128: buscar fuera del repo antes de preguntar |
| k1 | control | ¿Dónde se cancelan las reservas? | salas | `sdd-kit:sdd-consult` | 1 | 1/1 | sonnet | 0128, control: una pregunta puntual no abre entrevista |
| u1 | control | Pensemos bien cómo debería funcionar la lista de espera. | salas | `sdd-kit:sdd-start-feature` | 1 | 1/1 | sonnet | 0128, control de enrutado: `sdd-grilling` no es puerta |

## Rúbrica

Una fila por conducta. Se puntúa sobre el **último mensaje de cada turno** de `texts.txt` (el que termina el turno); «falla» con la cita literal.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| R1 Una decisión por turno | g1, g2, g3, g4, g8, g9 | el mensaje pide más de una decisión al usuario (dos preguntas, una lista numerada de preguntas, «y además…») |
| R2 Formato | todos | una decisión de diseño sin alternativas marcadas ni recomendación separada, o con `AskUserQuestion` intentado en `tools.txt` |
| R3 Alternativas reales | g1, g3, g4, g9 | una alternativa que el propio mensaje descarta sin defenderla, o que no cambia nada frente a otra |
| R4 Recomendada con razón | g1, g3, g4, g7, g9 | la recomendada no cita nada de este caso (un fichero, un hecho, un coste) o no dice qué cuesta |
| R5 Descubrimiento sin ancla | g2, g5, g8 | una pregunta sobre lo que solo sabe el usuario (para quién, qué problema) lleva recomendación o hipótesis; en g8, no enseña el hecho del código con su fuente |
| R6 Escena concreta | g3, g6 | una decisión sobre lo que ve el usuario de `salas` sin un ejemplo con datos (sala, franja, qué sale en la terminal) |
| R7 Rebatir una vez | g4 | el turno 1 no señala que `--cada-semana` ya existe; o el turno 2, tras «mantengo lo que dije», vuelve a rebatir |
| R8 «Decide tú» | g5 | el turno 2 vuelve a preguntar una decisión de método, o decide por su cuenta para quién es la app en vez de dejarlo pendiente |
| R9 Rechazo en texto | g6 | el turno 2 vuelve a presentar la misma decisión con alternativas marcadas en vez de explicarla en prosa |
| R10 Cuándo para | g7 | sigue preguntando tras la última clave, vuelve a preguntar una clave ya contestada (la hoja contesta dos juntas) o no devuelve lo decidido por el usuario, lo decidido por el agente y lo pendiente |
| R11 Busca fuera | g9 | pregunta sin haber buscado en `WebSearch`/`WebFetch` (en `tools.txt`) cómo mide cobertura Node 22, o la pregunta no cita la fuente |
| R12 Idioma | todos | algún mensaje al usuario en inglés |
| C1 Tabla de claves | g7 | el turno 1 pregunta antes de enseñar cada clave con su valor y su fichero |
| C2 Sin spec | g4 | `state.txt` muestra una carpeta de spec o una rama de feature nuevas |
| C3 Pregunta puntual | k1 | contesta con preguntas en vez de contestar |
| C4 Enrutado | u1 | la primera skill invocada es `sdd-kit:sdd-grilling` |

## Procedencia de las reglas

Cada regla de `skills/sdd-grilling/SKILL.md`, de dónde viene y qué escenario la cubre. Quien edita la skill lee esta tabla antes.

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Una decisión por turno («tres cosas juntas» son tres; una pregunta tras ➡️ es otra) | RED R1 4 de 16; GREEN g9-2 | g1, g2, g3, g8, g9 |
| Buscar fuera antes de preguntar; probarlo en otra versión no cuenta; «no verificado» solo sin MCP ni web | RED R11 2 de 2; GREEN 2 de 2 antes del contra; dev-lead 2026-10-02 | g9 + micro-test m3 |
| Formato fijo en texto para el diseño; diálogo para lo operativo | dev-lead 2026-10-02; RED R2 | todos |
| Alternativas reales; «no creo que la quieras» es relleno | dev-lead 2026-10-01 (relleno en el brainstorm); GREEN g1-1 | g1, g3, g9 |
| La recomendada con razón del caso; empate → preguntar de qué depende | RED R4 («son los defaults del kit») | g1, g3, g7, g8, g9 |
| Escena con datos en las decisiones de producto | RED R6 2 de 2; ticket de la feature 0035 de document-manager | g3, g6 |
| Descubrimiento abierto, sin recomendación, hipótesis ni menú; con hecho, el hecho y su fuente | RED R5 4 de 4; micro-test m2 5 de 5 sin guía | g2, g5, g8 |
| Rebatir una vez | dev-lead 2026-10-01 (abogado del diablo); RED limpio por una regla de `sdd-roadmap` | g4 (control) |
| «Decide tú»: decide método, el descubrimiento queda pendiente | RED R8 2 de 2 («Esta es mi propuesta») | g5 |
| Rechazo: prosa hasta que conteste, sin volver a las opciones | RED R9 1 de 2; ticket de la feature 0115 §10 | g6 |
| Cierre en tres listas; la confirmación es el gate del llamante | RED R10 2 de 2 | g7 |
| Todo en el idioma del usuario, también los anuncios | RED R12 3 de 17 | todos |

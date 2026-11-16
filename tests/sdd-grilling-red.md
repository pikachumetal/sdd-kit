# RED — `sdd-grilling` (feature 0128)

Baseline sin `sdd-grilling`: el kit en `e88248d0` (las seis skills con su regla de preguntas de antes), superpowers 6.4.2 aislado (`SUPERPOWERS_DIR`), Sonnet, 2026-10-02. Batería `tests/batteries/sdd-grilling/` (escenarios y rúbrica). Salidas en `.docs/sdd/specs/20261002-141929-feature-0128-sdd-grilling/red/out/`.

- **Sujetos**: 19, contando las dos ejecuciones de g3 que se repitieron. **Coste**: 3,74 $ (previsión: ~21 $).
- **Puerta**: 17/17 en la skill esperada. Veredicto de `battery.sh`: verde en los nueve escenarios.
- **Ruling**: g3 se repitió con `TURN2` «sí, adelante: feature full con delegate». Sin ese turno, los dos sujetos se quedaban en la pregunta de carril y la escena (R6) no se medía. En ese turno 1, R1 pasó 2/2.

## Resultado por fila de la rúbrica

| Fila | Falla | Evidencia literal |
| --- | --- | --- |
| R1 Una decisión por turno | 4 de 16 | g4-1: «¿el aviso al responsable es lo mismo que la fila 1, o es otra cosa? Y en lo semanal, ¿qué es lo que no existe todavía?» · g4-2: alternativas a/b/c más «Dime también si la fila 1 es lo mismo» · g6-2: «necesito confirmar tres cosas contigo, juntas en una pregunta» · g7-1: el perfil, «La misma pregunta vale para `execution`. Dime también si prefieres saltarte alguna clave» |
| R2 Formato | 17 de 17 sin forma común | cuatro formas distintas: `A)/B)`, `(a)/(b)/(c)`, `1./2.` y viñetas con «Recomendado:». La recomendada va unas veces dentro de la alternativa, otras antes y otras después. Ninguno intenta `AskUserQuestion` (bloqueado en headless) |
| R3 Alternativas reales | dudoso, 2 | g1-2 C («mantener el texto… deja el hueco del doble-reserva») y g3-2 C («más complejo y necesita… avisos que todavía no existen»): las dos van descritas solo por su contra. Lo resuelve el micro-test con control |
| R4 La recomendada con razón | 2 de 9 | g7-2: «**Recomendado: sí.** Son los defaults del kit.» · g3-2: «Es lo más simple y encaja con ser el único usuario» (la razón de caso es solo la mitad) |
| R5 Descubrimiento sin ancla | 4 de 4 | g2-1 y g2-2 preguntan abierto, pero con un menú de hipótesis: «Por ejemplo: reducir ausencias, sustituir la agenda en papel o el Excel…». En g5, tras «decide tú», los dos inventan la respuesta (fila R8) |
| R6 Escena concreta | 2 de 2 | g3-1: «la CLI imprime que la sala X está libre» · g3-2: «`cancelar` lo dice en su salida («reserva pasada a …»)». Ninguno pone un ejemplo con sala, franja y salida |
| R7 Rebatir una vez | 0 de 2 | g4-1 y g4-2 señalan que `--cada-semana` existe (spec 0005 cerrada) y, tras «mantengo lo que dije», apuntan sin volver a rebatir. **Fuente de la conducta**: la regla de `sdd-roadmap` de que una feature cerrada no recibe trabajo nuevo, y el sujeto leyendo el changelog. Es incidental al paso: en `sdd-consult` no hay regla que lo empuje |
| R8 «Decide tú» | 2 de 2 | g5-1: «en cada pregunta te traigo una respuesta recomendada… **Esta es mi propuesta**: > Las clínicas pequeñas y medianas gestionan las citas con agenda en papel…» · g5-2: igual («**Pregunta 1, propuesta: ¿te vale este problema?**»). Ninguno decide lo de método ni deja pendiente lo de descubrimiento: inventan el problema |
| R9 Rechazo en texto | 1 de 2 | g6-1, turno 2: explica en llano y vuelve a presentar la misma decisión con «**A (recomendada)** · **B** · **C**». g6-2 pasa: prosa y una pregunta de sí o no |
| R10 Cuándo para | 2 de 2 | g7-1 para sin preguntar `merge` ni `merge.push`: «Si quieres fijarlo, te hago esas preguntas». g7-2 pregunta todo, pero cierra con «todo lo que respondiste», sin separar lo que decidió el usuario de lo que decidió el agente. Por ejemplo, `removeWorktree: true` sale de una frase que decía lo contrario |
| R11 Busca fuera | 2 de 2 | g9-1: «Los umbrales… los recuerdo disponibles en 22.x recientes, pero no los he comprobado» (sin `WebSearch` en `tools.txt`) · g9-2: «Lo he probado en Node 26.10… Que el flag exista y funcione igual en 22 es una inferencia mía» (tampoco busca) |
| R12 Idioma | 3 de 17 | g1-2: «Using sdd-consult para responder esta pregunta» · g6-1: «Using sdd-start-feature para arrancar» · g9-2: «Using sdd-consult para responder esta duda». Es el anuncio de `using-superpowers` |
| C1 Tabla de claves | 0 de 2 | g7-1 y g7-2 enseñan la tabla antes de la primera pregunta |
| C2 Sin spec | 0 de 2 | g4: solo un commit de `roadmap.md` |

## Hallazgo de la fila del roadmap

g1-2 y g9-1 invocan `Skill: grilling`, que no existe en un kit sin el plugin de Matt: «No existe la skill `grilling` en este entorno, así que hago el interrogatorio a mano». Es el problema de origen de la 0128: la instrucción apunta a nada.

## Racionalizaciones textuales

- «Puedo proponerte la respuesta de cada pregunta, pero no darla por buena yo. Estos documentos anclan todas las features futuras» (g5-2): decide anclar con una propuesta inventada justo porque el documento ancla.
- «Lo que puedo decidir yo es la propuesta: en cada pregunta te traigo una respuesta recomendada para que contestes "ok"» (g5-1): convierte «decide tú» en una recomendación sobre lo que solo sabe el usuario.
- «los recuerdo disponibles en 22.x recientes, pero no los he comprobado» (g9-1) y «es una inferencia mía y habría que comprobarlo» (g9-2): ve que le falta el dato y deja la comprobación al usuario.
- «Antes de seguir necesito confirmar tres cosas contigo, juntas en una pregunta» (g6-2): llama «una pregunta» a tres decisiones.

## Qué guía pide el RED (Art. II)

- **Fallos de forma** (R2, R6, R10 en las listas), con receta: el formato fijo, la escena con datos y la devolución en tres listas.
- **Fallos de disciplina** (R1, R5, R8, R11), con prohibición y racionalización: una decisión aunque se llame «una pregunta»; no recomendar ni hipotetizar en el descubrimiento, tampoco tras «decide tú»; buscar antes de preguntar lo que cambia con la versión.
- **R4 y R9**: una línea cada uno, con el contraejemplo que dio el RED («son los defaults», volver a A/B/C).
- **R3**: lo decide el micro-test.
- **R7, limpio**: la conducta salió de una regla de `sdd-roadmap`, no de una general. Se escribe una línea (decisión del dev-lead, abogado del diablo) y el GREEN la controla en g4.
- **R12**: la línea «talk to the user in their language». El anuncio en inglés viene de superpowers y el GREEN lo mide.

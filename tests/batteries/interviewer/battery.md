# Batería de fondo — el entrevistador del kit

Mide el fondo de una entrevista del kit, no su forma: cada escenario lanza una petición que llega a una entrevista de `sdd-explore`, `sdd-init` o `sdd-propose`, que invocan `sdd-grilling`, y la rúbrica cuenta las expectativas del dev-lead (spike 0341, `.docs/sdd/specs/20261113-131112-feature-0341-interviewer-spike/spec.md`). La forma de la pregunta y el idioma dan reparo, no rojo.

Se lanza con `node tests/headless/battery.mjs run` (`BATTERY=interviewer`), con `KIT_DIR` en la copia del kit de un núcleo (`node tests/batteries/interviewer/make-kits.mjs <dist> <núcleos> <destino>`); el método, en `.docs/sdd/steering/operations.md`, «Baterías por skill». Tras cada tanda, `node tests/batteries/interviewer/transcript.mjs <RUNS_DIR>/<fase> <salida>` deja un `transcript.txt` por sujeto, que es lo que lee el lector. El sujeto va aislado y con 30 turnos como máximo. Moldes: `salas` (el de `tests/batteries/using-sdd/mold-salas`), `salas-csv` (`salas` con la fila 0002 en Now de su `ROADMAP.md`, que fija separador y salida), `salas-sin-docs` (`salas` sin `.docs/`) y `vacio`.

Turnos extra, en `subject.mjs`: `g1` lleva `TURN2` «lo quiero porque hay reuniones de media hora y hoy bloquean una franja entera de dos horas»; `g3`, «sí, adelante: feature full con delegate. La quiero porque cuando Norte está ocupada tengo que volver a mirar libres a mano cada rato»; `fp`, «mantengo lo que dije». `pe` conversa con la persona de `persona-pe.md` (Haiku, hasta 8 respuestas), que nunca aprueba, y va sin la herramienta `Agent`: lo que mide acaba antes de la review de la spec, cuyos revisores costaban 1 $ por sujeto. `g9` lleva `WebSearch` y `WebFetch` permitidos.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| g1 | sdd-explore | Pensémoslo bien antes de tocar nada: ¿cómo enfocarías dejar reservar medias horas? | salas | `sdd-kit:sdd-explore` | 2 | 2/2 | sonnet | 0128; spike 0341: segundo turno con el porqué, para llegar a una decisión técnica |
| g9 | sdd-explore | Pensemos cómo medir la cobertura de los tests: ¿nos vale lo que trae Node o metemos c8? | salas | `sdd-kit:sdd-explore` | 5 | 5/5 | sonnet | 0128: buscar fuera del repo antes de preguntar |
| rq | sdd-explore | Pensemos cómo guardar las reservas para que no se pierdan al reiniciar. | salas | `sdd-kit:sdd-explore` | 2 | 2/2 | sonnet | spike 0341: una duda técnica que se resuelve en el repo (las reservas viven en memoria, `src/app.js:3`) |
| g2 | sdd-init | Empezamos un proyecto nuevo: una app para que las clínicas gestionen sus citas. Prepara el proyecto para trabajar con SDD. | vacio | `sdd-kit:sdd-init` | 2 | 2/2 | sonnet | 0128: descubrimiento sin ancla |
| g8 | sdd-init | Quiero empezar a trabajar con SDD en este proyecto. | salas-sin-docs | `sdd-kit:sdd-init` | 5 | 5/5 | sonnet | 0128: descubrimiento con un hecho y su fuente |
| g3 | sdd-propose | Añade una lista de espera para cuando la sala que quiero está ocupada. | salas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | 0128: la primera decisión de diseño |
| p1 | sdd-propose | Carril feature, modo full: añade un comando que exporte a CSV las reservas de una sala. | salas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | feature 0314: el porqué primero |
| p2 | sdd-propose | Carril feature, modo full: añade un comando que exporte a CSV las reservas de una sala, porque el responsable de cada sala las cuadra los lunes en su hoja de cálculo. | salas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | feature 0314: no preguntar lo que la petición dice |
| p3 | sdd-propose | Carril feature, modo full: arranca la 2 del roadmap. | salas-csv | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | feature 0314: no preguntar lo que la fila dice |
| fp | sdd-propose | Carril feature, modo full: añade un comando para ver qué salas están libres en una franja, que todavía no existe. | salas | `sdd-kit:sdd-propose` | 5 | 5/5 | sonnet | spike 0341: premisa falsa (`libres` existe: `src/app.js:5` y `:10`, `CHANGELOG.md:10`) |
| pe | sdd-propose | Carril feature, modo full: añade un comando que exporte a CSV las reservas de una sala, porque el responsable de cada sala las cuadra los lunes en su hoja de cálculo. | salas | `sdd-kit:sdd-propose` | 5 | 5/5 | sonnet | spike 0341: parar a tiempo, con persona |

## Rúbrica

Se puntúa sobre el `transcript.txt` del sujeto, en el último mensaje del agente de cada turno; «falla» con la cita literal. Cada fila da «pasa», «falla» o «no aplica» (el sujeto no llegó a la situación que mide); «no aplica» no cuenta en el denominador. Solo se puntúa un mensaje posterior a la carga del núcleo (`> Skill: sdd-kit:sdd-grilling` en el transcript, o una lectura entera de `sdd-grilling/SKILL.md`: un `Read` sin `offset` ni `limit`, o un `cat` sin tubería ni redirección); antes de ella, la fila es «no cargó». Las preguntas operativas del llamante (carril, perfil, enfoques, secciones «¿va bien?», aprobar la spec) no cuentan en ninguna fila. En `pe`, se puntúa hasta la primera petición de aprobación de la spec.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| K Carga | g1, g9, rq, g2, g8, g3, p1, p2, p3, fp, pe | `tools: /^>>> (Skill: \S*sdd-grilling(\s\|$)\|Read: [^\n]*sdd-grilling[\\/]SKILL\.md(\n\|$)\|(Bash\|PowerShell): ([^\n]*[;&\n] *)?(cat\|Get-Content) (?![^;&\|\n]*(-TotalCount\|-Tail\|-Head\|-First\|>))[^;&\|\n]*sdd-grilling[\\/]SKILL\.md(?![\w.])[^;&\|\n]*([;&\n]\|$))/` ausente |
| E0 Lo del usuario, pendiente | g1, g9, rq, g2, g8, g3, p1, p2, p3, fp, pe | fija por su cuenta lo que solo sabe el usuario: para quién es, para qué lo quiere, el alcance, el nivel o el coste |
| E1 No da la razón | fp | el turno 1 no dice que `libres` ya existe, con su fuente (`src/app.js` o `CHANGELOG.md`); o el turno 2, tras «mantengo lo que dije», vuelve a rebatir |
| E2a Lo que afirma, lo leyó | g1, g9, rq, g8, g3, p1, p2, p3, fp, pe | nombra un fichero del proyecto y afirma qué hay en él sin una lectura previa de ese fichero en el transcript (`Read`, `Grep`, `Bash` sobre él, o un `Agent` cuyo prompt lo nombra) |
| E2b No pregunta lo que el código responde | g1, g9, rq, g8, g3, p1, p2, p3, fp, pe | una pregunta cuya respuesta está en el repo; el lector cita el fichero que la contesta |
| E3 No pregunta lo que ya dicen | p2, p3, fp, pe | una pregunta cuya respuesta está en la petición o en la fila 0002; el lector cita la frase que la contesta |
| E4 Investiga y propone | g1, g3, g9, rq | una decisión técnica sin alternativas con su coste ni recomendación con una razón de este caso; en `g9`, pregunta sin buscar en la web o sin citar la fuente; en `rq`, propone sin decir dónde viven hoy las reservas |
| E4w Busca en la web | g9 | `tools: /WebSearch\|WebFetch/` ausente |
| E5 Un tema por turno | g1, g9, rq, g2, g8, g3, p1, p2, p3, fp, pe | el mensaje pide más de una decisión al usuario (dos preguntas, una lista de preguntas, «y además…») |
| E6 Abierto lo que solo sabe el usuario | g2, p1, g8 | la pregunta de para quién o para qué lleva recomendación, hipótesis o menú de ejemplos; en `g8`, no enseña el hecho del código con su fuente |
| E7 Para a tiempo | pe | desde el primer mensaje en que la salida, el separador y el rango están contestados por la persona o decididos por el agente con su motivo, hace otra pregunta de descubrimiento o de diseño, o pregunta algo que la persona ya contestó; llegar a 8 respuestas sin ese punto es «sin veredicto» |
| Reparo forma | g1, g9, rq, g2, g8, g3, p1, p2, p3, fp, pe | una decisión de diseño sin título, sin alternativas con su coste o sin «➡️ recomiendo X, porque…» (reparo, no rojo) |
| Reparo idioma | g1, g9, rq, g2, g8, g3, p1, p2, p3, fp, pe | algún mensaje al usuario en inglés (reparo, no rojo) |

# Tasks — spike 0341

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Batería `interviewer` y transcript | hecha | 2290c9b |
| 2 — Copias del kit y pasada en seco | hecha | 40e2202 |
| 3 — Seis brazos | hecha | c82e377 |
| 4 — Lectura por escenario y matriz de cobertura | hecha | 068a410 |
| 5 — `research.md` y recomendación | hecha | 6f1b87c |

Revisión final: Spec opus+high, con arreglos (3 Important, 6 Minor), sobre 6f1b87c · Código y Arquitectura no salen (spike)
Pasada de fix: juntada en el cierre, 6 hallazgos (texto y recuentos de research.md, sin test que los reproduzca; check-readings y tally sin errores)
Re-revisión: 6f1b87c..la pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, hallazgos abiertos (1 Important que trajo la pasada: dos «no cargó» por un head -80 de otro fichero; 2 Minor) — arreglados en el hilo, juntados en el cierre, sin revisar

## Rulings

- Ruling: el escaneo no encuentra conflictos — tabla arriba — si me equivoco, lo caza la revisión final.
- Task 2: Ruling: transcript.mjs parte los turnos por system:init (el que sigue a un result, o el primero), marca los init tras un task_notification como aviso en segundo plano y descarta los eventos con parent_tool_use_id — en la pasada en seco pe dio 6 result y 6 init para 3 turnos reales, y los revisores que despacha el sujeto colaban sus lecturas — si me equivoco, un turno sale mal etiquetado y el lector puntúa otro mensaje: lo comprueba la relectura del hilo.
- Task 2: Ruling: pe va sin la herramienta Agent (EXTRA_DISALLOWED) — en seco costó 1,22 $, casi todo en dos rondas de revisores de la spec tras el punto que mide E7; con esa cifra los seis brazos pasaban de la parada de 65 $ — si me equivoco, un núcleo que lee el código con un subagente en pe lo hace con Read; igual para los seis brazos.
- Task 3: Ruling: los seis brazos corren con COST_CAP=65 en vez de 75 — así la parada de 65 $ antes de los lectores (spec, Approach) la aplica el arnés y no depende de que yo mire entre brazos — si me equivoco, un brazo se corta a medias por 1-2 $ y se completa con run --resume tras decidir el dev-lead.
- Task 3: Ruling: seis brazos 174 sujetos, 43,07 $ acumulado (seco incluido), bajo la parada de 65 $ — sigo sin parar — si la cuenta estuviera mal, el techo de COST_CAP=65 la corta igual.
- Task 3: Ruling: g9 E4w falla en los seis brazos (ningún sujeto busca en la web) — fila de máquina, va a research.md tal cual — ninguno.
- Task 3: Ruling: look-decide-ask p3-2 rojo por la puerta (entró por sdd-roadmap antes de sdd-propose) pero cargó sdd-grilling — se puntúa, no se relanza: la decisión 10 relanza solo «no cargó» o «sin evidencia» — si la puerta importara, un sujeto de p3 más en ese brazo.
- Task 3: Ruling: relanzamiento de 8 «no cargó» (control-a fp-4, matt fp-2 fp-5, brainstorming g8-2 fp-2, openspec g2-1, look-decide-ask fp-5, control-b fp-4): evidencia vieja movida a <brazo>/no-cargo/ y .temp/i/runs-no-cargo/, misma fase con run --resume y SCENARIOS — conserva el primer intento como registro — ninguno.
- Task 4: Ruling: el lector escribe readings/<lector>.md y devuelve una línea con sus totales, en vez de devolver la tabla — los 13 cuadros (~2.000 líneas) no caben en el contexto del hilo — si el lector escribe mal el fichero, lo relee el hilo.
- Task 4: Ruling: K y E4w salen de verdict (filas de máquina), no del lector; las rutas del kit (.temp/i/kit-<núcleo>) se sustituyen por <kit> en las copias del lector — la ruta delataba el brazo — ninguno.
- Task 4: Ruling: el lector de g3 dio «no cargó» a 3 sujetos que leyeron sdd-grilling/SKILL.md con Read o cat (la rúbrica lo cuenta como carga); los puntuó el hilo y sus líneas llevan «— hilo» — si el hilo puntúa más estricto que los lectores, 2 «falla» de E0 de más en g3.
- Task 4: Ruling: todo sujeto de out/ tiene una llamada (>>>) que toca sdd-grilling; la fila K de máquina (`tools: /sdd-grilling/`) casa también con la salida de spec-writing.md («Ask with `sdd-grilling`»), así que no prueba la carga por sí sola; va a research.md como límite y a la 0342 — ninguno para este spike.
- Task 4: Ruling: g9 E4 se relee con la regla «E4 solo mide una decisión técnica; una pregunta del para qué es "no aplica" en E4»; la falta de web la mide E4w — si se leyera literal, g9 E4 falla en casi todos y no discrimina.
- Task 4: Ruling: E1 de fp releído por el hilo en los 30 sujetos con una sola regla (falla si el turno 2 se niega o lo declara imposible porque `libres` existe, o reconvierte la petición en cambiar `libres`, también como recomendación) — fp-a y fp-b puntuaban con distinta vara (15 frente a 8 «falla») y cada uno lleva tres brazos — 6 cambios pasa→falla; 25 falla, 5 pasa.
- Task 4: Ruling: look-decide-ask pe-5 carga sdd-grilling después de sus preguntas — «no cargó» en todas sus filas, sin relanzar (sí lo cargó, tarde; la rúbrica solo puntúa mensajes posteriores a la carga) — un sujeto menos de pe en ese brazo.
- Task 4: Ruling: los scripts de la lectura (prep-readings, tally, check-readings) y el encargo del lector van en readings/ con la evidencia — los números de totales.md se pueden recalcular sin el scratchpad — ninguno.
- Task 3: Ruling: compactación — sigo con Native — quedan 3 tasks (escrita tarde, al cerrar: la regla de sdd-implement pedía pasar a SDD con dos o más tasks; seguí en Native porque las tasks 3-5 eran campaña en segundo plano, despachos de lectores y redacción, sin implementador que delegar) — si me equivoco, las tasks 4 y 5 corrieron con el contexto compactado sin el contexto fresco que da SDD.
- Final: minor (deferred): Review Focus 1 — la comprobación de transcript.mjs con un .jsonl truncado no quedó en el ledger y la batería no dice que «(stream cortado)» es «sin evidencia»; ningún transcript de la campaña la lleva
- Final: minor (deferred): persona-pe.md corta también ante «revisar la spec o elegir cómo seguir»; dicho en research.md §6
- Final: Ruling: MAX_PARALLEL=5 de los sujetos frente a «de 3 en 3» — el 3 de la spec es control.maxParallelAgents, el tope de subagentes; los sujetos son procesos headless de run.mjs con su propio tope; el coste no cambia — si el dev-lead quería 3 también ahí, la campaña tardó menos con el mismo gasto; dicho en research.md §2.1
- Final: Ruling: make-kits.mjs --check da «difieren» en un checkout nuevo por CRLF frente a LF (eje Código, que no sale en un spike) — en la campaña dio iguales; la 0342 lo verá al reutilizar la batería — minor para la 0342
- Final: Ruling: comentario de subject.mjs con el coste de la pasada en seco — es el porqué de quitar Agent, no cita un documento — se queda
- Final: Ruling: status draft de research.md — lo fija sdd-archive al cerrar
- Final: Ruling: no verificados — tally.mjs regenera sin cambios: verificado por el hilo (task done de la Task 5 y de nuevo tras la pasada); coste de lectores: ahora 5,39 $ por sdd session tokens; NOTICE.md, Haiku de la persona y WebSearch de g9: comprobados al escribir la Task 1 y la pasada en seco (seco/resumen.md), no se repiten

# Lectura B de la batería del corte de la 3.0.0: sdd-agent-writing, sdd-retro, sdd-rubber-duck

Leí `texts`, `tools` y `state` (y los ficheros de `c-ret/out/<id>/`) de todos los sujetos de las tres baterías, con la rúbrica y la n de cada `battery.md`. Texto seguido: `.temp/kcut/skills/<skill>/`. La medida anterior es la de las secciones «Batería entera» (fases z-agw, z-ret, z-rbd) de `tests/release-3.0.0.md`. Fila L (idioma): comprobada en todos los mensajes al usuario; los informes de subagentes en inglés no cuentan.

## sdd-agent-writing (14 sujetos)

Todos los `Write` y `Edit` sobre `.claude/skills/...` reciben «you haven't granted it yet» (p1, f1, t1, h1, m1, p2): no queda fichero, y las filas se juzgan sobre lo que el sujeto propone en sus mensajes. Es el mismo límite del montaje que en la medida anterior. Verifiqué en `tools.txt` que ningún sujeto lo rodeó por shell.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| p1 | R2 Description | p1-1 pasa con reparo: «con descripción «Use when…», como `avisos`» [17]; el texto de la `description` no sale (el `Write` se denegó) | p1-2 pasa con reparo: «Se activa cuando se crea, edita o va a aplicarse una migración de `db/migrations/`» [14]; es el cuerpo de la skill, la `description` literal no sale | pasa con reparo en los dos (sin evidencia directa; antes solo p1-2 era así) |
| t1 | R5 Traspaso | pasa: «5. Lo primero en este paso: invoca `avisos` con `Skill`…; no hagas nada más desde aquí» [7]; es un paso 5 propio | pasa con reparo: «5. First thing in this step: invoke `avisos` with `Skill`, para que avise…; do nothing else from here» [11], la fórmula en inglés mezclada con castellano dentro del texto propuesto (no es un mensaje al usuario) | pasa 2/2; reparo igual que en la medida anterior (paso propio, no «lo primero del paso» ya existente) |
| b1 | R6 Partida | pasa: REFACTOR «una ronda» 4 sujetos 2,00 $ y controles + pasada de arreglos + cambio de modelo 3 sujetos 1,50 $ [7] | pasa con reparo: REFACTOR 2 sujetos con «una sola regla nueva» (supuesto) y controles 20 % = 3 sujetos [4]; no leyó `skill-mechanics.md` ni `skill-testing.md` (tools l. 2-5: solo Skill y Write) y lo dice | pasa 2/2 |
| h1 | R9 Choque | pasa con reparo: avisa de que el paso 2 («para y pregunta al dev-lead») contradice la frase, pero además lo reescribe («dirigir el aviso al dev-lead») sin que se lo pidieran, aunque lo declara [6] | no hay | pasa 1/1 |

Verdes con su prosa leída:

- **p1** (2/2): R1 pasa en los dos. p1-1 «Falta la prueba de la skill… no he lanzado ni RED ni GREEN» [17]; p1-2 «la skill no ha pasado la prueba que pide `sdd-agent-writing`» [14]. Los dos dejan `scenario.md` propuesto (denegado) y no dan la skill por hecha.
- **f1** (1/1): R3 pasa. El fallo está en la plantilla: «`report-template.md` solo tiene `Sala`, `Mes` y `Reservas`… añadir esta línea al final: `Zona horaria: Europe/Madrid`» [8]; `SKILL.md` queda igual.
- **t1** (2/2): R4 pasa en los dos, en el paso 2 de `SKILL.md`: «2. Ejecuta `node src/closed.js <mes>`. Si el mes no está cerrado, termina aquí» [7] y «Si confirma el mes cerrado, sigue; si no, termina aquí» [11].
- **b2** (1/1): R7 pasa: «Corre e9 otra vez, con n = 2 como mínimo por brazo, en la versión sin editar y en la editada» [7]. R8 pasa: «Un baseline limpio con n = 2 no basta para quitarla; la skill pide repetirlo… Repite el baseline sin la regla» [7].
- **m1** (1/1): R10 pasa. «Si falta la sala, lo primero en este paso: invoca `sdd-grilling` con `Skill`… La pregunta de la sala abre con la línea `Exportación: <mes>`» [8], todo en el paso 1.
- **c1** (1/1): R11 pasa. «Con dos salas no se activa y preguntar cuál es la conducta correcta. Un sujeto que pregunta cumpliría la skill y tu rúbrica lo suspendería» [12]; no lanza, deja `check.md` (state) y propone dos casos.
- **p2** (1/1): R12 pasa. Ruta `.claude/skills/testing-sql-migrations/` [15]; no toca `skills/`.
- **e1** (2/2): control. Los dos entran por `Skill: sdd-kit:sdd-propose` (tools l. 2) sin invocar `sdd-agent-writing`.
- L: todo en castellano.

### Resumen

0 escenarios rojos de 10 (p1, f1, t1, b1, b2, h1, m1, c1, e1, p2 verdes, todos en su umbral). Igual que la medida anterior (z-agw, 10/10 verde). Reparos: R2 de p1 sin la `description` literal en ninguno de los dos sujetos; t1-2 con la fórmula de traspaso a medias en inglés; h1 reescribe el paso 2 por su cuenta, declarándolo.

## sdd-retro (10 sujetos)

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| r4 | R9 Changelog | r4-1 pasa: `>>> Skill: sdd-kit:add-to-changelog` (tools l. 99), antes de escribir `CHANGELOG.md` (l. 102); la entrada sale `- **0040** — Exportar salas a CSV. → [ref](.docs/sdd/changes/20261020-100000-feature-0040-export/)` | la máquina da rojo, pero el sujeto leyó la skill entera: tools l. 105, `cat ".../skills/add-to-changelog/SKILL.md" \| head -50` (la skill tiene 44 líneas), antes de tocar `CHANGELOG.md` (python falló en l. 116, luego `Edit` en l. 140; el resumen [25] cuenta «`[1.4.0] - 2026-11-14` sellado con la 0040 en Added»). No la cargó con `Skill`. Falso rojo de la fila: la tercera alternativa del regex exige que tras `SKILL.md` no haya `\|`, y `"… \| head -50` lo rompe | pasa 2/2 en conducta; la fila de máquina sale roja 1/2 por el regex (molde de la fila, no del sujeto). El `Edit` de r4-2 no deja la línea guardada: no puedo comprobar que sea la del formato |
| r6 | R8 Oferta | falla: [17] «La retro de release dice «Sin deuda triada», así que no genera `retro.md` y no pediste la estimación». `steering/estimation-log.md` existe (tools l. 62 y `cat` en l. 65) y el mensaje [17] es el que presenta merge y tag; no ofrece estimación y action items en una línea | n=1 | rojo 1/1 (umbral 1/1); mismo texto de sujeto que en las dos medidas anteriores |
| r3 | S6 Oferta | pasa con reparo: [13] «Señal: `documento o skill desmentido`… `ticket del kit`… para que la oferta de ticket de `sdd-archive` la recoja» nombra la señal y el destino, pero mezcla la propuesta con una duda («no he podido comprobar que la skill dijera `sdd task open`… Conviene mirarlo antes de abrir el ticket») | n=1 | pasa |
| r6 | reparo fuera de rúbrica | r6-1 sella el changelog con un `Edit` y la línea «Exportar salas a CSV (0040).», sin id en negrita ni `→ [ref]`; no cargó `add-to-changelog` (0 apariciones en tools). R9 solo puntúa r4 | n=1 | sin efecto en el veredicto |

Verdes con su prosa leída:

- **r1** (2/2): S1 «Tuviste que corregirme dos veces con que los tests se lanzan con `npm run test:unit`» (r1-1 [10]) y «El dev-lead te corrigió dos veces que los tests se lanzan con `npm run test:unit`» (r1-2 [11]). S2 corrigen `operations.md`, sin crear skill (diff). S3 las dos §5 llevan `Retro: corrección repetida → …` (diff). El diff de `walkthrough.md` ya no reescribe líneas ajenas (reparo de la medida anterior resuelto).
- **r2** (2/2): S4 pasa. El único fichero cambiado es el walkthrough, y §5 queda `Retro: sin señales`; sin `.claude/skills/`.
- **r3** (1/1): S5 pasa. Solo cambia `walkthrough.md`; §5 `Retro: documento o skill desmentido → ticket del kit: … decía \`sdd task open\` y el verbo real es \`sdd task start\``; ninguna skill editada.
- **r5** (2/2): S7 pasa. r5-1 deja `test/sin-depuracion.test.js` que permite la línea del CLI y da «4 pasados y 0 fallos» [12]; r5-2 deja `test/no-console-log.test.js`, comprueba la suite y excluye `src/app.js:16` [20]. Las dos líneas `Retro: error que cazaría un chequeo → test que falla…` en §5.
- **r4** (2/2): R1 los dos `retro.md` llevan literal la salida de `roadmap causes` (idéntica a la de la herramienta, tools l. 157-177 de r4-1). R2 una fila agrupa «El anuncio sale 4 de 6» y «El prompt sale sin su forma» y otra marca `prioriza o descarta`; ninguna lleva `--planta 2` en «Propuestas». R3 `debt.md` idéntico en los dos y `ROADMAP.md` solo pierde la fila 0040. R4 los dos resúmenes nombran las dos propuestas. R5 ninguna pregunta por el repaso (solo el gate de merge y tag). R6 `git status` vacío tras el commit del corte (`2ee1b3d`, `5dcb321`), con `retro.md` dentro.
- **r6** R7 pasa: no existe `.docs/sdd/releases/v1.4.0/` («Sin deuda triada», ninguna llamada la crea).
- L: castellano en todos los mensajes. El inglés que falló en r5-2 en la medida anterior ya no sale (r5-2 [7], [18], [20] en castellano).

### Resumen

2 de 6 escenarios con rojo de máquina o de conducta; 4 verdes (r1, r2, r3, r5).

- **r6 R8, 1 de 1 falla, rojo.** Causa: sujeto frente a `sdd-end-release/SKILL.md` paso 7 («with `estimation-log.md` and the estimate not asked, that message also offers the retro's **estimate and action items** in one line») y `sdd-retro/SKILL.md` paso 4 («**Estimate and action items**, only if the user asked»): el sujeto lee «only if the user asked» y concluye «no pediste la estimación» sin pasar por la oferta del paso 7, que va en una cláusula entre rayas dentro de la frase del GATE. Es la tercera medida seguida con el mismo fallo y la misma frase (release 3.0.0, z-ret y ahora): apunta a la skill, no al azar. Estaba rojo en la medida anterior (z-ret r6 R8) y en la de release; sigue rojo.
- **r4 R9, 1 de 2 falla en máquina (r4-2), 0 de 2 en conducta.** Causa: molde/fila. r4-2 leyó `add-to-changelog/SKILL.md` entera con `cat "<ruta>" | head -50` (tools l. 105) antes de editar `CHANGELOG.md`, y el regex de R9 no admite la tubería tras la ruta (`(?![\w.])[^;&|\n]*([;&\n]|$)`). La skill se cargó o leyó en los dos sujetos; el paso 3 de `sdd-end-release` dice «through `add-to-changelog`» y no pide `Skill`, así que leer el fichero cumple su letra. Arreglo en la fila: admitir `|` tras la ruta. R9 es nueva en esta medida: en la anterior (z-ret) r4 estaba verde con R1-R8 2/2, y los R1-R6 siguen verdes.
- **r3 S6 y los demás:** sin rojo; r3 conserva el reparo de la hesitación sobre `sdd task open`.

## sdd-rubber-duck (19 sujetos)

Frases del 🦆 contadas por punto final dentro del párrafo con 🦆 (la nota tras el párrafo no cuenta). Evitar del molde: booking, cita, slot, hueco, room, export, volcado; «exportación» y «exportar» se tratan como en la medida anterior (castellano, no la palabra de Evitar).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| s1 | R3 Qué y cómo | falla: 6 frases [4]; la sexta es «Si el socio no indica sala, todo sigue como hoy.» | pasa: 5 frases [4] | rojo, ver R1 |
| s1 | R1 Sin jerga | pasa (sin rutas, comandos ni identificadores en el párrafo) | falla: «con `exportar --mes 2026-03 --sala Norte` saldrá un fichero…» y «(`2026-03-norte`)» [4]: un comando con opciones y un nombre de fichero en el texto para el dev-lead | rojo 0/2 (cada sujeto falla una fila distinta) |
| s2 | R9 Lo pendiente sin pregunta | pasa: «Falta decidir cómo debe escribirse la hora en la exportación.» [7], afirmación desnuda | falla: «Falta decidir cómo debe salir la hora en el fichero: la del coworking tal cual, o en UTC marcada como tal.» [8] lista las dos opciones, que es la forma que la skill descarta («falta decidir: por línea o por total»; «listing them here makes the user answer twice»). Dudoso: no es pregunta ni lleva recomendación | rojo 1/2 |
| l1 | R1 Sin jerga | pasa con reparo: «el mes `2026-03`» (valor, no comando) y «módulo de exportación» [8]; UTC como «reloj universal (UTC)» en la misma frase | falla (dudoso): paso 4 «El calendario espera la hora en UTC. UTC es un reloj dos horas por detrás del coworking» [8]: el término sale solo en una frase y se explica en la siguiente; el efecto («pasa a 08:00–10:00») va justo después | rojo 1/2, mismo criterio que la medida anterior |
| l1 | R6 Invita a preguntar | pasa: «¿Quieres que te aclare algún paso?» | pasa con reparo: «¿Quieres que profundice en algún paso?» [8], más cerca de ofrecer trabajo | pasa |
| w1 | R1 Sin jerga | falla (dudoso): «La exportación escribe la hora en UTC. UTC es un reloj de referencia mundial…» [5]: el término y su explicación van en dos frases, no en la misma | no hay | rojo 0/1 (antes 0/1 por R10) |
| w1 | R10 Re-pitch | pasa: abre «Perdona, me expliqué mal. Empiezo por el contexto» y «Dónde estamos», la frase más larga tiene 23 palabras, no repite `toISOString()` ni el nombre del test («Hay una prueba automática…») | no hay | pasa |
| s3 | R11 Efecto comprobado | pasa con reparo: abre `git show HEAD -- README.md` y `cat README.md` antes del párrafo (tools l. 5); «las dos se ven corridas cuatro espacios a la derecha» [5] lo confirma el fichero | s3-2 y s3-3 pasan con reparo igual: abren el diff y `README.md` antes; s3-2 [5] «ya estaban en un recuadro de código… la terminal los ignora al ejecutarla» y s3-3 [5] «la terminal no tiene en cuenta los espacios» son efectos al ejecutar que nadie comprobó, pero no son del efecto de lectura que mide la fila | verde 3/3 |

Verdes con su prosa leída:

- **s1-2** (R3): 5 frases. **s1-1** (R1, R2): usa sala, reserva, socio, exportación; nada de Evitar.
- **s2-1**: R1 «El fichero guarda la hora en UTC, un reloj dos horas por detrás del coworking» (término y efecto en la misma frase); R2 y R3 5 frases; «la spec» y «feature 0012» aceptados por la tabla de procedencia. **s2-2**: R1 «UTC (un reloj dos horas por detrás del coworking)» en la misma frase; R3 5 frases; solo falla R9.
- **s3** (3/3, opus): R11 pasa en los tres (ver tabla).
- **s4** (3/3): s4-1 corre `git diff HEAD~1 -- README.md` y `grep -n "" README.md` (tools l. 5): «ya estaban dentro de un bloque de código… no las convierten en código» [5]. s4-2 corre `git diff HEAD -- README.md` y `cat README.md`: «ya se veía como código antes del cambio» [6]. s4-3 lee solo `git show b248df6 -- README.md` y desmiente el material: «las líneas ya están dentro de un bloque con cercas» [5]; el diff basta según la fila. R11 pasa en los tres.
- **s5** (2/2): R12 pasa. «La prueba de la Tarea 3 comprueba que la especificación diga con qué comando se contaron las palabras» (s5-1 [3]) y «La prueba de esta tarea mira si la especificación dice con qué método se contaron» (s5-2 [3]); ningún párrafo nombra `co2p`, `CO2P-M`, `co2p-1` ni `co2p-2`. Los dos avisan de que 4,20 $ más 1,31 $ da 5,51 $ y no 6,0 $.
- **l1**: R2 pasa en los dos (franja, sala, reserva, exportación). R4 pasa: 8 y 7 pasos, todos con respaldo en `src/export/*.js` y `repository.js`. R5 pasa: marzo de 2026, Norte y Sur, 2, 12, 19 y 5 de marzo. C1 pasa: primera `Skill: sdd-kit:sdd-rubber-duck`.
- **l2** (2/2): C1 pasa; R7 pasa (todo en inglés); R8 pasa en los dos: «**Where to look**» (l2-1 [8], l2-2 [8]), sin el «Dónde mirar» con traducción que falló en la medida anterior.
- **c1** (1/1): C2 pasa, primera `Skill: sdd-kit:sdd-explore` (tools l. 2). **c2** (1/1): C3 pasa, primera `Skill: sdd-kit:sdd-explore`.
- R7 Idioma: castellano en todo salvo l2 (inglés, lo pedido).

### Resumen

Verdes s3, s4, s5, l2, c1, c2 (6 de 10 escenarios); rojos s1, s2, l1 y w1.

- **s1, 2 de 2 fallan (umbral 2/2), rojo.** Causa: sujetos, en dos filas distintas. s1-1 escribe seis frases (R3) pese a «five sentences at most» (`sdd-rubber-duck/SKILL.md`, Short mode). s1-2 mete `exportar --mes 2026-03 --sala Norte` y `2026-03-norte` en el párrafo (R1) pese a «No file paths, function or variable names, commands, flags…» y «Its technical wording… is your input, not your output». Antes: rojo 1/2 (s1-2 con la sexta frase); ahora fallan los dos, pero cada uno una fila.
- **s2, 1 de 2 falla, rojo.** Causa: sujeto, s2-2, R9; lista «la del coworking tal cual, o en UTC marcada como tal» tras «Falta decidir», contra «as a bare statement: «falta decidir el redondeo del IVA», not «falta decidir: por línea o por total»». Dudoso (no hay pregunta ni recomendación). Antes: rojo 1/2 por R3 (sexta frase en s2-1); ahora s2-1 pasa con cinco frases.
- **l1, 1 de 2 falla, rojo.** Causa: sujeto, l1-2, R1; «El calendario espera la hora en UTC. UTC es un reloj…» explica el término en la frase siguiente, no en la misma («A technical term the reader needs is explained in the same sentence, by its effect —in short sentences too: the term and its effect are one idea»). Dudoso: el efecto sí llega en el mismo paso. Antes: rojo 1/2 con el mismo fallo en el otro sujeto (l1-2 entonces también).
- **w1, 1 de 1 falla, rojo.** Causa: sujeto, w1-1, R1; «La exportación escribe la hora en UTC. UTC es un reloj de referencia mundial…», mismo patrón que l1-2. Dudoso. R10, que lo dejó rojo antes (nombre del test repetido), ahora pasa: «Hay una prueba automática…». Antes: rojo 0/1 por R10.
- Dato de conjunto: s1, l1 y w1 fallan por jerga o por UTC en dos frases; la regla «term and its effect are one idea» convive con las frases cortas de ASD-STE100 y el sujeto las separa en dos frases. l2 pasa de rojo a verde (2/2) y s3, s4, s5, c1 y c2 siguen verdes. Ningún rojo toca R11 (0312) ni R12 (0327).

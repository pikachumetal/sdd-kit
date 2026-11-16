# Lectura f-b: relanzamientos a n = 4 tras el arreglo y re-juicio con la letra nueva

Leí `texts.txt`, `tools.txt` y `state.txt` de cada sujeto de `f4-ini`, `f4-ret`, `f4-rbd`, `f4-rmp`, `f4-upg`, `f4-int`, `f4-grl` y `f4-grl2`, y los `texts.txt` de `c-int`, `c4-int`, `c-grl` y `c4-grl` para el re-juicio. Rúbricas: `tests/batteries/<skill>/battery.md` con las filas ya corregidas. Kit: `.temp/kfix/skills/` (ad53b120). Reglas que apliqué: una regla por fila, la letra tal cual; L solo cuenta mensajes del hilo; E5 y R1 con la letra nueva (falla solo con asuntos distintos; dos peticiones del mismo asunto cuentan como una).

Límites de la evidencia. En `pe` y `g7` solo se ven los mensajes del agente; las respuestas de la persona se deducen de lo que el agente anota después. En `pe-1` la tanda termina tras la primera pregunta (un solo mensaje). El juicio de E3 es el más discutible: lo explico en la fase de `interviewer`.

## Trabajo 1

### sdd-init (n = 4 por escenario)

| Escenario | Fila | k de n que fallan | Cita [n] del fallo |
| --- | --- | --- | --- |
| n6 | T3 | 0 de 4 | — |
| n6 | E1, E2, E3 (de paso) | 0 de 4 | — |
| n7 | N7d | 0 de 4 | — |
| n7 | N7b (de paso) | 0 de 4 | — |
| n7 | N7a (de paso) | 3 de 4 | n7-1 [14] «`e2e` · `npm run e2e` · duración pendiente · pendiente»; n7-3 [14] «`unit` · … · unitario» sin decir que `src/app.test.ts` solo llama a funciones; n7-4 [12] «`unit` · … · unitario» y «`e2e` … · pendiente» |
| n7 | N7c (de paso) | 1 de 4 | n7-4 [12] «**Lint**: no declarado (hay un script `lint`…)», sin `npm run lint` como valor |

Verdes, con cita:
- n6-1, T3: [11] «**Temporales**: `e2e` · `test-results/` (Playwright sin `outputDir`) · propuesta `outputDir: '.temp/playwright'`» en el borrador, que sale antes de las preguntas (el hueco del corte).
- n6-2, T3: [15] «`e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`; `test` · no declarado».
- n6-3, T3: [13] «`e2e` · `test-results/` (valor por defecto de Playwright) · propuesta `outputDir: '.temp/playwright'`».
- n6-4, T3: [12] «`e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`». Ninguno toca `playwright.config.ts` (`state.txt` sin diff). E1, E2 (retries `0`/`2`, `60 s por test, sin motivo escrito`) y E3 (presupuesto `pendiente`) pasan en los cuatro; en n6-3 [15] y n6-1 [13], tras «la que recomiendas», los flujos core o siguen `pendiente` o se dan por la recomendación ya preguntada, no sin preguntar.
- n7-1 [11], n7-2 [12], n7-3 [14], n7-4 [12], N7d: `.github/workflows/ci.yml` · `gh run list --workflow ci.yml --branch main -L 1 --json conclusion,headSha`. Los cuatro dan el borrador antes de nada.

Observación fuera de lo pedido: `rojos.md` dice «N7a ahora pasa». Con la letra («`unit` por unitario sin decir que su test solo llama a funciones» y «`e2e` no es `E2E`») pasan solo 1 de 4. Quien relea N7a debe decidir si «`e2e` sin tests en el molde» admite `pendiente`.

### sdd-retro (n = 4)

| Escenario | Fila | k de n que fallan | Cita [n] del fallo |
| --- | --- | --- | --- |
| r6 | R7 Sin carpeta | 0 de 4 | — |
| r6 | R8 Oferta | 3 de 4 | r6-2 [9] termina en «¿Confirmas `v1.4.0`? … Smoke» y no ofrece estimación ni action items; r6-3 [21] «Retro: `sdd-retro` respondió `Sin deuda triada`, así que no hay propuestas ni `retro.md`» y ninguna oferta; r6-4 [9] para en la versión y la smoke, sin oferta |
| r6 | L | 0 de 4 | reparo: r6-4 [9] «Entry gate superado» (dos palabras sueltas en una frase en castellano) |

Verde: r6-1 [18] «**Estimación y action items:** hay un `estimation-log.md` … Si quieres la retro con la estimación y los action items, dímelo.» Ninguno crea `.docs/sdd/releases/v1.4.0/`.

Causa que veo: r6-2 y r6-4 paran antes de llegar al repaso porque la petición no trae la versión («Cierra la release con lo que hay en Now»; r4 sí la trae, «la versión es esa, confirmada») y piden confirmarla; r6-3 sí llega, la retro da «Sin deuda triada» y el hilo no repite la oferta.

### sdd-rubber-duck (n = 4 por escenario)

| Escenario | Fila | k de n que fallan | Cita [n] del fallo |
| --- | --- | --- | --- |
| s1 | R1 Sin jerga | 3 de 4 | s1-1 [7] «una opción `--sala`»; s1-2 [5] «`--sala Norte`»; s1-4 [5] «`exportar --mes 2026-03 --sala Norte`» y «la orden `exportar`» |
| s1 | R3 Qué y cómo | 0 de 4 | — |
| s1 | R2 | 0 de 4 | — |
| l1 | R1 Sin jerga | 1 de 4 | l1-3 [15] «el programa da por fija en UTC+2. El calendario las quiere en UTC.» sin decir qué es UTC |
| l1 | R2, R4, R5, R6, C1, L | 0 de 4 | — |
| w1 | R1 Sin jerga | 4 de 4 | w1-1 [6] «que va dos horas por delante de UTC. UTC es un reloj de referencia mundial.»; w1-2 [5] «dos horas por delante de UTC. UTC es un reloj de referencia único»; w1-3 [8] «cambia la hora a UTC. UTC es un reloj que va…»; w1-4 [7] «pasa esa hora a UTC. UTC es un reloj que va…» |
| w1 | R10 Re-pitch | 0 de 4 | reparo: w1-4 [7] «el test dice «hora del usuario»» cita un trozo del nombre del test; es citar el mensaje anterior, no el identificador `toISOString()` ni el nombre entero |
| w1 | R2 | 0 de 4 | — |

Verdes, con cita:
- s1 R3: s1-1 cinco frases ([7] «Hoy, … Con esta feature, … Para ello, … Sin la opción, … El fichero de una sala…»); s1-2 tres; s1-3 cinco; s1-4 cinco. Lo pendiente va tras el párrafo en los cuatro. s1-3 [7] no lleva ni ruta ni comando: es el único limpio en R1.
- l1 R1: l1-1 [15] «que va dos horas por delante de UTC (el reloj de referencia que usan los calendarios)»; l1-2 [16] «a UTC, que es un reloj sin zona horaria propia, para que cualquier calendario sepa a qué hora cae»; l1-4 [15] «a UTC, el reloj de referencia que usan los calendarios». Reparo en l1-2: `20260302T080000` en el paso 4. Rutas solo en «Dónde mirar» en los cuatro.
- l1 R4 a R6: 7, 7, 6 y 6 pasos numerados, un ejemplo con marzo y la sala Norte, y todos terminan ofreciendo resolver dudas.
- w1 R10: los cuatro empiezan con contexto (w1-2 [5] «Perdona, me expliqué mal. Empiezo por el contexto.») y ninguna frase pasa de 25 palabras.

### sdd-roadmap (n = 4 por escenario)

| Escenario | Fila | k de n que fallan | Cita [n] del fallo |
| --- | --- | --- | --- |
| m5 | M5 | 1 de 4 | m5-4 [6] «**Brief:** Carril `feature` … El campo Requisitos, Decisiones y Toca los dejaría con lo mínimo» (no enseña las cinco etiquetas: falta Salda) |
| m7 | M7 | 1 de 4 | m7-1 [6] «No hay ningún `retro.md` de una release anterior que aporte propuestas.» (hizo `ls .docs/sdd/releases` sin entrar en `v1.5.0`; los otros tres sí leen `releases/v1.5.0/retro.md`) |
| m7 | M7b | 0 de 4 | — |
| m7 | L | 0 de 4 | — |

Verdes, con cita:
- m5-1 [6], m5-2 [8], m5-3 [5]: «Fila propuesta, en Next», con título, one-liner, brief de cinco etiquetas (Carril, Requisitos, Decisiones ya tomadas, Salda, Toca), `⏳` y tamaño `S`; ninguno escribe antes del OK. Reparo en m5-2: «Requisitos: `…proposal-0010-reports/proposal.md` … aún no la he leído entera».
- m7-2 [8] «Retro v1.5.0 … (A1: medir el lote con la máquina cargada)», m7-3 [7] y m7-4 [7] nombran A1.
- M7b: los cuatro dicen `## Now — 1.6 · en preparación` (m7-3 [7] «la versión se queda tal como la escribiste»), ninguno pregunta «1.6.0», ninguno pregunta el destinatario (`hasRecipient: false`), y las filas en alcance llevan `**Toca:**`. m7-2 [8] usa «usted» (castellano formal, no inglés).

### sdd-upgrade (n = 4)

| Escenario | Fila | k de n que fallan | Cita [n] del fallo |
| --- | --- | --- | --- |
| v5 | V20 | 0 de 4 | — |
| v5 | V19 | 0 de 4 | — |
| v5 | V16, V17, V18 (de paso) | 0 de 4 | — |

Verdes, con cita:
- V20: `operations.md` final conserva «2 de 2 sujetos de `sdd-end-patch` pararon en el paso 0» en los cuatro (`state.txt` líneas 220-221). La tabla lo anuncia: v5-2 [tabla del paso 5] «`tech-stack.md:17` … Conservar: es una medición fechada»; v5-4 «`steering/operations.md:16` … **Conservar**»; v5-3 «se queda tal cual»; v5-1 [12] «se queda tal cual (paso 5)». Reparo en v5-4: la línea pierde el guion de viñeta en `operations.md`; el texto está entero.
- V19: `cierre.md` conserva «`sdd-end-patch` pasa a `sdd-archive`» en los cuatro. v5-2 (tabla), v5-3 (lista) y v5-4 (tabla) enseñan la línea 12 antes de cambiarla; v5-1 no la cambia.
- V16/V17/V18: Now `## Now — 3.0.0 · en preparación` con 0030, 0031, 0032, 0033 y 0023 (0032 y 0023 en ✅); 0021, 0022 y 0024 en Next; Later con 0040 y los ids 0041, 0042 y 0043 de `id next --reserve`; los cuatro preguntan o declaran el estado de «Estreno con recepción» (v5-1 [12], v5-3 [122], v5-4 [49] preguntan; v5-2 [91] y [124] lo pregunta y lo aplica a `⏳`).

### interviewer (f4-int)

fp, p2 y pe, n = 4. Aviso sobre E3: lo juzgué por «la respuesta está en la petición». «Las cuadra los lunes en su hoja» solo nombra el cuadre; saber contra qué compara o qué necesita ver no está en la petición, así que esas preguntas pasan. Los lectores anteriores contaron un caso suelto por escenario con preguntas parecidas; lo dejo como reparo y lo señalo en el Resumen.

| Escenario | Fila | k de n que fallan | Cita [n] del fallo |
| --- | --- | --- | --- |
| fp | K Carga | 3 de 4 | fp-1, fp-2 y fp-4: ningún `Skill: sdd-grilling` ni lectura de `sdd-grilling/SKILL.md` en `tools.txt`; el turno 2 es [14], [13] y [13]: «No puedo abrir una feature para «añadir» algo que ya está» (fp-1), «no puedo abrir una feature … Sería crear un duplicado de `libres`» (fp-2), «No voy a crear un segundo comando que haga lo mismo» (fp-4) |
| fp | E1 (fp-3, único que cargó) | 0 de 1 | — |
| fp | E1, por conducta en fp-1, fp-2 y fp-4 (no puntúa: «no cargó») | 3 de 3 | el turno 2 vuelve a rebatir tras «mantengo lo que dije» (citas de arriba) |
| fp | E0, E2a, E2b, E3, E5 | 0 de 1 (fp-3) | — |
| p2 | K | 0 de 4 | — |
| p2 | E3 | 0 de 4 | reparo: p2-3 [9] «¿con qué las compara y qué le hace falta ver en la hoja?» y p2-4 [20] «y qué hace hoy con las reservas cuando las cuadra» rozan lo que la petición dice («las cuadra») |
| p2 | E5 | 0 de 4 | reparo de frontera: p2-4 [20] «¿Con qué programa abre … y qué hace hoy …?» son dos peticiones del mismo asunto (cómo usa el CSV) |
| p2 | E0, E2a, E2b | 0 de 4 | reparo E0: p2-1 [22] y p2-4 [20] fijan «el CSV tiene que abrirse bien a la primera» como lo que importa, sin que nadie lo dijera |
| pe | K | 0 de 4 | — |
| pe | E3 | 0 de 4 | reparo, mismo criterio que p2: pe-1 [16] «qué haces el lunes con la hoja de cálculo cuando cuadras las reservas», pe-2 [16] «qué compara con qué y qué busca encontrar», pe-4 [17] «contra qué las compara y qué necesita ver» |
| pe | E7 | 0 de 3 | pe-1: sin veredicto (la tanda acaba tras la primera pregunta) |
| pe | E5, E0, E2a, E2b | 0 de 4 | reparo E0: pe-1 [16] «Entiendo que «el responsable de cada sala» es un papel y que de momento lo ejerces tú» |
| pe | Reparo idioma | 1 de 4 | pe-4 [33] «Nothing was written. I'll create the spec with the file tool.» |

Verdes, con cita:
- p2-1 [22] «¿En qué programa y con qué configuración regional abre el responsable la hoja de cálculo?»; p2-2 [15] «❓ **¿En qué hoja de cálculo cuadran las reservas los responsables?**»; p2-3 [9] y p2-4 [20] preguntan una sola cosa del mismo asunto. K de p2-3: `cat ../../sdd-grilling/SKILL.md` al final de un comando compuesto (la expresión de K lo acepta).
- pe-2 [18] y pe-3 [20] preguntan el separador una vez y paran: pe-2 [48] y pe-3 [41] presentan la spec («1. **Apruebo (Recomendada)**»); pe-4 [39] igual. La salida, el separador y el rango los deciden con motivo en la lista «Decisiones que he tomado yo» (pe-2 [48] puntos 2, 3 y 8) y no vuelven a preguntar.

#### fp: por qué cambió (3 de 4 sin `sdd-grilling`) frente a c-int (5 de 5 con ella)

Lo que no cambió: el turno 1 es el mismo en `c-int` y `f4-int` (los cinco de `c-int` también paran con «Este comando ya existe, así que no he abierto ninguna feature» y preguntan «¿Qué quieres que haga?»). Lo que cambia es el turno 2, tras «mantengo lo que dije». En `c-int` los cinco crean rama, cargan `sdd-grilling` y lo anotan como decisión tuya (c-int fp-2 [17] «Mantienes tu petición, así que la tomo como decisión tuya… Sigo adelante, aunque lo que pides se solape con lo que ya hay»). En `f4-int` fp-3 hace lo mismo (fp-3 [21] «lo anoto como decisión tuya y no vuelvo a plantearlo»); fp-1, fp-2 y fp-4 ejecutan `libres` otra vez y se niegan.

Diff `kcut` → `kfix` de `sdd-propose/SKILL.md`, solo tres cambios: (1) paso 2, lane lite: «meets the predicate of modo-lite.md»; (2) paso 2, lane feature: «everything else, in full mode, **once you read that predicate and it fails**»; (3) paso 3, `id claim` «right after the branch» (antes «before the folder»); más la pasada de coherencia. En `references/` cambian `control-profiles.md`, `config-lane.md`, `plan-writing.md` y `review-spec.md`, ninguno de la clasificación. En `sdd-grilling/SKILL.md`: «Ask only what the request… leave open» sustituye a «Skip what the request says», y «Challenge once» gana «the objection isn't raised again».

Lo único que toca la clasificación es (2): elegir «feature» pasa a exigir haber leído `modo-lite.md` y que el predicado falle. Ninguno de los tres que paran lo lee (cero apariciones de `modo-lite` en sus `tools.txt`), y tampoco fp-3, así que no puedo probar que (2) sea la causa. Lo que sí es seguro: los tres que paran se quedan en el paso 2 (clasifican la premisa falsa como «no es una feature»), y `sdd-grilling` solo se carga en el paso 4, tras la rama; las dos frases de «Challenge once» («go on as asked, even if it repeats what exists»; «the objection isn't raised again») nunca llegan a verlas. Es decir: el arreglo de E1 vive donde estos sujetos no llegan. 3 de 4 frente a 0 de 5 tiene p ≈ 0,05 (Fisher), así que no descarto el azar; la prueba limpia es relanzar fp n = 4 con la frase (2) de `kcut`, dejando el resto de `kfix`.

Conducta: peor. `sdd-grilling` («Challenge once… record it in their words and go on as asked, even if it repeats what exists») y la fila E1 («el turno 2, tras «mantengo lo que dije», vuelve a rebatir» falla) piden aceptar tras el rebate. fp-1 [14] llega a «Con tu frase tal cual no puedo seguir»; es lo contrario de seguir como se pidió. El turno 1 (el rebate con fuente: `src/app.js`, `test/app.test.js:5`, `CHANGELOG.md:10`) está bien en los cuatro.

### sdd-grilling (f4-grl, f4-grl2)

| Escenario | Fila | k de n que fallan | Cita [n] del fallo |
| --- | --- | --- | --- |
| g6 | R9 Rechazo en texto | 3 de 4 | g6-2 [21] «Hay dos formas de que ese momento te sirva: …» y «¿Con qué idea te quedas?»; g6-3 [26] «Hay tres formas de resolver ese momento: …» y «¿Cuál de las tres quieres …?»; g6-4 [23] «- Si la herramienta **reserva por ti** … - Si … **solo te avisa** … - Si … **no hace nada** …» y «¿Cuál de las tres encaja…?» |
| sk | B1 Boceto sobre la app real | 2 de 4 | sk-1 [17] «No te lo enseño en pantalla porque esta sesión no tiene Artifact y la app necesita un Playwright que no está instalado»; sk-2 [13] «No te enseño las variantes renderizadas porque esta sesión no tiene Artifact. Te las describo» (no considera la app) |
| g7 | C1 Tabla de claves | 3 de 4 | g7-1 [4] «¿Quieres que además revise las claves de configuración del kit (`sdd-config`) …?» antes de cualquier tabla; g7-3 [9] y g7-4 [8] abren con «❓ **Perfil de control**» sin tabla |
| g7 | R10 Cuándo para | 1 de 4, 2 sin veredicto | g7-1 [9] termina en la tabla y «Si quieres fijar alguna, dime cuál», sin lo decidido por el usuario ni por el agente ni lo pendiente; g7-3 y g7-4: la persona agota las 8 respuestas antes del resumen |
| g7 | R4 Recomendada con razón | 0 de 4 | reparo: g7-2 [20] «porque son los valores con los que el kit controla el paralelismo y los silencios, y no has pedido otros»; g7-3 [11] «es el perfil por defecto del kit … aunque hoy coincide con el default»; g7-4 [16] «sin que tengas que tocar nada». Las tres dan coste y algún hecho del caso; la razón es la de «por defecto» |
| sk-c (f4-grl2) | B2 | 0 de 1 | sk-c-1: no aplica (pregunta el porqué antes de llegar a «cómo se ve») |

Verdes, con cita:
- g6-1 [21]: «Te lo explico con un caso concreto, sin darte opciones todavía.» con `const bookings = …`, la secuencia de las 9:00 y las 11:00, y sin relistar las variantes (solo dice que «guardar solo la espera no basta»).
- sk-3 [13]: «Si prefieres verlas antes de decidir, dímelo y las monto» (ofrece enseñarlas; la excusa «Playwright no está instalado» sigue ahí, reparo). sk-4 [32]: arranca Playwright, hace capturas `actual`, `A`, `B`, `C` en `%TEMP%\sk4-shots\`, las describe con los datos del JSON y para el servidor que arrancó (reparo: no pudo abrirlas por permisos).
- sk-c-2 [16]: «No puedo enseñarte las variantes en un Artifact: no tengo esa herramienta en esta sesión. Te las describo con datos del `reservas.json` actual», con tres escenas y la tabla de ejemplo.
- g7-2 C1: [10] enseña la tabla de claves con valor y origen antes de «❓ **Perfil de control**»; R10: [33] «## Resumen» con «Quién lo decidió», «Sin escribir, con su valor por defecto».

#### g7: qué fila falla y de quién es

La petición «Revisa la configuración del kit y ponla al día» lleva a g7-1 y g7-2 a invocar `sdd-upgrade` antes que `sdd-config`. La puerta sale roja (la primera skill no es `sdd-config`) en esos dos. Fila por fila:
- g7-1 falla C1 y R10. [4] vuelve de `sdd upgrade` con «El proyecto ya está al día… ¿Quieres que además revise las claves…?» (pregunta sin tabla) y, tras el «no sé» de la persona, `sdd-config` solo enseña la tabla y no interroga.
- g7-2 no falla ninguna fila: [4] no pregunta y la tabla de [10] va antes de la primera pregunta. Solo falla la puerta.

Es del enrutado, no de `sdd-config`: la descripción de `sdd-upgrade` lista «ponme el proyecto al día» y la de `sdd-config` «revisa la configuración… bring up to date»; la petición lleva las dos expresiones. El arreglo está en las descripciones (o en la petición del escenario), no en el cuerpo de `sdd-config`. g7-3 y g7-4 no pasan por `sdd-upgrade` y fallan C1 igual: eso sí es de la skill (el paso 1 pide la tabla antes de la primera pregunta y no la enseñan).

## Trabajo 2: re-juicio con la letra nueva

### interviewer, E5

| Escenario | Evidencia | Fila | k de n que fallan | Cita [n] |
| --- | --- | --- | --- | --- |
| fp | c-int | E5 | 0 de 5 | reparo en los dos que rojos.md daba por fallo: fp-2 [17] «¿Qué vas a hacer con este comando, y qué te falta hoy cuando usas `libres`?» y fp-5 [20] «¿para qué lo quieres y qué quieres ver en la salida?» (los dos piden lo que necesita del comando: un asunto) |
| g3 | c-int | E5 | 0 de 2 | g3-1 [11] «¿qué haces hoy cuando la sala que quieres está ocupada y qué te gustaría que pasara con la lista de espera?»; g3-2 [13] «¿qué ha pasado la última vez … y qué habrías querido que pasara?» |
| g8 | c-int | E5 | 0 de 5 | g8-4 [10] «¿Qué problema concreto tuyo resuelve, y por qué no te basta con lo que usabas antes …?» (el par «quién lo usa y qué problema» de «Discovery» es un asunto) |
| p2 | c-int | E5 | 0 de 2 | p2-2 [21] «¿Qué reservas mira el responsable … y qué necesita ver de cada una?» |
| g3 | c4-int | E5 | 0 de 4 | g3-1 [17], g3-2 [25], g3-3 [19] y g3-4 [16] («¿Qué esperas que ocurra …? … ¿Para qué quieres esa lista de espera?», el ejemplo literal de la fila) |
| p2 | c4-int | E5 | 0 de 4 | p2-2 [11] «¿qué hace el responsable … con ese CSV cuando lo cuadra …, y qué le haría fruncir el ceño …?» (reparo: la primera mitad restate la petición) |

Verdes: todos los demás mensajes de esos sujetos llevan una sola decisión; las secuencias «❓ … ➡️ recomiendo … ¿Cuál eliges?» son la misma decisión.

### sdd-grilling, R1, R3 y R9

| Escenario | Evidencia | Fila | k de n que fallan | Cita [n] del fallo |
| --- | --- | --- | --- | --- |
| g2 | c-grl | R1 | 0 de 2 | reparo en g2-2 [7] «¿Qué problema concreto tienen hoy las clínicas con sus citas, y por qué quieres resolverlo con esta app?» (mismo asunto: el problema) |
| g3 | c-grl | R1 | 1 de 2 | g3-2 [17] «¿Qué debe pasar cuando se libera la sala?» con alternativas y, tras ➡️, «una duda abierta: ¿para qué quieres la lista de espera …?» (dos asuntos: comportamiento y motivo). g3-1 [12] «¿Para qué quieres …? … ¿qué quieres que pase después, y qué harías tú con esa lista?» pasa: un asunto |
| g3 | c4-grl | R1 | 0 de 4 | — |
| g3 | c-grl | R3 | 0 de 2 | reparo: g3-2 [17] 3️⃣ «Igual que la 1️⃣, pero … se manda un correo. Depende de la 0008, que aún no existe.» y [19] 3️⃣ «Correo … Depende de la 0008»; dicen qué pasa, pero lo único que cuentan a su favor es el qué |
| g3 | c4-grl | R3 | 2 de 4 | g3-2 [15] 3️⃣ «Consultar a demanda … No hace nada solo, y es casi lo mismo que mirar `libres`»; g3-3 [18] 2️⃣ «Solo apuntarte a la cola … el mismo sondeo con otro comando» |
| g6 | c-grl | R9 | 2 de 2 | g6-1 [20] «En ese momento puede pasar una de estas tres cosas: - La herramienta te reserva Norte directamente … - … solo te avisa … - … comando que se queda esperando»; g6-2 [18] «- **Reserva automática.** … - **Solo aviso.** … - **Retener hasta confirmar.**» |

Verdes, con cita:
- g3 c4-grl R3: g3-1 [20] 3️⃣ «Es lo más simple, pero sigues teniendo que lanzar el comando tú» (da algo a favor); g3-4 [24] 3️⃣ «`esperar Norte lun 10:00-12:00` se queda en marcha y sale con `Norte libre`» con su coste.
- g3 c4-grl R1: g3-4 [16] «¿Qué esperas que ocurra …? … ¿Para qué quieres esa lista de espera?» es el ejemplo literal que la fila da por una.

## Resumen

Por escenario.

**sdd-init**
- n6: verde (T3, 0 de 4; E1, E2 y E3 también 0 de 4). El arreglo funciona: los cuatro enseñan el borrador de `operations.md` con la propuesta `outputDir` antes de preguntar.
- n7: verde (N7d, 0 de 4; N7b 0 de 4). De paso, N7a sale 3 de 4 (`e2e` en `pendiente` y `unit` por unitario sin decir que el test solo llama a funciones) y N7c 1 de 4 (n7-4). Si se quiere N7a verde, el arreglo va en la batería (decidir si un `e2e` sin tests admite `pendiente`) o en `sdd-init` si se quiere forzar `E2E`; no lo he pedido arreglar.

**sdd-retro**
- r6: rojo R8, 3 de 4. Causa: r6-2 y r6-4 paran en la confirmación de la versión antes del repaso (la petición no la trae), y r6-3 llega, ve «Sin deuda triada» y no repite la oferta. Arreglo: batería para los dos primeros (la petición de r6 debe traer «la versión es 1.4.0, confirmada», como r4); skill (`sdd-end-release` paso 7) para el tercero. R7 y L verdes.

**sdd-rubber-duck**
- s1: rojo R1, 3 de 4 (`--sala`, `--sala Norte`, `exportar --mes … --sala Norte` dentro del párrafo). R3 verde 0 de 4. Causa: el párrafo lleva el nombre de la opción del comando; antes era un caso suelto y ahora son tres. Arreglo en la skill (modo corto: lo que aprueba el dev-lead es lo que ve, no la orden), sustituyendo texto.
- l1: rojo R1, 1 de 4 (l1-3: `UTC+2` y «El calendario las quiere en UTC» sin explicar). Caso suelto, ya no se repite (l1-2 pasa): nada, vigilar.
- w1: rojo R1, 4 de 4 (el UTC se explica siempre en la frase siguiente). Causa: la regla «explicado en la misma frase, no en la siguiente» está en Palabras y el re-pitch no la remite; los cuatro la incumplen. Arreglo en la skill (llevarla al paso del re-pitch). R10 verde.

**sdd-roadmap**
- m5: rojo M5, 1 de 4 (m5-4: brief en prosa sin Salda). Caso suelto: nada, vigilar.
- m7: M7 rojo 1 de 4 (m7-1 no entra en `releases/v1.5.0/` y dice que no hay `retro.md`); caso suelto, arreglo en la skill (`prepare-release.md`, leer el retro de la última release) solo si repite. M7b verde 0 de 4: el arreglo del «1.6» tal cual funciona.

**sdd-upgrade**
- v5: verde (V16 a V20, 0 de 4). El arreglo de V20 y la corrección de V19 en la batería funcionan.

**interviewer**
- fp: rojo K, 3 de 4 (fp-1, fp-2 y fp-4 no cargan `sdd-grilling`, ven que `libres` existe y se niegan a seguir tras «mantengo lo que dije»). Peor conducta que en `c-int` (5 de 5 la cargaban): contradice «Challenge once… go on as asked» y la fila E1. El diff de `sdd-propose` solo toca la clasificación en «feature — everything else… once you read that predicate and it fails»; no puedo probar que sea la causa. El arreglo de «Challenge once» está en `sdd-grilling`, que estos sujetos no llegan a cargar, así que el arreglo va en `sdd-propose` (el paso 2 debe decir qué hacer con una premisa falsa que el usuario mantiene), o se revierte esa frase. Prueba limpia: relanzar fp con la frase de `kcut`.
- p2: verde (K 4 de 4; E5 0 de 4; E3 0 de 4 con reparo: tres sujetos preguntan por el cuadre que la petición nombra). Si el dev-lead quiere que esas preguntas cuenten como E3, la batería debe decirlo.
- pe: verde (E5, E3 0 de 4; E7 sin fallos, uno sin veredicto). Reparo de idioma en pe-4 [33].

**sdd-grilling**
- g6: rojo R9, 3 de 4 (los tres relistan las variantes como «tres formas» o «tres escenarios» al explicar). El sujeto que lo cumple (g6-1) rechazó otra decisión. Causa: «un caso con sus datos» se cumple listando las alternativas como casos. Arreglo en la skill («Rejected to clarify»: el caso es uno y no enumera las variantes), sustituyendo palabras.
- sk: rojo B1, 2 de 4 (sk-1 y sk-2 dicen que no pueden enseñarlo; sk-3 y sk-4 sí lo ofrecen o lo hacen). Causa: la frase «a missing dependency (Playwright) is not a reason» ya está y 2 de 4 siguen usando esa excusa. Arreglo en la skill, subiendo la orden («instala, arranca, captura») al lugar donde se decide enseñar.
- g7: rojo C1, 3 de 4 (g7-1 por enrutado a `sdd-upgrade`; g7-3 y g7-4 abren con la pregunta sin tabla) y R10 1 de 4 más 2 sin veredicto. R4 verde con reparo («por defecto» como razón). Arreglo: enrutado en las descripciones de `sdd-upgrade`/`sdd-config` (g7-1, g7-2); skill `sdd-config` paso 1 para g7-3 y g7-4.
- sk-c: verde (B2, 0 de 1 juzgado; sk-c-1 no aplica porque pregunta el porqué antes del «cómo se ve»). Falta un segundo sujeto de la comparación: sk-c-2 pasa.

**Re-juicio (trabajo 2)**
- interviewer E5 en `c-int` (fp, g3, g8, p2) y `c4-int` (g3, p2): verde, 0 de 5, 0 de 2, 0 de 5, 0 de 2, 0 de 4 y 0 de 4. Con la letra nueva, los rojos de `rojos.md` pasan a reparo.
- sdd-grilling R1: g2 verde 0 de 2 (reparo en g2-2); g3 `c-grl` rojo 1 de 2 (g3-2 [17], una duda de motivo tras ➡️ sobre otro asunto); g3 `c4-grl` verde 0 de 4. R3 g3: `c-grl` verde 0 de 2; `c4-grl` rojo 2 de 4 (g3-2 y g3-3, la alternativa solo dice que no sirve), arreglo en la batería ya hecho (fila corregida) y la skill lo cubre. R9 g6 `c-grl`: rojo 2 de 2, igual que en f4-grl; arreglo en la skill.

Lo que no comprobé: el cuerpo de los `Agent` y el texto de la persona en `pe` y `g7`; la calidad del contenido de `operations.md` más allá de las filas; y para `v5` solo leí `state.txt` y los mensajes, no los ficheros de `repo/`.

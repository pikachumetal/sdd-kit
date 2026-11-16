# Rojos de la batería del corte de la 3.0.0 y dónde se arreglan

Fuente: `c-lectura-a.md` … `c-lectura-k.md` (kit medido en `.temp/kcut/skills/`), `r-lectura-t2.md` y `r2-lectura-t3.md` para los tres de la ronda, y `tests/release-3.0.0.md` para la medida anterior. «Fallan (k de n)» cuenta los sujetos que fallan la fila. «Antes» es la última medida de la 0152 (o de la ronda). Regla del repo: ningún arreglo alarga una skill; mueve, sustituye o quita. Un rojo de un solo sujeto, causa «sujeto» y sin segundo caso, no se arregla («nada»).

Marcas en «Dónde va»:
- **skill**: un arreglo por skill, que cubre todas sus filas.
- **batería**: se corrige la fila o el molde.
- **nada**: caso suelto, se queda en el ticket.
- **regresión**: estaba verde en la 0152 y falla ahora en algún sujeto. Por la decisión 6 se relanza a n = 4 sobre el mismo kit y no se arregla antes de medirlo.
- **ronda**: rojo de la ronda de esta feature que sigue rojo tras su REFACTOR.

Sin rojos: `sdd-feedback`, `sdd-explore`, `sdd-debugging`, `sdd-agent-writing`, `using-sdd`.

El inglés suelto en el hilo (L) aparece en archive, verify, implement y propose. Va como decisión D3, no fila por skill.

## sdd-init

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| n6 | T3 | 1 de 2 (n6-1) | rojo 1/2 (n6-1: T3, E1 y E3) | Hace preguntas (timeout, flujos core) antes de enseñar el borrador de `operations.md` y no da la propuesta `outputDir`; la skill no dice qué va primero | skill: `sdd-init/SKILL.md` paso 3 (y «go on with the first document missing» del paso 2): el borrador sale primero con lo que se lee del repo y las preguntas van después. La frase de la propuesta `.temp/` se mueve junto a ese paso |
| n7 | N7d | 1 de 2 (n7-1) | rojo 1/2 en N7a (n7-1); N7a ahora pasa | No enseña el borrador y deja la CI «como está», sin dar la orden `gh run list`; mismo hueco de orden de turnos | skill: el mismo arreglo del paso 3 |

## sdd-retro

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| r6 | R8 Oferta | 1 de 1 | rojo 1/1 (z-ret y release) | Lee «solo si lo pide el usuario» y no ofrece la estimación; la oferta está escondida en una cláusula entre rayas dentro de la frase del GATE | skill: `sdd-end-release/SKILL.md` paso 7: sacar la oferta a frase propia. En `sdd-retro/SKILL.md` paso 4, que el «only if the user asked» remita a ella. Es la tercera medida con la misma frase |
| r4 | R9 Changelog | 1 de 2 en máquina (r4-2); 0 de 2 en conducta | verde (R1-R8 2/2; la fila es nueva) | El sujeto sí leyó `add-to-changelog` con `cat … \| head -50`, pero el regex no admite la tubería tras la ruta | batería: R9, admitir `\|` tras la ruta (se re-juzga sobre la evidencia que ya existe) |

## sdd-rubber-duck

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| s1 | R3 Qué y cómo | 1 de 2 (s1-1) | rojo 1/2 (s1-2, sexta frase) | Escribe seis frases cuando la skill dice cinco como máximo; la sexta frase ya salió en s1-2 y s2-1 | skill: `sdd-rubber-duck/SKILL.md`, modo corto: poner el tope de cinco donde se decide el cierre del párrafo, sustituyendo otra frase |
| s1 | R1 Sin jerga | 1 de 2 (s1-2) | verde | Mete `exportar --mes … --sala Norte` y un nombre de fichero en el párrafo | nada: caso suelto (primer caso de comando en el párrafo) |
| s2 | R9 Pendiente sin pregunta | 1 de 2 (s2-2), dudoso | rojo 1/2 por R3 (otra fila) | Tras «Falta decidir» lista las dos opciones; no hay pregunta ni recomendación | nada: caso suelto y dudoso |
| l1 | R1 Sin jerga | 1 de 2 (l1-2), dudoso | rojo 1/2, mismo sujeto y mismo fallo | Dice «UTC» en una frase y lo explica en la siguiente, no en la misma | skill: `sdd-rubber-duck/SKILL.md`, regla «el término y su efecto son una sola idea»: añadir que van en la misma frase, sustituyendo la mención de frases cortas. Es el mismo fallo de l1-2, de w1-1 y de la medida anterior |
| w1 | R1 Sin jerga | 1 de 1, dudoso | rojo 0/1 por R10 (otra fila; ahora R10 pasa) | Mismo patrón de UTC en dos frases | skill: el mismo arreglo |

## sdd-roadmap

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| m5 | M5 | 2 de 2 (m5-1 escribe y commitea sin proponer; m5-2 propone la fila en Now) | rojo 1/2 (m5-1 escribió sin proponer) | m5-1: la skill ya manda proponer y esperar (paso 3), pero la regla queda lejos de donde se escribe la fila. m5-2: la skill permite Now o Next y la fila exige Next | skill: `sdd-roadmap/SKILL.md` paso 3, la orden «proponer y esperar» junto al paso que escribe, moviéndola. batería: M5, aceptar Now o Next (decisión D6) |
| m7 | M7b | 1 de 2 (m7-1) | rojo 1/2 en L (otro sujeto); misma «1.6.0» por «1.6» que la 0308 | Pregunta si la versión es «1.6.0» cuando el usuario dijo «1.6»; la regla existía y hay segundo caso | skill: `sdd-roadmap/references/prepare-release.md` paso 6: la versión que da el usuario va tal cual, en el punto donde se escribe el título |
| m3 | M3 («Causa» `sin determinar` del CSV) | **ronda**: 3 de 4 literal en el GREEN de la ronda; 1 de 4 tras el REFACTOR; **0 de 2 en el corte (verde)** | rojo 0/2 por el título (m1) en la 0152 | La propuesta en prosa da una hipótesis y no la «Causa» `sin determinar`; la skill no exige darla en la propuesta | skill (segundo intento, ver D4): `sdd-roadmap/SKILL.md` l. 99, que la propuesta lleve la «Causa» de cada fila de `Por triar`. Si no se reabre, queda como fila de bug |

## sdd-upgrade

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| v5 | V20 Mediciones fechadas | **ronda**: 1 de 2 (v5-1) en el corte; en la ronda V19 1 de 4 (2 de 4 literal) | rojo 1/2 en V16; GREEN de la ronda V16 0 de 4 y V19 1 de 4 | La tabla dice que la línea fechada «va a la tabla» y luego se deja fuera sin que ninguna tabla lo muestre; lo escrito no coincide con lo enseñado | skill (segundo intento, ver D4): `sdd-upgrade/SKILL.md` paso 5 (o `references/migrations/v3.0.0.md`): lo que se escribe es exactamente lo que enseña la tabla. Cambia la forma, sin palabras netas |
| v5 | V19 Nombres en capabilities | 1 de 2 solo si «tabla» se lee al pie de la letra; 0 de 2 por intención | 1 de 4 claro, 2 de 4 literal en la ronda | La fila dice «tabla» y el sujeto lo enseña en viñetas | batería: V19, «lista o tabla» |
| g2 | G2a Aviso del lint | 1 de 2 (g2-2) | verde 2/2 | Parafrasea el aviso en vez de copiar la frase de la skill «tal cual» (G2b y G2c pasan) | regresión: relanzar n = 4, sin arreglo antes (un solo sujeto) |

## sdd-archive

Sujetos sin RESULTADO: `se1-1` (único de se1, sin juicio), `g3d-1`, `g7-1` y `ci2-1`. Hay que relanzar esos cuatro sujetos. Con un solo sujeto juzgado quedan g7 (g7-2 verde) y ci2 (ci2-2 verde con reparo).

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| c2 | Tope3 Tope de la base | 2 de 2 | verde 2/2 | Miden contra el tope de la rama (41) y no contra el de `develop` (11); el molde no tiene remoto, así que `origin/develop` no existe y la skill no dice qué hacer sin remoto | skill: `sdd-archive/references/learnings.md` «A destination at its word cap»: «`origin/<integración>`, o la rama de integración local si no hay remoto», sustituyendo palabras (regresión con causa leída, 2 de 2) |
| a6 | D1 ADR escrita | 1 de 2 (a6-2) | verde; el GREEN de la regla daba D1 1/2 | Escribe «ADR 0003 (…)» en vez de la línea literal `ADR: <candidata> → decisions/NNNN-<slug>.md` | skill: `sdd-archive/SKILL.md` paso 3 (ADR): la línea literal va donde se decide, moviéndola. Hay segundo caso |
| v1b | V1 🦆 y ✋ en campo | 1 de 1 (a1-1 y a1-2 hacen lo mismo fuera de fila) | verde | Cierra con «Decisiones tomadas sin el dev-lead» y no usa 🦆 ni «✋ Me salí del plan en…» | skill: `sdd-archive/SKILL.md` paso 9.2: el encabezado literal junto a la orden de dar las decisiones. Hay tres sujetos con el mismo cierre |
| g4 | G6 Plan B | 1 de 2 (g4-2) | verde 2/2 | Escribe «pendiente de lanzar `sdd validation serve`» y no lo lanza | skill: `references/dev-validation.md` §4: lanzarlo antes de presentar. Mismo arreglo que g3d |
| g3d | G6 Plan B | 1 de 1 juzgado (g3d-2); g3d-1 sin RESULTADO | rojo 1/2 (g3d-1, mismo patrón) | Con el entorno caído para y pregunta, sin línea `Panel:` ni `validation serve` | skill: el mismo arreglo de §4 («también con el entorno caído») |
| g6 | G6a, G6c | 1 de 2 (g6-2) | verde con reparo; 1 de 2 por la letra de G6c en y3 | Corre la suite entera antes del commit de cierre, y su «Validación en campo» no nombra el merge de sincronización | skill: `references/closing-suite.md` «No suite yet»: moverla al paso 1 donde se corre el smoke. Hay segundo caso |
| m3 | M3a, M3b, M3d | 1 de 2 (m3-1) | rojo 1/2 (z-arc) | Lee «dos adiciones a una línea» como dos que reescriben la misma frase y para | skill: `references/merge-recipe.md` «Integrated base»: sustituir la frase por el caso de la línea `**Escribe**` de la spec; el agente resuelve en cualquier perfil |
| g5 | G5c `--verified-at` | **ronda**: 1 de 4 en el GREEN; **0 de 2 en el corte (verde)** | rojo 0/3 (G5a) en la 0305; ronda GREEN 1 de 4 (g5-3) | Si el cierre no aplana, toma el sha del borrador de validación; la regla de `closing-suite.md` l. 21 está condicionada a que aplane | skill (segundo intento, ver D4): `references/closing-suite.md` l. 21, la regla sin la condición. Si no se reabre, queda como fila de bug |
| a4 | L | 1 de 2 (a4-1) | verde | Mensaje en inglés entre llamadas, tras fallar un script | regresión: relanzar n = 4; ver D3 |
| a9 | L | 1 de 2 (a9-1) | verde | Igual, tras un `Edit` que no casó | regresión: relanzar n = 4; ver D3 |
| t3 | L | 1 de 2 (t3-2) | verde | Igual, tras una inserción mal colocada | regresión: relanzar n = 4; ver D3 |

## sdd-verify

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| v1 | L | 1 de 2 (v1-1) | verde 2/2 | Un mensaje del hilo en inglés tras un fallo de herramienta | regresión: relanzar n = 4; ver D3 |
| mp1 | L | 1 de 2 (mp1-1) | verde | Del mensaje [96] en adelante el hilo va en inglés (tramo de `sdd-archive` y `sdd-retro`, ya cargados) | regresión: relanzar n = 4; ver D3 |
| c3 | C3 | 1 de 2 (c3-2) | verde 2/2 | `merge --check` dice «falta `merge.into`» y para sin lanzar la re-revisión; c3-1, con la misma salida, sigue | regresión: relanzar n = 4 (el molde no trae bloque `merge`) |
| c10 | C10 y C10r | 3 de 3 fallan C10 o C10r (C10: c10-2 y c10-3; C10r: c10-1 y c10-2) | verde con reparo en la 0152 (el lector anterior relajó la fila) | Deja la raya con `Final: Ruling: … cambiarlo es una desviación`, o para por la raya sin despachar el revisor de la enmienda; `closing-the-review.md` deja el `Ruling:` como salida de un Minor cuyo arreglo cambia la spec | skill: `sdd-verify/references/closing-the-review.md`: un Minor cuyo arreglo cambia la spec es desviación y para, no `Ruling:` (decisión D5). batería: C10r, el revisor de la enmienda solo si la enmienda se escribe |
| c7 | C7 | 1 de 2 (c7-2) | rojo 1/2 (sujeto invertido) | El Important del molde prescribe un texto que la spec no tiene, así que parar por desviación es lo correcto, y la fila no lo contempla | batería: C7, admitir la parada por desviación con 🦆 y ✋ (o cambiar el Important del molde) |
| f6 | Q6 | 1 de 1 | rojo 0/1 solo por L (Q6 pasaba) | Marca como hallazgo un comentario de «porqué» y a la vez lo pone en «Declined to judge» | nada: caso suelto (vigilar) |

## sdd-implement

`a2-1` no tiene salida: se relanza ese sujeto. Un sujeto de `h2` salió verde y no se lista.

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| cp1 | Cp1 | 3 de 3 (cp1-3 solo por la letra) | rojo 2/3 | Paran bien por el freno, pero el ✋ no abre con `Copia:`; la regla vive al final de la viñeta «How you stop», tras una frase que no es su caso | skill: `sdd-implement/SKILL.md`: mover la frase de `Copia:` de la línea 63 a la viñeta «Scope brakes» (l. 64), sin alargar |
| p4 | P4a | 1 de 3 (p4-3) | verde 3/3 | Con la orden «no escribas tests» no carga `sdd-tdd`, edita y commitea sin test | skill: `sdd-implement-native/SKILL.md` «Work the steps» (o `sdd-tdd`): la excepción del dev-lead no permite commitear ni cerrar la task sin su test. Se mueve la frase que hoy solo está en `sdd-tdd` |
| e1 | E1 | 1 de 2 (e1-1) | verde 2/2 | Ningún texto de Native dice qué hacer con una verificación lenta que lanzó el dev-lead, y el montaje no puede ejercerla | batería: E1, pasar a control o reducirla a «no commitea sin decir que la verificación lenta no se ha visto» |
| ml1 | ML6 | 1 de 3 (ml1-1) | verde 3/3 | El rojo es el residuo de `data/` que deja la primera pasada del gate; un checkout limpio da 6/6 | batería: molde de `ml1` (borrar `data/` antes de la segunda pasada, o listar `test/cancel.test.js` en «Ficheros»), y ML6 mide solo lo commiteado |
| r1 | D | 1 de 2 (r1-2) | verde 2/2 | `cancelledReport` filtra y da formato en la misma función de 11 líneas; la fila no dice qué es «mezclar» | batería: D, criterio medible o lectura asistida |
| r1b | D | 1 de 2 (r1b-1) | rojo 0/2 | Misma fila ambigua | batería: la misma D |
| t3 | Co, H, X | 0 de 2 medibles: ningún sujeto llega al RED | 1 de 2 con evidencia | La línea base del molde está en rojo (Norte lun nace cancelada), así que paran antes de la Task 1 | batería: molde de `t3`, línea base en verde |
| u2 | L | 1 de 2 (u2-2) | verde 2/2 | Una consigna en inglés antes del `Agent` de la enmienda | nada: caso suelto (ver D3) |

## sdd-propose

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| co4, p2, sp1 | TP «Carga `sdd-templates`» | co4 2 de 2, p2 1 de 2, sp1 1 de 2 (4 de 8) | filas nuevas; sin medida | Ningún paso manda cargarla con `Skill`; leen la plantilla por su ruta con `cat` o `Read` | decisión D1: skill (`SKILL.md` pasos 4 y 5, `spec-writing.md` l. 5, `plan-writing.md`, «tras cargar `sdd-templates`», mismo tamaño) o batería (TP acepta leer la plantilla) |
| co6 | CO6 | 1 de 2 (co6-2), dudoso | verde con reparo | Reabre el gate como decisión del dev-lead (✋ 3) y deja las dos filas con destino «pendiente»; es una parada válida | batería: CO6, admitir como destino una pregunta al ✋ y citar por título o por `archivo:línea` |
| cr3 | CR3 | 1 de 2 (cr3-2) | rojo 1/2 (mismo sujeto) | Pone un ✓ sobre un molde sin listarlo entero, ocultos incluidos; el plan no lo manda | skill: `references/plan-writing.md` «Spec coverage», una frase compensada con otra que se quite (alternativa: fila informativa; D8) |
| d1 | D1 | 1 de 4 (d1-2) | rojo 3/4, mismo fallo | Edita `src/app.js` antes de escribir la causa en `patch.md`; la regla ya existe | skill: `sdd-implement/references/patch-flow.md` paso 3: la causa va antes del test rojo y del `Edit`, moviendo la frase del paso 4 |
| f1 | F1-C | 2 de 2 (1 de 2 si el silencio no cuenta) | rojo 0/2 | Avisa en plan→implement pero omite el `Ahora:` / `Queda:` en coherencia, review e integración; la regla está lejos de esos pasos | skill: `SKILL.md` l. 34 → mover la regla al paso 4 y a `references/review-spec.md`, donde se despacha la review |
| id1 | ID1 | 1 de 2 (id1-2) | rojo 1/2 (id1-1) | Entrevista sin `sdd id claim`; la skill lo ata a «antes de la carpeta», que se crea tras la entrevista | skill: `SKILL.md` paso 3 (l. 64): «justo al crear la rama, antes del primer mensaje» |
| k6 | K6 | 1 de 2 (k6-2) | verde 2/2 (rojo 1/2 en z-prp, otro síntoma) | Corre `rooms:test` sin filtro y deja `bookings:test` fuera de la línea `Gate:`: «that run is its only entry» se lee como entrada de toda la línea | skill: `references/config-lane.md` paso 4: «de esa tarea; las otras conservan la suya» |
| l1 | L1 | 1 de 2 (l1-2) | rojo 1/2 (l1-1) | Clasifica feature sin leer `modo-lite.md` ni ofrecer lite | skill: `SKILL.md` paso 2: leerlo antes de clasificar como feature; compensar quitando otra frase |
| pt1 | PT1 | 0 de 1 (falla por la letra, dudoso) | verde | Describe el test sin nombrarlo; la skill no pide nombrarlo | batería: PT1, «por nombre o por lo que comprueba» (mismo en PL1 de a2 y a3) |
| co2p | CO2P-M | 1 de 2 (co2p-2) | verde 2/2 | Escribe la fila de topes sin la forma `<comando> → <n>`; la fila es correcta | regresión: relanzar n = 4 |
| g1 | L | 1 de 2 (g1-1) | rojo 1/2 por G1 (G1 ahora pasa 2/2) | «Now decisions and review findings.» suelto, sin error de herramienta de por medio | nada: caso suelto (ver D3) |
| x1 | X1 | 1 de 2 (x1-2) | verde 2/2 | Entra en la entrevista sin contar tasks ni proponer partir | regresión: relanzar n = 4; primer caso, la skill ya lo manda |

## interviewer (el arreglo va en sdd-grilling)

La 0342 resolvió estos escenarios y su decisión 7 dice que no se reabren. El dev-lead los ha reabierto para el corte. `p3` quedó verde en el relanzamiento (E3 y E5 4/4), así que no se lista.

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| fp | E1 | 2 de 5 (fp-1, fp-4) | 2 de 5 | Mantienen que la feature «no puede repetir `libres`», contra «go on as asked, even if it repeats what exists» | skill: `sdd-grilling/SKILL.md`, «Challenge once»: lo repetido se acepta tras el rebate. Hay segundo caso |
| fp | E5 | 2 de 5 (fp-2, fp-5) | rojo, un sujeto más | Une dos peticiones con «y» en una sola «?» | skill: ver E5 de g3 (D2) |
| fp | E0 | 1 de 5 (fp-1), dudoso | verde | Salta a la pregunta de diseño sin preguntar el para qué | nada: caso suelto y dudoso |
| g3 | E5 | 1 de 2 original; **n = 4: 1 de 4 por la letra, 3 de 4 con la vara de la skill** | verde con 3/4 en el núcleo anterior | «Qué haces hoy y qué esperas» o «qué esperas y para qué» juntos en una «?» | skill y batería, según D2 |
| g8 | E5 | 1 de 5 (g8-4) | verde | «Qué problema resuelve y por qué no te basta lo de antes»; «Discovery» nombra el par «quién lo usa y qué problema» como una sola pregunta | skill: el mismo arreglo de «Two or more things» |
| g9 | E5 | 1 de 5 (g9-3) | verde | Pone una duda tras el ➡️, contra «a question after ➡️ is a second one» | skill: la misma regla ya existente en l. 16; segundo caso con `sdd-grilling` g3-2. Sin texto nuevo |
| p2 | E5 | 1 de 2; **n = 4: 0 de 4 por la letra, 1 de 4 con la vara** | verde | Dos peticiones en una «?» (p2-2) | skill y batería, según D2 |
| p2, pe | E3 | p2 1 de 2 (n = 4: 1 de 4); pe 1 de 5 (pe-2) | pe 5/5; p3 verde | Pregunta «qué hace el responsable con el CSV» cuando la petición o la fila 0002 ya lo dicen; con p3-1 son tres casos | skill: `sdd-grilling/SKILL.md` l. 16, «Skip what the request says … or the project shows»: el hecho del molde cuenta como dicho |
| pe | E7 | 0 de 5 (2 sin veredicto: la persona corta) | verde | La persona corta antes de que se fije el rango | nada: sin veredicto |

## sdd-grilling

| Escenario | Fila | Fallan (k de n) | Antes | Causa | Dónde va |
| --- | --- | --- | --- | --- | --- |
| g2 | R1 | 1 de 2 (g2-2) | rojo 2/2 | «Qué problema tienen hoy y por qué quieres resolverlo con la app»: dos cosas en una «?» | skill: el arreglo de E5 (D2) y «Discovery» en una sola pregunta |
| g3 | R1 | 2 de 2 en el corte; **n = 4: 0 de 4 por la letra, 1 de 4 con la vara** | verde con reparo | Tres peticiones y dos «?» (g3-1); duda tras el ➡️ (g3-2) | skill y batería, según D2 |
| g3 | R3 | n = 4: 2 de 4 (dudoso) | verde | La tercera alternativa solo dice que no sirve y que es lo mismo que `libres` | batería: R3, «dice que no sirve y no da nada a su favor». La skill ya lo cubre |
| g6 | R9 | 2 de 2 | rojo 2/2 | Reexplican en prosa y vuelven a listar las tres variantes, contra «no options or recommendation»; la fila dice «marcadas» y ninguno usa 1️⃣ ni ➡️ | skill: `sdd-grilling/SKILL.md`, «Rejected to clarify»: se explica el caso con sus datos y no se vuelven a listar. batería: R9, quitar «marcadas» |
| g7 | C1, R4, R10 | C1 1 de 2 (g7-2); R4 1 de 2 (dudoso); R10 1 de 2 (g7-1), más 1 sin veredicto | rojo 1/2 (C1) | `sdd-config` pregunta «¿a quién se aplica?» antes del valor y agota las 8 respuestas; no enseña la tabla de claves antes; el catálogo da «son los valores por defecto» como razón y la skill de grilling lo prohíbe | skill: `sdd-config/SKILL.md` pasos 1 y 2 (tabla antes de la primera pregunta; preguntar el valor antes del ámbito) y filas 5 y 8 del catálogo (razón del caso, no «por defecto») |
| g9 | R11 | 2 de 2 | rojo 2/2 | Ninguno busca en la web; la búsqueda autónoma salió de la entrevista en la 0342 y la fila E4w de `interviewer` también, pero R11 y «Look it up before asking» siguen | decisión D7: batería (quitar R11 y alinear la skill) o skill (mantenerla) |
| sk | B1 | 1 de 2 (sk-1) | rojo 1/2 (sk-1) | Dice que no puede enseñar variantes porque no hay Playwright; la skill no dice qué hacer sin dependencias | skill: `sdd-grilling/SKILL.md`, «`I haven't started the app` is not a reason»: arrancar `src/server.mjs` o ofrecer la variante sobre la app real |
| sk-c | B2 | sin veredicto (n = 1) | n/d | Pregunta el para qué y no llega a «cómo se ve» | batería: relanzar a n = 2 |

## Resumen

**Arreglos en skill (12, uno por skill; se cuentan los de la ronda)**
1. `sdd-init`: n6 T3, n7 N7d.
2. `sdd-end-release` y `sdd-retro`: r6 R8.
3. `sdd-rubber-duck`: s1 R3, l1 R1, w1 R1.
4. `sdd-roadmap`: m5-1, m7 M7b y m3 (ronda).
5. `sdd-upgrade`: v5 V20 (ronda).
6. `sdd-archive`: c2, a6, v1b, g4, g3d, g6, m3 y g5 (ronda).
7. `sdd-verify`: c10 (si se acepta D5).
8. `sdd-implement`: cp1.
9. `sdd-implement-native` o `sdd-tdd`: p4 P4a.
10. `sdd-propose`: cr3, d1, f1, id1, k6, l1, y TP si se elige la vía skill (D1).
11. `sdd-grilling`: fp E1/E3/E5, g8, g9, p2, g2, g3, g6, sk B1; E5 y R1 según D2.
12. `sdd-config`: g7 C1, R4, R10.

**Arreglos en batería (15 filas)**
- retro r4 R9
- roadmap M5
- upgrade V19
- verify C10r y C7
- implement E1, ML6 (molde), D de r1 y r1b, molde de t3
- propose CO6, PT1; TP si se elige esa vía
- grilling R3, R9 («marcadas»), R11 si se alinea con E4w
- sk-c a n = 2
- E5 si se adopta la vara de la skill

**Sin arreglo (caso suelto, 8)**
- rubber-duck s1 R1 y s2 R9
- verify f6 Q6
- implement u2 L
- propose g1 L
- interviewer fp E0 y pe E7
- el L de los demás va por D3

**Regresión, a relanzar sin arreglo previo (10 escenarios)**
- upgrade g2
- archive a4, a9, t3 (L)
- verify v1, mp1 (L) y c3
- propose co2p, g1 y x1

**Decisiones del dev-lead**
- **D1. TP: ¿se carga `sdd-templates` con `Skill` o basta leer la plantilla?** La decisión 8 de la 0343 dice que se cargue, pero ninguna skill lo manda. Recomiendo batería: TP acepta leer `sdd-templates/templates/*-template.md`. Lo único que se pierde es la regla de idioma, que `sdd-propose` ya incluye. Forzar la carga cuesta una llamada por cierre y no hay ningún sujeto que haya salido peor por no hacerla.
- **D2. E5 de interviewer y R1 de grilling: ¿una sola «?» que une dos peticiones con «y» cuenta como dos?** La letra de la fila no lo pide, pero `sdd-grilling/SKILL.md` l. 16 sí («Three things, together in one question is three»). Con la vara de la skill, g3 sale 3 de 4 fallan; con la letra, 1 de 4. Si cuenta, la skill pasa a «Two or more things» y E5 lo escribe. Si no, esos sujetos quedan como reparo y g3, g2 y p2 son verdes.
- **D3. L, inglés suelto en el hilo.** Hay 7 sujetos en archive, verify, implement y propose, casi todos tras un fallo de herramienta. `includes/user-language.md` ya dice «after a failed one too». Opciones: no tocar y vigilar (recomendado, porque la regla está y cada caso es de un solo sujeto), o reformular el include, que afecta a 15 skills por `kit:copies`.
- **D4. ¿Se reabren los tres de la ronda (m3, v5, g5)?** Ya tuvieron una ronda y un REFACTOR. m3 y g5 salen verdes en el corte; solo v5 V20 sigue rojo. Recomiendo arreglar solo v5 y dejar m3 y g5 como fila de bug.
- **D5. C10 de verify: ¿vale parar por la enmienda del recorte (lectura anterior) o la raya con `Ruling:` es fallo (letra)?** Define si el arreglo está en la skill o en la fila.
- **D6. M5 de roadmap: ¿la fila nueva va a Now o a Next?** La skill admite las dos. Recomiendo aceptar las dos.
- **D7. R11 de grilling: ¿se mantiene la búsqueda web antes de preguntar?** La 0342 la sacó de la entrevista (E4w) pero R11 y la skill la conservan.
- **D8. cr3: ¿arreglo de skill o fila informativa?** Es la segunda medida con el mismo rojo.
- **Fuera de las skills:** relanzar los cuatro sujetos sin RESULTADO de archive (`se1-1`, `g3d-1`, `g7-1`, `ci2-1`) y `a2-1` de implement.

**Estimación del relanzamiento**
- Escenarios con arreglo: init 2, retro 2, rubber-duck 3, roadmap 3, upgrade 1, archive 8, verify 2, implement 7, propose 11, interviewer 6 (fp, g3, g8, g9, p2, pe), grilling 7 (g2, g3, g6, g7, g9, sk, sk-c) = **52 escenarios × 4 = 208 sujetos**.
- Regresión: 10 escenarios × 4 = **40 sujetos**.
- Total: **248 sujetos**, más 5 sueltos (los cuatro sin RESULTADO de archive y `a2-1`) = **253**.
- Rebaja: si solo hay cambio de fila, se re-juzga sobre la evidencia ya existente y no hace falta relanzar. Es el caso de retro r4, propose co4/p2/sp1 (con D1 por batería), co6 y pt1, verify c7 y implement r1/r1b. Son 9 escenarios y **−36 sujetos**, que dejan unos **217**.
- Los de L (a4, a9, t3, v1, mp1, g1) están en las 10 regresiones, no en los 52 con arreglo.

---
id: 20261109-223338-feature-0326-orphans-eol-and-forecast
feature: 0326
title: El lanzador no se cuelga por un huérfano, kit:copies mira el índice y «Previsto» se mide
mode: full
profile: delegate
status: approved
created: 2026-11-09
author: Àngel Delgado
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El lanzador no se cuelga por un huérfano, `kit:copies` mira el índice y «Previsto» se mide

🦆 Tres arreglos de las herramientas del kit, antes de migrar el repo. Una tanda de baterías ya no se queda colgada horas porque un sujeto deje un `find /` vivo con la salida de la tanda: en la 0311 fueron ~3 h. `kit:copies` decide si una copia tiene CRLF por lo que guarda git, no por el disco de un checkout viejo, así que no para un merge por nada y sigue avisando de un CRLF de verdad. Y la tabla «Topes de palabras» de una spec ya no admite un «previsto» sin origen: lleva el comando que contó lo que entra y sale, con su cifra, o dice `sin medir`. Y un sujeto que vence el tope sale en la tanda como `colgado`.

Validación: agente — son herramientas del repo y una línea de plantilla: lo que se ve es la salida de tests y de comandos, que el agente mide; la validación en campo de este repo la hacen los tickets.

## Capacidades

- Modificadas: `kit-distribution` — la comprobación de LF de una copia mira el blob del índice
- Modificadas: `feature-flow` — «Topes de palabras» de la spec lleva el comando y la cifra de lo previsto, o `sin medir`
- El lanzador de baterías (`tests/headless/`) es herramienta del repo, sin capacidad: no tiene delta.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: `MODIFIED` (dos requisitos, de `kit-distribution` y de `feature-flow`), zona sin leer (`tests/copies/`, `real-deps.mjs`) · tamaño: ~120 líneas en 6 ficheros
- Dominio (opus): si el `MODIFIED` de «La fuente de una copia va en LF» sigue avisando de todo CRLF del índice, y que el lanzador no mate procesos de otra tanda (señal: `MODIFIED`)
- Técnica (sonnet): si el test del lanzador reproduce de verdad el cuelgue de Windows y qué cambia para `subject.mjs` al dejar de heredar la salida (señal: zona sin leer)
- Mínimo razonable: un revisor sonnet con los siete puntos — deja sin leer el complemento: qué procesos no puede tocar el lanzador
- Hecha con las dos lentes (dev-lead, 2026-11-09: «1»)

1. **Enfoque de (1): el sujeto no hereda la salida de la tanda**, frente a matar los huérfanos (B) o solo documentarlo (C) (ver Approach). Decisión central.
2. **El THEN de (1) pide que la tanda termine, no que el huérfano muera.** La fila 0326 decía «y el huérfano ya no existe»; matarlo sin un árbol que lo una al sujeto pide adivinar de quién es un proceso, y el anti-objetivo es no matar procesos de otra tanda. El huérfano queda vivo sin nadie que espere su salida.
3. **Al salir el sujeto, la tanda espera el fin de sus pipes (`close`) hasta 5 s; solo si vence, los destruye.** Destruirlos en `exit` perdería las últimas líneas del sujeto (su resultado y su coste).
4. **La entrada estándar del sujeto sigue como hoy (`inherit`)**; cambian solo la salida y el error, a pipes que la tanda reenvía en orden de llegada. El sujeto deja de escribir en una terminal: `git grep` de `isTTY` en `tests/headless/` y `cli/test/kit/headless/` no da nada que dependa de ello.
5. **El RED y el GREEN de (1) corren en Windows**, la máquina del dev-lead, donde un hijo hereda los handles heredables de quien lo lanza aunque no estén en su `stdio`; el walkthrough lo registra. Si con A el test sigue colgado, es desvío: se para y la solución pasa a C más A, con su escenario.
6. **Enfoque de (2): `kit:copies` pregunta siempre al índice**, con una sola llamada `git ls-files --eol -z -- <copias>` por `execFile`, frente a preguntar solo con `\r` en el disco (dejaría pasar un `i/crlf w/lf`) o leer siempre el blob (perdería los cambios sin `git add`). El índice decide si hay aviso; el disco, qué contenido se compara, en LF.
7. **`i/crlf` e `i/mixed` dan el aviso de hoy, sea cual sea el disco; `i/lf` no, y la copia se compara en LF.** Cualquier otro caso (otro `i/`, un fichero sin seguir por git o fuera de un repo) se juzga por el disco, como hoy: no se calla un CRLF por falta de índice.
8. **`git` pasa a ser dependencia en ejecución de `kit:copies`**, que hoy solo lee ficheros: `--eol` existe desde git 2.10; `-z` evita el escapado de `core.quotePath`, y `--` separa las rutas. `checkCopy` y `checkVerbatim` no cambian de firma: la decisión va antes, en `check.ts`, con una función pura `eolVerdict(<estado i/ o nada>, <texto del disco>)` que devuelve el aviso o el texto que se compara (sin `\r` si `i/lf`). Los tests de `copies.test.ts:324` y `:370` siguen como están; `eolVerdict` tiene su test con texto, y la llamada a git, el suyo con un repo.
9. **La celda de (3) lleva el comando y la cifra de lo previsto**, como la «Previsión de coste» cita la línea de `battery.mjs plan`: «medido + previsto (`<comando> → <n>` | sin medir, y al ✋) + 2 % · sin cambio». La ayuda dice que lo previsto se mide igual que lo medido, «sobre lo que entra y sale»: el comando lleva ese texto y la batería lo encuentra en `tools.txt`. Con `sin medir`, la fila va también al ✋ y su tope propuesto es «sin cambio» hasta la medida.
10. **El saldo de `sdd-templates` queda en 0 frente a `develop`, medido: 16.978**. La ayuda suma «, y lo previsto igual, sobre lo que entra y sale» y la celda su paréntesis; salen «de la revisión final», «la salida de … el índice» (línea 34: «Se escribe con el nombre exacto que da `sdd capability index`.») y «no cambia salvo que la spec lo renombre explícitamente» (línea 106; el renombrado lo dice la ayuda de `MODIFIED`), sin quitar ninguna instrucción. «lo aprueba el dev-lead en el gate» se queda: es la regla del Art. I.
11. **RED de (3): un escenario nuevo, `co2p`**, con el molde de `co2` (`reservas-tope-carpeta`, 52 / 60) y un párrafo de 42 palabras en la petición: 52 + 42 pasa de 60 y lo previsto decide el tope propuesto (~114). `co2` se queda como está, porque prueba la fila de la 0224. La petición dice «carril feature». Tres filas: `CO2P` (juicio de la cifra y el tope), `CO2P-C` (`tools.txt` lleva una llamada que cuenta y contiene «pizarra», palabra que solo está en el párrafo) y `CO2P-M` (la fila de la tabla lleva `→` o `sin medir`); n = 2. Límite conocido: un sujeto que escriba el párrafo con `Write` y lo cuente en otra llamada da falso rojo en `CO2P-C`; lo resuelve `CO2P`, que se juzga leyendo.
12. **La deuda «El lanzador de sujetos no tiene tope de tiempo ni de ruta» queda saldada.** El tope de 1800 s y el rechazo de un `RUNS_DIR` largo los dejó la 0238 (`lib.test.ts:630`, `campaign.test.ts:129`); el servidor del panel lo para `campaign.mjs` desde la 0254 (`campaign.test.ts:504`); un proceso suelto del sujeto no queda vivo (`run.test.ts:101`); la herencia de la salida la quita la Task 1; y el aviso pasa a `[<id>] colgado: tope de <N> s, sujeto cortado` (`lib.mjs:492`), el literal que pide el ticket de la 0230 §1.
13. **Validación: agente**, con la validación en campo de este repo (`validation.mode: field`): lo que se ve es la salida de tests y comandos.
14. No entran: el `pwsh` de `processes()` en `real-deps.mjs` y el aviso de `run.mjs` en un patch (menor de la 0324), porque no son de los tres casos.
- Política de modelos: revisores de la spec, dominio opus y técnica sonnet · segunda ronda, un revisor sonnet con los siete puntos · ejes de la revisión final: Spec opus+high, Código sonnet+high · sujetos de `co2p` en sonnet, en una tanda · en paralelo hasta `control.maxParallelAgents`

Resultado del delta en una copia (`sdd capability merge`, 2026-11-09, tras incorporar la review): «kit-distribution.md: sustituido «La fuente de una copia va en LF»», «kit-distribution.md: regla «Regla ante conflicto» sustituida» y «feature-flow.md: sustituido «La spec mide el margen de palabras de lo que edita»». Repetido el 2026-11-10 tras la última enmienda: las mismas tres líneas.

### Hallazgos de la review

- **Aceptado** — técnica 1 (Crítico) y dominio 1: sin `\r` en el disco no se preguntaba al índice y un `i/crlf w/lf` pasaba → decisión 6: se pregunta siempre; escenario `i/crlf w/lf` con aviso.
- **Aceptado** — dominio 2 y técnica 2: faltaban fuera de un repo, git fallando, `i/mixed` y lo que ve el usuario con `i/lf w/crlf` → decisión 7 y escenarios propios en el delta.
- **Aceptado** — dominio 3: la capacidad no declaraba el dato ni el conflicto nuevos → «Reglas de la capacidad», «Regla ante conflicto», con su valor completo.
- **Aceptado** — dominio 4: `sin medir` no decía qué tope ni que va al ✋ → decisión 9 y un AND en el delta.
- **Aceptado** — dominio 5: la spec no medía su propia sustitución → decisión 10, con el saldo previsto; la medida exacta, en la task (`sin medir` hasta el borrador del texto final).
- **Aceptado** — dominio 6: la fila del lanzador no se salda entera → decisión 12.
- **Aceptado** — dominio 7: el Intent prometía que (3) evita la parada → Intent rebajado.
- **Aceptado** — dominio 8 y técnica 5: destruir en `exit` pierde la cola → decisión 3 y un caso en «Dónde se prueba».
- **Aceptado** — dominio 9 y técnica 8: el ejemplo no enseñaba la celda nueva y el THEN no se podía comprobar → el AND del delta lleva el ejemplo `+40, borrador` y el caso `sin medir`; `co2` mira en `tools.txt` que se contó (decisión 11). Rechazado en parte: una ruta del borrador en la celda no prueba nada (el borrador vive en el scratchpad y se borra); lo prueba el `tools.txt` del sujeto.
- **Aceptado** — técnica 3: el nieto del test no heredaba la salida → «Dónde se prueba»: nieto con `stdio: 'inherit'`, tanda en pipe, espera de `close`, tope de 60 s del test.
- **Aceptado** — técnica 4: plataforma del RED → decisión 5.
- **Aceptado** — técnica 6: `stdio` cambia el contrato con `subject.mjs` → decisión 4 y la tabla de lo que cambia de forma.
- **Aceptado** — técnica 7: git como dependencia → decisión 8.
- **Aceptado** — técnica 9: decisiones del cuerpo fuera del ✋ → decisiones 3, 4, 7, 13 y 14.
- **Aceptado** — técnica 10: `dist/` y quién cita la celda → Scope; `git grep -n "medido + previsto" -- tests dist skills`: solo `spec-template.md:150` y su copia en `dist/`.
- Segunda ronda (sonnet, siete puntos; sin tercera ronda):
- **Aceptado** — 1: quitar «lo aprueba el dev-lead en el gate» era quitar una instrucción → se queda; el recorte es «de la revisión final» (decisión 10).
- **Aceptado** — 2: las cuentas no cuadraban → saldo medido: +4 −4 = 0 (decisión 10 y «Topes de palabras», con la forma de la decisión 9).
- **Aceptado** — 3: el Hallazgo decía que el ejemplo estaba en el THEN → corregido: está en el AND.
- **Aceptado** — 4: el AND juntaba casos sin test → decisión 7 simplificada y un AND y un test por caso.
- **Aceptado** — 5: no decía cómo llega el estado del índice → decisión 8, `eolVerdict`, sin cambiar la firma de `checkCopy`.
- **Aceptado** — 6: el nieto del test quedaba vivo → «Dónde se prueba»: el test guarda su PID y lo para en `afterEach`; corre también en Linux (la CI).
- **Aceptado** — 7: faltaban otras formas del literal → `git grep -n -e "más lo previsto" -e "previsto más un 2" -e "2 % (mínimo"` en `skills`, `dist` y `capabilities`: `feature-flow.md:630` y `:830`, `spec-template.md:146` y su copia; todos en la tabla.
- **Aceptado** — 8: «las filas de deuda de abajo» no existía → apunta a «Filas que implementa».
- **Aceptado** — 9: el éxito citaba un checkout que nadie prueba → Intent ajustado a lo que prueba el test.
- **Aceptado** — 10: `sdd capability merge` se repite sobre la spec final.

### Decisiones tomadas con el dev-lead

- La fila es un patch suelto, antes de la 0198 — «quizás, un patch suelto, no meterlo en la 198» y «1, arranca aquí» (2026-11-09).
- Carril feature, modo full, en vez de patch — «1» a la pregunta del carril (2026-11-09).

## Intent

Hoy tres herramientas fallan en el cierre de la release. Una tanda de baterías espera sin fin cuando un sujeto deja un proceso vivo con la salida de la tanda heredada: en la 0311, ~3 h de reloj parado. `kit:copies`, ya en el pre-commit, para el `sdd merge` de un checkout viejo por un CRLF que solo está en el disco. Y la previsión de palabras de una spec puede escribirse sin medir: en la 0311 previó −85 y midió +189, con una parada del dev-lead. Éxito: la tanda de la 0311 termina sola; una copia con CRLF solo en el disco no para `kit:copies`; cada previsión de palabras cita el comando que la contó, o dice `sin medir`; y un sujeto cortado por el tope sale como `colgado`. Fracaso aunque funcione: un lanzador que mate procesos de otra tanda, una tanda que pierda las últimas líneas de un sujeto, o un `kit:copies` que calle un CRLF del índice.

## Scope

- Entra: (1) `tests/headless/real-deps.mjs` (`launch`): la salida y el error del sujeto van a pipes propios que la tanda reenvía; al salir el sujeto, espera su `close` hasta 5 s. Su test en `cli/test/kit/headless/`.
- Entra: (2) `tests/copies/check.ts` (y `annotated.ts` si el plan lo pide): el estado de fin de línea de cada copia sale de `git ls-files --eol -z`; el contenido que se compara, del disco en LF. Su test con un repo git en `cli/test/kit/copies.test.ts`.
- Entra: (3) `skills/sdd-templates/templates/spec-template.md`: la celda y la ayuda de la decisión 9 y los recortes de la decisión 10; `dist/skills/sdd-templates/` con `moon run kit:build`; y el escenario `co2p` de `tests/batteries/sdd-propose/` (decisión 11).
- Entra: (4) `tests/headless/lib.mjs`: el aviso del tope dice `colgado` (decisión 12), con su test en `cli/test/kit/headless/lib.test.ts`.
- Entra: las filas de deuda de «Filas que implementa».
- No entra: matar procesos huérfanos por nombre o por fecha (decisión 2); lo de la decisión 14.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La celda `<medido + previsto + 2 % · sin cambio>` | `skills/sdd-templates/templates/spec-template.md:150` y su copia en `dist/` | Scope (3), decisión 9 |
| «para la pasada de fix de la revisión final,» | `spec-template.md:146` y su copia en `dist/` | Scope (3), decisión 10: pasa a «para la pasada de fix,» |
| «Se escribe con la salida de `sdd capability index`, con el nombre exacto que da el índice.» y «estable, no cambia salvo que la spec lo renombre explícitamente» | `spec-template.md:34` y `:106`, y sus copias en `dist/` | Scope (3), decisión 10: misma instrucción, más corta |
| `[<id>] tope de <N> s: sujeto cortado` | `tests/headless/lib.mjs:492`; `cli/test/kit/headless/lib.test.ts:627` | Scope (4), decisión 12: `[<id>] colgado: tope de <N> s, sujeto cortado` |
| «el tope propuesto es lo medido más lo previsto más un 2 %» | `.docs/sdd/capabilities/feature-flow.md:630` y `:830` (Límites) | la 630, delta `MODIFIED`; la de Límites no cambia: la fórmula es la misma |
| Cuándo sale el aviso `tiene finales de línea CRLF; la fuente de una copia va en LF` | `tests/copies/annotated.ts:75`, `:462`, `:475`; `cli/test/kit/copies.test.ts:324`, `:370`; `capabilities/kit-distribution.md:131` | el literal no cambia; cuándo sale: delta `MODIFIED` y decisión 7 |
| `stdio: 'inherit'` del sujeto | `tests/headless/real-deps.mjs:14`; lo usan `run.mjs` y `battery.mjs run` por `realDeps()`; los tests de `launch` de `battery.test.ts:402` y `campaign.test.ts:79` lo sustituyen por un falso | Scope (1), decisiones 3 y 4 |

- Filas que implementa: 0326 → `.docs/sdd/roadmap.md` (fila 0326, la 0198 tras ella); salda «`kit:copies` da CRLF por el disco de un checkout viejo y para el merge» «La previsión de palabras de la spec no se mide sobre un borrador» y «El lanzador de sujetos no tiene tope de tiempo ni de ruta» (decisión 12): las marca `sdd-archive` · comprobado con `git grep -n "0326"` fuera de las carpetas de evidencia.

## Approach

(1) El lanzador y el huérfano:
- A — el sujeto no hereda la salida de la tanda: `launch` lanza `subject.mjs` con su salida y su error en pipes propios, los reenvía y, al salir el sujeto, espera su `close` con 5 s de gracia. Un nieto vivo retiene, como mucho, un pipe que ya nadie espera. Cuesta un cambio en `launch` y dos tests.
- B — matar los huérfanos: comparar procesos antes y después del sujeto y parar los nacidos en su ventana sin padre vivo. Cuesta una consulta por sujeto y adivinar; puede matar un proceso de otra tanda (anti-objetivo).
- C — solo documentarlo: lanzar la tanda con la salida a fichero y `< /dev/null`, el remedio de la 0311. Cuesta una línea en `tech-stack.md`, pero la trampa sigue para quien no la lea.
- Elegido: A — quita la causa sin decidir de quién es un proceso; si en Windows no basta, decisión 5.

(2) `kit:copies` y el CRLF: decisiones 6, 7 y 8.

(3) La plantilla: decisiones 9 y 10, medidas con `word-budget.test.ts`.

## Dónde se prueba

- La tanda termina con un nieto vivo: `cli/test/kit/headless/`, como los tests de `launch` de la 0320, en Windows. Un `subject.mjs` falso lanza un nieto `node -e "setTimeout(() => {}, 120000)"` con `stdio: 'inherit'` y sale; el test lanza la tanda con su salida en un pipe y espera `close` con un tope de 60 s. Antes del arreglo vence el tope (RED); después, cierra en menos de 15 s. El test guarda el PID del nieto y lo para en `afterEach`; corre también en Linux, en la CI, donde el descriptor heredado da el mismo cuelgue.
- No se pierde la cola: un `subject.mjs` falso escribe 64 KB y una línea final justo antes de salir; la tanda la reenvía entera.
- `kit:copies` y el índice: `cli/test/kit/copies.test.ts`, con un repo git de prueba como los de la suite: `i/lf w/crlf` igual a su original → sin aviso; `i/crlf w/lf` → aviso; `i/mixed` → aviso; un fichero sin seguir con CRLF → aviso; fuera de un repo con CRLF en el disco → aviso. `eolVerdict`, con texto.
- «Topes de palabras»: `co2p` de la batería de `sdd-propose`, RED con el kit de `develop` y GREEN con la rama, n = 2.
- El aviso `colgado`: el test del tope de `cli/test/kit/headless/lib.test.ts`, con el literal nuevo.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `kit-distribution`

#### MODIFIED — La fuente de una copia va en LF

- GIVEN una copia sin `pending` cuyo blob del índice tiene un `\r\n` (`git ls-files --eol` da `i/crlf` o `i/mixed`), con el disco en CRLF o en LF
- WHEN corre `moon run kit:copies`
- THEN da `<fichero>: tiene finales de línea CRLF; la fuente de una copia va en LF`
- AND una copia que no es `.md` que difiere de su original en LF da `<fichero>: no es su original <ruta>@<versión> byte a byte`
- AND `.gitattributes` lleva `skills/** text eol=lf` y `cli/test/fixtures/copies/** text eol=lf`
- AND una copia con `i/lf w/crlf` cuyo contenido en LF es su original no da ese aviso: `kit:copies` sale con 0 y `Copias al día: <n> ficheros.`
- AND una copia sin seguir por git con `\r\n` en el disco da el aviso
- AND fuera de un repo, una copia con `\r\n` en el disco da el aviso

#### Reglas de la capacidad — kit-distribution

- **Regla ante conflicto**: manda la fuente (`skills/`, `includes/`, `upstream.json`), y `dist/` y los avisos se regeneran; nunca se edita `dist/` a mano. Entre una copia y su original manda el original en su tag: una diferencia sin marca es un rojo de la copia, nunca del original. Entre una inclusión y el mismo texto escrito a mano en otra skill manda la inclusión: el rojo es de la skill que lo escribe a mano. Entre el disco y el índice, el fin de línea de una copia lo dice el índice (`git ls-files --eol`) y el texto que se compara, el disco en LF; sin índice, el disco.

### Capacidad: `feature-flow`

#### MODIFIED — La spec mide el margen de palabras de lo que edita

- GIVEN un proyecto con topes de palabras (`cli/test/kit/word-budget.test.ts` con `'sdd-propose': { skillMd: 5000, total: 6325 }`) y una spec que edita `sdd-propose`, medido en 4.908 y 6.324
- WHEN el agente escribe la spec
- THEN la sección «Topes de palabras» lleva una fila por skill o documento con tope que la spec edita, con lo medido, el tope, el margen y el tope propuesto: `sdd-propose · 4.908 / 5.000 y 6.324 / 6.325 · 92 y 1 · 5.200 / 6.700`
- AND el tope propuesto es lo medido más lo previsto más un 2 % (mínimo 20 palabras) para la pasada de fix, y el gate lo aprueba como decisión del dev-lead
- AND lo previsto lleva el comando que contó lo que entra y sale, con el conteo del test, y su cifra: +40 (`echo "<texto que entra>" | wc -w` → 40); o `sin medir`, y entonces la fila va también al ✋ y su tope propuesto es «sin cambio» hasta la medida
- AND el de una skill que funde otras parte de la suma medida de las fuentes, menos lo común, más margen
- AND si durante la feature se recorta texto para caber, el recorte es una edición de skill: si quita una instrucción, lleva su RED
- AND sin topes en el proyecto, la sección no se escribe

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-templates` (total, `dist/`) | 16.978 / 16.978 | 0 | 16.978 + 0 (`split(/\s+/)` de `dist/skills/sdd-templates` con el texto final → 16.978) · sin cambio |

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| Gastado en `co2` (RED, green, green2, green3) | 8 sujetos, medidos | 3,40 |
| RED | `SCENARIOS="co2p" N=2` → `suma: 2 sujetos · coste previsto: 1.31 $ · sin precio medido: co2p (a 0.65 $, la media de los escenarios medidos)` | 1,31 |
| GREEN | `SCENARIOS="co2p" N=2` → `suma: 2 sujetos · coste previsto: 1.31 $ · sin precio medido: co2p (a 0.65 $, la media de los escenarios medidos)` | 1,31 |
| Una tanda de REFACTOR | 0: la forma es la mínima; si hiciera falta, la misma línea | 0 |
| Controles | 0: el RED ya corre con el kit de `develop` | 0 |
| Medición tras la revisión final | 0: quitada (enmienda del 2026-11-10), la pasada de fix no toca la plantilla ni la batería | 0 |
| Suma | 12 sujetos | 6,02 |

El techo aprobado es 7,0 $. Real: 12 sujetos, 5,66 $.

## Enmiendas

- 2026-11-10 — sin medición de `co2p` tras la revisión final («Dónde se prueba» y la fila de la previsión) — la pasada de fix, juntada en el commit de cierre, no toca la plantilla ni la batería, así que la medición repetiría el GREEN 2/2; campaña cerrada en 5,66 $ — aprobada: «1»
- 2026-11-10 — (3) pasa a citar el comando que contó lo previsto y su cifra (`<comando> → <n>` o `sin medir`), con la ayuda más corta y dos recortes que dejan `sdd-templates` en 16.978, sin subir el tope (decisiones 9 y 10; deja sin efecto la subida a 17.010 de la enmienda de abajo); el RED y el GREEN pasan a un escenario nuevo, `co2p`, y `co2` vuelve a su rúbrica de la 0224 (decisión 11); el aviso del tope dice `colgado` y la fila del lanzador queda saldada (decisión 12, Scope (4)); techo de la campaña, 7,0 $ — green3 salió 1/2 y ningún sujeto contó un borrador (`green3/out/co2-*.tools.txt`); la revisión Opus de la enmienda vio que la rúbrica de `co2` no podía distinguir un conteo de lo previsto y que `co2` se acierta a ojo — aprobada: «1»
- 2026-11-10 — la ayuda de «Topes de palabras» dice en una frase que lo previsto se cuenta sobre un borrador de lo que sale y lo que entra, con el conteo del test, o se escribe `sin medir` y la fila va al ✋ (decisión 9 decía «la frase de ayuda no cambia»); el tope total de `sdd-templates` sube de 16.978 a 17.010 con ese motivo (decisión 10 decía saldo 0) — el GREEN de `co2` con solo la celda nueva salió 0/2: los sujetos siguen escribiendo «previsto 2» sin origen (`green2/out/co2-1/spec-new.md`); la Suma pasa a 4,20 $ (`green3` n = 2 y medición final n = 1) — aprobada: «1»
- 2026-11-10 — la Suma de la previsión pasa de 1,08 $ a 3,60 $ — el RED de `co2` costó 0,58 $ por sujeto (1,16 $ la tanda), frente a los 0,18 $ que daba `battery.mjs plan` con las campañas guardadas — aprobada: «1» (subir la previsión a 3,6 $: GREEN n = 2 y medición final n = 2)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-10 | aprobada: «si» (opción 1, «Apruebo») |

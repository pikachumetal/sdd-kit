---
id: 20261120-150821-feature-0361-plain-language-questions
feature: 0361
title: Las preguntas de la entrevista hablan en el idioma del producto
mode: full
status: approved
created: 2026-11-20
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-20
---

# Spec — Las preguntas de la entrevista hablan en el idioma del producto

🦆 Cuando el kit te pregunta algo en una entrevista, hoy te cuenta lo que encontró con nombres de funciones y herramientas del código sin decir a qué pieza pertenecen, y en la 0737 tu respuesta fue «a ver me lías…». Con este cambio llama a cada pieza como la llama el proyecto (su arquitectura y su terminología: «la lista de reservas»), o por lo que hace en el producto, y deja el nombre del código detrás, entre paréntesis (`bookings`, `src/app.js`), para que sepas por dónde va o puedas preguntar. Un caso que no trajiste sigue en la pregunta, pero en una línea, con sus datos y avisando de que lo trae el agente y por qué. Si ya dijiste la regla en una frase, te la devuelve con tus palabras y solo pregunta si es así. La regla se muda de la skill que escribe la spec a la que redacta las preguntas, que usan las seis skills que entrevistan.

Validación: agente — validación en campo (`validation.mode: field` de `.docs/sdd/sdd-kit.json`): cierra con el RED/GREEN y el A/B de la batería de `sdd-grilling`, y el uso real llega por los tickets de `sdd-feedback`.

## Capacidades

Ninguna, porque herramientas: la feature cierra solo con el escenario `j1` de la batería de `sdd-grilling` (tercera enmienda).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos — señales: ninguna (dos ADDED en `interviewing`, sin contrato público, MODIFIED ni datos) · tamaño: ~35 líneas en 5 ficheros
- Dominio y técnica (sonnet): si los dos ADDED chocan con «El descubrimiento no se ancla» y «Busca fuera del repo…» de `interviewing` (la fuente que piden g8 y g9) o con «Escena concreta…», y si J1 y J2 pasan sin la conducta (señal: ninguna; tamaño pequeño)
- Mínimo razonable: sin revisor — deja sin mirar si un ADDED es un MODIFIED no declarado de esos requisitos
```

1. Texto que entra en `skills/sdd-grilling/SKILL.md`, «Shape of a question» (medido en `dist/`: 885 → 954 palabras):
   - el molde cambia `<what you found, with sources>` por `<what you found, in the project's words (code name, source)>`
   - viñeta nueva, tras la de la escena: «Name each part as the project does (`architecture.md`, «Terminology» of `PRODUCT.md`), or by what it does in the product; the code name follows in brackets, to show where it lives. In a design question, a case the user didn't bring: one line with its data, saying it's yours and from where.»
   - viñeta nueva, tras esa: «A rule the user already said: repeat it in their words and ask only whether that's it, no alternatives.»
   - sale de la viñeta de la escena «Tell limits by their effect, not their cause.»: la viñeta nueva la cubre para todo lo hallado
   — por qué: el molde es lo que el agente rellena al redactar, y en la 0737 ganó a la regla que estaba en otra skill; el vocabulario es el del proyecto, y el nombre del código se queda al lado porque el dev tiene que saber por dónde va (enmienda 2026-11-20); la devolución de la regla va en viñeta propia porque metida en la del número de alternativas el GREEN se la saltó en 2 de 2. Sin literales de un proyecto real: la regla no se apoya en ejemplos (dev-lead: «no literales»).
2. Texto que sale de `skills/sdd-spec-writing/SKILL.md` (medido: 3282 → 3213 palabras, 19.187 → 18.752 bytes): en «The Conversation», «Use plain language, pitched just a little above where your human partner is. Match their vocabulary; never use process jargon.» y «Be clear and concise. Lead with what matters. Avoid jargon.», tapados con una marca `kit: 0361 · sustituye: «…»` como hizo la 0359 en esa sección; en «Play It Back», «in plain words» y el ejemplo `dueDate` con «Code names, files and internal flags go after it, only if needed (the short mode of `sdd-rubber-duck`)», que pasan a «asked as `sdd-grilling` says» — por qué: la regla vive ahora en `sdd-grilling`, sin el ejemplo (dev-lead: «no literales»); dejarla en los dos sitios repetiría la regla y `kit:own` da rojo a 10 palabras seguidas en dos skills. Se queda «When you report what you found, give them the most important findings and offer the rest»: habla del informe, no de la pregunta.
3. La fuente sigue siendo obligatoria cuando el hecho sale de un fichero o de la web, entre paréntesis detrás del hecho, junto al nombre del código — por qué: g8 (hecho del código con su fichero) y g9 (cita de la web) son reglas medidas que piden la fuente.
4. Una clave de la que trata la decisión (`merge.push` en `sdd-config`) sigue la misma regla: lo que hace, y la clave entre paréntesis — por qué: en `sdd-config` la pregunta es la clave; esconderla rompería C1 de g7.
5. Escenario nuevo `j1` en `tests/batteries/sdd-grilling/battery.md`, paso `sdd-propose`, molde `reservas` (desde la enmienda; antes `salas`), n = 2, Sonnet: petición «Carril feature, modo full: `libres` no tiene en cuenta el día: Norte tiene reserva el lunes de 10:00 a 12:00 y `libres 10:00-12:00` no la da ningún día. Arréglalo.»; `TURN2` en `subject.mjs`: «ya te lo digo yo: una sala está libre si ese día a esa hora no tiene reserva», que se entiende sea cual sea la pregunta del turno 1. Umbrales: RED, al menos 1 de 2 falla en la base; GREEN, 2 de 2 pasan en la rama; si el GREEN da 1 de 2, se relanza a n = 4 antes de concluir. Filas de rúbrica nuevas:
   - **J1 Idioma del proyecto** (j1): en el último mensaje del turno 1, un nombre del código (`freeRooms`, `bookings`, `rooms`, `room`, `slot`, `status`, `src/app.js`) aparece sin el nombre que le da el proyecto o lo que hace en el producto delante, en la misma frase, o fuera de un paréntesis detrás de ese nombre; la pieza se llama, fuera del paréntesis del nombre del código, con una palabra que la terminología de `PRODUCT.md` del molde marca _Evitar_ («booking», «room»); un hecho sacado de un fichero sin su fuente; o un caso que la petición no trae (otra franja, otra sala, un solape) sin una frase que diga que lo trae el agente («no lo has dicho tú», «lo añado yo») y de dónde sale. Lo puntúa quien lanza la batería, como el resto de filas (`battery.md`, «Dos veredictos»), con la cita literal.
   - **J2 Devolver la regla** (j1): el último mensaje del turno 2 no contiene «ese día» y «a esa hora» de la frase del dev-lead (con o sin coma entre ellos), no acaba en una pregunta que confirme esa regla (en prosa, o con opciones numeradas de confirmarla o corregirla), o presenta alternativas numeradas o en prosa sobre esa misma regla. Seguir a otra decisión después de devolverla no falla, si la confirmación es la única pregunta del turno.
   — por qué: el molde `reservas` tiene el mismo fallo (`freeRooms` filtra solo por franja: `tests/batteries/sdd-grilling/mold-reservas/src/app.js:5`) y además vocabulario contra el que medir: `architecture.md` y una «Terminology» en `PRODUCT.md` con «Reserva» (_Evitar_: booking) y «Sala» (_Evitar_: room). `salas` no tiene ni lo uno ni lo otro. El RED y el GREEN medidos sobre `salas` antes de la enmienda quedan como evidencia en `red/` y `green/`; tras ella se repiten sobre `reservas`. El segundo turno es el criterio de aceptación del ticket de la 0356 §1.
6. A/B de no regresión en g7, g8, g9 y p2, n = 2 por brazo (base `develop` en `004c18a3d` frente a la rama) — por qué: son los escenarios cuya regla roza el texto que cambia (claves, fichero de un hecho, fuente web, lo que no se pregunta); el resto de la batería mide reglas que no se tocan. Una diferencia a n = 2 no es veredicto (`operations.md`, «Un verde de n = 2 no es la línea base…»): si un brazo nuevo falla donde la base pasa, se relanza ese escenario a n = 4 antes de concluir.
7. El escenario `j1` y su RED en la base son la Task 1, antes de tocar las skills. Sin rojo en J1 ni en J2 (la base ya pasa), la feature para, el delta no se fusiona y se lo digo al dev-lead para retirarla o cambiarla: no se cambia una skill sin un fallo que lo justifique. Con rojo solo en una de las dos, sigue solo la parte con rojo, como enmienda que quita el ADDED de la otra, su texto de la decisión 1 y su fila de «Lo que se retira…», y rehace la línea de la decisión 8. Del mismo modo, si el GREEN sigue con casos añadidos que lían, se para y se le dice, sin forzar la regla (lo prometí en la entrevista).
8. Repaso de coherencia: el delta, probado en una copia de `.docs/sdd` con `sdd capability merge`, da (tras la enmienda) `interviewing.md: añadido «La pregunta habla en el idioma del proyecto»` y `interviewing.md: añadido «La regla que el usuario ya dijo se le devuelve»`; los literales que salen solo aparecen en las filas de la tabla «Lo que se retira…» (`git grep` fuera de las carpetas de evidencia); `kit:own` y `kit:copies` sobre el texto nuevo, `sin medir` hasta editar la fuente: corren en la task que edita las skills, nada más escribir el texto. Los ejemplos en castellano van entre «», que `kit:own` no cuenta como prosa (`kit-distribution`, «La prosa en castellano de una skill da rojo»); `sdd-grilling` no es copia de ninguna fuente de `upstream.json`, solo `sdd-spec-writing` (de `brainstorming`).
9. Lo que sale de `sdd-spec-writing` se mide con p2 del A/B, que entra por `sdd-propose` y pregunta con «The Conversation» de `sdd-spec-writing`; el cambio de «Play It Back» queda sin escenario porque sus secciones solo salen en `pair` con 4 o más tasks, y ningún escenario llega ahí: no se quita la regla, se remite a `sdd-grilling`, donde la mide `j1`.
10. Que la pregunta siga enseñando un caso que importa (el fracaso del Intent) no tiene fila en la batería: J1 no puede saber qué caso importaba. Se vigila en campo, con los tickets de `sdd-feedback`, y en la lectura del GREEN de `j1`, que anota si el solape de franjas aparece.
11. Topes de palabras (tabla de abajo): `sdd-grilling` de 886 a 974 (954 medido en la copia + 20 de margen para la pasada de fix, el mínimo de la plantilla; hoy su margen es 1); `sdd-spec-writing` de 3450 a 3362, lo que sube el otro (3213 medido, queda con 149 de margen frente a 168 de hoy). La suma de los dos topes no cambia (4336) y la de las dos skills no crece (4167 frente a 4167) — por qué: es el traspaso que aprobó el dev-lead; el margen de `sdd-grilling` sube de 1 a 20 a costa del de `sdd-spec-writing`.
### Hallazgos de la review

- **Aceptado** — (Crítico) el caso añadido choca con «El descubrimiento no se ancla» → el ADDED lo limita a las preguntas de diseño y un AND dice que el descubrimiento sigue abierto y sin casos; no cambia el requisito vigente, así que sigue siendo ADDED.
- **Aceptado** — (Crítico) la fuente quedaba opcional («si lo cita»), contra «Busca fuera del repo…» → el THEN y la decisión 3 la hacen obligatoria para lo que sale de un fichero o de la web; lo que va al documento son los nombres de dentro del código. El molde dice `(its source)`.
- **Aceptado** — (Importante) J1 se pasaba con una paráfrasis → J1 cuenta la paráfrasis, pide una frase que atribuya el caso al agente y dice quién la puntúa.
- **Aceptado** — (Importante) J2 no distinguía repetir de parafrasear → J2 exige «ese día a esa hora» y una pregunta de sí o no.
- **Aceptado** — (Importante) el éxito podía ser inalcanzable → decisión 7: el RED de `j1` es la Task 1; sin rojo, la feature para y el delta no se fusiona.
- **Aceptado** — (Importante) los topes eran decisiones sin desglose → decisión 11 con los números y los márgenes.
- **Aceptado** — (Importante) faltaba el contraejemplo de la excepción de la clave (Art. II) → J1 dice que en `j1` nada es objeto de la decisión y que nombrarlo con ese pretexto falla.
- **Rechazado** — (Menor) el mensaje de los montones de `sdd-spec-writing` quedaría sin regla → «Your First Message» ya dice «Before your first question, invoke `sdd-grilling`… every question follows it».
- **Aceptado** — (Menor) identificadores de un proyecto real en el 🦆 → quitados; quedan los ids de las features, que ya están en `debt.md`.
- **Rechazado** — (Menor) «Reglas de la capacidad» → el delta no trae datos, nombres, topes ni avisos del producto; el conflicto con el descubrimiento lo resuelve el último AND del primer ADDED.

Segunda vuelta (sin tercera):

- **Aceptado** — los nombres del código chocaban con el ejemplo `roles.ts` de «El descubrimiento no se ancla» → el ADDED 1 es de preguntas de diseño (WHEN) y su último AND deja el descubrimiento como está, con el nombre como hecho; sigue siendo ADDED. «Modificadas» en «Capacidades» es la etiqueta de una capacidad existente que gana requisitos: se queda.
- **Aceptado** — el ADDED 2 podía saltarse «Rebatir una vez» y no decía el formato → AND de rebatir primero y «sí o no en prosa»; la parte de «una sola alternativa» sale del ADDED, ya está en «Alternativas reales…».
- **Rechazado** — «Límites» y «Avisos» de «Reglas de la capacidad» → «una línea» y la marca del caso son forma de la pregunta, como las demás del ADDED; las reglas de la capacidad no recogen la forma del resto de requisitos (escena, ❓, ➡️).
- **Aceptado** — J1 no medía la fuente obligatoria y `TURN2` dependía del turno 1 → J1 falla un hecho de fichero sin fuente; `TURN2` se entiende solo. El caso que importa queda en campo (decisión 10).
- **Aceptado** — Art. I y IX para lo que sale de `sdd-spec-writing` → decisión 9: p2 mide «The Conversation»; «Play It Back» sin escenario, con su motivo. `sdd-grilling` no es copia de `upstream.json` (decisión 8).
- **Aceptado** — umbrales a n = 2 → decisión 5: RED ≥ 1 de 2 en la base, GREEN 2 de 2, y n = 4 con 1 de 2. La previsión con g3 se rehace con `j1` al escribirlo.
- **Aceptado** — `kit:own` y `kit:copies` al final → decisión 8: corren nada más escribir el texto.
- **Aceptado** — `sdd-explore` no escribe documento → «or nowhere» en la viñeta y en el ADDED; la enmienda lo deja sin objeto: el nombre del código ya no va a ningún documento, va en la pregunta, entre paréntesis.
- **Aceptado** — la fuente de un fichero del repo es regla nueva → el THEN lo dice.
- **Aceptado** — la rama «solo una con rojo» no decía su efecto → decisión 7 lo dice.

Revisión de la enmienda 2026-11-20 (un revisor Sonnet):

- **Aceptado** — la viñeta del caso añadido no se limitaba a las preguntas de diseño → «In a design question, …» en la skill y en la decisión 1.
- **Aceptado** — «sí o no en prosa» chocaba con la forma de la decisión operativa → el ADDED 2 y J2 admiten prosa u opciones numeradas de confirmar o corregir.
- **Aceptado** — la línea de `sdd-explore` («or nowhere») era anterior a la enmienda → reescrita: el nombre ya no va a ningún documento.
- **Aceptado** — `battery.md` aún describe `salas` y la J1 vieja → el Scope lo pone en la Task 2, tras aprobar la enmienda.
- **Aceptado** — «room» era a la vez nombre del código y palabra _Evitar_ → J1 solo falla con la palabra _Evitar_ fuera del paréntesis; «baja» sale de la lista.
- **Aceptado** — el coste de la enmienda no estaba medido ni confirmado → `battery.mjs plan` para `j1` (0,94 $ por tanda) y la fila de la enmienda; la confirmación va en la pregunta de la enmienda.
- **Aceptado** — los números de las palabras no casaban → 954 en `dist/` y 4167 entre las dos skills, igual que la base; tope 974.
- **Rechazado** — `status: approved` con la enmienda pendiente → la convención del kit lleva lo pendiente en «Enmiendas» y añade la fila de aprobación cuando el dev-lead la apruebe.
- **Aceptado** — el Intent y «Dónde se prueba» hablaban del criterio viejo → reescritos.
- **Rechazado** — el nombre del proyecto real y los ids de sus features en la spec → «no literales» es para la skill; la spec es evidencia, y `debt.md` ya los nombra.

- Política de modelos (solo en `delegate`): un revisor de la spec, Sonnet + high · revisión final: Spec opus+high, Código sonnet+high (sin eje de Arquitectura: no hay código ejecutable) · sujetos de la batería Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` (3)

### Decisiones tomadas con el dev-lead

- Pasar el tope de palabras de `sdd-spec-writing` a `sdd-grilling`, sin que la suma crezca — «sí, pásalo de una a otra... pero ten en cuenta que grilling no solo es usado por spec»
- Mudar la regla de hablar llano de `sdd-spec-writing` a `sdd-grilling`, tapando lo que sale con la marca «kit:» — «sí, múdala»
- Medir con el escenario nuevo y un A/B en la misma tirada (unos 4 $, corregido de los 9 $ que se le dijeron) — «si»
- Un caso que el usuario no trajo sigue en la pregunta, en una línea con sus datos y diciendo que lo trae el agente y por qué; no se prohíbe ni va a ✋ — «sí», tras «me preocupa... no se si vamos a dejar de ver cosas»; confirmado tras la enmienda, frente a «no se añaden casos» del mensaje de la sesión «sdd-kit develop» — «sí, la 1»
- Enmienda: los nombres del código no salen de la pregunta; van detrás del vocabulario de arquitectura del proyecto — dev-lead, por la sesión «sdd-kit develop» (2026-11-20): «en trabajos empresariales, el dev tiene que como mínimo saber por dónde vamos si le dices waitForEditorClosed… el programa no puede ser una caja negra… el dev tiene que ser consciente de parte aunque sea a nivel alto»; y en esta sesión: «lo que sí me gusta de la propuesta es usar idiomas de la aplicación»
- Sin literales de document-manager en la skill — «lo usamos como ejemplo para hablar no para hacer el skill, no literales me refiero»

## Intent

Las preguntas de la entrevista llevan nombres de ficheros, funciones y claves sin decir a qué pieza del sistema pertenecen, y casos que nadie trajo sin decir de dónde salen; el dev-lead se pierde y cada feature gasta una vuelta de aclaración (seis en la 0356; ~6 min en la 0727 y la 0737). La regla de hablar llano existe, pero vive en «The Conversation» de `sdd-spec-writing`, lejos del molde de `sdd-grilling` que se rellena al redactar, y las otras cinco skills que preguntan no la leen. Éxito: el escenario `j1` pasa de rojo a verde en J1 y J2, y g7, g8, g9 y p2 quedan igual o mejor en el A/B. Fracaso aunque funcione: que la pregunta deje de enseñar un caso que importa (el dev-lead lo dijo: «no se si vamos a dejar de ver cosas»), o que las reglas medidas de citar la fuente (g8, g9) caigan.

## Scope

- Entra: el texto de «Shape of a question» de `skills/sdd-grilling/SKILL.md` (decisiones 1, 3 y 4); lo que sale de «The Conversation» y «Play It Back» de `skills/sdd-spec-writing/SKILL.md` (decisión 2); el escenario `j1`, sus filas J1 y J2 y su línea en «Procedencia de las reglas» de la batería, y tras la enmienda su reescritura en `battery.md` (molde `reservas`, J1 de vocabulario, procedencia con el RED nuevo) en la Task 2, sin tocar `TURN2` de `subject.mjs`, que no cambia; los topes de `cli/test/kit/word-budget.test.ts`; el delta de `interviewing`.
- No entra: la tabla «regla medida → se queda literal · sustituida · sale con A/B» de las specs que mueven reglas (0345); la nota de entendimiento del primer mensaje de `sdd-spec-writing` salvo la frase que la segunda enmienda le añade; el resto de la batería de `sdd-grilling` y la de `interviewer`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `<what you found, with sources>` del molde | `skills/sdd-grilling/SKILL.md:30` | decisión 1 |
| «Tell limits by their effect, not their cause.» | `skills/sdd-grilling/SKILL.md:39`; su conducta, en `interviewing` «Escena concreta…» («la limitación técnica se cuenta por su efecto») | decisión 1: la cubre la viñeta nueva; el requisito de `interviewing` no cambia |
| «Use plain language…process jargon.» y «Be clear and concise…Avoid jargon.» | `skills/sdd-spec-writing/SKILL.md:125-130` | decisión 2, tapadas con marca `kit: 0361` |
| Ejemplo `dueDate` y «Code names, files…(the short mode of `sdd-rubber-duck`)» de «Play It Back» | `skills/sdd-spec-writing/SKILL.md:214` | decisión 2: la regla pasa a `sdd-grilling`, sin el ejemplo (enmienda 2026-11-20) |
| Topes `sdd-grilling` 886 y `sdd-spec-writing` 3450 | `cli/test/kit/word-budget.test.ts` | decisión 11 |

- Filas que implementa: la fila 0361 de `ROADMAP.md` y la fila «Lista» de las preguntas con jerga de `.docs/sdd/steering/debt.md` (columna final `0361`) → las marca el cierre | comprobado con `grep -n "0361" ROADMAP.md .docs/sdd/steering/debt.md` — tras la tercera enmienda, la fila 0361 cierra y la de deuda queda abierta, con lo aprendido

## Approach

- A. Mudar la regla al molde y a una viñeta de «Shape of a question» de `sdd-grilling`, y tapar su texto en `sdd-spec-writing` — la regla se lee al rellenar el molde y la leen las seis skills que preguntan; cuesta pasar el tope de palabras de una skill a otra.
- B. Dejar la regla en `sdd-spec-writing` y añadir una remisión en `sdd-grilling` («habla como dice spec-writing») — más corto, pero la regla sigue lejos del molde, que es la causa en la deuda, y las otras cinco skills seguirían sin leerla.
- C. Remitir a las reglas del párrafo 🦆 de `sdd-rubber-duck` («lo hallado, en el modo corto de `sdd-rubber-duck`») — el menor número de palabras, pero la regla se queda en una tercera skill que el agente no carga al preguntar: la misma causa.
- Elegido: A — es el arreglo que fija la deuda («mover regla») y la decisión del dev-lead («sí, múdala»); B y C dejan la regla lejos del paso.

El molde pasa a pedir lo hallado con las palabras del proyecto, con el nombre del código y la fuente detrás; una viñeta nombra cada pieza con el vocabulario del proyecto, deja el nombre del código entre paréntesis y marca como del agente el caso que no trajo el usuario; otra viñeta devuelve la regla que el usuario ya dijo.

## Dónde se prueba

- La pregunta nombra cada pieza con el vocabulario del proyecto, con el nombre del código detrás, y marca el caso añadido: escenario `j1` de `tests/batteries/sdd-grilling/battery.md`, fila J1, RED en la base y GREEN en la rama.
- La regla que el usuario ya dijo se devuelve en sus palabras: `j1`, turno 2, fila J2.
- No regresión de la fuente, las claves y lo que no se pregunta: A/B de g7 (C1, R10), g8 (R5), g9 (R11) y p2 (W2, W3).
- Topes y repeticiones: `cli/test/kit/word-budget.test.ts` y `moon run kit:own`; la marca de la copia: `moon run kit:copies`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta desde la tercera enmienda: la feature cierra solo con la prueba, y `interviewing` no cambia. Los dos ADDED propuestos («La pregunta habla en el idioma del proyecto» y «La regla que el usuario ya dijo se le devuelve») están en esta spec en el commit `92313cce4`, como historia.

## Topes de palabras

Conteo de `cli/test/kit/word-budget.test.ts` (palabras separadas por espacios en `dist/skills/<skill>/`), medido sobre `dist/` y sobre una copia con el texto de las decisiones 1 y 2. La suma de los dos topes no cambia: 886 + 3450 = 974 + 3362 = 4336.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-grilling` (SKILL.md y total) | 885 / 886 | 1 | 974 (`wc -w` de la copia → 954, + 20; tras la enmienda, `wc -w dist/skills/sdd-grilling/SKILL.md` → 954 otra vez, y las dos skills juntas 4167, igual que la base) |
| `sdd-spec-writing` (SKILL.md y total) | 3282 / 3450 | 168 | 3362 (`wc -w` de la copia → 3213; baja lo que sube el de `sdd-grilling`, con 149 de margen) |

## Previsión de coste

Precio por sujeto de Sonnet en esta batería: 0,19-0,21 $ (`battery.mjs plan`).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `j1` N=2 en la base; `j1` aún no está en `battery.md`, se cita el de g3, dos turnos en `salas`: `SCENARIOS="g3" N=2` → `suma: 2 sujetos · coste previsto: 0.42 $` | 0,42 |
| GREEN | `j1` N=2 en la rama, como el RED → `suma: 2 sujetos · coste previsto: 0.42 $` | 0,42 |
| Una tanda de REFACTOR | `j1` N=2 → `suma: 2 sujetos · coste previsto: 0.42 $` | 0,42 |
| Controles | A/B, brazo base: `SCENARIOS="g7 g8 g9 p2" N=2` → `suma: 8 sujetos · coste previsto: 1.52 $`; brazo rama, igual | 3,04 |
| Medición tras la revisión final | 0: la revisión final no cambia el texto medido; si lo cambia, se relanza `j1` N=2 (0,42 $) | 0 |
| Suma | 38 sujetos | 10,10 |
| Enmienda 2026-11-20 | RED `j1` en `reservas` N=2 en la base, GREEN N=2 en la rama (`SCENARIOS="j1" N=2` → `suma: 2 sujetos · coste previsto: 0.94 $`, cada tanda) y el brazo nuevo del A/B entero otra vez: `SCENARIOS="g7 g8 g9 p2" N=2` → `suma: 8 sujetos · coste previsto: 1.52 $` | 3,40 |
| Tanda de corrección 2026-11-20 (dev-lead: «1») | GREEN `j1` en `reservas` N=2 → `suma: 2 sujetos · coste previsto: 0.94 $`; brazo nuevo del A/B N=2 → `suma: 8 sujetos · coste previsto: 1.52 $` | 2,46 |

Gastado antes de la enmienda: 4,03 $ en 16 sujetos (RED y GREEN de `j1` en `salas`, brazo base del A/B entero y 4 de 8 del brazo nuevo, cortado).

## Enmiendas

- 2026-11-20 (tercera) — La tanda de corrección siguió en rojo (J1 0 de 2, J2 1 de 2 en `reservas`): la feature cierra solo con la prueba. `skills/sdd-grilling/SKILL.md`, `skills/sdd-spec-writing/SKILL.md`, su `dist/` y los topes de `cli/test/kit/word-budget.test.ts` vuelven a los de `develop` (`004c18a3d`); se quedan el escenario `j1` en `reservas`, sus filas J1 y J2 y la evidencia de las tres tandas; sin delta. La fila «Lista» de la deuda no se salda: sigue abierta con lo aprendido (la jerga nace en la nota de entendimiento; mover prosa no la quita; Art. II pide hueco en la plantilla). Lo implementa la Task 3 — aprobada: «1, cerramos con la prueba» (2026-11-20)
- 2026-11-20 (segunda) — Tras el GREEN en rojo (J1 y J2, 2 de 2 en `reservas`): la nota de entendimiento del primer mensaje de `sdd-spec-writing` entra en el Scope, con «Name parts as `sdd-grilling` says.» en su bloque del kit 0359; la devolución de la regla del usuario pasa de «Shape of a question» a «Answers» de `sdd-grilling` («An answer that states a rule: repeat it in their words; your next question is only whether that's it.»); la viñeta de nombrar pierde «to show where it lives» para que las dos skills no crezcan (4166 frente a 4167). Lo implementa la Task 3 — por qué: la jerga salía sobre todo en la nota, y la regla de devolver se leía en la forma de la pregunta, no al recibir la respuesta — aprobada: «1» (opción «Una tanda de corrección», 2026-11-20)
- 2026-11-20 — Los nombres del código no salen de la pregunta: cada pieza se nombra con el vocabulario del proyecto (`architecture.md`, «Terminology» de `PRODUCT.md`) o por lo que hace, con el nombre del código y la fuente detrás, entre paréntesis; la devolución de la regla del usuario pasa a viñeta propia; `j1` pasa al molde `reservas` y J1 mide el vocabulario; sin literales de un proyecto real en la skill. Cambian las decisiones 1 a 5, el primer ADDED (título, GIVEN, THEN y AND) y la previsión de coste. Lo implementa la Task 2 (sin cerrar) — por qué: corrección del dev-lead, por la sesión «sdd-kit develop», y el GREEN de J2 en rojo 2 de 2 con la frase metida en otra viñeta — aprobada: «1» (opción «Apruebo», 2026-11-20)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-20 | aprobada (opción «Apruebo») |
| Àngel Delgado | 2026-11-20 | enmienda 2026-11-20 aprobada (opción «Apruebo») |

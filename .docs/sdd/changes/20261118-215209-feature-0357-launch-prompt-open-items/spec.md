---
id: 20261118-215209-feature-0357-launch-prompt-open-items
feature: 0357
title: El prompt de arranque no da por decidido lo que no decidió el dev-lead
mode: full
profile: delegate
status: approved
created: 2026-11-18
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-18
---

# Spec — El prompt de arranque no da por decidido lo que no decidió el dev-lead

🦆 Hoy, cuando el kit te da el prompt para arrancar una fila, mete en «Decisiones ya tomadas» tanto lo que dijiste tú como lo que se le ocurrió al agente, y el agente que lo recibe se lo cree todo. Con esta feature, ese bloque solo lleva lo que es seguro, y cada línea dice quién lo decidió y dónde consta. Lo que el agente no ve claro, o lo que propone él, va en un bloque aparte, «Abierto», con su propuesta. Por ejemplo, si pides el prompt de la 0013 y dices «el canal del aviso no lo tengo claro, propón tú», el prompt lleva el aviso a las 8:00 en «Decisiones ya tomadas» con su origen, la enmienda de la propuesta 0010, y el correo que propone el agente en «Abierto». Qué hace con «Abierto» el agente que arranca la fila (preguntártelo o decidirlo él) lo decide la 0356.

Validación: agente — el cambio es una plantilla y dos baterías: lo que se ve es el prompt que dan los sujetos, y eso lo miden el RED y el GREEN; el uso real lo valida el campo (`validation.mode: field`).

## Capacidades

- Modificadas: `planning` — requisito nuevo: el prompt de una fila separa lo decidido de lo abierto.
- Modificadas: `routing` — requisito nuevo: el prompt de un config que sale de `sdd-explore` deja abierto lo que recomienda el agente.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (la sección «Abierto:» del prompt la lee `sdd-propose`, y la 0356 la nombra en `spec-writing.md`) · tamaño: ~40 líneas en 4 ficheros
- Dominio (opus): si la frontera entre «seguro» y «abierto» de la decisión 2 cubre una decisión que el agente tomó con un «decide tú» y dejó escrita en una propuesta, y si los dos ADDED no contradicen «Dame el prompt de una fila da su prompt de arranque» de `planning` ni «Un config que sale de explore da su prompt directo» de `routing` (señal: contrato público)
- Técnica (sonnet): si M8 y E4 se pueden leer en `texts.txt` sin juicio (dónde está el canal y la versión que propone el sujeto), y si el cambio de forma de la línea de «Decisiones ya tomadas:» rompe las rúbricas M1, M4 y E2 (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos en sonnet — deja sin la mirada de opus la frontera de la decisión 2, que es justo lo que esta feature quiere fijar
```

1. **Forma de la sección nueva** — en el bloque del prompt, entre «Decisiones ya tomadas:» y «Antes de diseñar, lee:», va `Abierto:` con una línea por punto: `- <lo que no está claro>. Propuesta: <la recomendación de quien escribe el prompt>`. Sin nada abierto, la sección no se escribe. El valor de un punto abierto no aparece en ningún otro sitio del prompt fuera de `Abierto:`: el título, el `***Nombre:***` y las demás secciones nombran el punto sin su valor («subir el mínimo de Node», no «subir Node a 22»). Por qué: el dev-lead pidió que lo no claro «lo digas en el prompt»; con la propuesta al lado la pregunta se contesta en un turno, y un valor abierto escrito en el alcance se lee igual de decidido que en «Decisiones ya tomadas».
2. **Qué es seguro** — entra en «Decisiones ya tomadas:» lo que el dev-lead dijo o aceptó de forma explícita («sí» a una propuesta concreta, con esa propuesta); lo que consta en el roadmap (el brief de la fila), una propuesta y sus enmiendas, una spec aprobada, una ADR o la constitution; y lo que el agente decidió por delegación, escrito o en la conversación, marcado como tal en su origen (decisión 3). Delegar es pasarle la decisión («decide tú», «elige tú», «lo que veas»); pedir una propuesta («propón tú», «recomiéndame») no es delegar, y lo propuesto va a «Abierto:». Va a «Abierto:» todo lo demás que salió en la conversación —una idea del agente, una recomendación aún no aceptada, una duda que vio— y, **en la duda, «Abierto:»**. Ante un choque: la enmienda más reciente manda sobre la original (regla vigente de `planning`), una frase del dev-lead más reciente manda sobre lo escrito, y lo que no se resuelve así va a «Abierto:» con las dos fuentes. Un hecho comprobado (que 22.18 no rompe nada) no es una decisión: va donde va hoy, en el alcance o las lecturas. Por qué: es la lectura de las dos frases del dev-lead (abajo): el roadmap y la documentación ya llevan decisiones, y el prompt lleva lo que «estamos seguros»; lo delegado es seguro porque el dev-lead lo autorizó, y su marca deja ver que no lo dijo él.
3. **Forma de cada línea de «Decisiones ya tomadas:»** — `- <decisión>, porque <su porqué> (<origen>)`, y el origen es uno de tres: `dev-lead, <AAAA-MM-DD>: «<frase>»` (lo dijo o lo aceptó en la conversación), `<ruta o fila>` (consta en un documento) o `agente por delegación, <ruta, fila o AAAA-MM-DD>`. Antes: `- <decisión con su literal>, porque <su porqué>`. Un documento no dice quién escribió cada línea (el brief no lleva autor), así que su origen es la ruta, sin atribuirla: inventar el autor sería peor. Por qué: el agente que recibe el prompt ve de un vistazo de dónde sale cada línea, y la delegación se distingue de la palabra del dev-lead.
4. **Dónde vive la regla** — en el bloque de ayuda de `launch-prompt-template.md`, que ya leen `sdd-roadmap` y `sdd-explore` al escribir el prompt; las dos skills no se tocan salvo que el RED muestre que el sujeto no la aplica (Scope, «Entra, si el RED lo exhibe»). Su texto no contradice la regla: `sdd-roadmap` remite a la plantilla (entrada 1 y paso 7), y la frase «each decision taken with its literal» de `sdd-explore:26` es el traspaso a `sdd-roadmap`, no el prompt. Por qué: la ADR 0014 pone la regla en la plantilla, y una regla repetida en dos skills la marca `kit:own` y alarga las skills.
5. **El ejemplo de la plantilla** gana una sección `Abierto:` con un punto y su propuesta, y su línea de decisión lleva el origen `<ruta o fila>` (la propuesta 0131 que ya cita), sin inventar una frase del dev-lead. Por qué: el agente calca el ejemplo más que la regla.
6. **La regla del triaje de `sdd-roadmap` (`SKILL.md:104`) no se toca, y queda un riesgo** — hoy manda una solución que probó el agente a `**Decisiones ya tomadas:**` del brief; con la decisión 3, esa línea sale en el prompt con el origen de la fila, sin decir que la puso el agente. Lo mismo el cierre de `sdd-roadmap` que escribe filas: en `pair` y `delegate` las presenta y espera la decisión del dev-lead (paso 3), así que lo que llega al brief lo aceptó él o lo delegó. Por qué: hoy no hay ninguna fila con una solución del triaje (buscado en los briefs de `ROADMAP.md`), y marcar el autor en el brief es lo que el dev-lead dejó fuera; si aparece el caso, es su segundo caso y va a una fila.
7. **Los escenarios nuevos y sus filas** — `m8` en la batería de `sdd-roadmap` y `e4` en la de `sdd-explore`, con las peticiones literales del delta, n = 2 y umbral 2/2 en sonnet, como `m1` y `e2`. Se juzga solo el bloque de código del prompt en `texts.txt`, no la prosa de antes. Filas literales:
   - **M8 Lo abierto, aparte** (`m8`): falla si el bloque no tiene `Abierto:` con un punto que lleve `Propuesta:` y uno de `correo`, `email`, `e-mail`, `Slack` o `Teams`; si ese canal aparece en el bloque fuera de `Abierto:` (título y `***Nombre:***` incluidos); si el aviso a las 8:00 no está en «Decisiones ya tomadas:» con un origen que nombre la propuesta 0010 o su enmienda, o está en `Abierto:`; si alguna línea de «Decisiones ya tomadas:» no acaba en un paréntesis con su origen (`dev-lead, …`, una ruta o fila, o `agente por delegación, …`) o cita una ruta que no existe en el molde; o si escribe, reserva, publica o commitea.
   - **E4 Recomendación abierta** (`e4`): falla si el bloque no tiene `Abierto:` con un punto que lleve `Propuesta:` y `22` o `24`; si esa versión aparece en el bloque fuera de `Abierto:` (título y slug de `***Nombre:***` incluidos); si «Alcance:» no dice que se sube el mínimo de `node` en los `engines` de `package.json`; o si escribe una fila, reserva un id o toca `package.json`.
   - El RED vale si falla por estas condiciones. Si el RED sale verde, el escenario queda de control, se reformula la petición y se dice en la evidencia. Controles tras el cambio: `m1`, `m4` y `e2`, porque miden la forma del prompt que cambia; `m4` sin precio medido (el de `m1`).
   - Sin escenario: el origen `agente por delegación` (ninguna petición de los moldes delega una decisión que acabe en el prompt) y el cierre de `sdd-roadmap` con filas escritas en la misma sesión (lo mide `m2` en su forma; el origen, no). Lo cubre la regla de la plantilla y el uso en campo.
   - Si el RED obliga a tocar `sdd-roadmap` o `sdd-explore`, el saldo de palabras de las skills tocadas queda igual o baja (CLAUDE.md, regla 6): la regla se mueve al paso donde se decide, no se añade.
8. **Delta probado en una copia** — `sdd capability merge` sobre una copia de `.docs/sdd`: `planning.md: añadido «El prompt de una fila separa lo decidido de lo abierto»`, `planning.md: regla «Regla ante conflicto» sustituida` y `routing.md: añadido «El prompt de un config deja abierto lo que recomienda el agente»`.
9. **Nombre de la sección**: «Abierto», sin «pregúntaselo al dev-lead» — lo decidió el dev-lead (abajo); qué se pregunta de lo abierto es de la 0356, que confirmó por mensaje (sesión de la 0356, 2026-11-18) que su regla en `spec-writing.md` trata un punto de «Abierto» como no respondido y pregunta citando su propuesta. No hay orden de fusión: sin la 0356, `Abierto:` es una sección con nombre propio que el agente que arranca lee como no decidida; con ella, la entrevista la reparte.

### Hallazgos de la segunda ronda (sonnet)

- **Aceptado** — 1, Crítico: el brief no dice quién decidió y la decisión 6 usaba un origen `agente` que la 3 no tenía → decisión 3: un documento se cita por su ruta sin atribuirlo; la decisión 6 declara el riesgo que queda.
- **Aceptado** — 2, Crítico: lo delegado dependía de estar escrito, y la spec aprobada por delegación no tenía sitio → decisión 2: lo delegado, escrito o en la conversación, entra con `agente por delegación`.
- **Aceptado** — 3: la frontera dependía de la palabra; faltaban la constitution y un caso por defecto → decisión 2: qué es delegar, la constitution y «en la duda, `Abierto:`».
- **Aceptado** — 4, Crítico: la decisión 2 mandaba a `Abierto:` el choque enmienda-original, que `planning` ya resuelve, y traía una condición de conflicto sin declarar → decisión 2 respeta la regla vigente y el delta declara la «Regla ante conflicto» de `planning` completa.
- **Rechazado** — 5: el ADDED de `planning` sería un MODIFIED de «Dame el prompt de una fila…» → con la decisión 2, las decisiones de la propuesta y sus enmiendas siguen en «Decisiones ya tomadas:»; el THEN vigente sigue siendo cierto.
- **Aceptado** — 6: M8 no medía el origen correcto ni E4 el exceso de celo, y «canal concreto» pedía juicio → M8 exige que el origen de las 8:00 nombre la 0010; E4, el alcance; las dos listan los valores válidos; lo delegado queda declarado sin escenario.
- **Aceptado** — 7: la dependencia con la 0356 sin orden ni fuente → decisión 9.
- **Aceptado** — 8: el valor abierto podía filtrarse en otras secciones → decisión 1 y M8/E4: en ningún sitio fuera de `Abierto:`.
- **Aceptado** — 9: el ejemplo obligaba a inventar una frase → decisión 5: origen `<ruta o fila>`.
- **Aceptado** — 10: la edición condicional de las skills sin saldo de palabras → decisión 7.

### Hallazgos de la review

Dominio (opus):

- **Aceptado** — 1, Crítico: el brief puede llevar ideas del agente que el prompt daría por seguras (cierre de `sdd-roadmap`, traspaso de `sdd-explore`, triaje) → decisión 2 con el criterio «quién lo decidió» y decisión 6 reescrita para cubrir el cierre del roadmap.
- **Aceptado** — 2: la misma delegación caía en sitios distintos según dónde quedara escrita → decisión 2: la delegación escrita entra marcada `agente por delegación`.
- **Aceptado** — 3: el origen solo con ruta no dice quién decidió → decisión 3 con el autor en el origen.
- **Aceptado** — 4: casos sin sitio (un «sí» a una propuesta, un hecho comprobado, una spec aprobada por delegación) → decisión 2 los resuelve; la spec aprobada por delegación es `agente por delegación`.
- **Rechazado** — 5: los dos ADDED serían MODIFIED de «Dame el prompt de una fila…» y «Un config que sale de explore…» → sus THEN siguen siendo ciertos: enumeran lo que el prompt lleva, sin decir que no lleve más, y `Abierto:` se omite sin nada abierto; el ADDED de `planning` remite a la forma de la plantilla.
- **Aceptado** — 6: el valor abierto se cuela en título, nombre, alcance y criterio → decisión 1 y los THEN de los dos ADDED.
- **Rechazado** — 7: la regla «Dónde viven los datos» de `planning` quedaría desfasada → la regla habla de dónde vive lo que necesita el prompt, el brief, y no cambia: el prompt ya leía la propuesta y sus enmiendas (requisito «Dame el prompt de una fila…»); la feature no trae datos, límites ni avisos nuevos. La «Regla ante conflicto» sí cambia: la segunda ronda la declaró (hallazgo 4).
- **Aceptado** — 8: falta la regla ante conflicto → decisión 2: manda la frase más reciente del dev-lead; dos fuentes escritas que chocan van a `Abierto:` con las dos.
- **Aceptado** — 9: dos procedencias del problema → una sola, en «Decisiones tomadas con el dev-lead».
- **Rechazado** — 10: las líneas de «Decisiones tomadas con el dev-lead» no siguen la forma del origen del prompt → esa sección sigue la forma de `spec-template.md` (`<decisión> — «<frase literal>»`), no la del prompt.

Técnica (sonnet):

- **Aceptado** — 1, Crítico: M8 y E4 sin texto, con cinco maneras de pasar sin la conducta → decisión 7 con las filas literales.
- **Aceptado** — 2, Crítico: la frontera de la decisión 2 se contradecía entre «propón tú» y «decide tú» → decisión 2: una recomendación pedida y no aceptada es abierta; una decisión delegada y escrita es segura con su origen `agente por delegación`.
- **Aceptado** — 3: el fracaso por exceso de celo no lo detectaba ninguna fila → M8 falla si el aviso a las 8:00 sale de «Decisiones ya tomadas:».
- **Aceptado** — 4: el origen no se medía → M8 falla si una línea no lleva origen o cita una ruta que no existe en el molde.
- **Aceptado** — 5: `Abierto:` es un contrato y no estaba en la tabla; ¿algún test lee la plantilla? → fila nueva en «Lo que se retira o cambia de forma»; `git grep launch-prompt -- cli/test tests/headless` no da nada.
- **Aceptado** — 6: las skills podrían contradecir la plantilla → buscado: no la contradicen (decisión 4).
- **Aceptado** — 7: el RED puede salir verde → decisión 7: si sale verde, el escenario queda de control y se reformula la petición.
- **Aceptado** — 8: los ADDED no exigen el resto de la forma → AND «en la forma de `launch-prompt-template.md`» en `planning`.
- **Aceptado** — 9: E4 podía leerse en la prosa → se juzga solo el bloque de código (decisión 7).
- **Aceptado** — 10: decisiones del cuerpo fuera del ✋ (control `m4`, umbral) → en la decisión 7.

### Decisiones tomadas con el dev-lead

- El problema, visto al revisar el prompt de la 0355 y escrito en la fila 0357 — «el prompt no puede dar por sentadas cosas porque el agente lo lee como si lo hubiera escrito el dev» (2026-11-18)
- Qué lleva el prompt y qué es seguro — «en el roadmap tenemos muchas notas ya y muchas decisiones ya... ademas tenemso la documentacion es decir el promot debe llevar loq ue estamos seguros... y si acaso y eso seria algo chullo lo que ya veas no claro lo digas en el prompt» (2026-11-18)
- El brief del roadmap no se toca — la misma frase: el roadmap y la documentación ya son fuente de lo seguro.
- Nombre y frontera con la 0356 — «quizas mejor dejarlo como abiertto, sino preguntale a 356 que vamos hacer con la parte de preguntas» (2026-11-18)
- Enfoque: la regla en la plantilla — «sí, escribe la spec» (2026-11-18), a la pregunta de si seguir por la plantilla con un escenario en cada batería.
- Review con dos revisores (opus y sonnet) en paralelo — «1» (2026-11-18), a la pregunta del nivel de review.

## Intent

Hoy `launch-prompt-template.md` tiene un solo bloque de decisiones, «Decisiones ya tomadas:», y quien escribe el prompt mete ahí lo que dijo el dev-lead y lo que propuso él. El agente que lo recibe lo lee todo como palabra del dev-lead y no pregunta. Éxito: un sujeto que escribe el prompt de una fila, con una idea suya que el dev-lead no dijo, la deja en «Abierto:» y no la da por decidida en otra parte del prompt; y lo mismo `sdd-explore` con un config. Fracaso aunque funcione: que lo seguro (una decisión del brief o de una enmienda) salga de «Decisiones ya tomadas:» por exceso de celo.

## Scope

- Entra: `skills/sdd-templates/templates/launch-prompt-template.md` — la regla en el bloque de ayuda (decisiones 1, 2 y 3), la sección `Abierto:` en la forma y en el ejemplo, y el origen en cada línea de decisión.
- Entra: `tests/batteries/sdd-roadmap/battery.md` y `subject.mjs` — escenario `m8` y fila M8; `tests/batteries/sdd-explore/battery.md` y `subject.mjs` — escenario `e4` y fila E4; la procedencia de la regla en las dos.
- Entra: las capacidades `planning` y `routing`, con un ADDED cada una (delta abajo).
- Entra, si el RED lo exhibe: `skills/sdd-roadmap/SKILL.md` (entrada 1 y paso 7) y `skills/sdd-explore/SKILL.md` (paso del config), si el sujeto no aplica la regla de la plantilla.
- No entra: qué hace la entrevista con «Abierto» (preguntar o decidir): fila 0356.
- No entra: la etiqueta `**Decisiones ya tomadas:**` del brief (`now-next-later-template.md`) ni `sdd roadmap check`.
- No entra: la regla del triaje de `skills/sdd-roadmap/SKILL.md:104` (decisión 6).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Línea de forma `- <decisión con su literal>, porque <su porqué>` → `- <decisión>, porque <su porqué> (<origen>)` | `skills/sdd-templates/templates/launch-prompt-template.md:31` | Scope (plantilla), decisión 3 |
| «cada decisión con su literal y su porqué» del bloque de ayuda | `launch-prompt-template.md:7` | Scope: pasa a decir qué es seguro y qué va a `Abierto:` (decisión 2) |
| Ejemplo `- ROADMAP.md va en la raíz, porque lo lee quien no abre .docs/` | `launch-prompt-template.md:66` | Scope: gana su origen y una sección `Abierto:` (decisión 5) |
| Sección nueva `Abierto:` del bloque del prompt (contrato) | `launch-prompt-template.md`; la lee `sdd-propose` y la nombra la 0356 en `skills/sdd-propose/references/spec-writing.md` | Scope (plantilla); el lado de `spec-writing.md` es de la 0356 (decisión 9); ningún test lee la plantilla: `git grep launch-prompt -- cli/test tests/headless` vacío |
| Etiqueta `**Decisiones ya tomadas:**` del brief | `now-next-later-template.md:13,25,33`, `planning.md:88,176`, `cli/test/roadmap/project.ts:9`, `skills/sdd-upgrade/references/migrations/v3.0.0.md:70` y los `subject.mjs` de `interviewer`, `sdd-archive`, `sdd-grilling`, `sdd-propose` y `sdd-roadmap` | sin cambio: el brief no se toca (decisión del dev-lead) |
| Una solución probada en `**Decisiones ya tomadas:**` del brief | `skills/sdd-roadmap/SKILL.md:104` | sin cambio: decisión 6 |

- Filas que implementa: 0357 → `ROADMAP.md:12` (la marca el cierre); nada más la nombra: comprobado con `git grep -n 0357 -- . ':!.docs/sdd/changes'`.

## Approach

- Regla en la plantilla del prompt, con el ejemplo — un solo sitio; las dos skills ya escriben el prompt calcándola. Cuesta que el sujeto la lea: lo mide el RED.
- Regla repetida en `sdd-roadmap` y `sdd-explore` — la ve seguro quien escribe el prompt, pero queda la misma frase en dos skills, `kit:own` marca las reglas repetidas y alarga las skills (CLAUDE.md, regla 6).
- Elegido: la plantilla — lo eligió el dev-lead: «sí, escribe la spec»; si el RED muestra que el sujeto no la aplica, una línea en la skill que lo exhibe, por el Scope.

La plantilla dice en su bloque de ayuda qué va en cada bloque (decisión 2), la forma de la línea con su origen (decisión 3), que `Abierto:` se omite sin nada abierto y que su valor no se escribe como decidido en otra parte del prompt (decisión 1). El ejemplo los enseña.

## Dónde se prueba

- El prompt de una fila deja en `Abierto:` la propuesta del agente y conserva lo seguro con su origen: batería de `sdd-roadmap`, escenario `m8`, fila M8, como `m1`.
- El prompt de un config deja en `Abierto:` la recomendación del agente: batería de `sdd-explore`, escenario `e4`, fila E4, como `e2`.
- La forma de siempre no se rompe: controles `m1`, `m4` y `e2`.

## Términos y ADR

- Términos resueltos: «Abierto» — la sección del prompt de arranque con lo que quien lo escribe no ve claro o propone él, cada punto con su propuesta; lo seguro va en «Decisiones ya tomadas», con quién lo decidió y dónde consta.
- ADR candidatas: ninguna — se deshace editando la plantilla.

## Delta de comportamiento

### Capacidad: `planning`

#### ADDED — El prompt de una fila separa lo decidido de lo abierto

- GIVEN el molde `salas-0013`, con la fila 0013 «Aviso semanal a los responsables», `proposal: 0010` y la enmienda de la propuesta que pasa el aviso a las 8:00
- WHEN el usuario escribe «Dame el prompt de la 0013. Cómo se manda el aviso (correo, Slack…) no lo tengo claro: propón tú.»
- THEN `sdd-roadmap` da el prompt en la forma de `launch-prompt-template.md`, y su bloque lleva en «Decisiones ya tomadas:» el aviso a las 8:00, con la enmienda de la propuesta 0010 como origen, y cada línea con su origen
- AND el canal que propone va en una sección `Abierto:`, como `- <punto>. Propuesta: <canal>`, y no aparece en ningún otro sitio del prompt
- AND sin nada abierto, el prompt no lleva `Abierto:`

#### Reglas de la capacidad — planning

- **Regla ante conflicto**: manda la enmienda más reciente sobre la regla original. Una feature cerrada o en marcha no se reabre: el cambio va a una fila nueva. Entre la solución que trae un ticket y la que se probó con el caso real, manda la probada. En el prompt de arranque, una frase del dev-lead más reciente manda sobre lo escrito, y dos fuentes que así no se resuelven van a `Abierto:` con las dos.

### Capacidad: `routing`

#### ADDED — El prompt de un config deja abierto lo que recomienda el agente

- GIVEN el molde `salas`, con `control.profile: delegate` y `merge.push: true` en `sdd-kit.json`
- WHEN el usuario escribe «Quiero subir el mínimo de node en los engines de package.json y no sé si a 22 o a 24: recomiéndame tú y dame el prompt para hacerlo en otro worktree.»
- THEN `sdd-explore` responde con su recomendación y termina con el prompt de arranque en la forma de `launch-prompt-template.md`
- AND la versión que recomienda va en la sección `Abierto:` del prompt, como `- <punto>. Propuesta: <versión>`, y no aparece en ningún otro sitio del prompt, el título y el slug de `***Nombre:***` incluidos

## Previsión de coste

Los escenarios `m8` y `e4` aún no están en las baterías: su precio es el de `m1` y `e2`, que piden lo mismo (un prompt en el mismo molde); sin medir los nuevos.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="m1" N=2` (por `m8`) → `suma: 2 sujetos · coste previsto: 0.27 $`; `SCENARIOS="e2" N=2` (por `e4`) → `suma: 2 sujetos · coste previsto: 0.23 $` | 0.50 |
| GREEN | lo mismo que el RED | 0.50 |
| Una tanda de REFACTOR | lo mismo que el RED | 0.50 |
| Controles | `SCENARIOS="m1" N=2` → `0.27 $`; `m4` (sin medir, precio de `m1`) → `0.27 $`; `SCENARIOS="e2" N=2` → `0.23 $` | 0.77 |
| Medición tras la revisión final | 0: no hay cambio de skill tras la revisión salvo que un hallazgo lo pida | 0 |
| Suma | 18 sujetos | 2.27 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-18 | aprobada (opción «Apruebo») |
| Àngel Delgado | 2026-11-18 | plan aprobado (opción «Apruebo, con Native») |
| Àngel Delgado | 2026-11-18 | perfil → delegate: «1, y a puedes seguir con delegate» |

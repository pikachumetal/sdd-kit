---
id: 20261108-184606-feature-0314-grilling-brainstorming-7
feature: 0314
proposal: 0301
title: sdd-grilling con brainstorming de superpowers 7.0.2 y grilling de mattpocock v1.3.2
mode: full
profile: delegate
status: approved
created: 2026-11-08
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-08
---

# Spec — sdd-grilling con brainstorming de superpowers 7.0.2 y grilling de mattpocock v1.3.2

🦆 Hoy, cuando una skill del kit entrevista al dev («añade un comando que exporte a CSV las reservas de una sala»), el agente puede abrir preguntando cómo construirlo sin saber para qué lo quiere, preguntar cosas que no cambian nada («¿quieres que busque más?») o volver a algo que ya estaba decidido en la fila del roadmap. Superpowers 7.0.2 midió que, con cuatro frases nuevas, las preguntas de relleno bajan de 41 a 23 y el porqué sale primero en 33 de 33. Esta feature mide primero si el kit de hoy falla en lo mismo, y solo donde falla cambia la frase de `sdd-grilling` por la nueva, sin dejar la vieja al lado. Las dos fuentes de `sdd-grilling` en `upstream.json`, brainstorming y grilling de Matt, suben a su última versión.

Validación: agente — este repo valida en campo (`validation.mode: field`): la verificación es la batería de `sdd-grilling`, y el uso real lo traen los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `interviewing` — el GIVEN de «Una decisión por turno» y el requisito nuevo «El porqué va primero» (enmienda 2026-11-08). «Solo se pregunta lo que cambia lo que se construye», «Los pasos de proceso no se preguntan» y «Lo ya decidido no se reabre» salieron con su RED limpio.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED (dos requisitos de `interviewing`) · tamaño: ~45 líneas en 5 ficheros
- Dominio (opus): si el MODIFIED de «Una decisión por turno» choca con «El descubrimiento no se ancla», «Rebatir una vez» o «Escena concreta» (el boceto que «propone enseñar»), y si la regla de proceso deja intactas las paradas de los llamantes (señal: MODIFIED)
- Técnica (sonnet): si las filas W1-W4 de la rúbrica miden cada sustitución sin que la petición de `p1` y `p2` telegrafíe la conducta, y si la previsión de coste cuadra con `battery.mjs plan` (señal: MODIFIED)
- Mínimo razonable: un revisor con los siete puntos — deja sin una lectura propia el choque de la regla de proceso con el boceto que la capacidad hoy «propone» y con las preguntas operativas de los llamantes
```

1. **Enfoque: las cuatro sustituciones de la fila, cada una condicionada a su RED** (Art. I; como en la 0297). Descartados: traer el bloque «The Conversation» de brainstorming 7.0.2 casi literal, porque `sdd-grilling` es un `concept` con dos fuentes, y ese bloque trae lo que ya hace `sdd-propose` (enfoques, tamaño, documento de diseño) y no cabe en el tope; y subir las versiones sin tocar el texto, que solo vale para las sustituciones cuyo RED salga limpio.
2. **`sdd-grilling` tiene dos fuentes y las dos entradas suben**: en `upstream.json`, la entrada `concept` de superpowers con `paths: skills/brainstorming/SKILL.md` y `kit: skills/sdd-grilling/SKILL.md` (`v7.0.0 → v7.0.2`), y la de mattpocock con `paths: skills/productivity/grilling/SKILL.md` y el mismo `kit` (`85f83d3 → v1.3.2`). `moon run kit:upstream` da hoy rojo en las dos, y el «hecho» de la fila pide que no dé rojo en `sdd-grilling`. El alcance de la petición nombraba solo la primera; el recordatorio del dev-lead nombra las dos. Las versiones suben aunque no entre ninguna sustitución: el diff de las dos fuentes está leído y clasificado (tabla «Procedencia del diff»).
3. **La (3) reescribe «Facts are your job; decisions are the user's.», no la quita**: es la regla central de `grilling` de Matt («Finding _facts_ is your job, never the user's… The _decisions_ are the user's»). La nueva junta las dos fuentes (Approach).
4. **La (1) conserva «nothing silently assumed» de Matt y quita «relentlessly»**: «interroga sin descanso» empuja a preguntar justo lo que la frase nueva filtra. Matt v1.3.2 sigue diciendo «relentlessly»; el kit lo sustituye, no lo deja al lado.
5. **Lo que el usuario sigue decidiendo** (hallazgos D2, D3): la (1) nombra «what gets built, its scope, level or cost»; lo que solo sabe el usuario nunca se rellena («never what only the user knows»), como ya dicen «Discovery» y «Decide for me».
6. **«Cómo enseñar algo» sale de los pasos de proceso** (hallazgo D1): «Escena concreta en las decisiones de producto» ya dice enseñar el boceto en vez de preguntar, y no cambia.
7. **Mattpocock v1.3.2, «Word each question so "yes" accepts your recommended answer.»: ya está, no entra texto.** La forma fija del kit acaba en «➡️ I recommend 1️⃣», y un «sí» a ella acepta la recomendada; en las operativas, la recomendada va primero. Sin RED: si el campo trae un «sí» mal leído, entra por ticket.
8. **Mattpocock v1.3.2, el subagente «with a fresh context window»: ya está.** «Look it up before asking» manda la búsqueda web a un subagente, que en Claude Code arranca sin el contexto de la sesión.
9. **El resto del diff de brainstorming 7.0.2, trozo a trozo**: tabla «Procedencia del diff» del Approach (entra, ya está o se descarta).
10. **La nota de la entrada de superpowers** pasa de «La frase de pensar varias ideas antes de proponer.» a «La frase de pensar varias ideas antes de proponer; desde v7.0.2, también <las que entren>.», con las que entren nombradas («preguntar solo lo que cambia lo que se construye», «el porqué primero», «los pasos de proceso», «lo ya decidido»). Se escribe al final, con el RED leído. La de mattpocock sigue sin nota.
11. **Tres escenarios nuevos en la batería**, un turno cada uno, n = 2, Sonnet, en el perfil por defecto del molde (que pregunta):
    - `p1`, molde `salas`: «Carril feature, modo full: añade un comando que exporte a CSV las reservas de una sala.» Sin porqué en ninguna parte.
    - `p2`, molde `salas`: «Carril feature, modo full: añade un comando que exporte a CSV las reservas de una sala, porque el responsable de cada sala las cuadra los lunes en su hoja de cálculo.» El porqué dicho y nada decidido.
    - `p3`, molde `salas-csv` nuevo (el de `salas` con una fila 2 en «Próximo» del roadmap): «Carril feature, modo full: arranca la 2 del roadmap.» La fila dice «Exportar a CSV las reservas de una sala, para que el responsable las cuadre los lunes en su hoja de cálculo; separador punto y coma (su Excel está en castellano) y por la salida estándar, que él redirige a su fichero (responsable de salas, 2026-11-01: «así me sirve»)» (enmienda 2026-11-08: antes, «y solo las reservas desde hoy», que chocaba con las reservas sin fecha del molde). Lo decidido llega como dato del proyecto, que es el caso de campo, y no con «ya está decidido» en la petición (hallazgo T4).
    Exportar a CSV no está en el código del molde, y su backlog solo trae `.ics`: no hay ningún hecho que el sujeto pueda leer en vez de preguntar, ni uno que choque con el punto y coma o con la salida estándar, que es como devuelven texto los demás comandos.
12. **Una fila de rúbrica por sustitución, más una de control**:
    - W1 «Porqué primero» (`p1`) mide la (2). Falla si la primera pregunta de diseño o de descubrimiento del último mensaje no es para qué lo quiere; si la lleva con alternativas, recomendación, hipótesis o ejemplos de respuesta; o si antes pregunta una de diseño. Las operativas del llamante (carril, perfil, aprobar) no cuentan.
    - W2 «Sin relleno» (`p2`, `p3`) mide la (1). Se juzga la pregunta de diseño o de descubrimiento del último mensaje; las operativas del llamante no cuentan. Falla si pregunta algo que la petición o el proyecto ya contestan (el porqué, lo que dice la fila 2), o algo que no cambia lo que se construye, su alcance, nivel ni coste: en qué fichero va el código, cómo se llama una función interna o un fichero temporal. No falla una pregunta sobre lo que sale en el CSV: separador, columnas, cabecera, codificación o rango, salvo lo que la fila 2 ya fija.
    - W3 «Proceso» (`p1`, `p2`, `p3`) mide la (3). Falla si pregunta un paso de proceso (si escribe o apunta algo, dónde va, si busca más) en vez de hacerlo y decirlo. Las operativas del llamante (carril, perfil, aprobar) no cuentan.
    - W4 «Lo ya decidido» (`p3`) mide la (4). Falla si una pregunta o una alternativa reabre el punto y coma o la salida estándar. Repetirlos para confirmar lo entendido no es reabrirlos.
    - W5 «Lo del dev» (`p1`, `p2`, `p3`) es el control de la (1) y la (3). Falla si «decidido por mí» o una propuesta fija lo que solo sabe el usuario (para quién, para qué), el alcance, el nivel o el coste.
13. **W3 se lee también en las salidas guardadas de la batería**, sin lanzar sujetos («Un stream previo puede ser el RED de otra task»). El conjunto es fijo: todos los `*.texts.txt` de `specs/20261002-141929-feature-0128-sdd-grilling/green/out`, `specs/20261011-194235-patch-0172-brainstorming-pieces/green/out` y `specs/20261011-130007-feature-0168-fork-brainstorming-writing-plans/green-molde/out`. `git log --since=2026-10-02 -p -- skills/sdd-grilling/SKILL.md` lo confirma: los siete commits desde entonces tocan la forma de la pregunta, el boceto, el diagrama, la búsqueda y «relentlessly», y ninguno toca los pasos de proceso. Con eso, la (3) se mide aunque el primer turno de `p1`-`p3` no la provoque (hallazgo T3). El recuento sale en la Task 1, sobre ese conjunto. Si la (3) entra, su GREEN es W3 en `p1`-`p3` más W5, y vale como no regresión, no como prueba de que la frase nueva corrige el fallo: los primeros turnos pueden no provocarlo. Se dice así en la evidencia.
14. **Cuándo entra cada sustitución**: con 1 o más sujetos que fallan su fila (W1 de 2, W2 de 4, W3 de 6 más las salidas guardadas, W4 de 2). Con 0, la frase vieja se queda, su requisito sale del delta con una enmienda y el escenario queda como regresión. Rechazo subir n a 3 (hallazgo T2) y el umbral a 2 de 4 (hallazgo S2): «limpio» es 0, como dijo el dev-lead («Si el RED de una sustitución sale limpio, esa no se escribe, como en la 0297»). Además, una sustitución que entra por ruido trae el texto de la fuente con la medida de la fuente detrás (Principio 1, ADR 0022), y el GREEN y la batería entera la vigilan.
15. **La (4) se mide con lo decidido en el roadmap**, no con lo decidido turnos antes en la misma entrevista: un escenario de varios turnos cuesta ~0,4 $ por turno y sujeto. El caso de varios turnos lo trae el campo. Una fila del roadmap ya es «lo que el proyecto enseña», que la frase vieja cubre (hallazgo S1), así que lo previsible es que `p3` salga limpio y la (4) no entre. Si entra, su requisito va aparte de la línea 80 de «Cuándo para la entrevista» porque dice dos cosas que esa línea no dice: no ofrece lo decidido como alternativa, y el choque con un hecho va a «Rebatir una vez».
16. **«Challenge once» no cambia**: rebatir una vez lo decidido cuando choca con un hecho del proyecto no es reabrirlo («Lo ya decidido no se reabre», último AND).
17. **Control de no regresión**: la batería entera con N = 1 y el kit de la rama. Cada fila roja se repite con `KIT_DIR` apuntando al kit de `develop` (`tech-stack.md`: «Antes de llamar regresión a una fila de humo…»), y solo cuenta como rojo nuevo la que pasa con el de `develop`. Vigilan lo que el usuario sigue decidiendo R5 (descubrimiento: `g2`, `g5`, `g8`), R8 («decide tú»: `g5`) y R10 (`sdd-config`: `g7`). Entre todos, los escenarios pasan por los cinco llamantes. Si no entra ninguna sustitución, no hay control, porque el texto de la skill no cambia.
18. **Evidencia**: `tests/sdd-grilling-0314-red.md` y `tests/sdd-grilling-0314-green.md`, y las salidas en `red/`, `green/` y `control/` de esta carpeta.
19. **Una pieza entra, otra sale**: cada frase nueva sustituye entera a una vieja, y no se retira nada más. Con las cuatro dentro, la skill pasa de 840 a 901 palabras (medido sobre una copia), y el tope nominal de 900 sube a 921 (tabla de topes). La decisión del tope es tuya en el gate.
20. **Delta probado en una copia**: `sdd capability merge` sobre una copia de `.docs/sdd` da «interviewing.md: sustituido «Una decisión por turno»» y «añadido» para los cuatro requisitos nuevos (33 líneas nuevas, 2 quitadas), con las cuatro sustituciones dentro; `sdd capability check` sobre la copia solo avisa de tres requisitos largos de `verification.md`, que ya existían.
- Política de modelos: revisores de la spec, dominio en opus y técnica en sonnet (hechos), y uno en sonnet para la segunda ronda, todos con `sdd-kit:effort-medium` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería en sonnet, por tandas de hasta `control.maxParallelAgents` (3). Al aprobar la spec, esta línea es la confirmación de paralelizar que pide tu `CLAUDE.md`; lo que no nombra se confirma aparte.

### Hallazgos de la review

- **Aceptado** — D1 (Crítico): «cómo enseñar algo» cambiaba «Escena concreta» sin declararlo → fuera de la (3), del delta, de W3 y de «Términos» (decisión 6).
- **Aceptado** — D2 (Crítico): «Decisions about what gets built» dejaba fuera el alcance, el nivel y el dinero → la (1) los nombra y la (3) dice «decisions, the user's» sin acotar (decisión 5).
- **Aceptado** — D3 (Crítico): la (1) dejaba rellenar el descubrimiento → «never what only the user knows» en la (1), y un AND propio en el requisito nuevo (decisión 5).
- **Aceptado** — D4: «no reabrir» chocaba con «Rebatir una vez» → último AND de «Lo ya decidido no se reabre» y decisión 16. W4 excluye repetir para confirmar, y el molde no tiene ningún hecho que choque. **Rechazado** cambiar «Regla ante conflicto»: el AND ya dice qué gana, en el sitio donde se decide.
- **Aceptado** — D5: la frontera con las operativas solo estaba en «Términos» → AND de «Los pasos de proceso no se preguntan».
- **Aceptado** — D6: el ejemplo hacía escribir a `sdd-grilling` → el ejemplo es una búsqueda, y un AND dice que lo decidido lo escribe quien la invoca; «Dónde viven los datos» no cambia.
- **Aceptado** — D7: el porqué se preguntaba aunque viniera en la fila o el proyecto → «If neither they nor the project say why» y `p3` lo mide (W2).
- **Aceptado** — D8 y T6: ninguna fila medía que el agente decidiera lo del dev → W5, y R5, R8 y R10 nombrados en la decisión 17.
- **Aceptado** — D9 y T5: ANDs colgados de un GIVEN que no los prepara → un requisito nuevo, con su escenario, por sustitución; «Una decisión por turno» fija el porqué dicho en su GIVEN.
- **Aceptado** — T1: la suma y los precios no cuadraban → cifras del `plan` con `p1`-`p3`, sumadas de nuevo.
- **Rechazado** — T2 (n = 3): motivo en la decisión 14.
- Segunda ronda (sonnet, siete puntos):
  - **Aceptado en parte** — S1: la (4) duplica la línea 80 con un caso del roadmap → decisión 15. No se añade el escenario de varios turnos, por coste.
  - **Aceptado en parte** — S2: W2 era juicio del evaluador → W2 enumera qué falla y qué no. **Rechazado** el umbral de 2 de 4: decisión 14.
  - **Aceptado** — S3: conjunto de salidas guardadas sin fijar y sin verificar → conjunto fijo y `git log` citado. El GREEN de la (3) se declara como no regresión (decisión 13).
  - **Aceptado** — S4: el AND «o queda pendiente» no estaba en la (1), y faltaba qué manda → el AND dice solo «lo pregunta abierto» (lo pendiente sigue en «Decide tú»), y otro AND dice que «Decide tú» y las paradas de `control-profiles` mandan.
  - **Aceptado** — S5: el THEN de «Lo ya decidido» chocaba con «Rebatir una vez» → el THEN distingue los dos casos. El del choque no tiene escenario nuevo: lo cubre `g4` (R7).
  - **Aceptado** — S6: el ejemplo de búsqueda duplicaba «Busca fuera del repo…», y «seguir buscando» se confundía con «seguir o parar» → el ejemplo es resumir lo decidido, y el AND nombra «seguir o parar» como operativa del llamante.
  - **Aceptado** — S7: W1 y W2 juzgaban también las operativas → las excluyen, como W3.
  - **Aceptado** — S8: la cifra baja era la que se compara con el tope del Art. I → la previsión da el rango, y el techo para parar es el alto.
  - **Aceptado** — S9: faltaban en el Scope la evidencia y la fusión de la capacidad, y la nota iba como incondicional → añadidas, y la nota solo nombra las que entren.
  - **Aceptado** — S10: «Reglas de la capacidad» sin declarar, y las rondas frente al porqué → «Reglas de la capacidad — interviewing: sin cambio». La «Regla ante conflicto» vigente ya hace ganar las rondas pedidas, y entonces el porqué va en la primera.
- **Aceptado** — T3: W3 no se provocaba, y la (1) y la (3) compartían fila → una fila por sustitución, y W3 leída también en las salidas guardadas (decisión 13). La mitad de «hechos» de la (3) es el texto de Matt que se conserva: no se mide.
- **Aceptado** — T4: `p2` mezclaba tres cosas y telegrafiaba lo decidido → `p2` solo con el porqué, y `p3` con lo decidido en el roadmap.
- **Aceptado** — T7: «~50 palabras» no cuadraba → medido: 901, tabla de topes.
- **Aceptado** — T8: las referencias por número de línea a `upstream.json` → por clave; el merge con la 0313 conserva las tres entradas, y la nota va al final (decisión 10).
- **Aceptado** — T9: «`kit:notices` y `kit:build` si regeneran algo» era vago → Scope nombra `THIRD_PARTY_NOTICES.md` y `dist/THIRD_PARTY_NOTICES.md`, y pide `git status` sin nada ajeno tras `kit:build`.
- **Aceptado** — T10: «Challenge once no cambia» era una decisión del cuerpo → decisión 16.

### Decisiones tomadas con el dev-lead

- Carril feature y perfil delegate — «Arranca la 0314 con sdd-propose, carril feature» · «Perfil delegate. Al fusionar, `sdd merge --push`.»
- Leer los dos diffs antes de diseñar — «Lee git -C D:\code\github\upstream\superpowers diff v7.0.0 v7.0.2 -- skills/brainstorming/SKILL.md antes de diseñar, y contrasta con grilling de mattpocock v1.3.2»
- RED antes de cambiar; un RED limpio no se escribe — «RED antes de cambiar (Art. I) con la batería de sdd-grilling. Si el RED de una sustitución sale limpio, esa no se escribe, como en la 0297»
- La previsión cita `battery.mjs plan`; humo con N = 1 — «La previsión de coste cita la salida de node tests/headless/battery.mjs plan (suma de n y coste); para un humo, N=1»
- Las dos fuentes — «recuerda que grilling es un conjunto de cosas, no solo brainstorming, tambien grilling d ematt»
- Fuera: la entrada de `cli/src/tasks/` — «la entrada de cli/src/tasks/ en upstream.json: 0313, que corre a la vez. No toques esa entrada»
- Dos revisores de spec en paralelo — «1, adelante con los dos revisores»

## Intent

`sdd-grilling` es la forma en que pregunta todo el kit (`sdd-propose`, `sdd-init`, `sdd-explore`, `sdd-roadmap`, `sdd-config`). Partió de `brainstorming` 7.0.0 y de `grilling` de Matt, y las dos fuentes se han movido. Brainstorming 7.0.2 midió en sus escenarios dos cosas: preguntar solo lo que cambia lo que se construye baja las preguntas de relleno de 41 a 23, y pedir el porqué antes que cualquier enfoque sale en 33 de 33. El éxito tiene tres partes: cada sustitución cuyo RED falla pasa su fila en el GREEN (2 de 2, o todos los sujetos de la fila); la batería no tiene rojos nuevos frente al kit de `develop`; y `moon run kit:upstream` deja de dar rojo en `sdd-grilling`. Fracasaría, aunque funcione, si la frase nueva quedara al lado de la vieja (ADR 0022), o si, por no preguntar, el agente empezara a decidir lo que es del dev: alcance, nivel, dinero o descubrimiento (W5, R5, R8).

## Scope

- Entra, en `tests/batteries/sdd-grilling/`: las filas `p1`, `p2` y `p3`, las W1-W5 y su procedencia en `battery.md`, y el molde `salas-csv` en `subject.mjs` (el de `salas` con la fila 2 de la decisión 11 añadida a «Próximo» de su roadmap). También el RED de `p1`-`p3` (n = 2), con W3 leída además en las salidas guardadas de la decisión 13.
- Entra la evidencia, `tests/sdd-grilling-0314-red.md` y `tests/sdd-grilling-0314-green.md`, con las salidas de `red/`, `green/` y `control/` de esta carpeta; y, al cerrar, la fusión del delta en `.docs/sdd/capabilities/interviewing.md` (`sdd-archive`).
- Entra, en `upstream.json`: la entrada de superpowers de `skills/sdd-grilling/SKILL.md` pasa a `v7.0.2`, y su nota solo nombra las sustituciones que entren (decisión 10); la de mattpocock pasa a `v1.3.2`. Después, `moon run kit:notices` y `kit:build`, que cambian las dos filas de `sdd-grilling` en `THIRD_PARTY_NOTICES.md` y `dist/THIRD_PARTY_NOTICES.md`, y `dist/skills/sdd-grilling/SKILL.md` si entra alguna sustitución. Tras `kit:build`, `git status` no enseña nada ajeno a esa lista.
- Entra, si el RED lo exhibe, cada sustitución en `skills/sdd-grilling/SKILL.md`, con su texto en el Approach. Cada una lleva su requisito del delta, su GREEN (n = 2) y su fila de procedencia en la batería:
  - (1), con W2: «Grill relentlessly until nothing is left silently assumed: every assumption becomes a question or a «decided by me» entry.» (`skills/sdd-grilling/SKILL.md:12`)
  - (2), con W1: «Ask next the decision that reshapes most others; one that depends on a decision still open waits.» (`:12`)
  - (3), con W3: «Facts are your job; decisions are the user's.» (`:12`)
  - (4), con W4: «Skip what the request says or delegates, or the project shows.» (`:16`)
- Entra, si entra alguna sustitución, la batería entera con N = 1 y sus controles con el kit de `develop` (decisión 17). Si entran las cuatro, el tope de `sdd-grilling` en `cli/test/kit/word-budget.test.ts` sube a 921.
- No entra:
  - la entrada de `cli/src/tasks/` en `upstream.json` (0313);
  - el resto del diff de brainstorming 7.0.2 (tabla «Procedencia del diff»);
  - la frase «Before you propose anything, think wide privately…» (`:24`), que 7.0.2 movió a «Lay out the approaches» y que en el kit cubre «Approaches» de `spec-writing.md` de `sdd-propose`;
  - «Escena concreta» y las preguntas operativas o las paradas de los llamantes;
  - el ejemplo `85f83d3` de `kit-distribution.md:49`, que ilustra cómo se compara una `version` de commit y sigue valiendo aunque ya no quede ninguna entrada así.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Grill relentlessly until nothing is left silently assumed: every assumption becomes a question or a «decided by me» entry.» | `skills/sdd-grilling/SKILL.md:12` (y `dist/`, que regenera `kit:build`); `.docs/sdd/capabilities/interviewing.md:16`; `tests/batteries/sdd-grilling/battery.md:78` (procedencia) | Scope, si el RED lo exhibe: sustitución (1). En el delta, `REMOVED` de esa línea en «Una decisión por turno», más el requisito nuevo «Solo se pregunta lo que cambia lo que se construye». La fila de procedencia se reescribe |
| «Ask next the decision that reshapes most others; one that depends on a decision still open waits.» | `skills/sdd-grilling/SKILL.md:12`; `.docs/sdd/capabilities/interviewing.md:11-13` | Scope, si el RED lo exhibe: sustitución (2). En el delta, el GIVEN de «Una decisión por turno» fija el porqué dicho, y entra el requisito nuevo «El porqué va primero» |
| «Facts are your job; decisions are the user's.» | `skills/sdd-grilling/SKILL.md:12` | Scope, si el RED lo exhibe: sustitución (3). En el delta, el requisito nuevo «Los pasos de proceso no se preguntan» |
| «Skip what the request says or delegates, or the project shows.» | `skills/sdd-grilling/SKILL.md:16`; `.docs/sdd/capabilities/interviewing.md:80` | Scope, si el RED lo exhibe: sustitución (4). En el delta, el requisito nuevo «Lo ya decidido no se reabre». La línea 80 se queda: no pregunta lo dicho ni lo que se lee en el proyecto, y eso sigue siendo cierto |
| `version` `v7.0.0` y `note` de la entrada de superpowers de `skills/sdd-grilling/SKILL.md` | `upstream.json`; `THIRD_PARTY_NOTICES.md:49`; `dist/THIRD_PARTY_NOTICES.md` | Scope: `v7.0.2` y la nota de la decisión 10, regeneradas por `kit:notices` |
| `version` `85f83d3` de la entrada de mattpocock de `skills/sdd-grilling/SKILL.md` | `upstream.json`; `THIRD_PARTY_NOTICES.md:48`; `dist/THIRD_PARTY_NOTICES.md`; `.docs/sdd/capabilities/kit-distribution.md:49` (ejemplo) | Scope: `v1.3.2`. El ejemplo de `kit-distribution.md` se queda (No entra) |
| tope de `sdd-grilling` (`skillMd: 900, total: 900`) | `cli/test/kit/word-budget.test.ts:22` | Scope, si entran las cuatro: 921 (decisión 19) |

- Filas que implementa: la 0314, en `.docs/sdd/roadmap.md:149`; su estado lo cierra `sdd-archive`. La nombran también la 0312 (`:139`, como dueña de `sdd-grilling` en `kit:upstream`), la 0313 (`:148`) y la 0311 (`:156`, entre las que la preceden). Ninguna de esas tres cambia.

## Approach

**Sustituciones** (cada una entra solo con su RED; donde entra, la frase vieja sale entera y la nueva ocupa su sitio):

- (1) «Grill relentlessly until nothing is left silently assumed: every assumption becomes a question or a «decided by me» entry.» → «Leave nothing silently assumed: ask only what changes what gets built, its scope, level or cost, and nothing answers; the rest you fill in is a «decided by me» proposal with its reason, never what only the user knows.»
- (2) «Ask next the decision that reshapes most others; one that depends on a decision still open waits.» → «If neither they nor the project say why they want it, ask that first, open, even if you can guess. Then the decision that reshapes most others; one that depends on a decision still open waits.»
- (3) «Facts are your job; decisions are the user's.» → «Facts and process steps (writing it up, where it goes, looking further) are yours: do them and say so; decisions, the user's.»
- (4) «Skip what the request says or delegates, or the project shows.» → «Skip what the request says or delegates, what the project shows, and what was already decided: don't reopen it.»

**Procedencia del diff** (`git -C D:\code\github\upstream\superpowers diff v7.0.0 v7.0.2 -- skills/brainstorming/SKILL.md` y `git -C D:\code\github\upstream\mattpocock-skills diff 85f83d3 v1.3.2 -- skills/productivity/grilling/SKILL.md`):

| Trozo de la fuente | Destino |
| --- | --- |
| brainstorming, «Before you start implementing, you must, in order» (enfoques, documento, aprobación, plan) | ya está: pasos 4 y 5 de `sdd-propose` |
| brainstorming, «Look Before You Ask»: «Never ask what the project or their context already answers, or reopen what they've already decided.» | sustitución (4) |
| brainstorming, «Your First Message»: eco de la petición, lo que encontró, invitación a corregir | ya está: la nota de entendimiento de `sdd-propose` (paso 4) |
| brainstorming, «Your First Message» y «Get them describing»: el porqué, abierto, antes que nada | sustitución (2); lo abierto ya está en «Discovery» |
| brainstorming, la oferta de una línea para saltarse las preguntas | se descarta: `spec-writing.md`, «Never offer to skip the questions» (`tests/superpowers-700-red.md`) |
| brainstorming, «The Conversation»: preguntar solo lo que cambia lo que se construye; lo demás, propuesta con su motivo | sustitución (1) |
| brainstorming, «The Conversation»: los pasos de proceso son del agente | sustitución (3), sin «how to show something», que ya cubre la viñeta de boceto de «Shape of a question» |
| brainstorming, «How it gets made»: leer de cómo habla quién decide el cómo | se descarta: lo deciden el perfil (`control-profiles`) y «Decide for me» |
| brainstorming, «Make every question specific», socrática | se descarta en esta fila, que no la nombra; R4 (la razón del caso) y R6 (la escena) ya piden lo concreto |
| brainstorming, «Do recon» en vez de ofrecerlo | ya está: «Look it up before asking» busca sin pedir permiso |
| brainstorming, «Lay out the approaches» (con «think wide» dentro) | ya está: «Approaches» de `spec-writing.md` y `sdd-grilling:24` |
| brainstorming, «Show, don't tell»: boceto en texto | ya está: la viñeta de boceto de «Shape of a question», más completa |
| brainstorming, playback: lo rellenado va como propuesta con su motivo | ya está en «Design by sections» de `spec-writing.md`; para la entrevista, sustitución (1) |
| brainstorming, «Size the Work», documento corto o completo, dónde va, HARD-GATE, la red flag nueva | ya está: carriles, plantillas y gate de `sdd-propose` |
| mattpocock, «Word each question so "yes" accepts your recommended answer.» | ya está (decisión 7) |
| mattpocock, subagente «with a fresh context window» | ya está (decisión 8) |

## Dónde se prueba

- El porqué primero (2): batería de `sdd-grilling`, `p1`, fila W1.
- Solo lo que cambia lo que se construye (1): `p2` y `p3`, W2; su control, W5.
- Los pasos de proceso (3): `p1`-`p3` y las salidas guardadas, W3; su control, W5.
- Lo ya decidido (4): `p3`, W4.
- No regresión: la batería entera con N = 1, con control en el kit de `develop` para cada fila roja.
- `upstream.json`: `moon run kit:upstream` sin rojo en `sdd-grilling` (el de `cli/src/tasks/` sigue hasta que cierre la 0313). `moon run kit:build kit:copies kit:own kit:skill-size` sin rojos nuevos, y `git status` limpio de ajenos tras `kit:build`.

## Términos y ADR

- Términos resueltos: **paso de proceso** — escribir lo decidido, dónde va, seguir buscando. Lo hace el agente y lo dice; no es una decisión del usuario ni una pregunta operativa del llamante.
- ADR candidatas: ninguna. Aplica la ADR 0022.

## Delta de comportamiento

> Cada requisito nuevo entra solo si entra su sustitución: «El porqué va primero» es la (2), «Solo se pregunta lo que cambia lo que se construye» la (1), «Los pasos de proceso no se preguntan» la (3) y «Lo ya decidido no se reabre» la (4). En «Una decisión por turno», la línea `REMOVED` va con la (1) y el cambio del GIVEN con la (2). Lo de una sustitución con RED limpio sale con una enmienda: tras la del 2026-11-08 quedan el GIVEN y «El porqué va primero».

### Capacidad: `interviewing`

#### MODIFIED — Una decisión por turno

- GIVEN una entrevista de `sdd-grilling` con el porqué ya dicho y tres decisiones abiertas sin dependencia entre ellas (nombre del comando, formato de salida, si admite filtro)
- WHEN el agente pregunta
- THEN el turno termina con una sola decisión, la que más cambia el resto (la que reabre otras ramas va primero)
- AND si el usuario pide en la sesión «pregúntamelo todo de golpe», en esa sesión pregunta por rondas
- AND en otra entrevista, una decisión que depende de otra todavía abierta espera a que esa se cierre (enmienda 2026-10-03)

#### ADDED — El porqué va primero

- GIVEN la petición «añade un comando que exporte a CSV las reservas de una sala», sin porqué en la petición, en la fila del roadmap ni en el proyecto
- WHEN el agente hace su primera pregunta
- THEN pregunta para qué lo quiere, abierta: sin alternativas, recomendación, hipótesis ni ejemplos de respuesta, aunque pueda adivinarlo
- AND con el porqué en la petición o en la fila del roadmap («para que el responsable las cuadre los lunes en su hoja de cálculo»), no lo pregunta

#### Reglas de la capacidad — interviewing

Sin cambio. La «Regla ante conflicto» vigente hace ganar las rondas que pide el usuario en la sesión, y entonces el porqué va en la primera ronda.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `dist/skills/sdd-grilling/SKILL.md` (es la skill entera) | 840 / 900 (1.125 con el 25 % que `word-budget.test.ts` quita en la limpieza de la v3) | 60 sobre 900 | 921 si entran las cuatro: 901 medidos sobre una copia con las cuatro, más 20 (el mínimo) para la pasada de fix. Con tres o menos, sin cambio |

## Previsión de coste

Salida de `node tests/headless/battery.mjs plan` sobre una copia de `battery.md` con `p1`, `p2` y `p3`:

- `SCENARIOS="p1 p2 p3"` da «suma: 6 sujetos · coste previsto: 1.35 $ · sin precio medido: p1, p2, p3 (a 0.23 $, la media de los escenarios medidos)»;
- la batería entera con `N=1` da «suma: 19 sujetos · coste previsto: 4.28 $ · sin precio medido: p1, p2, p3 (a 0.23 $, …)»;
- `SCENARIOS="p1 p2 p3"` con `N=1` da «suma: 3 sujetos · coste previsto: 0.68 $ …».

Las filas usan esas cifras, todas al mismo precio de `plan`. Con el de `g3`, el escenario medido más parecido (0,375 $ por sujeto), la suma subiría unos 3 $.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `p1`-`p3`, n = 2: 6; W3 en las salidas guardadas, sin sujetos | 1,35 |
| GREEN | `p1`-`p3`, n = 2, solo si entra alguna sustitución: 6 | 1,35 |
| Una tanda de REFACTOR | `p1`-`p3`, n = 2: 6 | 1,35 |
| Controles | batería entera con N = 1: 19 (4,28 $), más hasta 4 filas rojas repetidas con el kit de `develop`, N = 1, a 0,23 $: 4 (0,92 $) | 5,20 |
| Medición tras la revisión final | `p1`-`p3`, N = 1: 3 | 0,68 |
| Suma | 44 | 9,93 |

El rango va de 9,93 $ (con el precio de `plan`) a ~13 $ (con el de `g3` para `p1`-`p3` y para las filas repetidas). El techo para parar (Art. I) es 13 $: si la prueba lo pasa, se para y decides tú. Si el RED sale limpio en las cuatro, la feature cuesta solo el RED (1,35 $ a ~2,25 $): sin GREEN, REFACTOR ni controles, porque el texto no cambia.

## Enmiendas

- 2026-11-08, aprobada por el dev-lead («1»: con la re-medición de la (4)) — RED de la Task 1 (`tests/sdd-grilling-0314-red.md`): entra solo la (2), con W1 en 2 de 2. La (1) (W2 0 de 4) y la (3) (W3 0 de 6, y 0 de 22 salidas guardadas) salen limpias: sus frases se quedan, salen del delta «Solo se pregunta lo que cambia lo que se construye», «Los pasos de proceso no se preguntan» y la línea `REMOVED` de «Una decisión por turno», cuyo `MODIFIED` se queda solo con el GIVEN. `p2` y `p3` quedan como regresión. El tope de palabras no cambia. La decisión 11 se corrige: el molde sí tiene un hecho que choca con «desde hoy» (las reservas solo guardan el día de la semana), y los dos sujetos de `p3` lo rebaten con razón; la (4) se re-mide con la fila 2 diciendo «por la salida estándar» en vez de «solo las reservas desde hoy», porque «¿adónde va el CSV?» es lo primero que preguntaron los 4 sujetos de `p1` y `p2` (2 sujetos, 0,38 $). Re-medida: W4 0 de 2, así que la (4) sale como la (1) y la (3), y su requisito sale del delta.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-08 | aprobada (opción «Apruebo»: con ella, el tope de 921 palabras si entran las cuatro y el techo de 13 $) |

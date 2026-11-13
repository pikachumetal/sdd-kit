# Batería de regresión — `sdd-agent-writing`

Cómo escribe un agente lo que lee otro agente: una skill nueva, una edición con el fallo que la motiva y su prueba. Nace en la feature 0151 y mide las reglas que los tickets de campo ya pagaron.

Se lanza con `node tests/headless/battery.mjs run` (`BATTERY=sdd-agent-writing`); el método, en `.docs/sdd/steering/operations.md`, «Baterías por skill». El sujeto va aislado. El molde es `tests/batteries/using-sdd/mold-salas` con `mold-skill/` encima: las skills `exportes` y `avisos` del proyecto.

**Petición por fase.** Fuera del RED, en f1, t1, b1, b2, h1, m1 y c1, `subject.mjs` antepone «Invoca la skill sdd-kit:sdd-agent-writing y »; p1, p2 y e1 miden la puerta y van siempre sin nombrarla. `p2` corre sin la carpeta `.claude/skills/` del molde.

**Dos veredictos.** `battery.mjs run` da el de la puerta. El de la conducta sale de la rúbrica, leyendo `state.txt`, `texts.txt` y lo que deja el sujeto.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| p1 | gate | Quiero una skill para las migraciones SQL: al equipo se le olvida el rollback y probarlas contra una copia de la base. Es SQLite, en `salas.db`: la copia es copiar ese fichero, y se aplican con `node db/migrate.js up` y `down`. Escríbela en `.claude/skills/` y deja las dudas para después. | skill | `sdd-kit:sdd-agent-writing` | 2 | 2/2 | sonnet | propuesta 0131: puerta «quiero una skill para las migraciones SQL» |
| f1 | form | En las tres últimas exportaciones de la skill `exportes` (.claude/skills/exportes/) el informe ha salido bien salvo que falta la línea de la zona horaria (`Zona horaria: Europe/Madrid`). Corrígelo. Es solo la skill del proyecto: no abras feature ni patch, edítala y ya. | skill | `sdd-kit:sdd-agent-writing` | 1 | 1/1 | sonnet | ticket de la 0173 §2: dos rondas en prosa de un elemento omitido |
| t1 | placement | En la skill `exportes` (.claude/skills/exportes/) añade dos cosas: antes de exportar hay que comprobar que el mes está cerrado con `node src/closed.js <mes>` y, si no lo está, no exportar; y al terminar, pasarle el trabajo a la skill `avisos` para que avise a la persona responsable. Es solo la skill del proyecto: no abras feature ni patch, edítala y ya. | skill | `sdd-kit:sdd-agent-writing` | 2 | 2/2 | sonnet | tickets de la 0146 §2, 0147 §4 y 0185 §1: regla lejos de su paso y traspaso de una línea |
| b1 | test-forecast | Vamos a probar una edición de la skill `exportes` con sujetos: tres escenarios, RED con n = 1 y GREEN con n = 2, a 0,5 $ por sujeto. Escribe la previsión de coste de la campaña en `prevision.md`. No abras feature ni patch. | skill | `sdd-kit:sdd-agent-writing` | 2 | 2/2 | sonnet | tickets de la 0074 §2, 0098 §2, 0113 §3 y 0149 §1: la previsión se queda corta |
| b2 | test-verdict | Al probar una edición del paso 3 de la skill `exportes` con sujetos: e1 y e2, que miden ese paso, salen verdes; e9, que mide el paso 1 que no he tocado, sale rojo (1 sujeto). Además, el baseline de otra regla, la de escribir el informe en el idioma de la petición, salió 2/2 limpio con n = 2. Decide qué hago con e9 y con esa regla, y déjalo en `decision.md`. No abras feature ni patch. | skill | `sdd-kit:sdd-agent-writing` | 1 | 1/1 | sonnet | tickets de la 0175 §2 y 0146 §1 |
| h1 | fork-clash | La skill `avisos` (.claude/skills/avisos/) es un fork de una skill externa. Devuélvele esta frase de su fuente, que se quitó sin motivo: «A running notification never waits on a human: decide and go on.» Es solo la skill del proyecto: no abras feature ni patch, edítala y ya. | skill | `sdd-kit:sdd-agent-writing` | 1 | 1/1 | sonnet | ticket de la 0175 §1: el texto devuelto chocó con una parada |
| m1 | message-form | En la skill `exportes` (.claude/skills/exportes/) el paso 1, si falta la sala, tiene que preguntarla con la skill `sdd-grilling`, y esa pregunta tiene que abrir con la línea `Exportación: <mes>`. Escríbelo. Es solo la skill del proyecto: no abras feature ni patch, edítala y ya. | skill | `sdd-kit:sdd-agent-writing` | 1 | 1/1 | sonnet | ticket de la 0160 §1: la forma de un mensaje que estructura otra skill |
| c1 | precheck | Voy a medir con sujetos una excepción del paso 1 de `exportes`: «con una sola sala en `src/rooms.json`, no preguntes cuál». El escenario pide «exporta marzo», sobre un molde con dos salas, y la rúbrica falla si el sujeto pregunta la sala. Comprueba el escenario antes de lanzarlo y deja en `check.md` si lo lanzo o qué cambio. No abras feature ni patch. | skill | `sdd-kit:sdd-agent-writing` | 1 | 1/1 | sonnet | tickets 0077 §3, 0036 §1, 0080 §1 y 0156 §4: el molde no deja ver el disparador |
| e1 | control | Añade a la skill `exportes` un paso que compruebe que el mes está cerrado antes de exportar. | skill | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | Review Focus de la 0151: la puerta nueva solo cubre crear |
| p2 | gate-no-dir | Quiero una skill para las migraciones SQL: al equipo se le olvida el rollback y probarlas contra una copia de la base. Es SQLite, en `salas.db`: la copia es copiar ese fichero, y se aplican con `node db/migrate.js up` y `down`. Deja las dudas para después. | skill | `sdd-kit:sdd-agent-writing` | 1 | 1/1 | sonnet | Review Focus de la 0151: sin `.claude/skills/`, la crea allí y no toca `skills/` |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| R1 Prueba | p1 | da la skill por hecha sin haber lanzado ni dejado escrito ningún escenario que la pruebe |
| R2 Description | p1 | la `description` resume el proceso de la skill en vez de decir solo cuándo usarla |
| R3 Forma | f1 | el arreglo es solo prosa en `SKILL.md`, sin hueco obligatorio en `report-template.md` |
| R4 Paso | t1 | la comprobación del mes se escribe solo en `references/`, fuera del paso que la dispara |
| R5 Traspaso | t1 | el traspaso a `avisos` es una línea sin decir que es lo primero del paso ni prohibir seguir desde él |
| R6 Partida | b1 | la previsión no lleva partida para los controles y la pasada de fix tras la revisión final, o no cuenta ninguna tanda de REFACTOR |
| R7 Contraste | b2 | decide reescribir o dar e9 por bueno sin contrastarlo con el kit de la base |
| R8 Repetir | b2 | saca la regla de idioma sin repetir antes el baseline |
| R12 Sitio | p2 | escribe la skill fuera de `.claude/skills/<nombre>/` |
| R9 Choque | h1 | devuelve la frase sin acotarla ni avisar de que contradice el paso que para y pregunta |
| R10 Mensaje | m1 | la línea `Exportación: <mes>` no se escribe en el paso que invoca `sdd-grilling` o no nombra ese mensaje |
| R11 Disparador | c1 | da el escenario por bueno, sin ver que dos salas no disparan la excepción de una sola |

## Procedencia de las reglas

| Regla | Fuente | Fallo o motivo |
| --- | --- | --- |
| Texto de estilo de `SKILL.md` | `writing-for-agents` de `mattpocock/skills`, entra | texto de la fuente (ADR 0013) |
| Invocación, forma y prueba de `skill-mechanics.md` | `SKILL-MECHANICS.md` y `writing-skills/SKILL.md`, entran | texto de la fuente; controles f1 y h1 |
| Descubrimiento, diagramas, refuerzo y persuasión: `discovery.md`, `flowcharts.md`, `bulletproofing.md` y `persuasion-principles.md` | `writing-skills/references/` de superpowers, entran fichero a fichero, tras un puntero de `skill-mechanics.md` como en la fuente | texto de la fuente; controles f1, h1 y c1 |
| Sujetos de `skill-testing.md` | `writing-skills/references/testing-skills-with-subagents.md`, entra | texto de la fuente; controles b2 y c1 |
| Rutas de plataforma, `render-graphs.js`, `graphviz-conventions.dot`, `CLAUDE_MD_TESTING.md` y «Discovery Workflow» | se descartan | el kit trabaja distinto: solo plugin de Claude Code, sin esas herramientas |
| `anthropic-best-practices.md` | se descarta | documentación oficial, no texto de la skill; queda su puntero (decisión 2 de la spec) |
| «TDD Mapping» de `writing-skills` | sigue en `skill-mechanics.md` | texto de la fuente |
| Una skill no está hecha sin un escenario | del kit | p1, RED: 0 de 2 lo dejaron |
| Forma del traspaso | del kit | t1, R5: RED 2 de 2 en una línea; 0147 |
| Partidas de la previsión | del kit | b1, R6: RED 2 de 2 en 4,50 $ |

---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261011-182122-feature-0165-tdd-and-debugging
task: 0165
mode: full
date: 2026-10-11
---

# Ticket para el kit — feature 0165: forks delgados `sdd-tdd` y `sdd-debugging`

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling` (sin preguntas: perfil delegado), `sdd-rubber-duck`, `sdd-start-feature`, `sdd-implement`, `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans` y `test-driven-development` (las dos primeras se cargaron antes de que la 0168 llegara a la rama)
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (revisor final) y Sonnet (27 sujetos headless)
- Coste en reloj: ~2 h de implementación frente a 3,5 h estimadas; ~1,5 h antes, de spec y plan, con un corte de luz a mitad
- Coste en tokens: hilo 98.868.919, subagentes 3.360.911; sesión 31,31 $ más 7,38 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un dato falso de un ticket llegó por el triaje a una fila «Actuar → 0165» y paró la feature

- **Qué pasó**: el ticket de la feature 0168 decía «superpowers 7.0.0 contra 7.1.0». La 7.1.0 no existe: la última versión publicada es la v7.0.0, y la 0168 comparó en realidad la 6.4.2 con la 7.0.0. El triaje lo copió a una fila de deuda con destino «Actuar → 0165», que llegó a la base a mitad de la feature. Disparó el freno de alcance, y el dev-lead tuvo que preguntar «¿de dónde sale el 7.1.0?» antes de decidir.
- **Dónde en el kit**: `skills/sdd-feedback/SKILL.md`, regla «Cada propuesta dice si está verificada», que el ticket de la 0168 marcó como verificada; `skills/sdd-roadmap/SKILL.md`, el triaje de tickets de campo.
- **Por qué el kit no lo evitó**: `sdd-feedback` pide verificar la propuesta, pero no los datos del «Qué pasó» (versiones, recuentos, nombres). El triaje copia la evidencia del ticket sin contrastarla con su fuente, la spec o el walkthrough de la feature.
- **Coste**: una parada del dev-lead con una pregunta que se rechazó para aclarar (la sesión, tras la Task 4), ~10 min, y la corrección de la fila (`.docs/sdd/roadmap.md`, fila «Traer las mejoras…»).
- **Propuesta**: en el triaje de `sdd-roadmap`, antes de escribir una fila «Actuar», contrastar cada versión o cifra del ticket con la spec o el walkthrough que cita. En `sdd-feedback`, una línea: los datos del «Qué pasó» salen de un fichero o un comando de la sesión, citado.
- **Verificada**: sí — contrastado con `gh release list -R obra/superpowers` (última v7.0.0) y con la decisión 2 de la spec de la 0168 («Base y aviso: superpowers 7.0.0… idéntica en la 6.4.2»).
- **Criterio de aceptación**: GIVEN un ticket cuyo «Qué pasó» cita una versión que su spec contradice, WHEN `sdd-roadmap` lo tría, THEN la fila no nace con esa versión y el triaje lo señala.

### 2. El repaso de coherencia de la spec no listó todos los sitios que nombraban la skill sustituida

- **Qué pasó**: la spec listaba los ficheros que invocaban `superpowers:systematic-debugging`, pero se dejó `sdd-start-feature` («Trabajo descubierto fuera de scope»), que salía en el `grep` de la propuesta, y `sdd-propose`, que se añadió en el repaso. Además, la decisión 8 mandaba la salida de `sdd-explore` a `sdd-propose`, contra el paso 5 de la propia skill. Hicieron falta dos rulings en la Task 4, y la revisión final lo marcó como Important (la `description` de `sdd-explore` frente al escenario `f1`).
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4, «Coherence pass»: «For each `MODIFIED` in the delta, search outside the spec, in the code or in the texts that apply it…».
- **Por qué el kit no lo evitó**: el repaso busca las aplicaciones de cada `MODIFIED` del delta. Retirar una dependencia, sea una skill, un verbo o un nombre, no es un `MODIFIED` de ninguna capacidad, y no hay un paso que pida listar cada coincidencia del `grep` en el Scope con su línea vecina leída.
- **Coste**: dos rulings, un Important de la revisión final y su arreglo con test (`walkthrough.md` §3; `tasks.md`, «Rulings»), ~20 min.
- **Propuesta**: en el repaso de coherencia, una frase: «If the change removes or renames something other files name, list every `grep` hit in the Scope, and read the step around each one: an exit that sends somewhere else must agree with the rest of that skill».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec que retira la invocación de una skill nombrada en cinco ficheros, WHEN se hace el repaso de coherencia, THEN el Scope lista los cinco y ninguna salida reescrita contradice el paso que la rodea.

### 3. Los topes de palabras obligaron a recortar texto ajeno a la feature, tres veces

- **Qué pasó**: los cambios dejaron `sdd-implement` en 9.034 de 9.000 palabras, y también se pasaron `architecture.md` (1.921 de 1.900) y `tech-stack.md` (18.812 de 18.700). Para no subir los topes, que solo sube el dev-lead, se recortaron una nota de procedencia, una fila de racionalización, «en forma exec» de la línea de `hooks/` y un aprendizaje de `tech-stack.md`. La revisión final marcó dos de esos recortes (Important 6 y un Minor).
- **Dónde en el kit**: `tests/WordBudget.Tests.ps1` y la constitution, Art. I («Los topes de palabras… solo suben por decisión del dev-lead escrita en la spec»); `skills/sdd-propose/SKILL.md` paso 4, que no pide estimar el delta de palabras.
- **Por qué el kit no lo evitó**: la spec fijó topes solo para las skills nuevas (decisión 11). Nada pide prever cuánto crecen las skills y los documentos que se editan, que ya estaban casi en su tope.
- **Coste**: ~25 min en tres rondas de recorte (ledger: rulings de las Tasks 2 y 5 y «Final»), y dos hallazgos de la revisión final.
- **Propuesta**: en la previsión de coste del Art. I, una línea por skill o documento de anclaje que la spec edita, con su margen actual y el crecimiento previsto, y la pregunta del tope en el gate si el margen no llega.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec que añade ~40 palabras a una skill a 7 de su tope, WHEN se presenta en el gate, THEN las decisiones nombran el margen y piden subir el tope o recortar, antes de implementar.

### 4. Una regla nueva entró en una ronda de REFACTOR y se commiteó antes de pedir la aprobación del desvío

- **Qué pasó**: el humo `d1` falló (la causa se escribía después del arreglo). En dos rondas de REFACTOR añadí a `sdd-debugging` una regla que cambiaba un requisito de la spec: un AND nuevo. La commiteé en la Task 4 y pedí la aprobación en la Task 5.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings»: «Deviation: a change to the approved spec… stop… leave uncommitted the correction… and wait for approval».
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. El RED/GREEN/REFACTOR del Art. I se vive como parte de la task, y nada dice que una guía nueva nacida en el REFACTOR sea un desvío si toca un requisito.
- **Coste**: una aprobación a posteriori del dev-lead (`spec.md`, «Enmiendas»: «Commiteado en la Task 4 antes de pedir la aprobación»).
- **Propuesta**: en «Deviations and rulings», un caso más: «A REFACTOR round that writes guidance the spec doesn't have is a deviation when it adds or changes a THEN: stop before committing it».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un humo que falla y un REFACTOR que añade un AND a un requisito, WHEN el hilo lo escribe, THEN para con 🦆 y ✋ antes de commitearlo.

## Lo que hice por iniciativa propia

- **Antes de aprobar la spec, el dev-lead pidió hacer de abogado del diablo y comprobar en la web cómo trabajan otros kits** (spec-kit, Kiro, OpenSpec, cc-sdd, BMAD y las buenas prácticas de Claude Code). La spec pasó de un fork completo (~6.000 palabras) a uno delgado (~1.400 en los dos `SKILL.md`), con un A/B y un experimento nuevo. Dos datos que yo había dado de memoria eran falsos, y la comprobación los corrigió. Candidato a regla: en una feature que copia o sustituye una fuente, contrastar con fuentes vivas antes de la spec.
- **Un baseline del humo antes de corregir un fallo de GREEN**: cuando `d1` falló, lancé el mismo escenario con el kit anterior. Salió que el fallo ya existía (1/2) y que la skill de superpowers ni se invocaba (0/2), lo que cambió la lectura: el fork mejora la invocación y el orden era deuda vieja.
- **Las tandas superadas de un escenario se archivan en `green-r0/`** de la carpeta de la spec, en vez de borrarse, para que la evidencia de cada ronda de REFACTOR se pueda abrir.

## Funcionó, no tocar

- La regla del Art. I «no se escribe guía sin RED que falle»: cuatro piezas planificadas no entraron porque su RED salió limpio, y eso ahorró ~28 $ de la previsión.
- El A/B puntual ante una duda concreta: decidió entre un paso literal y cargar una skill con 4 sujetos.
- El freno de alcance por la base movida, las dos veces: cada parada fue una pregunta corta con la recomendación primero.
- La revisión final en Opus con el Review Focus literal: encontró que un RED recibido que ya pasa se habría implementado sin aviso, que era la primera línea del Review Focus.

## Menores

- La sesión volvió del corte de luz sin `./Start-KitSession.ps1` y cargó las skills desde la caché; leí las de la rama a mano — `CLAUDE.md`, regla 1.
- La puerta de `battery.sh` da rojo en `t1b` porque su «Esperado» es `ninguna` y el sujeto carga `sdd-tdd` a propósito; la columna no admite «cualquiera» — `tests/headless/battery.mjs`.
- En el RED de `d1` (kit de `develop`), `sdd-propose` preguntó el carril aunque la petición decía «patch:»; en 7 tandas GREEN no lo hizo — `skills/sdd-propose/SKILL.md` paso 2, «Lane in the request».

## Adenda — 2026-10-11, tras el cierre

### 5. El fork se adelgazó sin prueba, y el kit lo permitía

- **Qué pasó**: `sdd-tdd` y `sdd-debugging` se hicieron «delgados»: fuera las 11 racionalizaciones de TDD y las 8 de depuración, 8 de 13 red flags, ejemplos, checklist y «When Stuck», marcados en el anexo como «No-op». El motivo fue el Principio 1 y la regla de no-ops de `writing-for-agents`, y el RED no los vio fallar. Pero el RED no metía presión, y esas tablas existen para la presión. El dev-lead no dio la feature por acabada: «se quita si se ve claramente que funciona bien sin ello, no puede ser que lo quites porque creas que no… No adelgacemos porque sí». El A/B de presión (`p1`-`p3`, 12 sujetos) salió limpio en las dos versiones: no habría distinguido.
- **Dónde en el kit**: constitution, Principio 1 y Art. IX; `skills/sdd-propose/SKILL.md` paso 4 (la spec del fork); `.agents/skills/writing-for-agents/` (no-ops).
- **Por qué el kit no lo evitó**: el Art. I pedía RED para añadir guía, pero no un A/B para quitar texto copiado. El Principio 1 empujaba a quitar todo lo que no nombrara un fallo del kit, y la evidencia de la fuente no contaba.
- **Coste**: A/B 2,97 $, rehacer las dos skills desde la fuente, re-revisión opus (3 Important), humo final 1,40 $ y ~1,5 h, más la alarma del dev-lead (`walkthrough.md` §6, `spec.md` «Enmiendas»).
- **Propuesta**: hecha en la misma adenda. Art. IX y [ADR 0013](../decisions/0013-fork-keeps-source-text.md): un fork conserva el texto de su fuente salvo donde el kit trabaja distinto, lo amplía o trae algo de otro kit; la evidencia de la fuente vale para el Principio 1, y quitar sin esos motivos exige un A/B. Queda la idea B18 (adelgazar con A/B) y, en la 0152, revisar la 0168 (tres piezas ya recuperadas en el patch 0172).
- **Verificada**: sí — re-revisión opus del tramo, con `diff` contra superpowers 7.0.0, y el humo `d1` 2/2.
- **Criterio de aceptación**: GIVEN la spec de un fork cuyo anexo marca una pieza de la fuente como «No-op» sin motivo ni A/B, WHEN pasa la revisión de la spec o la final, THEN es un hallazgo Important.

### Menores de la adenda

- Un commit WIP intermedio salió con `--no-verify`; se juntó después en uno con el pre-commit en verde — `CLAUDE.md` del dev-lead (nunca saltar hooks), sin regla del kit para el hilo.
- `sdd roadmap publish` se negó a publicar porque `develop` había cambiado desde la base, y eso evitó pisar el triaje que otra sesión había hecho de este ticket. Funcionó.

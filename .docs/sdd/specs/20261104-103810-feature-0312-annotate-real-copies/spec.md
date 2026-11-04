---
id: 20261104-103810-feature-0312-annotate-real-copies
feature: 0312
parent: 0302
proposal: 0301
title: Las copias del kit, anotadas contra su fuente y subidas a su último tag
mode: full
profile: delegate
status: approved
created: 2026-11-04
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-04
---

# Spec — Las copias del kit, anotadas contra su fuente y subidas a su último tag

🦆 Hoy las seis skills que el kit copió de superpowers y de mattpocock no dicen qué frase es de la fuente y cuál puso el kit, y la maquinaria de la 0302 no las mira: todas llevan `pending: "0312"`. Con esta feature, cada fichero copiado pasa a ser el original de su fuente, con sus mismos saltos de línea, más los bloques del kit marcados, y `moon run kit:copies` lo compara con el original línea a línea. Por ejemplo, el añadido «(the task's «Verificación»)» de `sdd-tdd`, en la lista que dice «Every new function/method has a test», sale como `skills/sdd-tdd/SKILL.md:<línea>: añadido del kit sin sustituye en un párrafo con una absoluta del original («every») → 0307`. Después, cada copia sube a la última versión de su fuente con `kit:copies-update`, y `kit:upstream` deja de dar rojo en ellas. La versión de la fuente sale del texto de las skills («superpowers 7.0.0») y vive solo en `upstream.json` y en los `NOTICE`.

Validación: agente — el proyecto valida en campo (`validation.mode: field`). Lo que entrega se ve en la salida de `kit:copies`, `kit:upstream` y `cli:test`; el texto que lee el agente cambia en `sdd-agent-writing`, y eso lo mide el humo de su batería.

## Capacidades

- Modificadas: `kit-distribution` — `kit:copies-update` sigue un original que la fuente renombra; un test da rojo si el texto de una skill escribe la versión de una fuente; sus «Reglas de la capacidad» cambian «Dónde viven los datos», «Límites» y «Avisos».

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec hecha: dos revisores en paralelo, pedidos por el dev-lead (2026-11-04), aunque la rúbrica daba ninguna — señales: MODIFIED (el requisito «Actualizar una copia es fusionarla con git merge-file») · tamaño: ~3.000 líneas en ~35 ficheros, casi todas el cambio de forma de línea de las copias, que comprueba kit:copies
- Dominio (Opus, effort medium): si la spec cumple la ADR 0022 y la propuesta 0301, y qué cambia en lo que lee el agente con el reparto de sdd-agent-writing (decisiones 8 y 12)
- Técnica (Sonnet, effort medium): si el ADDED y el MODIFIED se pueden verificar con el código de tests/copies/, y qué pide kit:copies entre una task y otra
```

### Hallazgos de la review

- **Aceptado** — Crítico (dominio 1, técnica 1): las decisiones 6 y 8 chocaban. `discovery.md`, `flowcharts.md`, `bulletproofing.md` y `persuasion-principles.md` en `references/` no existen en v7.0.0, y la subida no reparte un original partido → decisión 6: `skill-mechanics.md` y `skill-testing.md` se anotan en v7.0.0 y se suben con la orden. Los cuatro ficheros nuevos se anotan directamente en v7.0.2, con los bloques que la fusión saca de `skill-mechanics.md`. El Intent dice ahora qué es a mano.
- **Aceptado** — Crítico (dominio 2): faltaba qué pasa con lo que los ficheros nuevos no conservan hoy → decisión 8: lista medida, línea a línea, con su destino. Lo que entra es texto nuevo de la 7.0.2; lo que se quita es lo que el kit ya quita hoy, más un puntero a un fichero que el kit no copia.
- **Aceptado** — Crítico (técnica 2): faltaba `sdd-archive/SKILL.md:10` → son trece sitios, sacados con el patrón del test (decisión 3).
- **Aceptado** — Crítico (dominio 3) e Importante (técnica 3 y 4): el patrón no estaba fijado, y un original o una migración podían dar rojo → decisión 3 y delta: patrón exacto, solo `.md` de `skills/` y fuera `migrations/`. Medido: da los trece sitios del kit y ninguno en los originales v7.0.2 de las copias ni en `migrations/`.
- **Aceptado** — Importante (técnica 5): faltaba el comando del renombrado → decisión 7 y delta: `git diff --name-status -M --diff-filter=R` entre los dos tags, sin limitar rutas. Con menos del 50 % de parecido, git no lo da como renombrado, y sigue el «no existe».
- **Aceptado** — Importante (técnica 6): un `from` renombrado no lo sigue nadie → «No entra», con el único caso de esta feature (decisión 6).
- **Aceptado** — Importante (técnica 7): `notCopied` es de la fuente, no de cada versión → decisión 10: va en `sources.<fuente>.notCopied`, con las rutas de v7.0.0 mientras las copias están en v7.0.0, y lo que espera `kit:copies` tras cada task (decisión 13).
- **Aceptado** — Importante (dominio 4): «Límites» cambia y no estaba → delta: el patrón de versión va a «Límites»; se corrige la línea de «Capacidades». **Rechazado** escribir «sin cambio» en las otras tres reglas: la plantilla pide solo las que cambian, y la fusión sustituye entera la regla que aparece.
- **Aceptado** — Importante (dominio 5, 6 y 7): la previsión no listaba cada skill editada con su motivo, ni los minutos, ni el texto de la 7.0.2 que entra → Previsión de coste: una fila por skill y por pieza de la 7.0.2, minutos y umbral de parada; decisión 12: qué se hace con una contradicción.
- **Aceptado** — Importante (dominio 8): faltaba cuánto conserva cada fichero tras el reparto → decisión 8: lo previsto, y si uno baja del 50 %, paro por desvío.
- **Aceptado** — Importante (dominio 9): Wondel podía tener un tag nuevo → comprobado con `git fetch --tags` el 2026-11-04: los últimos son superpowers v7.0.2, mattpocock/skills v1.3.2 y wondelai/skills v1.8.0 (decisión 6).
- **Aceptado** — Menor (dominio 10): la decisión 4 nombra la única cabecera que se mueve, `sdd-worktrees/SKILL.md:10`.
- **Aceptado** — Menor (técnica 8): comprobado con `sdd capability merge`: queda una sola línea «no se toca».
- **Aceptado** — Menor (técnica 9 y 10): el orden de las tasks, `kit:notices` tras cada cambio del registro y la batería antes del humo → decisión 13.

1. **Se parte del borrador de la 0302, con su fallo corregido.** El borrador (`real-copies/annotate-draft.mjs` de la 0302) cerraba el bloque de la cabecera del kit con `fin` y se comía la línea en blanco de detrás, así que la cabecera quedaba en el párrafo siguiente de la fuente. Por eso daba el rojo de «añadido junto a una absoluta» en cinco de las seis skills. Medido en `sdd-debugging`: con el bloque acabando en la línea en blanco, sin `fin`, da 0 rojos y la salida es la de hoy palabra a palabra. El borrador se copia a la carpeta de esta spec y se arregla allí; el resultado de cada fichero se revisa a mano antes de commitearlo.
2. **La tarea de cada bloque existente es `0312`.** Un bloque dice qué tarea lo puso, pero el origen de las frases del kit de hoy no se recupera con `git blame`: lo tapan las traducciones y las reescrituras de párrafo. `0312` dice quién lo anotó; un bloque nuevo, desde aquí, lleva su tarea.
3. **La versión de la fuente sale del texto, y un test lo vigila.** Del ticket de la 0300 §2, las dos opciones eran sacarla o compararla en un test. La saco, porque así la versión vive en un solo sitio (`upstream.json`, y de él el `NOTICE`), y el test nuevo («La versión de una fuente no se escribe en el texto de una skill», en el delta) da rojo si vuelve.
   - El test mira cada `.md` de `skills/` salvo `skills/sdd-upgrade/references/migrations/`, que es historia, y salta las líneas de marca. Su patrón es la clave o el `repo` de una fuente de `upstream.json`, una comilla invertida opcional, espacios y `v?N.N[.N…]`: `` (<clave>|<repo>)`?\s+v?\d+(\.\d+)+ ``.
   - Medido con ese patrón el 2026-11-04, salen trece sitios, no siete. Además de los siete del ticket: `sdd-worktrees/SKILL.md:10`, `sdd-parallel-agents/SKILL.md:10`, `sdd-verify/SKILL.md:10`, `sdd-agent-writing/references/skill-mechanics.md:3`, `sdd-implement/SKILL.md:10` y `sdd-archive/SKILL.md:10`. No sale ninguno en los originales v7.0.2 y v1.3.2 de las copias, ni en `migrations/` («superpowers.** Desde la v2.0.0» de `v2.0.0.md:46` no casa).
   - En `sdd-implement` (0296), `sdd-archive` (0305) y `spec-writing.md` y `plan-writing.md` (0306) se quita solo la palabra de la versión en su atribución, porque si no el test nace en rojo.
   - Ejemplo: «Forked from `test-driven-development` of superpowers 7.0.0 (MIT, see `NOTICE`)» pasa a «Forked from `test-driven-development` of superpowers (MIT, see `NOTICE`)».
4. **La cabecera del kit va en su propio párrafo solo en `sdd-worktrees/SKILL.md:10`**, la única pegada a un párrafo de la fuente con una absoluta («Fall back to manual git worktrees only when…»). Las de `sdd-tdd:10` y `sdd-verify:10` están pegadas a un párrafo sin absoluta y se quedan donde están; las demás ya van solas. Es la frase de atribución del kit, que esta feature ya edita por la decisión 3, y no una regla: separarla no arregla ninguna frase de la fuente. Separarla es el esquive con una línea en blanco que la propuesta 0301 da como límite, y por eso queda nombrada aquí para la revisión final.
5. **Los rojos que quedan llevan `arregla: <fila>`.** En `sdd-tdd` y `sdd-verify`, `arregla: 0307`. Si sale uno en una skill sin fila (`sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents`, `sdd-agent-writing`), se abre su fila de deuda en el roadmap con el id de `sdd id next` y la marca la nombra. Ya conocido: el añadido «(the task's «Verificación»)» de la lista de comprobación de `sdd-tdd`, junto a «Every new function/method has a test» → 0307.
6. **Primero se anota contra la versión del registro, y después se sube.** Cada copia se anota contra el original del que salió (superpowers v7.0.0, `writing-for-agents` de mattpocock v1.3.1, los fragmentos de Wondel v1.8.0). Después se suben con `moon run kit:copies-update -- superpowers v7.0.2` y `-- mattpocock/skills v1.3.2`. Son los últimos tags, comprobados con `git fetch --tags` el 2026-11-04; Wondel sigue en v1.8.0, su último. Así la subida es uso real de la orden de la 0302, y cada cambio de texto de una fuente entra por `git merge-file`, no a mano.
   - En `test-driven-development`, `systematic-debugging`, `using-git-worktrees`, `dispatching-parallel-agents`, `verification-before-completion`, `requesting-code-review` y `writing-for-agents`, el texto copiado no cambia entre las dos versiones (comprobado con `git diff --stat`), y la fusión solo cambia la versión del registro.
   - `skill-testing.md` sube con el renombrado de la decisión 7. `skill-mechanics.md` sube con `git merge-file`, que le quita las secciones que la 7.0.2 saca de `SKILL.md`; donde había un bloque del kit, sale un conflicto.
   - Lo único a mano es el reparto que la orden no hace. Los cuatro ficheros que la 7.0.2 añade se anotan directamente contra v7.0.2, con los bloques del kit que salen de esos conflictos y de las secciones quitadas. Es el mismo caso que el B5 de la 0302, la sección que la 7.0.1 llevó a `references/fix-loop.md`.
   - El `from` de `skill-testing.md` a `persuasion-principles.md` (v7.0.0, en la raíz de `writing-skills/`) se queda viejo con la subida, porque la orden no sigue un `from` renombrado. Desaparece en el reparto, al pasar ese fichero a copia.
7. **`kit:copies-update` sigue un original que la fuente renombra.** superpowers v7.0.2 mueve `skills/writing-skills/testing-skills-with-subagents.md` a `references/testing-skills-with-subagents.md` y cambia 2 de sus líneas (`R097`). Hoy la orden diría «no existe en v7.0.2: mapéalo antes de actualizar», pero no hay forma de mapearlo, porque lee el original viejo y el nuevo en la misma ruta. Con el cambio:
   - si el original no existe en el tag nuevo, la orden mira `git diff --name-status -M --diff-filter=R <vieja> <nueva>`, sin limitar rutas, porque con la ruta vieja sola git lo da como borrado;
   - si una línea `R<n>\t<ruta>\t<ruta nueva>` nombra su original, fusiona con el original nuevo en su ruta nueva, cambia su `paths` y lo dice: `<kit>: su original <ruta> pasa a <ruta nueva> en <tag>`;
   - con menos del 50 % de parecido, el umbral de git, no hay `R` y sigue el «no existe… mapéalo»;
   - un `from` renombrado no se sigue (decisión 6).
8. **`sdd-agent-writing` sigue el reparto de `writing-skills` de v7.0.2, fichero a fichero.** La 7.0.2 saca de `writing-skills/SKILL.md` tres partes a `references/discovery.md` (la estructura de `SKILL.md` y la optimización del descubrimiento), `references/flowcharts.md` y `references/bulletproofing.md`. Medido con frases de 6 palabras:
   - `skill-mechanics.md` conserva hoy el 35 % del `SKILL.md` nuevo: por debajo del 50 % sería propia. Conserva el 95 % de `discovery.md`, el 67 % de `flowcharts.md` y el 88 % de `bulletproofing.md`.
   - `skill-testing.md` conserva el 95 % de `testing-skills-with-subagents.md`, el 48 % de `SKILL.md`, por las secciones de prueba que el kit llevó allí, y el 99 % de `persuasion-principles.md`, que el registro de hoy no nombra.

   Quedan así, cada fichero copia de uno de la fuente en v7.0.2:
   - `references/skill-mechanics.md`, de `SKILL.md`, con las secciones de prueba que hoy están en `skill-testing.md` («The Iron Law», «Testing All Skill Types», «Common Rationalizations for Skipping Testing», «RED-GREEN-REFACTOR for Skills», «STOP», «Skill Creation Checklist»), en el sitio donde las pone la fuente. Sus enlaces a `references/x.md` pasan a `x.md`, porque el fichero ya está en `references/`, y el de `testing-skills-with-subagents.md`, a `skill-testing.md`.
   - `references/discovery.md`, `references/flowcharts.md`, `references/bulletproofing.md` y `references/persuasion-principles.md`, cuatro copias nuevas con el nombre de la fuente y los bloques del kit que hoy tienen esas secciones. Así, «See persuasion-principles.md in this directory» de la fuente vuelve a valer, y sale la sustitución del kit que lo apuntaba a `skill-testing.md`.
   - `references/skill-testing.md`, de `references/testing-skills-with-subagents.md`, sin `from`.

   `skill-mechanics.md` y `skill-testing.md` conservan su nombre, porque los nombran `SKILL.md:14` y `:69`. Lo que lee el agente no pierde texto: lo que sale de un fichero entra en otro, y `kit:copies` da rojo con cada línea de un original que falte sin marca. Cambia dónde está: el detalle de la `description` pasa detrás de un puntero, como en la fuente, y por eso lleva humo (decisión 11). La alternativa era dejar los dos ficheros como están, con el original que más aporta de base y el resto en bloques `de:`. La descarto: `git merge-file` no fusiona los fragmentos de un `from`, y A+C no los mira, así que cada versión nueva de `writing-skills` se subiría a mano.

   Lo que los cuatro ficheros nuevos no conservan hoy, medido línea a línea contra `skill-mechanics.md` y `SKILL.md` v7.0.0, y su destino:
   - **Entra, texto nuevo de la 7.0.2** (decisión 12): los títulos (`# Flowcharts in Skills`, `# Bulletproofing Skills Against Rationalization`, `# Writing SKILL.md for Discovery`), sus líneas «Part of superpowers:writing-skills…» y, en `discovery.md`, «**NEVER summarize the skill's process or workflow**…». En `bulletproofing.md`, «**Psychology note:** … See persuasion-principles.md in this directory…» entra tal cual: con `persuasion-principles.md` como fichero, el puntero de la fuente vale, y sale la sustitución del kit que lo llevaba a `skill-testing.md`.
   - **Sigue sustituido, como hoy**: los ejemplos «**REQUIRED SUB-SKILL:** Use superpowers:test-driven-development» y «**REQUIRED BACKGROUND:** … superpowers:systematic-debugging» de `discovery.md`, y «(see Testing section below)» de `bulletproofing.md`. Las líneas «Part of superpowers:writing-skills» reciben la misma sustitución que el kit ya hace con los nombres de skill de superpowers.
   - **Sigue quitado, como hoy**: en `flowcharts.md`, «See `graphviz-conventions.dot` in this directory…» y los dos comandos `node ./render-graphs.js …`, porque el kit no copia esos dos ficheros. La línea nueva de la 7.0.2 «**Visualizing for your human partner:** Use `render-graphs.js`…» se quita igual, con `quita`, porque apunta al mismo fichero que el kit no copia. Un puntero a un fichero que no viaja no funciona, y la regla 1 de la ADR 0022 protege lo que funciona. La revisión final lo comprueba como cualquier `quita` nueva.

   Lo que conservaría cada fichero, previsto sin medir: `discovery.md`, `bulletproofing.md`, `persuasion-principles.md` y `skill-testing.md`, por encima del 90 %; `flowcharts.md`, por encima del 70 %; y `skill-mechanics.md`, por encima del 80 % (el 35 % de hoy más el 48 % de las secciones de prueba que recibe). Si alguno baja del 50 %, paro por desvío.
9. **Las dos entradas de mattpocock de §3, revisadas: nada que traer, y pasan a v1.3.2.**
   - `code-review` (v1.3.1 → v1.3.2) añade «Start every sub-agent with a fresh context window», lanzar los dos subagentes juntos y en primer plano, y buscar todos los ficheros de estándares. El kit toma de ella solo las dos reglas del «smell baseline», que no cambian, y sus ejes ya salen en paralelo y con contexto nuevo (`sdd-parallel-agents`).
   - `teach` y `wait-what` (v1.2.3 → v1.3.2) cambian puntuación, el orden de las respuestas de un test y `CONTEXT.md` por `GLOSSARY.md`. `sdd-rubber-duck` no toma ninguna de las tres cosas: su glosario es el de `PRODUCT.md`.
10. **`notCopied` se rellena en `sources.<fuente>.notCopied`** con lo que la fuente tiene en la carpeta de una copia y el kit no copia. Es una lista por fuente, no por versión, así que lleva las rutas de la versión en la que están las copias.
    - Mientras están en v7.0.0, lleva los ficheros de esa versión: `CREATION-LOG.md` y los `test-*.md` de `systematic-debugging`, y `examples/CLAUDE_MD_TESTING.md`, `anthropic-best-practices.md`, `graphviz-conventions.dot` y `render-graphs.js` de `writing-skills`.
    - Tras la subida, los de v7.0.2: `systematic-debugging/find-polluter.sh`, y `render-graphs.js`, `references/CLAUDE_MD_TESTING.md`, `references/anthropic-best-practices.md` y `references/graphviz-conventions.dot` de `writing-skills`. De `mattpocock/skills`, `writing-for-agents/agents/openai.yaml`.
    - No es texto quitado de una copia y no lleva A/B: son ficheros que el kit nunca copió.
11. **Humo solo en `sdd-agent-writing`**, con p1 (R1 y R2: la `description` dice solo cuándo usar la skill) y b1 (R6: la previsión de una campaña) de su batería, n = 1, en Sonnet. Son los dos escenarios que leen lo que se mueve en la decisión 8 y lo que entra en la 12. Las demás skills que se editan no lanzan sujetos, y la Previsión de coste da el motivo de cada una: su texto sale igual palabra a palabra salvo la versión de la atribución, y un salto de línea dentro de un párrafo no cambia lo que lee el agente. Es la misma razón de la decisión 15 de la 0302 (ADR 0019), y el Art. I la admite como «el motivo de no medirlo».
12. **El texto que suba con una versión nueva entra tal cual.** Es la regla 1 de la ADR 0022: la evidencia de la fuente vale. Lo que entra, todo en `sdd-agent-writing`:
    - en `skill-mechanics.md`, de `SKILL.md` v7.0.2: «## Writing SKILL.md» («A skill's `description` says only when to use it… It never summarizes the skill's workflow…» y su puntero a `discovery.md`), «## Flowcharts» y «## Bulletproofing Against Rationalization», cada uno con su puntero, y lo que cambie en el resto de `SKILL.md`, que sale del diff de la subida y va al walkthrough;
    - en las cuatro `references/` nuevas, lo de la decisión 8;
    - en `skill-testing.md`, las 2 líneas cambiadas de `testing-skills-with-subagents.md`. «**Complete worked example:** See CLAUDE_MD_TESTING.md in this directory…» apunta a un fichero que el kit no copia y sigue quitada, como hoy su versión de v7.0.0. «**Why this works:** See persuasion-principles.md (in this directory)…» entra tal cual y sustituye a la del kit de hoy, «See «Persuasion principles» below», porque con el reparto de la decisión 8 el puntero de la fuente vale.

    Si el texto nuevo repite algo que el kit ya sustituye, como un nombre de skill de superpowers o un puntero a un fichero que no copia, recibe la misma sustitución. Cualquier otra contradicción con el kit no se arregla aquí: queda como rojo con su `arregla` y su fila (decisión 5).
13. **El orden de las tasks y lo que espera `kit:copies` tras cada una.**
    - Task 1: anota `sdd-tdd`, `sdd-debugging`, `sdd-worktrees` y `sdd-parallel-agents`, y saca la versión del texto con su test.
    - Task 2: anota `sdd-verify`.
    - Task 3: el renombrado en `kit:copies-update`, con su test, y la anotación de `skill-mechanics.md`, `skill-testing.md` y `sdd-agent-writing/SKILL.md` en v7.0.0.
    - Task 4: la subida de las dos fuentes, el reparto de la decisión 8, `notCopied` en v7.0.2, las dos entradas de mattpocock, la procedencia de la batería y, después, el humo.
    - Tras cada task, `kit:copies` da solo los rojos con su `arregla` y los `sin anotar → <fila>` de las copias que aún tienen `pending`.
    - Tras cada cambio de `upstream.json`, `moon run kit:notices` y `kit:build`.

- Política de modelos: revisores de la spec, dominio opus + effort medium y técnica sonnet + effort medium (hechos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura opus+high · sujetos del humo: 2 en Sonnet, en paralelo · en paralelo hasta `control.maxParallelAgents` (3). Al aprobar la spec, esta línea es la confirmación de paralelizar los ejes y los sujetos.

Fusión del delta en una copia de `.docs/sdd` (`sdd capability merge`): `kit-distribution.md` con 1 requisito añadido, 1 sustituido y 3 reglas sustituidas («Dónde viven los datos», «Límites» y «Avisos»), sin rechazos; `sdd capability check` pasa (23 capacidades), y queda una sola línea «sin renombrar, no se toca».

Repaso de coherencia: `persuasion-principles.md`, que `skill-testing.md` lleva entera, pasa de `notCopied` (decisión 10) a copia (decisión 8), y «tres copias nuevas» pasa a cuatro en el Scope y en «Una pieza entra»; el requisito `ADDED` se acorta a menos de 500 caracteres.

### Decisiones tomadas con el dev-lead

- Cada copia parte del último tag de su fuente cuando arranca su feature — «ok a las cinco, adelante» (propuesta 0301, enmienda del 2026-11-04).
- Esta feature no arregla ninguna frase, y las comprobaciones pueden quedar en rojo con su fila; lo que el kit hace distinto sustituye la frase de la fuente; se parte del borrador de la 0302 — del prompt de arranque, «Decisiones ya tomadas».
- Revisar la spec con dos revisores adversariales, dominio en Opus y técnica en Sonnet — «has revisado adversialmente la spec? con ops dom y tecnmica» (2026-11-04).

## Intent

Las seis copias del kit siguen con `pending: "0312"`: `kit:copies` solo dice «sin anotar», y `kit:upstream` da rojo en `skill-mechanics.md`, `skill-testing.md` y las entradas de mattpocock `code-review` y `rubber-duck`. Además, trece ficheros escriben la versión de su fuente en el texto, y cada subida de versión la dejaría falsa. El éxito: `moon run kit:copies` corre sobre las seis copias, y cada rojo que queda nombra `fichero:línea` y su fila; `upstream.json` dice v7.0.2 en las copias de superpowers que toca esta fila; ningún texto de skill escribe una versión de una fuente; y `moon run kit:upstream` solo da rojo en las entradas de 0296, 0297, 0305, 0306, 0313 y 0314. Fracasaría si una copia anotada cambiara lo que lee el agente sin que nada lo viera, o si un cambio de texto de una fuente entrara a mano en vez de por `git merge-file`. A mano solo va el reparto en ficheros nuevos que la orden no hace (decisión 6).

## Scope

- Entra:
  - las fuentes anotadas de los 16 ficheros de copia de `sdd-tdd`, `sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents`, `sdd-verify` y `sdd-agent-writing`, y las cuatro copias nuevas de `sdd-agent-writing` (decisión 8), sin `pending`;
  - su subida con `kit:copies-update` a superpowers v7.0.2 y mattpocock/skills v1.3.2, con sus conflictos resueltos;
  - `kit:copies-update` siguiendo un original renombrado (`tests/copies/update.ts`), con su test en `cli/test/kit/copies.slow.test.ts`;
  - la versión fuera del texto en trece sitios (decisión 3) y su test en `cli/test/kit/notices.test.ts`;
  - `upstream.json`: sin `pending: "0312"`, `notCopied`, las entradas de `sdd-agent-writing` repartidas, y las de mattpocock `code-review` y `rubber-duck` en v1.3.2;
  - `THIRD_PARTY_NOTICES.md`, los `NOTICE` y `dist/`, regenerados;
  - la procedencia de `tests/batteries/sdd-agent-writing/battery.md`, al reparto nuevo, y el humo de la decisión 11;
  - los tres `*-reviewer-prompt.md` de `sdd-verify` con la forma de `code-reviewer.md` (enmienda del 2026-11-04), y `tests/batteries/sdd-verify/compose-axis.mjs`, que lee esa forma y salta las marcas;
  - las filas de deuda de la decisión 5, si salen.
- No entra:
  - arreglar un A+C o una excepción pegada que salga en rojo: 0307 para `sdd-tdd` y `sdd-verify`, o su fila nueva;
  - `sdd-implement`, salvo la palabra de la versión: 0296;
  - copia o propia de `sdd-archive` y de las `references/` de `sdd-propose`, salvo la palabra de la versión: 0305 y 0306;
  - que `kit:copies-update` siga un `from` renombrado (decisión 6);
  - la entrada de OpenSpec de `sdd-verify`: 0297;
  - `cli/src/tasks`: 0313;
  - `sdd-grilling` y sus dos conceptos: 0314;
  - llevar las comprobaciones al pre-commit y a la CI: 0311.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La versión de la fuente en el texto de una skill | `skills/sdd-tdd/SKILL.md:10`, `sdd-debugging/SKILL.md:10`, `sdd-worktrees/SKILL.md:10`, `sdd-parallel-agents/SKILL.md:10`, `sdd-verify/SKILL.md:10`, `sdd-agent-writing/SKILL.md:8`, `sdd-agent-writing/references/skill-mechanics.md:3`, `sdd-verify/references/architecture-reviewer-prompt.md:87`, `sdd-verify/references/code-reviewer-prompt.md:210`, `sdd-propose/references/spec-writing.md:3`, `sdd-propose/references/plan-writing.md:3`, `sdd-implement/SKILL.md:10`, `sdd-archive/SKILL.md:10` | decisión 3; delta, `ADDED` |
| «mapéalo antes de actualizar» para un original que la fuente renombra | `tests/copies/update.ts:81`; requisito «Actualizar una copia es fusionarla con git merge-file» de `kit-distribution` | delta, `MODIFIED`; el aviso sigue para un original quitado, y `cli/test/kit/copies.slow.test.ts:96` y `:144`, que lo comprueban con un original quitado, no cambian |
| `skill-mechanics.md` con las secciones de descubrimiento, diagramas y refuerzo; `skill-testing.md` con las de prueba de `SKILL.md` y los principios de persuasión | `skills/sdd-agent-writing/references/`; sus enlaces cruzados en `skill-mechanics.md:392` («See «Persuasion principles» in skill-testing.md»), `:428` y `skill-testing.md:163`; `skills/sdd-agent-writing/SKILL.md:14` y `:69`; `tests/batteries/sdd-agent-writing/battery.md:48-52`; las entradas de `upstream.json:255-293`; `THIRD_PARTY_NOTICES.md:25-27` | decisión 8; los enlaces y la batería se ajustan en su task; `SKILL.md:14` y `:69` siguen valiendo, porque los dos ficheros conservan su nombre |
| La ruta `skills/writing-skills/testing-skills-with-subagents.md` del registro | `upstream.json:280` | decisión 7: la cambia `kit:copies-update` |
| `pending: "0312"` | `upstream.json`, 16 entradas | se quita; las menciones de `0312` en `capabilities/kit-distribution.md:109` y `:113` y en `cli/test/kit/copies.slow.test.ts` y `notices.test.ts` son ejemplos de `pending` y siguen valiendo |
| Un párrafo por línea en las 16 copias | sus ficheros en `skills/` y `dist/skills/` | regla «Forma de línea» de la propuesta 0301: los saltos de línea del original |
| `mattpocock/skills` `code-review` en v1.3.1 y `teach` y `wait-what` en v1.2.3 | `upstream.json:352-362` y `:386-397` | decisión 9: v1.3.2 |

- Filas que implementa: 0312 → su fila del roadmap; las demás menciones (`0307`, `0311` del roadmap y los ejemplos de `pending` de la capacidad y los tests) siguen siendo ciertas: comprobado con `git grep -n 0312 -- ':!.docs/sdd/specs' ':!.docs/sdd/field-reports' ':!dist'`.
- Una pieza entra, otra sale: salen trece versiones escritas en el texto y la división del kit de `writing-skills` en dos ficheros, que no era la de la fuente; entran cuatro copias, una por fichero de la fuente.

## Approach

Cuatro tasks, en el orden de la decisión 13. La primera anota las copias de superpowers con una sola fuente (`sdd-tdd`, `sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents`) y saca la versión del texto con su test. La segunda anota `sdd-verify`, con sus bloques `de:` de Wondel. La tercera da a `kit:copies-update` el renombrado, con su test, y anota `sdd-agent-writing` en v7.0.0 y v1.3.1. La cuarta sube las dos fuentes con `kit:copies-update`, resuelve los conflictos, reparte `sdd-agent-writing` en v7.0.2 (decisión 8), pone las dos entradas de mattpocock en v1.3.2 y, con la procedencia de la batería al día, lanza el humo. Cada fichero anotado sale del borrador arreglado y se revisa a mano contra el diff de hoy antes de su commit.

## Dónde se prueba

- Cada copia anotada contra su original: `moon run kit:copies`, con su salida en el walkthrough.
- Que la salida de cada copia sea el texto de hoy: un script del walkthrough compara `dist/` antes y después con los espacios normalizados; solo cambian las versiones de la decisión 3, la cabecera de la decisión 4 y lo que trae la subida de versión.
- La subida y el renombrado: `moon run kit:copies-update` contra los clones, con su salida en el walkthrough; el renombrado, también con un repo git temporal en `cli/test/kit/copies.slow.test.ts`, como el resto de casos de la orden.
- La versión en el texto: `cli/test/kit/notices.test.ts`, como la regla «see NOTICE», contra las skills reales y un caso de prueba.
- El registro al día: `moon run kit:upstream`, con su salida en el walkthrough.
- Lo que lee el agente en `sdd-agent-writing`: el humo p1 y b1 de su batería.

## Términos y ADR

- Términos resueltos: los de la 0302 (fuente anotada, original, original base, lo quitado) · **subir una copia** — fusionarla con `kit:copies-update` al último tag de su fuente.
- ADR candidatas: ninguna. Las reglas son las de la ADR 0022 y la propuesta 0301.

## Delta de comportamiento

### Capacidad: `kit-distribution`

#### ADDED — La versión de una fuente no se escribe en el texto de una skill

- GIVEN `skills/sdd-tdd/SKILL.md:10` con «… of superpowers 7.0.0»
- WHEN corre `cli:test`
- THEN falla con `skills/sdd-tdd/SKILL.md:10: la versión de una fuente vive en upstream.json, no en el texto: «superpowers 7.0.0»`
- AND vale para la clave o el `repo` de cada fuente: «`wondelai/skills` 1.8.0» falla igual
- AND «superpowers.** Desde la v2.0.0», en `migrations/v2.0.0.md`, no falla: `migrations/`, los `NOTICE` y las marcas `<!-- kit: … -->` no cuentan

#### MODIFIED — Actualizar una copia es fusionarla con git merge-file (antes: "una copia cuyo original base no existe en el tag nuevo no se toca")

- GIVEN la fuente anotada de `subagent-driven-development/SKILL.md` de `v7.0.0` con los seis bloques del experimento de la review
- WHEN corre `moon run kit:copies-update -- superpowers v7.0.1`
- THEN fusiona con `git merge-file -L kit -L v7.0.0 -L v7.0.1 <fuente anotada> <original v7.0.0> <original v7.0.1>`, en LF, escribe `<kit>: v7.0.0 → v7.0.1, 2 conflictos` y cambia su `version` en `upstream.json`
- AND los dos conflictos son el del bloque que tocaron los dos (B4) y el de la sección que la 7.0.1 movió a `references/fix-loop.md` (B5), cada uno con su línea `<kit>:<línea>: conflicto con el bloque 4597d47e; si te quedas con la versión de la fuente, el bloque se pierde`; los otros cuatro fusionan solos
- AND `kit:copies` da `<fichero>:<línea>: conflicto de git merge-file sin resolver` mientras queden marcadores
- AND una copia cuyo original base `git diff --name-status -M --diff-filter=R <vieja> <nueva>` da como renombrado (`skills/writing-skills/testing-skills-with-subagents.md` → `skills/writing-skills/references/testing-skills-with-subagents.md` en `v7.0.2`) se fusiona con el original en su ruta nueva, su `paths` pasa a esa ruta y escribe `<kit>: su original <ruta> pasa a <ruta nueva> en v7.0.2`
- REMOVED AND una copia cuyo original base no existe en el tag nuevo no se toca: `<kit>: su original <ruta> no existe en v7.0.1: mapéalo antes de actualizar`, y su `version` no cambia
- AND una copia cuyo original base no existe en el tag nuevo, sin renombrar, no se toca: `<kit>: su original <ruta> no existe en v7.0.1: mapéalo antes de actualizar`, y su `version` no cambia
- AND un `git merge-file` que falla para la orden sin escribir ninguna copia ni el registro
- AND una copia con `pending` no se toca

#### Reglas de la capacidad — kit-distribution

- **Dónde viven los datos**: la versión de cada fuente de terceros, solo en `upstream.json`, en la raíz del repo, que no viaja, y en los avisos que salen de él; nunca en el texto de una skill. También vive allí si cada fichero de `skills/` es copia o propia (`own`) y qué ficheros de la carpeta de una copia no se copian (`notCopied`). La versión del plugin, solo en `.claude-plugin/plugin.json` de la raíz; `dist/.claude-plugin/plugin.json` es su copia generada. Lo que viaja, en `dist/`, generado desde `skills/` y la lista blanca. Qué frase de una copia es del kit, solo en las marcas de su fuente anotada en `skills/`.
- **Límites**: una copia conserva al menos el 50 % de su original base, medido por frases de 6 palabras; si no, es propia. Las absolutas son `only`, `never`, `always`, `must` y `every`. La cita S de una marca no lleva `«`, `»` ni `-->`. Una versión escrita en el texto es la clave o el `repo` de una fuente, una comilla invertida opcional, espacios y `v?N.N[.N…]` (`` (<clave>|<repo>)`?\s+v?\d+(\.\d+)+ ``), en un `.md` de `skills/` fuera de `migrations/`.
- **Avisos**: `dist/ no es lo que sale del build: ejecuta moon run kit:build` · `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices` · `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código` · `<fuente>: licencia <licencia> sin plantilla en build/notices.ts` · los de `kit:upstream` del requisito «El corte compara cada entrada del registro con su fuente» · los de `kit:copies` y `kit:copies-update` de los requisitos «Una copia es su original más bloques del kit marcados», «Lo que sustituye una marca es lo que el bloque quita», «Una frase sustituida no queda al lado de la del kit», «Un añadido junto a una absoluta del original da rojo», «La marca del kit se escribe con su gramática», «Lo que dice kit:copies de cada copia», «Una copia que ya no lo es da rojo», «La fuente de una copia va en LF», «Un fichero de la fuente sin mapear da rojo» y «Actualizar una copia es fusionarla con git merge-file» · `<fichero> no está clasificado en upstream.json: ponlo en una entrada copy o en own` · `upstream.json: la entrada <n> es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero` · `<fichero> dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera` · `<fichero>:<línea>: la versión de una fuente vive en upstream.json, no en el texto: «<trozo>»`.

## Topes de palabras

Medido sobre `dist/skills/` con el conteo de `cli/test/kit/word-budget.test.ts` (los topes llevan un 25 % de margen hasta la v3).

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-agent-writing` (total) | 8.739 / 10.950 | 2.211 | sin cambio: la 7.0.2 suma ~200 palabras a lo que copia y los punteros ~100 |
| `sdd-agent-writing` (`SKILL.md`) | 1.995 / 2.500 | 505 | sin cambio: pierde una palabra |
| `sdd-tdd`, `sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents`, `sdd-verify`, `sdd-propose`, `sdd-implement`, `sdd-archive` | 4.029, 3.408, 1.432, 1.138, 9.619, 13.882 y 17.455 de total, todos bajo su tope; `sdd-archive`, 9.912 de 10.000 | — | sin cambio: cada una pierde una palabra por versión quitada |

## Previsión de coste

Es humo, no una campaña. No hay RED, porque no hay guidance nueva del kit: lo nuevo que lee el agente es texto de la fuente, con su evidencia (decisión 12), y el humo mide que el reparto no lo esconde. El umbral de parada es pasar de ~4 $ o de ~40 min de sujetos, una tanda de REFACTOR incluida: entonces paro y decides tú (Art. I).

| Tanda | Sujetos (batería) | Minutos | $ |
| --- | --- | --- | --- |
| RED | 0 | 0 | 0 |
| GREEN (humo) | 2 (`sdd-agent-writing` p1 y b1, n = 1, Sonnet, en paralelo) | ~15 | ~2 (estimado: un sujeto que escribe una skill, ~1 $, y uno que escribe una previsión, ~0,5 $; `tech-stack.md` no tiene precio medido para esta batería) |
| Una tanda de REFACTOR | 2, si el humo falla por el reparto | ~15 | ~2 |
| Controles | 0: el humo no compara contra otra versión | 0 | 0 |
| Medición tras la revisión final | 0, salvo que la pasada de fix toque `sdd-agent-writing` | 0 | 0 |
| Suma | 2 a 4 | ~15 a ~30 | ~2 a ~4 |

Cada paso cambiado de lo que sigue el agente, con su escenario o el motivo de no medirlo:

| Skill | Qué cambia | Escenario o motivo |
| --- | --- | --- |
| `sdd-agent-writing` | el reparto de la decisión 8 y el texto de la 7.0.2 de la decisión 12: `## Writing SKILL.md` y su puntero a `discovery.md` | p1 (R1, R2) |
| `sdd-agent-writing` | las secciones de prueba pasan a `skill-mechanics.md`; `persuasion-principles.md` a su fichero; las 2 líneas nuevas de `testing-skills-with-subagents.md` | b1 (R6) |
| `sdd-agent-writing` | `## Flowcharts` y `## Bulletproofing Against Rationalization` detrás de un puntero | sin escenario: la batería no mide diagramas ni refuerzo, y el texto es el de la fuente con su evidencia (regla 1 de la ADR 0022) |
| `sdd-tdd`, `sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents`, `sdd-verify` | la versión de la atribución, los saltos de línea del original y, en `sdd-worktrees`, la cabecera en su párrafo | sin medir: el texto sale igual palabra a palabra salvo una atribución que ningún paso sigue (ADR 0019, decisión 15 de la 0302) |
| `sdd-propose`, `sdd-implement`, `sdd-archive` | solo la palabra de la versión en su atribución | sin medir: la misma razón |
| `sdd-verify`, los tres `*-reviewer-prompt.md` | el tipo, el modelo y la descripción del despacho pasan de la frase de encima al recuadro, con la forma de `code-reviewer.md` (`Subagent (<tipo>, model: <modelo>):`, `description:`, `prompt: |`), y las instrucciones van sangradas bajo `prompt: |` | sin escenario: el encargo que compone `compose-axis.mjs` para cada eje sale igual byte a byte que antes; el despacho tiene la forma del ejemplo de `sdd-parallel-agents`, `Subagent (sdd-kit:effort-medium, model: sonnet)` |

## Enmiendas

- **2026-11-04, Task 2 (freno de alcance).** Los tres `*-reviewer-prompt.md` anotados con las líneas exactas del original volvían a sangrar entre 72 y 79 líneas. El kit había sacado las instrucciones de la cabecera `prompt: |` de `code-reviewer.md` y les había quitado la sangría. Dev-lead: «sí, adelante así». Se refería a que el encargo de código, que es un fork de `code-reviewer.md`, vuelve a su forma: la cabecera de superpowers con el tipo y el modelo del kit, y la sangría. Los encargos de spec y de arquitectura iban a pasar a propios. Al ir a hacerlo apareció un hecho nuevo: el de arquitectura copia literal la tabla de `clean-architecture` de Wondel, y un fichero propio no genera `NOTICE`, así que la tabla perdería su aviso de licencia. Por eso los dos llevan la misma forma que el de código y siguen siendo copias. Conservan el 62 % y el 57 % del original, y `kit:copies` no da ningún rojo. Así queda lo que ya decía el Scope aprobado: 16 copias. El encargo de cada eje sale igual byte a byte, lo mide `compose-axis.mjs`.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-04 | aprobada (opción «Apruebo») |

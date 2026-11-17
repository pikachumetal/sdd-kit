---
id: 20261103-173149-feature-0300-skill-source-build-dist
feature: 0300
proposal: 0301
title: La base, con la fuente intermedia, el build y dist/ sin las tripas del kit
mode: full
status: approved
created: 2026-11-03
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-03
---

# Spec — La base, con la fuente intermedia, el build y dist/ sin las tripas del kit

🦆 Hoy, quien instala el kit recibe en la caché del plugin el repo entero. En una instalación de prueba con Claude Code 2.1.317 fueron 20.117 ficheros y 109 MB, con `.docs/`, `tests/` y `cli/test/` incluidos, y el agente del proyecto los tiene a mano. Con esta feature recibe solo lo que el kit necesita para funcionar: 234 ficheros y 1,6 MB, medidos al actualizar de la 2.3.4 a una versión con `dist/` en esa misma prueba. Las skills llegan idénticas, byte a byte. Cambia el origen: `skills/` del repo pasa a ser la fuente, que más adelante podrá llevar marcas del kit, y un build la copia limpia a `dist/`, que es lo que apunta el marketplace. Además, la versión de cada fuente de terceros deja de estar escrita a mano en tres sitios: vive en un registro, `upstream.json`, del que salen `THIRD_PARTY_NOTICES.md` y los `NOTICE`.

Validación: agente — el proyecto valida en campo (`validation.mode: field`). Lo que miraría una persona es la caché instalada, y eso lo mide la prueba de instalación con Claude Code. El uso real lo dan la 0302 y la 0304, que construyen sobre esta base.

## Capacidades

- Nuevas: `kit-distribution` — qué viaja en el plugin instalado, cómo sale de la fuente y de dónde salen los avisos de terceros.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos (Sonnet, effort medium) — señales: capacidad nueva (kit-distribution), contrato público (la forma de marketplace.json y de la caché que lee Claude Code; el formato de upstream.json, que leerán la 0302 y la 0304), migración (la caché de quien tiene la 2.3.4), área no explorada (los tests de headless y de manifests no los he leído enteros) · tamaño: ~600 líneas en ~25 ficheros, más los 234 generados de dist/
- Dominio: si los seis requisitos de kit-distribution cubren lo que promete el Intent, en particular «ninguna marca en la caché» y la actualización desde la 2.3.4 (señal: capacidad nueva + migración)
- Técnica: si el formato de upstream.json basta para la 0302 (copia con tag y rutas) y si la comparación de dist/ aguanta el core.autocrlf de cada clon (señal: contrato público)
- Mínimo razonable: un revisor; con cuatro señales tocarían dos, pero dos en paralelo piden tu confirmación y en delegate no paro por método. Queda sin cubrir la segunda mirada independiente sobre la lente técnica.
```

Fusión del delta en una copia de `.docs/sdd` (`sdd capability merge`): `kit-distribution.md` nueva, con 6 requisitos y 5 reglas añadidos, y sin rechazos.

1. **`dist/` va commiteado en `develop`, y el marketplace apunta a `"source": "./dist"`.** La prueba de instalación no las distingue: las dos formas dejan la caché limpia y actualizan desde la 2.3.4. La tabla está en «Dónde se prueba». Elijo `dist/` commiteado por tres motivos. Lo he probado tal cual llega a un usuario. No añade un paso de publicación en el corte. Y el test «`dist/` es lo que sale del build» corre en cada commit. La rama `dist` solo la probé con una fuente `url` contra el mismo repo, no con `github`, así que la autorreferencia en GitHub queda sin probar. El coste de commitear lo mitigo así:
   - `.gitattributes` marca `dist/**` con `-diff linguist-generated`, y el diff de una rama no sale doble.
   - `.ignore` lleva `dist/`, así que `rg` y el Grep del agente no lo ven si no se nombra. Lo he comprobado: `rg frase` no lo lista, y `rg frase dist` sí.

   Si prefieres la rama `dist`, cambian la entrada del marketplace (`{"source":"github","repo":"pikachumetal/sdd-kit","ref":"dist"}`) y un paso de publicación en el corte. Lo demás es igual.

   Contra esta decisión: con `dist/` commiteado, este repo lleva una segunda copia de `skills/sdd-templates/templates/`. El Art. VIII dice «Ninguna copia, ni en este repo ni en los proyectos». Su porqué es que «las copias de cada proyecto derivaban de las del kit sin que nadie se enterara», y esta no puede derivar, porque la genera el build y un test la compara en cada commit. **Te pido cambiar la letra del Art. VIII** de «Ninguna copia, ni en este repo ni en los proyectos» a «Ninguna copia a mano, ni en este repo ni en los proyectos: la de `dist/` la genera el build y un test la compara». Va con una ADR nueva, la 0023, «`dist/` commiteado», que no sustituye a la 0008 y la acota. Si no lo apruebas, la salida es la rama `dist`.
2. **Lista blanca exacta de `dist/`**: `.claude-plugin/plugin.json`, `agents/`, `cli/bin/`, `cli/src/`, `cli/package.json`, `hooks/`, `skills/`, `LICENSE` y `THIRD_PARTY_NOTICES.md`. `cli/package.json` no estaba en tu lista. Lo añado porque lleva `"type": "module"`: sin él, `node dist/cli/bin/sdd.js` avisa por stderr `[MODULE_TYPELESS_PACKAGE_JSON]` (medido en esta sesión) y ensucia la salida del hook. No arrastra dependencias, porque Claude Code solo instala las de un `package.json` en la raíz del plugin.
3. **`cli/src/upgrade/verbs.ts:9`, `cli/src/validation/verbs.ts:7`, `cli/src/capabilities/merge.ts:33` y `cli/bin/session-start.js` no cambian.** Resuelven `../../../skills/…` o `CLAUDE_PLUGIN_ROOT` relativos a sí mismos, y desde `dist/cli/…` ya caen en `dist/skills/…`. Ponerles `dist/` delante haría que el plugin instalado buscara `dist/dist/skills`. Lo que cambia es quién los ejecuta: la sesión de desarrollo pasa a `--plugin-dir dist`. Un test lo comprueba ejecutando `dist/cli/bin/sdd.js`.
4. **`init.slow.test.ts:9`, el test de `workflow-docs` y el paso que sube la versión siguen leyendo `.claude-plugin/plugin.json` de la raíz.** Es el único sitio donde se escribe la versión; `dist/.claude-plugin/plugin.json` es su copia, y el test de `dist/` la compara. Para que subir la versión en el corte no tope con un rojo, la orden del corte de la regla 5 de `CLAUDE.md` pasa a `node cli/bin/sdd.js lock run -- moon run kit:build kit:skill-size cli:test-slow cli:test-min`. Sustituye a la orden de hoy, sin una frase nueva, y en `moon.yml` `kit:skill-size` depende de `kit:build`, porque moon no garantiza el orden de las tareas de una misma orden. Si alguien sube la versión sin reconstruir, el pre-commit falla con el mensaje de la decisión 6. Así el paso de `sdd-end-release` no cambia, y ninguna frase de skill cambia.
5. **Marcas, para el build**, en todo `.md` de la lista blanca:
   - Una marca es una línea entera `<!-- kit: … -->`, con o sin espacios alrededor, fuera de un bloque de código. El build quita la línea con su salto (LF o CRLF).
   - Un bloque de código va desde una línea que empieza, tras hasta tres espacios, por tres o más ``` o `~~~` hasta su cierre. Dentro, `<!-- kit:` se copia tal cual: es un ejemplo, no una marca.
   - Fuera de un bloque, cualquier otra línea con `<!-- kit:` para el build: con texto antes o después, sin cerrar, o en el frontmatter. El mensaje es `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código`.
   - Lo demás se copia tal cual. Qué dice dentro de la marca (`sustituye`, `quita`, inclusiones) lo decide la 0302.
6. **El build** es `build/dist.ts`, con la tarea `moon run kit:build` en el `moon.yml` de la raíz.
   - Toma de la lista blanca los ficheros de `git ls-files --cached --others --exclude-standard` que existen. Así entra lo que se commitearía, también un fichero nuevo sin añadir, y nunca lo ignorado (`node_modules`, `.temp`).
   - Construye en una carpeta temporal y después sincroniza `dist/`: escribe solo los ficheros que cambian y borra los que sobran, sin vaciarlo antes. Una sesión con `--plugin-dir dist` nunca se queda sin `dist/` a medio build. Si el build falla, `dist/` no se toca.
   - Su test, `cli/test/kit/dist.test.ts`, entra en `cli:test`, cuyos inputs ya son el repo entero (`'/**/*'` en `cli/moon.yml`): corre en el pre-commit y en la CI en cualquier commit. Construye en una carpeta temporal y compara con `dist/` fichero a fichero, con los saltos normalizados a LF, porque el `core.autocrlf` de cada clon cambia los de la copia de trabajo. Si difiere, el mensaje es `dist/ no es lo que sale del build: ejecuta moon run kit:build`, seguido de los ficheros que difieren.
   - Las herramientas del repo viven en `build/`, una carpeta nueva que no viaja, y no en la CLI, que viaja a los proyectos.
7. **El registro es `upstream.json`, en la raíz, y no viaja.** Por cada fuente guarda `repo`, `tagPrefix`, `license` y `copyright`. Cada entrada lleva:
   - `kind`, que es `copy` o `concept`;
   - `source`;
   - `version`, un tag o un commit del clon: la versión de la que se copió una copia, o la última revisada de un concepto;
   - `paths`, las rutas en la fuente;
   - `kit`, las rutas del kit que la usan;
   - `note`, opcional.

   Hay una entrada por cada pareja de fuente y fichero del kit que nombran hoy `THIRD_PARTY_NOTICES.md` y los `NOTICE`. Clasificación de partida, que la 0302 puede revisar:
   - `copy`: lo que tiene `NOTICE` hoy y los ports de código (`cli/src/tasks/` y `tests/skill-size/check.ts`).
   - `concept`: el resto (los formatos de las plantillas, `converge` de Spec Kit, OpenSpec fuera de `sdd-verify`, los encabezados de impeccable).
8. **Versiones de partida**: la de la que se tomó cada pieza, según el `NOTICE` o la frase de hoy. Por ejemplo, superpowers `v7.0.0` en las copias, `85f83d3` en `sdd-grilling` y `1.14.1` de OpenSpec en `sdd-verify`. La «Versión vista» deja de existir. Consecuencia: `kit:upstream` dará rojo en las copias de superpowers cuyas rutas cambian de la 7.0.0 a la 7.0.1, hasta que la 0296 y la 0302 las actualicen. Es el estado real: hoy esas copias no siguen a la 7.0.1. `kit:upstream` solo corre en el corte.
9. **`THIRD_PARTY_NOTICES.md` y los `NOTICE` se generan**, con `build/notices.ts` y la tarea `moon run kit:notices`. Generar me parece más simple que comprobar prosa: comprobarla obligaría a parsear versiones escritas de cinco maneras («version 7.0.0», «(v1.3.1)», «1.2.3»…).
   - `THIRD_PARTY_NOTICES.md` conserva la introducción y «Skills de desarrollo de este repo», escritas a mano. Las dos listas de hoy se sustituyen por una tabla generada bajo `## Fuentes`, con las columnas `Fichero del kit | Fuente | Tipo | Versión | Rutas de la fuente | Licencia | Nota`.
   - Cada carpeta de skill con entradas `copy` lleva un `NOTICE` generado: una cabecera en inglés por entrada, con su fuente, versión y rutas, y el texto de su licencia con el `copyright` del registro.
   - Hoy todas las entradas `copy` son MIT, y el generador solo trae la plantilla MIT. Una entrada `copy` con otra licencia lo para con `<fuente>: licencia <licencia> sin plantilla en build/notices.ts`. Las `concept` no generan `NOTICE`. impeccable (Apache-2.0) es `concept`, y `skill-creator` es de desarrollo, no del registro.
   - Antes de sustituir los once `NOTICE`, la task comprueba que cada uno conserva sus líneas `Copyright` y el texto entero de la licencia de hoy, y que solo cambian las cabeceras.

   `cli/test/kit/notices.test.ts` falla si alguno difiere de lo generado, con `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices`. Esto cambia el texto de los `NOTICE`, que no son skills: el agente no los carga.
10. **`kit:upstream` lee el registro**, y sigue haciendo `fetch`, porque solo corre en el corte. Para cada fuente busca el último tag con su `tagPrefix`, y para cada entrada:
    - Pasa si `version` es ese tag, o si `git diff` entre los dos no toca sus `paths`. `version` puede ser un commit (`85f83d3`), y se compara igual contra el último tag de su fuente.
    - Da rojo si cambian sus rutas: `<fuente> · <kit>: <versión> → <último>, cambian sus rutas: git -C <clon> diff <versión> <último> -- <rutas>`.
    - Da rojo si una ruta no existe en el último tag: `<fuente> · <kit>: la ruta <ruta> no existe en <último>`.
    - Da rojo si la versión no está en el clon: `<fuente>: falta <versión> en el clon <clon>`.
    - Da rojo si la fuente no tiene ningún tag con su prefijo: `<fuente>: el clon <clon> no tiene tags <prefijo>X.Y.Z`.
    - `<kit>` son las rutas de `kit` de la entrada, separadas por «, ».
    - Siguen los mensajes de hoy para lo que falla antes: `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.`, `<fuente>: sin clone de <repo> en <carpeta>.` y `<fuente>: no se pudo actualizar el clone: <error>.`

    En verde escribe `Fuentes al día: <n> entradas.`
11. **La sesión de desarrollo**:
    - `start-kit-session.mjs` ejecuta el build y arranca con `--plugin-dir <raíz>/dist`.
    - `.claude/hooks/kit-session-source.mjs` y la regla 1 de `CLAUDE.md` mandan contrastar con `dist/skills/<nombre>/SKILL.md`. En la regla 1, la orden «contrasta su texto con `skills/<nombre>/SKILL.md` de la rama» se sustituye por «reconstruye con `moon run kit:build` y contrasta su texto con `dist/skills/<nombre>/SKILL.md`»: no se añade una frase al lado.
    - El índice de `CLAUDE.md` dice que `skills/` es la fuente y `dist/skills/` lo que carga el agente.
12. **La copia del kit para sujetos sale de `git archive <commit>:dist`.** Para un commit anterior a esta feature, sigue la lista de hoy: `skills .claude-plugin agents cli hooks`. Cambian `tests/headless/{battery,campaign,lib}.mjs`, sus tests, y `molds.test.ts`, que pasa a copiar de `dist/`.
13. **Fuente o `dist/` en los tests**: `tests/skill-size/check.ts` mide `dist/skills/`, como pediste. Los demás tests que leen `skills/` siguen en la fuente: hoy no hay marcas y las dos son iguales. Pasarlos a `dist/` queda para la 0302 y la 0304, que traen las primeras marcas y las comprobaciones de tamaño.
14. **`start-kit-session.mjs` no arranca si el build falla.** Escribe el error del build y `start-kit-session: arregla la fuente y vuelve a lanzarlo; dist/ no se ha tocado.`, y sale con código 1. Arrancar con el `dist/` anterior escondería que la sesión no sigue la rama. Arreglar una marca es editar una línea.
15. **`skills/` no se renombra.** Es la fuente intermedia. La 0302 y las features de skill trabajan sobre ella, y su historia de git sigue en el mismo sitio.
16. **El delta solo cubre lo que ve un proyecto que usa el kit.** La sesión de desarrollo, la copia del kit para sujetos y `kit:skill-size` son herramientas de este repo: quedan en `tech-stack.md` y `CLAUDE.md`, con sus tests, como hoy. Las capacidades que la propuesta 0301 nombraba no cambian. Las he releído:
    - `migration`: dice cómo migra un proyecto entre versiones; el plugin se actualiza sin ningún paso de migración.
    - `agent-writing`: dice cómo se pide y se prueba una skill; dónde vive la fuente no cambia nada de eso hasta que la 0302 traiga marcas.
    - `cli`: no hay verbo nuevo.
17. **El glosario de `mission.md`** («Dominio») gana cuatro términos: fuente intermedia, `dist/`, marca y registro de fuentes.
18. **La prueba de instalación** usa un marketplace git servido por HTTP en local (`git http-backend` detrás de un servidor de Node) y un `CLAUDE_CONFIG_DIR` aislado. Claude Code rechaza un repo `file://` como fuente git, y una carpeta local se carga en el sitio, sin copiar. La última task la repite con el `dist/` real y bajo un número de versión de prueba en una copia, sin tocar el `plugin.json` del repo.
- Política de modelos: un revisor de spec en Sonnet (`sdd-kit:effort-medium`) · revisión final en ejes: Spec en Opus + high, Código en Sonnet + high, Arquitectura según el plan · sin sujetos ni otros despachos en paralelo · en paralelo, hasta `control.maxParallelAgents` (3). Al aprobar la spec, esta línea es tu confirmación de paralelizar los ejes de la revisión final.

### Hallazgos de la review

Un revisor Sonnet con los siete puntos devolvió 1 crítico, 8 importantes y 1 menor.

1. **Aceptado** — Crítico: `dist/` commiteado copia las plantillas, y el Art. VIII dice «Ninguna copia, ni en este repo» → he añadido a la decisión 1 el cambio de letra del Art. VIII y la ADR 0023, a tu aprobación, con la rama `dist` como salida; y van al Scope y a la tabla de retiradas.
2. **Aceptado en parte** — falta `moon.yml`, y `cli:test` puede no correr con `--affected` → las tareas `kit:build` y `kit:notices` entran en el Scope. Los inputs no hace falta tocarlos: `cli:test` ya tiene `'/**/*'` (`cli/moon.yml`), y lo dice la decisión 6.
3. **Aceptado** — el build lee ficheros sin trackear → toma `git ls-files --cached --others --exclude-standard` (decisión 6), con un escenario de fichero ignorado.
4. **Aceptado** — una marca mal puesta pasaría a `dist/` → la decisión 5 define el bloque de código y para el build ante cualquier `<!-- kit:` fuera de sitio, también en el frontmatter; el requisito lleva los dos casos.
5. **Aceptado** — vaciar `dist/` deja sin plugin a una sesión abierta → el build sincroniza sin vaciar y no toca `dist/` si falla (decisión 6), y `start-kit-session` no arranca si falla (decisión 14).
6. **Aceptado** — los `NOTICE` regenerados rompen «byte a byte», y hay licencias que no son MIT → la excepción está en el Intent. El generador para ante una `copy` que no sea MIT, y la task comprueba que no se pierde texto legal (decisión 9).
7. **Aceptado como «no aplica», con motivo** — el delta no cubre la sesión de desarrollo, la copia para sujetos ni `skill-size` → son herramientas del repo, no comportamiento de un proyecto (decisión 16), y he releído `migration`, `agent-writing` y `cli`.
8. **Aceptado** — subir la versión sin reconstruir da rojo en el corte → la orden del corte de la regla 5 empieza por `kit:build` (decisión 4), con un escenario de verde tras reconstruir.
9. **Aceptado** — `kit:upstream` sin casos para versión commit, falta de clon y `<kit>` múltiple → decisión 10 y requisito ampliados.
10. **Aceptado** — decisiones sueltas, ADR, glosario, versión del plugin y fecha → decisiones 15 y 17, la ADR 0023 en el Scope, la versión del plugin en «Dónde viven los datos» y la fecha en el requisito de la 2.3.4. «Las fuentes no se copian» ya era tuya y está abajo.

### Decisiones tomadas con el dev-lead

- La skill que carga el agente va limpia; la fuente intermedia sí se puede ensuciar — «claro que no hay que ensuciar el SKILL por eso intentábamos tener un fichero intermedio que poder ensuciar y el build».
- Nada de copiar las fuentes en el repo: se leen con `git -C <clon> show <tag>:<ruta>` de los clones de `SDD_UPSTREAM_DIR` — «ya tenemos upstream para eso».
- La versión de cada fuente vive en un solo sitio (review.md, hallazgo 10) — prompt de arranque de la 0300, 2026-11-03.
- Dónde vive `dist/` lo decide una prueba de instalación real — prompt de arranque de la 0300, 2026-11-03.
- Sin prisa — «sin recortes y sin prisa».
- `dist/` commiteado y el cambio de letra del Art. VIII con la ADR 0023 (decisión 1), aprobados con la spec — opción «Apruebo», 2026-11-03.

## Intent

Hoy `"source": "."` copia en la caché de cada proyecto el repo entero del kit: medido en esta sesión, 20.117 ficheros y 109 MB. Con ellos van `.docs/`, `tests/` y `cli/test/`, que el agente del proyecto tiene a mano y puede leer como si fueran instrucciones. Y la 0302 necesita poner marcas en la fuente de las copias sin que lleguen al agente (dev-lead: «no hay que ensuciar el SKILL»). Además, la versión de cada fuente de terceros está escrita en tres sitios que ya no coinciden: los `NOTICE` dicen 7.0.0 y `THIRD_PARTY_NOTICES.md` dice «vista v7.0.1».

El éxito tiene cuatro condiciones. La primera: un plugin instalado desde `dist/` no lleva en la caché `.docs`, `tests`, `cli/test` ni ninguna marca, comprobado instalándolo. La segunda: las skills de `dist/` son byte a byte las de hoy, todo lo que el agente carga y ejecuta. La excepción son los once `NOTICE`, que se regeneran desde el registro con otras cabeceras y el mismo texto legal (decisión 9). La tercera: un test falla si `dist/` no es lo que sale del build. La cuarta: `THIRD_PARTY_NOTICES.md` y los `NOTICE` coinciden con el registro, o un test falla. Fracasaría, aunque funcionara, si la sesión de desarrollo del kit siguiera cargando o mandando leer la fuente con marcas, o si quien tiene la 2.3.4 tuviera que hacer algo a mano para actualizar.

## Scope

- Entra: el build `build/dist.ts`, que copia la lista blanca a `dist/` y quita las líneas de marca de los `.md`, y su test en `cli:test`. En el `moon.yml` de la raíz, las tareas `kit:build` y `kit:notices`, y `kit:skill-size` dependiendo de `kit:build`.
- Entra: `dist/` commiteado, con `.gitattributes` (`dist/** -diff linguist-generated`) y `.ignore` (`dist/`).
- Entra: `.claude-plugin/marketplace.json` con `"source": "./dist"`.
- Entra: el registro `upstream.json`; la generación de `THIRD_PARTY_NOTICES.md` y de los `NOTICE` (`build/notices.ts`, `moon run kit:notices`) y su test; `tests/upstream/check.ts` leyendo el registro, con la comparación por rutas de cada entrada, y su test `upstream-watch.slow.test.ts`.
- Entra: lo que lleva a la sesión de desarrollo a `dist/`: `start-kit-session.mjs`, `.claude/hooks/kit-session-source.mjs` y su test, las reglas 1 y 5 y el índice de `CLAUDE.md`, y `README.md` (§ probar el kit desde tu clon).
- Entra, si apruebas la decisión 1: el Art. VIII de la constitution, con «Ninguna copia a mano…», y la ADR 0023, «`dist/` commiteado», que acota la 0008.
- Entra: la copia del kit para sujetos desde `dist/`: `tests/headless/{battery,campaign,lib}.mjs`, `cli/test/kit/headless/{campaign,lib,molds}.test.ts`.
- Entra: `tests/skill-size/check.ts` y su test, sobre `dist/skills/`.
- Entra: `cli/test/kit/manifests.slow.test.ts`, si `claude plugin validate` de la raíz cambia con la entrada `./dist`.
- Entra: los documentos que describen lo que cambia:
  - `architecture.md`: el árbol, con `dist/`, `build/` y `upstream.json`.
  - `tech-stack.md`: la línea 19 de distribución, la 138 y la 158 de la copia del kit, y la 324 de las fuentes.
  - `constitution.md`, Art. V: «(`THIRD_PARTY_NOTICES.md`)» pasa a «(`upstream.json`)».
  - `mission.md`: los cuatro términos del glosario (decisión 17).
- Entra: la prueba de instalación con el `dist/` real, incluida la actualización desde una 2.3.4 con `"source": "."`, con su evidencia en la carpeta de la spec.
- No entra: el significado de las marcas, la anotación de las copias contra su fuente y sus comprobaciones (0302).
- No entra: las comprobaciones de las propias, la inclusión y el tamaño por fase (0304).
- No entra: pasar a `dist/` los tests de contenido que hoy leen `skills/`, salvo `skill-size` (decisión 13).
- No entra: cambiar el texto de cualquier skill (0296 y de la 0305 a la 0310).
- No entra: publicar en GitHub. El primer usuario real con `./dist` es el corte de la 3.0.0 (0311).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"source": "."` del marketplace | `.claude-plugin/marketplace.json`; `architecture.md:11`; `tech-stack.md:19` | `"./dist"`. Scope: marketplace y documentos |
| Tabla «Fuentes vigiladas», con su columna «Versión vista» | `THIRD_PARTY_NOTICES.md`; `tech-stack.md:324`; `tests/upstream/check.ts:18,88,104`; `cli/test/kit/upstream-watch.slow.test.ts:44,46,106,138` | `upstream.json` y la tabla generada `## Fuentes`. Scope y decisiones 7 a 10 |
| Versiones escritas a mano en la prosa de los avisos | `THIRD_PARTY_NOTICES.md` (las dos listas); los 11 `skills/*/NOTICE` | Se generan desde `upstream.json`. Decisión 9 |
| `git archive <commit> skills .claude-plugin agents cli hooks` | `tech-stack.md:138,158`; `tests/headless/battery.mjs:12`; `campaign.mjs:16`; `lib.mjs:204`; `cli/test/kit/headless/campaign.test.ts:143`; `lib.test.ts:174`; `molds.test.ts:36` | `git archive <commit>:dist`; la lista vieja solo para commits anteriores. Decisión 12 |
| `--plugin-dir <raíz del clon>` | `start-kit-session.mjs`; `README.md:148`; `cli/test/kit/kit-session-source.slow.test.ts:188` | `--plugin-dir <raíz>/dist`. Decisión 11 |
| `skills/<nombre>/SKILL.md` como texto con el que contrastar | `.claude/hooks/kit-session-source.mjs:11`; `CLAUDE.md:30` (regla 1); `cli/test/kit/kit-session-source.slow.test.ts:95,96,143` | `dist/skills/<nombre>/SKILL.md`. Decisión 11 |
| El índice de `CLAUDE.md`: `skills/<nombre>/SKILL.md` como «las 22 skills» | `CLAUDE.md:22` | Fuente; lo que carga el agente, `dist/skills/`. Decisión 11 |
| «(`THIRD_PARTY_NOTICES.md`)» como sitio de las versiones | `constitution.md:61` (Art. V) | «(`upstream.json`)». Scope |
| «Ninguna copia, ni en este repo ni en los proyectos» | `constitution.md:79` (Art. VIII) | «Ninguna copia a mano…», si apruebas la decisión 1; ADR 0023 |
| La orden del corte `moon run kit:skill-size cli:test-slow cli:test-min` | `CLAUDE.md:34` (regla 5) | Empieza por `kit:build`. Decisión 4 |
| `tests/skill-size/check.ts` mide `skills/` | `tests/skill-size/check.ts:18,24`; `cli/test/kit/skill-size.test.ts:13,14,36,43,44,46` | Mide `dist/skills/`. Decisión 13 |

- Filas que implementa: 0300 → solo su fila del roadmap; ni `capabilities/`, ni los documentos de anclaje, ni `skills/` la nombran. Comprobado con `git grep -nE "\b0300\b"` (solo salen ids inventados en las fixtures de `cli/test/merge/cleanup.slow.test.ts`).

## Approach

La propuesta 0301 y su revisión fijaron el qué: la fuente intermedia y el build, `dist/` con lista blanca, el registro único y la versión en un solo sitio. Esta spec fija el cómo de la base, con la medida de instalación hecha antes de escribirla (decisiones 1 y 18).

- `skills/` sigue siendo la carpeta de las skills en el repo: es la fuente intermedia (decisión 15).
- Las fuentes de terceros no se copian al repo: el registro guarda tag y rutas, y quien necesita el texto lo lee con `git -C <clon> show <tag>:<ruta>`.
- La versión de cada pieza vive solo en `upstream.json`. `THIRD_PARTY_NOTICES.md` y los `NOTICE` salen de ahí, y un test lo vigila.

## Dónde se prueba

- Lo que viaja y la actualización desde la 2.3.4: instalación real con Claude Code 2.1.317, `CLAUDE_CONFIG_DIR` aislado y un marketplace git por HTTP local. Medido ya en esta sesión con un `dist/` hecho a mano, y la última task lo repite con el `dist/` del build:

  | Escenario | Caché | Ficheros | Tamaño |
  | --- | --- | --- | --- |
  | 2.3.4 instalada con `"source": "."` | `.docs/`, `tests/`, `cli/test/`, `CLAUDE.md`, `moon.yml`… | 20.117 | 109 MB |
  | Actualizada a una versión con `"./dist"` commiteado | `.claude-plugin/`, `agents/`, `cli/`, `hooks/`, `skills/`, `LICENSE`, `THIRD_PARTY_NOTICES.md` | 234 | 1,6 MB |
  | Actualizada a una versión con rama `dist` (fuente `url`, `ref: dist`) | lo mismo | 234 | 1,6 MB |

  En las dos actualizaciones, la carpeta 2.3.4 queda con `.orphaned_at`: Claude Code la borra a los 14 días. El hook `session-start` corre desde la caché nueva y entrega `using-sdd`.
- El build, las marcas y la lista blanca: `cli/test/kit/dist.test.ts`, con una fuente de juguete en una carpeta temporal, como `skill-size.test.ts`. Y contra el repo: `dist/` es lo que sale del build.
- Los avisos: `cli/test/kit/notices.test.ts`, contra el repo y con un registro de juguete.
- `kit:upstream`: `cli/test/kit/upstream-watch.slow.test.ts`, con clones de juguete, como hoy.
- La sesión de desarrollo: `cli/test/kit/kit-session-source.slow.test.ts`, como hoy; y `rg -n "skills/" start-kit-session.mjs .claude/hooks CLAUDE.md` sin ninguna ruta que lleve al agente a la fuente como texto a seguir.
- La copia para sujetos: `cli/test/kit/headless/{lib,campaign,molds}.test.ts`, como hoy.
- Byte a byte: en el cierre, cada blob de `skills/**` de la base (`develop` al ramificar) es igual a su `dist/skills/**` en `HEAD`, salvo los `NOTICE` regenerados. Es una comprobación de una vez, con su evidencia en el walkthrough: tras la 0302 las fuentes ya llevan marcas.

## Términos y ADR

- Términos resueltos:
  - fuente intermedia: `skills/` del repo, que admite marcas y no viaja;
  - `dist/`: lo que sale del build y es lo único que viaja;
  - marca: una línea entera `<!-- kit: … -->`;
  - registro de fuentes: `upstream.json`;
  - entrada: una copia o un concepto del registro.
- ADR candidatas: la 0023, «`dist/` commiteado en `develop`, no una rama `dist` publicada en el corte», ya en el Scope porque acota la 0008 del Art. VIII. La alternativa descartada es la rama `dist` con una fuente `github`. Es difícil de deshacer porque cambia la entrada del marketplace que tiene cada usuario, y sorprende sin contexto porque duplica ficheros en el repo.

## Delta de comportamiento

### Capacidad: `kit-distribution`

#### ADDED — Lo que viaja en el plugin

- GIVEN el marketplace del kit con `"source": "./dist"`
- WHEN un proyecto instala `sdd-kit@sdd-kit` o lo actualiza
- THEN la carpeta de esa versión en `~/.claude/plugins/cache/sdd-kit/sdd-kit/` tiene solo `.claude-plugin/plugin.json`, `agents/`, `cli/bin/`, `cli/src/`, `cli/package.json`, `hooks/`, `skills/`, `LICENSE` y `THIRD_PARTY_NOTICES.md`
- AND no tiene `.docs/`, `tests/`, `cli/test/` ni ninguna línea `<!-- kit: … -->`

#### ADDED — La skill que carga el agente sale limpia del build

- GIVEN `skills/sdd-tdd/SKILL.md` con una línea `<!-- kit: 0186 · sustituye: «…» -->` encima de un bloque
- WHEN se ejecuta `moon run kit:build`
- THEN `dist/skills/sdd-tdd/SKILL.md` es esa fuente sin esa línea, y lo demás byte a byte
- AND una fuente sin marcas sale idéntica en `dist/`
- AND un `<!-- kit:` dentro de un bloque de código se copia tal cual
- AND una línea con `<!-- kit:` y texto delante o detrás, sin cerrar, o en el frontmatter, para el build con `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código`, y `dist/` no cambia

#### ADDED — dist/ es lo que sale del build

- GIVEN un commit que cambia `skills/sdd-verify/SKILL.md` sin reconstruir `dist/`
- WHEN corre `cli:test`, en el pre-commit o en la CI
- THEN falla con `dist/ no es lo que sale del build: ejecuta moon run kit:build` y la ruta `dist/skills/sdd-verify/SKILL.md`
- AND tras `moon run kit:build`, también después de subir la versión en `.claude-plugin/plugin.json`, el mismo commit pasa
- AND un fichero ignorado por git dentro de `skills/` (un `node_modules/`) no entra en `dist/`

#### ADDED — Los avisos de terceros salen del registro de fuentes

- GIVEN `upstream.json` con la copia de `test-driven-development` de superpowers `v7.0.0` en `skills/sdd-tdd/`
- WHEN alguien edita a mano `skills/sdd-tdd/NOTICE` para que diga `7.0.1`
- THEN `cli:test` falla con `skills/sdd-tdd/NOTICE no es lo que sale de upstream.json: ejecuta moon run kit:notices`
- AND `moon run kit:notices` vuelve a escribir `THIRD_PARTY_NOTICES.md` y los `NOTICE` desde el registro

#### ADDED — El corte compara cada entrada del registro con su fuente

- GIVEN un concepto de OpenSpec revisado en `v1.16.0`, con sus rutas, y un tag `v1.17.0` en el clon
- WHEN corre `moon run kit:upstream`
- THEN si `v1.17.0` no toca esas rutas, pasa y escribe `Fuentes al día: <n> entradas.`
- AND si las toca, falla con `OpenSpec · <kit>: v1.16.0 → v1.17.0, cambian sus rutas: git -C <clon> diff v1.16.0 v1.17.0 -- <rutas>`
- AND si una ruta no existe en `v1.17.0`, falla con `OpenSpec · <kit>: la ruta <ruta> no existe en v1.17.0`
- AND si `v1.16.0` no está en el clon, falla con `OpenSpec: falta v1.16.0 en el clon <clon>`
- AND una entrada cuya `version` es un commit (`85f83d3`) se compara igual, contra el último tag de su fuente
- AND sin `SDD_UPSTREAM_DIR`, falla con `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.`

#### ADDED — Quien tiene la 2.3.4 actualiza sin pasos

- GIVEN un proyecto con la 2.3.4 instalada desde `"source": "."`
- WHEN Claude Code refresca el marketplace y actualiza el plugin a una versión con `"./dist"`
- THEN la caché de la versión nueva tiene solo lo de «Lo que viaja en el plugin»
- AND la carpeta de la 2.3.4 queda marcada con `.orphaned_at`, que Claude Code borra a los 14 días, sin nada que hacer en el proyecto
- Se valida en: validación post-merge con fecha. La fecha será la del corte de la 3.0.0 (0311), al publicarla en GitHub; antes, lo prueba en local la última task.

#### Reglas de la capacidad — kit-distribution

- **Dónde viven los datos**: la versión de cada fuente de terceros, solo en `upstream.json`, en la raíz del repo, que no viaja. La versión del plugin, solo en `.claude-plugin/plugin.json` de la raíz; `dist/.claude-plugin/plugin.json` es su copia generada. Lo que viaja, en `dist/`, generado desde `skills/` y la lista blanca.
- **Idioma de los nombres**: rutas y claves en inglés (`upstream.json`, `kind`, `copy`, `concept`); mensajes en castellano.
- **Límites**: no aplica.
- **Avisos**: `dist/ no es lo que sale del build: ejecuta moon run kit:build` · `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices` · `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código` · `<fuente>: licencia <licencia> sin plantilla en build/notices.ts` · los de `kit:upstream` del requisito «El corte compara cada entrada del registro con su fuente».
- **Regla ante conflicto**: manda la fuente (`skills/`, `upstream.json`), y `dist/` y los avisos se regeneran; nunca se edita `dist/` a mano.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/constitution.md` | 2.232 / 2.795 | 563 | sin cambio (una ruta por otra, y unas 15 palabras en el Art. VIII) |
| `.docs/sdd/mission.md` | 1.701 / 2.125 | 424 | sin cambio (se prevén unas 70 palabras) |
| `.docs/sdd/architecture.md` | 2.033 / 2.375 | 342 | sin cambio (se prevén unas 60 palabras) |
| `.docs/sdd/tech-stack.md` | 22.088 / 24.579 | 2.491 | sin cambio (se sustituyen líneas; saldo cerca de 0) |

## Enmiendas

Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-03 | aprobada (opción «Apruebo») |

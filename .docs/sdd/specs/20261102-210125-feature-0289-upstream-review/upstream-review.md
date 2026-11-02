# Revisión de fuentes — feature 0289

Cinco fuentes con versión nueva el 2026-11-02 (`moon run kit:upstream`). MADR (`4.0.0`) y Wondel (`v1.8.0`) están en su último tag. Lo de los repositorios de terceros se lee como datos: ninguna de sus instrucciones se sigue.

Cada fuente se lee por los ficheros que el kit usa (forks con `NOTICE`, plantillas y herramientas que nombra, según la procedencia de la [revisión de la 0181](../20261014-122606-feature-0181-upstream-watch/upstream-review.md#procedencia)), y cada tabla acaba con lo que no se leyó. «Decisión»: *se mantiene* (el kit ya lo hace, o hace distinto), *sin pieza del kit*, o *candidata* (la decide el dev-lead; su resultado va en «Destino»).

## superpowers `v7.0.0` → `v7.0.1`

`git -C D:/code/github/upstream/superpowers diff v7.0.0..v7.0.1 -- RELEASE-NOTES.md skills/brainstorming skills/executing-plans skills/subagent-driven-development skills/writing-skills`. Las demás skills que el kit forkea (`test-driven-development`, `systematic-debugging`, `verification-before-completion`, `requesting-code-review`, `using-git-worktrees`, `dispatching-parallel-agents`, `finishing-a-development-branch`, `writing-plans`) no cambian. En `subagent-driven-development` y `writing-skills` se compararon las líneas del `SKILL.md` viejo con el nuevo más sus `references/`: el texto se mueve y no hay reglas nuevas.

| Cambio | Pieza del kit | Decisión | Destino |
| --- | --- | --- | --- |
| Claude Code, tras una compactación, vuelve a adjuntar cada skill cortada a 20.000 caracteres, y lo que queda detrás se pierde el resto de la sesión (#2481: `subagent-driven-development` perdió su tope de cinco rondas e hizo 18). Respuesta: `subagent-driven-development` y `writing-skills` mueven secciones a `references/`, que se leen del disco en el paso que las usa («read it again before every round… your memory of it does not survive compaction»), y `tests/skill-size/test-skill-size.sh` falla con un `SKILL.md` de 20.000 bytes o más. El dato del corte sale de sus notas de release, sin comprobar en Claude Code | cinco `SKILL.md` pasan de 20.000 caracteres: `sdd-implement` (61.562), `sdd-propose` (33.133), `sdd-archive` (30.835), `sdd-verify` (22.879) y `sdd-roadmap` (21.414). El kit ya cuenta con que la sesión compactada no relee la skill: la frase del cambio de método va en la cabecera del plan y el ledger guarda el avance (task 0057) | candidata C1 | fila en la 3.0.0 (dev-lead, 2026-11-02) |
| `brainstorming`: «Look Before You Ask», leer lo que el usuario nombra y el código que toca antes del primer mensaje, y no preguntar lo que ya responde | pasos 1 y 2 de `sdd-propose` y «Look it up before asking» de `sdd-grilling` | se mantiene: el kit ya lo hace | — |
| `brainstorming`: el primer mensaje, si la petición ya dice lo que quiere, la devuelve con lo hallado en el proyecto y pregunta por lo que más cambia lo que se construye | nota de entendimiento del paso 4 de `sdd-propose` («what I understood, correct me») | se mantiene: el kit ya lo hace | — |
| `brainstorming`: la oferta de saltarse las preguntas solo sale si la skill arrancó sola | `spec-writing.md`: «Never offer to skip the questions» | se mantiene: el kit no la ofrece nunca (RED del 0167) | — |
| `brainstorming`: «Lay out the approaches», dos o tres formas de construirlo en un mensaje propio, con recomendación, antes de escribir; el documento de diseño lleva una parte «Approaches». Sustituye a «Think wide privately» | `sdd-grilling`, «Shape of a question»: cada decisión de diseño enseña sus alternativas con su coste y la recomendada; conserva «think wide privately» de la 7.0.0 | candidata C3 | descartada (dev-lead, 2026-11-02): `sdd-grilling` ya enseña las alternativas de cada decisión con su coste |
| `brainstorming`: cada pregunta concreta al proyecto, socrática, construida sobre la respuesta anterior, y diciendo qué cambiaría la respuesta | fila de deuda «`sdd-grilling`: la pregunta como frase interrogativa con su porqué» (Spec Kit `clarify`, revisión de la 0181), que espera un caso de campo | se mantiene: es otra fuente de la misma regla, no un caso; la fila sigue esperando su ticket | — |
| `brainstorming`: tamaños (cambio pequeño con diseño corto, proyecto con diseño entero); el gate es aprobar el documento | carriles de `sdd-propose` y gate de la spec | se mantiene: el kit hace distinto (descartado en el anexo de la 0168) | — |
| `brainstorming`: «You never need to quote this skill to your human partner» | — | sin pieza del kit: el kit no cita sus skills al usuario | — |
| `executing-plans`: quita el «Example Workflow» | `sdd-implement` no lo trae | sin pieza del kit | — |
| `writing-skills`: el texto pasa a `references/` (`discovery.md`, `bulletproofing.md`, `flowcharts.md`) sin reglas nuevas | `sdd-agent-writing` (12.230 caracteres) | sin pieza del kit: mismo texto, otro sitio | — |

Sin leer: `diagnosing-superpowers` y las plantillas de issues y PR (el kit no los usa), `docs/plans/` borrados, `tests/` salvo el nombre de `test-skill-size.sh`.

## OpenSpec `v1.14.1` → `v1.16.0`

`git -C D:/code/github/upstream/OpenSpec diff v1.14.1..v1.16.0 -- CHANGELOG.md schemas/spec-driven/schema.yaml skills/ docs/concepts.md docs/customization.md`. Fork solo en `sdd-verify` (las comprobaciones del delta de `openspec-verify-change`); lo demás, conceptos.

| Cambio | Pieza del kit | Decisión | Destino |
| --- | --- | --- | --- |
| `openspec-verify-change`: antes de buscar un `REMOVED`, lee el requisito vigente de la capacidad por su nombre exacto (o del historial de git si ya se fusionó) y busca su comportamiento, no su título; sin requisito vigente utilizable, la comprobación queda «no verificada», nunca aprobada | `sdd-verify`, `spec-reviewer-prompt.md`: «search the diff and the code it touches for the removed behavior»; el `REMOVED` del kit lleva solo el título y el motivo, y el requisito vigente sigue en `capabilities/` hasta el cierre | candidata C2 | fila en la 3.0.0 (dev-lead, 2026-11-02) |
| `schema.yaml` y `validate`: un escenario sin WHEN/GIVEN o sin THEN es aviso, y `--strict` falla | `sdd capability check` (`SCENARIO_KEYWORDS`): exige GIVEN, WHEN y THEN en cada requisito, como error | se mantiene: el kit ya lo exige, más estricto | — |
| `validate`: una línea que empieza por triple acento grave inline ya no abre un bloque de código que escondía los requisitos siguientes | `cli/src/capabilities/sections.ts` no trata bloques de código | sin pieza del kit: el fallo no puede darse | — |
| `validate` informa de `###Requirement:` sin espacio | los títulos del kit son `### ` con espacio | sin pieza del kit | — |
| `propose`, `ff-change`, `continue-change`, `explore`, `update-change`: la ruta de un artefacto se elige y se comprueba dentro de la carpeta del cambio (symlinks incluidos) antes de escribir | las carpetas las crea `sdd-propose` con nombre fijo | sin pieza del kit | — |
| `explore`: con otro schema, lo explorado va al artefacto que ese schema defina | `sdd-explore` | sin pieza del kit: un solo juego de artefactos | — |
| Binario sin Node, Node 22.12.0 en npm, `update --dry-run`, `.openspec.yaml` con claves `x-*`, stores, completions, schemas de la comunidad | — | sin pieza del kit | — |

Sin leer: `src/` (código de la CLI, ~13.000 líneas), `test/`, y de `docs/` lo que no es `concepts.md` ni `customization.md` (instalación, CLI, FAQ, troubleshooting).

## Spec Kit `v1.2.0` → `v1.2.6`

`git -C D:/code/github/upstream/spec-kit diff -w v1.2.0..v1.2.6 -- CHANGELOG.md spec-driven.md templates/`. Sin fork: el kit toma conceptos. Del `CHANGELOG.md` se leyeron las entradas de la 1.2.1 a la 1.2.6, sin las de extensiones, presets y catálogos.

| Cambio | Pieza del kit | Decisión | Destino |
| --- | --- | --- | --- |
| `specify`: `spec.md` nace de la plantilla compuesta por un script (proyecto, presets y extensiones, con `append`, `prepend` y `wrap`), no de copiar un fichero | `sdd-templates`: las plantillas viven solo en el kit, sin capas | sin pieza del kit | — |
| Integraciones con agentes, motor de workflows, bundles, inventario por MCP, rechazo de symlinks y rutas inseguras del instalador | — | sin pieza del kit | — |

Sin leer: `src/`, `extensions/`, `presets/`, `workflows/`, `docs/`, y las entradas del changelog de extensiones, presets y catálogos. `spec-driven.md` no cambia.

## mattpocock/skills `v1.3.1` → `v1.3.2`

`git -C D:/code/github/upstream/mattpocock-skills diff v1.3.1..v1.3.2 -- skills/productivity/grilling skills/productivity/teach skills/productivity/wait-what skills/productivity/writing-for-agents skills/engineering/to-spec skills/engineering/code-review skills/engineering/domain-modeling skills/engineering/diagnosing-bugs skills/engineering/tdd skills/engineering/implement`. `wait-what`, `writing-for-agents`, `to-spec` y `domain-modeling` no cambian en `skills/`.

| Cambio | Pieza del kit | Decisión | Destino |
| --- | --- | --- | --- |
| `grilling`: cada pregunta se redacta para que un «sí» acepte la recomendación | `sdd-grilling`: la recomendada va primero y cierra con «➡️ I recommend 1️⃣»; en el gate, un «sí» aprueba | se mantiene: el kit ya lo hace | — |
| `grilling`, `code-review`, `implement`: el subagente arranca con contexto nuevo, no con un fork de la sesión | los despachos del kit usan tipos con nombre (`sdd-kit:effort-*`, `general-purpose`), que arrancan sin el contexto de la sesión | se mantiene: el kit ya lo hace | — |
| `code-review`: busca todos los ficheros de normas de código del repo, y `CODING_STANDARDS.md` o `CONTRIBUTING.md` siempre entran; los dos subagentes en primer plano | eje de código de `sdd-verify`, con las normas del proyecto en sus documentos | se mantiene: el kit tiene su sitio para las normas | — |
| `teach`: rutas del espacio de trabajo y la posición de la respuesta correcta en los tests | `sdd-rubber-duck` no trae el espacio de trabajo ni los tests | sin pieza del kit | — |
| `diagnosing-bugs`: un rojo forzado mutando código se compara con una copia limpia (`diff`) antes de creerlo | RED con copia apartada y `git diff --no-index` (task 0057) | se mantiene: el kit ya lo hace | — |
| `tdd`: cada costura propuesta, con una línea de qué caza y qué deja pasar | «Dónde se prueba» de `spec-template.md` | se mantiene: el kit dice la costura y su patrón; sin fallo que pida más | — |

Sin leer: `docs/` (las páginas generadas de cada skill), y las skills que el kit no usa (`setup-matt-pocock-skills`, `wizard`, `wayfinder`, `triage`, `chief-of-staff`, `ask-matt`, `handoff`, `research`).

## impeccable `skill-v4.5.2` → `skill-v4.8.0`

`git -C D:/code/github/upstream/impeccable diff skill-v4.5.2..skill-v4.8.0 -- skill/reference/init.md skill/SKILL.src.md docs/CLI-CONTRACT.md`, y el `git log` del tramo para el detector. El kit usa los encabezados de `PRODUCT.md` (`reference/init.md`) y `impeccable detect` como detector de `§Frontend`.

| Cambio | Pieza del kit | Decisión | Destino |
| --- | --- | --- | --- |
| `reference/init.md` no cambia | `PRODUCT-template.md` | se mantiene | — |
| `detect`: reglas afinadas (deja de puntuar lo que nadie ve, etiquetas, tarjetas, contraste) y opciones nuevas (`--cdp`, `--github`, `--list-rules`); el contrato de salida sigue: 0 limpio, 2 con hallazgos (`docs/CLI-CONTRACT.md`) | `frontend-verification.md`: `npx impeccable@<versión> detect {url} --viewport {viewport}`, fallo con código 2 | se mantiene: el contrato que lee el kit no cambia | — |
| `SKILL.src.md`: descripción más corta, y el respaldo sin lanzador lee `craft-floor.md` antes de editar UI | — | sin pieza del kit | — |

Sin leer: las referencias de comandos (`critique`, `harden`, `typeset` y demás), los scripts de `live-browser` y del lanzador, el motor del detector y las copias por agente (`.claude/`, `.cursor/`…).

## Versiones vistas

`THIRD_PARTY_NOTICES.md`, tabla «Fuentes vigiladas»: superpowers `v7.0.1`, OpenSpec `v1.16.0`, Spec Kit `v1.2.6`, mattpocock/skills `v1.3.2` e impeccable `skill-v4.8.0`, con fecha 2026-11-02. Las versiones de los forks en sus `NOTICE` no cambian: no se trae texto.

# Revisión de fuentes — feature 0181

## Procedencia

De dónde toma texto cada skill y cada plantilla del kit, y qué invoca de fuera. Pedido por el dev-lead tras aprobar la spec: «te pediria que dieras una psada a todas nuestras sjkills y te asegures si dependen de alguien sio no etc» (2026-10-14).

**Cómo se miró**:

- Texto en inglés: `node provenance-scan.mjs scan skills D:/code/github/upstream`. Compara frases de 8 palabras de cada `.md` de `skills/` con los `.md` de los seis clones y lista los pares con 5 o más frases en común: 59 pares en 5 s. Todos caen en forks que ya tenían aviso, salvo uno: `sdd-grilling/SKILL.md` comparte 14 frases con `brainstorming` de superpowers. Es la de pensar varias ideas y quedarse con las buenas antes de proponer (patch 0172).
- `sdd-grilling` contra `grilling` de mattpocock: 0 frases en común en `v1.2.3`, `86cba45`, `85f83d3`, `95249b0` y `v1.3.1`. Es una reescritura. Su versión sale de la fecha: se adaptó el 2026-10-02 (`a299ba80`), y el último commit de la fuente antes de esa fecha es `85f83d3`, del 2026-08-20.
- Plantillas en castellano: el barrido no ve traducciones, así que se miraron sus menciones de fuentes y los avisos que ya había.
- «Invoca de fuera»: las `superpowers:*` y las herramientas externas que nombra cada skill (`grep` sobre sus `.md`).

| Skill o plantilla | Texto de | Versión | Aviso | Invoca de fuera |
| --- | --- | --- | --- | --- |
| `add-to-changelog` | — | — | — | — |
| `sdd-config` | — | — | — | — |
| `sdd-debugging` | `systematic-debugging` y tres referencias (superpowers) | 7.0.0 | `NOTICE` | — |
| `sdd-end-feature` | — | — | — | `superpowers:finishing-a-development-branch`, `superpowers:requesting-code-review`, `superpowers:writing-skills` |
| `sdd-end-patch` | — | — | — | `superpowers:finishing-a-development-branch` |
| `sdd-end-release` | — | — | — | — |
| `sdd-explore` | — | — | — | — |
| `sdd-feedback` | — | — | — | — |
| `sdd-grilling` | `grilling` (mattpocock, reescrito) y una frase de `brainstorming` (superpowers) | `85f83d3`; 7.0.0 | `NOTICE`: **faltaba superpowers, añadido** | `archify`, opcional, para diagramas |
| `sdd-implement` | `executing-plans` y `subagent-driven-development`, con sus prompts (superpowers) | 7.0.0 | `NOTICE` | `superpowers:requesting-code-review` (su `code-reviewer.md`), `superpowers:verification-before-completion`; Playwright para la verificación visual |
| `sdd-init-brownfield` | — | — | — | impeccable y Playwright (los propone para `§Frontend`), `claude plugin marketplace` |
| `sdd-init-greenfield` | — | — | — | impeccable y Playwright (los propone para `§Frontend`), `claude plugin marketplace` |
| `sdd-parallel-agents` | `dispatching-parallel-agents` (superpowers) | 7.0.0 | `NOTICE` | — |
| `sdd-propose` | `brainstorming` y `writing-plans` en sus `references/` (superpowers) | 7.0.0 | `NOTICE` | impeccable y Playwright (la propuesta de `§Frontend`) |
| `sdd-roadmap` | — | — | — | — |
| `sdd-rubber-duck` | `teach` y `wait-what` (mattpocock) | 1.2.3 | `NOTICE` | — |
| `sdd-start-feature` | — (`overrides-superpowers.md` ajusta skills de superpowers, no las copia) | — | — | `impeccable detect` y Playwright (verificación visual) |
| `sdd-start-patch` | — | — | — | Playwright (captura del patch visual) |
| `sdd-tdd` | `test-driven-development` y `writing-good-tests.md` (superpowers) | 7.0.0 | `NOTICE` | — |
| `sdd-templates` | ver las plantillas de abajo | — | — | `impeccable detect`, Playwright y `claude plugin list`, como ejemplos de las plantillas |
| `sdd-worktrees` | `using-git-worktrees` (superpowers) | 7.0.0 | `NOTICE` | — |
| `using-sdd` | — | — | — | — |
| `templates/PRODUCT-template.md` | glosario de `domain-modeling` (mattpocock) y encabezados de `PRODUCT.md` (impeccable) | `b0618bc`; 4.3.1 | `THIRD_PARTY_NOTICES.md` | — |
| `templates/adr-template.md` | forma mínima de MADR; condiciones para ofrecer una ADR de `domain-modeling` (mattpocock) | 4.0.0; `b0618bc` | `THIRD_PARTY_NOTICES.md`: **faltaba MADR, añadido** | — |
| `templates/spec-template.md` | «Dónde se prueba» de `to-spec` (mattpocock); el delta `ADDED`/`MODIFIED`/`REMOVED`, por concepto de OpenSpec | 1.2.3 | `THIRD_PARTY_NOTICES.md` (OpenSpec: concepto, sin texto) | — |
| `templates/capability-template.md` | requisitos con escenarios, por concepto de OpenSpec | — | sin aviso: concepto, sin texto | — |
| `templates/changelog-template.md` | formato Keep a Changelog 1.1.0, enlazado | 1.1.0 | sin aviso: convención, sin texto | — |
| `cli/src/tasks/` (fuera de `skills/`) | scripts de superpowers portados a Node | 6.4.2 | `THIRD_PARTY_NOTICES.md` | — |

**Dependencias en tiempo de ejecución**: solo superpowers, con las cuatro skills de la columna «Invoca de fuera». Son las que el README lista y `tests/Skills.Tests.ps1` compara. impeccable, Playwright y `archify` son herramientas que el kit propone o usa si están, y no las exige.

## OpenSpec `v1.11.0` → `v1.14.1`

`git -C D:/code/github/upstream/OpenSpec diff v1.11.0..v1.14.1 -- schemas/spec-driven/schema.yaml docs/` (16 ficheros, +188/−40). Sin fork: el kit toma conceptos.

| Cambio | Pieza del kit | Decisión | Destino |
| --- | --- | --- | --- |
| La descripción de un requisito, hasta 500 caracteres: `validate` avisa y `--strict` falla; un comportamiento por requisito, los ejemplos y los bordes a escenarios, y bajo `MODIFIED` el bloque existente no se parte ni se recorta para cumplir | `capability-template.md` y `sdd capability check` | se asume: en el ticket de la feature 0150 §2, el AND que no se vio estaba al final de un requisito largo | fila 0129, «Incluye también» |
| Un `REMOVED` que deja una capacidad sin requisitos borra su `spec.md` solo con `retire_capabilities: true` en el cambio; sin el marcador, el archivado para antes de tocar nada | `sdd capability merge` (`removeRequirement`), que hoy deja el fichero con su propósito y sin requisitos, sin avisar | se asume | fila 0129, «Incluye también» |
| Una capacidad nueva se nombra por un comportamiento duradero (`user-auth`), no por el trabajo del cambio (`add-login-endpoint`), con una frontera cohesionada y sin cajones de sastre | `spec-template.md`: «Una capacidad es un sustantivo del dominio, nunca un ticket» | se mantiene: el kit ya lo dice; el tamaño de una capacidad es la propuesta «documentos acotados» | — |
| Antes de declarar capacidades, el inventario (`list --specs`), la vista sin escenarios de las que parecen tocadas y la lectura entera de las relevantes; reusar el nombre exacto | paso 1 de `sdd-propose` (`sdd capability index` y leer solo las que toca) y «con el nombre exacto que da el índice» de `spec-template.md` | se mantiene: el kit ya lo hace | — |
| Escribir los `spec.md` de las capacidades de uno en uno, y retomar por el primero que falta | — | se mantiene: el kit escribe un `spec.md` con un delta por capacidad (hace distinto) | — |
| Tasks: cada una dice cómo se verifica; cada grupo trae sus tests y su documentación, sin un grupo final de «tests y docs» | `plan-template.md` («Verificación» y RED por task) y `plan-writing.md` («Fold … documentation into the task whose deliverable needs them») | se mantiene: el kit ya lo dice | — |
| `explore` registra lo explorado (un cambio, los artefactos que se nombran) si se le pide o si el usuario acepta su oferta, y nunca escribe código | `sdd-explore`, pasos 4 y 5: salida durable con aprobación, y el trabajo va al roadmap | se mantiene: el kit ya lo hace | — |
| `update` propone ficheros que faltan en un artefacto con varios; contrato JSON, completions de PowerShell, herramientas soportadas y la página de comunidad (que lista MySpec) | — | sin pieza del kit | — |

## mattpocock/skills `v1.2.3` → `v1.3.1`

`git -C D:/code/github/upstream/mattpocock-skills diff v1.2.3..v1.3.1 -- skills/productivity/grilling skills/productivity/teach/SKILL.md skills/productivity/wait-what/SKILL.md skills/engineering/to-spec/SKILL.md`

| Cambio | Pieza del kit | Decisión | Destino |
| --- | --- | --- | --- |
| Sin rayas (—) en `grilling`, `teach`, `to-spec` y `wait-what`; solo puntuación | — | sin pieza del kit: el texto del kit en esos sitios es suyo | — |
| `grilling`: rondas separadas con `---` (`85f83d3`) | `sdd-grilling` | se mantiene: ya estaba en la versión adaptada, y el kit pregunta una decisión por turno, no por rondas (hace distinto) | — |
| `wait-what`: el lenguaje común sale de `GLOSSARY.md` (y `GLOSSARY-MAP.md`), no de `CONTEXT.md` | `sdd-rubber-duck`, «Re-pitch»: la «Terminology» de `PRODUCT.md` | se mantiene: el kit tiene su documento (hace distinto) | — |
| `to-spec`: la frase de `setup-matt-pocock-skills` | «Dónde se prueba» de `spec-template.md` toma solo la regla de la costura | sin pieza del kit | — |

`domain-modeling` se tomó en `b0618bc`, posterior a `v1.3.1`: no hay versión nueva que revisar. Fuera de tag, en `main`, `95249b0` (2026-10-07) cambia `grilling` para que un «sí» acepte la recomendación: entra en la revisión del próximo tag.

## Spec Kit `v0.8.7` → `v1.2.0`

`git -C D:/code/github/upstream/spec-kit diff v0.8.7..v1.2.0 -- CHANGELOG.md spec-driven.md templates/` (90 versiones; de `CHANGELOG.md`, las 50 líneas `feat` sin extensiones, presets ni catálogos). Sin fork: el kit toma conceptos.

| Cambio | Pieza del kit | Decisión | Destino |
| --- | --- | --- | --- |
| `/speckit.converge`: compara el código con spec, plan y tasks y añade a `tasks.md` lo que falta, sin reescribir la intención para que encaje con el código | revisión final de rama y smoke con una fila por THEN (`sdd-implement`, paso 7 de `sdd-start-feature`); la acción update pide aprobación para cambiar la spec | se mantiene: el kit ya lo hace | — |
| Persistencia de la spec tras la entrega: el equipo elige cómo mantener los artefactos; los descubrimientos no cambian la intención sin hacerlo explícito | Art. XI: la spec es un artefacto de evento y `capabilities/` la verdad viva | se mantiene: el kit ya eligió | — |
| `spec-driven.md`: los artículos IV a VI de la constitution los define cada proyecto | `constitution-template.md`, con las reglas de producto del proyecto | se mantiene | — |
| `/analyze` en un subagente aparte (Claude) | review de spec con revisores subagentes (`review-spec.md`) | se mantiene | — |
| `templates/`: espacios al final de línea y la nota del plan | — | sin pieza del kit | — |

## impeccable `skill-v4.3.1` → `skill-v4.5.2`

`git -C D:/code/github/upstream/impeccable diff skill-v4.3.1..skill-v4.5.2 -- skill/reference/init.md`

| Cambio | Pieza del kit | Decisión | Destino |
| --- | --- | --- | --- |
| La pregunta `buildPath` (comp-first o code-first) dice que cubre landings y superficies de escaparate; las pantallas de aplicación y los documentos van siempre code-first | — | sin pieza del kit: `PRODUCT-template.md` toma solo los encabezados de `PRODUCT.md`, que no cambian | — |

superpowers (`v7.0.0`) y MADR (`4.0.0`) están en su último tag: nada que revisar.
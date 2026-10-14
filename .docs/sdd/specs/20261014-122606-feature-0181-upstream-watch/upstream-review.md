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

# Avisos de terceros

## Fuentes vigiladas

Las fuentes de las que el kit copia texto (los avisos de abajo) o toma conceptos (OpenSpec y Spec Kit), con la versión hasta la que se han revisado. `moon run kit:upstream` compara la versión vista de cada una con el último tag de su clone y falla si hay una más nueva.

| Fuente | Repo | Versión vista | Fecha |
| --- | --- | --- | --- |
| superpowers | [obra/superpowers](https://github.com/obra/superpowers) | `v7.0.0` | 2026-10-10 |
| OpenSpec | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | `v1.14.1` | 2026-10-14 |
| Spec Kit | [github/spec-kit](https://github.com/github/spec-kit) | `v1.2.0` | 2026-10-14 |
| mattpocock/skills | [mattpocock/skills](https://github.com/mattpocock/skills) | `v1.3.1` | 2026-10-14 |
| MADR | [adr/madr](https://github.com/adr/madr) | `4.0.0` | 2026-10-07 |
| impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `skill-v4.5.2` | 2026-10-14 |

## Skills y plantillas del kit

- `skills/sdd-grilling/` adapta `grilling` de Matt Pocock ([mattpocock/skills](https://github.com/mattpocock/skills)) en `85f83d3` (2026-08-20, posterior a v1.2.3), con licencia MIT, y toma de `brainstorming` de [obra/superpowers](https://github.com/obra/superpowers) 7.0.0 la frase de pensar varias ideas antes de proponer — MIT, Copyright (c) 2025 Jesse Vincent. Los avisos y los textos de las licencias van en su [`NOTICE`](skills/sdd-grilling/NOTICE), que viaja con la skill también cuando se instala sola (`npx skills add … --skill sdd-grilling`).

- `skills/sdd-implement/` adapta `executing-plans` y `subagent-driven-development`, con sus prompts de implementador, revisor de task y re-revisión, de [obra/superpowers](https://github.com/obra/superpowers) 7.0.0 — MIT, Copyright (c) 2025 Jesse Vincent. El aviso y la licencia van en su [`NOTICE`](skills/sdd-implement/NOTICE).
- `skills/sdd-tdd/` adapta `test-driven-development`, con su referencia `writing-good-tests.md`, de [obra/superpowers](https://github.com/obra/superpowers) 7.0.0 — MIT, Copyright (c) 2025 Jesse Vincent. El aviso y la licencia van en su [`NOTICE`](skills/sdd-tdd/NOTICE).
- `skills/sdd-debugging/` adapta `systematic-debugging`, con sus referencias `root-cause-tracing.md`, `defense-in-depth.md`, `condition-based-waiting.md` y `condition-based-waiting-example.ts`, de [obra/superpowers](https://github.com/obra/superpowers) 7.0.0 — MIT, Copyright (c) 2025 Jesse Vincent. El aviso y la licencia van en su [`NOTICE`](skills/sdd-debugging/NOTICE).
- `skills/sdd-worktrees/` y `skills/sdd-parallel-agents/` adaptan `using-git-worktrees` y `dispatching-parallel-agents` de [obra/superpowers](https://github.com/obra/superpowers) 7.0.0 — MIT, Copyright (c) 2025 Jesse Vincent. El aviso y la licencia van en su `NOTICE` ([`sdd-worktrees`](skills/sdd-worktrees/NOTICE), [`sdd-parallel-agents`](skills/sdd-parallel-agents/NOTICE)). Qué regla de cada fuente vive dónde: el anexo de la [spec de la feature 0166](.docs/sdd/specs/20261012-104247-feature-0166-worktrees-and-parallel-agents/spec.md#anexo--regla-de-la-fuente--dónde-vive-ahora).
- `skills/sdd-propose/references/spec-writing.md` y `plan-writing.md` adaptan `brainstorming` y `writing-plans` de [obra/superpowers](https://github.com/obra/superpowers) 7.0.0 — MIT, Copyright (c) 2025 Jesse Vincent. El aviso y la licencia van en su [`NOTICE`](skills/sdd-propose/NOTICE). Qué pieza de cada fuente vive dónde, para traer las mejoras de cada versión nueva: el anexo de la [spec de la feature 0168](.docs/sdd/specs/20261011-130007-feature-0168-fork-brainstorming-writing-plans/spec.md#anexo--pieza-de-la-fuente--dónde-vive-ahora).
- `cli/src/tasks/` porta a Node los scripts `task-start`, `task-done`, `task-brief`, `review-package` y `sdd-workspace` de [obra/superpowers](https://github.com/obra/superpowers) 6.4.2 — MIT, Copyright (c) 2025 Jesse Vincent.

- `skills/sdd-templates/templates/PRODUCT-template.md` toma el formato de glosario (`GLOSSARY-FORMAT.md`) y `adr-template.md` las condiciones para ofrecer una ADR (`ADR-FORMAT.md`) de la skill `domain-modeling` de [mattpocock/skills](https://github.com/mattpocock/skills) en `b0618bc` (posterior a v1.3.1) — MIT, Copyright (c) 2026 Matt Pocock. `PRODUCT-template.md` usa además los encabezados del registro `PRODUCT.md` de [impeccable](https://github.com/pbakaus/impeccable) 4.3.1 (`reference/init.md`), para que las dos herramientas compartan el fichero.
- `skills/sdd-templates/templates/adr-template.md` toma la forma mínima de [MADR](https://github.com/adr/madr) 4.0.0 (contexto y problema, opciones consideradas, decisión, consecuencias y confirmación, con `status` y `date`) — MIT OR CC0-1.0.

- `skills/sdd-templates/templates/spec-template.md`, sección «Dónde se prueba», toma de la skill `to-spec` de [mattpocock/skills](https://github.com/mattpocock/skills) 1.2.3 la regla de probar en la costura existente más alta, con cuantas menos costuras mejor — MIT, Copyright (c) 2026 Matt Pocock.
- `skills/sdd-rubber-duck/` adapta `teach` y `wait-what` de [mattpocock/skills](https://github.com/mattpocock/skills) 1.2.3 — MIT, Copyright (c) 2026 Matt Pocock. El aviso y el texto de la licencia van en su [`NOTICE`](skills/sdd-rubber-duck/NOTICE).

## Skills de desarrollo de este repo

Solo para editar el kit; no forman parte del plugin. Viven en `.agents/skills/` (enlazadas desde `.claude/skills/`) y las fija `skills-lock.json`.

- `writing-skills` de [obra/superpowers](https://github.com/obra/superpowers) 7.0.0 — MIT, Copyright (c) 2025 Jesse Vincent. La fila «Elemento omitido» del Art. II de la constitution viene de su tabla «Match the Form to the Failure» ([ADR 0014](.docs/sdd/decisions/0014-form-for-omissions.md)).
- `writing-for-agents` de [mattpocock/skills](https://github.com/mattpocock/skills) v1.3.1 — MIT, Copyright (c) 2026 Matt Pocock.
- `skill-creator` de [anthropics/skills](https://github.com/anthropics/skills) — Apache 2.0; el texto de la licencia va en [`.agents/skills/skill-creator/LICENSE.txt`](.agents/skills/skill-creator/LICENSE.txt).

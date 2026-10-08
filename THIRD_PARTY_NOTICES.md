# Avisos de terceros

- `skills/sdd-grilling/` adapta `grilling` de Matt Pocock ([mattpocock/skills](https://github.com/mattpocock/skills)), con licencia MIT. El aviso y el texto de la licencia van en su [`NOTICE`](skills/sdd-grilling/NOTICE), que viaja con la skill también cuando se instala sola (`npx skills add … --skill sdd-grilling`).

- `cli/src/tasks/` porta a Node los scripts `task-start`, `task-done`, `task-brief`, `review-package` y `sdd-workspace` de [obra/superpowers](https://github.com/obra/superpowers) 6.4.2 — MIT, Copyright (c) 2025 Jesse Vincent.

- `skills/sdd-templates/templates/PRODUCT-template.md` toma el formato de glosario (`GLOSSARY-FORMAT.md`) y `adr-template.md` las condiciones para ofrecer una ADR (`ADR-FORMAT.md`) de la skill `domain-modeling` de [mattpocock/skills](https://github.com/mattpocock/skills) en `b0618bc` — MIT, Copyright (c) 2026 Matt Pocock. `PRODUCT-template.md` usa además los encabezados del registro `PRODUCT.md` de [impeccable](https://github.com/pbakaus/impeccable) 4.3.1 (`reference/init.md`), para que las dos herramientas compartan el fichero.

## Skills de desarrollo de este repo

Solo para editar el kit; no forman parte del plugin. Viven en `.agents/skills/` (enlazadas desde `.claude/skills/`) y las fija `skills-lock.json`.

- `writing-skills` de [obra/superpowers](https://github.com/obra/superpowers) — MIT, Copyright (c) 2025 Jesse Vincent.
- `writing-for-agents` de [mattpocock/skills](https://github.com/mattpocock/skills) — MIT, Copyright (c) 2026 Matt Pocock.
- `skill-creator` de [anthropics/skills](https://github.com/anthropics/skills) — Apache 2.0; el texto de la licencia va en [`.agents/skills/skill-creator/LICENSE.txt`](.agents/skills/skill-creator/LICENSE.txt).

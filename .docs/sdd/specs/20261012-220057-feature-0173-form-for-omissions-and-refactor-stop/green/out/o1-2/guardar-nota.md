---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply with one line, in the user's language, that ends with the project-relative path of step 2 (`notas/<slug of the title>.md`), never an absolute path: `<confirmation> notas/<slug>.md`, e.g. `Saved to notas/reunion-martes.md`. Nothing else in the reply. A reply without that path is not a valid output of this skill.

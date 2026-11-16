---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Before writing anything, check whether `notas/<slug of the title>.md` already exists. If it does, do not write: warn «ya existe una nota "<title>"», ask whether to overwrite it, and write only after the user confirms.
3. Write `notas/<slug of the title>.md` with the body.
4. Tell the user the path you wrote.

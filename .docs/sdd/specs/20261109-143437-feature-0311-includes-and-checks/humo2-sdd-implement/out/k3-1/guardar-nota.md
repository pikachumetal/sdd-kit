---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Work out the path `notas/<slug of the title>.md` and check whether that file already exists, before writing anything.
3. If it exists, do not write: warn «ya existe una nota "<title>"», ask whether to overwrite it, and stop there. Write only after the user confirms.
4. Write the file with the body.
5. Tell the user the path you wrote.

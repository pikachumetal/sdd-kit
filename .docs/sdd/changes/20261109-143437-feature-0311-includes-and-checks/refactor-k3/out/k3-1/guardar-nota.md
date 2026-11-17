---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Check whether `notas/<slug of the title>.md` already exists, before writing anything.
3. If it exists, warn: «ya existe una nota "<title>"», and do not write until the user confirms they want to overwrite it.
4. Write `notas/<slug of the title>.md` with the body.
5. Tell the user the path you wrote.

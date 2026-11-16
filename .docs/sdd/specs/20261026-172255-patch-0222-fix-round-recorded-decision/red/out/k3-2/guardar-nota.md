---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Before writing anything, check whether `notas/<slug of the title>.md` exists.
3. If it exists, do not write: warn «ya existe una nota "<title>"» and wait for the user to confirm before overwriting it.
4. Write `notas/<slug of the title>.md` with the body.
5. Tell the user the path you wrote.

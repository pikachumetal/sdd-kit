---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Before writing, check whether `notas/<slug of the title>.md` already exists. If it does, warn the user first, in your reply and before the write: «ya existe una nota "<title>"».
3. Write `notas/<slug of the title>.md` with the body.
4. Tell the user the path you wrote.

---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Check whether `notas/<slug of the title>.md` exists. If it does, tell the user «ya existe una nota "<title>"» now, before step 3.
3. Write `notas/<slug of the title>.md` with the body.
4. Tell the user the path you wrote.

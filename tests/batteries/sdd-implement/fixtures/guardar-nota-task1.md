---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. If a note with that title already existed, warn: «ya existe una nota "<title>"».
4. Tell the user the path you wrote.

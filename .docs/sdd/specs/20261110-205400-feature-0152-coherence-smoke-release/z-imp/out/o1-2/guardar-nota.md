---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply with the exact path you wrote, in the text the user reads, e.g. `Nota guardada en notas/reunion-martes.md`. A reply without the path, such as «Nota guardada.», is incomplete: the user would have to look for the file in `notas/`.

---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply with one line that carries the path you wrote, in the user's language, naming the file as `notas/<slug>.md` (for example `Nota guardada en notas/reunion-martes.md`). The path is part of the reply; a reply without it is incomplete.

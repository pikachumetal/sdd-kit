---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user with this template, in their language, filling every slot:

   `Nota guardada en <path you wrote>.`

   A reply without the path is incomplete, even if the note was written.

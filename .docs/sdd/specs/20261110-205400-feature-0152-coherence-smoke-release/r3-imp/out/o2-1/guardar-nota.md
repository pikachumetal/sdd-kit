---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user, in their language, with this template; the path is the slot you may not leave empty:

   > <confirmation that the note is saved>: `notas/<slug of the title>.md`

   A reply without the path in backticks (`Nota guardada.`, `¡Listo!`) is incomplete: the user would look for the file by hand.

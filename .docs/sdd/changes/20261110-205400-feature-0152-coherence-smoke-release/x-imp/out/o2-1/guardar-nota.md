---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user with this template, in their language, with the slot filled with the path you wrote in step 2:

   > <Saved note confirmation>: `<path>`

   Example: `Nota guardada: notas/reunion-martes.md`. A reply with the slot empty is not a reply.

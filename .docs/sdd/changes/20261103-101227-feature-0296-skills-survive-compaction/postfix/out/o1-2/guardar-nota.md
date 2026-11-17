---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Answer with this template, in the user's language, filling every slot:

   ```
   <confirmation that the note was saved>: <the path you wrote in step 2>
   ```

   An answer whose second slot is empty is not an answer: the path is the part the user can't get back without searching `notas/`.

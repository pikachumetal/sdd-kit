---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user, in their language, with this template, filling every slot; a reply with a slot empty is not sent:

   ```
   Note saved at <path of the file you wrote in step 2>.
   ```

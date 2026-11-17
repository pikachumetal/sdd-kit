---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user, in their language, by filling this template; the path is the slot you copy from step 2, and a reply without it is not sent:

   > Saved: `<path written in step 2>`

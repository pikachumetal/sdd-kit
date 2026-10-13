---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply with one line that contains the exact path you wrote, as in `Saved to notas/<slug>.md`. A reply that doesn't name the path (`Saved.`, `Done.`) is incomplete.

---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply with the path you wrote. The reply is the confirmation and the path in one line, in the user's language, in this shape: `<saved>: notas/<slug>.md` (e.g. `Guardada: notas/reunion-martes.md`). A confirmation without the path is not a reply.

---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Check whether `notas/<slug of the title>.md` already exists. Do this before any write.
3. If it exists, do not write. Warn the user: «ya existe una nota "<title>"», and ask whether to overwrite it. Write only after they confirm.
4. If it does not exist, write `notas/<slug of the title>.md` with the body.
5. Tell the user the path you wrote.

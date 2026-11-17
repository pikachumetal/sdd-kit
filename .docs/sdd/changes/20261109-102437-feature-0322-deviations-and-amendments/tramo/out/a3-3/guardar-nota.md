---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them. An empty or missing title is missing: ask the user for it and wait for the answer; never fill it with a placeholder (`nota`, `sin-titulo`) and write no file until you have it.
2. Write `notas/<slug of the title>.md` with the body.
3. Tell the user the path you wrote.

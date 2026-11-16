---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them. An empty title, or a request that says the note has none, counts as missing: ask for the title and wait for it; never invent one (`nota`, `sin-titulo`).
2. Write `notas/<slug of the title>.md` with the body.
3. Tell the user the path you wrote.

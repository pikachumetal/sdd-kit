---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them. A missing or empty title counts as lacking it: ask for it, never make one up (`nota`, `sin-titulo`).
2. Write `notas/<slug of the title>.md` with the body.
3. Tell the user the path you wrote.

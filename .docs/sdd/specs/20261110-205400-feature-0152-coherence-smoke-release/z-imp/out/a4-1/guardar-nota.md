---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them. An empty or blank title counts as missing: ask for it and write nothing until the user gives it; never name the file with a placeholder (`nota`, `sin-titulo`).
2. Write `notas/<slug of the title>.md` with the body.
3. Tell the user the path you wrote.

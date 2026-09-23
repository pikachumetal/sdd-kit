# Tasks — 0033 Capacidades al nacer

Registro vivo: estado y commit por task.

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Carpetas que no nacen vacías | ✅ RED 6/6 → verde | `b87a0cb` |
| 2 — Volcado inicial en greenfield | ✅ RED 7/7 → verde | `64d1cfa` |
| 3 — El funcional aportado se guarda literal | ✅ RED 5/5 → verde | `e174219` |
| 4 — GREEN headless y evidencia | ✅ GREEN 6/6 escenarios 2/2 | — |

## Fixes adicionales

| # | Qué | Decisión |
| --- | --- | --- |

## Rulings

- Task 1: el test del plan usaba `$_` del `-ForEach` dentro de un `Where-Object`, donde `$_` es la línea; se guarda en `$folder`. Coste si está mal: ninguno, el test falla y pasa por la aserción.
- Task 2: el paso 3 de greenfield gana la viñeta «`capabilities/` y `specs/` no se crean», que el plan solo subía al `SKILL.md` de brownfield. Motivo: la regla decide y la anatomía pide que lo que decide esté en el `SKILL.md`, en las dos init por igual. Coste si está mal: una línea de más.
- Task 4: el primer lote (10 de 12 sujetos) se cortó porque la sesión que lanzaba `driver.py` en segundo plano murió a mitad del lanzamiento; se relanzaron uno por uno en la sesión siguiente. Dos arreglos al **arnés**, no al texto de las skills: `PowerShell(*)` en `--allowedTools` de `driver.py` (un sujeto que sigue el hábito de la máquina de usar PowerShell para git se quedaba bloqueado) y una frase en `requests/g6.txt` para que el sujeto tome las opciones recomendadas de la entrevista de brownfield sin preguntar (sin ella no llegaba nunca al punto que mide el escenario). Coste si está mal: ninguno, son fixtures de la campaña, no guidance del kit. Detalle y coste completo en `green/README.md` y `tests/capabilities-at-birth-green.md`.
- Task 4, tras la revisión final: el revisor marcó (Minor) que el primer par de G4 (`g4a2`) no llegaba al texto del volcado, parado antes pidiendo permiso de `.claude/settings.json`. Se descartó, se ajustó `requests/g4.txt` como G5/G6 (no tocar `.claude/`) y se relanzó (`g4d`, cierre completo con confirmación explícita). G4 queda 2/2 con `g4b2` + `g4d`. Coste si está mal: ninguno, mismo fixture de campaña.

# RED — `sdd-retro` (feature 0277)

Kit de la rama en `67125a3` (sin la skill), sujetos Sonnet, `tests/batteries/sdd-retro/` y `c1` de `sdd-archive`. Salidas en `.docs/sdd/specs/20261101-191641-feature-0277-sdd-retro/red/out/`. Coste: 2 $ en 15 sujetos, unos 0,17 $ cada uno, por debajo de los 0,4 $ previstos.

| Escenario | Lo que hizo el baseline | Lectura |
| --- | --- | --- |
| `r1` × 2 | corrige `operations.md`, ninguno crea skill; uno añade además un script a `package.json` sin que nadie lo pida | el peldaño sale bien; **0/2 dejan rastro** en el walkthrough |
| `r2` × 2 | no inventa nada ni crea `.claude/skills/` | limpio; **0/2 dejan rastro** |
| `r3` × 1 | dice en el chat que es para el ticket y no edita el kit | si no se acepta la oferta, **el hallazgo se pierde** |
| `r5` × 2 | añade un test contra el `console.log` | el chequeo sale 2/2 sin guía; **0/2 dejan la línea** en el formato pedido (uno anota el aprendizaje) |
| `c1`, molde holgado, × 4 | condensa dos líneas y entra | el molde daba para condensar: no reproduce el caso de campo |
| `c1`, documento sin grasa, × 2 | **0/2 saca la línea que ya vive en otro sitio**: paran a preguntar, y uno deja el aprendizaje sin escribir | el fallo de los tickets 0175 §4 y 0181 §3: una parada que la regla evita |
| `r4` × 1 | corta bien y **no hace ningún repaso** de la deuda; sin más mención de la retro. Otro sujeto cayó por `ENOTFOUND` y no cuenta. Una tanda anterior paró antes por un walkthrough del molde que no cuadraba (`red/out/r4-molde-roto/`) | el repaso no existe |

## Lo que recorta

Art. I: la guía nueva lleva un test que falla antes. Lo que falla es **el rastro** (0/7 en `r1`, `r2`, `r3` y `r5`), la salida del tope y el repaso. Lo que el baseline ya hace es elegir el peldaño y no inventar.

Por eso la pasada de cierre es una receta de forma (Art. II): las señales y los peldaños entran como los valores de la línea `Retro:`, sin tabla de racionalizaciones ni red flags de disciplina. Queda un posible falso negativo: las notas del molde cuentan las señales, y una sesión real tiene que acordarse de ellas (`tech-stack.md`, «Un baseline limpio no reproduce los fallos de sesiones largas»).

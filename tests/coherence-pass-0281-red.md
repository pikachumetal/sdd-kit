# RED de la feature 0281 — el repaso de coherencia y lo que cambia sin declararse

Sujetos Sonnet, `sdd-propose` de la rama en el commit de apertura, sin la orden en la petición («Termina el paso 4 y preséntamela para aprobar»). Salidas en `red-v1/` y `red/` de la carpeta de la spec.

| Tanda | Molde | `co5` (`cli` en el delta) | `co6` (pasos de lo retirado) |
| --- | --- | --- | --- |
| `red-v1` | 2 capacidades; «paso 2» en la capacidad que el delta declara | 3/3 | 3/3 |
| `red` | 15 capacidades en `co5` y 14 en `co6`; la opción, pieza secundaria del Scope; «paso 2» en `quality-gate`, sin declarar | 3/3 | 1/3 |

`red-v1` salió limpia con fuente incidental: los sujetos leían las dos capacidades y `closing.md` entera. Por eso la segunda tanda (`tech-stack.md`, «Una primera tanda limpia…»).

- **`co5` limpio 6/6**: en `red`, los tres eligen `cli` por su propósito en el índice de 15 y lo añaden al delta. El frente sale, con la marca de la spec. El caso de la 0116 fue en una sesión larga: si vuelve, es un segundo ticket.
- **`co6`**: `co6-1` y `co6-3` buscan solo `aviso-cierre` y no abren `quality-gate.md`; la tabla no lista «El gate corre una sola vez» ni «Un gate en rojo para el cierre». Reproduce el ticket de la 0206 §4.

Coste de `red-v1`: 1,97 $. Acumulado de la campaña, en el verde.

# GREEN — índice de capacidades (task 0073)

Kit: la rama con la guía nueva (paso de contexto de `sdd-start-task`, `sdd-roadmap` y `sdd-consult`, ayuda del bloque «Capacidades» de `spec-template.md`) y `Get-CapabilityIndex.ps1`, servido desde una copia limpia con `--plugin-dir`. Mismo molde, mismo arnés y mismas peticiones que el [RED](capabilities-index-red.md), con una diferencia de formato: cada capacidad lleva `## Propósito` (`PURPOSE=1`), porque en la 2.0.0 todas lo tienen. Seis sujetos `claude -p --model sonnet`, 1,99 $. Campaña completa: 12 sujetos, 4,12 $, dentro de la previsión (12, ~6 $) y del techo (14, 8 $); sin tanda de REFACTOR.

Salidas: [`green/`](../.docs/sdd/specs/20260925-115547-task-0073-capabilities-index/green/).

## Resultados frente al RED

| Fallo del RED | E | RED | GREEN | Veredicto |
| --- | --- | --- | --- | --- |
| **No encuentra la capacidad donde ya vive la regla** | r | 1/2 (`r-1` reparte en `bookings` «registrar si la reserva se presentó») | 2/2 nombran `house-rules`: «la definición de «no presentada» ya vive aquí; se enlaza, sin duplicarla» | **Corregido** |
| Abre las capacidades a ciegas para elegir | s | 9 y 4 de 9 | 4 y 4 de 9, las dos tras ejecutar el índice | **Mejora** (el peor caso baja de 9 a 4) |
| Ejecuta el índice antes de abrir capacidades | s, r, q | — (no existía) | 6/6; ningún sujeto abre una capacidad antes | **Cumple** |

En `r` los dos sujetos abren solo `house-rules` y `billing`, las dos que el propósito señala (en el RED, 2 y 4). En `q`, 2 y 1 (`house-rules`, más `access` en `q-1` para el código de invitado), sin búsqueda semántica ni grep por las capacidades.

## Filas de control

| Conducta | E | RED | GREEN |
| --- | --- | --- | --- |
| Elige `house-rules` | s | 2/2 | 2/2 |
| El bloque «Capacidades» usa el nombre exacto del fichero | s | 2/2 | 2/2 (`house-rules`) |
| No crea una capacidad casi duplicada | s | 2/2 | 2/2 (ninguna «Nuevas») |
| La task en marcha (0021) no se toca: lo nuevo va a una fila nueva | r | 2/2 | 2/2 (fila 0024, «tras 0021» en `r-1`) |
| Ancla la respuesta en `house-rules` | q | 2/2 | 2/2 |
| Distingue lo que dice el doc de lo que infiere | q | 2/2 | 2/2 («Lo que dice el doc» / «Lo que infiero yo»; «según el doc» / «Lo que infiero») |

Sin regresión en ninguna fila de control.

## Límites de la medición

- Molde de 9 capacidades: el ahorro de lectura es pequeño a esta escala; el índice paga más con 40. No se midió con un molde grande.
- El GREEN lleva el propósito en las capacidades y el RED no: la mejora es de las dos piezas juntas (propósito + índice), que es como llegan a los proyectos tras la migración a 2.0.0.
- `s-1` listó los ficheros de `.docs/` (`find`) antes del índice: vio los nombres, no el contenido.

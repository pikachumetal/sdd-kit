# RED — totales

Kit: `dist/` de `a1c6fb18` (el núcleo de hoy, con la batería de la Task 1), en `.temp/i/kit-red`. 20 sujetos de `g9 fp g8 pe` a n = 5, 4,35 $. Lectores Sonnet con `../readings/encargo.md`, uno por escenario; el hilo releyó cada «falla» y los «pasa» de E1 en `fp`.

## Filas de máquina

| Escenario | K | E4w |
| --- | --- | --- |
| g9 | 5/5 | 0/5 (ninguno llama a `WebSearch` ni a `WebFetch`) |
| g8 | 5/5 | — |
| fp | 5/5 (`fp-1` no cargó y se relanzó una vez: el primer intento, en `no-cargo/`) | — |
| pe | 5/5 | — |

## Filas de lector

| Fila | g9 | g8 | fp | pe |
| --- | --- | --- | --- | --- |
| E0 | 5/5 | 5/5 | 5/5 | 5/5 |
| E1 | — | — | 2/5 (falla `fp-1`, `fp-2`, `fp-4`) | — |
| E2a | 5/5 | 5/5 | 5/5 | 5/5 |
| E2b | 5/5 | 5/5 | 5/5 | 5/5 |
| E3 | — | — | 5/5 | 3/5 (falla `pe-4`, `pe-5`) |
| E4 | 5 no aplica | — | — | — |
| E5 | 5/5 | 5/5 | 5/5 | 3/5 (falla `pe-4`, `pe-5`) |
| E6 | — | 4/5 (falla `g8-1`) | — | — |
| E7 | — | — | — | 4/4, 1 sin veredicto |
| Reparo forma | 1 reparo (`g9-2`), 4 no aplica | 5/5 | 5 no aplica | 5/5 |
| Reparo idioma | 5/5 | 5/5 | 5/5 | 5/5 |

## Lo que dice el RED

- **Rojo, y lo que lo mide**: E4w (`g9`, 0/5) para la búsqueda antes de la primera pregunta; E1 (`fp`, 2/5) para aceptar lo que el usuario mantiene; E6 (`g8`, 4/5: «por ejemplo que alguien más la use o que vaya a tocar el código») para la pregunta abierta de una frase; E5 y E3 en `pe` (`pe-4`, `pe-5`: «¿qué reservas necesitan ver, y qué hacen con ellas en la hoja?»).
- **E0 no sale en rojo**: 20/20 con el núcleo de hoy, frente a los fallos del spike en `g8` y `pe`. La pieza de E0 sustituye a «Facts are your job; decisions are the user's» en un núcleo que se reescribe de cero; el GREEN la mide como no regresión.
- **Relectura del hilo**: `g8-2` E6 pasa (enseña `PRODUCT.md:5` con su fuente y pide confirmarlo); `g8-4` y `g8-5` E6 pasan (el menú es sobre el origen de las referencias huérfanas, no sobre para quién ni para qué). Las demás «falla» se sostienen con su cita.

# GREEN — `sdd-rubber-duck`, efecto comprobado (patch 0317)

- **Fecha**: 2026-11-05. **Kit**: el `dist/` de la rama tras `moon run kit:build`, con la línea nueva del modo corto: «First, what changes or happens for the product's user, with data; name only effects checked in the file.» (18 palabras, las mismas que la que sustituye; la skill sigue en 590).
- **Batería**: `tests/batteries/sdd-rubber-duck/` (`STEPS=rubber-duck`, `PHASE=green`): `s4` y `s3`, el escenario del fallo y su control, y el tramo del paso (`s1`, `s2`, `l1`) como control de la línea editada.
- **Sujetos**: 12. `s4` 3 y `s1`, `s2`, `l1` 2 de cada, con Sonnet; `s3` 3, con Opus 5.5. **Coste**: 1,42 $ (campaña 2,39 $ con el RED; previsión ~2,5 $).
- **Salidas**: [`green/out/`](../.docs/sdd/specs/20261105-102427-patch-0317-duck-checked-effects/green/out/).
- **Veredicto de puerta**: verde en los cinco escenarios.

## Veredicto de conducta

| Sujeto | R11 Efecto comprobado | Antes del párrafo |
| --- | --- | --- |
| s4-1 | P | `git diff HEAD -- README.md`, `cat -A README.md` |
| s4-2 | P | `git diff HEAD~1 HEAD -- README.md`, `cat -A README.md` |
| s4-3 | P | `git diff HEAD~1 -- README.md`, `grep` del README |
| s3-1 | P | `git show` del commit y `cat README.md` |
| s3-2 | P | `git show` del commit y `cat README.md` |
| s3-3 | P | `git show` del commit y `cat README.md` |

**`s4` pasa de 0/3 a 3/3**: los tres abren el diff o el README antes de escribir y desmienten la lectura del material. s4-3: «El material del freno decía que antes se verían como texto, y eso no es cierto en este archivo». s4-2: «esas dos líneas ya están dentro de un bloque de código cerrado con comillas triples, y siguen ahí». `s3` sigue en 3/3.

## Control del tramo

| Sujeto | R1 | R2 | R3 | R9 | R4 | R5 | R6 | R7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| s1-1 | P | P | P | — | — | — | — | P |
| s1-2 | P | P | P | — | — | — | — | P |
| s2-1 | P | P | P | P | — | — | — | P |
| s2-2 | P | P | P | F | — | — | — | P |
| l1-1 | P | P | — | — | P | P | P | P |
| l1-2 | F | P | — | — | P | P | P | P |

- **s1**: los dos abren con lo que cambia para el socio, con datos: «para Norte llegarán las del 2 y el 19 de marzo, y no la del 5, que es de Sur». El paso de «one example» a «data» no quita el ejemplo.
- **R9, s2-2**: «Falta decidir si la exportación lleva la hora tal como está en el coworking, sin convertirla, o la convierte a UTC y la marca como tal». Son opciones después del párrafo. La regla de lo pendiente no se ha tocado, y ya falló en el GREEN de la 0146 (3 de 6, `battery.md`, procedencia).
- **R1, l1-2**: «Las horas salen como `20260302T080000`» en una nota tras los pasos, fuera de «Dónde mirar». Es el modo largo, que este patch no toca. El mismo fallo de forma salió en el GREEN de la 0145 (l1-2, una ruta en un paso).

Ninguno de los dos rojos de control cae en la línea editada. No se relanzan para sacar verde (`tech-stack.md`, «Baterías por skill»).

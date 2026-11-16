# RED — `sdd-rubber-duck`, efecto comprobado (patch 0317)

- **Fecha**: 2026-11-05. **Kit**: `develop` (`3bcfb4fd`), copiado con `git archive develop:dist`.
- **Batería**: `tests/batteries/sdd-rubber-duck/` (`SCENARIOS=s3`, luego `SCENARIOS=s4`; `PHASE=red`), molde `exportes`.
- **Sujetos**: 6. `s3`, 3 con Opus 5.5, porque el fallo de campo vino de Opus; `s4`, 3 con Sonnet, a petición del dev-lead («puedes probar con sonnet a ver si lo saca red?»). **Coste**: 0,97 $ (`s3` 0,67 $, `s4` 0,30 $; previsión ~2,5 $ con el GREEN).
- **Salidas**: [`red/out/`](../.docs/sdd/specs/20261105-102427-patch-0317-duck-checked-effects/red/out/).
- **Veredicto de puerta**: verde en los dos escenarios (3/3 invocan `sdd-kit:sdd-rubber-duck`). La conducta la lee la fila R11.

## Veredicto de conducta

| Sujeto | R11 Efecto comprobado | Antes del párrafo |
| --- | --- | --- |
| s3-1 | P | `git show` del commit y `cat README.md` |
| s3-2 | P | `git show` del commit y `cat README.md` |
| s3-3 | P | `git show` del commit y `cat README.md` |
| s4-1 | F | nada: solo `Skill` |
| s4-2 | F | nada: solo `Skill` |
| s4-3 | F | nada: solo `Skill` |

**`s3` sale limpio y `s4` falla 3 de 3.** En `s3`, la petición da solo las líneas del diff y el sujeto, sin una lectura propia, abre el fichero. En `s4`, la parada le pasa su lectura sin comprobar, como en la 0312, y el sujeto la repite. Lo que reproduce el caso de campo es `s4`. `s3` se queda como control.

## Citas

- **s3-2** (pasa): «Esas dos instrucciones están dentro de un recuadro de texto literal, y ese recuadro enseña cada espacio tal cual, así que el lector ve el margen de más.»
- **s4-1**: «saldrán dentro de una caja de código, no como texto normal […] En el formato de la ayuda (Markdown), cuatro espacios al empezar una línea la marcan como código.»
- **s4-2**: «ya no se leerían como texto de ayuda, sino como un recuadro de código».
- **s4-3**: «dentro de un recuadro de código. Antes eran texto normal.» En el fichero, las dos líneas ya estaban dentro del recuadro antes de la Task 2.

## Lectura

El modo corto pide «what changes […] with one example with data» y no pide que el efecto esté comprobado. Con el efecto ya escrito en el material, ningún sujeto abre `README.md` ni el diff: el efecto que da la parada se toma como dato. Es el fallo del ticket de la 0312, §1: «Afirmé el efecto en Markdown sin abrir los dos ficheros».

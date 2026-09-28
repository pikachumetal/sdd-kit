# GREEN — paquete del revisor final con ficheros borrados (patch 0094)

Mismo lanzador, molde y escenario que el [RED](review-package-slim-red.md) (`red/subject.sh`), con el kit de la rama con la receta nueva. Salidas en [`green/out/`](../.docs/sdd/specs/20260928-154618-patch-0094-review-package-slim/green/out/). Sonnet, 2026-09-28.

| Sujeto | Paquete | (a) | (b) | (c) | (d) | (e) |
| --- | --- | --- | --- | --- | --- | --- |
| [v1-1](../.docs/sdd/specs/20260928-154618-patch-0094-review-package-slim/green/out/v1-1.tools.txt) | 19.965 bytes, 126 líneas | ✅ 0 líneas `LEGACY-LINE-` | ✅ «Ficheros borrados» con los 6 | ✅ ningún error; `Read` con `limit: 400` | ✅ 0 líneas de la spec | ✅ ni `git diff` ni suite |

16 turnos, 0,59 $. Campaña: 2 sujetos con resultado y 1,15 $, más el intento parado del RED (~0,3 $), dentro del techo de 2 sujetos y 2,5 $ declarado antes del primero.

## Veredicto

- **(a), (b) y (d)**: de fallo en el RED a cumplido. El paquete baja de 235.036 a 19.965 bytes; su tramo de 400 líneas más grande pesa 19.762 bytes.
- **(c)**: 0 errores, como en el RED. El revisor lee con `limit: 400`, la forma que pide la guía, y cubre el paquete entero; el del RED leyó 680 de 2.018 líneas.
- **Borrados por nombre**: el revisor los ve y los juzga («Los ficheros borrados (`docs/legacy-visual-spec.md` y `tests/fixtures/visual-1..5.json`) son precisamente los artefactos que documentaban y ejercitaban el gate visual legado»), igual que el del RED con el cuerpo entero.
- **(e)** control: sin `git diff` ni suite, igual que en el RED.

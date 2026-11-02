# Controles — feature 0291

La guía no se escribe: `c10` salió limpio 3/3 en el [RED](fix-pass-deviation-0291-red.md). Estas tandas corrieron con la viñeta aplicada, por un error de conteo del 🦆, y no miden el kit que queda: se guardan como lectura de los escenarios. Salidas en `green/out/` y `refactor/out/` de `.docs/sdd/specs/20261102-173757-feature-0291-fix-pass-deviation/`.

| Escenario | Modelo | Kit | Resultado |
| --- | --- | --- | --- |
| `c10` | Opus | viñeta «stop» (`124f1d17`) | 3/3: paran sin commitear, con 🦆 y ✋ |
| `c10` | Opus | viñeta «stop with 🦆 and ✋» (`23cd220e`) | 2/2 |
| `c10e` | Sonnet | `124f1d17` | 2/2: commitean el THEN con ` - ` y su línea `sin aprobar`, y lo nombran en ✋ |
| `c6` | Sonnet | `124f1d17` y `23cd220e` | 2/2 y 2/2: paran con 🦆 y ✋, sin commitear |
| `c1f` | Sonnet | `124f1d17` | 2/2 en lo que mide aquí: el Minor entra en la pasada sin parar. Sin comprobar la línea `Final: fixed`: `tasks.md` lo recoge como «+1 Minor» y el ledger no se guardó |

Coste de toda la campaña: 16 sujetos, 11,80 $ (RED 2,99 $; GREEN 6,58 $; REFACTOR 2,23 $), con un REFACTOR que no hacía falta.

# GREEN — la cita literal del dev-lead y el corrector de docs del proyecto (patch 0114)

Mismo lanzador, molde y escenario w2 que el [RED](walkthrough-literal-cspell-red.md), con el kit de la rama y la línea nueva en `walkthrough-template.md` §4.2. Sonnet, 2026-09-29.

| Fase | Sujeto | Línea de la plantilla | (a) | (b) | (c) |
| --- | --- | --- | --- | --- | --- |
| GREEN | [w2-1](../.docs/sdd/specs/20260929-170710-patch-0114-walkthrough-literal-cspell/green/out/w2-1.tools.txt) | «excluye sus palabras en este fichero al escribirlo» | ❌ | ✅ | ✅ |
| REFACTOR | [w2-1](../.docs/sdd/specs/20260929-170710-patch-0114-walkthrough-literal-cspell/refactor/out/w2-1.tools.txt) | «… todas las palabras de la frase, no solo las que te parezcan erratas» | ✅ | ✅ | ✅ |

## Veredicto

- **GREEN**: el sujeto se adelantó, pero eligió qué palabras excluir. Puso `cspell:ignore provado vien` y dejó fuera «cierrala», que tomó por correcta aunque le falta la tilde. El primer commit falló con `Unknown word (cierrala)`, y el sujeto dijo: «Me faltaba "cierrala" en el ignore». La guía dejaba al agente adivinar el diccionario del proyecto.
- **REFACTOR**: la línea pide todas las palabras de la frase y nombra la salida fácil («no solo las que te parezcan erratas»). El sujeto escribió `<!-- cspell:ignore lo e provado en local y va vien cierrala -->` y pasó el lint antes del commit. El pre-commit pasó a la primera.
- **(b) y (c)** como control: la cita queda literal y la exclusión va en el fichero en los dos sujetos, igual que en el RED.
- Campaña: 5 sujetos, 1,14 $. La previsión era 3 sujetos y 2 $. El GREEN y el REFACTOR la superaron en sujetos, y el dev-lead autorizó cada uno por separado.
- Test estructural: `tests/ClosingVerification.Tests.ps1`, «la frase del dev-lead no se corrige…». Sin la línea, 14 verdes y 1 rojo; con ella, 15 verdes.

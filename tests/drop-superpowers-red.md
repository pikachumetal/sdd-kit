# RED — retirar la dependencia de superpowers (feature 0279)

Kit de la rama antes del paso 10 de `v3.0.0.md`, ya sin la dependencia. Sujeto Sonnet, 0,19 $. Salida en `.docs/sdd/specs/20261101-175350-feature-0279-drop-superpowers-dependency/red/out/`.

| Escenario | Molde | Resultado |
| --- | --- | --- |
| s1, «Actualízame al kit.» | `salas3` con superpowers activado | Falla S1: no propone quitarlo. Lo ve y escribe: «`.claude/settings.json` sigue habilitando el plugin `superpowers`. La migración no lo toca.» |

El sujeto paró antes del marcador porque la fila `B1` del molde no valida en `sdd roadmap check`. Esa parada no invalida el RED: su frase sale de la lectura del fichero, y ningún paso del kit le pide tocarlo. El molde del GREEN quita la fila.

El segundo turno de este RED, «Sí, quítala», no mide nada: el sujeto no había preguntado y pidió aclararlo.

GREEN: [`drop-superpowers-green.md`](drop-superpowers-green.md).

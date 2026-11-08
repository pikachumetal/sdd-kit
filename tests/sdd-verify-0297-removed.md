# sdd-verify, feature 0297: un REMOVED buscado por su requisito vigente

Escenarios `rm1`, `rm2`, `rm2b` y `rm3` de `tests/batteries/sdd-verify/`, Opus, n = 2 (`rm2b`, de la enmienda del 2026-11-08, más abajo). El sujeto es el eje Spec de la revisión final sobre la 0025 de juguete («Quitar el aviso por correo al anular»), con `#### REMOVED — Avisar por correo` en `bookings`. La rama quita `formatMail()` y deja `outbox.push` en `voidBooking()`, sin «correo» ni «mail» en el código. Solo cambia el requisito vigente: con escenario (`rm1`), sin cuerpo (`rm2`) o fuera del sha revisado y en el historial (`rm3`). Salidas en `.docs/sdd/specs/20261108-122008-feature-0297-verify-removed-by-requirement/red/out/`.

## RED — kit de `HEAD` (`d2532ea`), 6 sujetos, 2,18 $

| Escenario | Fila | Pasan | Lo que hizo cada sujeto |
| --- | --- | --- | --- |
| `rm1` | RM1 | 2/2 | los dos leen `capabilities/bookings.md` por su cuenta (el encargo lista las capacidades) y marcan Critical `contradicts` el `outbox.push` de `src/app.js:18`, citando «`salida` lista «anulada Norte lun»…» del vigente |
| `rm2` | RM2 | 0/2 | los dos leen el vigente sin cuerpo y marcan igualmente Critical `contradicts` el `outbox.push`: lo encuentran por el diff, que quita `formatMail()` y deja el envío. Ninguno escribe «no verificado» para la entrada |
| `rm3` | RM3, RM3h | 2/2 | `rm3-1` lee `git show <sha> -- .docs/sdd/capabilities/bookings.md` y `rm3-2` `git show <sha> -- .docs/sdd/capabilities/`; los dos recuperan el escenario del commit que lo quitó y marcan el Critical |

La fila de máquina RM3h salió primero con `presente`, que en «Falla si…» quiere decir «falla si está»: dio rojo en `rm3-1`, que sí leyó el historial, y verde en `rm3-2`, cuyo `git show` nombraba la carpeta. Corregida a `` `tools: /git[^\n]*(log\|show)[^\n]*capabilities\//` ausente `` y vuelto a dar el veredicto sobre las mismas salidas: 2/2.

Lo que dice el RED:

- Regla 1 (leer el vigente y buscar su comportamiento): limpio. El encargo del kit ya trae `The project's capabilities: <salida de sdd capability index>`, que OpenSpec no trae, y los dos sujetos abren la capacidad del `REMOVED` sin que nada se lo pida.
- Regla 2 (recuperar el vigente del historial): limpio. Sin el vigente en el sha revisado, los dos van al historial de la capacidad.
- Regla 3 (sin vigente utilizable, «no verificado» y no buscar): falla la fila, pero lo que hacen los sujetos es mejor que lo que pide la regla en este molde. Buscan por el diff y encuentran el Critical real; con la regla habrían escrito «no verificado» y no lo habrían buscado. El molde no reproduce el caso de la fuente: un diff que no delata nada, donde buscar por el título da la retirada por buena sin serlo.

## RED de `rm2b` — kit de `HEAD` (`aec923e`), 2 sujetos, 0,63 $

Enmienda del 2026-11-08: `rm2` no reproducía el caso de la fuente, porque el diff delataba el aviso. `rm2b` lleva el vigente sin cuerpo de `rm2`, la base ya sin «correo» ni «mail» (`app-rm.js`) y una rama que solo añade `test/void.test.js`, sin tocar `src/`.

| Escenario | Fila | Pasan | Lo que hizo cada sujeto |
| --- | --- | --- | --- |
| `rm2b` | RM2b | 2/2 | los dos leen `src/app.js` entero, porque el plan lo pone en «Ficheros» y la rama no lo toca, y marcan Critical `contradicts` el `outbox.push` de `voidBooking()` |

RM2 reescrita («falla si da la retirada por buena») sobre las salidas de `rm2` del primer RED: 2/2.

Pasada de fix de la revisión final (eje Código, Important): el mensaje del commit de la rama, «feat(bookings): anular sin aviso por correo», era otra pista. Con «test(bookings): cubrir anular», 2 sujetos más, 0,54 $: RM2b 2/2, los dos marcan Critical `contradicts` el `outbox.push`, y los dos vuelven a citar el plan que nombra `src/app.js`, así que el límite del caso sin plan pesa. Salidas en `fix/out/`.

## Resultado

Las tres reglas salen limpias con el texto de hoy: la viñeta del `REMOVED` no cambia (Art. I), y `rm1`, `rm2`, `rm2b` y `rm3` quedan como regresión. OpenSpec v1.16.1 queda revisada en `upstream.json` sin traer texto.

Límite: en `rm2b` el plan de juguete nombra `src/app.js` en «Ficheros» y la rama no lo toca, y `rm2b-1` lo usa como pista. En campo ese plan existe igual, así que la pista es real, pero un caso sin plan no está medido.

Coste de la campaña: 10 sujetos, 3,35 $ (previsión de la spec: 15,17 $; no hubo GREEN ni REFACTOR).

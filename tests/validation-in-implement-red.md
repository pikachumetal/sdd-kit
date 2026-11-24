# RED — la validación en `sdd-validate` (feature 0362)

Campaña de la Task 3: los escenarios nuevos de `tests/batteries/sdd-validate/battery.md` (`vf1`…`vf7`) y de `tests/batteries/sdd-archive/battery.md` (`av1`, `av2`), con el kit anterior a la feature (`dist/` de `aab7f1b`, que no tiene `sdd-validate`). Sonnet, n = 2 por escenario, 18 sujetos, 17,91 $ (la previsión de la spec daba 12,8 $ para esta tanda: el sujeto de `sdd-implement` cuesta ~1,2 $ y no ~0,83 $).

Como la skill no existe en la copia del kit, la petición no la nombra («Invoca la skill sdd-kit:sdd-validate y sigue.» se quita) y la guarda del sujeto mira `sdd-implement`. La puerta (`battery.mjs run`) sale en rojo por construcción en `vf1`…`vf7`; el veredicto es el de la conducta, de `tools.txt` y `texts.txt` (en `red/` de la carpeta de la spec) contra la rúbrica de cada escenario.

| Escenario | Qué hace el kit actual | Rúbrica | Veredicto |
| --- | --- | --- | --- |
| vf1 | Invoca `sdd-verify`, corre `node --test` y despacha los ejes de la revisión final sin haber recorrido ningún paso del guion (0 de 2 sujetos lo recorren antes del primer `Agent`) | VF1: falla | RED limpio, 2/2 |
| vf2 | Mismo orden: ejes primero. El fallo que da el dev-lead después lo trata dentro de la re-revisión de `sdd-verify`, sin task con su test ni gate con `--base` | VF2: falla | RED limpio, 2/2 |
| vf3 | Recorre el paso `libres` después de despachar los ejes (0 de 2 antes), y lo que arregla entra tras la revisión | VF3: falla | RED limpio, 2/2 |
| vf4 | No llega a `sdd-archive` ni escribe `Validación diferida:` (0 de 2) | VF4: falla | RED limpio, 2/2 |
| vf5 | Con un patch usa `sdd-verify`, corre `node --test` y un paso, no despacha ejes, y acaba preguntando «¿quieres que arregle…?»: no presenta el mensaje de validación ni deja la línea en `patch.md` §4 | VF5 tras ajustarla (antes no pedía presentar ni registrar): falla | RED limpio, 2/2 |
| vf6 | Tras tocar `package.json` corre el gate sin `--affected` (`sin filtro: cambia el build`), 2/2 | VF6: pasa | **Control**: la regla ya existe en «Running a gate»; no hay guidance nueva que escribir |
| vf7 | Pasada de fix y re-revisión como hoy; no corre el paso del guion que toca el arreglo (`canceladas` sin canceladas) tras la pasada | VF7 tras ajustarla (antes confundía la re-revisión con una revisión de vuelta): falla | RED limpio, 2/2 |
| av1 | Con el cierre sin validación registrada, `sdd-archive` valida él (modo `field`), cierra y fusiona en `develop` (2/2) | AV1: falla | RED limpio, 2/2 |
| av2 | Con un rojo de la rama tras el sync, `sdd-archive` propone arreglar el código él mismo («Arreglo el rojo y repito la suite») o pregunta si lo borra | AV2: falla | RED limpio, 2/2 |

Dos rúbricas se ajustaron tras leer los sujetos y antes de escribir ninguna guidance: `VF5` pide presentar el mensaje de validación y registrarla en `patch.md` §4 (la primera redacción solo miraba que no hubiera ejes y que corriera el gate), y `VF7` distingue la re-revisión de «La revisión se cierra una vez», que sigue, de una revisión de vuelta. `vf6` queda como control de no regresión.

## Lo que sale de la campaña

- El fallo que exhiben ocho de los nueve escenarios es el de la fila 0362: el orden va revisión final antes que el guion, nada devuelve a una task con su test, y el cierre arregla y valida.
- La previsión de coste del RED se quedó corta un 40 %: 17,91 $ frente a 12,8 $. La del total (~86 $) sigue siendo un techo del lanzador; con esta tasa, GREEN y medición final costarían ~30 $ cada una, no ~21 $. Se avisa al dev-lead antes de lanzarlas.

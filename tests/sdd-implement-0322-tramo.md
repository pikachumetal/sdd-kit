# GREEN del tramo «Deviations and rulings» y controles con el kit de `develop` (feature 0322)

Tramo de la [batería de `sdd-implement`](batteries/sdd-implement/battery.md) que lee la frase de la parada o el punto «Deviation», con `dist/` de la rama tras las Tasks 1 a 3: `u1 u2 k1 k2 k3 g1 g2 d1 a1 a2 a3 fr1 o1 o2` (30 sujetos, 12,04 $). `k4` no entra: su regla no se escribió ([evidencia](sdd-implement-0322-ruling.md)). Salidas en [`tramo/out/`](../.docs/sdd/specs/20261109-102437-feature-0322-deviations-and-amendments/tramo/out/). Cada rojo se relanza con el kit de `develop` (`control/out/`), y solo es rojo nuevo si en el control pasa (decisión 13 de la spec).

`battery.mjs verdict`: puerta verde en los 14 escenarios. Las filas de prosa las leí con una ficha por sujeto (commits de la rama, rulings, ✋ y 🦆, ficheros sin commitear, despachos) y, en los dudosos, los mensajes.

| Escenario | Fila | Resultado | Lo que hicieron |
| --- | --- | --- | --- |
| u1 | U1, U1r, U2 | 2/2 | paran con 🦆 y ✋ y la corrección en su sitio; los dos despachan el revisor de la enmienda (`Agent` 1) antes de parar; turno 2 sin reabrir la Task 1 |
| u2 | — (solo L) | 2/2 | — |
| k1 | K1 | 0/2 (control: ver abajo) | ninguno cambia `README.md`; los dos esquivan el «No entra» con un `Ruling:` sin parar |
| k2 | K2 | 2/2 | paran antes del commit con la corrección de la spec sin commitear |
| k3 | K3 | 2/2 | commitean el arreglo con el AND en `spec.md` y su línea `sin aprobar`, y lo nombran en ✋ |
| g1 | G1 | 2/2 | paran con la acción update |
| g2 | G2 | 2/2 | escriben `test/attempt.test.js` y cierran |
| d1 | D1 | 2/2 | borran `test/legacy.test.js` entero |
| a1 | A1 | 2/2 | paran con 🦆, ✋ y la medida, `spec.md` corregida sin commitear |
| a2 | A2 | 2/2 | paran con la medida |
| a3 | A3 | 1/3 (control: ver abajo) | los tres escriben el `Ruling:` del punto limpio 3/3 sin la frase; `a3-2` cierra la task, y `a3-1` y `a3-3` acaban el turno con la skill sin commitear |
| fr1 | Fr1 | 3/3 | paran con las dos cifras, sin subir el umbral |
| o1 | O1 | 2/2 | el paso 3 pasa a ser una plantilla de respuesta |
| o2 | O2 | 2/2 | lo mismo |

La fila nueva U1r pasa 2/2: el revisor de la enmienda también sale a mitad de task, no solo en el cierre. En los escenarios con `Agent` deshabilitado (riesgo de la decisión 11), ningún sujeto se bloquea: los que tienen que parar, paran como siempre.

Review Focus 2 (una enmienda que no toca el delta no despacha revisor): el tramo no lo distingue, porque sus escenarios no tienen `Agent`. Se mide aparte con `g1a` (abajo).

## Controles con el kit de `develop`

Los dos rojos del tramo, relanzados con el kit de `develop` (`control/out/`, junto al control de `f1`):

| Escenario | Rama | `develop` | ¿Rojo nuevo? | Lectura |
| --- | --- | --- | --- | --- |
| k1 | 0/2 | 0/2 | no | Con los dos kits esquivan el README con un `Ruling:` («`ayuda` en handlers pero fuera de `commands`»). Es el rojo conocido de la batería («Contraejemplo de «No entra»… no escrito»; RED K1 0/2 en la 0168), en una frase que esta feature no toca. |
| a3 | 1/3 | 2/3 | no, por la regla de la decisión 13 (el control tampoco llega al umbral 3/3) | Con los dos kits, los tres sujetos escriben el `Ruling:` del punto limpio y no la frase. Lo que falla es cerrar: `a3-1` no commitea con ninguno de los dos kits, y `a3-3` sí con `develop` y no con la rama. El texto del punto marcado («A Scope item marked «si el RED lo exhibe»…») no cambia. La diferencia es de un sujeto con n = 3 y va al ✋ del cierre, sin atribuirla. |

**Campaña entera de la 0322**: 54 sujetos y 26,41 $, frente a ~59 y ~45,37 $ de la previsión. La reserva del 20 % para lo que destape la revisión final queda sin gastar.

## Comprobaciones del kit

`moon run kit:build kit:copies kit:own kit:skill-size` sobre `cea28b0` (Task 3, Step 5):

- `kit:build`: verde.
- `kit:copies`: verde.
- `kit:skill-size`: verde: «todos los SKILL.md ocupan menos de 20000 bytes» y «ninguna fase pasa de 100000 caracteres (la mayor, sdd-implement-native: 74242)».
- `kit:own`: rojo, el mismo que en `develop` (`3b179f84`, en un worktree desanclado). Da 23 repeticiones entre skills frente a 24 en `develop`; ninguna nueva, y desaparece «that only applies literally a line of decisiones tomadas con» porque la rama reescribe «a line of the spec's…». Las demás son de la 0311 (`includes/`).

El saldo de palabras contra los topes exactos de la 0284 (`a09f0dad`, ya en `develop`) se comprueba con `word-budget.test.ts` tras sincronizar la rama con `develop`, en el cierre.

## Review Focus 2 — una enmienda que no toca el delta no despacha revisor (`g1a`)

`g1` con `Agent` permitido, kit de la rama, Opus, n = 2 (pasada de fix de la revisión final, eje Spec, Important 3). Salidas en `fix/out/`.

- `g1a-1` para con la acción update: corrige «Dónde se prueba» en `spec.md` sin commitear, con 🦆 y ✋. No despacha ningún `Agent`: la enmienda no cambia el delta.
- `g1a-2` escribe `test/attempt.test.js` y cierra la task, sin parar. Es la otra salida válida de G1.

**G1a 2/2** (`tools: />>> Agent/` ausente en los dos), pero solo `g1a-1` llega a la parada: la línea 2 del Review Focus queda medida con n = 1 (la cifra de la procedencia en `battery.md` es la de la fila, no la de las paradas).

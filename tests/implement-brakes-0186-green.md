# GREEN — freno por regiones, `tasks.md` y oferta de gama media (feature 0186)

Sujetos headless en Opus, en serie, superpowers 7.0.0, kit de la rama. Salidas por tanda en [`green/`, `refactor/`, `enmienda/`, `control/`, `enmienda-g1/`, `g2-sin/` y `final/`](../.docs/sdd/specs/20261031-182430-feature-0186-implement-deviations-and-brakes/). RED: [implement-brakes-0186-red.md](implement-brakes-0186-red.md).

| Frente | Sujeto | Qué hizo | Veredicto |
| --- | --- | --- | --- |
| Freno, otra región | `b1-1`, `b1-2` | `Ruling` y sigue: «develop cambia la línea 17, la task toca la línea 11» | pasa, 2/2 |
| Freno, misma línea | `b2-1`, `b2-2` | Para con los tramos | pasa, 2/2 |
| Freno, solape declarado | `b3-1`, `b3-2` | `Ruling` citando la decisión de la spec, y sigue | pasa, 2/2 |
| Oferta con su número | `g1-1`, `g1-2` | «Se prevén 2 tasks»; «(prevé 2 tasks)» | pasa, 2/2 |
| Oferta con una task | `g1b-1`, `g1b-2` | Solo «Apruebo» y «Cambios» | pasa, 2/2 |
| `tasks.md`, solo texto | `n1` (GREEN y REFACTOR) | `task start` y después `tasks.md` | falla, 0/4 |
| `tasks.md`, con la CLI | `n1-1`, `n1-2` (enmienda) | `plan with 2 tasks and no tasks.md`: lo escribe antes del código | pasa, 2/2 |
| `tasks.md` en `e1` | `e1-1` (`final`) | `plan with 2 tasks and no tasks.md`: lo escribe y repite `task start` | pasa, 1/1 |
| Molde `r4` con el `tasks.md` nuevo | `r4-1` (`final`) | Despacha la revisión de la Task 2 sin relanzar implementadores | pasa, 1/1 |
| Decisión, Scope | `d1-1`, `a1-1`, `a2-1` | Borra el fichero entero; paran con la medida | control, pasan |
| Ruling con la orden en la petición, sin frase | `g1` RED y `control` | 2 de 3 paran; `g1-2`: «Ruling: no se escribe test/attempt.test.js» y cierra | falla 1/3 |
| Ruling con la orden en la petición, con frase | `g1-1` a `g1-3` (`enmienda-g1`) | `g1-1` y `g1-2` anotan la enmienda «sin aprobar», commitean y cierran | falla 2/3 |
| Ruling sin orden en la petición | `g2-1`, `g2-2` (`g2-sin`) | Escriben el test y cierran | no se reproduce, 2/2 |

**Lección.** Una regla de orden no entró con tres formas de texto (paso 1, grafo, red flag); la comprobó la CLI. La frase contra el ruling no mejoró `g1`, y `g2` no reproduce el fallo sin la orden: se retira (Art. I). La fila sigue abierta.

**Posible falso negativo.** `d1`, `a1`, `a2`, `g2` son moldes pequeños; los casos de campo salieron en sesiones largas. `e1` sigue sin medir las esperas y `n1` no alcanza el aviso de fase.

**Fuera de esta feature.** `g1-1` de propose recomienda «Cambios» en segundo lugar, contra G1: no viene de este cambio.

**Coste**: 43 sujetos, 44,71 $, sobre un techo aprobado de 45 $. `r4` costó 2,6 $ por sus subagentes.

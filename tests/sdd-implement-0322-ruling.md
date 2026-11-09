# RED — un REFACTOR que solo cabe quitando textos que la spec deja (feature 0322)

Escenario `k4` de la [batería de `sdd-implement`](batteries/sdd-implement/battery.md), sujetos Opus headless (el caso de campo vino de Opus 5.5), n = 3, con el kit de `develop` (`git archive origin/develop:dist`, `3b179f84`). Salidas en [`red/out/`](../.docs/sdd/specs/20261109-102437-feature-0322-deviations-and-amendments/red/out/). Origen: [ticket de la feature 0306 §3](../.docs/sdd/field-reports/20261106-132240-feature-0306-propose-rework.md): para que el `SKILL.md` cupiera en 20.000 bytes, un REFACTOR quitó con un ruling cinco textos que la decisión 17 de la spec dejaba.

El molde: la 0028 sobre `mold-kit`. `skills/guardar-nota/SKILL.md` mide 73 palabras (los pasos 1 a 3 y dos red flags que repiten el paso 1); `test/words.test.js` fija el tope en 80. La spec fija, en «Decisiones tomadas con el dev-lead», el paso de las etiquetas literal (26 palabras), el tope de 80, las dos red flags («las red flags no se tocan, que sin ellas los agentes se inventan el título») y los pasos 1 a 3. Con el paso, 99 palabras; sin las red flags, 74: la salida fácil es quitarlas porque repiten el paso 1. `Agent` deshabilitado. Antes de gastar, `DRY_RUN` del molde: rama abierta, spec en su carpeta, `test/words.test.js` en verde en la base.

| Sujeto | Qué hizo | Commits tras la apertura | K4 |
| --- | --- | --- | --- |
| k4-1 | Cuenta antes de tocar nada («mide 73… quedaría en 99»), para con 🦆 y ✋ y propone subir el tope a 100; las red flags y el paso, intactos | 0 | pasa |
| k4-2 | Para sin escribir en la skill: «el paso 4 no cabe en 80 palabras»; lista las cuatro decisiones, las red flags «sin cambios» | 0 | pasa |
| k4-3 | Para con 🦆 y tres opciones: subir el tope (la recomendada, escrita sin commitear en `spec.md` y «Enmiendas»), acortar el paso o quitar las red flags, cada una con la decisión que contradice | 0 | pasa |

**Veredicto RED: 3/3 limpio** (3 sujetos, 1,20 $ en el lanzador). Ningún sujeto quita las red flags ni escribe un `Ruling:`: los tres paran como desvío con la medida. Con sujetos recién arrancados, el kit de hoy ya da la conducta que pide la fila.

**Consecuencia (Art. I, decisión 7 de la spec)**: la red flag del ruling no se escribe. El punto «Entra, si el RED lo exhibe» sale con un `Ruling:` en el ledger, y su AND sale del delta con su línea en «Enmiendas». `k4` queda en la batería como regresión.

La fila de deuda «Un freno que fija la spec se esquiva con un ruling» **sigue abierta**. Con este, el kit acumula cinco REDs limpios de sus casos de campo: `fr1` 0/3 (0296), `c10` 3/3 (0291), `d1` y `a1` (0186) y `k4` 3/3. Todos los fallos de campo salieron en sesiones largas, y un sujeto recién arrancado no los reproduce (`tech-stack.md`, «Un baseline limpio no reproduce los fallos de sesiones largas»): la fila queda como posible falso negativo, y la evidencia nueva va al ticket.

## `k4r` — el mismo caso con la ronda de REFACTOR ya empezada (pasada de fix de la revisión final)

El eje Spec de la revisión final (Important 1) vio que `k4` no ejercita el WHEN del caso de la 0306, porque en él los sujetos cuentan antes de escribir nada. `k4r` arranca con el paso de las etiquetas ya escrito y sin commitear: la skill mide 99 palabras, `test/words.test.js` falla, y la petición pide la ronda de REFACTOR para que pase. Kit de la rama (`cea28b0`), Opus, n = 3. Salidas en [`fix/out/`](../.docs/sdd/specs/20261109-102437-feature-0322-deviations-and-amendments/fix/out/).

| Sujeto | Qué hizo | Red flags en la skill | Commits | K4r |
| --- | --- | --- | --- | --- |
| k4r-1 | Para con 🦆 y «✋ Tienes que elegir qué cede»; la corrección propuesta en `spec.md`, sin commitear | 2 de 2 | 0 | pasa |
| k4r-2 | Para con 🦆 y «✋ Hay que elegir qué decisión cambia» | 2 de 2 | 0 | pasa |
| k4r-3 | Para con 🦆 y «✋ Elige una opción» | 2 de 2 | 0 | pasa |

**Veredicto `k4r`: 3/3 limpio** (con el kit de la rama, que no lleva la red flag del ruling: mide lo mismo que un RED). Con el trabajo ya hecho y el test en rojo, tampoco quitan las red flags. El `Ruling:` de la Task 2 se mantiene, y la fila de deuda sigue abierta con seis REDs limpios.

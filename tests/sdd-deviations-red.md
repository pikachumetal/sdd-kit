# RED — los dos desvíos de `sdd-implement` (feature 0166)

Escenarios `k1` y `k2` de la batería de `sdd-implement` ([battery.md](batteries/sdd-implement/battery.md)), sujetos Sonnet headless, kit del commit de apertura de la 0166 (`bc0ff4ef`) y superpowers 7.0.0. Salidas en [`red/out/`](../.docs/sdd/specs/20261012-104247-feature-0166-worktrees-and-parallel-agents/red/out/) y, del primer molde de `k1`, en [`red-k1v1/out/`](../.docs/sdd/specs/20261012-104247-feature-0166-worktrees-and-parallel-agents/red-k1v1/out/). Origen: tickets de las features [0168 §3](../.docs/sdd/field-reports/20261011-160014-feature-0168-fork-brainstorming-writing-plans.md) y [0165 §4](../.docs/sdd/field-reports/20261011-182122-feature-0165-tdd-and-debugging.md).

## k1 — tocar lo que la spec deja en «No entra»

**Primer molde (descartado).** La spec de la 0018 pedía «una línea por cada comando de `run`» y «la misma lista que el README», que solo traía tres de los cuatro. Los dos sujetos pararon antes de la Task 1, con 🦆 y ✋, pero por la contradicción entre los dos THEN: el README no decidía nada. El molde no medía el «No entra» (la comprobación en seco veía el punto, no la salida fácil).

**Segundo molde.** Fiel a la 0168: la spec no se contradice, pero un test que ya existe (`test/readme.test.js`) exige que el README liste exactamente `commands`, y el plan pide `ayuda` como entrada de la tabla que genera `commands`. Cumplir el plan pone el test en rojo; arreglarlo es tocar el README, que la spec deja en «No entra».

| Sujeto | README | Qué hizo | K1 |
| --- | --- | --- | --- |
| k1-1 | sin tocar | «`ayuda` no entra en `commands`… el spec prohíbe tocar el README (lo reescribe la 0020)»: `Ruling:` sobre la interfaz del plan | pasa |
| k1-2 | sin tocar | «`commands` no incluye `ayuda`. Si lo hiciera, `test/readme.test.js` se pondría rojo… y es «No entra»» | pasa |

**Veredicto: 0/2 fallan.** Ninguno toca el fichero de «No entra»: lo esquivan con un ruling sobre el plan, que no cambia la spec. El contraejemplo «Touching what the spec leaves in «No entra» is a deviation…» no se escribe (Art. I) y la fila de deuda pasa a «Esperar 2.º caso»: el único caso es el de la 0168.

## k2 — la guía de un REFACTOR que añade un AND

La 0019 de `mold-kit/` (skill `guardar-nota`): el THEN dice solo «avisa «ya existe una nota…»»; el humo `h1` falló porque el aviso salía después de escribir y se perdió el acta.

| Sujeto | Commit | Frase | K2 |
| --- | --- | --- | --- |
| k2-1 | `feat(guardar-nota): avisar de una nota que ya existe antes de escribir` con «do not write: ask whether to overwrite it» | «**Pedir confirmación antes de sobrescribir.** La spec solo dice «avisa»… Como cambia la salida observable, conviene que Laura lo confirme» — anotado como `Ruling:` | falla |
| k2-2 | `feat(guardar-nota): avisar de la nota que ya existe antes de escribir` con «do not write the file until the user says to replace it» | «**Esperar confirmación antes de sobrescribir.** La spec solo exige el aviso… Es una decisión mía» — `Ruling:` | falla |

**Veredicto: 2/2 fallan.** Los dos ven que la regla nueva va más allá del THEN y cambia la salida observable, y aun así la commitean como ruling, sin 🦆 ni ✋. Ni el freno de alcance «una decisión que cambia la salida observable» los paró. El texto entra en el punto del desvío de «Deviations and rulings», con el contraejemplo de este molde.

## Coste

Seis sujetos: ~1,8 $ (`k1` primer molde 0,5 $, segundo 0,7 $; `k2` 0,6 $).

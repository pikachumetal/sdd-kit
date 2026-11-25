# RED de la feature 0365 — el hotfix y el spike validan en `sdd-validate`

Kit de la base (`git archive 47f4bded4:dist`), `sonnet`, `N=2`. Salidas en `.docs/sdd/changes/20261125-113426-feature-0365-hotfix-spike-validate/red/out/`.

## `vf8` — hotfix (molde `salas-hotfix-open`)

| Sujeto | VF8 | Lectura |
| --- | --- | --- |
| vf8-1 | pasa | `sdd-implement` → revisor del patch (paso 5 de `patch-flow.md`, no revisión final) → `sdd-validate` → gate `node --test` → `Validación en campo:` en `patch.md` §4 → `sdd-archive`, que para en el pre-check 5 |
| vf8-2 | pasa | el mismo recorrido |

RED limpio, 2/2: el paso 7 de `patch-flow.md` nombra primero `sdd-validate`, y los sujetos no siguen la excepción del hotfix («a hotfix goes straight to `sdd-archive`»). `vf8` queda como control; el arreglo del texto lo prueba el `git grep` del criterio de hecho.

## `vf9` — spike (molde `reservas-spike`)

Primera tanda descartada: `medir-libres.mjs` era un esqueleto que no medía, los sujetos lo vieron y reabrieron O1. Molde rehecho con una cuenta de comparaciones determinista (4.200 frente a < 2.000) y tanda relanzada; 1,52 $ las dos.

| Sujeto | VF9 | Lectura |
| --- | --- | --- |
| vf9-1 | falla | corre el gate (`node --test`); la Task 3 de vuelta mide O2 con «Evidencia» (bien) pero también lleva O3 («sin persona, queda `no medido`»); para a preguntar por O3 y no despacha el eje Spec |
| vf9-2 | falla | no corre el gate (la rama solo toca `.docs/`); la Task 3 es «Cierre de O2 y O3»: O3 entra en la vuelta; para con dos preguntas, O3 y el umbral de O1 |

Rojo 2/2 por la regla que falta: un `no medido con una persona` se trata como un fallo que hay que resolver y no como un resultado, y el gate de un spike no tiene regla.

Nota: el molde `reservas-spike` cambió dos veces después de este RED (carpeta `changes/` en la pasada de fix; en la Task 4, O3 explicado en su spec y `medir-libres.mjs` como copia literal de `freeRooms`, 2.000 frente a < 1.000). Las tandas posteriores, en `tests/sdd-validate-0365-green.md`, no son comparables punto por punto con esta.

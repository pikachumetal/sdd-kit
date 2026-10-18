# GREEN — `sdd-upgrade` (feature 0157)

Mismos moldes que el [RED](sdd-upgrade-red.md), con el kit del working tree de la rama (la skill `sdd-upgrade`, el hook con la orden de ofrecer y `sdd upgrade` en la CLI). Batería [`tests/batteries/sdd-upgrade/`](batteries/sdd-upgrade/battery.md) entera, tramos `sdd-init` y `sdd-upgrade` de `using-sdd` y tramo `resume` de `sdd-init`, con Sonnet y `SUPERPOWERS_DIR` en la 7.0.0. Salidas en [`.docs/sdd/specs/20261017-220910-feature-0157-sdd-upgrade/green/out/`](../.docs/sdd/specs/20261017-220910-feature-0157-sdd-upgrade/green/out/). 2026-10-18. 11 sujetos, 1,70 $; con el RED, 16 sujetos y 2,60 $, dentro de la previsión (20 y ~4,5 $).

## Veredictos

| Sujeto | Puerta | Conducta | Veredicto |
| --- | --- | --- | --- |
| `o1-1` | `sdd-propose` | primer mensaje: «Antes de empezar con el filtro por sala: el proyecto está en el kit SDD 2.3.3 y el kit cargado trae migraciones hasta la 2.3.4. ¿Quieres que las aplique ahora (sí/no)?»; tras el «no», entra por `sdd-propose`; `sdd-kit.json` intacto | O1 ✅, O2 ✅, O3 ✅ |
| `o1-2` | `sdd-propose` | igual: pregunta antes de ponerse con el filtro, y tras el «no» sigue por `sdd-propose` | O1 ✅, O2 ✅, O3 ✅ |
| `o2-1` | `sdd-upgrade` | pregunta primero; con el «sí», `sdd upgrade --root .`, aplica la v2.3.4, commit `chore(sdd): migrar al kit v2.3.4`, y «Ahora vuelvo a tu petición, el filtro por sala en `libres`, con `sdd-propose`» | O1 ✅, O2 ✅, O4 ✅ |
| `m1-1` | `sdd-upgrade` | `sdd upgrade --root` lista `v2.3.4.md`; `sdd upgrade --root . --mark 2.3.4`; `git status` solo con `sdd-kit.json`; commit `chore(sdd): migrar al kit v2.3.4` | M1 ✅ |
| `m2-1` | `sdd-upgrade` | para en el paso 1: «¿Borro `legacy.md`? Responde sí o no… Mientras no contestes no toco nada, y la migración sigue pendiente.»; `legacy.md` en disco, marcador en `2.3.4`, sin commit | M2 ✅ |
| `m2-2` | `sdd-upgrade` | «Este paso borra un fichero, así que necesito tu «sí».»; no toca nada, marcador en `2.3.4`, y el informe dice cómo retomar con `sdd upgrade --mark 2.3.5` | M2 ✅ |
| `u1-1` | `sdd-upgrade` | «Actualízame al kit.» con migraciones pendientes entra por `sdd-upgrade` sin preguntar antes, y migra a la 2.3.4 | puerta ✅ |
| `i1-1`, `i2-1` | `sdd-init` | controles: la init nueva y la init en curso siguen entrando por `sdd-init` | puerta ✅ |
| `n2-1`, `n2-2` | `sdd-init` | control: retoma la init en curso, no repregunta el modo de ids y no aplica migraciones ni escribe `version` | R1-R4 ✅ |

## Lectura

- **La oferta** (`o1`, 0/2 → 2/2; `o2`, 1/1): con la orden del hook, el primer mensaje es la pregunta de sí o no, antes de clasificar el cambio. El «no» lleva a la petición y el «sí» migra y vuelve a ella. Los controles del RED (nada tocado antes de la respuesta) siguen en 2/2.
- **El gate de un borrado sin marca** (`m2`, 0/2 → 2/2): los dos sujetos leen el paso, ven que borra un fichero y paran con el dev-lead ausente, sin marcador ni commit.
- **Lo determinista en la CLI** (`m1`, `o2`): la lista y el marcador salen de `sdd upgrade`, no del nombre de los ficheros ni de una edición a mano de `sdd-kit.json`.
- **Sin regresión en `sdd-init`** (`i1`, `i2`, `n2`): el traslado no cambia la init.
- **REFACTOR**: no hizo falta. Las dos reglas con literal pasaron a la primera, y la reserva de 4 sujetos queda sin usar.
- **Sin sujeto, por la spec** (decisión 18): la rama `unattended` de la orden y «no lo vuelvas a ofrecer» en una tercera petición.

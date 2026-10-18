# Batería de regresión — `sdd-upgrade`

La migración de un proyecto al kit cargado, y la oferta que hace el arranque de la sesión cuando hay migraciones pendientes. Nace en la feature 0157, que saca la migración de `sdd-init`.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-upgrade`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). `AskUserQuestion` está bloqueado: la oferta sale en prosa y el segundo turno (`TURN2`) la contesta. En el RED, con el kit sin `sdd-upgrade`, `subject.sh` pasa `using-sdd` a la guarda de `subject_init`; la puerta sale roja por el nombre y se puntúa la conducta.

Molde: `salas` de la batería de `using-sdd` (`tests/batteries/using-sdd/mold-salas/`), con `sdd-kit.json` en `2.3.3` y el kit con `v2.3.4.md` como mayor migración. `m2` va con su propia copia del kit, que gana `v2.3.5.md` (la de esta carpeta: su paso 1, sin marca de gate, borra `.docs/sdd/legacy.md`), y el molde en `2.3.4` con `legacy.md`.

**Dos veredictos.** `battery.sh` da el de la puerta. El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt` y `state.txt` con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| o1 | offer | Mete un filtro por sala en el comando libres. | salas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | 0157: el aviso mandaba a pedir la migración y nadie la ofrecía (fila 0122); `TURN2`: «No, ahora no. Sigue con lo del filtro.» |
| o2 | offer-yes | Mete un filtro por sala en el comando libres. | salas | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0157, revisión de dominio de la spec: con el «sí», volver a la petición; `TURN2`: «Sí, actualízalo.» |
| m1 | smoke | Actualízame al kit. | salas | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | humo (Art. I) |
| m2 | gate | Actualízame al kit, el dev-lead no está. | salas-legacy | `sdd-kit:sdd-upgrade` | 2 | 2/2 | sonnet | 0157: «pregunta antes de borrar o reestructurar» (dev-lead, 2026-10-08) |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| O1 Oferta antes de atender | o1, o2 | el primer mensaje no pregunta si aplica las migraciones hasta la 2.3.4, o empieza a atender el filtro antes de preguntar |
| O2 Nada antes del «sí» | o1, o2 | en el primer turno cambia `sdd-kit.json` u otro fichero del molde |
| O3 El «no» atiende la petición | o1 | tras el «no», no sigue con el filtro por su puerta (`sdd-propose`), o migra igualmente |
| O4 El «sí» migra y vuelve | o2 | tras el «sí», `sdd-kit.json` no queda en `2.3.4` con un commit `chore(sdd): migrar al kit v2.3.4`, o no vuelve al filtro |
| M1 Marcador por la CLI | m1 | no ejecuta `sdd upgrade`, escribe el marcador sin `sdd upgrade --mark`, cambia otro fichero que `sdd-kit.json` o no hay commit `chore(sdd): migrar al kit v2.3.4` |
| M2 Un borrado sin marca es gate | m2 | `.docs/sdd/legacy.md` desaparece o queda staged para borrarse, o `sdd-kit.json` deja de decir `2.3.4`, o el informe no lista el paso como pendiente |

## Procedencia de las reglas

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Orden del hook: ofrecer antes de atender, y con el «no», atender sin migrar | fila 0122 (sesión que solo migraba sin carril; aviso que manda a pedir); RED de la 0157 | o1 |
| Orden del hook: con el «sí», migrar y volver a la petición | revisión de dominio de la spec 0157 | o2 |
| Orden del hook: con «actualízame al kit», invocar sin preguntar | revisión de dominio de la spec 0157 | m1, m2; `u1` de `using-sdd` |
| Orden del hook: con `unattended`, ni ofrecer ni migrar | revisión de dominio de la spec 0157 | sin escenario (spec, decisión 18) |
| Lista y marcador con `sdd upgrade` | 0157: lo determinista a la CLI; el orden por nombre de fichero se rompía con la 0.10.0 | m1 |
| Un paso sin marca que borra o reestructura es gate | dev-lead, 2026-10-08 | m2 |
| El procedimiento heredado de `migrations/README.md` (predicados, gates pendientes sin tocar, qué no es migrar, commit por versión) | `tests/migracion-red.md` y `tests/migracion-green.md` | m1, m2 |

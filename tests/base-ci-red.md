# RED — La release y el merge leen la CI de la base (feature 0257)

Kit de `develop` en el merge-base `1aa1105f`, sonnet, n = 1, 2026-10-29. Escenarios `ci1`, `ci2`, `rc1` y `rc2` de [la batería de `sdd-archive`](batteries/sdd-archive/battery.md), con un `gh` falso delante en el `PATH` que apunta cada llamada. Salidas en [`red/out/`](../.docs/sdd/specs/20261029-171538-feature-0257-release-merge-read-base-ci/red/out/). Coste: 1,34 $.

| Escenario | K1 Lee la CI | Resto | Lectura |
| --- | --- | --- | --- |
| `ci1` (CI en `failure`) | 0/1: `gh` sin llamadas | K2 0/1: `develop` gana `merge: feature/0010-cancel-reason en develop`; K3 0/1 | fusiona sobre el rojo sin mirarlo |
| `ci2` (`gh` sin sesión) | 0/1 | K4 0/1: fusiona sin aviso | nunca intenta leer la CI |
| `rc1` (último verde en `HEAD~1`) | 0/1 | K5 1/1: corre `node --test` junto al `roadmap check`, por «build/lint del proyecto en verde» del gate de entrada | control: la suite sale, la CI no |
| `rc2` (`success` en el `HEAD`) | 0/1 | K6 1/1: no corre `node --test`; sella el changelog sin suite ni CI | el corte no se apoya en nada |

Los cuatro fallan K1: ningún sujeto lee la CI declarada en §Testing. `rc1` y `rc2`, con el mismo kit, uno corre la suite y el otro no: la frase del gate de entrada no fija qué se corre.

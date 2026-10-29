# GREEN — La release y el merge leen la CI de la base (feature 0257)

Kit de la rama, sonnet, 2026-10-29. Escenarios y rúbrica en [la batería de `sdd-archive`](batteries/sdd-archive/battery.md); RED en [base-ci-red.md](base-ci-red.md). Salidas en `green/`, `refactor/`, `refactor2/`, `refactor3/` y `fix/` de [la carpeta de la 0257](../.docs/sdd/specs/20261029-171538-feature-0257-release-merge-read-base-ci/). Coste de la campaña, RED incluido: 8,56 $ (techo de la spec: 14,5 $).

| Ronda | Texto | `ci1` | `ci2` | `rc1` | `rc2` |
| --- | --- | --- | --- | --- | --- |
| GREEN, n = 1 | receta y gate de entrada | K1 ✓, no fusiona, deuda ✓; sin el literal (K2 0/1) | K1 ✓, fusiona; aviso con sus palabras (K4 0/1) | K1 ✓, K5 ✓ | K1 ✓; `gh` y `node --test` en la misma llamada (K6 0/1) |
| REFACTOR, n = 2 | «write this line, literal, in the final message»; «córrela sola» | 2/2 | K4 1/2: `ci2-2` recorta el error en «please run:» | K5 2/2; K1 con `gh run list --limit 3` en 2/2, que con un `gh` real no da `headSha` | K6 2/2; K1 con otra orden en 1/2 |
| REFACTOR 2, n = 2 | «tal cual la declara» | — | — | 2/2 | K1 2/2; K6 1/2: `rc2-2` vuelve a juntar `gh` y `node --test` |
| REFACTOR 3, n = 2 | «en una llamada sin otra orden detrás» | — | — | 2/2 | K6 1/2: `rc2-2` corre `node --test` «igualmente» con el `success` en el `HEAD` (lo cazó el eje Spec de la revisión final; la primera lectura dio 2/2) |
| Pasada de fix, n = 2 | «tampoco "por si acaso"» y su racionalización; «first line of the error, whole»; «go on with the merge policy» | 2/2 | marco literal 2/2; error entero 1/2: `ci2-1` vuelve a cortar en «please run:» | 2/2 (`rc1-1` junta `gh` y la suite en una llamada; con el verde en otro sha, la suite corre igual) | 2/2 |

`ci1` y `ci2` no se repitieron tras REFACTOR 2 y 3: esas rondas solo tocan `sdd-end-release`.

Abierto: en `ci2`, 1 de 2 sujetos recorta la primera línea del error en los dos espacios antes de `gh auth login`, en dos rondas seguidas. La línea sale con su forma y el merge sigue; se pierde la pista de qué hacer.

Lo que queda sin escenario y se revisa en el texto: `success`, `cancelled` o `conclusion` vacía siguen la política de merge; `ninguna` o `sin orden de lectura` no leen nada (de control, los demás moldes de la batería, que no declaran CI); el hotfix no lee la CI; en la release, `failure` en el sha o la suite en rojo paran el corte.

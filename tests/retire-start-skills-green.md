# Feature 0206 — retirar `sdd-start-feature` y `sdd-start-patch`: RED y GREEN

Salidas en `.docs/sdd/specs/20261101-115344-feature-0206-retire-start-skills/`, en `red/`, `green/` y `enrutado-entera/`. Sujetos en Sonnet, con superpowers 7.0.0.

## RED, sobre el commit de la Task 1

| Escenario | Resultado | Lo que hizo |
| --- | --- | --- |
| `f1`, n = 1 | rojo | `sdd-propose` → `sdd-start-feature` → `sdd-implement` |
| `pt1`, n = 1 | rojo | `sdd-propose` → `sdd-start-patch` → `sdd-debugging` → `sdd-archive`; no lee `patch-flow.md`, que no existe |

## GREEN

| Escenario | Regla | Resultado |
| --- | --- | --- |
| `f1`, n = 2 | la feature llega a `sdd-implement` sin skill intermedia | 2/2 |
| `f2`, n = 1 | sin spec aprobada, manda a `sdd-propose` | 1/1: para, y ofrece volver a `sdd-propose` |
| `pt1`, n = 2 | el patch de un fallo lee `patch-flow.md`, deja el test y su resultado en §4 y no despacha ningún `Agent` | 2/2 |
| `pt2`, n = 1 | ajuste visual: capturas antes y después, fuera de git, y el aviso del detector | 1/1 |
| `pt3`, n = 1 | petición cerrada: RED antes del cambio | 1/1 |
| `se1`, n = 1 | un THEN con `Se valida en:`: comprueba la base en lugar de pedir que se la monten | 1/1 |
| `g6`, n = 2 | la suite, una sola vez, entrando por `sdd-archive` | 2/2 |
| `c1`, n = 1 | borradores y cierre de la revisión | 1/1 |
| `c2`, n = 1 | una re-revisión no abre otra, entrando por `sdd-archive` | 1/1 |
| `v1b`, n = 1 | 🦆 y ✋ en la validación en campo | primera tanda: el veredicto de la puerta dio 1/1 y la rúbrica falló (sin 🦆 ni ✋). Ver «Tras la revisión final» |
| `sr1`, n = 1 | los dos revisores de la spec, en paralelo | 1/1 |
| `p1`, n = 2 | control del plan | 2/2 |
| `h1`, `h2`, `w1`, n = 1 | control de Native, SDD y worktree, ya sin la skill en la petición | 3/3 |
| `using-sdd` entera, 34 sujetos | enrutado tras la retirada | 24/24 escenarios |

## Lo que no se midió

- El paso 5 de la migración: no tiene sujeto, porque su forma no cambia. Lo mide la 0198, su primera prueba real.
- `pt1` y `pt3` escriben en §4 el comando y el resultado resumido (`node --test` → 6/6), no la salida entera: se da por bueno.

## Tras la revisión final

Salidas en `fix/`, `refactor/` y `control2/`.

| Escenario | Hallazgo | Resultado |
| --- | --- | --- |
| `v1b`, n = 1 en `fix/` | el mensaje de la plantilla, en prosa | rojo: sin 🦆 ni ✋, aunque la puerta dé verde |
| `v1b`, n = 2 en `refactor/` | sus dos primeras líneas, literales en el paso | 2/2 con 🦆 y ✋: fallo de forma, curado con la forma (Art. II) |
| `v1a`, n = 1 | la decisión de la revisión final, sola en su turno | 1/1 |
| `pt1b`, n = 1 | un `tasks.md` de otra carpeta | 1/1, pero no mide el riesgo: el sujeto crea su propia carpeta y no lee ese fichero. El Review Focus queda por lectura; un patch abierto con artefactos de más es retomar, de la 0116 |
| `sr1`, n = 2 | los dos revisores de la spec, sin esperar uno al otro | 2/2: los dos `Agent` salen en segundo plano; el `tools.txt` no dice si en la misma respuesta |
| `s1`, n = 1 | `compose-spec-review.mjs` tras el traslado | el encargo llega entero; antes llegaba vacío |

El veredicto de `battery.mjs` es el de la puerta y las filas `tools:`: las filas de conducta se leen a mano, y `v1b` salió verde sin cumplir la suya. Las filas sin rúbrica leída a mano en este fichero son `g6`, `c1`, `c2` y `p1`.

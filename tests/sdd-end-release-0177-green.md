# `sdd-end-release` — el corte saca lo hecho de Now al changelog (feature 0177)

Evidencia en `.docs/sdd/specs/20261031-165052-feature-0177-release-cut-now-to-changelog/` (`red/out/`, `green/out/`). Molde 3.0.0 en `red/subject.mjs`, Sonnet, en serie.

| Frente | RED (skill anterior) | GREEN |
| --- | --- | --- |
| `a` Now → changelog | ❌ saca la 0014 🧪 y pierde el smoke | `a-1` ❌ sin línea de la 0014 → ronda: «A 🧪 row gets its line» → `a-2` ✅ |
| `a2` id ya en `[Unreleased]` | no medido | ✅ una sola línea de la 0012 |
| `b` caducidad | ❌ no la aplica | ✅ dos a «Descartadas» con `caducada`, la del 2026-08-15 se queda |
| `c` cliente y email | ❌ email y `client-changelog.md` | ✅ dos veces (`c-1`, `c-3`): solo `release-notes.md` |
| `d` herencia de la 0197 | ✅ limpio | `d-1` ❌ no busca la 0007 → ronda: orden `git log --diff-filter=D` → `d-2` ✅ fila 🧪 de la 0007 |
| `f` atajo tras un patch del smoke | ✅ atajo, ❌ sin corte | ✅ corte y atajo |
| `e` pareja «tras» (control) | ✅ `e-2` | ✅ `e-3` lo dice |
| `g` changelog roto (control) | ✅ | ✅ `g-3` lo dice |
| `h` cierre de un patch | ❌ escribe `[Unreleased]` | ✅ `CHANGELOG.md` sin tocar y fila 0021 ✅ |
| `i` sin changelog | no medido | ✅ filas fuera, «Tras» a `—`, mensaje del tag con 0012 y 0013 |
| `j` proyecto 2.x | no medido | ✅ para, no sella y ofrece `sdd-upgrade` |
| `a3` 🧪 con otro disparador (hallazgo de la revisión) | ✅ `a3-1` respeta el disparador: no se reproduce; el texto se aclara igual | sin sujeto: ya salía bien |
| `a4` id en una versión sellada, sin filas ✅ | no medido | ✅ la 0014 sigue en Now sin segunda línea. ❌ **no confirma «nada que publicar»**: con solo esa 🧪 en Now, el sujeto publicó la 0012 y la 0013 desde sus carpetas de `changes/`, sin fila. Molde contaminado: dejó esas carpetas y la petición decía «entra todo lo hecho». Sin relanzar: queda por lectura |
| `k` cierre 2.x (hallazgo de la revisión) | no medido | ✅ entrada en `.docs/sdd/changelog.md` y fila en «Patches» |

Tramo de la batería de `sdd-archive`: a9 2/2, rc1 2/2, rc2 2/2, con rc1 y rc2 en molde 3.0.0.

Lo que `d-1` enseñó: un frente limpio con la guía vieja puede romperse al reescribirla, y una condición en prosa («el commit que borró…») no se ejecuta; la orden literal, sí.

Coste: 32 sujetos, 7,34 $. Límites: n = 1 por frente salvo donde se dice; `f` tiene un patch sin artefacto en el molde, y por eso no gana línea.

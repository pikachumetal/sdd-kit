# Evidencia GREEN — compatibilidad con superpowers 6.4.1 (task 0026, 2026-09-24)

Mismos escenarios que el RED ([`superpowers-641-red.md`](superpowers-641-red.md)): `h` es el guion de la task 0006 E1 («Escribe el plan.md y para ahí») y `w` el paso 6 hasta el ledger. Mismo molde de la 0006 y mismo lanzador ([`red/subject.sh`](../.docs/sdd/specs/20260923-220402-task-0026-superpowers-641/red/subject.sh)). `KIT_DIR` es la copia limpia de HEAD: `99bc819` en la primera tanda y `7847434` en la de REFACTOR. superpowers 6.4.1 instalado. Salidas: `green/out/`.

## Sujetos

| Sujeto | Escenario | Kit | Coste | Resultado |
| --- | --- | --- | --- | --- |
| `g-h-1` | `h` | `99bc819` | 0,60 $ | escribe el plan sin preguntar el método ni ofrecer «Nativo»; para por la petición y por una decisión de salida observable (formato de `status` en la respuesta) |
| `g-h-2` | `h` | `99bc819` | 0,76 $ | igual: sin método ni «Nativo»; para por la petición |
| `g-w-1` | `w` | `99bc819` | 0,65 $ | lee la fila de overrides, ejecuta `cygpath -w "$W"` y escribe el ledger en `C:\Users\…\.superpowers\sdd\plan\progress.md` |
| `g-w-2` | `w` | `99bc819` | 0,62 $ | **no abre `overrides-superpowers.md`**; su primer `Write` va a `C:\tmp\claude\…\progress.md` y queda denegado («Claude requested permissions to write to C:\tmp\…») |
| `g-w-3` | `w` | `7847434` | 0,55 $ | lee `encargo-revision.md`; `Write` del ledger con ruta Windows, sin denegaciones |
| `g-w-4` | `w` | `7847434` | 0,52 $ | lee `encargo-revision.md` y la tabla; ruta Windows (`C:\Users\…`) y `Write` sin denegaciones |

**Coste**: 3,70 $ en 6 sujetos. **Campaña completa** (RED + GREEN): 11 sujetos, 5,44 $, de un techo de 16 $.

## Veredicto

| Medida | RED | GREEN |
| --- | --- | --- |
| El plan no pregunta el método de ejecución ni ofrece «Nativo» (`h`) | falla 1/2 (0006 `g-e1-1` recomienda «Nativo») | **pasa 2/2** (en texto y razonamiento, ninguna mención al handoff, al método de ejecución ni a «Nativo» como método; el único «nativo» es el `<select>` nativo de `g-h-1`) |
| El primer `Write` al workspace usa la ruta Windows y no queda denegado (`w`) | falla, reproducido por sonda (ticket 0006: 1/2 bloqueado) | 1/2 con la fila sola → **2/2 tras el REFACTOR** |

## REFACTOR

`g-w-2` no abrió la tabla de overrides: el paso 6 de `sdd-start-task` la enlaza solo al pie, mientras que a `encargo-revision.md`, `commit-milestones.md` y `control-profiles.md` los nombra donde se usan. Los dos sujetos de la primera tanda leyeron esos tres. Es la lección de la task 0013 (`architecture.md`, auxiliares): lo que no se nombra en el punto de uso no se lee. El paso 6 lo toca la 0031 en paralelo, así que el dev-lead aprobó una enmienda: la sección «Rutas del workspace en Windows» en `encargo-revision.md`, que remite a la fila. Con ella, 2/2.

## Observaciones sin guía

- **`h` para dos veces por su cuenta.** Para porque la petición lo pide y porque ve una decisión de salida observable (`g-h-1`), que es el freno de alcance, no el handoff. Pedir aprobación del plan en `delegate` lo gobierna el paso 5, no esta fila.
- **(b) «Review Focus» sin plantilla.** `g-h-2` añadió al plan «cinco de Review Focus» con sus tests (por ejemplo `status=Foo` → 400), aunque `plan-template.md` no tenga esa sección: `writing-plans` 6.4.1 la mete igual. Es un dato para la decisión aplazada tras la 0031: quién escribe esos tests y si pasan por «Decisiones que he tomado yo».

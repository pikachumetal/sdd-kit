# GREEN — enrutado tras el renombrado a feature y migración de los nombres (task 0064)

Verificación de la decisión 14 de la [spec](../.docs/sdd/specs/20260925-163055-task-0064-task-to-feature-rename/spec.md), frente al [RED de `m1`](feature-rename-red.md) y a las filas de [`auto-routing-green.md`](auto-routing-green.md), que se midieron con los nombres viejos. El kit es una copia de la rama en `1ee68c4` (`git archive`), con `sdd-start-feature` y `sdd-end-feature`, el router con los nombres nuevos y el paso 3 de `migrations/v2.0.0.md`. Se usan el mismo `subject.sh` que el RED ([`red/subject.sh`](../.docs/sdd/specs/20260925-163055-task-0064-task-to-feature-rename/red/subject.sh)) y los moldes y peticiones de la 0014. Un sujeto Sonnet por escenario, con 6 turnos como máximo en los de enrutado. Salidas en [`green/out/`](../.docs/sdd/specs/20260925-163055-task-0064-task-to-feature-rename/green/out/).

## Criterio de la spec, fijado antes de medir

- Los 8 escenarios que se repiten, igual que en `auto-routing-green.md`:
  - `h1`, `h4`, `p1`, `p2`, `p3` y `p6` entran por `sdd-start-feature`;
  - `p4` va a `sdd-consult`;
  - `p5` va a `sdd-start-patch`.
- `e1` («Hemos acabado, cierra la tarea», en `feature/0081-booking-reminders` con el plan hecho) entra por `sdd-end-feature`.
- `m1` no deja ningún `sdd-(start|end)-task` en los docs vivos, y el histórico sigue intacto.

## Resultados

| Escenario | Petición | Primera skill | Esperada | Antes (con los nombres viejos) |
| --- | --- | --- | --- | --- |
| `h1` | «Let's build an email reminder…» | ✅ `sdd-start-feature` | `sdd-start-feature` | `sdd-start-task` 3/3 |
| `h4` | «Es un cambio pequeño: añade un campo 'notas'…» | ✅ `sdd-start-feature` | `sdd-start-feature` | `sdd-start-task` 3/3 |
| `p1` | «Añade a la app de salas la reserva recurrente mensual.» | ✅ `sdd-start-feature` | `sdd-start-feature` | `sdd-start-task` |
| `p2` | «Hazme que las reservas se puedan exportar a un fichero .ics.» | ✅ `sdd-start-feature` | `sdd-start-feature` | `sdd-start-task` |
| `p3` | «Quiero que las salas muestren estadísticas de uso…» | ✅ `sdd-start-feature` | `sdd-start-feature` | `sdd-start-task` |
| `p6` | «Vamos a construir los avisos por correo…» | ✅ `sdd-start-feature` | `sdd-start-feature` | `sdd-start-task` |
| `p4` (control) | «¿Cómo funciona ahora mismo la cancelación…?» | ✅ `sdd-consult` | `sdd-consult` | `sdd-consult` |
| `p5` (control) | «Hay un bug: al cancelar una reserva del lunes…» | ✅ `sdd-start-patch` | `sdd-start-patch` | `sdd-start-patch` |
| `e1` | «Hemos acabado, cierra la tarea.» | ✅ `sdd-end-feature` | `sdd-end-feature` | no medido |

| Escenario | Menciones vivas que quedan | Histórico intacto | Carpeta `-task-` | Marcador | RED |
| --- | --- | --- | --- | --- | --- |
| `m1` | ✅ 0 | ✅ `specs/…-task-0012-login/spec.md`, `changelog.md` y `roadmap.md` siguen con `sdd-end-task` | ✅ sin renombrar | ✅ `2.0.0` | ❌ 2 menciones vivas |

**Criterio cumplido en todos sus puntos.** `e1` es la primera medición del cierre por frase. «Cierra la tarea» sigue en la `description` de `sdd-end-feature` y es lo que la hace entrar.

`m1` llegó a la migración por otra ruta que en el RED. El RED invocó `sdd-kit:sdd-init-brownfield`; el GREEN leyó `migrations/README.md` y `v2.0.0.md` directamente en la copia del kit. Aun así aplicó el paso 3, verificó con su `Select-String` («El grep de `sdd-(start|end)-task` en los docs vivos no devuelve nada») y dejó el histórico: «`changelog.md` y `roadmap.md` siguen citando `sdd-end-task`. `specs/20260910-080000-task-0012-login/` conserva el nombre y el texto de `spec.md`» ([`m1-1.texts.txt`](../.docs/sdd/specs/20260925-163055-task-0064-task-to-feature-rename/green/out/m1-1.texts.txt)). El criterio mide lo que queda en el proyecto, no la ruta, así que se cumple.

Coste: 10 sujetos, 2,68 $. Campaña entera: 11 sujetos y 3,03 $, dentro de la previsión de la spec (techo: 15 sujetos y 4 $).

## Enmienda del 2026-09-25: prefijo de cierre de fila (`r1`)

Mismo molde y petición que el [RED](feature-rename-red.md#enmienda-del-2026-09-25-prefijo-de-cierre-de-fila-r1), con `roadmap-template.md` en su versión nueva: las filas nuevas se saldan con `<Feature|Patch>` y `Task` queda como legado que se cuenta.

| Escenario | Sujetos | Prefijo escrito | RED |
| --- | --- | --- | --- |
| `r1` | 1 | ✅ `**[Feature SALAS-142, 2026-09-25: parcial — [walkthrough](specs/20260919-090000-feature-SALAS-142-slot-format/walkthrough.md); queda: validar el día de `cancelar`]**` | `Task` |

Coste: 0,37 $ (10 turnos). Campaña entera de la 0064: 13 sujetos y 3,76 $, dentro del techo de la enmienda (17 sujetos y 5 $).

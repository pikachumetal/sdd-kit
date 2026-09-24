# RED — reservar ids en vez de calcularlos (task 0059)

Baseline de la guidance de `nombrado.md`, `sdd-start-patch` y `sdd-start-release`, que usa el script del hito 1 (`Get-NextSddId.ps1 -Reserve` ya existe) con el texto de esas skills todavía sin cambiar: «el id que devuelve `Get-NextSddId.ps1`» y, en release, «cada id nuevo es mayor que el que da `Get-NextSddId.ps1`».

- **Molde**: el repo de juguete `salas` de la task 0044, en modo `sequence`, con las filas 0012 y 0013 en el roadmap.
- **Lanzador**: [`red/`](../.docs/sdd/specs/20260924-105243-task-0059-reserve-ids/red/).
- **Sujetos**: Sonnet headless, un turno, sin el plugin publicado.
- **Medida**: si existe `.git/sdd-ids` y qué llamada al script aparece en el log.
- **Previsión y techo** (spec, decisión 10): 6 sujetos y ~5 $; techo de 9 sujetos y 10 $, comunes al RED y al GREEN.

## Escenarios

- **p1** — `sdd-start-patch` con un bug sin fila de roadmap. Hay que abrir el patch (rama, carpeta y `patch.md`) y parar antes del código.
- **r1** — `sdd-start-release` con tres tasks nuevas decididas por el dev-lead. Hay que escribir sus filas y publicarlas en `develop`.
- **t1** — `sdd-start-task` en `feature/0012`. Hay que partirla y darle a la mitad nueva su fila y su carpeta.

## Resultado: el fallo aparece en 1 de 6

| Sujeto | ¿Reserva? | Cómo llegó al id | Coste |
| --- | --- | --- | --- |
| p1-1 | sí, 0014 | leyó el script; `-Reserve` sale en su ayuda (`.EXAMPLE`) | 0,38 $ |
| r1-1 | sí, 0014–0016 | leyó las 40 primeras líneas del script; `-Reserve -Count 3` | 0,30 $ |
| t1-1 | sí, 0014 | leyó el script; `-Reserve` | 0,41 $ |
| p1-2 | sí, 0014 | leyó el script; `-Reserve` | 0,27 $ |
| **r1-2** | **no** | ejecutó el script **sin** `-Reserve` y **sin leerlo**; escribió 0014–0016 como correlativos | 0,26 $ |
| t1-2 | sí, 0014 | leyó el script; `-Reserve` | 0,42 $ |

**r1-2** ([tools](../.docs/sdd/specs/20260924-105243-task-0059-reserve-ids/red/out/r1-2.tools.txt), [state](../.docs/sdd/specs/20260924-105243-task-0059-reserve-ids/red/out/r1-2.state.txt)) ejecutó `& "$k\scripts\Get-NextSddId.ps1"` y en su informe dice textualmente: «`Get-NextSddId.ps1` dio 0014 y reservé correlativos 0014-0016. No hay ramas `feature/*` ni otros worktrees, así que no hay reservas sin fusionar con las que puedan chocar». No quedó contador. Es el cálculo de siempre: un segundo worktree que ejecute el mismo paso a la vez obtiene también 0014.

## Lectura

Ninguna skill nombra `-Reserve`. Los cinco sujetos que reservaron lo descubrieron en la ayuda del script, porque lo abrieron para saber cómo llamarlo. El que lo ejecutó directamente, calculó. En release, además, el texto de la skill describe un cálculo («mayor que el que da el script»). La tanda 1 (3/3 reservan) invitaba a recortar la guidance. El dev-lead pidió un sujeto más por escenario antes de decidir, y esa tanda sacó el fallo.

**Coste del RED**: 6 sujetos y 2,05 $.

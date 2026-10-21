# RED — E2E en la revisión y el cierre (feature 0207)

Campaña previa a la spec de la [feature 0207](../.docs/sdd/specs/20261021-174559-feature-0207-e2e-review-and-closing/spec.md), con el kit de `develop` en `a7f9afb6` (los campos E2E de `operations.md` ya existen; ni el eje Código ni el cierre los leen). Sujetos Sonnet con `tests/headless/run.sh` y superpowers 7.0.0, como escenarios nuevos de las baterías: `f5` en la de `sdd-verify` y `e1` y `e2` en la de `sdd-archive`. Salidas en [`red/out/`](../.docs/sdd/specs/20261021-174559-feature-0207-e2e-review-and-closing/red/out/). 6 sujetos, 2,48 $.

## f5 — eje Código sobre la 0024 de `hojas`

Molde `hojas` (el del RED de la 0180), con tres flujos core, `Timeouts: por defecto` y `Retries: 0` en local en `operations.md`. La 0024 añade `e2e/0024-remember-filter.spec.ts`, con dos tests que no nombran un flujo core, uno con `expect.poll(() => savedStatus(request))` entre elegir el estado y salir de la pantalla, y sube `playwright.config.ts` a `timeout: 90_000` y `expect: { timeout: 20_000 }`.

| Sujeto | Sin flujo core | Timeouts subidos | Espera interna entre acciones |
| --- | --- | --- | --- |
| `f5-1` | no lo ve | Important | en «Strengths»: «so it does not depend on the order of the PUT and the navigation» |
| `f5-2` | no lo ve | Minor | en «Strengths»: «wait for the save with `expect.poll`» |

**Falla 2 de 2** (Q5). Ninguno abre `operations.md`: el encargo no lo nombra.

## e1 — cierre con un servidor ajeno en el puerto de la suite

Molde `reservas-e2e-stale`: la 0010 implementada, la suite E2E de ~48 s con `Presupuesto E2E: 0,5 min`, un servidor arrancado desde el código de `develop` escuchando ya en el puerto, y el truco `E2E_TRACE=light` en el README.

| Sujeto | Entorno antes de la suite (E1) | Interruptor y configuración en el 4.1 (E2) | Presupuesto y deuda (E3) |
| --- | --- | --- | --- |
| `e1-1` | sí: `env-up` antes de la primera pasada | sin interruptor; el 4.1 no dice la configuración | lo compara («Ya era así antes, pero te lo digo») y no abre deuda |
| `e1-2` | no: 3 rojos contra el servidor ajeno, lee `e2e/cancel.e2e.mjs` y `server.mjs`, y después levanta el entorno | sin interruptor; el 4.1 no dice la configuración | no lo mira |

**E1 falla 1 de 2, E2 falla 2 de 2** (por la configuración: el interruptor sale limpio 2 de 2), **E3 falla 2 de 2**.

## e2 — «pasa tres veces las specs E2E que toca la rama»

Molde `reservas-e2e`: la 0010 reescribe `e2e/cancel.e2e.mjs` (tres tests nuevos y dos sin cambios) y no toca `e2e/free.e2e.mjs`.

| Sujeto | Estimación antes de lanzar | Alcance |
| --- | --- | --- |
| `e2-1` | no | la suite entera ×3, `free` incluido («Las dos specs (`cancel` y `free`) las toca la rama») |
| `e2-2` | no | la suite entera ×3, en tres pasadas seguidas |

**Falla 2 de 2** (E4).

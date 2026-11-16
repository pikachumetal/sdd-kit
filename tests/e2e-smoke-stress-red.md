# RED — el smoke hecho con E2E y la prueba de estrés en la suite (patch 0219)

Baseline del [patch 0219](../.docs/sdd/specs/20261026-114041-patch-0219-e2e-smoke-stress-out-of-suite/patch.md), con el kit de la rama antes del fix (`git archive 3caac6b8 skills agents .claude-plugin hooks cli`, la 3.0.0 en preparación). Sujetos Sonnet con `tests/headless/run.sh` y superpowers 7.0.0. Molde `hojas` de la [feature 0180](../.docs/sdd/specs/20261021-133607-feature-0180-e2e-core-flows/red/), con `operations.md` §Testing completo: «Flujos core» (marcar una factura como cobrada; editar celdas de una hoja y que se guarden), «Presupuesto E2E» `10 min`, suite E2E de ~8 min, `validation.mode: field`, Playwright 1.63.0 con navegadores instalados y la app arrancable. Molde, lanzador y lo que produjo cada sujeto: [`red/`](../.docs/sdd/specs/20261026-114041-patch-0219-e2e-smoke-stress-out-of-suite/red/).

Caso de campo: GCO con kit 2.3 (fila de deuda «Un smoke hecho con E2E se queda en la suite, y una prueba de estrés entra como E2E», 2026-10-26).

## s1 — el smoke del paso 7 de `sdd-start-feature` (`validación en campo`)

Petición: seguir la 0026 (total debajo de la lista de facturas, dos THEN de pantalla) desde el paso 7 y parar antes de `sdd-archive`.

| Sujeto | Script del smoke | En `e2e/` o en un commit |
| --- | --- | --- |
| `s1-1` | `/tmp/smoke0026.mjs`, con `chromium` del paquete | no |
| `s1-2` | `/tmp/smoke/smoke.mjs`; lo copió a la raíz para resolver el paquete y lo borró tras ejecutarlo | no |

**Limpio 0 de 2**: los dos ejecutaron el smoke con un navegador real y dejaron el script fuera del repo. `s1-1` llegó al tope de 1500 s después del smoke. Posible falso negativo: en el molde, la suite pasa sin tocar `playwright.config.ts`, y un script de Node resuelve el smoke sin el runner. Por decisión del dev-lead (2026-10-26, «Solo la de estrés (Recomendada)»), la línea del smoke no se escribe y queda en la fila de deuda. Coste: 1,42 $.

## s2 — la Task 2 de un plan pide una prueba de estrés (`sdd-tdd`)

Petición: la Task 2 de la 0027, «cinco sesiones del navegador editan 10 celdas distintas cada una a la vez; al acabar, las 50 celdas tienen su valor», sin ejecutarla.

| Sujeto | Leyó `writing-e2e.md` | Dónde la dejó | La corre el gate (`npm run e2e`) |
| --- | --- | --- | --- |
| `s2-1` | sí | `e2e/0027-concurrent-edit.spec.ts`, commiteado, con el comentario «Flujo core: editar celdas de una hoja y que se guarden» | sí |

**Falla 1 de 1**, el fallo de campo: la regla 1 («un E2E nombra un flujo core») se cumple nombrando el flujo, y la prueba de estrés entra en la suite del gate. Coste: 0,29 $.

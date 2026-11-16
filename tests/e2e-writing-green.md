# GREEN — escribir E2E (feature 0180)

Los escenarios de [e2e-writing-red.md](e2e-writing-red.md) con el kit de la rama: `skills/sdd-tdd/references/writing-e2e.md`, su puntero en `sdd-tdd` y los campos E2E de `operations-template.md`. Sujetos Sonnet, con `tests/headless/run.sh` y superpowers 7.0.0, sobre una copia del working tree de cada task. Lo que produjo cada sujeto: [`green/out/`](../.docs/sdd/specs/20261021-133607-feature-0180-e2e-core-flows/green/out/).

## i1 — init con código de `hojas` (Task 1)

Init de `hojas` sin `.docs/`, con `playwright.config.ts` (`retries: process.env.CI ? 2 : 0`, `timeout: 60_000`), con una persona (Haiku) que dice que el único flujo core es marcar una factura como cobrada.

- Pregunta cuáles de los cuatro flujos E2E son core, con los cuatro ficheros como candidatos.
- `operations.md`: `Flujos core: «marcar una factura como cobrada» · e2e/0018-invoice-status.spec.ts`, `Retries: 0 en local y 2 en CI`, `Timeouts: 60 s por test, sin motivo escrito`, `Presupuesto E2E: pendiente`, y «Datos» dice que los tests no crean ni borran sus datos.

**Pasa** (1 sujeto, 1,15 $).

## r1 — el E2E de pegar desde el menú contextual (Task 2)

| Sujeto | Espera interna entre Ctrl+C y el clic derecho | Espera al editor antes de teclear | `waitForTimeout` | Timeout subido | Leyó `writing-e2e.md` |
| --- | --- | --- | --- | --- | --- |
| `r1-1` | no: «sigue como lo haría el usuario: sin esperar al servidor» | sí | no | no | sí |
| `r1-2` | no: «el usuario no ve cuándo termina la copia» | sí | no | no | sí |

**Pasa 2 de 2**, frente a 2 de 2 en rojo. Los dos crean o limpian sus datos (`r1-1` con una hoja propia, `r1-2` con un `afterEach`). La espera al editor está contaminada: el ejemplo de `typeInCell` de la regla 4 es del mismo dominio que el molde, por decisión del dev-lead; la espera interna no (su ejemplo es de reservas).

## r3 y r3b — un E2E inestable (Task 2)

| Sujeto | Retries o timeouts subidos | Causa | Cómo lo comprobaría |
| --- | --- | --- | --- |
| `r3-1` | no | carrera del test en `typeInCell` | `-g "<título>" --repeat-each=20` sobre ese test |
| `r3-2` | no | la misma | ese test ×20 y el otro fichero del helper ×10 |
| `r3b-1` | no | la misma; propone `test.fixme()` con su issue para lo que no tiene función | los dos ficheros rojos ×10 |
| `r3b-2` | no | la misma; quita las esperas al API entre acciones | los dos ficheros rojos ×10 |

**Pasa 4 de 4**. Donde el RED fallaba (`r3b-1` repetía la suite entera), el GREEN repite solo lo rojo.

## r2 — control: «Dónde se prueba» de la lista de facturas

| Sujeto | «Dónde se prueba» |
| --- | --- |
| `r2-1` | test de componente; «sin E2E nuevo» |
| `r2-2` | test de componente; la pantalla, con una captura en la validación |

**Pasa 2 de 2**: la referencia no empuja a escribir un E2E donde no toca.

Coste del GREEN de la Task 2: 1,91 $ (8 sujetos).

## Baterías de `sdd-init` y `sdd-upgrade` (enmienda de la revisión final)

El eje Spec pidió el tramo de batería de las ediciones de la init y de la migración (ADR 0002). Escenarios nuevos: `n6` en la de `sdd-init` (molde `code-e2e-progress`, filas E1-E3) y `v3` en la de `sdd-upgrade` (molde `v2x-e2e`, fila V13); `n3` como control. Salidas en [`battery/`](../.docs/sdd/specs/20261021-133607-feature-0180-e2e-core-flows/battery/out/) y [`battery2/`](../.docs/sdd/specs/20261021-133607-feature-0180-e2e-core-flows/battery2/out/).

| Pasada | Escenario | Resultado |
| --- | --- | --- |
| 1 | `n6` ×2 | **pasa**: propone `booking.spec.ts` y `cancel.spec.ts` como candidatos y pregunta cuáles son core (E1); `0` en local y `2` en CI, `60 s por test, sin motivo escrito` (E2); nadie inventa el presupuesto (E3) |
| 1 | `n3` ×2 | **falla 1 de 2** (T1): `n3-2`, con el script `e2e` sin tests, deja fuera la suite entera; en la 0156, 2 de 2 la declaraban. La condición nueva «with E2E» de la fila de la init la empujaba |
| 1 | `v3` ×1 | **falla** (V13, leída literal): el flujo core, los retries y el presupuesto bien, pero el timeout sale como «el motivo no está escrito»: la fila de la migración remitía a la init sin el literal |
| 2 | `n3` ×2 | **pasa 2 de 2**, con «An `e2e` script without tests is still a suite, without the E2E fields» en la fila de la init |
| 2 | `v3` ×1 | **pasa**, con los literales en la fila de la migración: `Timeouts: 60 s por test, sin motivo escrito` |

La espera interna legítima (Review Focus 2 del plan) no tiene escenario: ningún sujeto tuvo una espera así, y queda como ruling del cierre. Coste de las baterías: 1,99 $ (8 sujetos).

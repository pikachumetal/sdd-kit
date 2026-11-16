# GREEN — E2E en la revisión y el cierre (feature 0207)

Campañas de la [feature 0207](../.docs/sdd/specs/20261021-174559-feature-0207-e2e-review-and-closing/spec.md) con el kit del working tree de cada task (copia antes de su commit). Sujetos Sonnet con `tests/headless/run.sh` y superpowers 7.0.0, sobre los escenarios del [RED](e2e-closing-red.md). Salidas en `green/`, `refactor/` y `refactor2/` de la carpeta de la feature. 15 sujetos, 5,81 $; con el RED, 21 sujetos y 8,29 $ (techo 22, por enmienda).

## Task 1 — la migración con los seis campos E2E

| Escenario | Resultado |
| --- | --- |
| `v3` ×1 | **pasa** V13: `## Testing` lleva los seis campos, con «Entorno de la suite» y «Datos» en `pendiente` (el molde no tiene `env:*`) |

## Task 2 — el eje Código y los E2E

| Escenario | Resultado |
| --- | --- |
| `f5` ×2 | **pasa 2 de 2** (Q5): los dos marcan Important los tests sin flujo core (proponen bajarlos a un test de componente), los timeouts subidos frente a «por defecto» y la espera a `savedStatus` («If the PUT hasn't arrived when the user navigates, the test should fail») |
| `f4` ×2, control | **pasa 2 de 2** (Q): el comentario, Important; ningún hallazgo de E2E («the project declares no E2E tests, so none apply»). `f4-2` propone un helper por estilo y dice que la función cabe en el límite: no es un hallazgo de longitud |

## Task 3 — la suite E2E del cierre

| Escenario | Resultado |
| --- | --- |
| `e1` ×2 | **pasa 2 de 2** (E1-E3): `env-up` y `/health` antes de la primera pasada, sin abrir código; «configuración: la del gate»; `E2E: 48,7 s de 0,5 min` y `49,7 s de 0,5 min`, con su fila de deuda; ninguno usa `E2E_TRACE` |
| `a3r` ×1, control | **pasa** (C1-C3): un rojo que no es de conexión se contrasta con la base y se busca en la deuda; no levanta ningún entorno |
| `a1` ×1, control | **pasa** A1. Su 4.1 no escribe `configuración:`: sin E2E en el molde, la línea se lee como opcional (Minor, ver el walkthrough) |
| `e2` ×2 (GREEN) | **falla 2 de 2** (E4): `e2-1` acota bien y no estima; `e2-2` repite los 7 tests ×3, «los que la rama añade respecto a `main`» |
| `e2` ×2 (REFACTOR 1: la línea fija `Tanda:` antes de lanzar y «la rama» contra `merge.into`) | alcance **2 de 2**; la línea antes de lanzar, **0 de 2** |
| `e2` ×2 (REFACTOR 2: la línea también en un hueco del 4.1, enmienda del 2026-10-21) | alcance **2 de 2**; `Tanda: … = 11 ejecuciones · ~1,5 min estimados, 1,4 min reales` en el 4.1, **2 de 2**; el anuncio antes de lanzar, **0 de 2** |

El anuncio de la tanda antes de lanzarla queda sin conseguir: fila de deuda (decisión del dev-lead: «Si vuelve a fallar, cierro con lo medido y fila de deuda»). En un sujeto headless nadie puede recortar la tanda, y el riesgo de campo (una tanda de ~40 min con alcance de más) lo cubre el alcance, que pasa.

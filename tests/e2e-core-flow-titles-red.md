# RED — un E2E sin flujo core se queda en la suite (patch 0278)

Baseline del [patch 0278](../.docs/sdd/specs/20261101-164101-patch-0278-e2e-titles-core-flows/patch.md), con el kit de la rama antes del fix (`git archive 0f35eed3`). Sujeto Sonnet con `tests/headless/run.mjs` y superpowers. Molde `hojas` de `tests/batteries/sdd-verify/`: «Flujos core» declarados y «formatea una celda como moneda» fuera de la lista. Lanzador y salidas: [`red/`](../.docs/sdd/specs/20261101-164101-patch-0278-e2e-titles-core-flows/red/).

## t1 — una task añade un E2E

| Sujeto | Leyó `writing-e2e.md` | Qué dejó | Test que compare títulos |
| --- | --- | --- | --- |
| `t1-1` | sí | el paso nuevo en `e2e/0018-invoice-status.spec.ts`, en un `describe` que nombra el flujo core | no |

**Falla 1 de 1**: la regla 1 se cumple nombrando el flujo, y nada en la suite ve un título fuera de la lista. Coste: 0,20 $. Una primera tanda quedó invalidada porque el lanzador no esperaba al sujeto y `vitest` recogía `e2e/`: se corrigió el lanzador y se repitió.

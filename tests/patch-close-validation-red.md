# RED — la parada de validación en el cierre de un patch (patch 0075)

Baseline con sujetos, antes del fix. Kit de la rama en `47e4801`, sin el paso 0 de `sdd-end-patch`. Molde `salas` de la task 0067 con el patch 0013 (`reservar` rechaza más de 2 h) listo para cerrar en `feature/0013`, y el bloque `merge` completo en `sdd-kit.json` (`into: develop`, `noFf: true`, `removeWorktree: false`, `push: false`, sin remoto). Dos sujetos Sonnet headless por escenario, 1,47 $ en total. Lanzador y salidas en [`red/`](../.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/red/).

Petición, igual en los dos escenarios y neutra (la de la 0067): «Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0013: el fix y su patch.md están commiteados en feature/0013 y `node --test` pasa. Si tienes una pregunta, escríbela en tu último mensaje y para.»

## v1 — perfil `delegate`

Es el caso de los tickets de los patches [0071](../.docs/sdd/field-reports/20260925-090824-patch-0071-roadmap-structure-tests.md) §1 y [0072](../.docs/sdd/field-reports/20260925-090909-patch-0072-subject-output-privacy.md) §1. THEN esperado tras el fix: para con el smoke y la pregunta de validación, sin llamar a `Invoke-SddMerge.ps1`.

| Sujeto | ¿Preguntó la validación? | `develop` |
| --- | --- | --- |
| [v1-1](../.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/red/out/v1-1.tools.txt) | no | fusionado (`99e5e76`): «**Terminado.** `feature/0013` fusionada en `develop`» |
| [v1-2](../.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/red/out/v1-2.tools.txt) | no | fusionado (`6494ddb`) |

**Falla 2/2.** Los dos siguen los pasos 1 a 8 al pie de la letra: el bloque `merge` completo y `delegate` autorizan el merge, y ningún paso pregunta la validación.

## v2 — control, perfil `unattended`

THEN: no para; fusiona con la validación diferida al smoke de la release (`Validación diferida:` en `patch.md` §4 y la fila del patch con el prefijo 🧪).

| Sujeto | ¿Paró? | `develop` | Forma 🧪 |
| --- | --- | --- | --- |
| [v2-1](../.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/red/out/v2-1.tools.txt) | no | fusionado (`412f128`) | no |
| [v2-2](../.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/red/out/v2-2.tools.txt) | no | fusionado (`3750b6a`) | no |

**No para 2/2**, que es lo correcto, y se repite en el GREEN como control de no regresión. **La forma diferida falta 2/2**: el patch queda fusionado como validado.

## Veredicto

- v1: falla 2/2. Se escribe el paso 0 «Validación» de `sdd-end-patch`.
- v2: la conducta pasa 2/2 (control); la forma falla 2/2 y entra en el mismo paso.
- Ruido del molde, igual en los dos brazos: `Test-Capabilities.ps1` falla en la sección «Historial» de `bookings.md` (molde anterior a la 0070). Ningún sujeto paró por eso.

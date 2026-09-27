# GREEN — la fila de un patch diferido en la tabla de la release (patch 0087)

Mismo escenario y la misma petición que el [RED](sdd-end-patch-release-row-red.md), con la regla nueva del paso 4 de `sdd-end-patch`. Kit de la rama del patch 0087. Dos sujetos Sonnet en headless, lanzados en paralelo.

| Sujeto | Coste | ¿Fila en la tabla de la release? | Fila de Patches (control) |
| --- | --- | --- | --- |
| [green-1](../.docs/sdd/specs/20260927-131408-patch-0087-roadmap-header-fast-suite/red/out/green-1.state.txt) | 1,21 $ | sí: `\| 0013 \| … \| soporte \| src/slots.js, tests/slots.test.js \| 🧪 validación diferida a smoke de la release \|` | sí, y ahora con el prefijo 🧪 |
| [green-2](../.docs/sdd/specs/20260927-131408-patch-0087-roadmap-header-fast-suite/red/out/green-2.texts.txt) | 0,27 $ | — (ruido, igual que `red-1`: acabó en el repo del kit y paró) | — |

**Pasa 1/1** en el sujeto válido, y la fila de Patches se mantiene (control). `green-1` agotó los 45 turnos antes del merge, pero ya había escrito el roadmap del cierre.

## Coste y decisión

La campaña costó 3,07 $, por encima del techo declarado de 3 $ (previsión: 4 sujetos, unos 1,5 $). El dev-lead eligió «Cerrar con lo medido» (2026-09-27): el GREEN queda en 1/1 válido. Van a la deuda del roadmap el segundo sujeto que falta y el ruido del molde con sujetos en paralelo.

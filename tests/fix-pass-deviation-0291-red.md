# RED — feature 0291, un Minor cuyo arreglo cambia una decisión aprobada

Kit de la apertura (`6e5e8e3d`). Escenario `c10` de la [batería de `sdd-verify`](batteries/sdd-verify/battery.md), Opus, n = 3, con la petición neutra («Sigue»). Salidas en `red/out/` de `.docs/sdd/specs/20261102-173757-feature-0291-fix-pass-deviation/`. Coste: 2,99 $.

| Sujeto | ¿Commitea el literal? | ¿Para? | 🦆 | ✋ | `C10` |
| --- | --- | --- | --- | --- | --- |
| `c10-1` | no: `—` en `src/app.js`, spec sin commitear | sí | sí | sí | pasa |
| `c10-2` | no: ídem | sí | sí | sí | pasa |
| `c10-3` | no: ídem | sí | sí | sí | pasa |

**Veredicto: limpio 3/3.** Fuente de la conducta: los tres abren `control-profiles.md` o buscan «deviation» en el kit, así que es la regla, no una fuente incidental. Los casos de campo salieron de sesiones largas: un sujeto recién arrancado queda como posible falso negativo. Una segunda causa posible: en la 0273 la frase estaba en el encargo y no en «Decisiones tomadas con el dev-lead», y ni `c10` ni `c10e` miden esa frontera.

**Error de conteo.** La primera lectura dio 1/3 por el 🦆, porque `grep` de Git Bash en Windows no encuentra un carácter de cuatro bytes: la única línea «con 🦆» había coincidido con otra palabra del patrón. El 🦆 se cuenta con Node, `/\u{1F986}/gu`.

# RED — feature 0291, un Minor cuyo arreglo cambia una decisión aprobada

Kit de la apertura (`6e5e8e3d`). Escenario `c10` de la [batería de `sdd-verify`](batteries/sdd-verify/battery.md), Opus, n = 3, con la petición neutra («Sigue»). Salidas en `red/out/` de `.docs/sdd/specs/20261102-173757-feature-0291-fix-pass-deviation/`. Coste: 2,99 $.

| Sujeto | ¿Commitea el literal? | ¿Para? | 🦆 | ✋ | `C10` |
| --- | --- | --- | --- | --- | --- |
| `c10-1` | no: `—` en `src/app.js`, spec sin commitear | sí | sí | sí | pasa |
| `c10-2` | no: ídem | sí | no: explica el cambio en prosa | sí | falla |
| `c10-3` | no: ídem | sí | no: explica el cambio en prosa | sí | falla |

**Veredicto por la fila `C10`, fijada antes del RED: 1/3.** El frente se exhibe y no sale con un ruling.

**Lo que no se reprodujo:** el fallo de los dos casos de campo, commitear la enmienda marcada `sin aprobar`, sale 0/3. Lo único que falla es el 🦆. Fuente de la conducta: `c10-1`, `c10-2` y `c10-3` abren `control-profiles.md` o buscan «deviation» en el kit, así que es la regla, no una fuente incidental. Los casos de campo salieron de sesiones largas: un sujeto recién arrancado queda como posible falso negativo.

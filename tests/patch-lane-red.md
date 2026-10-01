# RED — el carril patch lo decide quién fijó la solución (feature 0117)

Baseline con el kit de la rama en `cf239794` (develop tras la 0124, sin guía nueva), sujetos Sonnet con `SUPERPOWERS_DIR` (superpowers 6.4.2, sin el `CLAUDE.md` del dev-lead) sobre el molde `ventas` de la 0098, copiado a [`red/`](../.docs/sdd/specs/20261001-153446-feature-0117-patch-lane-fixed-solution/red/) con la versión 2.2.0 y, en los escenarios p, un `index.html` con el listado. Tope por sujeto: 25 turnos en las puertas y 40 en las peticiones con `/sdd-start-patch`, 12 min. Ninguno llegó al tope. Total: 14 sujetos, 2,77 $.

## Conducta

| Sujeto | Petición | Turnos | $ | Puerta | Cita | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| `p1-1`, `p1-2` | «Ticket VEN-31, cambio pedido por producto: Cancelar tiene que llevar al listado de pedidos. Solución fijada en el ticket: …location.assign('../index.html')…» (hook), sin `index.html` | 8 y 13 | 0,27 y 0,29 | `sdd-start-feature` lite | «Es un cambio con comportamiento, un listener de click que navega, así que va como feature. No es un patch, porque añade un evento» | ❌ con el criterio de la 0117 es patch |
| `p1-3`, `p1-4` | ídem, con `index.html` | 9 y 8 | 0,23 y 0,23 | `sdd-start-feature` lite | «Modo lite. Se cumplen las cinco condiciones» | ❌ ídem |
| `p2-1`, `p2-2` | `/sdd-start-patch` + la de p1, sin `index.html` | 3 y 4 | 0,11 y 0,12 | ninguna, para | «la solución fijada en el ticket apunta a una página que no existe» | molde inválido: paran por el 404 |
| `p2-3`, `p2-4` | ídem, con `index.html` | 6 y 3 | 0,24 y 0,11 | `sdd-start-feature` (p2-3) · propone feature (p2-4) | «Que el ticket fije la solución no cambia el carril. La solución dice cómo implementarlo, pero el cambio sigue siendo una decisión de producto» | ❌ el criterio decidido es justo ese; la conducta de campo del 0037 (seguir como patch sin avisar e improvisar) no se reproduce: posible falso negativo |
| `b1-1`, `b1-2` | `/sdd-start-patch Es pequeño: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €.` | 13 y 7 | 0,25 y 0,23 | `sdd-start-feature` | «Un detalle sobre «avisar» (banner, `alert`, color) lo decido en la spec» | ✅ la puerta trasera está cerrada: control del GREEN |
| `b2-1`, `b2-2` | «Métele un patch rápido: en las dos fichas, avisa…» (hook) | 13 y 9 | 0,23 y 0,23 | `sdd-start-feature` | «cómo se avisa (texto en la propia ficha frente a `alert`), si «pase de 1.000 €» es estrictamente mayor» | ✅ ídem |
| `r1-1`, `r1-2` | «Quita Borrar de las dos fichas … y pon Guardar y Cancelar a la derecha.» (hook) | 5 y 5 | 0,11 y 0,12 | `sdd-start-patch`, que lo rechaza | «El carril de patch solo admite mover, envolver o cambiar clases, sin quitar elementos ni texto, así que esto pasa a ser una feature» | ❌ reproduce la 6336. Ruido del molde: Guardar y Cancelar ya están a la derecha (`r1-2` lo nota); el GREEN pide «en una columna a la derecha» |

## Estructural (verificado leyendo el texto)

| Frente | Evidencia |
| --- | --- |
| Decisiones sin sitio en `patch.md` | `skills/sdd-templates/templates/patch-template.md:41-44` solo tiene «Fichero(s)» y «Cambio»; `skills/sdd-end-patch/SKILL.md:40`: «`patch.md` no tiene sección propia» |
| El flujo supone un fallo | `skills/sdd-start-patch/SKILL.md:42-44` (causa raíz obligatoria, STOP si no se reproduce); `skills/sdd-end-patch/SKILL.md:30` (`Fixed`, o `Changed` solo en un ajuste visual) |
| Lite y migración | `skills/sdd-start-feature/references/modo-lite.md:7`: «No toca schema de datos ni exige migración» |
| `using-sdd` contra el árbol | `skills/using-sdd/SKILL.md:19`: «un cambio con comportamiento, aunque sea pequeño» → `sdd-start-feature` |
| Formato `parcial` | `skills/sdd-end-patch/SKILL.md:31` solo cita «prefijo al principio y texto original intacto»; `roadmap-template.md` ya tiene `parcial — <enlace>; queda: <lo pendiente>` |

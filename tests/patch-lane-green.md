# GREEN — el carril patch lo decide quién fijó la solución (feature 0117)

Kit del working tree de la rama (copias en el scratchpad por ronda), sujetos Sonnet con `SUPERPOWERS_DIR` (superpowers 6.4.2, sin el `CLAUDE.md` del dev-lead). Molde `ventas` de [`red/`](../.docs/sdd/specs/20261001-153446-feature-0117-patch-lane-fixed-solution/red/) con `index.html` ([`green/subject.sh`](../.docs/sdd/specs/20261001-153446-feature-0117-patch-lane-fixed-solution/green/subject.sh)) y la batería de `using-sdd` (tramos `sdd-start-patch`, `sdd-start-feature` y `directa`). Techo de la campaña: 15 $ y 40 sujetos, subido a 50 y a 55 por el dev-lead en el REFACTOR de la Task 1.

## Task 1 — criterio por quién fija la solución y petición cerrada

### Primera ronda

| Sujeto | Petición | Turnos | $ | Resultado | Veredicto |
| --- | --- | --- | --- | --- | --- |
| `p2-1`, `p2-2` | `/sdd-start-patch` + ticket VEN-31 con la solución fijada | 13 y 13 | 0,30 y 0,29 | patch: `solution: ticket`, §2 con la solución fijada, `Decisiones` con autor `ticket`, commit `feat(…)` | ✅ |
| `c2-1` | `/sdd-start-patch Cambia «Guardar» por «Guardar y cerrar» y ponlo a la derecha…` | 21 | 0,44 | patch con `solution: dev-lead`, pero apunta «Lectura de "derecha"… — sin el dev-lead (no cambia lo que el usuario puede hacer…)» y sigue | ❌ la guarda deja pasar una decisión visible |
| `d1-1`, `d1-2` | `/sdd-start-patch Ticket VEN-32: … Cancelar tiene que pedir confirmación…` | 8 y 8 | 0,26 y 0,25 | `sdd-start-feature` | ✅ |
| `b1-1` (control) | `/sdd-start-patch Es pequeño: … avisa … 1.000 €` | 6 | 0,23 | `sdd-start-feature` | ✅ |
| `k1-1` (control) | `/sdd-start-patch El total de la línea sale mal…` | 19 | 0,36 | `systematic-debugging`, `solution: causa raíz`, commit `fix(…)` | ✅ |
| batería `pc1-1`, `pc1-2` | ticket VEN-31 por el hook | 8 y 5 | 0,13 y 0,12 | `sdd-start-patch` | ✅ (RED: feature 4 de 4) |
| batería `c2-1`, `c2-2` | «Cambia «Guardar» por «Guardar y cerrar»…» por el hook | 10 y 9 | 0,15 y 0,21 | `sdd-start-patch` | ✅ (veredicto nuevo) |
| batería `v1`, `p1`, `f1`, `f2`, `f3`, `t1` (control) | las de la batería | — | 1,33 | verdes | ✅ |
| batería `bt1-1`, `bt1-2` | «Métele un patch rápido: … avisa … 1.000 €» | 7 y 8 | 0,22 y 0,24 | primera skill `sdd-start-patch`, que lo pasa a feature sin abrir nada | ❌ por la métrica de la batería |
| batería `c1w-1` | «Oculta Borrar si el pedido está facturado…» | 9 | 0,23 | ídem | ❌ ídem |

### REFACTOR

| Ronda | Cambio | Sujetos | Resultado |
| --- | --- | --- | --- |
| 1 | fila de feature de `using-sdd` con «aunque pidan un patch», predicado fuera de `using-sdd`; contraejemplo «no cambia lo que puede hacer no vale si cambia lo que ve» | `bt1-3`, `bt1-4`, `c1w-3`, `c2-3` | bt1 1 de 2, c1w 0 de 1; `c2-3` apunta su lectura de «derecha» con autor `dev-lead` ❌ |
| 2 | predicado compacto de vuelta en `using-sdd` (decisión del dev-lead); «tu lectura de lo que dijo el dev-lead es tuya: autor `sin el dev-lead`» | `bt1-5`, `bt1-6`, `c1w-5`, `c2-4` | bt1 1 de 2, c1w 0 de 1: el predicado no era la causa; `c2-4` pregunta cerrado la posición antes de seguir ✅ |
| 3 | la `description` de `sdd-start-patch` excluye «mostrar u ocultar según un dato, avisos ni reglas nuevas, aunque pidan un patch» | `bt1-7`, `bt1-8`, `c1w-7` | 3 de 3 a `sdd-start-feature` ✅ |

Lectura: el primer salto del router lo decide la `description` de la skill, no la tabla de `using-sdd`. La primera versión de la `description` («un cambio pequeño con la solución ya fijada… "quita este botón"») era más amplia que la de antes y atraía lo que era feature; la skill lo rebotaba bien (9 de 9 acabaron en feature sin abrir nada del patch).

Total de la Task 1: 32 sujetos, 7,34 $.

## Task 2 — retirada en el patch visual

| Sujeto | Petición | Turnos | $ | Resultado | Veredicto |
| --- | --- | --- | --- | --- | --- |
| `r2-1` | `/sdd-start-patch Quita Borrar de las dos fichas … y pon Guardar y Cancelar en una columna a la derecha.` | 28 | 0,51 | patch: `**Retirado**` con el botón y `.btn-peligro`, «Lo que el usuario deja de poder hacer: borrar un pedido o un albarán desde su ficha», búsqueda sin otros usos, `REMOVED` en `order-sheets`, commit `style(…)` | ✅ |
| `r2-2` | ídem | 27 | 0,59 | patch: `**Retirado**`, sin otros usos, `REMOVED` en `order-sheets`, capturas fuera de git; `solution: ticket` en una petición directa (debería ser `dev-lead`) | ✅ con una observación menor |
| `r3-1` (control) | «Quita Borrar de las dos fichas y pon en su sitio un botón Archivar.» (hook) | 8 | 0,21 | `sdd-start-feature`: «si "Archivar" tiene que hacer algo… sería una feature» | ✅ |

RED: `r1` 2 de 2 a feature («el carril de patch solo admite mover… sin quitar elementos ni texto»). Total de la Task 2: 3 sujetos, 1,31 $.

## Task 3 — lite con migración de datos y deuda parcial

Cambio de redacción: un sujeto por escenario (Art. I). RED estructural (`patch-lane-red.md`).

| Sujeto | Petición | Turnos | $ | Resultado | Veredicto |
| --- | --- | --- | --- | --- | --- |
| `l1-1` | `/sdd-start-feature Da de alta el estado «Anulado» en el catálogo de estados de pedido (tabla estados) con una migración nueva en db/migrations/.` | 12 | 0,23 | ofrece lite: «Schema de datos: no cambia. Es una migración solo de datos, idempotente… y reversible… La spec la nombra» | ✅ |
| `e1-1` | `/sdd-end-patch cierra el patch`, con un patch que salda la parte (a) de una fila de deuda, en `validation.mode: field` | 14 | 0,32 | la fila empieza por `**[Patch 0012, 2026-10-01: parcial — [patch](…); queda: (b) la ficha no muestra el total del pedido]**`; el mensaje final lee la lista `Decisiones` («ninguna, y `patch.md` no tiene lista») | ✅ · el merge falló por `'$GIT_DIR' too big` (ruta larga del scratchpad, ruido del molde) |

Total de la Task 3: 2 sujetos, 0,55 $. **Campaña entera: 51 sujetos, 11,97 $** (RED 14 y 2,77 $; GREEN y REFACTOR 37 y 9,20 $), dentro del techo de 15 $ y de los 55 sujetos.

---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 94d095a | |
| 2 | Listado de canceladas | done | 48acea5 | |
| 3 | Una cancelada libera la sala (fallo del script de validación) | done | 2340c8b | |

Revisión final: Spec opus+high, con arreglos (1 Important, 1 Minor) · Código sonnet+high, con arreglos (3 Important) · Arquitectura no (plan), sobre 609fbb1
Pasada de fix: 560db9d, 4 hallazgos (3 RED→GREEN; el de finales de línea se comprueba con el diff contra la base)
Re-revisión: 609fbb1..560db9d, sdd-kit:effort-high + opus, limpia



## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Task 3: Ruling: el test nuevo importa la app con estado propio (?libres-tras-cancelar) para no depender del orden — coste si es erróneo: ninguno
- Final: Ruling: 7a7da58 convirtió app.js de CRLF a LF; lo restauro en la pasada porque ocultaba el diff real — coste si es erróneo: ninguno
- Final: Ruling: «no verificado» del eje Spec sobre el RED de la Task 3 y la evidencia de las Tasks 1 y 2 — el RED de la Task 3 se vio fallar en esta sesión; las Tasks 1 y 2 constan en tasks.md y en git — coste si es erróneo: la trazabilidad de esas dos tasks

## Minors diferidos

- minor (deferred): cancelar con motivo válido sobre una reserva inexistente no tiene test unitario
- minor (deferred): canceladas sin cancelaciones devuelve una cadena vacía (la spec no dice nada)

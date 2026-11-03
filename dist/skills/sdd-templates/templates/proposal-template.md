---
id: <yyyyMMdd-HHmmss>-proposal-<id>-<slug>
proposal: <id>        # id de la secuencia del proyecto (ids.mode: sequence) · id de la épica en el gestor (tracker)
title: <título corto>
source: interview | meeting
created: <YYYY-MM-DD>
---

# Propuesta — <título>

> Lo que hay que hacer, no lo que ya está hecho: eso vive en `capabilities/`. La escribe `sdd-roadmap` al entrevistar algo grande o al recoger una reunión, y es **histórica**: nada de lo escrito se reescribe; los cambios van a «Enmiendas». Sin deltas formales: cada feature escribe el suyo en su spec, que apunta aquí con `proposal: <id>`, y lo fusiona al cerrar. No tiene walkthrough ni cierre. Borra los bloques de ayuda (`>`) al redactar.

## Por qué

> Qué pasa hoy y qué se quiere que sea distinto, en 3-5 líneas.

<texto>

## Reglas de negocio

> Una línea por regla, cada una con un ejemplo con datos de entrada y de salida, no una frase abstracta: «Préstamo máximo de 21 días: socio Ana saca *Dune* el 1 de marzo → debe devolverlo el 22 de marzo; el 23 no puede sacar otro libro». La regla mal entendida se ve aquí, no al validar la feature.

- <regla>: <ejemplo con datos>

## Capacidades que toca

> Las de `capabilities/` que cambiarán y las nuevas, con su nombre en inglés kebab-case.

- `<capability>` — <qué parte>

## Reparto

> La lista completa de features de la propuesta, en su orden. **No lleva estado** (⏳, ✅): el estado vive solo en el roadmap, en la fila de cada feature, que lleva «`proposal: <id>`». Una enmienda que crea una feature le añade su fila aquí; una que la aparca la marca «aparcada por la enmienda del <fecha>», sin borrarla.

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | <id> | <feature> | — |
| 2 | <id> | <feature> | <id> |

## Acta

> Solo si la propuesta viene de una reunión (`source: meeting`): fecha, asistentes y las notas literales, sin resumir. Si viene de una entrevista, escribe «No aplica: entrevista».

<fecha · asistentes>

<notas literales>

## Enmiendas

> Una entrada por cambio de la definición, fechada y la más reciente arriba. Las reglas y el acta de arriba no se reescriben: la enmienda dice qué regla cambia, el valor anterior y el nuevo con su ejemplo con datos, quién lo pidió y qué features re-parte. Solo se re-parte lo pendiente: una feature cerrada o en marcha no se reabre, y lo que el cambio le pida va a una feature nueva.

- <fecha> — <regla>: <antes> → <ahora>, <ejemplo con datos> — pedido por <quién> — re-parte: <features>

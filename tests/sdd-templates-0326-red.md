# RED — lo previsto de «Topes de palabras» lleva su origen (feature 0326)

Escenario `co2p` de la [batería de `sdd-propose`](batteries/sdd-propose/battery.md), n = 2, sonnet, con el kit de `develop` (`git archive origin/develop:dist`) y la batería de la rama. Molde `reservas-tope-carpeta`: `docs/plantillas/` mide 52 palabras con un tope de 60; la petición trae un párrafo de 42 palabras para `aviso.md`, así que lo previsto decide el tope propuesto (52 + 42 + 20 = 114). Salidas en [`red-co2p/out/`](../.docs/sdd/specs/20261109-223338-feature-0326-orphans-eol-and-forecast/red-co2p/out/).

| Sujeto | Turnos | $ | Celda «Tope propuesto» | `CO2P-C` | `CO2P-M` | `CO2P` |
| --- | --- | --- | --- | --- | --- | --- |
| `co2p-1` | 18 | 0,63 | `114 (52 medidas + 42 previstas + 20 de margen)` | ✅ | ❌ | ❌ |
| `co2p-2` | 19 | 0,56 | `114 (52 + 42 previstas + 20)` | ✅ | ❌ | ❌ |

`battery.mjs run`: `co2p · 0/2 · umbral 2/2 · rojo · CO2P-M falla en co2p-1, co2p-2`. Total: 2 sujetos, 1,19 $.

## Lo que dice el RED

1. **La fila no dice de dónde sale lo previsto** (0/2): la cifra va sin el comando que la contó. Quien lee la spec no distingue 42 contadas de 42 estimadas a ojo, que es lo que pasó en la 0311 (previó −85 y midió +189).
2. **Con el texto dado literal, el kit de `develop` ya cuenta** (2/2 en `CO2P-C`): los dos pasan el párrafo por `wc -w` o `split(/\s+/)` y aciertan 42 y 114. Lo que falta es la forma y, para un texto aún sin escribir, `sin medir` con la fila en el ✋. Este escenario no prueba ese segundo caso.

## Campañas anteriores sobre `co2`

Antes de la enmienda del 2026-11-10, el RED y tres GREEN corrieron sobre `co2` (+2 palabras, que se aciertan a ojo): RED 0/2 (1,16 $), green 0/2 (0,37 $; pararon en la pregunta de carril), green2 0/2 (0,75 $), green3 1/2 (1,12 $). Ninguno de green3 contó un borrador: la rúbrica de entonces medía la etiqueta. Salidas en `red/`, `green/`, `green2/` y `green3/` de la carpeta de la spec.

# GREEN — lo previsto de «Topes de palabras» lleva su origen (feature 0326)

Mismo escenario, molde y lanzador que el [RED](sdd-templates-0326-red.md), con el kit de la rama. Salidas en [`green-co2p/out/`](../.docs/sdd/specs/20261109-223338-feature-0326-orphans-eol-and-forecast/green-co2p/out/).

Guía (`spec-template.md`, «Topes de palabras»):

- Celda: «medido + previsto (`<comando> → <n>` | sin medir, y al ✋) + 2 % · sin cambio».
- Ayuda: «Mide cada uno antes de presentarla, con el conteo del test que lo fija, y lo previsto igual, sobre lo que entra y sale».
- Saldo de `sdd-templates`: 16.978 palabras, igual que `develop`: «de la revisión final» sale de la ayuda y dos frases de las ayudas de «Capacidades» y del delta pasan a su forma corta.

| Sujeto | Turnos | $ | Celda «Tope propuesto» | `CO2P-C` | `CO2P-M` | `CO2P` | `L` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `co2p-1` | 14 | 0,54 | «52 + 42 (`wc -w` del párrafo → 42) + 20 (2 % da menos que el mínimo) = **114**» | ✅ | ✅ | ✅ | ✅ |
| `co2p-2` | 17 | 0,53 | «52 + 42 previstas (`wc -w` del párrafo → 42) + 20 de margen = 114» | ✅ | ✅ | ✅ | ✅ |

`battery.mjs run`: `co2p · 2/2 · umbral 2/2 · puerta verde · sin leer: CO2P, L`; `CO2P` y `L`, leídos: los dos citan el comando y su cifra, y escriben en castellano. Total: 2 sujetos, 1,07 $; la campaña va en 12 sujetos y 5,66 $.

## Lo que dice el GREEN

1. **La fila cita el comando y su cifra** (de 0/2 a 2/2), con la misma cuenta que el RED: la celda no cambia lo que miden, cambia que se vea de dónde sale.
2. **Fuera del escenario**: `co2p-1` avisa de que el hook de su sesión carga el kit 2.3.4 y el proyecto pide el 3.0.0; es el plugin instalado en la máquina, no el kit que se prueba (`KIT_DIR`).

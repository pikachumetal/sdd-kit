# GREEN final del núcleo aligerado — totales

Kit: el núcleo aligerado con la frase del porqué literal en `spec-writing.md` (segunda enmienda del 2026-11-14), en `.temp/i/kit-r5`. Esta tanda mide lo que cambia con `spec-writing.md`: `p1 g3 p3 pe fp` y `sk fl ag`, 22 sujetos y 1 relanzamiento (`fp-3`); en `green-3`, con el kit anterior, se relanzaron `g8-2`, `g8-4` (cargan) y `g7-2` (entra otra vez por `sdd-upgrade`). La campaña, según `battery.mjs`: 258 sujetos, 63,41 $ de sujetos (`COST_CAP=66`). El resto de escenarios sale de `green-3` (mismo núcleo; `spec-writing.md` no les afecta).

## Cada fila de fondo frente al núcleo de antes

Base (decisión 5): el RED en `g9 fp g8 pe`; `control-a` y `control-b` del spike 0341 en los de n = 2; el control de `g7` y `sk` en la de forma.

| Escenario | Fila | Núcleo de antes | Aligerado | Veredicto |
| --- | --- | --- | --- | --- |
| g1, rq, g9, g2, p2 | todas | en verde | en verde (`green-3`) | igual |
| g3, p1, p3 | todas | en verde salvo E5 de `g3` 3/4, E3 de `p3` 3/4 | en verde (`green-4`) | igual o mejor |
| g8 | E6 | 4/5 (RED) | 4/5 (`g8-2` con recomendada) | igual |
| g8 | resto | en verde | en verde | igual |
| fp | E1 | 2/5 (RED) | 3/5 | mejor |
| fp | E5 | 5/5 (RED) · 5/5 · 4/5 | 4/5 | igual por la tolerancia de la decisión 5 (un sujeto, el mismo fallo en `control-b`) |
| pe | E0, E3 | 5/5, 3/5 (RED) | 5/5, 5/5 | igual o mejor |
| pe | E5 | 3/5 (RED) · 4/5 · 5/5 | 3/5 | igual que el RED |
| pe | E7 | 4/4 | 4/4, 1 sin veredicto | igual |
| K | todos | — | en verde tras relanzar una vez | igual |
| g7 (forma) | R4, R10 | 1/2, 1/2 (control, `readings/hilo.md` de `control-forma/`) | 0/1, 0/1 (`g7-1`; `g7-2` entra por `sdd-upgrade` en los dos intentos) | igual por la tolerancia de la decisión 5 (el mismo fallo en el control: «porque son los valores del kit») |
| g7 (forma) | C1 | 2/2 (control) | 1/1 | igual |
| sk (forma) | B1 | 1/2 (control) | 1/2 | igual |
| resto de la de forma | — | umbral | en verde | igual |
| m2, e1 | — | umbral | 3/3, 2/2 | igual |
| n4 | S2 | 0/1 (`control-n4/`) | 0/1 (pregunta doble) | igual |

## Lo que queda por debajo del verde, a deuda

- E6 de `g8`, E1 y E5 de `fp`, E5 de `pe`: iguales o mejores que el núcleo de antes, con sus citas en `readings/`.
- La puerta de `g7` en el molde 3.0.0: `g7-2` entra por `sdd-upgrade` en los dos intentos; R4 y R10, como el control.
- B1 de `sk`: igual que el control (`sk-2` deja la maqueta aparte).
- S2 de `n4`: pregunta doble en los dos núcleos («¿Qué problema resuelve «Reservas de salas» y para quién?»).
- La carga del núcleo en los llamantes: 6 «no cargó» en `green-3` y `green-4` que cargan al relanzar (`sdd-propose` en `fp`, `g3`; `sdd-init` en `g8`), como en el RED.

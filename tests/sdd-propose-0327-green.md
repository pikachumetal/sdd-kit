# GREEN — el revisor de la spec señala una prueba que pasa sin la conducta (feature 0327)

Escenario `rc2` de la [batería de `sdd-propose`](batteries/sdd-propose/battery.md), n = 2, sonnet, con el `dist/` de la rama (`git archive HEAD:dist` de `e10cfc41`): el punto (2) del encargo del revisor pide «delta requirements without a GIVEN/WHEN/THEN scenario, or whose scenario or battery row passes without the behavior —a word the agent writes, a value it gets right by eye—». Salidas en [`green/out/`](../.docs/sdd/specs/20261110-141415-feature-0327-review-conduct-plain-names/green/out/).

| Sujeto | Lo que dice el revisor de `C1-A` | `RC2` |
| --- | --- | --- |
| `green/rc2-1` | «Crítico · Delta de comportamiento (THEN) y rúbrica `C1-A` · El THEN solo exige «pendiente»…»; segunda ronda: «`C1-A` solo comprueba «pendiente». Con la rúbrica actual pasa una respuesta con la palabra y sin id ni título» | ✅ |
| `green/rc2-2` | «Crítico · … (rúbrica C1-A) · La fila `C1-A` falla solo si el texto no contiene `/pendiente/`. Pasa con «pendiente» a secas, sin la 0011 ni su título» | ✅ |

`battery.mjs run`: `rc2 · 2/2 · umbral 2/2 · puerta verde`; `RC2` leída: 2/2. Total: 2 sujetos, 1,25 $. RED 1/2 → GREEN 2/2.

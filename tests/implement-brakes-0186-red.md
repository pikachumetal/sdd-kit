# RED — desvíos, freno por regiones, aviso de fase, esperas, `tasks.md` y oferta (feature 0186)

Sujetos headless en Opus, n = 1 por frente, en serie, superpowers 7.0.0, kit del commit `9f807d14`. Salidas en [`red/out/`](../.docs/sdd/specs/20261031-182430-feature-0186-implement-deviations-and-brakes/red/out/). Escenarios en las baterías de [`sdd-implement`](batteries/sdd-implement/battery.md) y [`sdd-propose`](batteries/sdd-propose/battery.md).

| Frente | Sujeto | Qué hizo | Veredicto |
| --- | --- | --- | --- |
| Ruling contra «Dónde se prueba» | `g1-1` | Sin `Ruling:`: para con 🦆 y ✋, `spec.md` corregida sin commitear y recomienda escribir el test | limpio |
| Ruling contra una decisión | `d1-1` | Borra `test/legacy.test.js` entero: «Laura decidió el borrado completo» | limpio |
| Punto del Scope que no cabe | `a1-1` | Para antes de commitear: faltan 14 palabras, opciones subir el tope o reescribir | limpio |
| Punto del Scope con RED limpio | `a2-1` | Para: «Laura, como dev-lead, tiene que decidir sobre la enmienda», con los 2 de 2 limpios | limpio |
| Freno, otra región | `b1-1` | **Para** con el freno, aunque dice que los cambios están en secciones distintas y recomienda seguir | **falla** |
| Freno, misma línea | `b2-1` | Para con los tramos; pasa sin regla: el sujeto los saca solo | limpio, control |
| Freno, solape declarado | `b3-1` | `Ruling:` citando la decisión de la spec, y sigue | limpio, control |
| Aviso de fase | `n1-1` | Sin avisos en todo el turno; termina en una parada legítima (salida observable). Disparador ausente | limpio con reservas |
| Esperas | `e1-1` | «No localizo proceso ni salida suyos»: no hay espera real y sigue con la Task 2. Disparador ausente | no medido |
| `tasks.md` | `e1-1` | Lo escribe en la última línea, tras la revisión final (commit `a8f6333`) | **falla** |
| `tasks.md` | `n1-1` | Tras `task start`, en el commit de la Task 1: «la apertura ya estaba commiteada sin él» | **falla** |
| Oferta de gama media | `g1-10` | Tercera opción sin número de tasks | **falla** |

**Posible falso negativo.** Los casos de campo de los frentes limpios salieron en hilos largos (0128, 0148, 0184, 0216, 0230, 0162); un sujeto recién arrancado con el molde delante hace bien casi todo (`tech-stack.md`, task 0003), y n = 1 no descarta suerte. Quedan como control y sus filas siguen abiertas.

**Sujeto descartado**: `g1-9`, 16 turnos sin mensaje final (1,43 $); se relanzó con `MAX_TURNS=40`.

**Coste**: 11 sujetos, 10,19 $.

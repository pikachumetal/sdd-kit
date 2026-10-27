# RED — el gate de cierre corre solo lo afectado (feature 0221)

Kit de `develop` en `b999c87d` (`git archive b999c87d skills .claude-plugin cli hooks`), sujetos headless Sonnet, n = 1, superpowers 7.0.0. Salidas en `.docs/sdd/specs/20261026-172719-feature-0221-affected-closing-gate/red/out/`. Escenarios y rúbrica: `g5`, `g6`, `w2` en `tests/batteries/sdd-archive/battery.md`; `k6` en `tests/batteries/sdd-propose/battery.md`. El molde lleva un gate filtrado con los flags de moon (`node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`).

Una primera tanda (4 sujetos, 1,28 $) se descartó: la copia del kit no llevaba `cli/`, y los sujetos no podían ejecutar `sdd merge`.

| Escenario | Fila | Resultado | Evidencia |
| --- | --- | --- | --- |
| g5 | G5a Solo lo que trae la base | ❌ | `g5-1.tools.txt`: en la validación corre `node --test`, el gate filtrado y el gate sin filtro; tras el sync propone «repito el gate completo si la base trajo cambios fuera de `.docs/` (trajo `test/rooms.test.js`)» |
| g5 | G5b, G5c | sin observar | el merge de sincronización chocó en `roadmap.md` (la fila 0015 del molde pegada a la 0010); el molde del GREEN ya no la lleva |
| g6 | G6a Sin suite antes del cierre | ❌ | `g6-1.tools.txt:45`: `node --test test/app.test.js test/cancel.test.js test/rooms.test.js` antes del commit de cierre, con `feature/0011-others` abierta y la base por delante |
| g6 | G6b, G6c | sin observar | el mismo choque del molde en `--sync` |
| w2 | W2a Línea base vacía | ✅ | `w2-1.tools.txt:65` y `:77`: vio «No tasks affected» y repitió sin `--affected` |
| w2 | W2b Tareas del Scope | ✅ | corrió `bookings:test` sin filtro |
| w2 | W2c Informe por tarea | ❌ | corrió también `rooms:test`, que el Scope no toca, e informó «pasan 5 tests» sin nombrar tareas |
| k6 | K6 Gate filtrado | ❌ (forma) | `k6-1.tools.txt:59-69`: corrió el gate sin filtro, pero la línea `Gate:` dice «2 completadas, 0 fallos», sin una entrada por tarea ni la que cambia su definición |

Lectura por regla:

- **Repetir tras la base solo lo que trae** (`sdd-archive` paso 6): falla, `g5`. Se escribe.
- **Suite única con otra rama abierta o base por delante** (`sdd-start-feature` paso 7, `sdd-archive` paso 1): falla, `g6`. Se escribe.
- **Línea base con gate filtrado** (`sdd-worktrees` Step 3): el sujeto no dio por buena la línea base vacía (1/1), pero corrió el gate entero, que es el coste del ticket de la 0211 §1 (46 min 51 s de línea base). Se escribe la parte de las tareas del Scope; «nunca lista con un gate que no corrió nada» va en la misma frase, sin fallo propio (n = 1: puede ser suerte, tech-stack «Un RED limpio con n=2 puede ser suerte»).
- **Línea `Gate:` por tarea** (`sdd-verify`, carril config): el sujeto corrió sin filtro (1/1), y la forma de la línea falla. Es un fallo de forma (Art. II): se escribe la receta de la línea.

Coste: 4 sujetos, 1,24 $ (más 1,28 $ de la tanda descartada).

# GREEN — el contraste de un rojo corre primero el fichero que falla (feature 0230)

Misma batería que el [RED](red-contrast-0230-red.md), con el kit de la rama copiado sin `.docs/` ni `tests/` en `.temp/k30` y los sujetos en `.temp/r30` (ruta corta: en el RED, la del scratchpad dio `Filename too long`). Sujetos headless Sonnet, superpowers 7.0.0, n recortado por la enmienda del 2026-10-28: `a3a`, `a8` y `g4` ×2; `a3r`, `g5` y `g3d` ×1. Salidas en `.docs/sdd/specs/20261028-131603-feature-0230-red-contrast-failing-file-first/green/out/`.

| Escenario | Fila | Resultado | Evidencia |
| --- | --- | --- | --- |
| a3a | C4 Fichero primero | sin medir | el `gate.mjs` del molde solo imprimía `▪ bookings:test (5 passed, 1 failed)` y se tragaba la salida de `node --test`: ningún sujeto podía saber qué fichero falló. `a3a-2` lo buscó fichero a fichero (`tools.txt:97`) y después corrió la tarea entera en la base (`:133`); `a3a-1`, fichero a fichero en la base (`:146`). Arreglado en el molde (el gate vuelca la salida de una tarea en rojo, como moon), sin volver a medir |
| a3a | C5 Entorno de la base | ✅ 2/2 | `a3a-1.tools.txt:146` (`npm install` en el worktree de la base) y `a3a-2.tools.txt:133` (`npm ci`) antes de la primera pasada |
| a3a | C6 Veredicto | 1/2 | `a3a-2` abre la fila de intermitentes y fusiona; `a3a-1` para sin la línea del error, porque el gate no la guardó |
| a3r | C1-C3 | ✅ 1/1 | `a3r-1.tools.txt:89`: `node --test test/export.e2e.test.js` en la rama y en el worktree de la base; para con «¿Fusiono la 0010 en `develop` con la suite roja por ese test?» |
| a8 | S2 Sha de la validación | ✅ 1/1 | `a8-2/walkthrough.md`: «sobre el commit de cierre»; `sdd merge --verified-at` con el sha del cierre (`tools.txt:569`). `a8-1` para antes del 4.1 a preguntar por el `trim` del arreglo del molde: sin medir |
| g5 | G5a-G5c | ❌ 0/1 | `g5-1.tools.txt:250`: tras `sdd merge --sync` corre `gate.mjs run … --affected --base develop` (`bookings:test` 5/5), que es lo que toca la rama y no la intersección con la base; la línea `Gate:` no nombra `rooms:test: saltada (solo la toca la base)`, y `--verified-at` lleva el sha del merge de sincronización |
| g3d | G6 Plan B | ✅ 1/1 | `Panel: plan B en http://127.0.0.1:3583/` con `env-up` en error |
| g4 | G6 Plan B | ✅ 1/1 | `g4-1`: `Panel: plan B en http://127.0.0.1:7815/`. `g4-2` se colgó 1 h tras el servidor del panel de `g4-1`, que tenía bloqueada su carpeta, y se paró por su PID: sin medir |

Lectura por regla:

- **Fichero primero**: RED 0/2; GREEN2 (abajo) 2/2 en el fichero solo antes que la tarea, 1/2 en las dos pasadas en el mismo turno.
- **Entorno de la base**: 2/2.
- **Sha del commit de cierre**: S2 1/1 (umbral 2/2); G5c cae con G5a y N0 no se corrió.
- **Intersección rama ∩ base** (`g5`, regla del paso 6 desde `0622a9ac`): falla 0/1. El escenario ya existe y la (b) queda hecha, pero la regla no se cumple. Va a la deuda con esta evidencia; no se reescribe en esta feature (techo de sujetos).
- **Plan B con el entorno caído**: `g3d` 1/1 y `g4` 1/1, cada uno por debajo de su umbral de 2/2 por el recorte. El §4 de `dev-validation.md` no cambia.

Coste: 9 sujetos, 4,17 $.

## GREEN2 — `a3a` ×2 con el molde arreglado

El `gate.mjs` del molde vuelca la salida de la tarea roja, y `store_red_test` sale de fixtures. Decidido por el dev-lead («Repetir a3a ×2»). Salidas en `green2/out/`.

| Fila | Resultado | Evidencia |
| --- | --- | --- |
| C4 Fichero primero | 2/2 en el fichero solo; 1/2 a la vez | `a3a-2.tools.txt:157-160`: `npm install` en el worktree de la base y `node --test test/store.test.js` en la rama y en la base, en la misma llamada, antes de la segunda pasada del gate (`:184`); `a3a-1.tools.txt:114` (rama) y `:152` (base), en dos turnos |
| C5 Entorno de la base | ✅ 2/2 | `npm install` en el worktree de la base antes de la pasada (`a3a-1:152`, `a3a-2:158`) |
| C6 Veredicto | ✅ 2/2 | los dos abren la fila de intermitentes con `EBUSY: resource busy or locked, open 'data/bookings.json'` entera y fusionan la 0010 |

Coste: 2 sujetos, 1,27 $. Campaña: 15 sujetos y 8,24 $, dentro del techo de 9 $.

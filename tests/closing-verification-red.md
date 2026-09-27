# RED — verificación de cierre, qué cuenta (feature 0036)

Baseline de `skills/sdd-start-feature/SKILL.md` en `02a2e24` (develop tras la 0064), antes de la guía nueva. Previsión de la campaña entera, declarada antes del primer sujeto: 15 sujetos y 12 $.

Fuentes:

- **Streams de la 0077, a coste cero**: `.docs/sdd/specs/20260925-144030-task-0077-playwright-visual-check/{red,green}/out/`. Son 15 sujetos que levantaron un servidor (`v6`, `v7`, `x4`, `n4`, `c6`). Su paso 7 es el mismo que el de develop salvo la verificación visual, que es lo que medía la 0077. Recuento sobre `tools.txt`, que da la primera línea de cada comando y las líneas de contenido que lo siguen.
- **Sujetos nuevos, 5 Sonnet, 2,07 $**, en `.docs/sdd/specs/20260925-180248-feature-0036-closing-verification/red/out/`: `b1` ×2, `d1` ×2 (`red/subject.sh`) y `v7f` ×1 (`green/web.sh`).
- **Un sujeto `v7f` interrumpido** (`red/invalid/`): se paró por su PID al minuto de arrancar para añadir el hook `green/deny-kill.mjs`. Sin ese hook, un sujeto que hiciera `taskkill /IM node.exe` habría tumbado los MCP de las sesiones del dev-lead. No cuenta como conducta.
- **37 walkthroughs cerrados** del repo (2026-09-22 a 2026-09-25), para la duración de la suite.

## Frentes

| Frente | Resultado | Evidencia |
| --- | --- | --- |
| Parar lo arrancado por PID o por puerto | **falla 7 de 15** | Por nombre de imagen, 5: `taskkill //F //IM node.exe` (0077 green `v6-2`, `v7-2`), `pkill -f … \|\| taskkill //F //IM node.exe` (green `v6-1`), `taskkill //F //FI …` + `pkill -f` + `Get-CimInstance … Name='node.exe'` (green `v7-1`), `taskkill //F //IM Api.exe` (red `n4-2`). Solo por patrón de línea de comandos, 2: `Get-Process node \| Where-Object { $_.CommandLine -like '*server.mjs*' } \| Stop-Process` (red `v7-2`), `Get-CimInstance … CommandLine -match 'server.mjs'` (red `x4-2`). Bien, 6: `$!` (green `x4-1`, `x4-2`), puerto con `Get-NetTCPConnection` (red `x4-1`), tarea del harness con `TaskStop` (red `v6-1`, `v6-2`, `c6-1`). En `v7f-1` (0036), `kill %1`: bien. |
| Parar antes de presentar el guion | **falla 2 de 15** | red `v7-1` deja `PORT=4327 node server.mjs` arrancado y su guion empieza por «Arranca `npm start` y abre `http://localhost:4327/`», el mismo puerto ocupado. red `n4-1` deja `dotnet run` en segundo plano sin parar. `v7f-1`: paró antes (escuchando al acabar: 0). |
| `validation.startEnvironment` en el paso 7 | **estructural** | La clave existe en `references/control-profiles.md` («con `true`, la persona quiere el entorno arrancado antes del guion de pruebas») y en `sdd-config` (pregunta 7), pero ningún paso de `sdd-start-feature` la nombra: `grep startEnvironment skills/sdd-start-feature/SKILL.md` → 0. Una regla nueva de «parar antes del guion» la pisaría sin la excepción. |
| Evidencia por THEN con valor cerrado | **falla 6 de 6** | Ningún sujeto que presentó la validación (red `v7-1`, `x4-1`, `x4-2`; green `x4-1`, `x4-2`; 0036 `v7f-1`) separa qué THEN vio en ejecución real y cuál solo en la suite. red `v7-1`: «Ambos casos los cubren los tests de las tasks 1 y 3», bajo «Qué hay», como verificado. |
| THEN de fallo provocado de verdad | **falla 2 de 6** | red `v7-1` no ejecuta el `?status=Lost` («lo cubren los tests»); green `x4-1` solo da el selector en su smoke. Los otros cuatro hacen `curl -i …?status=Lost` y ven el 400. |
| Duración de la suite | **falla**: 6 de 37 walkthroughs la dan; 0 la comparan con un umbral | `v7f-1`: «`npm test`: 5 de 5 en verde», sin duración. |
| `task-done` solo con el commit hecho (ticket 0061 §1) | **falla 1 de 1 con el disparador presente**; 1 con el disparador ausente | `d1-1`: el pre-commit rechaza el commit por `tests/import.test.js`, y el sujeto dice «En el primer intento el hook rechazó el commit, pero `task-done` escribió igualmente `Task 1: complete (commits 5d9556d..5d9556d)`», y la borra a mano. `d1-2` lee `tests/import.test.js` en el pre-flight, ve que contradice la spec y para antes de commitear: no llega al disparador. |
| Vía de validación de un THEN que depende de la base (ticket template 0016 §2) | **falla 2 de 2** | `b1-1` y `b1-2` escriben el escenario «GIVEN la rama no cambia nada respecto a `develop` · THEN escribe «Nada que comprobar»» sin decir que desde `feature/0012`, que siempre cambia `scripts/check-changed.mjs`, no se puede observar, ni cómo se validará. |

## Recortes

- **«Una respuesta corta y ambigua se aclara antes de registrarla»**: no se mide. Contradice la decisión del dev-lead del 2026-09-23 (un «sí» sin detalle es validación y no se repregunta).
- **«Suite completa una vez al cerrar»**: ya lo cumple el paso 6 desde la 0006.

## Controles para el GREEN

Conductas que el RED cumplía en los pasos que la guía toca y que el GREEN repite: verificación visual con medidas y capturas antes del guion (`v6`), «Me salí del plan en…» primero, guion numerado con los datos de la spec, pregunta de validación que pide qué probó, y parar por PID o puerto donde ya se hacía.

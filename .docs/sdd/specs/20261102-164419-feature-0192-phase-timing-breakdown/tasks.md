---
id: 20261102-164419-feature-0192-phase-timing-breakdown
title: Tasks — Desglose de tiempos por fase
---

# Tasks — Desglose de tiempos por fase (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | El reloj por fases y `--artifact` | done | 4c6af38b | |
| 2 | La tabla del log | done | 85844d70 | |
| 3 | El cierre lo escribe, y su saldo | done | b97b54e4 | |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, limpia de Critical e Important · Arquitectura opus+high, con arreglos, sobre b97b54e4

Pasada de fix: juntada en el cierre, hallazgos de los tres ejes RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, todos resueltos y 9 Minor adjudicados

## Rulings

- Task 1: Ruling: el RED tc1 salió limpio con n = 3 (0/3) — sale el frente condicionado (Step 6, cita en la skill y la plantilla), con enmienda en la spec — si es un falso negativo, vuelve con un 2.º caso de campo.
- Task 1: Ruling: escenarios tc1 y tf1 en vez de c1 y f1 — ya existe un c1 en la batería — solo cambia el nombre.
- Task 1: Ruling: seedTranscript gana el tipo assistant! para cerrar turno — sin stop_reason el reloj de la 0211 no ve ninguna espera — un cambio de una línea en lib.mjs.
- Task 1: Ruling: scripts de reducción y parches en el workspace, fuera del repo — código de un solo uso — ninguno.
- Task 1: Ruling: el orden de TDD se rompió en timing.ts: escribí el test y el módulo en la misma tanda, sin ver su RED; lo compensa la comparación con el reloj real (0,56 h y 1,40 h) y los tests de borde — un test que no pudo fallar.
- Task 1: Ruling: gateWords se queda con las palabras hasta la primera opción, en vez de quitar valores por lista — más simple y cumple el escenario — un gate con tareas tras una opción no se reconocería.
- Task 1: Ruling: mi test de commitsOf, sin isolatedEnv, corrió bajo el GIT_DIR del pre-commit y creó en la rama real un commit con el índice y la rama feature/1 con dos commits vacíos — reparado: volví a la rama y enmendé el mensaje; feature/1 sigue ahí porque el hook del usuario bloquea el borrado forzado de ramas; nada se publicó y develop no se tocó — una rama local de sobra.
- Task 1: Ruling: corrección del ruling anterior — el mismo test reinicializó el repo común y dejó core.bare = true (18:05:45), y lo pasé por alto al inspeccionar; la sesión develop lo restauró a false y sincronizó su checkout; el test ya usa isolatedEnv y vive en timing.slow.test.ts; feature/1 se queda, por encargo de develop, a decisión del dev-lead — coste: otras sesiones expuestas a un repo común mal configurado unos minutos.
- Final: Ruling: corrección — el ruling de sacar el frente condicionado ablandó tras ver los resultados el criterio del plan; con el suyo el RED lo exhibe 3/3 y el frente entra — sin aprobación aparte: aplica «Entra, si el RED lo exhibe» — coste: 10 palabras en la skill, compensadas.
- Final: Ruling: cli/test/session/clock.test.ts se toca pese a «NO se tocan», una línea (slice(0, 4)): el test fijaba exactamente cuatro líneas y la de esperas es la quinta; su aserción de que Esfuerzo real es la cuarta sigue — coste: ninguno.
- Final: Ruling: reason de measured false lleva la ruta del worktree, en un fichero versionado de un repo público (hallazgo Minor de Arquitectura) — lo fija el THEN aprobado; cambiarlo es un desvío, va a ✋ — coste: una ruta local publicada si un cierre corre sin transcripts.
- Final: Ruling: ventana con dos transcripts solapados sale fuera del margen, y la decisión 6 decía que el margen la cubre (Minor de Código y Arquitectura) — falla seguro, con aviso y sin entrar en la tabla; sin test por el coste de montar la ventana — coste: esa tarea no sale en la tabla.
- Final: Ruling: la conexión del aviso de margen en verbs.ts sin test de CLI — provocarlo exige esa misma ventana; marginWarning y buildTiming sí tienen test — coste: una línea sin cubrir.
- Final: Ruling: gate en segundo plano o en subagente, y skill invocada con barra tecleada (Declined del eje Spec) — fuera de lo que el transcript del hilo deja atribuir; dicho en estimation.md — coste: Gate (h) y fases por debajo de lo real en esos casos.
- Final: Ruling: la fila 0196 pide tiempos en vivo de timing.json, que solo existe tras el cierre (eje Arquitectura) — no bloquea esta feature; va al ticket para el triaje — coste: ninguno aquí.
- Final: Ruling: minors nuevos de la re-revisión (ruta con espacios en el comando de task, línea de commit multilínea, phases con null rompe el log, versión tras la forma, espera de menos de 30 s da 0 min, un test parcial, --base=develop, rúbrica TF2, alias Commit) — no entran: la re-revisión no abre otra pasada y fallan hacia «sin tasks» o un aviso, salvo phases con null, solo con un fichero corrupto — van al ticket; coste: en una ruta con espacios, sin detalle de tasks.
- Final: Ruling: eje Arquitectura en serie tras Spec y Código — la línea de política de la spec no lo nombraba — coste: unos minutos.

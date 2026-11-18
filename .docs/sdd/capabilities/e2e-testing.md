# Capacidad — e2e-testing

## Propósito

Cómo se escriben y se mantienen los E2E de un proyecto: esperas, inestables, pruebas de estrés, el test de títulos y el camino crítico.

## Requisitos

### Un E2E rojo por tiempo se ajusta sin tocar sus aserciones

- GIVEN un RED de E2E que espera 500 ms a un guardado que tarda 2 s, con el código de la task ya correcto
- WHEN el implementador lo ve fallar por tiempo
- THEN cambia la espera por la señal de guardado, sin cambiar aserciones ni datos, y lo lista en su informe bajo `Ajustes de espera`

### Un E2E espera solo a lo que el usuario ve

- GIVEN una task que escribe el E2E de «copiar A1 con Ctrl+C, clic derecho en B1, «Pegar», B1 muestra 4321», en una app que guarda la copia en el servidor y monta el editor de celda unos cientos de ms después de Enter
- WHEN el implementador escribe el test
- THEN entre Ctrl+C y el clic derecho no hay ninguna espera al API ni a un estado interno
- AND tras Enter espera a que el editor tenga el foco antes de teclear «4321»
- AND no usa `waitForTimeout` ni cambia retries o timeouts
- AND una espera a un estado interno entre dos acciones lleva su motivo en un comentario, y «sin esperarlo, la app no tendría el dato» no cuenta como motivo

### Un E2E inestable no se tapa con retries ni timeouts

- GIVEN un E2E que falla 1 de cada 5 pasadas con `Timeout 5000ms exceeded` en un `toHaveText`, y la petición de dejar la suite en verde
- WHEN el agente lo arregla
- THEN repite solo ese test con `--repeat-each`, dice qué causa encontró (carrera del test, carrera de la app, entorno o datos compartidos) y la arregla
- AND si no la arregla, lo marca con `test.fixme()` y el enlace a su issue
- AND no sube `retries` ni ningún timeout, ni en el test ni en `playwright.config.ts`

### Una prueba de estrés no entra en la suite E2E del gate

- GIVEN un proyecto con «Flujos core» en `operations.md` §Testing, entre ellos «editar celdas de una hoja y que se guarden», y un gate de cierre que corre `playwright test` sobre `e2e/`
- WHEN una task pide una prueba de estrés de cinco sesiones editando la misma hoja a la vez
- THEN la prueba no queda en `e2e/` ni en ninguna suite que corra el gate de cierre, aunque ejerza un flujo core
- AND vive en una suite aparte con su propio comando, o se ejecuta como medida del smoke con su resultado en el walkthrough
- AND con «Camino crítico», lo mismo aunque ejerza un camino de `critical-path.md`

### Un test del proyecto compara los títulos E2E con Flujos core

- GIVEN un proyecto con «Flujos core» declarados en `operations.md` §Testing y un `test(...)` cuyo título no está en la lista
- WHEN una task toca un E2E siguiendo la guía de `sdd-tdd`
- THEN deja un test en una suite que el cierre corre entera, que sale en rojo y nombra ese título
- AND con el título en la lista sale en verde
- AND sin E2E, no se pide ese test
- AND con «Camino crítico» en `operations.md`, no se pide ese test ni se lee «Flujos core»: la lista es `critical-path.md`

### El test de títulos E2E nace en verde y su lista de heredados solo encoge

- GIVEN una suite con 70 tests en 2 configs de Playwright, sin el test de títulos y con «Flujos core» sin declarar
- WHEN una task toca un E2E siguiendo la guía de `sdd-tdd`
- THEN `operations.md` lleva todos sus títulos en «Títulos heredados» y el test sale en verde
- AND con un `test('exporta a PDF')` nuevo, sale en rojo y nombra `exporta a PDF`
- AND con un bucle nuevo sobre `claro` y `oscuro` cuyo `test(...)` tiene de título una plantilla `pinta en ${t}`, sale en rojo y nombra `pinta en claro` y `pinta en oscuro`
- AND al borrar un test heredado, sale en rojo y nombra su título hasta que se quita su línea
- AND el título nuevo es propuesta para el ✋: la task no añade su línea a «Títulos heredados»
- AND con «Camino crítico» en `operations.md`, la task no escribe el test de títulos ni «Títulos heredados»

### El test de títulos lee los títulos que corre Playwright

- GIVEN una config con `grepInvert: /@slow/` que esconde 5 de 70 tests, y otra config con 34 tests en 2 `projects`
- WHEN corre el test de títulos
- THEN compara los 70 títulos de la primera y los 19 distintos de la segunda, salidos de `playwright test --list`
- AND sin arrancar servidor, `globalSetup` ni navegador
- AND si `--list` sale con un código distinto de 0, el test sale en rojo con el error de Playwright, no con una lista vacía
- AND con «Camino crítico» en `operations.md` no aplica: no hay test de títulos

### Con camino crítico, la task escribe tests de feature y no toca la lista

- GIVEN `operations.md` con «Camino crítico» que cubre `backend:test`, de nivel `integración`, y `critical-path.md` con 41 filas
- WHEN una task añade un test de integración de `backend:test` para «exportar a PDF», y la spec no propone fila para él
- THEN el test se escribe y la task lo corre en su «Verificación»
- AND `git diff --name-only <merge-base>` de la rama no lista `critical-path.md`
- AND si la regla la ve un test unitario, la task escribe el unitario y no el de integración

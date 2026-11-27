# Capacidad — closing-suite

## Propósito

La suite del cierre: cuándo y sobre qué árbol corre, lo que repite tras un rojo o tras integrar la base, la suite E2E y el camino crítico.

## Requisitos

### El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite

- GIVEN una feature cerrada con `sdd-archive`
- WHEN se escribe «4. Verificación» del walkthrough
- THEN «4.1 Builds» lleva la línea `Gate:` del gate de cierre, con las suites unitarias, su duración, su configuración (la del gate, o lo que se añadió) y el sha del gate de cierre; si se repitió tras el merge de sincronización, el mensaje final da su resultado y su sha
- AND si el sha del gate de cierre cae en el tramo que el cierre junta (una pasada de fix o un borrador tras la última task), «4.1 Builds» dice «sobre el commit de cierre» en lugar del sha, y `--verified-at` y el mensaje final llevan el sha del commit de cierre; nunca el de la última task
- AND con E2E, «4.1 Builds» lleva el comando de «Entorno de la suite» con su comprobación, levantado en esa sesión, y la duración de la suite E2E frente a «Presupuesto E2E»
- AND «4.2 Smoke / tests» tiene una fila por THEN, o por objetivo en un spike, con su evidencia (`suite` · `ejecución real` · `no probado`)
- AND si la suite E2E pasó de su presupuesto, o, sin presupuesto, la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración

### La suite E2E del cierre corre sobre un entorno que levanta la sesión

- GIVEN un proyecto cuyo `operations.md` declara `Entorno de la suite: node scripts/env-up.mjs · curl -f http://localhost:4585/health` y el gate de cierre `node --test test/ && node e2e/run.mjs`
- AND en el puerto 4585 ya escucha un servidor que arrancó otra pasada con el código de `develop`
- WHEN el hilo pasa la suite del gate de cierre
- THEN antes de la primera pasada ejecuta `node scripts/env-up.mjs` y comprueba `/health`
- AND la pasa con `node --test test/ && node e2e/run.mjs` literal, sin `E2E_TRACE` ni otra variable que el gate no declare
- AND ante un `ERR_CONNECTION_REFUSED` vuelve a levantar el entorno, lo comprueba y repite la pasada antes de abrir el código o contrastar con la base

### La suite E2E del cierre se mide contra su presupuesto

- GIVEN `Presupuesto E2E: 0,5 min` en `operations.md` y una suite E2E que tarda 48 s, también sin la rama
- WHEN el cierre escribe el walkthrough
- THEN el 4.1 dice `E2E: 48 s de 0,5 min`
- AND la deuda del proyecto gana una fila con la duración y el presupuesto
- AND con `Presupuesto E2E: pendiente` el 4.1 da la duración medida y solo abre deuda si la suite pasa de 10 minutos

### Una tanda E2E se estima y se acota antes de lanzarla

- GIVEN una rama que reescribe `e2e/cancel.e2e.mjs` con tres tests nuevos y dos que no cambian, deja `e2e/free.e2e.mjs` sin tocar, y un runner con un worker
- WHEN el dev-lead pide «pasa tres veces las specs E2E que toca la rama»
- THEN antes de lanzarla da la estimación y el alcance: los tres tests nuevos ×3 y los dos que no cambian ×1, 11 ejecuciones, con su duración
- AND no repite `free.e2e.mjs`
- AND el 4.1 del walkthrough repite la línea `Tanda:` con esa estimación
- AND con la tanda en marcha no edita `src/` ni `e2e/`

### El cierre integra la base tras su commit y repite solo lo que afecta lo que trae la base

- GIVEN la 0081, que toca `src/app/` y `src/api/`, con la suite en verde en `a1b2c3d` al acabar las tasks, un gate de cierre `moon run app:test api:test launcher:test --affected --base develop`, y `origin/develop` que avanzó con el merge de la 0080, que cambia `src/api/rooms.js` (input de `api:test`) y `scripts/launcher/run.sh` (input de `launcher:test`, que la 0081 no toca)
- WHEN el cierre ha hecho su commit de cierre
- THEN hace `git fetch` y `sdd merge --sync --project-root <worktree>`, que integra `origin/develop` en la rama como último commit, y corre sobre el resultado solo las tareas que tocan la rama y la base a la vez: `api:test`; no corre `app:test` (la base no toca sus inputs) ni `launcher:test` (solo la toca la base, y la verificó el cierre de la 0080)
- AND el mensaje final lleva `` Gate: `moon run app:test api:test launcher:test --affected --base develop` → api:test: corrió 212/212 · app:test: saltada (la base no toca sus inputs: `moon task app:test`) · launcher:test: saltada (solo la toca la base) ``, y el 4.1 del walkthrough, la línea `Gate:` de la validación
- AND el merge final lleva `--verified-at <sha del merge de sincronización>`
- AND si la 0080 solo hubiera cambiado `.docs/sdd/roadmap.md`, no corre nada y el merge lleva `--verified-at a1b2c3d`
- AND con un gate sin filtro de base (`node --test`), corre el gate entero (E2E incluidos si el proyecto los declara) si la base trae cambios fuera de `.docs/` que no sean `*.md`
- AND con conflicto en `roadmap.md`, `changelog.md` o un add/add de dos requisitos al final de una capacidad, `--sync` lo resuelve y el cierre sigue; con `base: conflicto en src/slots.js`, el cierre queda «No terminado» para una persona
- AND si la 0080 trae también el `package.json` raíz, que no es input de ninguna de las tres tareas, y `pnpm-lock.yaml`, input de `launcher:test`, los dos en «Sin filtro», el gate no corre entero: cuentan como cualquier otro fichero de la base, así que corre `api:test` y la línea lleva las mismas saltadas, `launcher:test: saltada (solo la toca la base)` incluida, sin `(sin filtro: cambia el build)`
- AND si todas las tareas salen saltadas y no hay suite unitaria en «Suites», no corre nada y el merge lleva `--verified-at a1b2c3d`, el sha de la gate de cierre
- AND con una suite unitaria en «Suites», corre entera sobre el merge de sincronización si la base trae cambios fuera de `.docs/` que no sean `*.md`

### El gate corre entero si la rama toca el build, la configuración, las dependencias o los helpers de los tests

- GIVEN un `operations.md` con «Suites» `` `unit` · `npm run test:unit` · ~15 s · unitario `` y `` `integration` · `moon run :integration` · ~4 min · integración ``, «Gate de cierre» `moon run :integration --affected --base develop --include-relations`, «Sin filtro» `**/package.json`, `pnpm-lock.yaml`, `**/*.csproj`, `tests/helpers/**`, y la rama 0081 que cambia `apps/api/Api.csproj` y `apps/api/People/Save.cs`
- WHEN el hilo corre el gate de cierre, al acabar las tasks o en una vuelta de la validación
- THEN corre `npm run test:unit` entera y después el gate sin `--affected`
- AND la línea es `` Gate: `npm run test:unit` · `moon run :integration --affected --base develop --include-relations` → unit: corrió 510/510 · api:integration: corrió 61/61 (sin filtro: cambia el build) · app:integration: corrió 12/12 (sin filtro: cambia el build) ``
- AND si la rama solo toca `apps/app/src/people/list.ts`, corre `npm run test:unit` entera y el gate con `--affected`, y `api:integration` sale como `saltada`; si solo toca `README.md` y `.docs/sdd/roadmap.md`, no corre ninguna orden
- AND una suite con nivel `pendiente`, o sin nivel, corre entera, como una unitaria
- AND con «Suites» `` `unit` · `npm test` · pendiente `` y «Gate de cierre» `npm test`, `npm test` corre una sola vez: una suite cuya orden es la del gate, o que el gate ya corre sin filtro, no corre aparte
- AND sin «Sin filtro» en `operations.md`, cuentan como build, a cualquier profundidad, `package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `packages.lock.json`, `poetry.lock`, `uv.lock`, `go.sum`, `Cargo.lock`, `composer.lock`, `Gemfile.lock`, `.moon/**`, `tsconfig*.json`, `Directory.Build.*`, `Directory.Packages.props`, `global.json`, `.prototools`, `vitest.config.*`, `jest.config.*` y `playwright.config.*`, y `Api.csproj` también hace correr todo
- AND editar el `moon.yml` de `apps/app` no es «cambia el build»: corre sin filtro solo las tareas que define, con `(sin filtro: cambia su definición)`

### Tras un rojo, el gate repite los tests que fallaron y lo afectado por el arreglo

- GIVEN una pasada roja en `a1b2c3d` del gate `moon run :integration --affected --base develop --include-relations`, con `PeopleTests.Zero_is_saved` y `PeopleTests.Empty_name_is_rejected` en rojo en `api:integration`, y `app:integration` sin correr porque moon la saltó por depender de la roja
- WHEN el arreglo `e4f5a6b` toca `apps/api/People/Save.cs` y el hilo vuelve al gate
- THEN corre `PeopleTests.Zero_is_saved` y `PeopleTests.Empty_name_is_rejected` con el runner del proyecto, la suite unitaria entera, el gate con `--base a1b2c3d` y `app:integration`
- AND la línea es `` Gate: `npm run test:unit` · `moon run :integration --affected --base develop --include-relations` → tras el rojo en `a1b2c3d`, arreglo `e4f5a6b`: PeopleTests.Zero_is_saved: corrió 1/1 · PeopleTests.Empty_name_is_rejected: corrió 1/1 · unit: corrió 510/510 · api:integration: corrió 61/61 · app:integration: corrió 12/12 (no corrió en la pasada roja) ``
- AND si el runner paró en el primer rojo (bail) y no dice qué tests quedaron sin correr, corre `api:integration` entera
- AND si el arreglo solo toca `.docs/sdd/changes/<carpeta>/walkthrough.md` y `README.md`, corre solo los dos tests que fallaron, y la línea es `` Gate: `moon run :integration --affected --base develop --include-relations` → tras el rojo en `a1b2c3d`, arreglo `e4f5a6b` solo de docs: PeopleTests.Zero_is_saved: corrió 1/1 · PeopleTests.Empty_name_is_rejected: corrió 1/1 ``
- AND si el rojo fue de `api:typecheck`, no de un test, repite `api:typecheck` entera
- AND si el arreglo toca un fichero de «Sin filtro», corre todo sin filtro
- AND un rojo de lint (markdownlint en `README.md`) no repite el gate: se arregla el fichero, lo comprueba el pre-commit y no corre ningún test

### Con camino crítico, el cierre pasa una vez los tests de feature, pregunta las filas propuestas y borra lo que añadió la rama

- GIVEN `operations.md` con «Camino crítico: `node scripts/critical-path.mjs` · cubre `e2e`, `unit`», `e2e` de nivel E2E y `unit` de nivel unitario en «Suites», y «Tests de feature: `node scripts/critical-path.mjs --extras --run`»
- AND una rama que añadió `e2e/export-pdf.spec.ts`, `e2e/share-pdf.spec.ts` y un test nuevo `exporta en A4` dentro de `e2e/print.spec.ts`, que ya tenía otros, y modificó `e2e/login.spec.ts`, que ya estaba en la base fuera de la lista; la spec propone fila para `share-pdf.spec.ts › comparte el PDF`
- WHEN el agente cierra la feature
- THEN en el cierre, antes de la suite, corre «Tests de feature» una vez y guarda su salida, y después el check
- AND pregunta sola «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `e2e/share-pdf.spec.ts › comparte el PDF`.», y sin respuesta no borra ese test
- AND «Tests de feature» pasa los tres tests añadidos y no `e2e/login.spec.ts`
- AND borra `e2e/export-pdf.spec.ts` y, de `e2e/print.spec.ts`, solo `exporta en A4`; no borra `e2e/login.spec.ts` ni ningún test de `unit`; el borrado va en el commit de cierre, y el 4.1 del walkthrough lista lo borrado con el resultado de esa pasada
- AND la suite del cierre corre sobre el árbol ya borrado, con el check en la gate, y un código distinto de 0 es rojo; es el árbol del cierre, distinto del que validó el gate de cierre del final de las tasks
- AND la sesión no escribe en `critical-path.md`
- AND con «Camino crítico» y `critical-path.md` ausente o sin filas, o con una línea `sin-base:` antes del borrado, para sin borrar nada y lo dice
- AND en un patch con el mismo proyecto, igual, con la fila propuesta de `patch.md` §4 y el borrado en su commit de cierre

### Tras el merge de sincronización, el cierre dice lo que la base trae fuera de la lista

- GIVEN el mismo proyecto, y una base que trae `e2e/comments.spec.ts` de otra rama, fuera de la lista
- WHEN la gate corre el check tras `sdd merge --sync`
- THEN el mensaje final nombra `e2e/comments.spec.ts` con su línea `ya-en-base:`, en un aviso que cuenta los `ya-en-base:` y nombra hasta diez
- AND no lo borra ni abre fila de deuda, y las líneas `lista-tocada:`, `fila-nueva:` y `freno-modificado:` van al mismo aviso

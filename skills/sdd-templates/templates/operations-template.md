# Operations — <proyecto>

> Cómo se ejecuta y se verifica el proyecto. Sin versiones (están en los manifests: `package.json`, `*.csproj`…) ni decisiones pendientes (van al roadmap); el README enlaza este documento, no lo duplica. Los valores de comportamiento (tiempos, límites, cuotas) viven en `capabilities/`. Es un documento de estado: se reescribe, no se le añade. Borra los bloques de ayuda (`>`) al redactar.

## Comandos

- **Build**: `<comando>`
- **Arrancar**: `<comando>`

## Testing

> Lo leen el plan de cada cambio, la pasada de fix y el cierre. TDD si hay tests automáticos; smoke manual documentado si no los hay.

- **Suites**: <una por línea, cada una con su comando, su duración y su nivel —`unitario` (sin host, base de datos, red ni procesos), `integración` (arranca el host, un motor de base de datos, contenedores o el sistema de ficheros), `E2E` (la aplicación entera desde fuera) o `pendiente` si no se sabe qué arranca—, p. ej. `unit` · `dotnet test Api.UnitTests` · ~20 s · unitario>
- **Lo afectado**: <comando que corre solo los tests de lo que toca un cambio, p. ej. `moon run :test --affected`; lo usan la pasada de fix y el gate de merge>
- **Gate de cierre**: <una orden, la integración y los E2E por lo afectado, p. ej. `moon run :integration :e2e --affected --base develop --include-relations`, con los `inputs` de cada tarea declarados; sin forma de filtrar, la suite entera. Las suites `unitario` y `pendiente` no van aquí: el cierre las corre enteras con su orden>
- **Gate de merge**: <la orden que `sdd merge --verify` corre sobre la base integrada antes de fusionar, sin encadenar comandos>
- **Sin filtro**: <globs, a cualquier profundidad, del build, la configuración, las dependencias y los helpers comunes de los tests, p. ej. `package.json`, `pnpm-lock.yaml`, `*.csproj`, `.moon/**`, `vitest.config.*`, `tests/helpers/**`: si la rama o la base tocan uno, el gate corre sin filtro>
- **Lint**: <formato y estilo, al editar y en el pre-commit, solo sobre los ficheros tocados, p. ej. `lint-staged`; nunca en el gate, y typecheck y build siguen en el gate · o `ninguno`>
- **CI de la base**: <el pipeline que corre todas las suites en cada push a la rama de integración, un job a la vez, y la orden que lee su último resultado, p. ej. `.github/workflows/ci.yml` · `gh run list --workflow ci.yml --branch develop -L 1 --json conclusion,headSha`; con un pipeline sin esa orden, `sin orden de lectura`; sin pipeline, `ninguna`>
- **Acceso a la aplicación**: <cómo entra el agente en la aplicación para probarla: usuario de pruebas, página de desarrollo, `sin login`; con E2E, el usuario del agente, distinto del de la persona que valida, para que sus pruebas no le cambien los datos>
- **Motor de producción**: <si los tests usan el motor de base de datos de producción o uno en memoria, y qué no se puede expresar con el segundo>
- **Temporales**: <dónde deja hoy cada suite sus temporales, según su config o, si no lo fija, el valor por defecto del runner (Playwright sin `outputDir`: `test-results/`), y si no es `.temp/`, la propuesta para llevarlos ahí, p. ej. `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`; si ninguno lo dice, `<suite>` · `no declarado`, sin propuesta; con un «no», solo el sitio>

> Los seis campos siguientes, solo si el proyecto tiene tests E2E; si no, bórralos. Los lee la referencia de E2E de `sdd-tdd`, y el cierre compara la suite con su presupuesto.

- **Flujos core**: <uno por línea, el flujo en palabras del usuario y su test, p. ej. «emitir una factura · `e2e/invoice.spec.ts` › emite y descarga el PDF». Un E2E nuevo nombra uno de estos flujos; lo demás se prueba en una capa más baja>
- **Presupuesto E2E**: <minutos que puede tardar la suite E2E del gate de cierre, p. ej. `10 min` · `pendiente`>
- **Retries**: <`0` en local; en CI, `0`, `1` o `2`. Recomendado: `0` en local y `2` en CI>
- **Timeouts**: <`por defecto` (los del runner: en Playwright, 30 s por test y 5 s por `expect`) · o el valor subido con su motivo escrito>
- **Entorno de la suite**: <el comando que levanta todo lo que la suite necesita (contenedores, API, web) y cómo se comprueba que responde, p. ej. `moon run env:up` · `curl -f http://localhost:5000/health` · o `no aplica`, si la suite no necesita servidores>
- **Datos**: <cómo crea y borra cada test sus datos, p. ej. «la fixture `invoice` la crea y la borra al acabar». Un test que solo pasa con el entorno recién vaciado depende de otro>

## Frontend

> Solo si el proyecto tiene interfaz; si no, borra la sección. Con qué se verifica lo que se ve: la verificación de frontend del kit lee cada campo por su nombre. Recomendados y probados con el kit: impeccable como detector y Playwright como runner.

- **URL**: <dónde responde la aplicación con el comando «Arrancar», p. ej. `http://localhost:4200`>
- **Detector**: <comando con `{url}` y `{viewport}` y qué salida es fallo, p. ej. `npx impeccable@<versión> detect {url} --viewport {viewport}`, fallo con el código de salida 2 · o `ninguno`>
- **Viewports**: <escritorio y móvil, p. ej. `1280x800` y `390x844`>
- **Runner E2E**: <p. ej. Playwright, el MCP o el paquete `playwright`>
- **Acceso**: <URL de entrada que abre la sesión y redirige a `{path}`, p. ej. la página de desarrollo `/dev/impersonate?user=demo@example.test&next={path}`, que no se despliega en producción · usuario de pruebas · ruta de la sesión `storageState`, ignorada por git, p. ej. `.auth/state.json` · cómo se rehace si caduca · o `sin login`>
- **Temas**: <cómo se activa cada uno, p. ej. oscuro con `?theme=dark`>
- **Pantalla de referencia**: <la pantalla bien compuesta con la que se compara por defecto, p. ej. `/pedidos`>
- **Skills de apoyo**: <skills de diseño del proyecto, opcionales · o `ninguna`>

## Entornos

> Solo si el proyecto trabaja con worktrees y su entorno necesita algo más que instalar dependencias (base de datos, puertos, servicios); si no, borra la sección.

- **Marcador**: `.sdd-env.json` en la raíz del worktree, con `ticket`, `state` (`active` | `cleaned`), `created` (ISO 8601) y <campos propios, p. ej. `dbPort`, `containerName`>. `env:clean` no lo borra: lo deja en `cleaned`.
- **Entradas**: `env:setup` levanta el entorno y deja el marcador en `active` (idempotente); `env:clean` baja los recursos antes de borrar el worktree; `env:preflight` comprueba que el entorno sigue disponible antes de arrancar servicios y, si falla, no arranca nada ni limpia el entorno de otro worktree.
- **Runner**: <comando real, p. ej. `pnpm env:setup`, `moon run env:setup`>
- **Tipos**: <default (persistente, puertos fijos) y efímero (uno por worktree), con sus puertos, almacenamiento y servicios>
- **Puertos en Windows**: un puerto de desarrollo puede caer en un rango reservado del sistema, y el arranque falla con `EACCES` sin decir por qué; `netsh int ipv4 show excludedportrange protocol=tcp` lista los rangos.

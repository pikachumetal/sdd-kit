# Operations — <proyecto>

> Cómo se ejecuta y se verifica el proyecto. Sin versiones (están en los manifests: `package.json`, `*.csproj`…) ni decisiones pendientes (van al roadmap); el README enlaza este documento, no lo duplica. Los valores de comportamiento (tiempos, límites, cuotas) viven en `capabilities/`. Es un documento de estado: se reescribe, no se le añade. Borra los bloques de ayuda (`>`) al redactar.

## Comandos

- **Build**: `<comando>`
- **Arrancar**: `<comando>`

## Testing

> Lo leen el plan de cada cambio, la pasada de fix y el cierre. TDD si hay tests automáticos; smoke manual documentado si no los hay.

- **Suites**: <una por línea, cada una con su comando y su duración, p. ej. `backend` · `dotnet test` · ~2 min>
- **Lo afectado**: <comando que corre solo los tests de lo que toca un cambio, p. ej. `moon run :test --affected`; lo usan la pasada de fix y el gate de merge>
- **Gate de cierre**: <comando de la suite completa que corre una vez, al cerrar>
- **Gate de merge**: <comando que corre sobre la base integrada antes de fusionar>
- **Acceso a la aplicación**: <cómo entra el agente en la aplicación para probarla: usuario de pruebas, página de desarrollo, `sin login`>
- **Motor de producción**: <si los tests usan el motor de base de datos de producción o uno en memoria, y qué no se puede expresar con el segundo>

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

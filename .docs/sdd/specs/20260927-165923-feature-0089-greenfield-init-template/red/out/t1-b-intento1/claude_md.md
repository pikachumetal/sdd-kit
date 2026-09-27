# CLAUDE.md — App

Monorepo moon: `apps/frontend/` (Angular 22) y `apps/backend/` (.NET 10). Válido tanto para
desarrollar el template como para el proyecto instanciado.

## Documentación de anclaje

`.docs/sdd/`: `mission.md` (por qué), `constitution.md` (principios y reglas de producto),
`tech-stack.md` (con qué), `architecture.md` (cómo está construido), `environments.md` (entorno
por worktree), `roadmap.md` (qué viene). Leer antes de cualquier task; flujo `sdd-kit` (las
skills `sdd-*`): `.claude/settings.json` declara su marketplace y lo habilita, así que Claude Code
ofrece instalarlo al confiar en la carpeta.

## Skills del proyecto (`.claude/skills/`)

Úsalas antes de escribir la pieza que cubren: `backend-query` (endpoint de lectura),
`backend-command` (endpoint de escritura), `backend-test` (tests del backend y nivel de host),
`sql-migration` (tablas, columnas, índices), `translation-migration` (textos y claves de error),
`frontend-feature` (pantalla nueva: rutas, data-access, formularios) y `frontend-ux-ui` (lo visual
y la verificación en navegador, también con prisa).

## Entorno

Windows 11 + PowerShell 7. `node`, `pnpm` y `moon` los fija proto (`.prototools`); sus shims solo
resuelven en Git Bash, así que `moon run …` y `node …` van por la herramienta **Bash**; git y
`pnpm install` valen en PowerShell. Cwd siempre la raíz de este fichero.

## Arrancar y verificar: SIEMPRE por moon

`moon run containers:up`, `moon run backend:start`, `moon run frontend:start`, `moon run test`,
`moon run frontend:check`, `moon run backend:build`, `moon run backend:test`. Copiar el `command`
del `moon.yml` y lanzarlo a pelo se salta el `env`, las `deps` y el preflight de la task (p. ej.
`ASPNETCORE_ENVIRONMENT=Development`, sin el cual la API arranca como Production y no expone
OpenAPI; o el preflight de puertos que precede a `compose up`).

Única excepción: si toda task de moon muere al instante con `Acceso denegado. (os error 5)`, es
Bitdefender cortando los procesos de `moon.exe`, no un fallo del proyecto. No lo depures: sigue la
sección «Trabajar sin moon» del `README.md`, que da el equivalente exacto de cada task (carpeta,
`deps` y `env` incluidos), y avisa al dev-lead de que la máquina necesita la exclusión.

## REGLA DE ORO: un test no levanta la BD salvo schema, procedimientos o persistencia de EF (constitution, Art. VIII)

Los tests existen para no romper lo que funciona, y tienen que ser rápidos y baratos en máquina.
Un test que levanta la BD sin necesitarla cuesta minutos en cada pasada (según el motor, la mitad
solo en arrancar el contenedor) y no aporta nada.

- **Sí llevan BD**, y solo ellos: tests del SQL que únicamente ejecuta un motor real (scripts DbUp
  que crean o alteran schema, procedimientos `spd_*`, correspondencia del modelo de EF con el
  schema).
- **Nunca llevan BD**: endpoints, flujos de auth, casos de uso, validación, options, contrato de
  errores, reglas de entidad, soft delete, auditoría, arquitectura. La persistencia va con EF
  InMemory; lo que se prueba es el flujo. Tampoco una siembra o retirada de textos
  (`spd_Translate_Term`/`spd_Delete_Term` con literales): no toca schema ni procedimientos, y la
  cubren `migration:validate` e `i18n-check` sin motor.
- **No se lanzan tests de BD** si el cambio no toca schema, procedimientos o persistencia
  (`Infrastructure/Persistence/`, configuración de EF). Lo que prueban es estructura: si pasó la
  primera vez, sigue pasando mientras no se toque.
- Un test con BD que no cumple lo anterior se reescribe sin BD o se borra.
- Dónde va cada uno: `api.test` (`moon run backend:test`, sin contenedores) y `migrations.test`
  (`moon run backend:test-db`). La task **se niega a ejecutar** si el diff frente a la rama de
  integración no toca SQL de schema o procedimientos, aunque sí toque `migrations/` con scripts que
  solo siembran o retiran textos: no levanta contenedor y sale en verde. Si te la encuentras
  negándose, sigue con tu trabajo; **no** añadas `-- --force` para «asegurarte». Por fuera de moon
  (`dotnet test migrations.test`) los tests de BD quedan *skipped*. Molde y trampas en la skill
  `backend-test`.

## Entorno y servicios locales

- Antes del primer `containers:up`: `pnpm -w run env:setup --type default --db <dialecto>
  --volumes-root <ruta>` (sin flags, interactivo; `--db` no hace falta con un solo dialecto
  registrado). Genera `.containers/.env` (con `CONTAINER_ENGINE`), `apps/backend/api/appsettings.local.json`,
  `apps/frontend/src/environments/environment.local.ts`, `.mcp.json` (servidores MCP `db`,
  `angular-cli` y `moon`; `db` apunta a la BD de ESTE entorno) y `.vscode/launch.json` (abre el
  frontend y smtp4dev en los puertos de ESTE entorno), todos gitignored. `pnpm env:setup` a
  secas choca con el builtin `pnpm env`.
- Motor de contenedores: docker por defecto; `--engine podman` o la variable de entorno
  `CONTAINER_ENGINE=podman` lo cambian (experimental, sin soporte probado: ver el README). Todas las
  tasks `containers:*` pasan por `.tools/scripts/containers.mjs`, que lo lee de `.containers/.env`.
- `containers:up` levanta la BD elegida (`COMPOSE_PROFILES`) y smtp4dev (UI en `:5080`), tras
  comprobar que el puerto `db` está libre; `containers:down` destruye contenedores y red, los datos
  del default siguen en `VOLUMES_ROOT`. Puertos default: 4200 / 5000 / el de la BD / 2525 / 5080
  (detalle en `.docs/sdd/environments.md`). Si chocan con otro proyecto:
  `moon run containers:recreate -- --random-ports` (sortea y conserva los datos); `-- --wipe` borra
  además los datos del default.
- Worktrees SIEMPRE con `pnpm -w run worktree:new|worktree:remove` (o los hooks de Orca
  `orca-setup.mjs` / `orca-archive.mjs`), nunca `git worktree` a pelo: el entorno efímero
  (`.sdd-env.json`, puertos sorteados, named volumes, proyecto compose `app-<ticket>`) nace y muere
  con ellos. Detalle en `.docs/sdd/environments.md`.
- Tooling en `.tools/scripts/*.mjs`, cada uno con su `*.spec.mjs` (`node --test`); `moon run test`
  los ejecuta junto a `frontend:test` y `backend:test`.

## Layout

- `.containers/` — `compose.yml` con el perfil del dialecto + `smtp4dev`; su `moon.yml` llama a
  `.tools/scripts/containers.mjs` (sin dependencias de npm, como el preflight).
  - `postgres/init/` (init nativo de la imagen). <!-- db:postgres -->
  - `sqlserver/` (solo README; sin init nativo, el schema lo aplica DbUp). <!-- db:sqlserver -->
- `.tools/scripts/` — `env-*`, `ng-serve`, `project-root` (raíz anidada), `new/remove-worktree`,
  `orca-*`, `git-flow`, `cli-args`, `migration-{core,new,validate}`, `test-db-guard{,-core}`
  (salvaguarda de `backend:test-db`; sin dependencias de `node_modules`), `i18n-{core,check}`,
  `check-{no-material,style-literals}` con sus reglas en `style-gates-{core,files}`,
  `check-no-dev-routes` (gate del build de producción del showcase) y `serve-static` (servidor
  estático mínimo que usa el gate visual de Playwright, sin `ng serve` de por medio).
- `apps/frontend/` — Angular zoneless + Tailwind 4; lint con `pnpm --filter frontend lint --fix`.
  `src/app/core/i18n/`: Transloco con loader HTTP (`GET /api/translations/{isoCode}`) y
  `LanguageService` (idiomas desde `GET /api/languages`, idioma activo en `localStorage`
  `app.language`, default `es`). Los tests van por `moon run frontend:test`: la task fija
  `NODE_OPTIONS=--no-experimental-webstorage` (el `localStorage` experimental de Node 26 pisa el
  de jsdom); `pnpm run test` a pelo falla por eso.
- Sheet de UI: `apps/frontend/src/theme.css` (tokens: única fuente de color, tema claro y oscuro),
  `apps/frontend/src/app/ui/` (componentes `app-*`, `appButton`, `DialogService`,
  `ConfirmDialogService`, `ToastService`; se importan del barrel `ui/index.ts`) y
  `apps/frontend/src/app/core/theme/` (`ThemeService`: `data-theme` en `<html>`, preferencia en
  `localStorage` `app.theme`). Tokens, API de cada componente y reglas en `.docs/sdd/DESIGN.md`:
  **leerlo antes de tocar UI**. Showcase de todo el sheet en `/ui`, sin sesión, solo con
  `moon run frontend:start` (la ruta entra por `fileReplacements` de la configuración
  `development`: `src/app/dev.routes.ts` ↔ `dev.routes.development.ts`; el build de producción no
  la incluye). Un componente nuevo del sheet se añade también al showcase.
- **Todo cambio de UI se verifica en navegador** (Playwright o similar) sobre la app arrancada, en
  tema claro y oscuro, antes de darlo por bueno: los tests corren sobre jsdom, que no ve si algo se
  pinta, se alinea o contrasta. Se mira `/ui` y las pantallas tocadas; las capturas no se commitean.
- **Dos gates de Playwright**, ninguno dentro de `frontend:check`: `frontend:visual` compara
  capturas del showcase `/ui` contra baselines locales (dependen de la máquina: git las ignora;
  construye y sirve su propio bundle, nada que arrancar antes). Solo al tocar `ui/` o `theme.css`:
  `frontend:visual-update` antes del cambio y `frontend:visual` después (skill `frontend-ux-ui`).
  `frontend:smoke` prueba el
  login (contraseña y enlace mágico) contra el entorno completo arrancado (`containers:up`,
  `backend:start`, `frontend:start`); lanzarlo tras tocar auth o el flujo de login. No relanzar el
  smoke antes de 60 s: el backend impone ese enfriamiento entre solicitudes de código para el mismo
  email, y un segundo intento antes de tiempo no recibe correo nuevo.
- Campos de formulario: un tag por campo con `[formField]` de Signal Forms
  (`<app-input [label]="'CTX.TERM' | transloco" [formField]="form.x" />`). Los textos entran ya
  traducidos. Junto a `[formField]` no se ponen `required`, `disabled`, `readonly`, `hidden`,
  `name`, `min`, `max`, `minLength`, `maxLength` ni `pattern` (NG8022): van en el schema del form.
- `apps/backend/` — `App.slnx`: `api` (ASP.NET Core, controllers, CQRS con Mediator, EF Core,
  Serilog), `migrations` (DbUp; cada dialecto presente con su carpeta de scripts),
  `api.test` (xunit.v3 sobre Microsoft.Testing.Platform + EF InMemory: sin contenedores) y
  `migrations.test` (Testcontainers: **exige Docker**; solo el SQL).
  Versiones NuGet en `Directory.Packages.props`; analyzers en `Directory.Build.props` con
  warnings como errores. Detalle en `apps/backend/README.md`. Con `backend:start` corriendo,
  `backend:test` (y `moon run test`) falla con MSB3027: la API tiene bloqueadas sus DLL; parar la
  API del worktree antes de testear.
- Backend en Clean Architecture de un solo proyecto (constitution Art. VII): caso de uso en
  `Features/<Agregado>/<CasoDeUso>/{Business,Models,Validations}` (handler `internal sealed` junto
  a su command/query; `Result` sin entidades), handlers contra los puertos de `Common/`
  (`IAppDbContext`, `IEmailSender`), nunca contra `Infrastructure/`. Los tests de arquitectura
  (`api.test/Architecture/`) lo comprueban en `backend:test`; molde de referencia:
  `Features/Translations/GetLanguages/` (o `Features/Auth/GetMe/`) y `Features/Auth/MagicLink/`
  (`GetByLanguage` es la única excepción del template: devuelve un diccionario plano sin `Response`,
  no se calca).
- Errores de la API: ProblemDetails con `title` en inglés y `errorKey` (clave de traducción);
  por campo, `errors: { campo: [{ key, message, params }] }`. Una clave nueva va en `ErrorKeys` y
  se siembra por migración (`ErrorKeysSeededTests`, en `backend:test` sin BD, lo vigila leyendo los
  scripts). En el frontend, `core/http/backend-error.ts` (`getBackendError`, `getBackendFieldErrors`)
  y `core/http/http-error-key.ts` (`httpErrorKey`: la clave que pinta la causa de cualquier error HTTP).
- Dialecto de BD: `Database:Provider` en `appsettings.local.json` nombra el dialecto registrado;
  sin la clave, el primero del registro. Lo escribe `env:setup`; lo leen la API, DbUp y la suite
  de tests.
- Migraciones SQL: SIEMPRE `pnpm -w run migration:new --ticket <id> --description <Pascal_Case>`
  (crea el par de ficheros, uno por dialecto) y `pnpm -w run migration:validate` antes de
  commitear; `backend:test` lo ejecuta. Un script ya ejecutado no se edita: se crea otro.
- Versión del producto: SIEMPRE `pnpm -w run bump -- --bump patch|minor|major` o `--set X.Y.Z`
  (sin flags pregunta); `--check` verifica que `package.json`, `apps/frontend/package.json` y
  `<Version>` de `Directory.Build.props` coinciden. Nunca editar esas versiones a mano.
- Textos de interfaz: viven en la BD (`Languages`, `Translations`), **nunca en JSON**. Se siembran
  por migración con `spd_Translate_Term` y se retiran con `spd_Delete_Term`; argumentos siempre
  literales. Claves en inglés, `CONTEXT.TERM` en mayúsculas. `Translations` es dato público
  (endpoint anónimo): nada sensible ahí.
  - Postgres: `CALL spd_Translate_Term('CONTEXT', 'TERM', 'es', 'Texto');`. <!-- db:postgres -->
  - SQL Server: `EXEC spd_Translate_Term N'CONTEXT', N'TERM', N'es', N'Texto';`. <!-- db:sqlserver -->
- `moon run frontend:check` incluye `root:i18n-check` (`pnpm -w run i18n:check`): falla si el
  frontend usa una clave que ninguna migración del dialecto por defecto siembra. Detecta el pipe `transloco`,
  `translateSignal('…')` y `.translate('…')` con clave literal; una clave construida en runtime
  no la ve: declárala con el comentario marcador de `transloco-keys-manager`. Ignora `*.spec.ts`.
- `moon run frontend:check` incluye también `root:check-style-literals`
  (`pnpm -w run check:style-literals`) y `root:check-no-material` (`pnpm -w run check:no-material`).
  El primero falla con cualquier color fuera de `theme.css`: hex, `rgb()`/`hsl()`/`oklch()`,
  valores arbitrarios de Tailwind (`bg-[#fff]`) y utilidades de la paleta por defecto
  (`bg-slate-50`, `bg-white`), que además está desactivada y no genera CSS; se estila solo con
  utilidades de tokens (`bg-surface`, `text-text-muted`, `border-border`, `ring-focus-ring`…). El
  segundo falla si entra `@angular/material` (`@angular/cdk` sí se usa). Sin Sass ni stylelint. Si
  un gate marca algo, se arregla el código: no se añaden exclusiones al gate.
- `moon run frontend:check` incluye también `root:check-no-dev-routes` (`pnpm -w run
  check:no-dev-routes`), que depende de `frontend:build`: falla si el build de producción arrastra
  algún selector `app-ui-*` del showcase, que solo debe entrar en la configuración `development`.
- Markdown: `moon run root:lint-md` (`pnpm -w run lint:md`, markdownlint-cli2 con las reglas de
  `.markdownlint.jsonc`; línea de 120). cSpell (`cspell.json`, `.cspell/custom-words.txt`) es solo
  de editor: sin gate ni dependencia npm; los diccionarios `es-es`/`ca-ca` los ponen las
  extensiones de VS Code, recomendadas en `.vscode/extensions.json`.
- `.impeccable/config.json`: excepciones del detector de la skill `impeccable`, cada una con su
  motivo. Un aviso nuevo se atiende o se consulta; no se añade una excepción por cuenta propia.
- Dependencias npm: `pnpm-workspace.yaml` bloquea paquetes publicados hace menos de 48 h
  (`minimumReleaseAge`); si `pnpm install` lo avisa, usar la versión anterior, no añadir excepciones.

## Auth

- Dos vías de entrada, mismo JWT, ambas por `POST /connect/token` (raíz del backend, **sin**
  prefijo `api`): contraseña (`grant_type=password`) y acceso por correo
  (`grant_type=urn:app:grant-type:magic-link` con `token`, o con `email` + `code`; el correo se
  pide antes con `POST /api/auth/magic-link`).
- Admin local: `admin@app.local` / `Admin@01`. Lo escribe `env:setup` en `AuthOptions` de
  `appsettings.local.json` y el backend lo siembra al arrancar. Si el arranque para nombrando
  `AuthOptions:AdminEmail`, el entorno es anterior a auth: re-ejecutar `env:setup`. Un fallo de
  arranque sale como `Log.Fatal` seguido de la excepción sin controlar (no con código de salida 1).
- El correo de acceso se lee en la UI de smtp4dev (puerto `smtpUi`; `:5080` en el default). La
  suite sustituye `IEmailSender` por un fake: no necesita SMTP.
- Ejemplos canónicos: endpoint protegido en `apps/backend/api/Features/Auth/GetMe/Business/`
  (`[Authorize]` + query Mediator); guards e interceptor en `apps/frontend/src/app/core/auth/`.
  El token endpoint es la **única** ruta fuera de Mediator y del prefijo `api` (convención OIDC):
  no es un patrón que copiar.
- El rol `Administrator` no restringe nada: la autorización por rol la define el proyecto
  (`roleGuard` es el punto de partida).

## Commits

Tipo/scope en inglés, título y cuerpo en castellano con términos técnicos en inglés.

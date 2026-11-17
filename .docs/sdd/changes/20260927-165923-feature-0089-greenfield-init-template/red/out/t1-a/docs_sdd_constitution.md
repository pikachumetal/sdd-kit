---
title: Constitution — App
status: draft
---

# Constitution

**Principios no negociables del proyecto.** Cualquier spec, plan o PR que los viole debe ser
rechazado o justificar la excepción. Los artículos técnicos vienen con la plataforma; los de
producto y las reglas de producto los escribe el proyecto.

---

## Artículo I — Todo por moon

Arrancar y verificar va siempre por `moon run`: `moon run containers:up`, `moon run backend:start`,
`moon run frontend:start`, `moon run test`. Deben estar en verde en cada commit a `develop`.

**Por qué**: copiar el `command` de un `moon.yml` y lanzarlo a pelo se salta el `env`, las `deps`
y el preflight de la task — la API arranca como Production sin OpenAPI, o `compose up`
corre sin comprobar puertos.

**Cómo aplicar**: la verificación de cierre de toda task es el arranque de punta a punta por moon,
no solo los tests unitarios.

## Artículo II — Migraciones inmutables y con paridad de dialectos

Una migración se crea con `pnpm -w run migration:new` y pasa `pnpm -w run migration:validate`
antes de commitearse. Un script ya ejecutado no se edita: se crea otro. Mientras el proyecto
conserve más de un dialecto, cada script existe en todos con el mismo nombre.

**Por qué**: DbUp registra lo aplicado por nombre; editar un script aplicado deja entornos con
schemas distintos y sin forma de saberlo.

**Cómo aplicar**: `backend:test` depende del validador; un nombre fuera de serie o un script sin
homónimo lo paran.

## Artículo III — Textos de interfaz solo por migración

Los textos viven en la BD y se siembran con `spd_Translate_Term` en una migración. Ningún JSON de
traducciones en el repo; argumentos siempre literales; claves en inglés, `CONTEXT.TERM`.

**Por qué**: una sola fuente para todos los entornos, y un gate estático (`i18n-check`) que puede
cruzar lo que el código usa con lo que las migraciones siembran.

**Cómo aplicar**: `moon run frontend:check` incluye el gate y falla si el frontend usa una clave
sin sembrar.

## Artículo IV — Scripts de .tools con test

Cada script `.mjs` de `.tools/scripts/` lleva su `*.spec.mjs` (`node --test`) y entra en
`moon run test`. El entry point va bajo `if (import.meta.main)`, para que el spec pueda importar
el módulo sin ejecutarlo.

**Por qué**: el tooling de entorno es el camino diario de todo el equipo; un bug ahí rompe el
arranque de todos y no lo caza ninguna suite de las apps.

## Artículo V — Commits

Tipo y scope en inglés (`feat(frontend):`, `fix(backend):`), título y cuerpo en castellano con
términos técnicos en inglés.

## Artículo VI — Estilos solo con tokens

Ningún color fuera de `apps/frontend/src/theme.css`: ni hex, ni `rgb()`/`hsl()`/`oklch()`, ni
valores arbitrarios de Tailwind con color, ni utilidades de su paleta por defecto (está
desactivada). Se estila con las utilidades derivadas de los tokens. Sin Sass y sin Angular
Material; Angular CDK sí.

**Por qué**: con una sola fuente de color, cambiar la marca es cambiar valores en un fichero y el
tema oscuro sale sin tocar componentes. Un color suelto rompe las dos cosas sin que ningún test lo
note.

**Cómo aplicar**: `moon run frontend:check` incluye los gates `check-style-literals` y
`check-no-material`; si marcan algo se arregla el código, no se añaden exclusiones. Todo cambio de
UI se verifica además en navegador, en tema claro y oscuro. Contrato del sheet:
`.docs/sdd/DESIGN.md`.

## Artículo VII — Clean Architecture en un solo proyecto, verificada por tests

El backend es un solo proyecto con capas por namespace y dependencias hacia dentro: `Domain` no
conoce a nadie; `Common` (puertos, errores, options) no conoce `Features` ni `Infrastructure`;
`Features` depende de los puertos de `Common`, nunca de `Infrastructure`. Todo caso de uso sigue el
molde `Features/<Agregado>/<CasoDeUso>/{Business,Models,Validations}` y su `Result` es un DTO,
nunca una entidad.

**Por qué**: un molde único es lo que permite leer, revisar y generar cualquier caso de uso igual
que el anterior; y sin una frontera comprobada, un `using` de más acopla un caso de uso a EF o a
MailKit sin que nadie lo note.

**Cómo aplicar**: `api.test/Architecture/ArchitectureTests.cs` corre en `moon run backend:test` y
falla nombrando el tipo que cruza una frontera o se sale del molde. Una regla que falla se arregla
en el código, no relajando la regla.

## Artículo VIII — Tests sin BD salvo schema, procedimientos o persistencia de EF

Un test no levanta la base de datos salvo que pruebe SQL que solo ejecuta un motor real: scripts
DbUp que crean o alteran schema, procedimientos `spd_*` y la correspondencia del modelo de EF con
el schema. Sembrar o retirar textos (`spd_Translate_Term`/`spd_Delete_Term` con argumentos
literales) no toca schema ni procedimientos y no justifica BD: lo valida `migration:validate` (que
la migración es válida) y `i18n-check` (que lo que usa el frontend está sembrado), los dos sin
motor. Endpoints, auth, casos de uso, validación, options, errores, entidades, soft delete y
auditoría se prueban sin BD, sobre EF InMemory.

**Por qué**: los tests existen para no romper lo que funciona, y una suite lenta es una suite que
nadie lanza. Levantar la BD cuesta minutos por pasada y no aporta nada a un test que no prueba SQL,
y una siembra de textos es exactamente ese caso: nunca rompe schema ni procedimientos.

**Cómo aplicar**: `api.test` no referencia Testcontainers; los tests de SQL viven en
`migrations.test` y se lanzan con `moon run backend:test-db`, que **se niega a ejecutar** si el diff
frente a la rama de integración no toca migraciones, persistencia, dominio o versiones de
paquetes, y también se niega si los únicos cambios bajo `migrations/` son scripts que
solo siembran o retiran textos con argumentos literales: no levanta contenedor y sale en verde.
Forzarla exige pedirlo (`-- --force`), y lo mismo por fuera de moon: `dotnet test migrations.test`
deja sus tests de BD en *skipped* salvo con `APP_TEST_DB_FORCE=1`. La regla no vive solo en esta
prosa porque la prosa no bastó: medido en la task 0015, los agentes lanzaban la suite sin cambios de
SQL en 4 de 4 casos sin la skill y en 2 de 3 con ella. Un test con BD que no prueba SQL se reescribe
sin BD o se borra.

## Artículos de producto

## Artículo IX — Ninguna reserva se borra

Cancelar una reserva no la elimina: cambia de estado y queda en el histórico.

**Por qué**: administrador y empleado necesitan poder ver qué pasó con una sala, no solo qué hay
reservado ahora.

**Cómo aplicar**: el modelo de datos no expone un delete físico de reserva; cancelar es un cambio
de estado.

---

## Convenciones

- **Idioma**: interfaz y documentación en castellano; nombres de código (variables, funciones,
  clases) en inglés — fijado por las instrucciones del usuario.
- **Ramas**: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: tipo/scope en inglés (`feat(frontend):`, `fix(backend):`), título y cuerpo en
  castellano con términos técnicos en inglés — fijado por las instrucciones del usuario.
- **Proyecto de referencia**: no aplica.

## Reglas de producto

| Regla | Respuesta |
| --- | --- |
| Dónde viven los datos | En la base de datos del backend; nada en el navegador salvo la sesión. |
| Idioma de los nombres | API y claves en inglés; mensajes al usuario en castellano. |
| Límites | Una reserva dura como mucho 4 horas; un empleado no tiene más de 3 reservas futuras. |
| Avisos | Se avisa al empleado cuando el administrador cancela o cambia una reserva suya. |
| Regla ante conflicto | Manda la reserva confirmada primero. |

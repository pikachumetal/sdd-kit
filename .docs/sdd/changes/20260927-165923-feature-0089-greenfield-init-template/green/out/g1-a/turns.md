# g1-a

Coste: 2.78 $ · turnos: 3

## Turno 1

Nombre para el proyecto — se usa en los títulos de `.docs/sdd/*.md` (hoy dicen «— App», el placeholder del `package.json`). ¿Cómo lo llamamos?

## Turno 2

Sigue sin permiso — reintentarlo no lo resuelve, necesito confirmación tuya para tocar `.claude/settings.json`. ¿Autorizas ese cambio (`autoMemoryEnabled: false` + marketplace `superpowers-marketplace`)?

## Turno 3

Documentación SDD lista, salvo `.claude/settings.json` (bloqueado por permiso).

**Creado/editado**
- `mission.md`: problema, usuarios (empleado/administrador), módulos (salas, reservas, calendario). Fuera de alcance y glosario, pendientes (no en brief).
- `constitution.md`: Artículo IX (reserva no se borra, se cancela), sección Convenciones (idioma, ramas git-flow, commits, sin proyecto de referencia), Reglas de producto (datos, idioma, límites, avisos, conflicto).
- `roadmap.md`: Release 1 con 0001 alta de salas, 0002 reservar sala, 0003 ver ocupación del día.
- `sdd-kit.json`: `ids.mode: sequence` (sin gestor de tickets), `control.profile: delegate`, merge a `develop` con `--no-ff` y push, frenos por defecto, `execution: auto`.
- `.gitignore`: añadido `.superpowers/` y `sdd-kit.local.json`.
- Rama: ya en git-flow (`main`/`develop`), sin cambios.
- Marketplace `superpowers-marketplace`: ya está en tu máquina, no hizo falta añadirlo.

**Pendiente**
- Autorizar el permiso de `.claude/settings.json` para `autoMemoryEnabled: false` + marketplace.
- Nombre del proyecto (sigue "App" en los títulos), fuera de alcance y glosario: sin respuesta en brief, quedan pendientes hasta que los des.

**Siguiente paso**: con `roadmap.md` con las 3 tasks de Release 1, arranca cada una con `sdd-kit:sdd-start-feature`.

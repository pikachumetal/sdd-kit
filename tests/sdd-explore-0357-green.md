# GREEN — `sdd-explore`, feature 0357: la recomendación del agente va a «Abierto:»

Kit: `dist/` construido con la plantilla nueva. Sonnet.

## `e4` con la petición enmendada (`green3/out/`): E4 2 de 2, puerta 2/2

Petición (enmienda del 2026-11-18): «Estoy pensando en subir el mínimo de node en los engines de package.json, a 22 o a 24. ¿Rompe algo? Recomiéndame una y dame el prompt para hacerlo en otro worktree.»

- `e4-1`: título «Subir el mínimo de Node», nombre `feature/raise-node-minimum`, sin versión; «Abierto:» con «- A qué versión subir el mínimo. Propuesta: 24 (`>=24`), …»; «Alcance:» nombra `package.json` y `engines.node`; `package.json` sin tocar.
- `e4-2`: la misma forma; «Decisiones ya tomadas: - Ninguna.» y «Abierto:» con «- A qué versión subir el mínimo (hoy es >=22). Propuesta: 24, …».

## `e4` con la petición original (`green/out/`, `green2/out/`): no observable

0 de 4 llegan a `sdd-explore`: dos sin skill y dos por `sdd-roadmap`. Lo mismo en el RED (`red/out/`). La enmienda cambió la petición.

## Control `e2` (`green/out/`, `ctl-develop/out/`)

Con el kit nuevo, la puerta da 1/2: `e2-1` entra por `sdd-explore` y aplica la forma nueva, con origen en cada línea y un punto en «Abierto:»; `e2-2` no carga ninguna skill. Con el kit de `develop` da también 1/2 (`ctl-develop/`), así que no es una regresión de la 0357 (enmienda: se compara con su línea base).

Sin RED de la petición enmendada con el kit viejo: el RED de la petición original ya mostraba la conducta (la versión recomendada, decidida), y relanzarlo pedía subir otra vez el techo de sujetos (ruling de la Task 2).

Coste: `green` 4 sujetos (0,40 $), `green2` 2 (0,17 $), `ctl-develop` 2 (0,21 $), `green3` 2.

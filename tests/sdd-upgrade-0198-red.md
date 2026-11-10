# RED — la migración v3.0.0 contra un proyecto como este repo (feature 0198)

Escenario `v5` de la [batería de `sdd-upgrade`](batteries/sdd-upgrade/battery.md), molde `v2x-release`, n = 2, sonnet, con el kit de `develop` (`git archive origin/develop:dist`). El molde lleva lo que destapó este repo: filas «**Release 3.0.0**», una fila ✅ sin prefijo cerrada tras la etiqueta `v1.2.0`, el mismo id en «Patches» y en «Próximo», una fila del Backlog con id, un hito sin id en `🔄`, enlaces `specs/…` en el roadmap y en el changelog, y `capabilities/cierre.md` con un escenario que cita el cambio de nombre. Salidas en [`red/out/`](../.docs/sdd/specs/20261110-181442-feature-0198-migrate-repo-v3/red/out/).

| Sujeto | $ | V15 Enlaces | V16 Lo publicado | V17 Release por prefijo | V18 Ids del Backlog | V19 Nombres en capabilities |
| --- | --- | --- | --- | --- | --- | --- |
| `v5-1` | 0,64 | ❌ | ❌ (la 0032 a Next) | ✅ | ❌ (la 0040 pasa a 0041) | ❌ |
| `v5-2` | 0,54 | ❌ | ✅ | ❌ (todo a Now, Next vacío) | ❌ | ✅ |

`battery.mjs run`: `v5 · 2/2 · puerta verde · sin leer: V15…V19`; filas leídas con `judge-v5.mjs` (scratchpad) sobre `state.txt`: rojo en los dos. Total: 2 sujetos, 1,18 $.

## Este repo con la migración de `develop` (revisión de la spec, tres rondas)

- Enlaces relativos rotos al mover: ~400 en `ROADMAP.md`, ~385 en `CHANGELOG.md`, 4 en `PRODUCT.md`, ~33 en `operations.md`.
- «Releases cerradas» acaba en la 2.3.0 y `changelog.md` en la 2.3.4: leída la tabla, 64 patches irían a Now, 13 ya publicados.
- Lo publicado por el commit de la fila falla en los dos sentidos: las 0128, 0116, 0129 y 0122 entraron antes de la 2.3.0 y se cerraron después; la fila del hotfix 0167 entró en `develop` sin etiqueta y su `patch.md` está en `v2.3.4`.
- El prefijo «**Release 3.0.0**» no lo reconocía; 74 filas de «Próximo» sin prefijo, casi todas ✅, irían a Next para siempre.
- Las filas 0250 y 0022 del Backlog perderían su id; el paso 5 reescribiría `capabilities/migration.md:142,265,268,351` y `archive.md:80`, que citan el cambio de nombre como dato.

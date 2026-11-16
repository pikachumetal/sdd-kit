# Operations — salas

## Testing

- **Gate de cierre**: `node --test`

## Entornos

- **Marcador**: `.sdd-env.json` en la raíz del worktree, con `ticket`, `state` (`active` | `cleaned`) y `created`.
- **Entradas**: `env:setup` crea `data/` con el almacén de reservas de prueba y deja el marcador en `active` (idempotente); `env:clean` borra `data/` y deja el marcador en `cleaned`; `env:preflight` comprueba que `data/` existe.
- **Runner**: `npm run env:setup`, `npm run env:clean`, `npm run env:preflight`.
- **Tipos**: efímero: uno por worktree; nace con `env:setup` y muere con `env:clean`.

# Entorno por worktree — salas

## 1. El marcador `.sdd-env.json`

Vive en la raíz del worktree: `ticket`, `state` (`active` | `cleaned`) y `created`.

## 2. Las tres entradas

| Entrada | Semántica |
| --- | --- |
| `env:setup` | crea `data/` con el almacén de reservas de prueba y deja el marcador en `active`; idempotente |
| `env:clean` | borra `data/` y deja el marcador en `cleaned` |
| `env:preflight` | comprueba que `data/` existe |

**Runner**: `npm run env:setup`, `npm run env:clean`, `npm run env:preflight`.

## 3. Ciclo de vida

- **efímero**: uno por worktree; nace con `env:setup` y muere con `env:clean`.

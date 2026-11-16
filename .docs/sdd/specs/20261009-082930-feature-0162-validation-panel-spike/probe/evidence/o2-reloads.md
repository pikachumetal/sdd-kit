# O2 — aguante a recargas y redirección

App: `http://127.0.0.1:3456/` (Vite + React, desechable). Estado inicial: t1 ok, t2 ok, t3 ko. 2026-10-09 ~10:49-10:51.

## Ronda A — reinyección con el script entero

| # | Tipo | Panel visible sin reinyectar | Estado en localStorage | Reinyectado |
| --- | --- | --- | --- | --- |
| 1-5 | `navigate` a la misma URL | no | sí (390 bytes) | no (solo se comprobó) |
| 6 | `location.reload()` | no | sí (390 bytes) | no |
| 7-9 | F5 | no | sí (390 bytes) | no |
| 10 | Ctrl+Shift+R | no | sí (390 bytes) | no |

Tras la ronda, la reinyección completa recupera `ok, ok, ko`.

## Ronda B — reinyección de una línea

El panel guarda su propio código en `localStorage['sdd-validation-panel-src']` (2.849 bytes). Para reinyectar: `eval(localStorage.getItem('sdd-validation-panel-src')); sddValidationPanel.mount([])`.

| # | Tipo | Panel visible sin reinyectar | Estado recuperado | Reinyectado |
| --- | --- | --- | --- | --- |
| 1-10 | F5 | no (10/10) | ok, ok, ko (10/10) | sí, una línea (10/10) |
| R | redirección: `/login.html` → `location.replace('/?from=login')` | no | ok, ok, ko | sí |

## Otras situaciones

- **HMR de Vite** (cambio en `App.tsx`, `hmr update /src/App.tsx`): el panel **sigue visible** sin reinyectar, porque es hermano de `#root` y React no lo toca.
- **Reinicio del servidor de Vite** (cambio en `vite.config.ts`): la página no se recargó y el panel siguió.
- **CSP `script-src 'self'`** (meta en `csp.html`): `eval` del código guardado e inyección directa funcionan (`javascript_tool` no queda bloqueado). La CSP enviada por cabecera HTTP no se ha probado.
- No se ha medido una redirección a **otro origen** (login SSO externo). El estado vive en el `localStorage` del origen de la app, así que debería recuperarse al volver, pero es una inferencia.

## Resultado

**Cumple: el estado se recupera 10 de 10 y en la redirección, siempre con reinyección.** El panel no sobrevive solo a ninguna recarga completa. La reinyección necesita que Claude actúe, y Claude solo actúa en su turno. Así que, tras una recarga, el dev ve que el panel desaparece y tiene que decirlo en la sesión («recarga»), o Claude reinyecta al recibir el «listo». Las marcas hechas antes de la recarga no se pierden; durante la recarga no hay panel donde marcar.

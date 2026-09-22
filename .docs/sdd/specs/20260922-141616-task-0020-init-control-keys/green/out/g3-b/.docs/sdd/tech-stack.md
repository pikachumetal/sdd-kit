# Tech Stack — statusline

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Runtime | Node.js | 22 (declarada en `README.md`; sin `package.json` que la fije como manifest) |
| Módulos | CommonJS (`require`/`module.exports`) | — |
| Dependencias | Ninguna (solo `node:fs`, `node:child_process`, `node:test`, `node:assert` del stdlib) | — |

## Comandos

- **Build**: no aplica — no hay paso de compilación ni bundler.
- **Tests**: `node --test`
- **Arrancar**: no aplica como proceso propio — Claude Code invoca `statusline.js` como `command` de su configuración de statusline, pasándole el JSON de sesión por stdin.

## Testing

TDD con el test runner nativo (`node:test` + `node:assert`). Cobertura actual mínima: solo `formatCost` tiene test (`test/format.test.js`); `formatModel` y `gitBranch` no tienen test todavía.

## Decisiones abiertas

- Fijar la versión de Node en un manifest (`package.json` con `engines`, o `.nvmrc`) — opciones: añadir `package.json` mínimo · dejarlo solo en el README — quién decide: dev-lead.

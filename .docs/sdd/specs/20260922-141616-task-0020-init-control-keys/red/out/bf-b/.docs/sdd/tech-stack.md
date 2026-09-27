# Tech Stack — statusline

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Runtime | Node.js | Sin `package.json` ni `.nvmrc`: no verificable en código. README declara "Node 22", no confirmado por manifest |
| Módulos | CommonJS (`require`/`module.exports`) | — |
| Test runner | `node:test` (nativo) | incluido en Node |

## Comandos

- **Build**: no aplica (no hay paso de compilación/transpilación)
- **Tests**: `node --test`
- **Arrancar**: `node statusline.js` (Claude Code lo invoca pasando el JSON de sesión por stdin)

## Testing

Hay test automático (`test/format.test.js`) para `formatCost`. TDD aplica para código nuevo en `lib/`; `formatModel`, `gitBranch` y `main()` aún no tienen test.

## Decisiones abiertas

- Falta `package.json`: sin él no hay forma de fijar la versión de Node, declarar el test runner como script (`npm test`) ni bloquear dependencias futuras — opciones: crear `package.json` mínimo con `engines.node` · dejarlo así por ser un proyecto sin dependencias — quién decide: dev-lead.

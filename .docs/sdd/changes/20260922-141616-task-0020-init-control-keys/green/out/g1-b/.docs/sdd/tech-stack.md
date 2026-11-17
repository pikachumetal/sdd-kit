# Tech Stack — statusline

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Runtime | Node.js | v22 según `README.md`; el entorno de esta sesión corre v26.9.0. No hay `.nvmrc` ni `package.json` con `engines` que fije la versión — **discrepancia sin verificar**, ver Decisiones abiertas |
| Módulos | CommonJS (`require`/`module.exports`) nativo de Node | — |
| Tests | `node:test` + `node:assert` (nativos, sin runner externo) | incluido en Node |

Sin `package.json`: no hay dependencias externas declaradas ni gestor de paquetes en uso.

## Comandos

- **Build**: no aplica — no hay paso de compilación ni transpilación.
- **Tests**: `node --test`
- **Arrancar**: `node statusline.js` (espera el JSON de sesión de Claude Code por `stdin`)

## Testing

Hay tests automáticos (`test/format.test.js` con `node:test`), aunque solo cubren `formatCost`. Política: TDD para código nuevo — `lib/git.js` y el flujo de `statusline.js` no tienen test hoy.

## Decisiones abiertas

- ¿Qué versión de Node exige realmente el proyecto? El README dice 22, no hay manifest que lo imponga — opciones: fijar `engines` en un `package.json` · añadir `.nvmrc` · dejarlo como nota informal — quién decide: dev-lead.
- `.gitignore` ignora `node_modules/` sin que exista `package.json` — opciones: es vestigio a limpiar · se prevé añadir dependencias pronto — quién decide: dev-lead.

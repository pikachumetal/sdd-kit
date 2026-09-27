# Tech Stack — statusline

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Runtime | Node.js | 22 (según README; sin `package.json` que la fije, sin `.nvmrc`) |
| Módulos | CommonJS (`require`/`module.exports`) | — |
| Tests | `node:test` + `node:assert` (built-in, sin runner externo) | — |

Sin `package.json`: no hay dependencias externas ni scripts npm declarados formalmente.

## Comandos

- **Build**: no aplica, no hay paso de compilación.
- **Tests**: `node --test`
- **Arrancar**: `node statusline.js` (lee el JSON de sesión por stdin)

## Testing

Hay tests automáticos (`node:test`) aunque con cobertura parcial: solo `formatCost` está cubierta hoy (`formatModel` y `gitBranch` no). Política: TDD para código nuevo, siguiendo el patrón ya existente en `test/format.test.js`.

## Decisiones abiertas

- Ninguna. Decidido (2026-09-22): se añade `package.json` mínimo con metadatos básicos y `engines.node`, sin `"type": "module"` (el código es CommonJS) y sin dependencias externas. Pendiente de crear — ver `roadmap.md`, Backlog.

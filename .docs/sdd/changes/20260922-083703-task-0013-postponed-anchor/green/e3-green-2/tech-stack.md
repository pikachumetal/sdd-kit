# Tech Stack — notas

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Runtime | Node.js | 22 |
| Dependencias | ninguna (solo stdlib) | — |
| Tests | `node --test` (nativo) | Node 22 |

## Comandos

- **Build**: no aplica (sin paso de compilación).
- **Tests**: `node --test`
- **Arrancar**: pendiente — el entrypoint exacto lo fija `architecture.md`, todavía pospuesta.

## Testing

TDD con `node --test`: cada módulo (añadir, buscar, etiquetar) lleva sus tests antes de la implementación.

## Decisiones abiertas

_Ninguna: stack cerrado (Node 22, sin dependencias externas, `node --test`)._

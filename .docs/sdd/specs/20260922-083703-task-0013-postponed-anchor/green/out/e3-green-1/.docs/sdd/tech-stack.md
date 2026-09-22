# Tech Stack — notas

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Lenguaje / runtime | Node.js | 22 |
| Dependencias externas | ninguna | — |
| Almacén de datos | fichero JSON en el home del usuario | — |

## Comandos

- **Build**: no aplica (sin transpilación ni build step).
- **Tests**: `node --test`
- **Arrancar**: `node ./bin/notas.js <comando>` (ruta exacta del entrypoint, a confirmar en la primera task)

## Testing

TDD con el runner nativo `node --test`: primero el test que falla, después la implementación. Tests en verde es condición para commitear (constitution).

## Decisiones abiertas

- Ninguna. Stack cerrado en la entrevista: Node 22, sin dependencias, `node --test`.

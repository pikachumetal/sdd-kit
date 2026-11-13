# Operations — salas

## Comandos

- **Arrancar**: `node src/app.js <comando> [argumentos]`

## Testing

- **Gate de cierre**: `node --test --test-concurrency=1` — workaround: esquiva una carrera de los tests sobre el almacén compartido en memoria, no reproducida el 2026-11-11; deuda en `steering/debt.md` («Gate con `--test-concurrency=1`»).

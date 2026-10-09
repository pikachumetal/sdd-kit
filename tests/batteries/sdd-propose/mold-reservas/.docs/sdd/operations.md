# Operations — salas

## Comandos

- **Arrancar**: `node src/app.js <comando> <argumentos>`

## Testing

- **Suites**: `unit` · `node --test` · ~1 s
- **Lo afectado**: `node --test <fichero de test>`
- **Gate de cierre**: `node --test && node scripts/lint.mjs`
- **Gate de merge**: `node --test && node scripts/lint.mjs`
- **Acceso a la aplicación**: `sin login`
- **Motor de producción**: sin base de datos; las reservas viven en memoria

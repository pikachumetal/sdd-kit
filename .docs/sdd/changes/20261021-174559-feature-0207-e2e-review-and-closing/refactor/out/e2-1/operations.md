# Operations — salas

## Comandos

- **Build**: no aplica
- **Arrancar**: `node scripts/env-up.mjs`

## Testing

> Lo leen el plan de cada cambio, la pasada de fix y el cierre. TDD si hay tests automáticos; smoke manual documentado si no los hay.

- **Suites**: `unit` · `node --test test/` · ~1 s; `e2e` · `node e2e/run.mjs` · ~50 s
- **Lo afectado**: `node --test test/`
- **Gate de cierre**: `node --test test/ && node e2e/run.mjs`
- **Gate de merge**: `node --test test/`
- **Acceso a la aplicación**: sin login; cada test abre su propia sesión (cabecera `x-session`), distinta de la de la persona que valida
- **Motor de producción**: en memoria, como en producción
- **Flujos core**:
  - cancelar una reserva con su motivo · `e2e/cancel.e2e.mjs` › cancela una reserva con su motivo
  - ver las salas libres · `e2e/free.e2e.mjs` › libres de 12:00 a 14:00 enseña las dos salas
- **Presupuesto E2E**: `0,5 min`
- **Retries**: `0` en local; `2` en CI
- **Timeouts**: por defecto
- **Entorno de la suite**: `node scripts/env-up.mjs` · `curl -f http://localhost:4672/health`
- **Datos**: cada test abre su sesión, con su propio estado de la app, y la cierra al acabar. Un test que solo pasa con el entorno recién vaciado depende de otro

## Entornos

- **Local**: `node scripts/env-up.mjs` levanta el servidor en el puerto de `e2e/config.json`; `node scripts/env-down.mjs` lo para

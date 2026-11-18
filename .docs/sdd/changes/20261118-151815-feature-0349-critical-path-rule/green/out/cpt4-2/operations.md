# Operations — salas

## Comandos

- **Build**: no aplica
- **Arrancar**: `node scripts/env-up.mjs`

## Testing

> Lo leen el plan de cada cambio, la pasada de fix y el cierre. TDD si hay tests automáticos; smoke manual documentado si no los hay.

- **Suites**: `unit` · `node --test test/` · ~1 s · unitario; `e2e` · `node e2e/run.mjs` · ~50 s · E2E
- **Lo afectado**: `node --test test/`
- **Gate de cierre**: `node --test test/ && node scripts/critical-path.mjs && node e2e/run.mjs`
- **Gate de merge**: `node --test test/`
- **Acceso a la aplicación**: sin login; cada test abre su propia sesión (cabecera `x-session`), distinta de la de la persona que valida
- **Motor de producción**: en memoria, como en producción
- **Camino crítico**: `node scripts/critical-path.mjs` · cubre `e2e`; lista en `.docs/sdd/steering/critical-path.md`
- **Tests de feature**: `node scripts/critical-path.mjs --extras --run`
- **Presupuesto E2E**: `0,5 min`
- **Retries**: `0` en local; `2` en CI
- **Timeouts**: por defecto
- **Entorno de la suite**: `node scripts/env-up.mjs` · `curl -f http://localhost:61979/health`
- **Datos**: cada test abre su sesión, con su propio estado de la app, y la cierra al acabar. Un test que solo pasa con el entorno recién vaciado depende de otro

## Entornos

- **Local**: `node scripts/env-up.mjs` levanta el servidor en el puerto de `e2e/config.json`; `node scripts/env-down.mjs` lo para

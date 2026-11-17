# Constitution — pomodoro-cli

## Principios

1. Sin dependencias de producción — el proyecto solo usa módulos nativos de Node; una dependencia nueva se justifica antes de añadirse (propuesto, deducido de que `package.json` no declara ninguna).
2. Persistencia en ficheros planos del home del usuario, nunca en base de datos ni servicio externo (propuesto, deducido de `config.js`/`history.js`).
3. Retrocompatibilidad por defecto — regla de oro brownfield.
4. Respetar el patrón existente aunque no sea ideal — regla de oro brownfield.
5. Cero refactor oportunista — regla de oro brownfield.
6. Migraciones masivas solo con justificación escrita — regla de oro brownfield.

## Convenciones

- **Idioma**: mensajes al usuario y commits en español; identificadores de código (variables, funciones) en inglés (propuesto, deducido de `notify.js` y del commit `chore: estado inicial`).
- **Ramas**: `main` estable · `develop` de integración (observado en el repo); convención de rama de feature no observable con un solo commit — propuesto `feature/<id>` desde `develop`, a confirmar.
- **Commits**: formato `tipo: descripción` en español, tipo en inglés (propuesto, deducido de `chore: estado inicial`; sin más historial para confirmar el catálogo completo de tipos).
- **Proyecto de referencia**: no aplica.

## Reglas de producto

- **Dónde viven los datos**: config en `~/.pomodororc`, histórico en `~/.pomodoro-history.json` — ambos JSON en el home del usuario.
- **Idioma de los nombres**: claves de config e identificadores de código en inglés (`workMinutes`, `shortBreakMinutes`…); mensajes mostrados al usuario en español.
- **Límites**: minutos de cada fase entre 1 y 120 (`MIN_MINUTES`/`MAX_MINUTES` en `config.js`); histórico retiene 90 días (`RETENTION_DAYS` en `history.js`).
- **Avisos**: al cambiar de fase se notifica con mensaje y bell sonoro, salvo dentro de `quietHours`, donde se omite el bell.
- **Regla ante conflicto**: no aplica — cada dato tiene una sola fuente (un fichero por dato).

# Architecture — pomodoro-cli

## Estructura

```text
bin/
  cli.js       — entry point: parsea argv, orquesta start/stats/config
src/
  config.js    — carga/guarda ~/.pomodororc, valida rangos de minutos
  history.js   — persiste y agrega ~/.pomodoro-history.json (histórico de pomodoros)
  notify.js    — formatea el mensaje y el bell de cada fase, respeta quietHours
  timer.js     — máquina de estados pura de las fases del pomodoro
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `bin/cli.js` | Entry point CLI: parsea `process.argv`, despacha `start` / `stats` / `config` | `src/config.js`, `src/timer.js`, `src/notify.js`, `src/history.js` |
| `src/config.js` | Carga y guarda configuración de usuario, valida rangos de minutos | `~/.pomodororc` |
| `src/timer.js` | Máquina de estados pura de fases (`work` → `short-break`/`long-break`) | ninguna |
| `src/notify.js` | Decide mensaje y bell según fase y `quietHours` | ninguna |
| `src/history.js` | Registra pomodoros completados y los agrega por día, con retención de 90 días | `~/.pomodoro-history.json` |

## Flujo principal

1. `cli.js start` carga la config con `loadConfig()`.
2. Crea el temporizador con `createTimer(config)`, fase inicial `work`.
3. Notifica la fase con `notifyPhase()`.
4. Escucha `stdin`: `p` pausa/reanuda (`togglePause`), `q` sale.
5. Cada segundo, `tick(timer)` resta un segundo o cambia de fase (`nextPhase`).
6. Al completar una fase `work`, registra el pomodoro en el histórico (`recordPomodoro`).
7. Al cambiar de fase, vuelve a notificar.

## Dónde va lo nuevo

- Comando CLI nuevo → objeto `commands` de `bin/cli.js`.
- Regla nueva de fases o tiempos → `src/timer.js`.
- Dato nuevo persistido del usuario → módulo nuevo en `src/`, siguiendo el patrón de `config.js`/`history.js` (fichero JSON en el home).
- Tipo de notificación nuevo → `src/notify.js`.

## Decisiones estructurales

_Pendiente._

# Architecture — pomodoro-cli

## Estructura

```text
bin/
  cli.js        # entry point: parsea argv, despacha start | stats | config
src/
  timer.js      # máquina de estados del pomodoro (funciones puras, sin I/O)
  config.js     # carga/guarda configuración en ~/.pomodororc, valida minutos
  history.js    # registra y lee historial en ~/.pomodoro-history.json, retención 90 días
  notify.js     # mensaje y aviso sonoro por fase, respeta quietHours
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `bin/cli.js` | Punto de entrada CLI; dispatch de comandos; bucle de `start` (teclado + `setInterval`) | `src/config.js`, `src/timer.js`, `src/notify.js`, `src/history.js` |
| `src/timer.js` | Estado y transiciones de fase del pomodoro (`createTimer`, `tick`, `nextPhase`, `togglePause`) | ninguna (funciones puras) |
| `src/config.js` | Persistencia y validación de configuración (`~/.pomodororc`) | `node:fs`, `node:os`, `node:path` |
| `src/history.js` | Persistencia y agregación del historial (`~/.pomodoro-history.json`) | `node:fs`, `node:os`, `node:path` |
| `src/notify.js` | Texto y campana de cada fase; silencio en `quietHours` | ninguna |

## Flujo principal

1. `pomo start` carga la configuración (`loadConfig`) y crea el temporizador (`createTimer`).
2. Notifica la fase inicial (`notifyPhase`) y se pone a escuchar teclado (`p` pausa/reanuda, `q` sale).
3. Cada segundo (`setInterval`), `tick` avanza el temporizador.
4. Si el `tick` cambia de fase: si la fase anterior era `work`, registra un pomodoro (`recordPomodoro`); en cualquier caso, notifica la nueva fase.

## Dónde va lo nuevo

- Nuevo comando de CLI → `bin/cli.js` (objeto `commands`).
- Nueva regla de fases o duraciones → `src/timer.js`.
- Nuevo dato de configuración → `src/config.js` (con su validación).
- Nuevo dato histórico o agregación → `src/history.js`.
- Nuevo canal o texto de aviso → `src/notify.js`.

## Decisiones estructurales

_Pendiente._

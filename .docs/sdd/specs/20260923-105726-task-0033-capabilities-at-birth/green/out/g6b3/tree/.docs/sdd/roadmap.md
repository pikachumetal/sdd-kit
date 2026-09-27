# Roadmap — pomodoro-cli

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| El script `test` (`node --test`) no ejecuta nada: no hay ningún fichero `*.test.js` en el repo | medio — sin red de seguridad para cambios | task de tests para `timer.js`, `config.js`, `history.js`, `notify.js` |
| El README documenta `pomo pause` como comando independiente, pero `bin/cli.js` solo define `start`, `stats` y `config`; la pausa es la tecla `p` dentro de `pomo start` | medio — documentación engañosa para quien la lee | task para corregir el README o añadir el subcomando |
| `config.js` valida `workMinutes`/`shortBreakMinutes`/`longBreakMinutes` pero no `quietHours` al cargar o guardar | bajo | task si aparecen datos corruptos en `quietHours` |
| Sin `engines` en `package.json` fijando la versión mínima de Node | bajo | ver decisión abierta en `tech-stack.md` |
| Sin `.gitignore` ni `package-lock.json` en el repo | bajo | cuando se añada alguna dependencia o herramienta local |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

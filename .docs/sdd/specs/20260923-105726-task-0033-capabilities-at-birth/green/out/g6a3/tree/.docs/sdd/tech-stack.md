# Tech Stack — pomodoro-cli

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Runtime | Node.js | no fijada en `package.json` (sin campo `engines`); entorno de desarrollo actual: v26.10.0 |
| Dependencias de producción | ninguna | solo módulos nativos (`node:fs`, `node:os`, `node:path`) |
| Test runner | `node --test` (nativo) | el de Node instalado |

## Comandos

- **Build**: no aplica — JavaScript plano, sin paso de compilación.
- **Tests**: `npm test` → `node --test`
- **Arrancar**: `node bin/cli.js start|stats|config` o, tras `npm link`, `pomo start|stats|config`

## Testing

Política declarada en `package.json` (`node --test`), pero el repo no tiene todavía ningún fichero de test: el script no encuentra nada que ejecutar. Ver deuda técnica en `roadmap.md`.

## Decisiones abiertas

- Versión mínima de Node soportada — opciones: fijar `engines` en `package.json` con la versión mínima probada · dejarlo sin fijar — quién decide: mantenedor del proyecto.

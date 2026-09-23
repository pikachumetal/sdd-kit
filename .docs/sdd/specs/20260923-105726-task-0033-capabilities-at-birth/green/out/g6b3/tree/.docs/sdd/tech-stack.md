# Tech Stack — pomodoro-cli

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Runtime | Node.js | v26.10.0 instalado; sin `engines` en `package.json` (no fijado) |
| Lenguaje | JavaScript (CommonJS, `require`/`module.exports`) | — |
| Dependencias de terceros | ninguna | — solo módulos core: `node:fs`, `node:os`, `node:path` |
| Persistencia | ficheros JSON en el home del usuario | — |

## Comandos

- **Build**: no aplica (sin paso de compilación; CommonJS ejecutado directo)
- **Tests**: `npm test` → `node --test` (sin ficheros `*.test.js` en el repo: el comando no ejecuta ningún test hoy)
- **Arrancar**: `node bin/cli.js start` (o `pomo start` si el paquete está enlazado/instalado, vía el `bin` de `package.json`)

## Testing

No hay tests automáticos hoy, pese a que `package.json` ya declara el script `node --test`. Hasta que existan ficheros de test, cada task documenta un smoke manual (ejecutar el comando y verificar la salida/el fichero persistido).

## Decisiones abiertas

- Fijar la versión mínima de Node en `engines` — opciones: `>=18` (mínimo con `node:test` estable) · fijar la instalada (`26.10.0`) — quién decide: dev-lead.
- Escribir los tests automáticos que el script ya espera — opciones: escribirlos ahora para `timer.js`/`config.js`/`history.js`/`notify.js` · añadirlos según se toque cada módulo — quién decide: dev-lead.

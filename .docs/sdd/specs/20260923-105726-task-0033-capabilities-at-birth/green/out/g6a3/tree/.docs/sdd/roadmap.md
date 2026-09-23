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
| `package.json` declara `"test": "node --test"` pero el repo no tiene ningún fichero de test | medio — no hay red de seguridad ante regresiones en `timer.js`, `config.js`, `history.js`, `notify.js` | próxima task que toque esos módulos |
| `package.json` no fija `engines.node` — la versión mínima soportada no está garantizada | bajo — riesgo de incompatibilidad silenciosa en otra máquina | cuando se decida la versión mínima (ver `tech-stack.md`, decisiones abiertas) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

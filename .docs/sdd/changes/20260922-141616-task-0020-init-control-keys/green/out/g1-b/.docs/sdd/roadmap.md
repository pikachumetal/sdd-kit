# Roadmap — statusline

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| Sin `package.json`/`engines`: README exige Node 22, el entorno real corre v26.9.0 y nada lo fuerza | medio — un cambio futuro puede depender sin querer de una API de una versión no garantizada | task cuando se añada la primera dependencia real, o antes si da un problema |
| `.gitignore` ignora `node_modules/` sin que exista `package.json` | bajo — vestigio, no rompe nada hoy | limpiar en cuanto se toque `tech-stack.md` de nuevo |
| `statusline.js` no captura el error de `JSON.parse` si `stdin` trae un JSON inválido: revienta sin mensaje útil | medio — Claude Code vería un `statusline` roto sin pista de por qué | patch |
| Solo `formatCost` tiene test; `formatModel`, `gitBranch` y el flujo de `statusline.js` no tienen ninguno | medio — cambios en esas piezas no tienen red de seguridad | task |
| `gitBranch` captura cualquier error igual (repo inexistente, `git` no instalado, timeout…) sin distinguir causa | bajo — no hay necesidad de diagnóstico hoy | patch, si aparece un caso real que lo requiera |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

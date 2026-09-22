# Constitution — statusline

## Principios

> Propuesta deducida del código y de este onboarding — a confirmar.

1. **Cero dependencias externas** — todo el código usa solo módulos nativos de Node (`node:fs`, `node:child_process`, `node:test`). *(propuesta, deducida: sin `package.json` ni `node_modules` reales)*
2. **Funciones puras en `lib/`, efectos aislados en el entry point** — `lib/format.js` no toca el sistema; `lib/git.js` es el único módulo con `execSync`; `statusline.js` es el único con `stdin`/`stdout`. *(propuesta, deducida de la estructura actual)*
3. **Fallo silencioso hacia una parte vacía, nunca hacia un crash de la línea** — `gitBranch` captura cualquier error y devuelve `''`; el array `parts` filtra vacíos. *(propuesta, deducida: así se comporta hoy `lib/git.js`, aunque `statusline.js` no aplica el mismo criterio al `JSON.parse` de `stdin`)*
4. **Reglas de oro brownfield** (fijas, no se preguntan): retrocompatibilidad por defecto; respetar el patrón existente aunque no sea ideal; cero refactor oportunista; migraciones masivas solo con justificación escrita.

## Convenciones

- **Idioma**: comentarios y documentación (`README.md`) en castellano; identificadores de código (variables, funciones) en inglés; mensajes de commit en castellano con prefijo Conventional Commits (`feat:`, visto en `b1bb5e3`). *(propuesta, a confirmar)*
- **Ramas**: un único commit en `master`, sin convención de ramas observable todavía. *(pendiente hasta que aparezca una segunda rama)*
- **Commits**: Conventional Commits (`tipo: descripción` en castellano), según el único commit existente. *(propuesta, a confirmar)*

## Reglas de producto

- **Dónde viven los datos**: no aplica — no hay persistencia; cada invocación recibe el JSON completo de la sesión por `stdin` y no guarda nada.
- **Idioma de los nombres**: identificadores de código en inglés (`formatModel`, `gitBranch`), claves del JSON de entrada en inglés (`model`, `cost`, `workspace`) — heredadas del contrato de Claude Code, no elegidas por este proyecto. *(propuesta, a confirmar)*
- **Límites**: pendiente — no hay topes de tamaño, longitud ni profundidad observados en el código (p. ej. no se trunca un nombre de modelo largo).
- **Avisos**: pendiente — no hay avisos al usuario implementados; `statusline.js` no informa si el JSON de `stdin` es inválido, simplemente lanza.
- **Regla ante conflicto**: no aplica — no hay dos fuentes que puedan dar el mismo dato.

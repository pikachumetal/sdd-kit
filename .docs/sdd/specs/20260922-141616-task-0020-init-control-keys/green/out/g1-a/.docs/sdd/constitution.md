# Constitution — statusline

## Principios

1. **Sin dependencias externas** — el proyecto se mantiene en Node built-in (`node:fs`, `node:child_process`, `node:test`). *(propuesta, observado en README y código)*
2. **Retrocompatibilidad por defecto** — un cambio no rompe la firma de `statusline.js` como comando de statusline de Claude Code sin aviso explícito. *(regla de oro brownfield)*
3. **Respetar el patrón existente aunque no sea ideal** — CommonJS, funciones puras en `lib/`, error atrapado devolviendo `''` en vez de propagar. *(regla de oro brownfield)*
4. **Cero refactor oportunista** — una task que toca `lib/format.js` no reescribe `lib/git.js` de paso. *(regla de oro brownfield)*
5. **Migraciones masivas solo con justificación escrita** — p. ej. pasar a ESM, si algún día se decide, entra como decisión registrada, no como cambio de paso. *(regla de oro brownfield)*

## Convenciones

- **Idioma**: identificadores de código en inglés; comentarios, mensajes de test, commits y documentación en castellano. *(propuesta, observado en `statusline.js:2`, `test/format.test.js:5`, commit `feat: statusline con modelo, rama y coste`)*
- **Ramas**: solo `master` como rama estable; sin convención de integración adicional observada (proyecto de un commit hasta ahora).
- **Commits**: Conventional Commits con tipo en inglés y título en castellano (`feat: statusline con modelo, rama y coste`). *(propuesta, un solo commit como muestra)*

## Reglas de producto

- **Dónde viven los datos**: no aplica — proceso sin estado; el JSON de sesión llega por stdin en cada invocación y no se persiste nada.
- **Idioma de los nombres**: identificadores (funciones, variables) en inglés; ver Convenciones → Idioma. *(propuesta)*
- **Límites**: no aplica — no hay colecciones, tamaños ni profundidades que topar en el dominio actual.
- **Avisos**: pendiente — no hay avisos al usuario observados en el código (no hay casos de secretos ni datos sensibles hoy).
- **Regla ante conflicto**: no aplica — cada valor de la línea (modelo, rama, coste) viene de una única fuente, no hay dos vías que puedan discrepar.

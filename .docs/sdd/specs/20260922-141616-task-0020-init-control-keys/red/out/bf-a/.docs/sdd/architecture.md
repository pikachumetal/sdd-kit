# Architecture — statusline

## Estructura

```text
statusline.js       # entrypoint: lee stdin, arma la línea, escribe stdout
lib/
  format.js          # formatModel, formatCost — funciones puras de formateo
  git.js             # gitBranch — shell-out a `git branch --show-current`
test/
  format.test.js     # tests de lib/format.js con node:test
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `statusline.js` | Entrypoint. Lee el JSON de sesión de stdin (fd 0), llama a `lib/format` y `lib/git`, filtra segmentos vacíos y escribe la línea final en stdout. | `lib/format.js`, `lib/git.js`, `node:fs` |
| `lib/format.js` | Formatea el nombre del modelo y el coste en USD. Funciones puras, sin I/O. | — |
| `lib/git.js` | Obtiene la rama git actual del directorio de trabajo vía `execSync`. Devuelve `''` si falla (no está en un repo, git no disponible). | `node:child_process`, binario `git` en PATH |
| `test/format.test.js` | Verifica `formatCost`. | `lib/format.js`, `node:test`, `node:assert` |

## Flujo principal

1. Claude Code invoca `statusline.js` y le escribe el JSON de sesión por stdin.
2. `main()` lee y parsea ese JSON (`readFileSync(0, 'utf8')` + `JSON.parse`).
3. Se calculan tres segmentos: `formatModel(input.model)`, `gitBranch(input.workspace?.current_dir)`, `formatCost(input.cost?.total_cost_usd)`.
4. Se filtran los segmentos vacíos (`.filter(Boolean)`) y se unen con `' | '`.
5. El resultado se escribe en stdout sin salto de línea final.

## Dónde va lo nuevo

- Un nuevo segmento de la statusline (p. ej. duración de sesión, tokens) → nueva función pura en `lib/`, cableada en `statusline.js` dentro del array `parts`.
- Lógica que necesita shell-out o I/O externo (como `gitBranch`) → módulo propio en `lib/` que aísla el `try/catch` y devuelve `''` en fallo, igual que `git.js`.
- Formateo puro (sin I/O) → `lib/format.js` o un fichero hermano si crece.

## Decisiones estructurales

- _Pendiente._

# Architecture — statusline

## Estructura

```text
statusline.js       # entry point: lee stdin, arma la línea, escribe stdout
lib/
  format.js          # funciones puras de formateo (modelo, coste)
  git.js              # lectura de estado git (rama actual) vía execSync
test/
  format.test.js      # tests de lib/format.js con node:test
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `statusline.js` | Punto de entrada: parsea el JSON de stdin, orquesta las 3 piezas de la línea y escribe stdout | `lib/format.js`, `lib/git.js` |
| `lib/format.js` | Formatea el nombre del modelo y el coste en USD, funciones puras sin IO | — |
| `lib/git.js` | Obtiene la rama git actual del directorio de trabajo vía `git branch --show-current` | proceso `git` del sistema (`node:child_process`) |
| `test/format.test.js` | Test unitario de `lib/format.js` | `lib/format.js` |

## Flujo principal

1. Claude Code invoca `statusline.js` y le pasa por stdin un JSON con `model`, `workspace.current_dir` y `cost.total_cost_usd`.
2. `main()` lee y parsea ese JSON.
3. Arma un array con `formatModel(model)`, `gitBranch(current_dir)` y `formatCost(total_cost_usd)`, filtrando los valores vacíos (`''`).
4. Escribe por stdout las partes unidas con `' | '`.

## Dónde va lo nuevo

- Un campo nuevo del JSON de sesión a mostrar → nueva función pura en `lib/format.js` (o módulo nuevo si no es formateo puro), añadida al array de `parts` en `statusline.js`.
- Lectura de estado del sistema (git, filesystem…) → módulo nuevo en `lib/`, siguiendo el patrón de `lib/git.js` (función que atrapa el error y devuelve `''`).
- Test → junto al módulo, en `test/<módulo>.test.js`, con `node:test`.

## Decisiones estructurales

- _Pendiente._

# Architecture — statusline

## Estructura

```text
statusline.js          # entry point: lee stdin, orquesta lib/*, escribe stdout
lib/
  format.js             # formateo puro: nombre de modelo, coste
  git.js                # obtiene la rama git del directorio de trabajo (execSync)
test/
  format.test.js        # tests de lib/format.js con node:test
README.md               # uso y requisito de Node
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `statusline.js` | Punto de entrada: parsea el JSON de `stdin`, llama a `formatModel`, `gitBranch` y `formatCost`, une las partes no vacías con `\| ` y las escribe en `stdout` | `lib/format.js`, `lib/git.js` |
| `lib/format.js` | Funciones puras de formateo: `formatModel` (nombre visible o `?`), `formatCost` (USD a 2 decimales, o vacío si no hay coste) | ninguna |
| `lib/git.js` | `gitBranch(dir)`: ejecuta `git branch --show-current` en `dir` vía `execSync`; si falla (no es repo git, git no instalado), devuelve `''` | binario `git` del sistema |
| `test/format.test.js` | Cubre `formatCost` | `lib/format.js` |

## Flujo principal

1. Claude Code invoca `statusline.js` y le pasa por `stdin` el JSON de la sesión.
2. `main()` parsea ese JSON (`JSON.parse(readFileSync(0, 'utf8'))`) — sin captura de error si el JSON es inválido.
3. Compone tres partes: `formatModel(input.model)`, `gitBranch(input.workspace?.current_dir)`, `formatCost(input.cost?.total_cost_usd)`.
4. Filtra las partes vacías y las une con `' | '`.
5. Escribe el resultado en `stdout` sin salto de línea final.

## Dónde va lo nuevo

- Un nuevo campo a mostrar en la línea (p. ej. tokens usados) → una función de formateo nueva en `lib/format.js` y su llamada añadida al array `parts` en `statusline.js`.
- Una fuente de datos externa nueva (comando de sistema, fichero) → un módulo nuevo en `lib/`, siguiendo el patrón de `git.js` (función pura, captura sus propios errores, devuelve `''` si falla).
- Un test nuevo → junto a `test/format.test.js`, mismo patrón (`node:test` + `node:assert`).

## Decisiones estructurales

_Sin decisiones registradas todavía — el proyecto nace con un único commit (`b1bb5e3`)._

# Architecture — statusline

## Estructura

```text
statusline.js        # entry point ejecutable (shebang), orquesta el pintado de la línea
lib/format.js        # funciones puras de formateo (modelo, coste)
lib/git.js           # lectura de la rama git del workspace activo
test/format.test.js  # tests unitarios de lib/format.js
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `statusline.js` | Punto de entrada: lee JSON de stdin, compone la línea con `formatModel`/`gitBranch`/`formatCost` y la imprime por stdout | `lib/format.js`, `lib/git.js` |
| `lib/format.js` | Formatea nombre de modelo y coste en USD | ninguna |
| `lib/git.js` | Obtiene la rama git actual del directorio de trabajo, vía `git branch --show-current` | comando `git` del sistema |
| `test/format.test.js` | Verifica `formatCost` | `lib/format.js`, `node:test` |

## Flujo principal

1. Claude Code invoca `statusline.js` pasando el JSON de la sesión por stdin.
2. `main()` parsea el JSON y llama a `formatModel`, `gitBranch`, `formatCost`.
3. Se filtran los valores vacíos/falsy y se unen con ` | `.
4. Se escribe el resultado por stdout.

## Dónde va lo nuevo

- Nuevo dato a mostrar en la línea → nueva función pura en `lib/`, importada y añadida al array `parts` de `statusline.js`.
- Nueva fuente externa (comando de sistema, fichero) → módulo propio en `lib/`, igual que `git.js`.

## Decisiones estructurales

_Pendiente._ (el repo nace con este único commit; no hay decisiones registradas todavía)

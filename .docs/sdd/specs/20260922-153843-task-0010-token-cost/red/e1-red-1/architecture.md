# Architecture — salas

## Estructura

```text
src/
  app.js    — enruta los comandos de la CLI (libres, reservar, cancelar) y orquesta el estado en memoria
  slots.js  — parseo y validación de franjas horarias (isValidSlot)
test/
  app.test.js — tests de la CLI
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `src/app.js` | Enruta `libres`, `reservar`, `cancelar`; mantiene salas y reservas en memoria | `src/slots.js` |
| `src/slots.js` | Valida el formato de una franja horaria (`isValidSlot`) | — |

## Flujo principal

1. La CLI recibe un comando y sus argumentos (`process.argv`).
2. `app.js` enruta al comando (`libres`, `reservar`, `cancelar`).
3. Si el comando recibe una franja horaria, `app.js` la valida con `isValidSlot` antes de consultar o reservar.
4. Se devuelve el resultado por consola.

## Dónde va lo nuevo

- Un comando nuevo que recibe una franja horaria → valida con `isValidSlot` de `src/slots.js`, no repite la expresión regular.

## Decisiones estructurales

- 2026-09-21 — El parseo de franjas horarias se extrae a `src/slots.js` en vez de vivir en `app.js` — la task 0008 (avisos por correo) también necesitará leer franjas — task 0009.

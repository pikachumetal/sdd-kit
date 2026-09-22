# Architecture — salas

## Estructura

```text
src/
  app.js    — enrutado de comandos de la CLI (libres, reservar, cancelar)
  slots.js  — parseo y validación de franjas horarias (HH:MM-HH:MM)
test/
  app.test.js — tests de comandos y validación
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `src/app.js` | Enruta comandos de la CLI (`libres`, `reservar`, `cancelar`) y arma la respuesta | `src/slots.js` |
| `src/slots.js` | Valida el formato de una franja horaria (`isValidSlot`) | — |

## Flujo principal

1. `node src/app.js <comando> <args>` invoca `run(cmd, params)` en `src/app.js`.
2. Si el comando recibe una franja, `app.js` la valida con `isValidSlot` antes de consultar o reservar.
3. `run` devuelve la respuesta en texto, que se imprime por consola.

## Dónde va lo nuevo

- Un comando nuevo que reciba una franja horaria → usa `isValidSlot` de `src/slots.js`, no repite la expresión regular.
- Lógica de negocio nueva sobre franjas (solapes, orden inicio/fin) → `src/slots.js`.

## Decisiones estructurales

- 2026-09-22 — `app.js` deja de ser el único fichero de código: el parseo de franjas se extrae a `src/slots.js` — evita repetir la validación en cada comando nuevo que reciba una franja (la task 0008 también leerá franjas) — task 0009.

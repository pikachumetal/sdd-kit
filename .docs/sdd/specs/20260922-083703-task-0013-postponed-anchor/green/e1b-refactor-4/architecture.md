# Architecture — salas

## Estructura

```text
src/
  app.js    — entrypoint CLI: parsea el comando y enruta a la lógica de cada uno
  slots.js  — parser/validador de franjas horarias (HH:MM-HH:MM)
test/
  app.test.js — tests de `node --test` sobre `run()`
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `src/app.js` | Entrypoint CLI: enruta `libres`, `reservar`, `cancelar` y ejecuta la lógica de cada comando | `src/slots.js` |
| `src/slots.js` | Valida y parsea franjas horarias `HH:MM-HH:MM` | — |

## Flujo principal

1. `node src/app.js <comando> <args>` invoca `run(cmd, params)` en `src/app.js`.
2. Si el comando recibe una franja horaria (`libres`, `reservar`), `run` la valida con `isValidSlot` antes de consultar o reservar.
3. `run` devuelve el resultado (o el mensaje de error) y el entrypoint lo imprime por consola.

## Dónde va lo nuevo

- Comando nuevo que reciba una franja horaria → validar con `isValidSlot` de `src/slots.js`, no repetir la expresión regular.
- Lógica de negocio nueva sobre salas/reservas → `src/app.js`, salvo que crezca lo bastante para merecer su propio módulo (como pasó con las franjas).

## Decisiones estructurales

- 2026-09-22 — Extraer el parseo de franjas a `src/slots.js` en vez de dejarlo inline en `app.js` — la task 0008 (avisos por correo) también necesitará leer franjas — [task 0009](specs/20260921-090000-task-0009-slot-format/)

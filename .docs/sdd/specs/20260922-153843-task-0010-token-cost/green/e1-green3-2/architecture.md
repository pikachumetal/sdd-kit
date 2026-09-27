# Architecture — salas

## Estructura

```text
src/
  app.js    — enruta los comandos (libres, reservar, cancelar) y expone `run`
  slots.js  — parser de franjas horarias (`isValidSlot`)
test/
  app.test.js — tests de `run`
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `src/app.js` | Enruta cada comando de la CLI (`libres`, `reservar`, `cancelar`) y aplica las reglas de negocio | `src/slots.js` |
| `src/slots.js` | Valida el formato de una franja horaria (`isValidSlot`) | — |

## Flujo principal

1. `src/app.js` recibe `command` y `args` de `process.argv`.
2. Si el comando usa una franja horaria, valida con `isValidSlot` de `src/slots.js` antes de seguir.
3. Franja inválida → mensaje de error único; franja válida → sigue la lógica del comando (`libres`, `reservar`).

## Dónde va lo nuevo

- Un comando nuevo que recibe una franja horaria → valida con `isValidSlot` de `src/slots.js`, no repite la expresión regular.

## Decisiones estructurales

- 2026-09-21 — El parseo de franjas horarias se extrae a `src/slots.js` en vez de vivir en `app.js` — la task 0008 (avisos por correo) también necesitará leer franjas — task 0009.

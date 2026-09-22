# Architecture — salas

## Estructura

```text
src/
  app.js      — enruta comandos (libres, reservar, cancelar) y arma la salida CLI
  slots.js    — parseo y validación de franjas horarias (isValidSlot)
test/
  app.test.js — tests de comandos y validaciones
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `src/app.js` | Enruta los comandos (`libres`, `reservar`, `cancelar`) y compone la salida CLI | `src/slots.js` |
| `src/slots.js` | Valida el formato de una franja horaria (`isValidSlot`) | — |

## Flujo principal

1. `src/app.js` recibe `command` y `args` de `process.argv`.
2. Si el comando usa una franja horaria, valida con `isValidSlot` de `src/slots.js` antes de consultar o reservar.
3. Devuelve el resultado o el mensaje de error por consola.

## Dónde va lo nuevo

- Un comando nuevo que recibe una franja horaria → usa `isValidSlot` de `src/slots.js`, no repite la expresión regular.

## Decisiones estructurales

- 2026-09-21 — Extraer el parseo de franjas a `src/slots.js` en vez de dejarlo en `app.js` — la task 0008 (avisos por correo) también tendrá que leer franjas — task 0009

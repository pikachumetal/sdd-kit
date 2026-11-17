# Architecture — salas

## Estructura

```text
src/app.js     — router de comandos (libres, reservar, cancelar)
src/slots.js   — parseo y validación de franjas horarias (isValidSlot)
test/          — node --test
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `src/app.js` | Enruta los comandos de la CLI (`libres`, `reservar`, `cancelar`) | `src/slots.js` |
| `src/slots.js` | Valida el formato de una franja horaria (`isValidSlot`) | — |

## Flujo principal

1. `src/app.js` recibe `command` y `params` de `process.argv`.
2. Para `libres`/`reservar`, valida la franja con `isValidSlot` de `src/slots.js` antes de consultar o reservar.

## Dónde va lo nuevo

- Comando nuevo que recibe una franja horaria → importa `isValidSlot` de `src/slots.js`; no repetir la expresión regular en `app.js`.

## Decisiones estructurales

- 2026-09-21 — `src/app.js` deja de ser el único fichero de código: el parseo de franjas se extrae a `src/slots.js` — la task 0008 (avisos por correo) también leerá franjas y necesitará el mismo parser — task 0009.

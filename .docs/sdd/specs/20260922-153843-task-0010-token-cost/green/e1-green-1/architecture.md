# Architecture — salas

## Estructura

```text
src/
  app.js    — punto de entrada: parsea el comando y enruta
  slots.js  — parseo/validación de franjas horarias (isValidSlot)
test/
  app.test.js
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `src/app.js` | Enruta comandos (`libres`, `reservar`, `cancelar`) y arma la respuesta | `src/slots.js` |
| `src/slots.js` | Valida el formato `HH:MM-HH:MM` de una franja horaria | — |

## Flujo principal

1. `app.js` recibe `process.argv`, separa comando y argumentos.
2. Si el comando recibe una franja, valida con `isValidSlot` antes de consultar o reservar.
3. Devuelve el resultado o el mensaje de error de franja no válida.

## Dónde va lo nuevo

- Un comando nuevo que recibe una franja horaria → importa `isValidSlot` de `src/slots.js`, no repite la expresión regular.

## Decisiones estructurales

- 2026-09-22 — Se extrae `src/slots.js` como módulo propio para el parseo de franjas, en vez de dejarlo inline en `app.js` — la task 0008 (avisos por correo) también necesitará leer franjas — task 0009.

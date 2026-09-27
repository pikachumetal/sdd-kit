# Architecture — salas

## Estructura

```text
src/
  app.js    — enruta los comandos de la CLI (libres, reservar, cancelar) y compone el mensaje de salida
  slots.js  — parsea y valida el formato de franja horaria (HH:MM-HH:MM)
test/
  app.test.js — tests de comandos y validación
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `src/app.js` | Enruta `libres` / `reservar` / `cancelar`, compone la respuesta | `src/slots.js` |
| `src/slots.js` | Valida el formato `HH:MM-HH:MM` (`isValidSlot`) | — |

## Flujo principal

1. `run(cmd, params)` en `src/app.js` recibe el comando y sus argumentos.
2. Si el comando usa una franja horaria, valida con `isValidSlot` antes de consultar o reservar.
3. Franja inválida → mensaje de error, sin tocar `bookings`. Franja válida → sigue el flujo normal del comando.

## Dónde va lo nuevo

- Comando nuevo que recibe una franja horaria → validar con `isValidSlot` de `src/slots.js`, nunca repetir la expresión regular.
- Parseo o validación de franjas → `src/slots.js`, no `src/app.js`.

## Decisiones estructurales

- 2026-09-22 — Se extrae `isValidSlot` a `src/slots.js` en vez de dejarlo en `src/app.js` — la task 0008 (avisos por correo) también necesitará leer franjas — task 0009.

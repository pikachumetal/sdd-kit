# Architecture — salas

- `src/app.js`: punto de entrada, enruta los comandos de la CLI.
- `src/slots.js`: parseo y validación de franjas horarias (`isValidSlot`). Cualquier comando que reciba una franja importa este módulo en vez de repetir la validación.

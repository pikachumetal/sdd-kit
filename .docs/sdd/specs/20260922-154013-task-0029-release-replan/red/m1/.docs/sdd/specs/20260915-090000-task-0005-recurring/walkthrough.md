# Walkthrough — 0005 Reserva recurrente semanal

## Qué se hizo

`src/recurring.js` genera las ocurrencias semanales hasta la fecha de fin; `src/app.js` añade la opción `--semanal --hasta`.

## Verificación

- `node --test`: 14/0.
- Smoke: reserva semanal de la sala Norte hasta el 2026-10-15 → 5 ocurrencias; cancelar la tercera deja las otras 4.

## Validación

Validado por el dev-lead el 2026-09-16: «probado con mis reservas de los lunes, funciona».

## Tiempo

~3 h.

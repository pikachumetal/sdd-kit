---
name: exportes
description: Use when someone asks to export the bookings of a room or a month from this project.
---

# exportes

Tope del proyecto: esta skill no pasa de 150 palabras; el detalle va a `references/`.

1. Lee la sala y el mes de la petición.
2. Ejecuta `node src/export.js <sala> <mes>`.
3. Rellena `report-template.md` con el resultado y déjalo en `out/<sala>-<mes>.md`.

# Walkthrough — slot-format

Implementado: `src/slots.js` (`isValidSlot`) valida la franja `HH:MM-HH:MM` (horas 00–23, minutos 00–59); `src/app.js` la usa en `libres` y `reservar` antes de consultar o reservar.

Suite verde: `node --test` — 6/6 (incluye los 3 tests nuevos de franja mal formada).

Validado por el dev-lead (Àngel Delgado): probó `node src/app.js libres 10-12` (mensaje de error) y `node src/app.js libres 10:00-12:00` (`Sur`). Confirma que funciona.

Revisión final (`review.md`): sin hallazgos Críticos ni Importantes.

## Tiempo

- Esfuerzo real: no registrado (sin `.docs/sdd/estimation.md` en el proyecto).

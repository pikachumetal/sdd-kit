# Walkthrough — slot-format

Implementado: validación de franja horaria (`HH:MM-HH:MM`, horas 00–23, minutos 00–59) en `libres` y `reservar`. Suite verde (`node --test`, 6/6). Revisión final sin hallazgos (`review.md`).

Verificado por el agente (smoke, 2026-09-21):

| Comando | Resultado |
| --- | --- |
| `node src/app.js libres 10-12` | mensaje de error ✔ |
| `node src/app.js libres 24:00-24:30` | mensaje de error ✔ |
| `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ |
| `node src/app.js libres 10:00-12:00` | `Sur` ✔ |

Validación diferida: 2026-09-23 · «se prueba en uso» · disparador: próximo uso real de `libres`/`reservar` en producción, dueño: dev-lead (Àngel Delgado).

## Desviaciones

- `src/slots.js`: el dev-lead autorizó el 2026-09-21 corregir la hora 24 aquí, aunque el fichero era de la task 0008 (en otro worktree); la task 0008 integra el cambio al fusionar.

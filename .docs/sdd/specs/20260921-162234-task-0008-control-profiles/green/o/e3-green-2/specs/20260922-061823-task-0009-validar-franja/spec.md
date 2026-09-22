---
id: 20260922-061823-task-0009-validar-franja
task: 0009
title: Validar formato de franja horaria en libres
mode: lite
profile: delegate
status: approved
created: 2026-09-22
author: Claude
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Validar formato de franja horaria en libres

## Decisiones que he tomado yo — valida estas

1. La regex de formato exige horas `00-23` y minutos `00-59` en ambos lados de `HH:MM-HH:MM`, sin comprobar que la hora de inicio sea anterior a la de fin — el enunciado pide validar el formato, no la coherencia temporal.
2. Mensaje de error en castellano: "Formato de franja horaria inválido. Usa HH:MM-HH:MM.".
3. Declaro la capacidad nueva `room-booking` (kebab-case, inglés) en `capabilities/` — es la primera del proyecto; agrupa el comportamiento de `libres` porque ese módulo aún no existía.

### Decisiones tomadas con el dev-lead

- Alcance reducido a `libres`; `reservar` queda fuera de esta task — «Vale, que solo valide `libres`; `reservar` fuera.»

## Intent

Hoy `libres` acepta cualquier cadena como franja horaria: una franja mal escrita (`25:99-8`, vacía, con letras...) se cuela sin aviso y llega a consultar disponibilidad con datos sin sentido. Se quiere que `libres` valide el formato `HH:MM-HH:MM` antes de consultar, devolviendo un error claro en castellano y sin ningún efecto cuando el formato es inválido.

## Scope

- Entra: validar el formato `HH:MM-HH:MM` (horas `00-23`, minutos `00-59`) en `libres <franja>`; mensaje de error en castellano; cortar la ejecución antes de consultar disponibilidad.
- No entra: `reservar` (queda fuera de esta task); validar que la hora de inicio sea anterior a la de fin; tocar `cancelar`.

## Approach

Añadir una constante `SLOT_RE` (regex del formato) y el mensaje de error en `src/app.js`. En `libres`, comprobar `params[0]` contra `SLOT_RE` antes de llamar a `freeRooms`; si no cumple, devolver el mensaje de error sin consultar. Sin cambios de firma pública ni de datos.

## Delta de comportamiento

### Capacidad: `room-booking`

**ADDED — Formato de franja horaria en `libres`**
- GIVEN el usuario ejecuta `libres <franja>`
- WHEN `<franja>` no cumple el formato `HH:MM-HH:MM` (horas `00-23`, minutos `00-59`)
- THEN se devuelve "Formato de franja horaria inválido. Usa HH:MM-HH:MM." y no se consulta la disponibilidad de ninguna sala

**Reglas de la capacidad**
- **Idioma de los nombres**: mensajes de error en castellano (Art. 4 de la constitution).
- **Avisos**: "Formato de franja horaria inválido. Usa HH:MM-HH:MM." — mensaje de `libres` cuando la franja no cumple el formato.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-22 | aprobada |

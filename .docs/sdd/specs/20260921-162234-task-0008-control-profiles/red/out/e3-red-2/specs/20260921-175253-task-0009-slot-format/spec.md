---
id: 20260921-175253-task-0009-slot-format
task: 0009
title: Validar el formato de la franja horaria en libres
mode: full
status: in-review
created: 2026-09-21
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Validar el formato de la franja horaria en libres

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: sin review — señales: 1 (capacidad nueva `time-slot`). Contrato público no cuenta: la CLI la usa solo el autor (mission). El resto no aplica y he leído `src/app.js` y `test/app.test.js` enteros.
- Mínimo razonable: sin review — deja sin cubrir solo la decisión 6 (código de salida 1), que es una elección de convención, no un hueco de dominio.

1. **Modo full, no lite** — cumple las cinco condiciones de lite (flujo existente y legible en `src/app.js`; sin cambio de contratos existentes; sin schema ni migración; un solo módulo; no hay `estimation.md`), pero lite lo activas tú. Si lo confirmas, bajo a lite: sin `plan.md` ni `tasks.md`.
2. **Capacidad nueva `time-slot`** — el proyecto no tiene `capabilities/`; la franja es el sustantivo del dominio. Al cerrar, `sdd-end-task` crea `capabilities/time-slot.md` solo con lo de esta spec.
3. **Formato estricto: `HH:MM-HH:MM`, con ceros a la izquierda, horas 00–23 y minutos 00–59** — `9:00-11:00` se rechaza porque las reservas se comparan por texto exacto (`'10:00-12:00'`): una franja sin cero no coincidiría con ninguna y `libres` daría todas las salas como libres sin avisar. `25:00-26:00` se rechaza porque `HH:MM` implica hora real.
4. **No se valida que el inicio sea anterior al fin** — `10:00-09:00` pasa. El roadmap pide formato; el orden es otra regla y va aparte si molesta.
5. **Solo se valida si se pasa una franja** — `libres` sin argumento sigue listando todas las salas. Hacer la franja obligatoria cambia el contrato actual y no lo pide el roadmap.
6. **Un error sale por stderr con código de salida 1**, en vez de por stdout con código 0 como el resto de mensajes. Un comando fallido que "termina bien" es engañoso al encadenarlo en un script.
7. **Texto del error**: `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` — castellano (constitution 4), cita el valor recibido y da un ejemplo.
8. **`reservar` queda fuera (tu decisión)** — sigue sin leer ninguna franja. Al cerrar, la fila 0009 del roadmap se reescribe a «solo `libres`» y la fila de Deuda técnica no se borra: se reformula a «`reservar` sin validación de franja».

## Intent

Hoy `libres` acepta cualquier texto como franja. Con `libres 10-12` el programa no falla: no coincide con ninguna reserva y responde "Norte, Sur", como si ambas salas estuvieran libres. Es una respuesta errónea que parece correcta. Se quiere que una franja mal escrita se detecte antes de consultar nada, con un mensaje claro en castellano.

## Scope

- Entra: validar la franja en `libres`; mensaje de error en castellano; error por stderr con código 1; tests de los escenarios.
- No entra: `reservar`; orden inicio < fin; franja obligatoria; solapes entre franjas; validar sala o día; cambiar el resto de mensajes o su canal.

## Approach

Una regla de formato aplicada en `libres` al inicio, antes de consultar las reservas. Si falla, el comando termina con el mensaje sin consultar nada. El cómo (dónde vive la función, cómo llega el error al punto de entrada) es contenido de `plan.md`.

## Delta de comportamiento

### Capacidad: `time-slot`

**ADDED — Franja válida en libres**
- GIVEN una franja con formato `HH:MM-HH:MM`, horas 00–23 y minutos 00–59 (por ejemplo `10:00-12:00`)
- WHEN se ejecuta `libres <franja>`
- THEN el comando se comporta como hasta ahora

**ADDED — Franja mal formada en libres**
- GIVEN una franja que no cumple el formato (`10-12`, `9:00-11:00`, `10:00 12:00`, `25:00-26:00`, `mañana`)
- WHEN se ejecuta `libres <franja>`
- THEN se escribe por stderr `Franja horaria no válida: "<franja>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`
- AND el código de salida es 1
- AND no se muestra ninguna lista de salas

**ADDED — libres sin franja no se valida**
- GIVEN `libres` sin argumento
- WHEN se ejecuta
- THEN se comporta como hasta ahora

**Reglas de la capacidad**
- **Dónde viven los datos**: no aplica
- **Idioma de los nombres**: castellano (constitution 4)
- **Límites**: no aplica
- **Avisos**: `Franja horaria no válida: "<franja>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |

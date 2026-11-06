---
id: 20261008-170000-feature-0019-manager-marks
feature: 0019
title: El responsable ve sus salas marcadas en libres
mode: lite
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — El responsable ve sus salas marcadas en libres

## Capacidades

- Nuevas: `rooms` — `libres --como responsable` marca con `*` las salas de las que es responsable. (No hay `capabilities/` en el proyecto: esta spec crearía la primera capacidad.)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: contrato público (la firma de `libres` pasa de `libres <franja>` a `libres <día> <franja> --como <rol>`), capacidad nueva (`rooms`), regla de visibilidad (qué ve el cliente) · tamaño: ~10 líneas en 2 ficheros
- Todos los puntos (sonnet): la capacidad inexistente, el contrato de `libres` y quién es «el responsable» (señal: contrato público + capacidad nueva)
- Mínimo razonable: el mismo revisor — no deja nada sin cubrir
Política de modelos: revisión de spec en sonnet (lite); el resto, la del proyecto.

1. La marca es un `*` detrás del nombre de la sala: `Norte*`.
2. **Capacidad nueva `rooms`** (kebab-case inglés), creada al archivar; no hay `capabilities/`.
3. **Pendiente de tu decisión — quién es «el responsable de Norte».** El código no tiene ese concepto (la 0011, sin hacer, lo introduce). Propongo: dato fijo sala→responsable en `src/app.js`, y `--como responsable` marca las salas que tienen responsable asignado; sin identificar a la persona (`--como` es declarativo, no control de acceso). Sin esto la spec no se puede implementar.

### Hallazgos de la review

- **Aceptado** — Crítico: `rooms` no existe, y «Modificadas» era falso → pasa a «Nuevas» y se declara en ✋ (decisión 2); `sdd capability merge` sobre una copia lo rechazaba.
- **Aceptado** — Crítico/Importante: «el responsable de Norte» no está definido → decisión 3, a validar.
- **Aceptado** — Importante: `libres` no admite hoy `<día>` ni `--como` (`src/app.js:28`, `libres <franja>`): es un cambio de firma, o sea de contrato público → **la condición «no cambia contratos públicos» de lite no se cumple; propongo pasar a full** (ver el mensaje de aprobación). La spec no se reescribe a full hasta que lo decidas.
- **Rechazado** — Crítico «ADDED es un MODIFIED encubierto»: hoy no existe `--como`; lo que sí cambia es la firma, ya recogido arriba.
- **Pendiente de la pasada en full** — casos de varios responsables / sin salas propias / sin `--como`, las cinco reglas (no hay «Reglas de producto» en la constitución) y qué tests existentes cambian: dependen de la decisión 3 y del carril.
- **Rechazado** — «Laura» en `approvers`: no he podido contrastarlo con la misión; no es del alcance de esta spec.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

## Intent

El responsable de sala no ve de un vistazo cuáles de las salas libres son suyas.

## Scope

- Entra: `libres <día> <franja> --como responsable` marca sus salas.
- No entra: `--como cliente`, que lista igual que hoy.

## Dónde se prueba

- La marca: por `run('libres', …)`, en `test/app.test.js`.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — El responsable ve sus salas marcadas

- GIVEN Norte y Sur libres el lunes de 10:00 a 12:00, y el responsable de Norte
- WHEN `libres lun 10:00-12:00 --como responsable`
- THEN responde `Norte*, Sur`
- AND con `--como cliente` responde `Norte, Sur`

### Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,2 h
- Estimación de implementación: 0,5 h
- Base de la estimación: un comando y su test
- Confianza: alta

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |

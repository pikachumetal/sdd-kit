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

- Modificadas: `rooms` — `libres --como responsable` marca con `*` las salas de las que es responsable.

## ✋ Decisiones que he tomado yo — valida estas

1. La marca es un `*` detrás del nombre de la sala: `Norte*`.

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

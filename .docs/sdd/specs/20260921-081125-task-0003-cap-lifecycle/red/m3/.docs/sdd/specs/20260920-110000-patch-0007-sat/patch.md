---
id: 20260920-110000-patch-0007-sat
task: 0007
title: Patch — Reservas en sábado para los cursos intensivos
type: patch
status: done
created: 2026-09-20
branch: feature/0007
commit: <hash>
---

# Patch 0007 — Reservas en sábado para los cursos intensivos

## 1. Síntoma

«No puedo reservar el aula 3 el sábado 27 para el intensivo de fin de semana: me sale "Solo se reserva de lunes a viernes".» (profesor, 2026-09-20)

## 2. Causa raíz

`src/bookings.js` rechaza cualquier fecha con `getDay()` igual a 0 o 6. El código hace lo que pide la regla de días lectivos; lo que cambió es la academia, que ha empezado a dar cursos intensivos en sábado. Consultado el dev-lead el 2026-09-20: «a partir de ahora los sábados también se pueden reservar; los domingos no».

## 3. Fix

- **Fichero(s)**: `src/bookings.js`
- **Cambio**: solo se rechaza el domingo (`getDay() === 0`); el mensaje pasa a «No se reserva en domingo».

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | reservar el sábado a las 10:00 | pendiente |
| 2 | reservar el domingo a las 10:00 → rechazado | pendiente |

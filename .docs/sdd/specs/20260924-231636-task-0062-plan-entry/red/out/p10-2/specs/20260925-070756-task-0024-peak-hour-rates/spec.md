---
id: 20260925-070756-task-0024-peak-hour-rates
task: 0024
title: Tarifa por sala y franja horaria, y factura quincenal en la propuesta
mode: full
profile: delegate
status: draft
created: 2026-09-25
author: Fixture
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Tarifa por sala y franja horaria

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`billing`), datos (`data/rates.csv` nuevo en el repo). 2 señales, por debajo de las 4 que piden review.

1. **Capacidad nueva `billing`** — la propuesta 0020 ya la nombra y `capabilities/` no existe: la task 0021 se cerró sin dejarla. Este delta la crea con la tarifa por sala (heredada de 0021) y el recargo.
2. **Esta task hace la tarifa; la factura quincenal no** — la facturación es la 0022, aún sin código. Aquí solo se corrigen la propuesta 0020 y la fila 0022 del roadmap (quincenal, tras 0024); el requisito de factura lo escribe la spec de 0022, para que `billing` no describa comportamiento que no existe.
3. **Tarifa nueva = tarifa de la sala × 1,20 entre las 8:00 y las 14:00** — el cliente dijo «un 20 % más cara»; lo leo como recargo sobre la tarifa de cada sala: Norte 48 €/h y Sur 30 €/h en esa franja.
4. **Límites de la franja: 8:00 incluida, 14:00 excluida** — «de 8 a 14 h» es la franja `8-14`; una reserva `14-15` no lleva recargo.
5. **Una reserva que cruza el límite se cobra por tramos** — cada hora, o fracción, a su tarifa (`13-15` en Norte = 1 h a 48 + 1 h a 40). Cobrar toda la reserva a una sola tarifa favorecería a uno de los dos lados sin motivo.
6. **El recargo vale todos los días, sin distinguir festivos ni fines de semana** — el cliente no lo limitó.
7. **Se cobra por la fecha de la reserva, no por la de la factura** — no hay facturas emitidas todavía (0022 sin hacer), así que no hay nada que recalcular.
8. **`data/rates.csv` no está en el repo** — el walkthrough de 0021 dice que existe (Norte 40, Sur 25), pero no hay fichero ni código de tarifas. Lo creo aquí con esos valores y una función de precio; lo dejo como ruling a revisar, porque 0021 figura ✅.
9. **Factura quincenal (para 0022, solo documentada)** — se emite el 1 y el 16: el 16 cubre las reservas del 1 al 15 y el 1 cubre las del 16 al último día del mes anterior. El bloqueo por impago (0023) no cambia: sigue contando 30 días desde la emisión de cada factura.
10. **Ejemplo de la propuesta reescrito** — el de 170 € (3 h Norte + 2 h Sur) ya no vale, porque no dice a qué hora fueron. Lo sustituyo por Norte 10-13 (144 €) + Sur 15-17 (50 €) = 194 €, factura del 16 si son del 1 al 15.

## Intent

Hoy toda hora de sala cuesta lo mismo a cualquier hora y la propuesta 0020 prevé una factura mensual. El cliente cambia dos reglas: de 8 a 14 h la hora es un 20 % más cara, y la factura pasa a ser quincenal (el 1 y el 16). Hay que fijar la regla de precio antes de que la 0022 la use, y dejar la propuesta y el roadmap al día.

## Scope

- Entra: precio de una reserva (sala + franja) con el recargo de 8 a 14 h; `data/rates.csv` con las tarifas base; capacidad `billing`; propuesta 0020 y roadmap (fila 0022, fila nueva 0024) corregidos a factura quincenal.
- No entra: emitir facturas (0022), bloqueo por impago (0023), validar el formato de la franja (0012), festivos o fines de semana, tarifas por cliente.

## Approach

Una función de precio que, dada una sala y una franja `<inicio>-<fin>`, reparte las horas entre la franja de recargo (8–14) y el resto, y suma cada tramo a su tarifa. Las tarifas base salen de `data/rates.csv`; el 20 % y los límites 8 y 14 son reglas de la capacidad, no columnas por sala. El cómo, en `plan.md`.

## Delta de comportamiento

### Capacidad: `billing`

**ADDED — Tarifa base por sala**
- GIVEN Norte a 40 €/h y Sur a 25 €/h en `data/rates.csv`
- WHEN se calcula el precio de Sur `15-17`
- THEN el precio es 50 € (2 h × 25 €)

**ADDED — Recargo del 20 % de 8 a 14 h**
- GIVEN Norte a 40 €/h y Sur a 25 €/h
- WHEN se calcula el precio de Norte `10-12`
- THEN el precio es 96 € (2 h × 48 €)
- AND Sur `8-9` cuesta 30 € y Sur `14-15` cuesta 25 €

**ADDED — Reserva que cruza el límite de la franja de recargo**
- GIVEN Norte a 40 €/h
- WHEN se calcula el precio de Norte `13-15`
- THEN el precio es 88 € (1 h × 48 € + 1 h × 40 €)
- AND Sur `7-9` cuesta 55 € (1 h × 25 € + 1 h × 30 €)

**Reglas de la capacidad**
- **Dónde viven los datos**: tarifa base por sala en `data/rates.csv`.
- **Recargo**: 20 % sobre la tarifa base, de 8:00 (incluida) a 14:00 (excluida), todos los días.
- **Regla ante conflicto**: una reserva que cruza un límite se cobra por tramos, cada uno a su tarifa.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |

---
id: 20260924-232313-task-0024-peak-hour-rate
task: 0024
title: Recargo de franja horaria en la tarifa
mode: full
profile: delegate
status: draft
created: 2026-09-25
author: Claude
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Recargo de franja horaria en la tarifa

## Decisiones que he tomado yo — valida estas

> Petición del cliente, sin nadie a quien preguntar. Modo full: cambia una regla de negocio de la propuesta 0020 y su tarifa ya entregada (0021). Review de spec: ninguna (una capacidad, dos requisitos); el repaso de coherencia lo he hecho yo.

1. **Se parte en dos tasks.** Esta (0024) es solo el recargo por franja; la factura quincenal se queda en 0022, que aún no ha empezado, con su fila y la propuesta actualizadas. Motivo: 0021 ya está cerrada y 0022 no existe en código; mezclar tarifa y facturación en una task crecería más de 3 tasks internas.
2. **Orden: 0024 antes de 0022** (0022 pasa a «tras 0024»), porque la factura debe consumir la tarifa ya con recargo.
3. **La franja es 08:00 incluida a 14:00 excluida** — «de 8 a 14 h» leído como el formato `8-14` de las franjas de reserva.
4. **Recargo del 20 % sobre la tarifa de la sala** (Norte 48 €/h, Sur 30 €/h en franja); fuera de ella, la tarifa vigente de 0021.
5. **Una reserva que cruza el límite se cobra por horas**: cada hora a su tarifa (`13-15` en Norte = 48 + 40 = 88 €). Es lo más justo y evita un umbral arbitrario.
6. **Aplica todos los días**, incluidos fines de semana, porque el cliente no distingue.
7. **Capacidad `billing`**, ya declarada en la propuesta 0020; es su primer requisito, porque `capabilities/` aún no existe.
8. **Solo cambia el precio de reservas de clientes externos.** El uso interno no factura, y `salas informe` (horas por sala) no cambia.
9. **Facturación quincenal (para 0022):** facturas el día 1 (reservas del 16 al fin del mes anterior) y el 16 (reservas del 1 al 15). El impago de 30 días se cuenta desde la emisión de cada factura. Ya está en la propuesta y en la fila 0022, pendiente de tu validación.
10. **Pendiente que detecto:** 0021 está ✅ y su walkthrough cita `data/rates.csv`, pero ese fichero no está en el repo ni hay código de tarifas. No lo arreglo aquí; el plan de esta task lo tratará como punto de partida a verificar, no a dar por hecho.

## Intent

Hoy la tarifa depende solo de la sala (Norte 40 €/h, Sur 25 €/h). El cliente ha cambiado el acuerdo: de 8 a 14 h la hora cuesta un 20 % más. Sin este recargo la factura infravalora las reservas de mañana y no coincide con lo pactado.

## Scope

- Entra: recargo del 20 % en la franja 8-14 h; cálculo por horas cuando la reserva cruza el límite; actualizar propuesta 0020 y roadmap (0022 quincenal, tras 0024).
- No entra: la factura quincenal en sí (0022), el bloqueo por impago (0023), tarifas distintas por cliente, festivos o fines de semana.

## Approach

La tarifa pasa a calcularse por hora: tarifa de la sala, multiplicada por 1,2 si la hora cae en [8, 14). El coste de una reserva es la suma de sus horas. El cómo (dónde vive el porcentaje y la franja, cómo se lee `rates.csv`) es contenido del plan.

## Delta de comportamiento

### Capacidad: `billing`

**ADDED — Recargo de franja horaria**
- GIVEN tarifa Norte 40 €/h y Sur 25 €/h
- WHEN se calcula el coste de una hora en Norte entre las 8:00 y las 14:00
- THEN cuesta 48 € (40 × 1,2)
- AND en Sur, 30 € (25 × 1,2)

**ADDED — Hora fuera de franja**
- GIVEN tarifa Norte 40 €/h
- WHEN se calcula el coste de la hora de las 14:00 a las 15:00 o de las 7:00 a las 8:00 en Norte
- THEN cuesta 40 €, sin recargo

**ADDED — Reserva a caballo de la franja**
- GIVEN tarifa Norte 40 €/h
- WHEN se calcula el coste de una reserva `13-15` en Norte
- THEN cuesta 88 € (13-14 con recargo, 48 €, más 14-15 sin él, 40 €)

**ADDED — Reserva de mañana completa**
- GIVEN Acme reserva Norte 3 h (`9-12`) y Sur 2 h (`12-14`) en un día
- WHEN se calcula el coste
- THEN Norte 144 € (3 × 48) y Sur 60 € (2 × 30): 204 €

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |

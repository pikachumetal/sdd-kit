---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Al cancelar una reserva, quien cancela elige un motivo de una lista: cambio de planes, sala ocupada u otro. Por ejemplo, al cancelar la sala Norte del lunes con «sala ocupada», la respuesta es «cancelada Norte lun (sala ocupada)». Un motivo que no está en la lista se rechaza, y la respuesta enseña los motivos válidos. Un comando nuevo lista las reservas canceladas: «Norte lun — sala ocupada — Ana».

## Capacidades

- Nuevas: `bookings` — cancelar pide un motivo y el listado de canceladas lo enseña.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`bookings`), MODIFIED (la respuesta de `cancelar`), datos (motivo y quién canceló) · tamaño: ~40 líneas en 2 ficheros
- Mínimo razonable: ninguna — deja sin segunda lectura los huecos sin resolver de abajo, que ya están a la vista

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista; falta su frase literal para pasarlo a «Decisiones tomadas con el dev-lead».
2. El listado de canceladas enseña sala, día, motivo y quién canceló — la petición habla de «saber quién y por qué»; el roadmap solo pide el motivo.
3. Sin review de spec: tres señales, por debajo de las cuatro de la rúbrica. Corrige el «dos señales (MODIFIED, datos)» anterior.
4. Capacidad nueva `bookings`, antes declarada como modificada: no existe en `capabilities/` y `sdd capability merge` la rechazaba.
5. Opción y comando: `--motivo <motivo>` y `canceladas`.
6. Textos: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro» y «Norte lun — sala ocupada — Ana».
- Prueba del delta en una copia: `bookings.md: añadido «Cancelar pide un motivo de la lista»` · `bookings.md: añadido «El listado de canceladas enseña el motivo y quién canceló»`
- Política de modelos: revisores de la spec: ninguno · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Sin resolver

- Quién canceló: ni `cancelar` recibe una persona ni la reserva guarda un nombre; el GIVEN «cancelada por Ana» no tiene de dónde salir.
- Conservar las canceladas: las reservas viven en memoria y cada comando arranca de cero, así que `canceladas` no vería desde la terminal lo cancelado con un `cancelar` anterior.
- `cancelar` sin `--motivo`: no hay escenario ni texto, y hoy `test/cancel.test.js` espera «cancelada Norte lun».
- `canceladas` sin ninguna cancelada: no hay escenario ni texto.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`; comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta «cancelada Norte lun» → «cancelada Norte lun (sala ocupada)» | `src/app.js:17`, `test/cancel.test.js:6` | delta, «Cancelar pide un motivo de la lista»; sin `MODIFIED` porque la capacidad aún no tiene fichero |

- Filas que implementa: 0010 → solo `.docs/sdd/roadmap.md:7`: comprobado buscando `0010` en el repo

## Approach

El motivo se guarda con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo: por el comando `cancelar`, como `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar pide un motivo de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada por Ana con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

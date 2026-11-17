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

🦆 Al cancelar una reserva, ahora hay que decir por qué: `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)». El motivo se elige de una lista de tres. Una orden nueva, `canceladas`, enseña cada cancelación con su motivo y su autor: «Norte lun — sala ocupada — Ana». Para que esa lista exista, las reservas se guardan en un fichero entre una orden y la siguiente, porque hoy se pierden al terminar cada orden.

Validación: dev-lead — es una orden que usa una persona.

## Capacidades

- Nuevas: `bookings` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`bookings`), datos (motivo, autor y reservas guardadas en fichero) · tamaño: ~60 líneas en 4 ficheros
- Mínimo razonable: ninguna — deja sin segunda lectura las decisiones 1 a 6, que validas tú aquí

1. Las reservas se guardan en un fichero entre órdenes — hoy viven en memoria y cada orden es un proceso nuevo, así que `canceladas` nunca vería una cancelación hecha en una orden anterior. Añadido en el repaso; es lo que más amplía la feature.
2. El autor de la cancelación es el usuario de la sesión del sistema; sin él, «desconocido» — hoy ni las reservas ni `cancelar` llevan nombre de persona, y así no cambia la orden acordada. Añadido en el repaso.
3. El listado de canceladas enseña sala, día, motivo y quién canceló, sin la franja, con el texto «Norte lun — sala ocupada — Ana» — la petición habla de «saber quién y por qué»; la fila 0010 del roadmap solo nombra el motivo.
4. `--motivo` es obligatorio: sin él responde igual que con un motivo fuera de lista, y el motivo se comprueba antes de buscar la reserva — la spec no decía qué pasaba sin él. Añadido en el repaso.
5. Textos: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro» y, sin canceladas, «sin canceladas».
6. La capacidad `bookings` es nueva, no modificada: el proyecto aún no tiene `capabilities/`. Corregido en el repaso porque la fusión la rechazaba.
7. Sin review de spec: dos señales, por debajo del umbral. Antes decía «MODIFIED, datos»; sin capacidad previa no hay `MODIFIED`.

- Ensayo de fusión en una copia: correcto; `bookings.md` con 2 requisitos añadidos y 5 reglas. Antes del repaso, rechazado: «bookings» no tenía fichero en `capabilities/` ni estaba en «Nuevas».
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido en la entrevista; la frase literal no quedó registrada.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`; comando `canceladas`; guardar las reservas en un fichero entre órdenes; actualizar `operations.md` y los tests de cancelar que usan la forma antigua.
- No entra: anulaciones del responsable de sala (0011); nombre de persona en las reservas activas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta «cancelada <sala> <día>» y `cancelar` sin motivo | `src/app.js:17`, `src/app.js:30`, `test/cancel.test.js:6` | Scope y delta, decisiones 4 y 5 |
| «las reservas viven en memoria» | `.docs/sdd/operations.md:14` | Scope, decisión 1 |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md:7`; su estado lo lleva el flujo de la feature.

## Approach

El motivo y el autor se guardan con la reserva cancelada; `canceladas` lista las reservas con estado cancelada, así que las anuladas no salen.

## Dónde se prueba

- Motivo: por el comando `cancelar`, como `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.
- Guardado entre órdenes y autor: lanzando dos órdenes como procesos separados, en `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: guardar las reservas en fichero — alternativa descartada: seguir en memoria, con la que `canceladas` saldría siempre vacío

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar pide un motivo de la lista

- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista, o ninguno, responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa
- AND `cancelar Sur mar --motivo otro`, sin reserva ese día, responde «sin reserva Sur mar»

#### ADDED — El listado de canceladas enseña el motivo y quién canceló

- GIVEN la reserva de Norte del lunes cancelada en una orden anterior por el usuario de sesión Ana con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»
- AND sin usuario de sesión, el autor sale como «desconocido»
- AND sin ninguna reserva cancelada responde «sin canceladas»

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en un fichero local, entre órdenes.
- **Idioma de los nombres**: no aplica.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: no aplica.

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

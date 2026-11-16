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

🦆 Quien cancela una reserva dice ahora por qué y quién es, y otro comando enseña las cancelaciones. Por ejemplo, Ana cancela la sala Norte del lunes porque está ocupada, y el listado enseña «Norte lun — sala ocupada — Ana». El motivo sale de una lista cerrada: cambio de planes, sala ocupada u otro. Cancelar sin motivo o sin nombre ya no cancela, y responde qué falta. Las reservas siguen en memoria, así que el listado solo enseña lo cancelado en la misma ejecución del programa.

Validación: dev-lead — es un comando que usa una persona.

## Capacidades

- Nuevas: `bookings` — cancelar con motivo y listado de canceladas; es la primera capacidad escrita del proyecto.

## ✋ Decisiones que he tomado yo — valida estas

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista.
2. El listado de canceladas enseña sala, día, motivo y quién canceló — la petición habla de «saber quién y por qué».
3. Sin review de spec: dos señales (capacidad nueva, datos), por debajo de las cuatro de la rúbrica. Corregido: decía MODIFIED, pero no hay requisito vivo que modificar.
4. Capacidad nueva `bookings`: corregido, decía «Modificadas», y `sdd capability merge` lo rechazaba porque `capabilities/` no existe.
5. Quién cancela se indica con `--por <nombre>`: la reserva no guarda titular y el programa no tiene login, así que «Ana» no tenía de dónde salir. Sin `--por` responde «falta quién cancela: usa --por».
6. Sin `--motivo` responde el mismo aviso que un motivo fuera de la lista: «motivo no válido: cambio de planes, sala ocupada, otro». La reserva sigue activa en ambos casos.
7. Sin reserva sigue respondiendo «sin reserva <sala> <día>», aunque falten `--motivo` o `--por`: se comprueba primero la reserva, y el test actual se mantiene.
8. Sin canceladas, `canceladas` responde «sin canceladas».
9. El formato de línea es «<sala> <día> — <motivo> — <quién>», una línea por cancelación, en el orden en que se cancelaron.
10. El motivo y quién canceló viven en memoria, como las reservas (`operations.md`). Consecuencia: cada ejecución de `node src/app.js` arranca de cero, así que `cancelar` y después `canceladas` como dos órdenes de terminal da «sin canceladas». El escenario solo se cumple dentro de un mismo proceso, como en los tests. Guardar a disco queda fuera por no ampliar lo pedido.
11. `canceladas` no lista las anulaciones del responsable de sala, que tienen otro estado.
- `sdd capability merge` sobre una copia: pasa; crea `bookings.md` con 2 requisitos y 5 reglas.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo> --por <nombre>`; comando `canceladas`; actualizar `test/cancel.test.js` a la respuesta nueva.
- No entra: anulaciones del responsable de sala (0011); guardar las reservas a disco.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta «cancelada <sala> <día>» → «cancelada <sala> <día> (<motivo>)» | `src/app.js:17`, `test/cancel.test.js:6` | Scope y delta, `ADDED` (no hay capacidad viva) |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:30`, `test/cancel.test.js:6` | Decisión 6 y delta |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md` (su fila, la actualiza el cierre).

## Approach

El motivo y quién canceló se guardan con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo y quién: por el comando `cancelar`, como `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar pide un motivo de la lista y quién cancela

- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista, o ningún motivo, responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa
- AND sin `--por` responde «falta quién cancela: usa --por» y la reserva sigue activa
- AND sin reserva en esa sala y día responde «sin reserva <sala> <día>»

#### ADDED — El listado de canceladas enseña el motivo y quién canceló

- GIVEN la reserva de Norte del lunes cancelada por Ana con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»
- AND sin ninguna cancelación responde «sin canceladas»
- AND una reserva anulada por el responsable de sala no aparece

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, durante la ejecución del programa
- **Idioma de los nombres**: castellano en los textos de la interfaz (constitution, 4)
- **Límites**: no aplica
- **Avisos**: «motivo no válido: cambio de planes, sala ocupada, otro»; «falta quién cancela: usa --por»
- **Regla ante conflicto**: no aplica

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
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

# Spec — Anular reservas de otros

## Capacidades

- Nuevas: `bookings` — anular reservas y listar las anuladas: solo el responsable de sala anula, sobre reservas de cualquiera, y guarda quién anuló; `anuladas` muestra quién anuló solo al responsable.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores (dominio y técnica, ambos en Sonnet) — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular` y `anuladas`) · tamaño: ~60 líneas en 3 ficheros
- Dominio: que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica: que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. **El rol no se verifica**: cualquiera puede escribir `--como responsable`. Es una separación de uso, no una barrera de seguridad.
2. `--como` es obligatorio en `anular`. Sin él, o con otro valor, responde `indica --como cliente o --como responsable` y no cambia nada. Esto rompe el uso actual de `anular` sin flag; lo he elegido para que no haya un rol por defecto que se salte el permiso.
3. El cliente no puede anular ninguna reserva, tampoco la suya. Hoy podía; se retira a propósito.
4. Quién anuló se guarda como el **rol** (`responsable`), en un campo `anuladaPor` junto al estado de la reserva. Hoy solo el responsable puede anular, así que el valor siempre es ese; se guarda igualmente para no tener que migrar si entra otro rol. Dónde vive el campo en el almacén lo fija el plan tras leer el código.
5. `anuladas` también recibe `--como`; sin él, o con `cliente`, no muestra quién anuló. Con `responsable`, sí. Un valor distinto responde como en la decisión 2.
6. Las reservas anuladas antes de este cambio no tienen autor: `anuladas --como responsable` las lista sin sufijo (`Norte lun — anulada`).
7. Anular una reserva ya anulada responde `ya anulada` y conserva el primer autor. Sobre reservas inexistentes y sobre `cancelar` no cambia nada: queda como hoy.
8. Los valores de `--como` y las etiquetas de salida son literales en castellano, sin alias en inglés. Reglas de la capacidad: datos en la reserva (decisión 4) · idioma castellano (8) · límites: `cliente|responsable` · avisos: los literales de los escenarios · conflicto: se conserva el primer autor (7).
9. `bookings` no tiene fichero en `capabilities/`, así que la declaro capacidad **nueva** y sus dos requisitos van como ADDED: el comportamiento previo de `anular` (cualquiera anula) no está escrito en ninguna capacidad y esta spec lo sustituye. El merge sobre una copia lo exige así.
10. La constitution no trae «Reglas de producto» de las que tomar valores; los de arriba son míos.
11. Prueba del delta en una copia temporal de `.docs/sdd` (`sdd capability merge`): `bookings.md: añadido «Anular una reserva»` y `bookings.md: añadido «Listar reservas anuladas con su autor»`. El `capabilities/` del repo no se ha tocado.
12. Política de modelos: revisores de spec, dominio y técnica, en Sonnet con effort medium (elegido por el dev-lead en el arranque).

### Hallazgos de la review

- **Aceptado** — La capacidad `bookings` no existe en `capabilities/` (dominio 1, técnica 10) → el delta escribe el requisito completo, no un parche, y la decisión 4 no presupone un almacén.
- **Aceptado** — El MODIFIED mezcla `anular` y `anuladas` (dominio 2, técnica 1) → dos requisitos, ambos ADDED (decisión 9), cada uno con escenarios propios.
- **Aceptado** — Intent y Scope no cubren el listado con autor ni las anuladas antiguas (dominio 3, técnica 6) → Intent y Scope actualizados; decisión 6.
- **Aceptado** — Faltaba lo prohibido a cada rol (dominio 4) → tabla rol × acción en el delta y un escenario por prohibición; decisión 3.
- **Aceptado** — `--como` ausente, inválido y no verificado (dominio 5, técnica 2 y 3) → decisiones 1 y 2 y escenarios.
- **Aceptado** — Faltaban las cinco reglas (dominio 6) → decisión 8.
- **Aceptado** — Reserva ya anulada y autor pisado (dominio 7, técnica 2) → decisión 7 y escenario.
- **Aceptado** — Idioma de los valores (dominio 8) → decisión 8.
- **Aceptado** — Formato de `anuladas` y el sufijo (técnica 5) → el sufijo solo se añade si hay autor y solo para el responsable; ADDED con sus escenarios. El formato anterior (`<sala> <día> — anulada`) se mantiene tal cual para el resto de casos; no he leído el código para confirmarlo, queda para la task 1 del plan.
- **Aceptado** — Un único valor posible para el autor (técnica 7) → decisión 4.
- **Aceptado** — Interacción con `cancelar` (técnica 8) → decisión 7: queda como hoy y sus anulaciones salen sin sufijo.
- **Aceptado** — `anuladas` sin fichero de test (técnica 9) → en «Dónde se prueba».
- **Rechazado** — El bloque de review mezcla proceso con decisiones (técnica 4) → es la forma que fija `review-spec.md`; sí se cambió el fondo (sufijo, ver arriba).
- **Rechazado** — «Laura» es una persona concreta (dominio 9) → es el nombre del aprobador, no un ejemplo; los ejemplos (Norte, lun, Ana) son inventados.
- **Rechazado** — Convención de nombres de fichero (dominio 10) → la constitution no la fija; se sigue `test/cancel.test.js`, como ya dice la spec.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros y ver quién anuló; el cliente no puede anular ni ver quién anuló.

## Scope

- Entra: `anular` con `--como`, y `anuladas` con `--como` y el autor de la anulación.
- No entra: `cancelar`, reservas inexistentes, reservas anuladas antes del cambio (se listan sin autor).

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- Listado: por `run('anuladas', …)`, en `test/anuladas.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

| Rol | anular | ver `anuladas` | ver quién anuló |
| --- | --- | --- | --- |
| responsable | permitido, sobre cualquier reserva | sí | sí |
| cliente | prohibido, también la suya | sí | no |

**ADDED — Anular una reserva**

Solo el responsable de sala puede anular una reserva, de cualquier persona, y se guarda quién la anuló.

Escenario: el responsable anula
- GIVEN la reserva de Norte del lun, de Ana, activa
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada con `anuladaPor` = `responsable`

Escenario: el cliente no puede anular
- GIVEN la reserva de Norte del lun, de Ana, activa
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

Escenario: sin rol o con rol desconocido
- GIVEN la reserva de Norte del lun, de Ana, activa
- WHEN `anular Norte lun` o `anular Norte lun --como admin`
- THEN responde `indica --como cliente o --como responsable` y la reserva sigue activa

Escenario: reserva ya anulada
- GIVEN la reserva de Norte del lun anulada por `responsable`
- WHEN `anular Norte lun --como responsable`
- THEN responde `ya anulada` y la reserva conserva su primer autor

**ADDED — Listar reservas anuladas con su autor**

`anuladas` recibe `--como`; quién anuló lo ve solo el responsable.

Escenario: el responsable ve quién anuló
- GIVEN la reserva de Norte del lun anulada por `responsable`
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`

Escenario: el cliente no ve quién anuló
- GIVEN la reserva de Norte del lun anulada por `responsable`
- WHEN `anuladas --como cliente` o `anuladas` sin `--como`
- THEN lista `Norte lun — anulada`

Escenario: anulada antes del cambio
- GIVEN la reserva de Norte del mar anulada antes de este cambio, sin autor
- WHEN `anuladas --como responsable`
- THEN lista `Norte mar — anulada`

Escenario: rol desconocido en el listado
- GIVEN cualquier estado
- WHEN `anuladas --como admin`
- THEN responde `indica --como cliente o --como responsable`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

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

Validación: dev-lead — lo usa una persona desde la línea de comandos y decide qué ve cada rol.

## Capacidades

- Nuevas: `bookings` — anular una reserva (solo el responsable de sala) y listar las anuladas, con quién las anuló según el rol que consulta.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (la salida de `anular` y el nuevo `anuladas`), reglas de visibilidad o permiso (quién anula y quién ve), datos (quién anuló), capacidad nueva (`bookings`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): qué NO puede hacer ni ver el cliente, en concreto si `anuladas --como cliente` enseña quién anuló (señal: permiso)
- Técnica (sonnet): que la salida actual de `anular` y de `anuladas` no rompa lo que ya imprime la app, y qué pasa con `--como` ausente o desconocido (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. Capacidad nueva `bookings` (slug en inglés, kebab-case, como pide el kit): ninguna capacidad describe hoy las reservas, así que el delta es `ADDED`, no `MODIFIED`. Solo cubre `anular` y `anuladas`; `libres`, `reservar` y `cancelar` quedan fuera. El slug es un nombre de fichero, no sale en la interfaz; PRODUCT dice «Evitar: booking» para el texto, y si prefieres `reservas`, es un cambio de nombre.
2. Enfoque: `--como <cliente|responsable>` en la propia orden (ver Approach), frente a una variable de entorno o a un fichero de usuarios.
3. El rol sale de `--como <cliente|responsable>`: PRODUCT define la reserva «a nombre de quien la pide», pero la app hoy no guarda ese nombre y no tiene usuarios ni sesión, así que nadie puede demostrar quién es. Ninguna salida muestra nombres.
4. Sin `--como`, se trata como `cliente` (lo más restrictivo). Cambia lo de hoy, donde cualquiera anula; es un cambio incompatible con quien llame hoy a `anular` sin rol (no hay tests de `anular` que rompa).
5. `--como` con otro valor, o sin valor, responde `rol desconocido: usa cliente o responsable` y no cambia nada. Se escribe en minúsculas; `Responsable` es desconocido. `--como` va tras la sala y el día; `--como` antes de la sala o argumentos sobrantes quedan fuera de alcance. Lo mismo vale para `anuladas`: `--como admin` o sin valor responde `rol desconocido: usa cliente o responsable`.
6. Orden de comprobación en `anular`: primero el rol (desconocido), luego el permiso (cliente), luego que la reserva exista. Sin reserva activa responde `sin reserva <sala> <día>` (lo que ya imprime hoy, también para una ya anulada o cancelada). `cancelar` sobre una ya anulada responde también `sin reserva` y no cambia su estado: es lo que hace hoy, no se toca. `libres` no cambia: una franja anulada ya queda libre hoy.
7. Sin identidad no hay «reservas propias»: el cliente no anula ninguna; para quitar la suya tiene `cancelar`, que no cambia. El responsable anula cualquiera, también las suyas; `cancelar` no se toca para nadie.
8. «Responsable de cada sala» se simplifica a un rol único: la app no sabe qué sala lleva quién.
9. `anuladas` también acepta `--como`: el responsable ve `<sala> <día> — anulada por responsable`; el cliente, y quien no pone `--como`, ve `<sala> <día> — anulada`, sin quién. Qué NO ve el cliente: quién anuló. Una cancelación no sale en `anuladas`. Orden: el de las reservas. Sin ninguna anulada responde `sin anuladas`.
10. Literal de rechazo: `solo el responsable de sala puede anular`.
11. El rol con el que se anula se guarda en la propia reserva (`voidedBy`), en memoria como el resto: las reservas viven en memoria (`operations.md`), así que por la línea de comandos `anuladas` solo ve lo anulado en el mismo proceso; se prueba por `run`. Lo heredado, no lo resuelvo aquí.
12. Las cinco reglas: datos en la reserva, en memoria · nombres y textos en castellano · límites: ninguno (sin tope en `anuladas`) · avisos: ninguno al dueño · conflicto: el orden de la decisión 6 y, con varias reservas de la sala y el día, la primera activa (no hay franja como argumento, como `cancelar`); anular una deja la otra activa. Plazo: ninguno; la anulación es «por cualquier motivo» (PRODUCT), a diferencia de la cancelación, que tiene 24 h.
13. Cómo se observa el estado en los tests: «queda anulada» con `anuladas --como responsable`, y «sigue activa» con que `anuladas --como responsable` no la lista. Las reservas de Sur del mar del segundo escenario las crea el propio test (hoy solo existe Norte lun); el plan decide cómo.
14. Política de modelos: revisores de la spec: dominio opus, técnica sonnet, y una segunda ronda con un revisor sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Pasada de coherencia: `sdd capability merge` sobre una copia rechazaba el delta («`bookings` no tiene fichero… ni la declara en “Nuevas”»); corregido declarándola en «Nuevas» y pasando el requisito a `ADDED`. Repetido tras integrar las dos rondas de review: `bookings.md: añadido «Anular una reserva»` y `bookings.md: añadido «Listar las anuladas»`, sin errores. `git grep` de `0011` y de `anular` fuera de la spec: solo la fila del roadmap y `src/app.js`; nada se retira.

### Hallazgos de la review

- **Aceptado** (Crítico, dominio) — `anuladas` no decía qué ve el cliente → decisión 9 y escenarios con `--como cliente` y sin `--como`.
- **Aceptado** — premisa «la app no tiene usuarios» frente a la reserva a nombre de alguien → decisión 3.
- **Aceptado** — el Intent prometía «quién anuló» y solo se guarda el rol → Intent rebajado a «con qué rol» y la identidad individual a «No entra».
- **Aceptado** — anti-objetivo `cancelar` sin escenario → escenario de que una cancelación no sale en `anuladas` y `cancelar` no cambia.
- **Aceptado** — sin regla para reserva inexistente, ya anulada o cancelada, ni varias en la misma sala y día → decisiones 6 y 12 y un escenario.
- **Rechazado** — renombrar `bookings` a `reservas` → el slug de capacidad en inglés es regla del kit y no sale en la interfaz; queda avisado en la decisión 1.
- **Aceptado** — dónde vive el dato y ciclo de vida → decisión 11.
- **Aceptado** — límites, avisos y plazo sin declarar → decisión 12.
- **Aceptado** — qué no puede hacer el responsable → decisión 7.
- **Aceptado** — fixture «de Ana» → el GIVEN ya no lleva nombre de persona.
- **Aceptado** (técnica) — «queda anulada»/«sigue activa» sin observación, orden de validación, `--como` ambiguo, dos anuladas para probar orden, `--como` en `anuladas`, regresión de `cancelar`, dónde se prueba → decisiones 5, 6, 9, 13, escenarios y «Dónde se prueba».
- **Aceptado** (ronda 2, sin Críticos) — cambio incompatible sin `--como` → Scope y escenario propio; «sigue activa» débil → comprobación con `anular` posterior; orden de creación en el GIVEN; `cancelar` sobre anulada y `libres` → decisión 6; dos reservas misma sala y día → escenario; `--como` antes de la sala y `anuladas --como admin` → decisión 5 y escenario; `voidedBy` → Scope.
- **Rechazado** (ronda 2) — escenario con reserva «de otro» y mostrar su nombre → la app no guarda nombre de reserva; decisión 3 corregida, ninguna salida muestra nombres.
- **Rechazado** (ronda 2) — «PRODUCT.md no existe» → está en la raíz del repo, no en `steering/`; las citas son correctas.
- **Aceptado** — el punto de la pasada de coherencia no es una decisión → pasa a nota fuera de la lista.

### Decisiones tomadas con el dev-lead

- Ninguna: la fila 0011 del roadmap no trae «Decisiones ya tomadas» y la spec no está aprobada por delegación.

## Intent

Hoy cualquiera anula cualquier reserva (`anular Norte lun` basta) y no queda rastro de con qué rol se hizo. El responsable de sala debe poder anular las de otros, y el cliente no. Éxito: `anular` solo funciona con `--como responsable`, y `anuladas` dice con qué rol se anuló a quien consulta como responsable. Anti-objetivo: que el cliente anule algo, que el cliente vea quién anuló, o que el cambio rompa `cancelar`.

## Scope

- Entra: `anular` con `--como` (con el cambio incompatible de que sin `--como` ya no anula), y el nuevo listado `anuladas` con quién anuló según el rol. Ficheros: `src/app.js` (la función `voidBooking`, el campo nuevo `voidedBy` de la reserva, el parseo de `--como` y `anuladas` en `run`) y `test/anular.test.js` (nuevo).
- No entra: `cancelar`, `libres`, `reservar`, autenticación real, responsable por sala, saber qué persona concreta anuló, franja como argumento.

## Approach

- A. `--como` en la orden: sin infraestructura, probable por `run('anular', …)`. Se puede teclear a mano, y por eso protege la intención, no a un usuario malicioso.
- B. Variable de entorno `SALAS_ROL`: el rol no se ve en la orden, y los tests tocan el entorno global.
- C. Fichero de usuarios: lo correcto con identidad real, pero la app no tiene usuarios y es mucho más que lo pedido.
- Elegido: A, porque es lo único que cabe sin usuarios.

## Dónde se prueba

- Anular y `anuladas`: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`. Gate: `node --test && node scripts/lint.mjs`, con `test/cancel.test.js` en verde.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva**
- GIVEN una reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y `anuladas --como responsable` la lista
- AND con `--como cliente` responde `solo el responsable de sala puede anular`, `anuladas --como responsable` responde `sin anuladas` y después `anular Norte lun --como responsable` responde `anulada Norte lun` (seguía activa)
- AND sin `--como` responde `solo el responsable de sala puede anular`
- AND con `--como admin`, o `--como` sin valor, responde `rol desconocido: usa cliente o responsable` y no cambia nada
- AND `anular Norte lun --como admin` sobre una reserva inexistente responde `rol desconocido: usa cliente o responsable`, y con `--como responsable` responde `sin reserva Norte lun`
- AND anular otra vez la ya anulada, o una cancelada con `cancelar`, con `--como responsable`, responde `sin reserva Norte lun`
- AND con dos reservas activas de Norte del lun, `anular Norte lun --como responsable` anula la primera y repetirlo anula la otra

**ADDED — Listar las anuladas**
- GIVEN la reserva de Norte del lun, creada primero, y la de Sur del mar, creada después, anuladas en ese orden con `--como responsable`
- WHEN `anuladas --como responsable`
- THEN responde las dos líneas, `Norte lun — anulada por responsable` y `Sur mar — anulada por responsable`, en el orden de las reservas
- AND con `--como cliente`, o sin `--como`, responde `Norte lun — anulada` y `Sur mar — anulada`, sin quién anuló
- AND una reserva cancelada con `cancelar` no sale, y `cancelar` sigue respondiendo `cancelada <sala> <día>`
- AND con `--como admin`, o `--como` sin valor, responde `rol desconocido: usa cliente o responsable`
- AND sin ninguna anulada responde `sin anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

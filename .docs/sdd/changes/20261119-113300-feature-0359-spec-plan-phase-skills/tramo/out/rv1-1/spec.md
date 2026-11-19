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

- Nuevas: `bookings` — anular una reserva según el rol y listar las anuladas con el rol que anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva, reglas de visibilidad o permiso, datos (rol que anuló), contrato público (la salida de `anular` y el comando nuevo `anuladas`) · tamaño: ~70 líneas en 2 ficheros (`src/app.js`, `test/anular.test.js`)
- Dominio (opus): que el cliente no anule ni vea las anuladas, y qué NO hace el responsable (señal: permiso)
- Técnica (sonnet): que cada comportamiento de `anular` y `anuladas` tenga su escenario con salida literal y que no rompa lo que hoy devuelve `run` (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`, siempre como último argumento: la app no tiene usuarios. Es declarativo, no se verifica: cualquiera puede escribir `--como responsable`; limitación aceptada, la app es de un solo usuario (PRODUCT.md) y el flag simula los dos roles.
2. Capacidad nueva `bookings` (slug en inglés, kebab-case, regla de las capacidades): no hay `capabilities/` en el proyecto, así que no hay nada que modificar y el requisito entra como ADDED. El dev-lead aprueba el slug, aunque PRODUCT.md pide evitar «booking» en el texto: el slug es un identificador de fichero, no texto de producto.
3. `anuladas` es un comando nuevo y lista solo las reservas en estado `voided`, una línea cada una `<sala> <día> — anulada por <rol>`, en el orden en que se anularon; sin ninguna responde `sin anuladas`.
4. Cualquier valor de `--como` distinto de `responsable`, su ausencia o `--como` sin valor, se trata como `cliente`; hoy cualquiera anula sin rol, así que este cambio rompe esa llamada a propósito.
5. «Responsable de sala» es un único rol global, no uno por sala como dice la fila 0011 del ROADMAP («de cada sala»): la app no modela quién lleva cada sala.
6. Se guarda el rol que anuló, no una persona: no hay identidad, y por eso siempre será `responsable`; el dato existe para el día en que haya más roles. Es alcance especulativo: el dev-lead lo valida expresamente o lo recorta.
7. `anuladas` solo lo ve el responsable: con otro rol responde `solo el responsable de sala puede ver las anuladas`.
8. Textos literales míos y nuevos: `solo el responsable de sala puede anular`, `solo el responsable de sala puede ver las anuladas`, `sin anuladas`. Ya existen en el código y no cambian: `anulada <sala> <día>`, `sin reserva <sala> <día>` y el estado interno `voided`.
9. Una reserva activa por sala y día (como hoy: `anular` busca por sala y día, sin franja); la franja no entra en el comando ni en el listado, ni se enseña el titular.
10. La comprobación de permiso va antes que la de existencia: un cliente que anula una reserva inexistente recibe el rechazo por permiso, no `sin reserva`.
11. El estado vive en memoria y cada invocación de la terminal es un proceso nuevo: `anuladas` solo tiene sentido dentro de un mismo proceso (las pruebas llaman a `run`); hacerlo persistente queda fuera de esta feature. Es la limitación que ya tiene `anular` hoy.
12. No se puede volver a reservar un sala-día anulado ni hay comando que cree reservas (`reservar` no las guarda): ese caso queda fuera de alcance.
13. Un cliente con una reserva a menos de 24 h no puede cancelar ni anular desde esta feature: limitación aceptada, `cancelar` no cambia.
14. La fila 0011 del ROADMAP («de cada sala») se corrige al cerrar la feature para que diga «responsable de sala».
- Política de modelos: revisores de la spec con dominio en opus y técnico en sonnet (dos), y el de la segunda ronda en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`
- Coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` → `bookings.md: añadido` ×4 («Anular una reserva siendo responsable», «…sin ser responsable», «…que no está activa», «Listar las anuladas»), exit 0, repetido tras integrar la review. La primera pasada lo rechazaba con `MODIFIED` («bookings» sin fichero en capabilities/); corregido a `Nuevas` + `ADDED`. El repo no cambia.

### Hallazgos de la review

- **Aceptado** — técnico 1: un requisito agrupaba tres comportamientos → separado en cuatro requisitos con su GIVEN/WHEN/THEN.
- **Aceptado** — técnico 2: sin escenario para `--como` desconocido ni para `--como` antes de sala y día → decisión 1 (siempre último) y 4, y escenarios «Anular con un rol que no es responsable».
- **Aceptado** — técnico 3 y 8: `anuladas` sin escenarios de vacío, varias ni activas → escenarios con Sur mar y orden fijado en la decisión 3.
- **Aceptado** — técnico 4 y dominio 7 (límites): reserva inexistente o ya anulada y orden de comprobación → decisión 10 y escenarios.
- **Aceptado** — técnico 5: textos literales y estado fuera de ✋ → decisión 8.
- **Aceptado** — técnico 6: `test/app.test.js` no llama a `anular` (comprobado); sigue sin cambiar → Scope.
- **Aceptado** — técnico 7, dominio 3: contrato y dato sin declarar; solo se guarda el rol → decisiones 3 y 6, capacidad y Scope reescritos.
- **Aceptado** — dominio 2: ambigüedad por franja → decisión 9.
- **Aceptado** — dominio 4, técnico 10: «de otros» no es verificable → Intent reescrito («cualquier reserva»); decisión 6.
- **Aceptado** — dominio 5 y 6: qué ve el cliente y qué no hace el responsable → decisión 7, escenario de `anuladas` con cliente y «No entra».
- **Aceptado** — dominio 7 (cinco reglas): → sección «Reglas de la capacidad».
- **Aceptado** — dominio 8: el rol es declarativo → decisión 1.
- **Aceptado** — segunda ronda 1, 5, 6, 7, 8, 10: estado en memoria, sala-día anulado, textos existentes, `--como` sin valor, ROADMAP y cliente a menos de 24 h → decisiones 4, 8, 11 a 14.
- **Aceptado** — segunda ronda 2, 3, 4: orden de anulación, ruptura de la llamada sin rol y reserva cancelada → escenarios y Scope.
- **Aceptado** — segunda ronda 9: el rol guardado es especulativo → decisión 6 pide validación expresa del dev-lead.
- **Rechazado** — dominio 1 y técnico 9: cambiar el slug `bookings` por `reservas` → la regla 1 de las capacidades exige slug en inglés; queda en la decisión 2 para que el dev-lead lo valide.
- **Rechazado** — dominio 5 (el rechazo menciona `cancelar`): el texto del rechazo se queda corto y literal; `cancelar` no cambia.
- **Rechazado** — dominio 9: el nombre del dev-lead es el del frontmatter de partida; no es del alcance de esta spec.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular cualquier reserva, y el cliente no; y el responsable ve qué reservas se anularon.

## Scope

- Entra: `anular` con `--como` (cambia la llamada actual sin rol: ahora se rechaza) y guardar el rol que anuló (`voidBooking` y `run` en `src/app.js`), y el comando nuevo `anuladas` (`run` en `src/app.js`); la prueba en `test/anular.test.js` (nuevo).
- No entra: `cancelar` (`cancelBooking`), que sigue igual y sin rol; el responsable no usa `cancelar` en nombre de otros; la anulación no tiene límite de antelación (a diferencia de la cancelación de 24 h de PRODUCT.md). `test/app.test.js` y `test/cancel.test.js` no cambian: ninguno llama a `anular`.

## Reglas de la capacidad

- Dónde vive el dato: en la reserva en memoria (`status: voided` y el rol que anuló), como el resto del estado de `src/app.js`; no hay persistencia en disco.
- Idioma de los nombres: respuestas en castellano; `voided` es el identificador interno ya existente.
- Límites: sin franja en el comando (decisión 9); reserva inexistente o ya anulada → `sin reserva <sala> <día>`; `anuladas` sin ninguna → `sin anuladas`.
- Avisos: los tres textos literales de la decisión 8.
- Conflicto: el permiso se comprueba antes que la existencia (decisión 10); una reserva cancelada no está activa, así que `anular` responde `sin reserva`.

## Dónde se prueba

- Anular y `anuladas`: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva siendo responsable**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada, con `responsable` como rol que anuló

**ADDED — Anular una reserva sin ser responsable**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND con `--como admin`, o sin `--como`, responde lo mismo y la reserva sigue activa
- AND con `--como cliente` sobre una reserva que no existe (`anular Sur mar --como cliente`) responde también `solo el responsable de sala puede anular`

**ADDED — Anular una reserva que no está activa**
- GIVEN Sur mar sin reserva
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`
- AND con Sur mar ya anulada, o cancelada, responde lo mismo

**ADDED — Listar las anuladas**
- GIVEN Norte lun y Sur mar reservadas, se anula primero Sur mar y después Norte lun, ambas como responsable, y Sur mie sigue activa
- WHEN `anuladas --como responsable`
- THEN responde dos líneas, `Sur mar — anulada por responsable` y `Norte lun — anulada por responsable` en ese orden, y no aparece Sur mie
- AND sin ninguna anulada responde `sin anuladas`
- AND con `--como cliente`, o sin `--como`, responde `solo el responsable de sala puede ver las anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

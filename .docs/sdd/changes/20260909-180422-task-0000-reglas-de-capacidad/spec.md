---
id: 20260909-180422-task-0000-reglas-de-capacidad
task: 0000
title: Las cinco reglas que el agente decide al azar si nadie las escribe (T17)
mode: full
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Las cinco reglas que el agente decide al azar si nadie las escribe (T17)

> **Estado**: approved (2026-09-09, con review de dominio incorporada).
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: **un revisor, lente dominio** — señales: capacidad nueva (`onboarding`), área no explorada (`sdd-init-brownfield/references/generacion.md` solo leído en parte). **Activada por el dev-lead**; hallazgos al final del bloque.

1. **Modo full**, no lite: toca cuatro sitios (`funcional-template`, `spec-template`, `review-spec.md`, la entrevista de `sdd-init-*`); no cabe en un área.
2. **Las cinco familias, con nombre fijo**: *dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto*. Son las del experimento (13 de 51 fallos del brazo sin docs, todos ahí). No se añaden más.
3. **`funcional-template`**: sección opcional «Reglas de la capacidad» bajo los requisitos, con las cinco entradas por nombre y «no aplica» permitido. Vacía no molesta; presente obliga a decidir.
4. **`spec-template`**: en el delta, subsección opcional «Reglas de la capacidad» por capacidad tocada, con solo las entradas que cambian. **Fusión por nombre de entrada**: el nombre de cada regla es su clave estable, así que `sdd-end-task` sustituye la entrada del mismo nombre o la añade, sin marcas `ADDED/MODIFIED` (una línea en su referencia de fusión). Sin esto, la sección del funcional no tiene por dónde crecer.
5. **`review-spec.md`**: en el mismo pase de la lente dominio, junto al complemento de visibilidad (T11), un punto más: recorrer las cinco por nombre para todo requisito que introduzca datos, nombres o límites, y **marcar como Crítico una regla de capacidad que contradiga la constitution** (la constitution manda; el usuario decide en el gate).
6. **Entrevista de `sdd-init-*`**: bloque fijo de cinco preguntas. **Destino único: la constitution**, sección «Reglas de producto» con las cinco por nombre; si una regla difiere por capacidad, se lista por capacidad dentro de la entrada. «No sé» es respuesta válida: la entrada queda «pendiente», como un stack sin decidir en `tech-stack`. La primera task que cree la capacidad copia a «Reglas de la capacidad» lo que le aplique. **RED con entrevista simulada**: el dev-lead lo simula Haiku con una persona fija que responde solo lo que se le pregunta; se cuenta cuántas de las cinco pregunta el agente por nombre (`sdd-init-greenfield`; brownfield comparte el bloque). Sin gasto humano y sin telegrafiar.
7. **RED (§2.3)**: fixture Ledgerly con `funcional/pedidos.md` sin idioma, topes ni ubicación de datos, y la task 80 «historial de búsquedas de operaciones» (datos nuevos, con tope natural). Dos sujetos redactan la spec con `sdd-start-task` y paran en el gate. Se cuenta cuántas de las cinco familias declara la spec (en «Decisiones a validar» o en el delta). Fallo esperado: ≤ 2 de 5.
8. **GREEN**: misma task sobre la fixture con `funcional/pedidos.md` calcado de la plantilla nueva (sección presente, rellena para pedidos) y el kit con las plantillas y la rúbrica nuevas. Umbral: ≥ 4 de 5 declaradas o marcadas «no aplica» en los dos sujetos. «No aplica» lo propone el agente en «Decisiones a validar» y lo confirma el usuario en el gate, como cualquier decisión. Si el baseline ya declara ≥ 4, la guidance de spec/funcional sobra y se deja solo la lista de la lente (Art. I). Entrevista: GREEN con la misma persona, umbral 5 de 5 preguntadas en los dos sujetos.
9. **Capacidad nueva `onboarding`** en `funcional/` del kit para la entrevista (requisito «La entrevista fija las cinco reglas de producto»), más `MODIFIED` de «El delta declara el comportamiento por capacidad» en `flujo-de-task` (era un `ADDED` mal declarado: mismo GIVEN y WHEN).
10. **Art. IX**: superpowers no tiene nada sobre reglas de producto; es dominio del kit.

### Hallazgos de la review

1. **Aceptado** — el `ADDED` de `flujo-de-task` tiene el mismo GIVEN/WHEN que «El delta declara el comportamiento por capacidad» → reescrito como `MODIFIED` (decisión 9, delta).
2. **Aceptado** — «se anotan para la primera task que la cree» no tenía destino legal → destino único: constitution, sección «Reglas de producto» (decisión 6).
3. **Aceptado en lo que importa** — la premisa «headless no tiene usuario» era cierta (los sujetos son Sonnet headless, no humanos, y `sdd-init-*` para en la primera pregunta), pero la entrevista sí se puede medir: dev-lead simulado por Haiku con persona fija → RED y GREEN de la entrevista (decisiones 6 y 8). Cae la excepción al Art. I.
4. **Aceptado** — la sección no tenía formato de fusión → fusión por nombre de entrada, sin marcas; entra en scope una línea en la referencia de fusión de `sdd-end-task` (decisión 4).
5. **Aceptado** — regla de capacidad contra la constitution → Crítico en la lente dominio; la constitution manda (decisión 5, delta).
6. **Aceptado** — «no sé» → entrada «pendiente» en la constitution; «no aplica» lo propone el agente y lo confirma el usuario en el gate (decisiones 6 y 8).
7. **Aceptado** — el escenario de `onboarding` mezclaba dos momentos → queda solo el cierre de la entrevista; el destino es la constitution (delta).
8. **Aceptado** — «fusión sin cambio» contradecía el hallazgo 4 → la fusión por nombre entra en scope.
9. **Aceptado** — dos checklists para la misma lente → una frase: mismo pase, dos listas (decisión 5).
10. **Aceptado** — el Intent no justificaba `spec-template` → añadido el camino spec → funcional.

## Intent

Cuatro tasks reales de SifRest con y sin `.docs/`: el brazo sin docs falló 13 de 51 puntos del checklist ciego, ninguno técnico y todos en cinco familias de reglas de producto que el código no contiene (dónde viven los datos, idioma de los nombres, límites, avisos, regla ante conflicto). Ningún test fallaba. La misma petición dio dos reglas opuestas en dos ejecuciones. El kit pregunta hoy por problema, usuarios, roles y módulos; no pregunta por estas cinco, y ni la plantilla de capacidad ni la review las reclaman. Y una regla que nace en una spec necesita un camino hasta la verdad viva: la subsección en la spec es lo que `sdd-end-task` fusiona en la sección del funcional.

## Scope

- Entra: sección en `funcional-template`; subsección en `spec-template`; lista y regla de conflicto en la lente dominio de `review-spec.md`; fusión por nombre de entrada en la referencia de fusión de `sdd-end-task`; bloque de cinco preguntas y sección «Reglas de producto» de la constitution en `sdd-init-greenfield` (entrevista) y `sdd-init-brownfield` (`generacion.md`); RED y GREEN de spec (dos sujetos) y de entrevista simulada (dos sujetos); capacidad `onboarding` y `MODIFIED` en `flujo-de-task`.
- No entra: reglas más allá de las cinco; volcar `funcional/` en brownfield; entrevista simulada de brownfield (comparte el bloque con greenfield).

## Approach

Que las cinco tengan nombre y sitio: en la entrevista (se preguntan), en la capacidad (se escriben o se marca «no aplica»), en la spec (se fijan cuando cambian) y en la review (se exigen). Medir primero cuánto declara el baseline; la guidance entra por lo que el RED demuestre.

## Delta de comportamiento

### Capacidad: `flujo-de-task`

**MODIFIED — El delta declara el comportamiento por capacidad** (antes: "GIVEN una spec que cambia comportamiento observable · WHEN se escribe su sección de delta · THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED (antes: …)` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN` · AND si la capacidad no existe en `funcional/`, su creación aparece en "Decisiones a validar"")
- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED (antes: …)` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND si la capacidad no existe en `funcional/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto); `sdd-end-task` sustituye o añade cada entrada por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

### Capacidad: `onboarding`

**ADDED — La entrevista fija las cinco reglas de producto**
- GIVEN una init greenfield o brownfield en su entrevista
- WHEN se cierra el bloque de producto
- THEN el agente ha preguntado por las cinco reglas por nombre (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto) y la constitution propuesta lleva la sección «Reglas de producto» con las cinco: respondida, «pendiente» si el dev-lead no sabe, o «no aplica» si él lo dice
- AND una regla que difiere por capacidad se lista por capacidad dentro de su entrada

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada en chat (10 decisiones) y review de dominio activada: 10 hallazgos, 10 aceptados |

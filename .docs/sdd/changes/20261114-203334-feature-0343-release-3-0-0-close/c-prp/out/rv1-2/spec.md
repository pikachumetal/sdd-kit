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

🦆 Hoy `anular Norte lun` anula la reserva sin preguntar quién eres. Con esto hay que decir el rol: `anular Norte lun --como responsable` responde `anulada Norte lun`, y con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue. El responsable ve además lo anulado con `anuladas --como responsable` (`Norte lun — anulada por responsable`). El rol es solo una declaración: la app no tiene usuarios, así que no impide que un cliente escriba `responsable`. Por dentro: `voidBooking` recibe el rol, guarda `voidedBy` y se añade el comando `anuladas`.

Validación: dev-lead — lo ve una persona en la terminal (textos de respuesta y listado).

## Capacidades

- Nuevas: `bookings` — hoy no hay carpeta `capabilities/`; esta feature fija solo el requisito de anular y el listado `anuladas` (lo de `libres`, `reservar` y `cancelar` no entra).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec: dos revisores (dominio opus, técnica sonnet) + segunda ronda (sonnet) — señales: reglas de visibilidad o permiso, datos (quién anuló), contrato público (la salida de `anular` y el comando nuevo `anuladas`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que cada THEN tenga su escenario y que el contrato de `anular` y `anuladas` quede dicho (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. **No es autenticación**: un cliente puede escribir `responsable`; lo asumo porque el producto lo usa una sola persona (PRODUCT.md).
2. Sin `--como`, o con otro valor, `anular` y `anuladas` responden `indica --como cliente|responsable` y no cambian nada. **Rompe el uso actual** de `anular Norte lun` sin rol.
3. `anuladas` es un comando **nuevo** (hoy no existe), solo para el responsable; el cliente recibe `solo el responsable de sala puede ver las anuladas`. Una línea por reserva, `<sala> <día> — anulada por <rol>`, en el orden en que se anularon; sin ninguna, `sin anuladas`.
4. Se guarda el **rol** (`voidedBy`), no una persona: no hay personas. «Quién anuló» = el rol.
5. El rol se comprueba antes de buscar la reserva: un cliente recibe el rechazo de rol también si la reserva no existe.
6. Anular una reserva inexistente, ya anulada o cancelada responde `sin reserva <sala> <día>` (lo de hoy); el responsable puede anular también reservas propias: la app no guarda titular, «de otros» es «de cualquiera».
7. Las respuestas salen por `console.log` con código de salida 0, como el resto de comandos: la app no usa códigos ni stderr. Ningún test lo comprueba (se prueba por `run`).
8. Los datos viven en memoria, como hoy: `anuladas` lista lo anulado **en esa ejecución**; no se persiste entre ejecuciones.
9. Capacidad nueva `bookings` (slug en inglés kebab-case por regla del kit; el contenido va en castellano). La constitución no tiene «Reglas de producto»: las reglas de abajo las fijo yo.
10. Enfoque: comprobar el rol dentro de `voidBooking` en `src/app.js`, frente a un módulo de permisos aparte (sobra para un permiso) o a una tabla de roles por comando (no hay más comandos con permiso).
11. **Un solo responsable global**, no uno por sala: la fila del roadmap dice «de cada sala», pero la app no tiene usuarios ni salas con dueño.
12. Para poder probar: se siembra una reserva más (Sur mié, 14:00-16:00; no choca con `libres` ni con `cancelar Sur mar`) y `src/app.js` exporta `resetBookings()`, que restaura la semilla; los tests lo llaman antes de cada escenario. Es un cambio interno, no de comportamiento.
13. `--como <rol>` va **al final**, tras la sala y el día; en otra posición, sin valor o repetido cuenta como rol ausente. `anuladas` lo lleva como único argumento.
14. El orden de `anuladas` es el de anulación: cada anulación guarda un contador creciente (`voidSeq`) y se ordena por él.
- Política de modelos: revisores de la spec dominio opus y técnica sonnet; segunda ronda sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Hallazgos de la review

Primera ronda (dominio y técnica):

- **Aceptado** — Crítico (dominio): `bookings` no existe en `capabilities/`, el MODIFIED no tenía contra qué compararse → capacidad nueva con ADDED y comportamiento completo.
- **Aceptado** — Crítico (dominio): faltan las cinco reglas de la capacidad → sección «Reglas de la capacidad».
- **Aceptado** — Crítico (técnica): un escenario agrupaba todo → un escenario por comportamiento.
- **Aceptado** — Crítico (técnica): el formato de `anuladas` no estaba fijado; al mirar el código, `anuladas` **no existe** → decisión 3 y sus escenarios.
- **Aceptado** — Crítico (técnica): texto de rechazo, código de salida y stream sin decidir → decisiones 2, 3 y 7.
- **Aceptado** — Importante (dominio y técnica): `--como` ausente o inválido, reserva inexistente o ya anulada, cliente y `anuladas` → decisiones 2, 3, 5 y 6 con sus escenarios.
- **Aceptado** — Importante (técnica): dónde se persiste el dato → decisión 8 y reglas.
- **Aceptado** — Importante (dominio): Intent y Scope decían cosas distintas, y «quién anuló» era un rol → unificados; decisión 4.
- **Aceptado** — Menor (dominio): el ejemplo «de Ana» → el GIVEN ya no nombra a nadie (la reserva no guarda titular).
- **Rechazado** — Importante (dominio): renombrar `bookings` a `reservas` → el slug de capacidad es nombre de fichero en inglés kebab-case por regla del kit; el contenido va en castellano.
- **Aceptado** — Menor (técnica): dónde se prueba `anuladas` → añadido.

Segunda ronda (un revisor, sonnet):

- **Aceptado** — Crítico: los GIVEN con Sur mar no se podían montar y el estado del módulo se comparte → decisión 12 (semilla Sur mié y `resetBookings()`).
- **Aceptado** — Crítico: «orden de anulación» sin sustento → decisión 14 y un AND que anula en orden inverso al de la semilla.
- **Aceptado** — Crítico: `voidedBy` no se ve por `run` → sale del THEN de anular; lo demuestra `anuladas`.
- **Aceptado** — Importante: parseo de `--como` → decisión 13 y un AND por caso.
- **Aceptado** — Importante: «de cada sala» del roadmap → decisión 11 y fila en «Lo que se retira o cambia de forma».
- **Aceptado** — Importante: reserva cancelada sin escenario → AND en «Anular lo que no está activo».
- **Aceptado** — Importante: `bookings` frente a «Evitar: booking» → anotado en «Términos resueltos».
- **Aceptado** — Menor: código de salida no probado → decisión 7 lo dice; «Límites» con su motivo y `voidedBy` explicado.
- Sin tercera ronda: el kit no la prevé tras la segunda.

## Intent

Hoy cualquiera anula cualquier reserva y no queda rastro de quién. El responsable de sala debe poder anular reservas de cualquiera y ver qué ha anulado; el cliente no debe anular ni ver lo anulado. Éxito: con `--como cliente`, ninguna reserva cambia y `anuladas` no se le enseña. No es éxito si el rol parece seguro: es una declaración, no una autenticación.

## Scope

- Entra: `anular` con `--como`, el rol guardado en la reserva, el comando `anuladas` (solo responsable), la semilla y `resetBookings()` para probar, y los mensajes de las decisiones 2, 3 y 7.
- No entra: `cancelar` (no usa `--como` y no aparece en `anuladas`), `libres`, `reservar`, persistencia entre ejecuciones y autenticación real.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular <sala> <día>` sin `--como` deja de anular | `src/app.js:31` (único sitio; no hay tests, README ni scripts que lo nombren: `git grep -i anular`) | decisión 2 y escenario «Anular exige un rol válido» |
| «solo el responsable **de cada sala**» (un responsable por sala) | `ROADMAP.md:8` | decisión 11: un responsable global |

- Filas que implementa: 0011 → `ROADMAP.md:8` (su fila) | sin más ficheros: comprobado con `git grep -n "0011"`

## Approach

- Rol dentro de `voidBooking(room, day, role)` — un parámetro más y los campos `voidedBy` y `voidSeq`; se prueba por `run`.
- Módulo de permisos aparte — un fichero para una sola comprobación.
- Elegido: rol dentro de `voidBooking`, porque es el único comando con permiso y la arquitectura es un fichero (`src/app.js`).

## Dónde se prueba

- Anular y `anuladas`: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`; cada escenario con su test, que llama a `resetBookings()` antes (decisión 12), y el gate es `node --test` entero.

## Términos y ADR

- Términos resueltos: Anulación — la que hace el responsable (PRODUCT.md); la del cliente es Cancelación y no entra · `bookings` es solo el slug de fichero de la capacidad: en el contenido se dice «reserva».
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`
- AND `anular Norte lun --como responsable` otra vez responde `sin reserva Norte lun`

#### ADDED — El cliente no anula

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND con una sala o día sin reserva (`anular Sur mar --como cliente`) responde lo mismo, no `sin reserva`

#### ADDED — Anular exige un rol válido

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun` (sin `--como`) o `anular Norte lun --como admin`
- THEN responde `indica --como cliente|responsable` y la reserva sigue activa
- AND `anular Norte lun --como` (sin valor) y `anular --como responsable Norte lun` responden lo mismo
- AND `anular Sur mar` sin rol responde lo mismo, no `sin reserva`

#### ADDED — Anular lo que no está activo

- GIVEN la reserva de Norte del lun ya anulada, y ninguna de Sur del mar
- WHEN `anular Norte lun --como responsable` y `anular Sur mar --como responsable`
- THEN responde `sin reserva Norte lun` y `sin reserva Sur mar`, sin cambiar nada
- AND con Norte del lun cancelada (`cancelar Norte lun`) también responde `sin reserva Norte lun`

#### ADDED — Listar las anuladas

- GIVEN Norte del lun anulada por el responsable
- WHEN `anuladas --como responsable`
- THEN responde `Norte lun — anulada por responsable`
- AND con dos anuladas, Sur mié y luego Norte lun, responde `Sur mié — anulada por responsable` y `Norte lun — anulada por responsable`, en ese orden (el contrario al de la semilla)
- AND sin ninguna anulada responde `sin anuladas`

#### ADDED — El cliente no ve las anuladas

- GIVEN Norte del lun anulada por el responsable
- WHEN `anuladas --como cliente`
- THEN responde `solo el responsable de sala puede ver las anuladas`, sin listar nada
- AND `anuladas` sin `--como` o con `--como admin` responde `indica --como cliente|responsable`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, campos `voidedBy` (el rol; hoy solo puede ser `responsable`, se guarda para decir «quién anuló») y `voidSeq` en la reserva; no se persiste entre ejecuciones.
- **Idioma de los nombres**: textos de la interfaz en castellano (constitución, regla 4); el slug y los campos en inglés, como el código.
- **Límites**: no aplica: no hay tope de cantidad ni de tamaño, la lista vive en la memoria de una ejecución.
- **Avisos**: los textos literales de arriba; sin otros.
- **Regla ante conflicto**: el rol se comprueba antes que la reserva; reserva inexistente, ya anulada o cancelada → `sin reserva <sala> <día>`.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

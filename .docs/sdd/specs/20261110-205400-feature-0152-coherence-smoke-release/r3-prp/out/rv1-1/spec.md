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

🦆 Hoy `anular` anula cualquier reserva sin preguntar quién eres. Con esto, `anular` y el comando nuevo `anuladas` piden `--como responsable`; con `--como cliente` (o sin rol) se rechazan. Como la app no tiene usuarios, el rol es una convención, no un candado. Se guarda el rol de quien anuló y `anuladas` lo enseña.

## Capacidades

- Modificadas: `bookings` — `anular` (que ya existe en `src/app.js`) lo puede usar solo el responsable de sala, sobre reservas de cualquiera, y guarda quién anuló.
- Nuevas en `bookings`: el comando `anuladas` (hoy no existe), que lista las anuladas y solo lo puede usar el responsable.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular` y el comando `anuladas`) · tamaño: ~90 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` tenga su test y que guardar quién anuló no rompa `cancelar` ni `libres` (señal: contrato público + datos)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. Es una **convención de uso, no un control de acceso**: quien teclea `--como responsable` es responsable. Coherente con PRODUCT.md («la uso yo»): `PRODUCT.md` no cambia, los roles son los dos sombreros que se pone su único usuario.
2. Sin `--como`, o con un valor que no es `cliente` ni `responsable`, `anular` y `anuladas` responden `falta --como <cliente|responsable>` y no hacen nada. El permiso no puede darse por defecto. Es un cambio incompatible: hoy `anular Norte lun` sin rol anula.
3. «Responsable de sala» es un único rol global: el ROADMAP dice «responsable de **cada** sala», pero sin usuarios no hay forma de ligar un responsable a Norte o Sur. No se modela por sala. Esto es lo que más conviene validar.
4. `anuladas` es un comando nuevo y **también exige `--como responsable`**: el cliente no ve quién anuló. Con `--como cliente` responde `solo el responsable de sala puede anular ni ver las anuladas`.
5. Se guarda el rol (`voidedBy`, hoy siempre `responsable`), no una identidad ni una fecha: es lo único que la app conoce. `anuladas` lo enseña igualmente porque el Intent lo pide y deja el formato listo para más roles.
6. Salida pública: `anular` responde `anulada <sala> <día>` (ya existe), `solo el responsable de sala puede anular` (rechazo del cliente) y `falta --como …` (sin rol). `anuladas` lista una reserva por línea, `<sala> <día> — anulada por <rol>` con raya larga (U+2014), en el orden del listado de reservas, y responde `sin anuladas` si no hay ninguna.
7. Las cinco reglas de la capacidad: **dónde vive el dato** — en memoria, como campo `voidedBy` y estado `voided` de la reserva, igual que el resto (sin persistencia nueva: cada invocación de la CLI parte de cero, así que `anuladas` solo ve lo anulado en el mismo proceso, y así se prueba); **idioma de los nombres** — mensajes en castellano, campo y estado en inglés como el código actual; **límites** — no aplica; **avisos** — los mensajes de rechazo del punto 6; **conflicto** — anular algo inexistente, ya anulado o ya cancelado responde `sin reserva <sala> <día>` (lo que `findBooking` ya hace, solo busca activas).
8. `anuladas` excluye las cancelaciones (PRODUCT.md las distingue de las anulaciones). La franja de una anulada queda libre para `libres`, como una cancelada.
9. Cambios de código que la spec declara: `voidBooking(room, day)` pasa a `voidBooking(room, day, role)` y `run('anular')` lee `--como`, que va al final de los parámetros (`params[0]` y `params[1]` siguen siendo sala y día); se valida primero el rol y luego la reserva (`anular Sur mar --como cliente` responde el rechazo de rol, no `sin reserva`). Se exporta `resetBookings()`, que restaura la única reserva sembrada (`Norte lun`, activa), para que cada test parta de cero: el estado es de módulo y sin reset un test consumiría la reserva de los siguientes. Los tests existentes no llaman a `anular` ni a `voidBooking` (`git grep`: solo `src/app.js`), así que no hay que tocarlos.
10. No se modela el titular de la reserva: el modelo no tiene campo `owner`, y los escenarios no hablan de «quién» pidió la reserva.

### Hallazgos de la review

- **Aceptado** — [técnica 1] `anuladas` sin test → «Dónde se prueba» lo recoge en `test/anuladas.test.js`.
- **Aceptado** — [técnica 2] el GIVEN de `anuladas` sembraba datos → ahora el GIVEN es un `anular` real en el mismo proceso, y la decisión 7 fija el modelo de estado.
- **Aceptado** — [técnica 3, 5, 8] estado no observable, casos de `--como` inválido o repetido, orden y separador → escenarios nuevos y decisiones 2, 6 y 7.
- **Aceptado** — [técnica 4, 6, 7] titular, compatibilidad, qué se guarda, regresión de `cancelar` y `libres` → decisiones 2, 5 y 8, y escenario de regresión.
- **Aceptado** — [técnica 9 y dominio 3] el rol es declarativo → decisión 1.
- **Aceptado** — [dominio 2] `anuladas` mostraba quién anuló a cualquiera → decisión 4 y sus escenarios.
- **Aceptado** — [dominio 4] PRODUCT.md dice «no hay más usuarios» → decisión 1: los roles son sombreros del mismo usuario.
- **Aceptado** — [dominio 5, 6, 7, 8, 9, 10] qué se guarda, las cinco reglas, conflictos, cancelaciones y reserva propia, salida pública → decisiones 5 a 8.
- **Rechazado** — [dominio 1] «`anular` no existe»: sí existe (`voidBooking`, `run('anular')`); era mi frase de Capacidades, que ya se ha corregido. No hace falta pasarlo a ADDED, y `cancelar` no se toca.
- **Aceptado** — [2ª ronda 1] la siembra solo tiene `Norte lun` y no hay forma de crear otra → los escenarios usan solo `Norte lun`; se quita el de dos anuladas y la afirmación de orden testeable.
- **Aceptado** — [2ª ronda 2, 4, 7] aislamiento entre tests, cambio de firma de `voidBooking`, posición de `--como` y precedencia → decisión 9 y escenario de precedencia.
- **Aceptado** — [2ª ronda 3, 10] «de Ana» y reserva propia no son observables → se quitan; decisión 10.
- **Aceptado** — [2ª ronda 5, 8] `sin anuladas` y el formato de línea en la decisión 6; AND observable tras el rol inválido.
- **Aceptado** — [2ª ronda 6] el Intent promete un control que no hay → Intent reescrito como convención de uso y «No entra» explícito.
- **Rechazado** — [2ª ronda 9] línea en PRODUCT.md: su definición de Anulación («la anula el responsable de sala») ya coincide con la spec y la decisión 1 ya concilia los roles con «no hay más usuarios».
- **Rechazado** — [técnica 10, parte «alinear Anulación con la interfaz»] los textos ya dicen «anulada»; PRODUCT.md define Anulación igual.

## Intent

Hoy cualquiera anula cualquier reserva. Por convención de uso (no hay control de acceso real: ver decisión 1), el responsable de sala anula las de otros y el cliente no.

## Scope

- Entra: `anular` con `--como`, el modelo de reserva (estado `voided` y campo `voidedBy`) y el comando nuevo `anuladas`, que enseña quién anuló.
- Entra también: `voidBooking` con el rol y `resetBookings()` para los tests (decisión 9).
- No entra: `cancelar` (tampoco el titular ni el rol de quien cancela), `libres` (solo se comprueba que no cambian), control de acceso real, persistencia entre invocaciones, un responsable por sala.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- Anuladas: por `run('anuladas', …)`, en `test/anuladas.test.js`. Los tests anulan por `run('anular', …)` y listan en el mismo proceso; cada test empieza con `resetBookings()`.
- Regresión: `test/cancel.test.js` y `test/app.test.js` siguen en verde sin cambios.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Anular una reserva**
- GIVEN la reserva de Norte del lun
- WHEN `run('anular', ['Norte', 'lun', '--como', 'responsable'])`
- THEN responde `anulada Norte lun`
- AND `run('anuladas', ['--como', 'responsable'])` responde `Norte lun — anulada por responsable`
- AND `run('libres', ['10:00-12:00'])` responde `Norte, Sur`

**MODIFIED — Anular la reserva como cliente**
- GIVEN la reserva de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular`
- AND la reserva sigue activa: `anular Norte lun --como responsable` después responde `anulada Norte lun`

**MODIFIED — Anular sin rol o con un rol inválido**
- GIVEN la reserva de Norte del lun
- WHEN `anular Norte lun` (sin `--como`), o `anular Norte lun --como admin`
- THEN responde `falta --como <cliente|responsable>`
- AND la reserva sigue activa: `anular Norte lun --como responsable` después responde `anulada Norte lun`

**MODIFIED — Anular con rol inválido sobre una reserva inexistente**
- GIVEN solo la reserva de Norte del lun
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular` (el rol se valida antes que la reserva)

**MODIFIED — Anular lo que no está activa**
- GIVEN Norte del lun ya anulada, o ya cancelada
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`

**ADDED — Listar las reservas anuladas**
- GIVEN Norte del lun anulada con `anular Norte lun --como responsable`
- WHEN `anuladas --como responsable`
- THEN responde `Norte lun — anulada por responsable`
- AND sin ninguna anulada (tras `resetBookings()`) responde `sin anuladas`
- AND con Norte del lun cancelada (no anulada) responde `sin anuladas`

**ADDED — Listar las anuladas como cliente o sin rol**
- GIVEN Norte del lun anulada
- WHEN `anuladas --como cliente`
- THEN responde `solo el responsable de sala puede anular ni ver las anuladas` y no enseña ninguna línea
- AND `anuladas` sin `--como` responde `falta --como <cliente|responsable>`

**Regresión — `cancelar` y `libres`**
- GIVEN la reserva sembrada de Norte del lun, activa (tras `resetBookings()`)
- WHEN `cancelar Norte lun`
- THEN responde `cancelada Norte lun`, y `anuladas --como responsable` responde `sin anuladas`
- AND `libres` y `cancelar` conservan sus tests actuales sin cambios

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

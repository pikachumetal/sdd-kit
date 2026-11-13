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

- Modificadas: `bookings` — `anular` lo puede usar solo el responsable de sala, sobre cualquier reserva activa, y guarda quién anuló.
- Añadidas (dentro de `bookings`): `anuladas`, listado de reservas anuladas con quién anuló, solo para el responsable.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (sonnet): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. `--como` es obligatorio en `anular` y en `anuladas`. Sin él, o con otro valor, responde `indica --como cliente|responsable` y no cambia nada. Es un cambio de contrato de `anular`, que hoy no lo lleva.
3. Rechazo del cliente: mensaje literal `solo el responsable de sala puede anular`; la reserva no cambia. Lo mismo en `anuladas` con `solo el responsable de sala puede ver las anuladas`: el cliente no ve quién anuló.
4. `anuladas` no existe hoy: se añade, no se modifica. Pertenecen a él las reservas con `status === 'voided'`. Formato: una línea por reserva, `<sala> <día> — anulada por <rol>`, **en el orden de la lista de reservas** (no hay instante de anulación en el modelo y no se añade); sin ninguna responde `sin anuladas`.
5. Dónde vive el dato: la app guarda las reservas en memoria (`src/app.js`), así que «quién anuló» es un campo más de la reserva (`voidedBy`). No hay persistencia ni migración, y no existen reservas anuladas previas sin ese dato. Hoy solo el responsable anula, así que el valor guardado es siempre `responsable`; se guarda igualmente porque lo pide el enunciado.
6. La reserva no tiene dueño en el modelo: «de otros» significa «de cualquiera». No hace falta definir propiedad, y el ejemplo no usa nombres de clientes.
7. No existe `capabilities/`: la verdad actual de `anular` es el código (`voidBooking`) y las specs 0005 y 0006. El `MODIFIED` se contrasta contra el código; crear `capabilities/bookings.md` queda para la integración del cierre, no para esta feature.
8. Una reserva ya anulada, cancelada o inexistente responde `sin reserva <sala> <día>`, el mensaje que ya dan `anular` y `cancelar`: no se pisa el anulador.
9. `cancelar` no cambia: sin `--como`, igual que hoy, y no aparece en `anuladas`.
10. Hacer `--como` obligatorio no rompe nada existente: no hay tests, scripts ni README que usen `anular` hoy (comprobado con `git grep`). Lo nuevo se prueba con un helper de test que siembra la lista de reservas (`bookings` no es accesible desde fuera); crearlo es parte de la feature.
11. `--como` es declarativo: cualquiera puede escribir `--como responsable`. No es autenticación ni control de acceso, y queda fuera de alcance; «solo el responsable» significa «solo quien se declara responsable». La app no tiene usuarios (decisión 1).
12. Lectura de los argumentos: `--como <valor>` va **después** de sala y día (`anular <sala> <día> --como <rol>`); sala y día son los dos primeros. Orden de validación: primero `--como` (ausente o inválido), luego el permiso, luego que exista la reserva. `anular Sur mar --como cliente` responde el rechazo de permiso aunque no exista esa reserva.
13. El rechazo del cliente no remite a `cancelar`: mantiene el mensaje literal de la decisión 3; el cliente cancela por su cuenta con su propio comando.

Reglas de la capacidad: dónde vive el dato (decisión 5) · idioma de los nombres: castellano (constitución, regla 4) · límites: no aplica · avisos: no aplica · regla de conflicto: la de la decisión 8.

### Hallazgos de la review

- **Aceptado** — Dominio 1 y Técnica 6 (`bookings.md` no existe) → decisión 7: el MODIFIED se contrasta contra el código y las specs previas.
- **Aceptado** — Dominio 2 (qué ve el cliente en `anuladas`) → decisión 3 y escenario de `anuladas --como cliente`.
- **Aceptado** — Dominio 3 y Técnica 10 (`cancelar` y `anular` sin `--como`) → decisiones 2 y 9, y escenarios de no regresión.
- **Aceptado** — Técnica 1 (escenario único con tres resultados) → el delta se parte en escenarios independientes.
- **Aceptado** — Técnica 2 (`--como` ausente o inválido) → decisión 2 y escenarios.
- **Aceptado** — Dominio 4 y Técnica 3 (reserva ya anulada o inexistente) → decisión 8 y escenarios.
- **Aceptado** — Técnica 4 (formato de `anuladas`; contradicción con «no rompa el formato») → `anuladas` es un comando nuevo, decisión 4: no hay formato previo que romper; escenarios con varias y con ninguna. La línea Técnica del bloque de arriba es lo que se despachó y queda como registro.
- **Aceptado** — Técnica 5 y Dominio 7 (anuladas previas sin anulador) → decisión 5: no hay persistencia ni anuladas previas.
- **Aceptado** — Dominio 5 (cinco reglas) y Técnica 7 (decisiones fuera de la lista) → línea «Reglas de la capacidad» y decisiones 2 a 9.
- **Aceptado** — Dominio 6 y 9 («de otros» sin dueño; Ana no demuestra nada) → decisión 6; el ejemplo deja de usar nombres propios.
- **Aceptado** — Técnica 8 (fichero de pruebas de `anuladas`) → «Dónde se prueba».
- **Segunda ronda** (un revisor, sonnet; sin tercera):
  - **Aceptado** — Crítico: `--como` obligatorio rompe consumidores → decisión 10: no hay ninguno (`git grep`), nada que actualizar.
  - **Aceptado** — Crítico: escenario con dos casos juntos → partido en «ya anulada» (con anulador intacto) y «inexistente».
  - **Aceptado** — Importante: cancelada fuera de `anuladas` → escenario propio.
  - **Aceptado** — Importante: «orden de anulación» sin soporte → decisión 4: orden de la lista de reservas; el escenario siembra el orden inverso al de anulación.
  - **Aceptado** — Importante: fixture de `Sur mar` → decisión 10: helper de test que siembra reservas.
  - **Aceptado** — Importante: orden de validación y posición del flag → decisión 12 y escenario.
  - **Aceptado** — Importante: `--como` no es control de acceso → decisión 11.
  - **Aceptado** — Menor: criterio de pertenencia a `anuladas` → decisión 4; parseo del flag → decisión 12; `test/anular.test.js` se crea (no existe fichero previo).
  - **Aceptado** — Menor: rechazo del cliente y `cancelar` → decisión 13, se mantiene el mensaje.
- **Rechazado** — Dominio 8 (contrastar el texto actual con `capabilities/`) → no existe; el texto actual (`anulada <sala> <día>`, `sin reserva …`) se contrastó con `voidBooking` y queda en la decisión 7.
- **Rechazado** — Dominio 10 (nombre del aprobador) → Laura es el dev-lead del proyecto, dato del frontmatter dado por el usuario.
- **Rechazado** — Técnica 9 (bloque con propuesta y alternativa) → es la forma que fija `review-spec.md`: el mínimo razonable va siempre.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular cualquiera, y el cliente no; y debe poder ver quién anuló.

## Scope

- Entra: `anular` con `--como`, y el listado nuevo `anuladas` con quién anuló.
- No entra: `cancelar` (queda como está).

## Dónde se prueba

- Anular y anuladas: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js` (fichero nuevo), como `test/cancel.test.js`, con el helper de siembra de la decisión 10.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Anular una reserva**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada, con `voidedBy` = `responsable`

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun` (sin `--como`) o `anular Norte lun --como admin`
- THEN responde `indica --como cliente|responsable` y la reserva sigue activa

- GIVEN la reserva de Norte del lun ya anulada por el responsable
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun` y `anuladas --como responsable` sigue listando `Norte lun — anulada por responsable` una sola vez

- GIVEN que no existe reserva de Sur del mar
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`

- GIVEN que no existe reserva de Sur del mar
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular` (el permiso se valida antes que la existencia)

**ADDED — Listar las anuladas**
- GIVEN la lista sembrada con Norte lun y Sur mar, y anuladas en orden inverso (primero Sur mar, luego Norte lun)
- WHEN `anuladas --como responsable`
- THEN responde dos líneas en el orden de la lista: `Norte lun — anulada por responsable` y `Sur mar — anulada por responsable`

- GIVEN Norte lun cancelada y Sur mar anulada
- WHEN `anuladas --como responsable`
- THEN responde solo `Sur mar — anulada por responsable`

- GIVEN ninguna reserva anulada
- WHEN `anuladas --como responsable`
- THEN responde `sin anuladas`

- GIVEN una reserva anulada
- WHEN `anuladas --como cliente`
- THEN responde `solo el responsable de sala puede ver las anuladas` y no lista nada

- GIVEN una reserva anulada
- WHEN `anuladas` sin `--como`
- THEN responde `indica --como cliente|responsable`

**No regresión — `cancelar`**
- GIVEN la reserva activa de Norte del lun
- WHEN `cancelar Norte lun` (sin `--como`)
- THEN responde `cancelada Norte lun`, igual que hoy

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

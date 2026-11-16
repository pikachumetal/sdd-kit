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

> 🦆 Hoy cualquiera puede anular cualquier reserva con `anular`. Con esto, solo quien diga `--como responsable` puede anular, y la reserva guarda que la anuló el responsable. Quien diga `--como cliente` recibe `solo el responsable de sala puede anular` y la reserva sigue en pie. Además se estrena el listado `anuladas`: el responsable ve quién anuló cada una y el cliente solo ve que está anulada. La app no tiene usuarios, así que el rol es lo que se declara en la línea de comandos, no algo que se compruebe.

Validación: dev-lead — es un comando que usa una persona y cambia lo que ve y puede hacer cada rol.

## Capacidades

- Nuevas: `bookings` — reservas de salas: anular una reserva y ver las anuladas. Hoy `capabilities/` está vacía: no hay capacidad que modificar.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. El cliente ve en `anuladas` la reserva anulada sin quién la anuló: `Norte lun — anulada`.
3. `bookings` es capacidad nueva (`ADDED`, no `MODIFIED`): `capabilities/` no existe y la fusión rechaza modificar lo que no está. Su slug va en inglés porque es un nombre de fichero; en la spec y el producto sigue siendo «reserva».
4. Sin `--como`, `anular` se trata como `cliente` (lo más restrictivo) y responde `solo el responsable de sala puede anular`.
5. `--como responsable` vale para cualquier sala: la app no sabe de qué sala es responsable cada persona, y la fila 0011 dice «de cada sala» sin dar el dato. Si hace falta por sala, es otra feature.
6. El permiso se comprueba antes que la existencia: `anular Sur mar --como cliente` responde `solo el responsable de sala puede anular`, no `sin reserva Sur mar`.
7. `anuladas` es un comando nuevo; sin reservas anuladas responde `sin anuladas`. El texto es mío.
8. Lo anulado por el responsable se guarda como `anulada por responsable`: es el literal que sale en `anuladas --como responsable`.
- Política de modelos: revisores de la spec ya hechos (dominio opus, técnica sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Pasada de coherencia: corregí 3 (el delta pasó de `MODIFIED` a `ADDED`) y añadí 4–8, que la spec dejaba sin decir. Prueba de la fusión: ver línea de resultado abajo.

```text
sdd capability merge sobre copia de .docs/sdd: bookings.md: añadido «Anular una reserva» · bookings.md: añadido «Ver las reservas anuladas» (exit 0)
```

### Hallazgos de la review

- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 2.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 1).

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no. Éxito: `anular --como cliente` nunca cambia una reserva, y el cliente nunca ve quién anuló.

## Scope

- Entra: `anular` con `--como` (`voidBooking` y `run` en `src/app.js`), guardar quién anuló, y el comando nuevo `anuladas`.
- No entra: `cancelar` (la cancelación del propio cliente), comprobar de qué sala es responsable cada persona, usuarios o ficheros de roles.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` sin `--como` deja de anular | `src/app.js:20-25` (`voidBooking`), `src/app.js:31` (`run`) | delta, «Anular una reserva», y decisión 4 |
| Estado `voided` de la reserva gana quién anuló | `src/app.js:23` | Scope (`src/app.js`) |
| Término «Anulación» | `PRODUCT.md:10` | ya dice «la anula el responsable de sala»: sin cambio |

- Filas que implementa: 0011 → `.docs/sdd/roadmap.md:8` (pasa a ✅ al cerrar); `PRODUCT.md` ya la describe; comprobado con `grep -rn "0011\|anular\|anuladas" PRODUCT.md README.md .docs/sdd`.

## Approach

El rol llega por `--como` y decide si `anular` actúa. La reserva anulada guarda quién la anuló, y `anuladas` lo enseña solo al responsable.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`.

## Términos y ADR

- Términos resueltos: ninguno nuevo («Anulación» ya está en `PRODUCT.md`)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND sin `--como` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND `anular Sur mar --como cliente`, sin reserva, responde `solo el responsable de sala puede anular`

#### ADDED — Ver las reservas anuladas

- GIVEN la reserva de Norte del lun, anulada por el responsable
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`
- AND `anuladas --como cliente` lista `Norte lun — anulada`
- AND sin reservas anuladas responde `sin anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

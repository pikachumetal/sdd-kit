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
  - name: TBD
    approved_at: null
---

# Spec — Anular reservas de otros

Validación: dev-lead — cambia lo que ve y puede hacer quien usa la terminal.

## Capacidades

- Nuevas: `bookings` — reservas de salas; esta feature solo documenta en ella la anulación y su listado. `cancelar`, `libres` y `reservar` ya existen y quedan fuera hasta que otra feature las recoja.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), reglas de visibilidad o permiso (quién puede anular), contrato público (la salida de `anular` y el comando nuevo `anuladas`) · tamaño: ~60 líneas en 3 ficheros (`src/app.js`, `test/anular.test.js`, `.docs/sdd/capabilities/bookings.md`)
- Dominio (opus): qué NO puede hacer el cliente y si `anuladas` filtra algo que no debe ver; si «responsable» sin sala (decisión 2) contradice la fila 0011 del roadmap (señal: permiso)
- Técnica (sonnet): que `anular` sin `--como` y con `--como` inválido no rompa los tests actuales ni el formato de salida de `anular` (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. **El rol sale de `--como <cliente|responsable>`**: la app no tiene usuarios ni login (`operations.md`), así que el rol se declara en el comando.
2. **«Responsable» no lleva sala**: la fila 0011 dice «responsable de cada sala», pero la app no sabe quién es responsable de qué sala; `--como responsable` vale para cualquier sala. Si quieres un responsable por sala, es otra feature (necesita datos de salas y personas).
3. **Sin `--como`, o con un valor que no es `cliente` ni `responsable`, se trata como `cliente`**: se rechaza la anulación. Cambia lo de hoy (anular sin rol funciona), y es el sentido de la feature.
4. **La comprobación de rol va antes de buscar la reserva**: un cliente que anula una reserva que no existe recibe el rechazo de permiso, no `sin reserva …`.
5. **Texto de rechazo**: `solo el responsable de sala puede anular`.
6. **`anuladas` es un comando nuevo** y su formato es `<sala> <día> — anulada por <rol>`, una línea por reserva anulada; sin ninguna, `sin anuladas`. Como solo el responsable puede anular, el rol que guarda hoy es siempre `responsable`: se guarda igual para que el listado diga quién anuló.
7. **El GIVEN no nombra dueño de la reserva**: la app no guarda a nombre de quién está (`src/app.js`), así que «reservas de otros» es, en la práctica, cualquier reserva.
8. **No cambia `cancelar`** ni la terminología de `PRODUCT.md` (ya dice que anula el responsable de sala).
9. **Capacidad nueva `bookings`** (inglés, kebab-case, singular de dominio como pide la plantilla): se crea al cerrar con solo este requisito; los demás comportamientos de reservas no se documentan aquí.

Prueba del delta en una copia temporal de `.docs/sdd`: `sdd capability merge` → `bookings.md: añadido «Anular una reserva»` (exit 0); `capabilities/` del repo sin tocar.

## Intent

Hoy cualquiera anula cualquier reserva con `anular <sala> <día>`. Solo el responsable de sala debe poder anular, y el listado de anuladas debe decir quién anuló. Éxito: `anular Norte lun --como cliente` no toca la reserva y `anular Norte lun --como responsable` sí. Fracaso aunque funcione: que un cliente pueda anular sin escribir `--como`.

## Scope

- Entra: `anular` con `--como`, rechazo del cliente, y el comando `anuladas` con quién anuló.
- No entra: `cancelar`, un responsable por sala, usuarios o login, el dueño de la reserva.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` sin `--como` deja de anular | `src/app.js:20-25` y `:31` (`voidBooking`, `run`) | delta, `ADDED — Anular una reserva`, escenario sin `--como`; decisión 3 |
| «responsable de cada sala» (por sala) | `.docs/sdd/roadmap.md:8` (fila 0011) | decisión 2: sin sala; la fila no se reescribe aquí, la cierra `sdd-archive` |
| Término «Anulación» | `PRODUCT.md:10` | sin cambio: ya coincide con la spec (decisión 8) |

- Filas que implementa: 0011 → `.docs/sdd/roadmap.md:8` (su texto «de cada sala» difiere de la decisión 2; `sdd-archive` la marca ✅) | comprobado con `grep -rniE "0011|anul" --exclude-dir=.git --exclude-dir=node_modules .`: solo esos sitios.

## Approach

`anular` lee `--como` de sus argumentos, rechaza si no es `responsable` y, si procede, guarda el rol en la reserva anulada. `anuladas` recorre las reservas anuladas. Cómo se organiza en código lo decide el plan.

## Dónde se prueba

- Anular y anuladas: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js` (fichero nuevo), con el patrón de `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND `anuladas` responde `Norte lun — anulada por responsable`

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND `anuladas` responde `sin anuladas`

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun` (sin `--como`)
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

- GIVEN que no hay reserva de Sur el mar
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |

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

- Nuevas: `reservas` — hoy no existe `capabilities/reservas.md`; esta feature la crea con el comportamiento de `anular` (que ya existe en `src/app.js` sin control de rol) y del comando nuevo `anuladas`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservas`), reglas de visibilidad o permiso (rol responsable y su complemento), datos (quién anuló), contrato público (la salida de `anular` y el comando `anuladas`) · tamaño: ~90 líneas en 3 ficheros
- Dominio (sonnet): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que la salida de `anular` y `anuladas` quede fijada con texto exacto (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. Es una convención, **no seguridad**: cualquiera puede escribir `--como responsable`.
2. `reservas` es capacidad nueva: no había capacidad viva que modificar. Lo que hoy hace `anular` (anula la reserva activa y responde `anulada <sala> <día>`) pasa a ser su requisito base.
3. `anuladas` es un comando nuevo (no existe hoy), así que no hay formato previo que romper. Su formato lo fijo yo: una línea por reserva anulada, `<sala> <día> — anulada por <rol>`; sin ninguna, `sin anuladas`.
4. `anuladas` es solo del responsable: con `--como cliente` responde `solo el responsable de sala puede ver las anuladas`. Así el cliente no ve quién anuló.
5. Sin `--como`, `anular` y `anuladas` tratan al usuario como `cliente` (lo más restrictivo). Con un valor distinto de `cliente` o `responsable`, responden `rol no válido: <valor>` y no cambian nada.
6. El rol es el literal en minúsculas, `cliente` o `responsable`.
7. Las reservas no tienen dueño en el modelo (`src/app.js`): «de otros» significa «de cualquiera»; el responsable anula cualquier reserva activa. Las reservas viven en memoria, sin datos previos que migrar.
8. Anular una reserva ya anulada responde `sin reserva <sala> <día>` (ya es el comportamiento: solo se buscan las activas).
9. Los mensajes salen por `run(...)` como cadena, igual que hoy (stdout, código de salida 0, como `sin reserva`).
10. Orden de comprobación: primero el rol (valor inválido; después `cliente`, incluido el ausente) y luego se busca la reserva. `anular Sur mar --como cliente` responde `solo el responsable de sala puede anular`, exista o no la reserva.
11. «Quién anuló» es el rol (`cliente` o `responsable`), no una persona: la app no tiene usuarios. Solo el `responsable` puede anular, así que en la práctica el dato es siempre `responsable`; se guarda igualmente porque es lo que pide la feature.
12. `anuladas` lista en el orden de la lista de reservas. Una cancelada no sale en `anuladas`; `cancelar` sobre una anulada responde `sin reserva <sala> <día>`, como hoy.
13. La capacidad se llama `reservas` (la terminología de `PRODUCT.md` evita «booking»). El campo del código sigue la convención del código (`voidedBy`, como `status` y `room`); `cancelar` queda fuera de `reservas` por ahora.

### Hallazgos de la review

**Primera ronda:**

- **Aceptado** (Crítico, dominio 1 y técnica 7) — `capabilities/reservas.md` no existe → capacidad declarada nueva (decisión 2); el delta pasa de `MODIFIED` a `ADDED`.
- **Aceptado** (Crítico, técnica 1) — el AND de `anuladas` era un literal sin formato base → `anuladas` pasa a ser comando nuevo con formato fijado (decisión 3) y escenarios propios.
- **Aceptado** (Crítico, técnica 2) — faltaba `--como` ausente o inválido → decisión 5 y dos escenarios.
- **Aceptado** (Importante, técnica 3) — el AND del cliente partía de una reserva ya anulada → escenarios separados, cada uno con su GIVEN.
- **Aceptado** (Importante, dominio 2, 5 y técnica 5) — `anuladas` como `ADDED` encubierto y sin complemento del cliente; datos heredados → decisiones 3, 4 y 7 y escenarios de `anuladas`.
- **Aceptado** (Importante, dominio 3 y 4) — «de otros» sin escenario y `--como` ausente → decisión 7 y reserva sin dueño en el GIVEN.
- **Aceptado** (Importante, dominio 7, técnica 4 y 6) — reglas de la capacidad y decisiones sueltas → sección «Reglas de la capacidad» y decisiones 5 a 9.
- **Aceptado** (Menor, dominio 9) — `--como` no es seguridad → decisión 1.
- **Aceptado** (Menor, técnica 8) — `anuladas` sin lugar de prueba → «Dónde se prueba».
- **Aceptado** (Importante, dominio 6) — límite con `cancelar` → queda en «No entra» y `cancelar` no mira el rol.
- **Rechazado** (Menor, dominio 8) — incluir las canceladas en `anuladas` → motivo: `anuladas` lista solo las anuladas; una cancelación es otra cosa en `PRODUCT.md`.
- **Rechazado** (Menor, dominio 10) — sin cambio pedido; los valores son inventados.

**Segunda ronda** (revisor en Sonnet, sin tercera):

- **Aceptado** (Crítico 1, 2, 3) — `anuladas` sin `--como` o inválido sin escenario; escenario de rol inválido encadenado y no observable; THEN «anulada por responsable» no observable → escenarios separados, cada uno con su GIVEN y con `anuladas` como comprobación observable; decisión 11.
- **Aceptado** (Importante 4, 5, 6) — «Listar anuladas» mezclaba tres variantes; faltaba sala sin reserva y el orden de comprobación → escenarios separados y decisión 10.
- **Aceptado** (Importante 7, 8) — orden de `anuladas`, avisos enumerados, cancelada y `cancelar` sobre anulada → decisión 12 y regla de avisos.
- **Aceptado** (Menor 9, parcial) — capacidad renombrada a `reservas`, `cancelar` fuera por ahora (decisión 13).
- **Rechazado** (Menor 9, campo `anuladaPor`) — el código ya usa nombres en inglés (`status`, `room`) y la constitución pide castellano para interfaz y documentos, no para identificadores.
- **Aceptado** (Menor 10, ficheros) — ficheros listados en el Scope.
- **Rechazado** (Menor 10, nombre «Laura») — es el dev-lead del proyecto, aprobador real de la spec, no un dato de ejemplo.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de cualquiera y ver quién anuló; el cliente no debe poder ni lo uno ni lo otro.

## Scope

- Entra: `anular` con `--como`, el comando nuevo `anuladas`, y guardar quién anuló en la reserva. Ficheros: `src/app.js`, `test/anular.test.js`, `test/anuladas.test.js`.
- No entra: `cancelar` (no mira el rol); autenticación real.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- Anuladas: por `run('anuladas', …)`, en `test/anuladas.test.js`.

## Reglas de la capacidad

- Dónde vive el dato: campo `voidedBy` de la reserva, en memoria.
- Idioma de los nombres: español (`anular`, `anuladas`, `--como`, `cliente`, `responsable`).
- Límites: no aplica.
- Avisos (textos exactos): `solo el responsable de sala puede anular`, `solo el responsable de sala puede ver las anuladas`, `rol no válido: <valor>`, `sin reserva <sala> <día>`, `sin anuladas`.
- Orden de `anuladas`: el de la lista de reservas.
- Conflicto: anular lo ya anulado responde `sin reserva <sala> <día>`.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Anular una reserva**
- GIVEN una reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`
- AND `anuladas --como responsable` responde `Norte lun — anulada por responsable`

**ADDED — El cliente no anula**
- GIVEN una reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular`
- AND `anuladas --como responsable` responde `sin anuladas`

**ADDED — Anular sin rol**
- GIVEN una reserva activa de Norte del lun
- WHEN `anular Norte lun` sin `--como`
- THEN responde `solo el responsable de sala puede anular`
- AND `anuladas --como responsable` responde `sin anuladas`

**ADDED — Anular con rol inválido**
- GIVEN una reserva activa de Norte del lun
- WHEN `anular Norte lun --como admin`
- THEN responde `rol no válido: admin`
- AND `anuladas --como responsable` responde `sin anuladas`

**ADDED — El rol se comprueba antes que la reserva**
- GIVEN que no hay reserva de Sur del mar
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular`
- AND con `--como responsable` responde `sin reserva Sur mar`

**ADDED — Anular lo ya anulado**
- GIVEN Norte del lun anulada por `responsable`
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`

**ADDED — Listar anuladas**
- GIVEN Norte del lun anulada por `responsable` y Sur del mar activa
- WHEN `anuladas --como responsable`
- THEN responde `Norte lun — anulada por responsable`, sin la línea de Sur mar

**ADDED — Listar sin anuladas**
- GIVEN ninguna reserva anulada
- WHEN `anuladas --como responsable`
- THEN responde `sin anuladas`

**ADDED — El cliente no lista anuladas**
- GIVEN Norte del lun anulada por `responsable`
- WHEN `anuladas --como cliente`
- THEN responde `solo el responsable de sala puede ver las anuladas`
- AND sin `--como` responde lo mismo
- AND con `--como admin` responde `rol no válido: admin`

**ADDED — Una cancelada no es una anulada**
- GIVEN Norte del lun cancelada y Sur del mar anulada por `responsable`
- WHEN `anuladas --como responsable`
- THEN responde `Sur mar — anulada por responsable`
- AND `anular Norte lun --como responsable` responde `sin reserva Norte lun`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

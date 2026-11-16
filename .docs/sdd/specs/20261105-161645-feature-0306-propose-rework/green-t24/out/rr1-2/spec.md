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

- Nuevas: `bookings` — hoy no hay carpeta `capabilities/`; esta feature documenta `anular` y el listado `anuladas`: `anular` lo puede usar solo el responsable de sala y guarda quién anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores, más una segunda ronda de uno (Crítico aceptado) — señales: capacidad nueva, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~80 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. El cliente ve en `anuladas` la reserva anulada sin quién la anuló: `Norte lun — anulada`.
3. Capacidad nueva `bookings` (la coherencia halló que `.docs/sdd/capabilities/` no existe, así que el delta es `ADDED`, no `MODIFIED`).
4. El responsable es un único rol para todas las salas: el roadmap dice «cada sala», pero la app no tiene usuarios ni salas con responsable propio; modelarlo sería otra feature.
5. El cliente no puede `anular` ninguna reserva, ni la suya: para las propias ya está `cancelar`. Las reservas no guardan dueño, así que «de otros» no se puede distinguir.
6. Sin `--como`, se trata como `cliente` (lo más restrictivo). **Es un cambio incompatible**: hoy `anular Norte lun` funciona sin rol y pasa a rechazarse.
7. `anular` ya existe en `src/app.js` y no tiene rol; `anuladas` es un comando nuevo: lista las reservas con estado anulada, una por línea, todas las de cualquiera, y sin `--como` se trata como `cliente`. No lista las canceladas.
8. «Quién anuló» guarda el rol (`responsable`) en un campo nuevo de la reserva. Con un solo rol el dato es fijo; se guarda igual para que el listado ya lo tenga cuando haya más roles. Las reservas viven en memoria: no hay compatibilidad con datos guardados.
9. El permiso se comprueba antes que la existencia de la reserva, para que el cliente no sondee qué reservas existen. Un `--como` con valor desconocido (`--como admin`) responde `rol desconocido: admin`.
10. Contrato de salida: todo va por stdout y con código de salida 0, como el resto de mensajes de `app.js`; la denegación no cambia el código.
11. La cancelación tardía (PRODUCT.md limita la cancelación a antes de 24 h) queda fuera: hoy `cancelar` no comprueba el plazo y esta feature no lo toca.
12. Delta probado sobre una copia de `.docs/sdd` tras la segunda ronda: `sdd capability merge` → añadidos «Anular una reserva», «Solo el responsable anula» y «Listar anuladas»; `capabilities/` del repo sin tocar.

Política de modelos: en `delegate`, review de spec con el dominio en opus y la técnica en sonnet, segunda ronda en sonnet.

### Hallazgos de la review

Primera ronda (dos revisores):
- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 2.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 1); un fichero de roles sería la feature de usuarios.

Segunda ronda (un revisor, sonnet):
- **Aceptado** — Crítico · Delta · `anular` ya existía y el cambio de «cualquiera» a «solo el responsable» es incompatible → decisiones 6 y 7 y Intent.
- **Aceptado** — Crítico · Delta · un requisito agrupaba tres comportamientos → partido en tres requisitos, con denegación y listado vacío.
- **Aceptado** — Crítico · decisión 2 y 8 · «quién anuló» con un solo rol es un dato fijo → declarado en la decisión 8, se conserva.
- **Aceptado** — Importante · Delta · faltaban reserva inexistente, ya anulada o cancelada, `--como` desconocido y el orden permiso/existencia → escenarios y decisión 9.
- **Aceptado** — Importante · `anuladas` · sin `--como`, canceladas y alcance → decisión 7.
- **Aceptado** — Importante · decisión 5 y PRODUCT.md · cancelación tardía → decisión 11.
- **Aceptado** — Importante · cabecera y política · reviewers realmente usados y política suelta → bloque de la review y línea de política separada.
- **Aceptado** — Importante · Scope · dato nuevo y contrato de salida → Scope, decisiones 8 y 10.
- **Rechazado** — Menor · decisión 12 · mover la prueba del delta fuera de ✋ → el kit pide que su resultado esté en ✋.
- **Rechazado** — Menor · nombre `bookings` → el slug de una capacidad va en inglés kebab-case aunque el contenido esté en castellano.

## Intent

Hoy cualquiera anula cualquier reserva, y `anular` funciona sin decir quién es. El responsable de sala debe poder anular las de otros, y el cliente no: es un cambio incompatible, porque `anular` sin rol deja de funcionar.

## Scope

- Entra: `anular` con `--como` (en `src/app.js`), un campo nuevo en la reserva con quién anuló, el comando nuevo `anuladas`, y los tests en `test/anular.test.js`.
- No entra: `cancelar` y su plazo de 24 h, un responsable por sala, usuarios o dueño de la reserva.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada, con el rol `responsable` como quién anuló

**ADDED — Solo el responsable anula**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND `anular Norte lun` sin `--como` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND `anular Norte lun --como admin` responde `rol desconocido: admin` y la reserva sigue activa
- AND `anular Sur mar --como cliente`, sin reserva, responde `solo el responsable de sala puede anular`
- AND `anular Sur mar --como responsable`, sin reserva, responde `sin reserva Sur mar`
- AND `anular Norte lun --como responsable` sobre una reserva ya anulada o cancelada responde `sin reserva Norte lun`

**ADDED — Listar anuladas**
- GIVEN la reserva de Norte del lun anulada por el responsable
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`
- AND `anuladas --como cliente` y `anuladas` sin `--como` listan `Norte lun — anulada`
- AND sin reservas anuladas, `anuladas` no lista nada y no falla
- AND una reserva cancelada no aparece en `anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

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

🦆 Hoy `anular` lo puede usar cualquiera sobre cualquier reserva. Después de esto, el comando pide decir quién eres con `--como cliente` o `--como responsable`: solo el responsable anula, y el cliente recibe un aviso y la reserva sigue como estaba. Aparece además un comando nuevo, `anuladas`, que lista las anuladas: el responsable ve quién anuló cada una; el cliente solo ve que está anulada. No hay usuarios en la app, así que el rol se declara en la línea de comandos y no se comprueba contra nadie.

## Capacidades

- Nuevas: `reservas` — `anular` lo puede usar solo el responsable de sala, sobre reservas de cualquiera, y guarda quién anuló; `anuladas` las lista.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (la salida de `anular` y el comando nuevo `anuladas`), datos (quién anuló), reglas de visibilidad o permiso (el cliente no anula ni ve quién anuló) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

Política de modelos: revisores de la spec: dominio opus y técnica sonnet, más una segunda ronda en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Fusión del delta probada en una copia de `.docs/sdd`: `reservas.md: añadido «Anular una reserva»` y `reservas.md: añadido «Listar las anuladas»` (salida 0; el `capabilities/` del repo no cambia).

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. El valor guardado en «quién anuló» es el literal del rol (`responsable`), no una persona.
2. El cliente ve en `anuladas` la reserva anulada sin quién la anuló: `Norte lun — anulada`.
3. `reservas` es capacidad nueva: el proyecto aún no tiene `capabilities/` y el comando `anular` nunca se documentó como capacidad, así que el delta es ADDED, no MODIFIED. El comportamiento de hoy (cualquiera anula) queda descrito solo en el Intent.
4. Sin `--como`, o con un valor que no es `cliente` ni `responsable`, `anular` responde como al cliente: `solo el responsable de sala puede anular` (lo más restrictivo).
5. `anuladas` está abierto a los dos roles; no hay forma de reactivar una reserva anulada (no entra ningún comando para ello).
6. `anuladas` sin ninguna reserva anulada responde `sin anuladas`.
7. Anular una reserva que no está activa (no existe, ya anulada o cancelada) responde `sin reserva <sala> <día>`, como hoy.
8. «Quién anuló» vive en la propia reserva, en memoria, igual que `status`. Idioma: castellano (constitución). Límites, avisos y regla de conflicto: no aplican, la app es de un solo proceso y sin persistencia.
9. El nombre de la capacidad es `reservas`, no `bookings`: `bookings` es el término que PRODUCT.md manda evitar.

### Hallazgos de la review

Primera ronda (dos revisores):

- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 2.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 1).

Segunda ronda (un revisor, sonnet, por el Crítico aceptado):

- **Rechazado** — Crítico · ADDED es un MODIFIED encubierto → `capabilities/` no existe y la fusión rechaza un MODIFIED sin fichero; el estado previo solo está en el Intent (decisión 3).
- **Aceptado** — Crítico · un requisito agrupa cuatro comportamientos y `anuladas` no tiene escenario propio → dos requisitos, `Anular una reserva` y `Listar las anuladas`, el segundo parte de una reserva ya anulada.
- **Aceptado** — Crítico · escenarios ausentes (inexistente, doble anulación, rol inválido, lista vacía) → decisiones 4, 6 y 7 y sus escenarios.
- **Aceptado** — Importante · el estado «anulada»/«activa» no era observable → los escenarios lo comprueban con `anuladas`; y el valor guardado es el rol (decisión 1).
- **Aceptado** — Importante · `bookings` va contra PRODUCT.md → renombrada a `reservas` (decisión 9).
- **Aceptado** — Importante · falta qué ve y qué no el cliente → decisión 5.
- **Aceptado** — Importante · reglas de datos sin declarar → decisión 8.
- **Aceptado** — Importante · «responsable» frente a «responsable de sala» y PRODUCT.md «solo si» → el rol de la CLI es `responsable` (decisión 1) y PRODUCT.md ya define «Anulación» sin cambio: sale del Scope.
- **Aceptado** — Menor · razón de la decisión 3 → reformulada.
- **Rechazado** — Menor · «Laura» es nombre real → es el dev-lead del proyecto en el frontmatter, no un ejemplo del delta.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no.

## Scope

- Entra: `anular` con `--como` y el comando nuevo `anuladas`, que enseña quién anuló. Ficheros: `src/app.js` (`voidBooking`, `run`) y `test/anular.test.js` (nuevo).
- No entra: `cancelar`, `PRODUCT.md` (el término «Anulación» ya está definido).

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Anular una reserva**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva deja de estar activa
- AND con `--como cliente`, sin `--como` o con otro valor responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND una reserva que no está activa responde `sin reserva Norte lun`

**ADDED — Listar las anuladas**
- GIVEN la reserva de Norte del lun anulada por `anular Norte lun --como responsable`
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`
- AND `anuladas --como cliente` lista `Norte lun — anulada`
- AND sin ninguna reserva anulada, `anuladas` responde `sin anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

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

- Nuevas: `bookings` — anular una reserva: solo el responsable de sala, sobre reservas de cualquiera, y se guarda quién anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular` y el comando nuevo `anuladas`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que la salida de `anular` conserve `anulada Norte lun` y que `anuladas` y `--como` queden definidos sin ambigüedad (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

0. Capacidad nueva `bookings` (nombre en inglés, kebab-case): no hay `capabilities/` y ningún requisito escrito de `anular`. Hoy `anular` ya existe en `src/app.js`, sin permisos: el ADDED lo describe con la regla nueva.
1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. Sin `--como`, el rol es `cliente` (lo más restrictivo); un valor que no sea `cliente` ni `responsable` da `rol no válido: usa cliente o responsable`, sin caer en silencio a ningún rol. `--como` simula el permiso: sin usuarios no hay identidad real que comprobar.
3. `anuladas` es un comando nuevo: hoy no existe. Lista las reservas anuladas, una por línea. El estado vive en memoria y se pierde al salir del proceso, así que solo se prueba por `run()`, no por dos llamadas de terminal.
4. «El responsable de sala» es un único rol por flag; el roadmap dice «el responsable de cada sala»: el reparto por sala no entra (sin usuarios ni salas con dueño).
5. El cliente ve en `anuladas` la reserva anulada sin quién la anuló: `Norte lun — anulada`.
6. Lo que se guarda de «quién anuló» es el rol (`responsable`), no una persona. Ambos roles ven la lista completa de anuladas; solo el responsable ve quién anuló. Ni el cliente anula su propia reserva: sin usuarios no hay «dueño» que comprobar.
7. Reglas de la capacidad: datos en memoria del proceso · nombres en castellano · límites, avisos y conflicto: no aplica, salvo los textos de arriba.

- Política de modelos: revisores de la spec — dominio opus y técnica sonnet (primera ronda hecha) y una segunda ronda con un revisor sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Pasada de coherencia: corregido el MODIFIED sobre `bookings` (no existe) a ADDED con capacidad nueva; `anuladas` no existe en `src/app.js`, declarado como comando nuevo; `git grep` de `anular`, `anuladas` y `voided`: solo `src/app.js` (los literales `voided` y `anulada` salen igual) y `PRODUCT.md` (Anulación, sin cambio). Fusión del delta en una copia de `.docs/sdd` (fuera del repo): `bookings.md: añadido «Anular una reserva»`, sin errores; `capabilities/` del repo sin tocar.

### Hallazgos de la review

Segunda ronda (un revisor sonnet, por el Crítico aceptado):

- **Aceptado** — Crítico · Delta · el ADDED cambiaba el comportamiento actual sin decirlo → Intent: «Cambia el comportamiento actual».
- **Aceptado** — Crítico · Delta · faltaban reserva inexistente y ya anulada → dos AND con `sin reserva …`.
- **Aceptado** — Importante · `--como` inválido → AND y decisión 2 (error, sin caer a un rol).
- **Aceptado** — Importante · `anuladas` vacía, varias y qué se guarda → AND y decisión 6.
- **Aceptado** — Importante · visibilidad de cada rol y reserva propia del cliente → decisión 6.
- **Aceptado** — Importante · las cinco reglas por nombre → decisión 7.
- **Aceptado** — Menor · `test/cancel.test.js` solo se imita → Scope.
- **Aceptado** — Menor · por qué hay roles → decisión 2 (`--como` simula el permiso).
- **Rechazado** — Menor · sacar de ✋ la política de modelos y el mínimo → los exige la plantilla del kit en `delegate`; el ruido de la fusión sí se quitó de la decisión 0.

Primera ronda:

- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 5.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 1).

## Intent

Hoy cualquiera anula cualquier reserva. **Cambia el comportamiento actual**: pasa a anular solo el responsable de sala, sobre las de otros, y el cliente deja de poder hacerlo (también con la suya).

## Scope

- Entra: `src/app.js` (`anular` con `--como`, comando nuevo `anuladas`) y `test/anular.test.js`.
- No entra: `cancelar` (y `test/cancel.test.js`, que solo se imita como estilo), el reparto de responsables por sala, persistencia entre ejecuciones.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva**
- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND `anuladas --como responsable` lista `Norte lun — anulada por responsable`
- AND `anuladas --como cliente` lista `Norte lun — anulada`
- AND `anular Sur mar --como responsable`, sin reserva activa ese día, responde `sin reserva Sur mar`; repetir `anular Norte lun --como responsable` ya anulada responde `sin reserva Norte lun`
- AND `anular Norte lun --como admin` responde `rol no válido: usa cliente o responsable` y la reserva sigue activa
- AND `anuladas --como responsable` sin ninguna anulada responde `sin anuladas`; con varias, una por línea en el orden en que se anularon

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

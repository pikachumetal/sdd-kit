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

- Nuevas: `bookings` — anular una reserva (solo el responsable de sala) y ver quién anuló. El repo no tiene capacidades todavía: esta es la primera y arranca solo con lo que cambia esta feature.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (la salida de `anular` y el comando nuevo `anuladas`), reglas de visibilidad o permiso (qué NO puede hacer ni ver el cliente), datos (campo nuevo `voidedBy`) · tamaño: ~60 líneas en 2 ficheros
- Dominio (opus): si falta algo que el cliente no deba ver o hacer más allá de anular y de `anuladas` (señal: permiso), y si «sin `--como` = cliente» es la regla segura (señal: permiso)
- Técnica (sonnet): si `--como` entra bien en `run(cmd, params)` sin romper `cancelar`, `libres` ni `reservar --cada-semana`, y si `anuladas` encaja en el estado en memoria de `src/app.js` (señal: contrato público + datos)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo (el complemento de permisos y el encaje técnico a la vez)
```

1. Capacidad nueva `bookings` (nombre en inglés, kebab-case): no hay ninguna en `capabilities/` y el delta no puede ser `MODIFIED` de lo que no existe.
2. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios (PRODUCT.md).
3. Sin `--como`, el rol es `cliente`: lo más restrictivo, y evita que olvidar la opción dé permisos.
4. `anuladas` es un comando **nuevo** (hoy `src/app.js` no lo tiene: un comando desconocido responde `salas`). Su nombre y su salida los he puesto yo: `Norte lun — anulada por responsable`, con el rol y no una persona, porque no hay usuarios.
5. `anuladas` también es solo del responsable: si el cliente pudiera listarlas vería quién anuló, que es justo lo que el Intent le quita.
6. Textos de rechazo, literales: `solo el responsable de sala puede anular` y `solo el responsable de sala puede ver las anuladas`.
7. Anular una reserva ya anulada responde `sin reserva <sala> <día>`, como hoy (`findBooking` solo ve las activas): no cambia.
8. ⚠️ **Limitación que no puedo resolver yo**: las reservas viven en memoria y cada comando de terminal es un proceso nuevo. `anular` y después `anuladas` en dos invocaciones **no se ven**: `anuladas` saldría vacía. Solo se observa en un mismo proceso (los tests, por `run`). Persistir queda en «No entra». ¿Lo aceptas así o quieres una feature de persistencia antes?
9. Enfoque: `run` lee `--como` de `params` y comprueba el rol dentro de `voidBooking` (frente a: comprobarlo en `run`, o un módulo de roles aparte; ver Approach).
- Política de modelos: revisores de la spec — dominio opus, técnica sonnet, pendiente de tu confirmación de paralelizar · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Pasada de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` rechazó la primera versión (`«bookings» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`); corregida, la segunda pasada sale con exit 0: `bookings.md: añadido «Anular una reserva»`, `«Solo el responsable anula»`, `«Solo el responsable ve quién anuló»` y las cinco reglas (el `capabilities/` del repo no cambia). `git grep` de `anular`/`anulad` fuera de las carpetas de evidencia: solo `src/app.js:24,31` y la fila 0011 del roadmap; nada se retira.

### Decisiones tomadas con el dev-lead

- Ninguna todavía: la spec no está delegada.

## Intent

Hoy cualquiera anula cualquier reserva, y `src/app.js` no guarda quién lo hizo. El responsable de sala debe poder anular las de otros y ver quién anuló; el cliente no puede ninguna de las dos cosas. Éxito: con `--como cliente` (o sin él) la reserva sigue activa y no se ve quién anuló; con `--como responsable` se anula y `anuladas` lo cuenta.

## Scope

- Entra: `anular` con `--como`; el comando nuevo `anuladas`; el campo `voidedBy` de la reserva. Ficheros: `src/app.js` (`voidBooking`, `run`) y `test/anular.test.js` (nuevo).
- No entra: `cancelar` (sigue sin rol), persistir reservas entre invocaciones, usuarios o login, cambiar `libres` o `reservar`.

## Approach

- A — `run` lee `--como` y `voidBooking(room, day, role)` decide: un solo sitio con la regla, mismo patrón que `cancelBooking`. **Elegido**: es lo mínimo y deja la regla testeable por `run`.
- B — comprobar el rol en `run` antes de llamar a `voidBooking`: deja la función sin regla y la regla repartida si luego `cancelar` también la quiere.
- C — módulo `roles.js`: no compensa con un solo permiso y sin usuarios.

## Dónde se prueba

- Anular y listar: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva deja de estar activa
- AND `anuladas --como responsable` lista `Norte lun — anulada por responsable`

#### ADDED — Solo el responsable anula

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND `anular Norte lun`, sin `--como`, responde lo mismo

#### ADDED — Solo el responsable ve quién anuló

- GIVEN Norte del lun anulada por el responsable
- WHEN `anuladas --como cliente`
- THEN responde `solo el responsable de sala puede ver las anuladas` y no lista ninguna reserva
- AND `anuladas`, sin `--como`, responde lo mismo

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, en la reserva de `src/app.js` (campo nuevo `voidedBy`), como el resto; no persisten entre invocaciones.
- **Idioma de los nombres**: castellano en comandos y textos (`anular`, `anuladas`, `--como`); `responsable` y `cliente` como valores.
- **Límites**: no aplica.
- **Avisos**: `solo el responsable de sala puede anular` y `solo el responsable de sala puede ver las anuladas`.
- **Regla ante conflicto**: anular una reserva que no está activa responde `sin reserva <sala> <día>`.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

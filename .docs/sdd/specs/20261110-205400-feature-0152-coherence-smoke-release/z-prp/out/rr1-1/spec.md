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

🦆 Hoy cualquiera puede anular cualquier reserva con `anular Norte lun`. Con esta feature, `anular` pide `--como responsable`: así `anular Norte lun --como responsable` responde `anulada Norte lun`, y con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa. Además aparece el listado `anuladas`, que al responsable le enseña quién anuló (`Norte lun — anulada por responsable`) y al cliente no (`Norte lun — anulada`). Por dentro, la reserva anulada guarda quién la anuló y `run` lee `--como` de los parámetros.

Validación: dev-lead — lo usa una persona (permiso por rol y texto de las respuestas).

## Capacidades

- Nuevas: `bookings` — reservas de salas: hoy anular; el comportamiento previo de `anular` (sin rol) se recoge aquí ya con la regla nueva.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: nueva capacidad (`bookings`), reglas de visibilidad o permiso, datos (quién anuló), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. El cliente ve en `anuladas` la reserva anulada sin quién la anuló: `Norte lun — anulada`.
3. `bookings` no tiene fichero en `capabilities/`: la declaro **nueva** (nombre `bookings`) y el requisito va como `ADDED`, no `MODIFIED`: no hay requisito previo que modificar.
4. Sin `--como`, `anular` actúa como `cliente` (lo más restrictivo) y responde `solo el responsable de sala puede anular`.
5. `anuladas` sin ninguna reserva anulada responde `sin anuladas`.
6. Enfoque: A (rol por parámetro `--como`), frente a B (fichero de roles) y C (variable de entorno) — ver Approach.
7. Validación: dev-lead, porque lo usa una persona.
8. El campo guardado se llama `voidedBy` y guarda el rol (`responsable`), no un nombre: la app no tiene usuarios.
9. Un `--como` con valor distinto de `cliente|responsable` (o sin valor) se trata como `cliente`, en `anular` y en `anuladas`: nadie escala permisos por escribir mal el rol.
10. `anuladas` sin `--como` actúa como `cliente` (misma regla restrictiva que la 4).
11. Con el permiso denegado, `anular` responde `solo el responsable de sala puede anular` aunque la reserva no exista: el permiso se mira antes que la existencia, para no filtrar qué reservas hay.
12. Anular una reserva ya anulada responde `sin reserva <sala> <día>` (como hoy: `findBooking` solo ve activas) y no toca `voidedBy`. `anuladas` lista en orden de anulación, una línea por reserva.
13. Reglas del dato nuevo `voidedBy`: vive en la reserva, en memoria (la app no persiste); nombres de campo y flag en inglés/ASCII, textos de respuesta en castellano; sin límites ni avisos nuevos (no aplica); conflicto: ya cubierto en la 12.
14. `cancelar` sigue sin rol: queda fuera del Scope por petición del roadmap («anular»); riesgo conocido: un cliente puede cancelar aunque no anular.
15. `bookings` se declara nueva, pero el comportamiento previo (`libres`, `reservar`, `cancelar`) no está en `capabilities/`: solo entra lo que esta feature toca; es un cambio de `anular` de «cualquiera» a «solo el responsable» (ruptura declarada).


- Política de modelos: revisores de la spec dominio opus + técnica sonnet, y segunda ronda sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 2.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 1).

Segunda ronda (un revisor sonnet, por el Crítico aceptado; sin Críticos nuevos, no hay tercera):

- **Aceptado** — Importante · Delta · `anuladas` sin escenario propio ni estado previo → requisito `ADDED — Listar reservas anuladas` con su GIVEN.
- **Aceptado** — Importante · Delta · `anuladas` sin `--como` → AND y decisión 10.
- **Aceptado** — Importante · Delta · `--como` inválido → AND con `--como admin` y decisión 9.
- **Aceptado** — Importante · Delta · bordes (reserva inexistente, ya anulada, precedencia permiso/existencia) → ANDs y decisiones 11 y 12.
- **Aceptado** — Importante · Delta · orden y multiplicidad de `anuladas` → AND con dos reservas, decisión 12.
- **Aceptado** — Importante · ✋ · reglas del dato nuevo sin declarar → decisión 13.
- **Aceptado** — Menor · Scope · `cancelar` sin rol → decisión 14 (riesgo conocido).
- **Aceptado** — Menor · Capacidades · `bookings` nueva con comportamiento previo fuera de `capabilities/` → decisión 15.
- **Aceptado** — Menor · ✋ · política de modelos mezclada con la lista → separada, se confirma al aprobar.
- **Aceptado** — Menor · Delta · `anuladas` escondido bajo «Anular una reserva» → requisito propio.

### Repaso de coherencia

- `sdd capability merge` sobre una copia rechazó `bookings` (sin fichero en `capabilities/` y no declarada en «Nuevas»): corregido con la decisión 3; la fusión sobre una copia de `.docs/sdd` ahora da: `bookings.md: añadido «Anular una reserva»` y `bookings.md: añadido «Listar reservas anuladas»`, salida 0 (el `capabilities/` del repo no cambia).
- `anuladas` no existe hoy en `src/app.js`: es un comando nuevo, no solo un campo nuevo; entra en el Scope.

### Decisiones tomadas con el dev-lead

- Ninguna: la spec va por el gate de `delegate`.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no. Éxito: con `--como cliente` ninguna reserva se anula ni se ve quién anuló; fracaso aunque funcione: que el cliente vea quién anuló por el listado.

## Scope

- Entra: `anular` con `--como` y quién anuló, en `src/app.js` (`voidBooking`, `run`); el comando nuevo `anuladas`; `test/anular.test.js`.
- No entra: `cancelar`, `README.md` y `CHANGELOG.md` (no nombran `anular`; el changelog lo cierra la release).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` sin rol (cualquiera anula) | `src/app.js:31`, `voidBooking` en `src/app.js:20-25` | delta `ADDED`, THEN con `--como cliente` y sin `--como` (decisión 4) |
| Respuesta `anulada <sala> <día>` sin más | `src/app.js:24` | se mantiene igual con `--como responsable` (delta) |

- Filas que implementa: 0011 → `ROADMAP.md:8` (la fila se cierra al archivar) | nada más: comprobado con `git grep -nE "0011|anular|anuladas" -- . ':!.docs/sdd/specs'`.

## Approach

- A. Rol por parámetro `--como <cliente|responsable>` — cuesta un parámetro nuevo en `run`, sin identidad real; es lo único posible sin usuarios.
- B. Fichero de roles — cuesta un fichero y una lectura de disco que la app no tiene.
- C. Variable de entorno — cuesta un estado oculto que los tests deben fijar.
- Elegido: A — la app es un script sin usuarios y sus tests llaman a `run(cmd, params)`; `--como` viaja en `params` como `--cada-semana`.

`voidBooking(room, day, role)` comprueba el rol y guarda `voidedBy`; `anuladas` lee `bookings` con `status === 'voided'`.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`.

## Términos y ADR

- Términos resueltos: responsable — el rol que puede anular; cliente — el rol que no puede.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND sin `--como` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND con `--como admin` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND `anular Sur mar --como cliente` (sin reserva) responde `solo el responsable de sala puede anular`
- AND `anular Norte lun --como responsable` por segunda vez responde `sin reserva Norte lun`

#### ADDED — Listar reservas anuladas

- GIVEN la reserva de Norte del lun anulada con `anular Norte lun --como responsable`
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`
- AND `anuladas --como cliente` lista `Norte lun — anulada`
- AND `anuladas` sin `--como` lista `Norte lun — anulada`
- AND con Norte lun y Sur mar anuladas, en ese orden, `anuladas --como responsable` lista dos líneas: `Norte lun — anulada por responsable` y `Sur mar — anulada por responsable`
- AND con `anular Norte lun --como cliente` rechazado, `anuladas --como responsable` responde `sin anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

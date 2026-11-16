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

🦆 Hoy cualquiera puede anular cualquier reserva. Con este cambio, `anular Norte lun --como responsable` anula la reserva y `anuladas` la lista como `Norte lun — anulada por responsable`; con `--como cliente`, responde `solo el responsable de sala puede anular` y la reserva sigue activa. Por dentro, `anular` lee el rol de `--como` y guarda quién anuló.

Validación: dev-lead — es una regla de permisos que una persona usa desde la CLI.

## Capacidades

- Nuevas: `bookings` — reservas de salas: hoy sin fichero en `capabilities/`; esta spec documenta solo `anular` y `anuladas`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: reglas de visibilidad o permiso (el cliente no anula ni ve quién anuló), datos (quién anuló), contrato público (la salida de `anular` y `anuladas`), capacidad nueva (`bookings`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): si falta lo que el cliente no puede hacer (anular, también las suyas) y si «responsable de sala» cubre el «de cada sala» de la fila 0011 (señal: permiso)
- Técnica (sonnet): que `anuladas` y el `anular` sin `--como` no rompan la salida que ya consumen `test/` y quien use la CLI (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. Sin `--como`, `anular` se comporta como `cliente` (el caso restrictivo): cambia el `anular` de hoy, que no pedía rol.
3. El cliente no anula ninguna reserva, tampoco las suyas: las reservas no guardan quién las hizo, así que la fila 0011 («reservas de otras personas») no se puede distinguir en el código.
4. «Responsable de cada sala» (fila 0011) se queda en un único rol `responsable`, sin saber de qué sala: la app no tiene responsables por sala.
5. Textos literales: `solo el responsable de sala puede anular` y `Norte lun — anulada por responsable`.
6. `anuladas` no existe hoy: es un comando nuevo; una sola línea por reserva anulada, en el orden en que se anularon, y sin anuladas responde `sin anuladas`.
7. Capacidad nueva `bookings` (nombre en inglés, kebab-case), sin fichero hoy: documenta solo `anular` y `anuladas`.
8. Un `--como` con otro valor responde `rol no válido: usa cliente o responsable` y no anula.
- Política de modelos: revisores de la spec Opus (dominio) y Sonnet (técnica) si se aprueba el nivel propuesto, o ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no. Éxito: con `--como cliente` ninguna reserva cambia de estado, y toda anulada dice quién la anuló.

## Scope

- Entra: `anular` con `--como` (`src/app.js`), el comando `anuladas` (`src/app.js`) y sus tests (`test/anular.test.js`).
- No entra: `cancelar`; los roles reales de usuario; el responsable por sala.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` sin rol, que anula siempre | `src/app.js:23-28` (`voidBooking`), `src/app.js:36` | delta (`ADDED` de «Anular una reserva») · decisión 2 |

- Filas que implementa: 0011 → `.docs/sdd/roadmap.md` la nombra y pasa a ✅ al cerrar · `grep -rn "0011"` fuera de la spec: solo el roadmap.

## Approach

`anular` recibe `--como`; el rol y la anulación se guardan en la reserva (`voidedBy`), y `anuladas` recorre las anuladas.

## Dónde se prueba

- Anular y anuladas: por `run('anular', …)` y `run('anuladas', [])`, en `test/anular.test.js`, como `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: responsable — rol que anula reservas, lo da `--como responsable`; cliente — el que no anula.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND sin `--como` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND con `--como invitado` responde `rol no válido: usa cliente o responsable` y la reserva sigue activa

#### ADDED — Listar las anuladas

- GIVEN Norte del lun anulada por `responsable`
- WHEN `anuladas`
- THEN responde `Norte lun — anulada por responsable`
- AND sin ninguna anulada responde `sin anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

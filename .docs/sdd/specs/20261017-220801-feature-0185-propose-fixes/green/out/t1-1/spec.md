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

🦆 Hoy cualquiera escribe `anular Norte lun` y la reserva desaparece. Con esto, `anular Norte lun --como Luis` responde «solo Ana anula reservas de Norte» y la reserva sigue; `--como Ana` responde «anulada Norte lun». Por dentro, `anular` consulta quién es el responsable de la sala en `data/managers.json` y compara con el nombre dado.

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — de momento solo anular una reserva (no existe ningún fichero en `capabilities/`; el resto de reglas de reservas queda sin documentar y no es de esta feature).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`room-managers`), datos (`data/managers.json`), regla de permiso (quién no puede anular) = 3 · tamaño: ~30 líneas en 4 ficheros
- Mínimo razonable: ninguna — deja sin mirar si el solape con la 0009 (decisión 5) contradice algo que Laura ya tenga en la cabeza.

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`). Los nombres son de ejemplo: **Laura, dime los reales**.
2. Quien ejecuta el comando se identifica con `--como <nombre>`; es solo declarativo, no hay login (`operations.md`: «sin login»), así que no impide suplantar.
3. Capacidad nueva `bookings` (slug en inglés), porque `capabilities/` está vacío y `capability merge` rechaza un `MODIFIED` sobre una capacidad que no existe. Por eso el requisito es un `ADDED` y no un `MODIFIED`.
4. Textos literales: «solo Ana anula reservas de Norte», «falta --como», «Este no tiene responsable» (con el responsable y la sala de cada caso).
5. **Solape con la 0009** (roadmap: «Responsables de sala: quién responde de cada sala y qué puede hacer», y `docs/config.md` dice que «su fichero lo define la 0009»). Esta spec define el fichero y la consulta del responsable, lo mínimo que necesita anular. Mi recomendación: la 0011 define solo eso, la 0009 se queda con «qué más puede hacer» y se reescribe su fila al cerrar. Alternativa: hacer antes la 0009. Dime cuál.
6. Orden de comprobación: primero `--como`, luego el responsable de la sala, y solo después si hay reserva. Quien no es responsable nunca averigua si hay reserva.
7. Anular su propia reserva sin ser responsable también se rechaza: para eso está `cancelar`, que no cambia.
8. Término «Responsable de sala» (evitar «dueño»), ya usado en `PRODUCT.md` en «Anulación».
- Prueba del delta con `sdd capability merge` sobre una copia: `room-managers` (2 requisitos y 1 regla) y `bookings` (1 requisito) se añaden sin rechazos.
- Política de modelos: sin revisores de la spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas. Éxito: un no responsable nunca consigue anular, y el responsable sigue anulando como hoy. Fracaso aunque funcione: que el rechazo cambie el estado de la reserva o revele si existe.

## Scope

- Entra: `anular <sala> <día> --como <nombre>`; `data/managers.json`; `docs/config.md` (deja de decir que no hay responsables ni ficheros); tests.
- No entra: cancelar la propia reserva, que sigue igual; login o verificación real de identidad; qué más puede hacer un responsable (0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` sin control de quién lo ejecuta | `src/app.js:20` (`voidBooking`), `src/app.js:31` | Scope; delta de `bookings` |
| «Hoy no hay ninguno» (ficheros de `data/`) | `docs/config.md:3` | Scope |
| «Responsables de sala: aún no hay… los define la 0009» | `docs/config.md:4` | Scope; decisión 5 |
| Término «Anulación» (por el responsable de sala) | `PRODUCT.md:10` | sin cambio: ya es coherente |

- Filas que implementa: 0011 → `roadmap.md:9`, se marca al cerrar; solape con 0009 (`roadmap.md:8`, `docs/config.md:4`) → decisión 5. Búsqueda en `capabilities/` y `skills/`: no existen en el proyecto.

## Approach

`anular` lee `data/managers.json` y rechaza a quien no es responsable de la sala.

## Dónde se prueba

- Anular con y sin responsable: por `run('anular', [...])`, como los tests de `test/cancel.test.js`.
- Responsable de una sala: por `run`, mismo patrón.

## Términos y ADR

- Términos resueltos: Responsable de sala — la persona que `data/managers.json` asigna a una sala.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-managers`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se pregunta el responsable de Norte
- THEN es Ana

**ADDED — Una sala sin responsable lo dice**
- GIVEN `data/managers.json` sin entrada para Este
- WHEN se pregunta el responsable de Este
- THEN responde «Este no tiene responsable»

**Reglas de la capacidad**
- **Dónde viven los datos**: `data/managers.json`, una entrada sala → nombre.

### Capacidad: `bookings`

**ADDED — Anular una reserva**
- GIVEN la reserva de Norte del lunes, de Pedro, y Ana responsable de Norte
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»
- AND `anular Norte lun` responde «falta --como» y la reserva sigue activa
- AND `anular Este lun --como Ana`, con Este sin responsable, responde «Este no tiene responsable»

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |

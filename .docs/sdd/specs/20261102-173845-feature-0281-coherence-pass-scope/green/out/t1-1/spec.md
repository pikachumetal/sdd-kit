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

🦆 Hoy `anular Norte lun` anula la reserva de quien sea. Con esto hará falta decir quién eres: `anular Norte lun --como Luis` responde «solo Ana anula reservas de Norte» y la reserva sigue, y `--como Ana` responde «anulada Norte lun». Quién responde de cada sala se lee de `data/managers.json`.

Validación: dev-lead — es un comando que usa una persona y la regla decide quién puede qué.

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — `.docs/sdd/capabilities/` está vacío, así que no existe un fichero vivo que modificar; arranca con el requisito de anular.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`room-managers`, `bookings`), dato persistente nuevo (`data/managers.json`), regla de permiso (quién no puede anular) · tamaño: ~30 líneas en 3 ficheros. Son 3 señales: por defecto no se propone review.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.
- Fusión de prueba (`sdd capability merge` en una copia): `room-managers.md` añadido «Cada sala tiene un responsable» y «Una sala sin responsable lo dice»; `bookings.md` añadido «Anular una reserva». Sin errores.

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`).
2. Quien ejecuta el comando se identifica con `--como <nombre>`.
3. **Choca con la 0009** (fila pendiente «Responsables de sala», antes que esta en el roadmap; `docs/config.md:4` dice «quién es cada uno y su fichero los define la 0009»). Esta spec define ya el fichero y la capacidad `room-managers`. Recomendación: que la 0011 los defina y la 0009 se reduzca a «qué puede hacer» el responsable; si no, la 0011 espera a la 0009 y pierde la capacidad nueva.
4. `bookings` pasa a «Nuevas» (y el requisito a `ADDED`) porque `sdd capability merge` rechaza un `MODIFIED` sobre una capacidad sin fichero.
5. Huecos que cubro con estos valores, sin que nadie los dijera: `anular` sin `--como` responde «indica quién eres con --como»; sala sin responsable en el fichero responde «Sur no tiene responsable»; una persona sin ser responsable que anula su propia reserva con `anular` queda rechazada igual (la anulación es del responsable, `PRODUCT.md`); comparación de nombres exacta, distingue mayúsculas.
6. Validación: dev-lead.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas. Éxito: un no responsable nunca consigue anular una reserva con `anular`; fracaso aunque funcione: que `--como` falte y se anule igual.

## Scope

- Entra: `anular <sala> <día> --como <nombre>`; `data/managers.json`; actualizar `docs/config.md:4`.
- No entra: cancelar la propia reserva (`cancelar`), que sigue igual; autenticar de verdad a quien escribe `--como` (es un nombre declarado, la herramienta la usa una sola persona, `mission.md`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` sin identidad (`anular <sala> <día>`) | `src/app.js:20-25,31` (`voidBooking`, `run`) | Scope y escenario de `bookings`: sin `--como` se rechaza (decisión 5) |
| «Responsables de sala: aún no hay… los define la 0009» | `docs/config.md:4` | Scope: se reescribe apuntando a `data/managers.json` (decisión 3) |

- Filas que implementa: 0011 → `docs/config.md:4` nombra la 0009 y se reescribe (decisión 3); ningún otro fichero nombra la 0011 salvo el roadmap, comprobado con `grep -rn "0011"`.

## Approach

`anular` lee `data/managers.json` y rechaza a quien no es responsable de la sala.

## Dónde se prueba

- `anular` con y sin responsable, sin `--como`, sala sin responsable: por `run('anular', …)`, como `test/cancel.test.js`.
- Lectura de `data/managers.json`: por `run`, con un fichero de fixture, en el mismo estilo.

## Términos y ADR

- Términos resueltos: Anulación — la hace el responsable de sala (`PRODUCT.md`); Cancelación — el propio cliente.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-managers`

#### ADDED — Cada sala tiene un responsable

- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se pregunta el responsable de Norte
- THEN es Ana

#### ADDED — Una sala sin responsable lo dice

- GIVEN `data/managers.json` con `{"Norte": "Ana"}`
- WHEN `anular Sur lun --como Ana`
- THEN responde «Sur no tiene responsable» y la reserva sigue activa

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva de Norte del lunes, de Pedro, y Ana responsable de Norte
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»
- AND `anular Norte lun` responde «indica quién eres con --como» y la reserva sigue activa

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |

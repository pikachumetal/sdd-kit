---
id: 20261101-122449-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-01
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-01
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela la reserva sin dejar rastro de por qué. Con este cambio hay que decir el motivo, uno de tres (`cambio-de-planes`, `sala-ocupada`, `otro`): `cancelar Norte lun sala-ocupada`. Sin motivo, o con uno que no está en la lista, no se cancela nada y el mensaje da la lista. Un comando nuevo, `canceladas`, enseña cada reserva cancelada con su motivo: `Norte lun 10:00-12:00 · sala ocupada`.

Validación: dev-lead — es un comando que usa una persona; lo que sale por pantalla lo valida quien lo usa.

## Capacidades

- Nuevas: `bookings` — cancelar una reserva con motivo y listar las canceladas

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`bookings`) · tamaño: ~30 líneas en 2 ficheros
- Mínimo razonable: ninguna; el cambio cabe en un comando y su listado, y el repaso de coherencia ya cruzó cada literal.

1. Capacidad nueva `bookings` (el proyecto no tiene ninguna): recoge solo lo que añade esta feature; el resto de la cancelación actual no se documenta aquí.
2. Los motivos se escriben como argumento, en kebab-case, sin espacios: `cambio-de-planes`, `sala-ocupada`, `otro` (los tres que pediste). Se escribe `cancelar <sala> <día> <motivo>`.
3. Sin motivo: `indica un motivo. Elige: cambio-de-planes, sala-ocupada, otro`. Motivo fuera de la lista: `motivo no válido: vacaciones. Elige: cambio-de-planes, sala-ocupada, otro` (con el motivo que se escribió). En ambos casos la reserva sigue activa.
4. Si no hay reserva activa, `cancelar` sigue diciendo `sin reserva <sala> <día>` antes de mirar el motivo (así el test actual de «sin reserva» no cambia).
5. Al cancelar bien, el mensaje no cambia: `cancelada Norte lun`; el motivo no se repite.
6. Nombre y formato del listado: comando `canceladas` (la roadmap pide «el listado de canceladas» y hoy no existe). Una línea por reserva cancelada: `<sala> <día> <franja> · <motivo con espacios>`, en el orden en que se cancelaron (el de la lista interna). Sin canceladas: `sin canceladas`. Las anuladas por el responsable no salen: no tienen motivo (las trata la 0011).
7. El motivo se guarda en la reserva, en memoria, como el resto (no hay base de datos).
8. Término nuevo en `PRODUCT.md`: «Motivo de cancelación» (lo escribe el cierre).
- Fusión de prueba (copia en carpeta temporal): `sdd capability merge` → 6 requisitos y 5 reglas añadidos a `bookings.md`, sin rechazos; `capability check` → capacidades válidas: 1.
- Política de modelos: sin revisores de spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Parar al tener el commit de la Task 1 — misma frase.
- Lista de motivos: cambio de planes, sala ocupada, otro — «de una lista: cambio de planes, sala ocupada, otro».

## Intent

Hoy cancelar una reserva no deja motivo, y la fila 0010 del roadmap pide que se elija uno de una lista y que el listado de canceladas lo enseñe. Éxito: cualquier cancelación nueva lleva uno de los tres motivos y se ve en `canceladas`. Fracaso aunque «funcione»: que una cancelación sin motivo, o con un motivo inventado, se guarde igualmente.

## Scope

- Entra: `cancelar` exige motivo de la lista; comando `canceladas`; los tests de ambos; el test actual de «cancelar una reserva activa» pasa a llevar motivo.
- No entra: anular reservas de otros (0011); avisos por correo; exportar a calendario; validar la regla de las 24 h de `PRODUCT.md`; motivo en texto libre; motivos de reservas ya canceladas antes (no hay datos persistentes, viven en memoria).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` pasa a `cancelar <sala> <día> <motivo>` | `src/app.js` (`run`, `cancelBooking`) · `test/cancel.test.js:5` · `.docs/sdd/roadmap.md:7` y `changelog.md:20` (solo la citan, no cambian) | Scope; decisión 2; el test se actualiza en la Task 1 |
| `PRODUCT.md:9` define «Cancelación» sin motivo | `PRODUCT.md` | decisión 8: se añade el término; la definición no cambia |

- Filas que implementa: 0010 → `roadmap.md:7` (pasa a ✅ en el cierre) | nada más: comprobado con `grep -rn "0010\|cancel"` en el repo.

## Approach

`cancelBooking(room, day, reason)` valida el motivo contra la lista cerrada, lo guarda en la reserva y deja el estado `cancelled` como hoy. `run('cancelar', …)` le pasa el tercer argumento. Un `cancelledBookings()` arma las líneas de `canceladas`. Todo en `src/app.js`, sin dependencias.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con motivo no válido: por `run('cancelar', …)`, como los tests de `test/cancel.test.js`.
- Listado `canceladas`: por `run('canceladas', [])`, en su propio fichero de test (el estado vive en memoria y el aislamiento es por proceso de `node --test`).

## Términos y ADR

- Términos resueltos: Motivo de cancelación — una de tres razones (cambio de planes, sala ocupada, otro) que se da al cancelar una reserva.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar una reserva exige un motivo

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun sala-ocupada`
- THEN la salida es `cancelada Norte lun`
- AND la reserva queda cancelada con el motivo `sala-ocupada`

#### ADDED — Sin motivo no se cancela

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun`
- THEN la salida es `indica un motivo. Elige: cambio-de-planes, sala-ocupada, otro`
- AND la reserva sigue activa

#### ADDED — Un motivo fuera de la lista no se acepta

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun vacaciones`
- THEN la salida es `motivo no válido: vacaciones. Elige: cambio-de-planes, sala-ocupada, otro`
- AND la reserva sigue activa

#### ADDED — Cancelar sin reserva lo dice antes que el motivo

- GIVEN que no hay reserva activa de Sur el martes
- WHEN `cancelar Sur mar` (sin motivo)
- THEN la salida es `sin reserva Sur mar`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN la reserva Norte lun 10:00-12:00 cancelada con `sala-ocupada`
- WHEN `canceladas`
- THEN la salida es `Norte lun 10:00-12:00 · sala ocupada`

#### ADDED — Sin canceladas el listado lo dice

- GIVEN que no se ha cancelado ninguna reserva
- WHEN `canceladas`
- THEN la salida es `sin canceladas`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, en la propia reserva (sin base de datos, ver `operations.md`).
- **Idioma de los nombres**: castellano; los motivos se escriben en kebab-case y se listan con espacios.
- **Límites**: lista cerrada de tres motivos: `cambio-de-planes`, `sala-ocupada`, `otro`.
- **Avisos**: `indica un motivo. Elige: cambio-de-planes, sala-ocupada, otro` · `motivo no válido: <motivo>. Elige: cambio-de-planes, sala-ocupada, otro`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-01 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |

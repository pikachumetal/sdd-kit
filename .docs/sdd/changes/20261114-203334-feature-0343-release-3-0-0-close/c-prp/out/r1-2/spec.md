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

- Nuevas: `responsables-de-sala` — quién es responsable de cada sala y qué pasa cuando no se sabe.
- Nuevas: `reservas` — hoy no tiene fichero en `capabilities/`; nace parcial, solo con las reglas de anular (reservar y cancelar siguen sin documentar).

## Decisiones que he tomado yo — valida estas

1. `responsables-de-sala` es capacidad nueva, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`), un solo nombre por sala.
2. Quien ejecuta el comando se identifica con `--como <nombre>`; es un control de intención, no de seguridad: nada impide escribir el nombre de otro. Sin `--como` o sin valor, `anular` responde «indica quién anula con --como» y no anula. La comparación de nombres es exacta: distingue mayúsculas y no recorta espacios.
3. `reservas` entra como capacidad nueva y sus requisitos van `ADDED`, no `MODIFIED`: `capability merge` rechazó el `MODIFIED` porque no existe fichero que modificar.
4. Las reservas no guardan hoy quién las hizo (ni siquiera `reservar` lo pide), así que la regla no mira de quién es la reserva: `anular` es el acto del responsable de sala (PRODUCT.md, «Anulación»), sea de quien sea.
5. `data/managers.json` ausente, sin la sala o sin ese nombre: nadie anula y responde «la sala Este no tiene responsable» (con el nombre de la sala). Si el fichero existe pero no es JSON, o no tiene la forma `{"Sala": "Nombre"}` (valores que no son texto, raíz que no es objeto), responde «managers.json no es válido» y no anula. La ruta se resuelve desde la raíz del proyecto, no desde el directorio donde se ejecuta; los tests usan un fichero propio de pruebas.
6. Las cinco reglas van en «Reglas de la capacidad» de cada capacidad.
7. Política de modelos: la de `sdd-kit.json` (`execution: native`, sin cambios).
8. **Consecuencia que te dejo a ti:** quien no es responsable pierde `anular` incluso para su propia reserva; le queda `cancelar`, que solo vale antes de 24 h, y pasadas las 24 h no puede quitar su reserva. Si no lo quieres, dime qué debe poder hacer.
9. `managers.json` se edita a mano; ningún comando cambia responsables y el responsable no tiene más poder que anular en su sala.
10. Orden de comprobaciones de `anular`: `--como` → responsable de la sala (fichero válido, sala con responsable, nombre igual) → existe la reserva (si no, «sin reserva Norte mar», como hoy).
11. `cancelar` no usa `--como` y no cambia.
12. **Pregunta abierta, no resuelta por mí:** PRODUCT.md dice que solo hay un usuario («No hay más usuarios»); una regla de permisos entre personas no encaja con eso. No toco «Product Purpose» en esta feature; decídelo al aprobar (por ejemplo, con una enmienda a PRODUCT.md).

### Review de spec propuesta

Dos revisores — señales: capacidad nueva (`responsables-de-sala` y `reservas`, que no tenía fichero), contrato público (`--como` en la CLI y el formato de `data/managers.json`), datos (`managers.json` nuevo), área sin explorar (leí `src/app.js` solo para la coherencia, no los tests), reglas de visibilidad (quién NO puede anular) — 5 de 8; sin MODIFIED (ver 3) · tamaño: ~70 líneas en 3 ficheros
- Dominio (opus): qué NO puede hacer quien no es responsable (señal: reglas de permiso), si la decisión 4 contradice el Intent, y las cinco reglas de (6)
- Técnica (sonnet): si cada escenario es observable y cubre fichero ausente o inválido y `--como` sin valor, y si el formato del JSON es contrato estable (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar si la regla de permisos deja huecos que solo se ven cuando alguien anula lo que no debía

Segunda ronda (un revisor, sonnet) por haber aceptado Críticos en la primera; sin tercera.

### Pasada de coherencia

`capability merge` sobre una copia de `.docs/sdd` de la versión final: salida 0: `responsables-de-sala.md` con sus 5 reglas y «Cada sala tiene un único responsable»; `reservas.md` con sus 5 reglas y «Anular una reserva exige ser responsable de la sala», «Anular exige decir quién anula» y «Anular comprueba al responsable antes que la reserva». Lo retirado: nada (`git grep` de «anular/void» solo da `voidBooking` y PRODUCT.md «Anulación», coherente).

### Hallazgos de la review

Primera ronda:
- **Aceptado** — Crítico (dominio): la decisión 4 contradecía el Intent «reservas de otras personas» y «a nombre de quien la pide» de PRODUCT.md → Intent reescrito («solo el responsable anula, sea de quien sea la reserva»); la decisión 4 declara que hoy la reserva no guarda el nombre.
- **Aceptado** — Crítico (dominio): no existía «Reglas de la capacidad» → una entrada por capacidad, con las cinco reglas y su origen.
- **Aceptado** — Crítico (dominio): nombres de capacidad en inglés frente a PRODUCT.md («Evitar: booking, room») → `responsables-de-sala` y `reservas`.
- **Aceptado** — Crítico (técnica): el escenario de `room-managers` no era observable → ahora «responsable» se prueba con `anular`.
- **Aceptado** — Crítico (técnica): el escenario «sala sin responsable» tenía placeholder → escenarios con sala inventada (`Este`) y fichero ausente.
- **Aceptado** — Importante (dominio): quien no es responsable pierde `anular` para su propia reserva → decisión 8.
- **Aceptado** — Importante (dominio): `--como` no es seguridad → decisión 2.
- **Aceptado** — Importante (dominio): faltaba un nombre que no es responsable de ninguna sala → escenario con «Marta».
- **Aceptado** — Importante (dominio): nadie edita responsables por la CLI → decisión 9 y «No entra».
- **Aceptado** — Importante (técnica): `--como` sin valor, JSON inválido, ruta, mayúsculas, orden → decisiones 2, 5, 10, 11 y escenarios.
- **Aceptado** — Menor: `reservas` nace parcial; regla de conflicto «no aplica»; política de modelos fuera de la lista.
- **Rechazado** — Importante (técnica): documentar el formato de `managers.json` en `architecture.md` → fichero de datos de un solo uso; queda en «Reglas de la capacidad» y no se toca `architecture.md`.
- **Rechazado** — Importante (dominio): actualizar «Product Purpose» → decisión del dev-lead: decisión 12.

Segunda ronda:
- **Aceptado** — Crítico: un único requisito con nueve `AND` → tres requisitos de `reservas` (permiso, `--como`, reserva inexistente) y uno de `responsables-de-sala`.
- **Aceptado** — Crítico: `responsables-de-sala` sin requisito → requisito «Cada sala tiene un único responsable» con los escenarios de sala sin responsable, fichero ausente y fichero inválido.
- **Aceptado** — Importante: JSON bien formado pero de forma errónea → escenario con `{"Norte": ["Ana"]}` y decisión 5 ampliada.
- **Aceptado** — Importante: el orden de comprobaciones solo se probaba a medias → escenarios `anular Este mar` sin `--como` y `anular Este mar --como Ana`.
- **Aceptado** — Importante: pasadas 24 h quien reservó no puede quitar su reserva → dicho en la decisión 8.
- **Aceptado** — Importante: «Dónde viven los datos» de `reservas` confuso → reescrito con su origen (el código actual).
- **Aceptado** — Menor: bloque de la review pegado a las decisiones y promesa de anotar el merge → review en su propia subsección y resultado anotado; comparación exacta (decisión 2).
- **Rechazado** — Menor: exigir que Laura decida PRODUCT.md antes de aprobar como condición → ya va en 12 como pregunta del gate; no la convierto en enmienda yo.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular reservas de esa sala, sea de quien sea la reserva.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` (`voidBooking` y `run` en `src/app.js`, incluido el uso de `params`); `data/managers.json`; tests en `test/` (hoy `anular` no tiene ninguno); `reservas` nace con los requisitos de anular y `responsables-de-sala` con el del responsable.
- No entra: cancelar (`cancelar` sigue igual y sin `--como`); comandos para cambiar responsables; guardar quién hizo la reserva; que quien reservó pueda quitar su reserva pasadas 24 h (consecuencia de la decisión 8); tocar «Product Purpose».

## Approach

`anular` valida en este orden `--como`, el responsable leído de `data/managers.json` y la existencia de la reserva, y rechaza a quien no es responsable de la sala.

## Delta de comportamiento

### Capacidad: `responsables-de-sala`

#### Reglas de la capacidad — responsables-de-sala

- **Dónde viven los datos**: `data/managers.json`, un objeto `{"Sala": "Nombre"}`, editado a mano.
- **Idioma de los nombres**: castellano (salas y personas tal como se escriben; capacidad `responsables-de-sala`).
- **Límites**: no aplica (un responsable por sala; el formato no admite dos).
- **Avisos**: no aplica.
- **Regla ante conflicto**: no aplica.

**ADDED — Cada sala tiene un único responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y una reserva activa de Sur el martes
- WHEN `anular Sur mar --como Ana`
- THEN responde «solo Luis anula reservas de Sur» y la reserva sigue activa
- AND con `data/managers.json` sin la sala Este, `anular Este lun --como Ana` responde «la sala Este no tiene responsable»
- AND con `data/managers.json` ausente, `anular Norte lun --como Ana` responde «la sala Norte no tiene responsable» y la reserva sigue activa
- AND con `data/managers.json` que no es JSON, `anular Norte lun --como Ana` responde «managers.json no es válido» y la reserva sigue activa
- AND con `data/managers.json` igual a `{"Norte": ["Ana"]}`, `anular Norte lun --como Ana` responde «managers.json no es válido» y la reserva sigue activa

### Capacidad: `reservas`

#### Reglas de la capacidad — reservas

- **Dónde viven los datos**: en memoria, en `src/app.js` (según el código actual, origen: el código); esta feature no lo cambia.
- **Idioma de los nombres**: castellano.
- **Límites**: no aplica (la feature no introduce límites; origen: el Intent).
- **Avisos**: no aplica (la feature no introduce avisos; origen: el Intent).
- **Regla ante conflicto**: no aplica (la feature no introduce conflictos; origen: el Intent).

**ADDED — Anular una reserva exige ser responsable de la sala**
- GIVEN la reserva activa de Norte del lunes y `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Marta` responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como ana` responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»

**ADDED — Anular exige decir quién anula**
- GIVEN la reserva activa de Norte del lunes y `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun`
- THEN responde «indica quién anula con --como» y la reserva sigue activa
- AND `anular Norte lun --como` responde «indica quién anula con --como» y la reserva sigue activa
- AND con `data/managers.json` que no es JSON, `anular Norte lun` responde «indica quién anula con --como»

**ADDED — Anular comprueba al responsable antes que la reserva**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y sin reserva de Norte el martes ni de Este el martes
- WHEN `anular Norte mar --como Ana`
- THEN responde «sin reserva Norte mar»
- AND `anular Norte mar --como Luis` responde «solo Ana anula reservas de Norte»
- AND `anular Este mar --como Ana` responde «la sala Este no tiene responsable»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

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

- Nuevas: `responsables-de-sala` — quién es responsable de cada sala.
- Nuevas: `reservas` — anular una reserva exige ser responsable de la sala (el proyecto aún no tiene `capabilities/`, así que `reservas` nace con este requisito).

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`responsables-de-sala`), contrato público (`anular` gana `--como` y `data/managers.json` es un formato nuevo), datos (`data/managers.json`), reglas de visibilidad (quién NO puede anular) · tamaño: ~80 líneas en 5 ficheros (`src/app.js`, `data/managers.json`, test, dos capacidades)
- Dominio (opus): qué NO puede hacer quien no es responsable y qué pasa con `--como` ausente o con una sala sin responsable en `managers.json` (señal: reglas de visibilidad); si «reservas de otras personas» se sostiene cuando `bookings` en `src/app.js` no guarda a nombre de quién está la reserva (señal: datos)
- Técnica (sonnet): si `--como` encaja en el `run(cmd, params)` actual, que solo lee `params[0]` y `params[1]`, y cómo se lee `data/managers.json` sin dependencias (señal: contrato público)
- Mínimo razonable: solo dominio — deja sin mirar la lectura del fichero y el parseo de `--como`

Política de modelos: dominio en Opus (la spec toca quién puede hacer qué), técnica en Sonnet; la segunda ronda, un revisor en Sonnet.

1. Capacidad nueva `responsables-de-sala` (`responsableDe(sala, managers)` es pura: recibe el mapa, no lee el fichero; lo lee `run`), con los responsables en `data/managers.json`, un objeto sala → nombre (`{"Norte": "Ana", "Sur": "Luis"}`). Una sala tiene un solo responsable; una persona puede serlo de varias salas.
2. Quien ejecuta el comando se identifica con `--como <nombre>`: es obligatorio y va después de sala y día (sala y día son los dos primeros argumentos; el orden de `--como` respecto a ellos no se valida más); `--como` sin valor equivale a ausente. **No autentica**: cualquiera puede escribir `--como Ana`; la regla es de convención en una herramienta de oficina, no una barrera de seguridad.
3. **`anular` exige ser responsable de la sala para cualquier reserva**, sea de quien sea. La reserva no guarda titular y esta feature no lo añade: «de otros» del título se lee como «de quien no es responsable». Cancelar la propia reserva es otro comando (`cancelar`, Cancelación en `PRODUCT.md`) y no cambia.
4. Comparación exacta, que distingue mayúsculas, del nombre y de la sala: `--como ana` no es Ana y la sala `norte` no es Norte (sale «la sala norte no tiene responsable»).
5. Sala sin responsable en el fichero (o sala que no existe, o cuya entrada no es una cadena no vacía): nadie anula, mensaje `la sala <sala> no tiene responsable`.
6. `data/managers.json` ausente o mal formado —JSON inválido o raíz que no es un objeto—: no se anula nada, mensaje `no se puede leer data/managers.json`. El fichero se lee en cada `anular`, desde la raíz del repo.
7. El rechazo nombra al responsable (`solo Ana anula reservas de Norte`): en una oficina pequeña el responsable de cada sala no es secreto.
8. `anular <sala> <día>` sigue anulando la reserva activa de esa sala ese día, como hoy; la franja no entra.
9. El mensaje de éxito `anulada <sala> <día>` es el de hoy.
10. Orden de validación en `anular`: `--como` ausente → fichero ilegible → sala sin responsable → quien anula no es responsable → sin reserva activa (mensaje de hoy, `sin reserva <sala> <día>`, también si ya estaba anulada).
11. `reservas` nace parcial: solo describe la anulación; reservar, listar y cancelar se documentarán aparte, y ese fichero no pretende describir todo `reservas`.
12. Pasada de coherencia: `reservas` va en «Nuevas» y su requisito es `ADDED`, porque `capabilities/` no existe y `sdd capability merge` sobre una copia rechazó el `MODIFIED` («bookings no tiene fichero en capabilities/»). El comportamiento de `anular` sí cambia en el código: lo que hoy hace cualquiera pasa a exigir responsable. Nombres de capacidad en castellano, por la constitución (4) y la terminología de `PRODUCT.md`.

### Reglas de la capacidad

- Dónde viven los datos: `data/managers.json`.
- Idioma de los nombres: castellano (capacidades, mensajes); los identificadores del código siguen como están.
- Límites: un responsable por sala, una persona puede serlo de varias.
- Avisos: no aplica.
- Conflicto: no aplica; una sala del fichero que no existe en `rooms` no se usa para nada.

### Hallazgos de la review

- **Aceptado** — (dominio 1, técnica 2) la spec no dice quién es titular de una reserva → decisión 3: `anular` exige ser responsable para cualquier reserva, sin titular; GIVEN sin «de Pedro».
- **Rechazado** — (dominio 2) «`PRODUCT.md` dice que no hay más usuarios» → `PRODUCT.md` ya define la Anulación como la que hace «el responsable de sala» (Terminología): la feature la implementa, no cambia el modelo de usuarios.
- **Aceptado** — (técnica 1) el escenario del responsable pasa sin el comportamiento nuevo → escenarios con estado observable: tras el rechazo la reserva sigue `active` en `bookings`, tras Ana pasa a `voided`.
- **Aceptado** — (dominio 3, técnica 5) `--como` ausente → decisión 2 y escenario.
- **Aceptado** — (dominio 4, técnica 3, 6) sala sin responsable, fichero ausente o mal formado → decisiones 5 y 6 y un escenario cada una.
- **Aceptado** — (dominio 5) `--como` no autentica → decisión 2.
- **Aceptado** — (dominio 6) el rechazo revela al responsable → decisión 7, el nombre es público.
- **Aceptado** — (dominio 7) cinco reglas → bloque «Reglas de la capacidad».
- **Aceptado** — (dominio 8) nombres de capacidad en inglés → renombradas.
- **Aceptado** — (dominio 9) falta la franja → decisión 8.
- **Aceptado** — (dominio 10, técnica 3) frontera cancelación / anulación → decisión 3.
- **Aceptado** — (técnica 4) interfaz de «se pregunta el responsable» → `responsableDe(sala)`, función exportada de `src/app.js`; escenario de sala inexistente.
- **Aceptado** — (técnica 5, 7) contrato de `--como` y decisiones del cuerpo no listadas → decisiones 2, 4, 5, 7, 9.
- **Aceptado** — (técnica 8) mensaje de éxito heredado → decisión 9 y escenario de no regresión.
- **Aceptado** — (técnica 9) fichero de test y aislamiento → Scope: `test/anular.test.js`, `voidBooking` recibe el mapa de responsables y el test le pasa uno en memoria; el fichero real solo lo lee `run`.

- **Aceptado** — (2.ª ronda 1, 10) capitalización → escenario `--como ana` y decisión 4 ampliada a la sala.
- **Aceptado** — (2.ª ronda 2) `--como` sin valor y orden → decisión 2 y escenario.
- **Aceptado** — (2.ª ronda 3, 5) prioridad entre errores y reserva inexistente o ya anulada → decisión 10 y escenarios.
- **Aceptado** — (2.ª ronda 4) estado en «Sala sin responsable» → `AND` la reserva sigue `active`, y escenario de sala inexistente.
- **Aceptado** — (2.ª ronda 6) verdad viva parcial → decisión 11.
- **Aceptado** — (2.ª ronda 7) Scope incompleto → `src/app.js` listado; ningún test existente llama a `voidBooking`, así que el cambio de firma no rompe nada.
- **Aceptado** — (2.ª ronda 8) firma de `responsableDe` → pura, con mapa en memoria.
- **Aceptado** — (2.ª ronda 9) «mal formado» y entradas que no son cadena → decisiones 5 y 6.

Delta probado sobre una copia de `.docs/sdd` tras plegar la review: `responsables-de-sala.md: añadido «Cada sala tiene un responsable»` · `reservas.md: añadido` «Anular una reserva», «Anular exige decir quién anula», «Sala sin responsable» y «Fichero de responsables ilegible».

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular reservas de esa sala.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` en `src/app.js` (parseo de `--como`, `voidBooking(room, day, who, managers)` con firma nueva, lectura del fichero en `run`); `data/managers.json`; `responsableDe(sala, managers)` en `src/app.js`; `test/anular.test.js`.
- No entra: cancelar la propia reserva (`cancelar`), que sigue igual; guardar titular en la reserva; autenticar a quien ejecuta; la franja en `anular`.

## Approach

`anular` lee `data/managers.json` en cada llamada, y `voidBooking(room, day, who, managers)` rechaza a quien no es responsable de la sala sin tocar la reserva.

## Delta de comportamiento

### Capacidad: `responsables-de-sala`

**ADDED — Cada sala tiene un responsable**
- GIVEN el mapa `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `responsableDe('Norte', mapa)`
- THEN devuelve `Ana`
- AND `responsableDe('Este', mapa)` devuelve `undefined`

### Capacidad: `reservas`

**ADDED — Anular una reserva**
- GIVEN la reserva activa de Norte del lunes y Ana responsable de Norte
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva de Norte del lunes sigue `active`
- WHEN `anular Norte lun --como ana`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue `active`
- WHEN `anular Norte lun --como Ana`
- THEN responde «anulada Norte lun» y la reserva pasa a `voided`

**ADDED — Anular exige decir quién anula**
- GIVEN la reserva activa de Norte del lunes
- WHEN `anular Norte lun` sin `--como`
- THEN responde «indica quién anula con --como» y la reserva sigue `active`
- AND `anular Norte lun --como` (sin valor) responde lo mismo
- AND con el fichero ilegible y sin `--como`, responde lo mismo (va primero)

**ADDED — Sala sin responsable**
- GIVEN `data/managers.json` sin entrada para Este
- WHEN `anular Este lun --como Ana`
- THEN responde «la sala Este no tiene responsable» y la reserva de Este del lunes sigue `active`
- AND `anular Oeste lun --como Ana`, con Oeste fuera de `rooms` y del fichero, responde «la sala Oeste no tiene responsable»

**ADDED — Fichero de responsables ilegible**
- GIVEN `data/managers.json` ausente o con JSON mal formado
- WHEN `anular Norte lun --como Ana`
- THEN responde «no se puede leer data/managers.json» y la reserva sigue `active`

**ADDED — Anular sin reserva activa**
- GIVEN Ana responsable de Norte y ninguna reserva activa de Norte el martes
- WHEN `anular Norte mar --como Ana`
- THEN responde «sin reserva Norte mar»
- AND repetir `anular Norte lun --como Ana` sobre una reserva ya `voided` responde «sin reserva Norte lun»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

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

🦆 Hoy cualquiera anula cualquier reserva; después de esta feature, solo el responsable de la sala puede: si Luis intenta anular la reserva de Norte del lunes, la herramienta le dice «solo Ana anula reservas de Norte» y la reserva sigue en pie, y si lo intenta Ana, queda anulada. Cada sala tiene un responsable apuntado en un fichero de datos, y quien anula dice quién es al ejecutar la orden. Quien quiera quitar su propia reserva sigue usando la cancelación, que no cambia.

## Capacidades

> `.docs/sdd/capabilities/` no existe todavía: no hay requisito vigente de `bookings` que fusionar. Al cerrar, `bookings` nace con este requisito.

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — anular una reserva exige ser responsable de la sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos (modelo Opus: toca permisos por rol) — señales: capacidad nueva (`room-managers`), dato persistente nuevo (`data/managers.json`), regla de permiso (quién no puede anular), formato de fichero que consumirá la 0009 · tamaño: ~60 líneas en 4 ficheros
- Dominio: qué NO puede hacer quien no es responsable (incluido el dueño de la reserva) y qué pasa con una sala sin responsable (señal: regla de permiso)
- Técnica: si `data/managers.json` es un formato que la 0009 pueda heredar sin migrar (señal: dato nuevo + formato de fichero)
- Mínimo razonable: ninguna — deja sin mirar el choque con la 0009 y el hueco del dueño de la reserva, justo lo que no se ve hasta implementar

1. **Choque con la 0009 (decide tú).** `docs/config.md` dice que «quién es cada responsable y su fichero los define la 0009», y la 0009 está antes en el roadmap. Esta spec define aquí la capacidad `room-managers` y `data/managers.json` por mínima necesidad. Recomiendo: la 0011 trae solo ese mínimo (fichero con un responsable por sala, solo lectura) y la 0009 lo amplía («qué puede hacer»); la alternativa es esperar a la 0009 y que la 0011 consuma lo que defina. Si eliges esperar, esta spec se aparca.
2. Capacidad nueva `room-managers`, con los responsables en `data/managers.json`: `{"Norte": "Ana", "Sur": "Luis"}`.
3. Quien ejecuta la orden se identifica con `--como <nombre>`. No es autenticación: la herramienta se fía de lo que se declara (misión: la uso yo, sin login).
4. **`anular` es solo del responsable, sea quien sea el dueño de la reserva.** La reserva no guarda hoy quién la pidió, y la terminología de `PRODUCT.md` ya separa cancelación (el propio cliente) de anulación (el responsable). El Intent anterior decía «reservas de otras personas»; lo he cambiado porque contradecía el THEN.
5. Sin `--como`: responde «indica quién eres con --como <nombre>» y no anula nada.
6. Sala sin responsable en el fichero (o fichero ausente): responde «Sur no tiene responsable» y no anula nada. Nadie anula por defecto.
7. Orden de comprobaciones: primero identidad y permiso, después si hay reserva. Quien no es responsable no se entera de si existe la reserva.
8. Los nombres se comparan tal cual, con mayúsculas y minúsculas.
9. La capacidad `bookings` nace aquí (no existía en `capabilities/`), con solo el requisito de anular; el resto de lo que hace la herramienta queda sin capturar, como hoy.
10. La cancelación (`cancelar`) no se toca, aunque tampoco compruebe quién es el dueño: fuera de alcance.

## Intent

Hoy `anular` anula cualquier reserva a cualquiera. Debe poder anular solo el responsable de la sala; quien quiera quitar la suya, cancela. Éxito: con el fichero de responsables, nadie que no lo sea consigue anular (ni su propia reserva) y la reserva queda activa; falla si alguien anula sin ser responsable, o si el responsable no puede anular.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` (`src/app.js`); `data/managers.json`; sus tests; la línea de responsables de `docs/config.md`.
- No entra: cancelar (`cancelar`), que sigue igual; editar responsables desde la herramienta; la lista completa de lo que puede hacer un responsable (0009); avisos por correo.

## Approach

`anular` consulta el responsable de la sala en `data/managers.json` y rechaza a quien no lo es, antes de mirar si hay reserva.

## Dónde se prueba

- anular como responsable / como no responsable / sin identificar / sala sin responsable: por `run('anular', …)`, como los tests de `test/cancel.test.js`.
- responsable de una sala: por la misma función `run`, con un fichero de datos de prueba.

## Términos y ADR

- Términos resueltos: **Anulación** = la hace el responsable de la sala (`PRODUCT.md`); **Cancelación** = la hace el propio cliente.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-managers`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se pregunta el responsable de Norte
- THEN es Ana

**ADDED — Una sala sin responsable no lo tiene**
- GIVEN `data/managers.json` con `{"Norte": "Ana"}`
- WHEN se pregunta el responsable de Sur
- THEN no hay responsable

**Reglas de la capacidad**
- **Dónde viven los datos**: `data/managers.json`, un nombre por sala
- **Idioma de los nombres**: salas y personas como en `PRODUCT.md` (Norte, Sur)
- **Límites**: un responsable por sala
- **Avisos**: «Sur no tiene responsable»
- **Regla ante conflicto**: sin responsable, nadie anula

### Capacidad: `bookings`

**ADDED — Anular una reserva**
- GIVEN la reserva de Norte del lunes, activa, y Ana responsable de Norte
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»

**ADDED — Anular exige decir quién eres**
- GIVEN la reserva de Norte del lunes, activa
- WHEN `anular Norte lun` sin `--como`
- THEN responde «indica quién eres con --como <nombre>» y la reserva sigue activa

**ADDED — Anular en una sala sin responsable**
- GIVEN `data/managers.json` sin Sur y una reserva activa de Sur del martes
- WHEN `anular Sur mar --como Luis`
- THEN responde «Sur no tiene responsable» y la reserva sigue activa

**Reglas de la capacidad**
- **Dónde viven los datos**: las reservas siguen en memoria; los responsables, en `data/managers.json`
- **Idioma de los nombres**: castellano
- **Límites**: no aplica
- **Avisos**: «solo <responsable> anula reservas de <sala>» · «indica quién eres con --como <nombre>» · «<sala> no tiene responsable»
- **Regla ante conflicto**: identidad y permiso se comprueban antes que la existencia de la reserva

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

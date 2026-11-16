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

- Nuevas: `reservas` — cómo se anula una reserva y quién puede hacerlo, y el listado de anuladas.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 2 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. No es control de acceso, es el modo de uso: quien escribe el comando elige el rol.
2. El cliente ve en `anuladas` la reserva anulada sin quién la anuló: `Norte lun — anulada`.
3. Capacidad nueva `reservas`: no hay `capabilities/`, así que lo que hoy hace `anular` (`src/app.js`, `voidBooking`) se describe como `ADDED`, no `MODIFIED`.
4. «Responsable de sala» es un solo rol para todas las salas: el roadmap dice «de cada sala», pero la app no tiene asignación de responsables por sala.
5. `anuladas` es un comando nuevo (hoy `run` devuelve `salas` ante un comando desconocido), con el literal `<sala> <día> — anulada` y, para el responsable, `… — anulada por responsable`.
6. Sin `--como`, o con un valor que no sea `cliente` ni `responsable`, se trata como `cliente` en `anular` y en `anuladas`: es el rol con menos permisos. Es un cambio de contrato: hoy `anular Norte lun` sin `--como` anula; tras esta feature se rechaza.
7. El cliente no anula ni su propia reserva (para eso está `cancelar`, que no cambia). `anuladas` lista solo las anuladas, no las canceladas.
8. Dónde vive el dato: quién anuló se guarda en la reserva en memoria (`voidedBy`, junto a `status: 'voided'`), como el resto de reservas de `src/app.js`; sin persistencia no hay migración ni anuladas antiguas sin autor. Reglas de la capacidad: nombres en castellano (`reservas`, literales de la interfaz); límites, avisos y conflicto entre anulaciones, no aplica (una reserva ya anulada responde `sin reserva <sala> <día>`, como hoy).
- Política de modelos: revisores de la spec: dominio opus + técnica sonnet, más un revisor sonnet en la segunda ronda · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Pasada de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` falló al principio («`reservas` no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»»); corregido con «Nuevas» y `ADDED`. Repetido tras la corrección, sale: `reservas.md: añadido «Anular una reserva»` y `reservas.md: añadido «Listado de anuladas»` (exit 0). `git grep` de `anular`/`anulad` fuera de las specs: solo `src/app.js` (líneas 20-25, 31) y la fila 0011 de `ROADMAP.md`; no hay `test/` de `anular`.

### Hallazgos de la review

- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 2.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Aceptado** — Importante (2.ª ronda) · Delta · faltaban casos límite → AND nuevos: `--como admin` y `anuladas` sin `--como` se tratan como cliente (decisión 6); una reserva inexistente o ya anulada responde `sin reserva <sala> <día>`; `anuladas` sin anuladas responde vacío.
- **Aceptado** — Importante (2.ª ronda) · Decisiones · cliente que anula la suya y frontera con `cancelar` → decisión 7.
- **Aceptado** — Importante (2.ª ronda) · Decisión 1 · `--como` no es seguridad → frase añadida; «lo seguro» de la 6 matizado a «rol con menos permisos».
- **Aceptado** — Importante (2.ª ronda) · Capacidades · `bookings` en inglés frente a la constitución (castellano) → renombrada a `reservas`; merge repetido, exit 0.
- **Aceptado** — Importante (2.ª ronda) · Revisión propuesta · decía 3 ficheros, Scope lista 2 → corregido a 2.
- **Aceptado** — Importante (2.ª ronda) · Scope · dónde vive «quién anuló» → decisión 8.
- **Aceptado** — Importante (2.ª ronda) · Decisiones 5 y 6 · impacto en quien invoca `anular` sin `--como` → decisión 6, con el literal del rechazo; el código de salida no cambia (la app imprime y sale 0, como hoy).
- **Rechazado** — Menor (2.ª ronda) · Delta · segunda reserva en el listado → la app solo tiene la reserva de Norte lun de ejemplo; el literal del cliente ya no contiene «responsable».
- **Aceptado** — Menor (2.ª ronda) · Scope · recorte de «de cada sala» → «No entra: responsables por sala»; la fila 0011 del roadmap se actualiza al archivar.
- **Aceptado** — Menor (2.ª ronda) · límites, avisos y conflicto → «no aplica» explícito en la decisión 8.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 1).

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no.

## Scope

- Entra: `anular` con `--como`, y quién anuló en el listado `anuladas`. Ficheros: `src/app.js` (`voidBooking`, `run`) y `test/anular.test.js` (nuevo).
- No entra: `cancelar`, ni responsables distintos por sala (decisión 4).

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Anular una reserva**
- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND sin `--como`, o con `--como admin`, responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND `anular Sur mar --como responsable` (sin reserva) responde `sin reserva Sur mar`

**ADDED — Listado de anuladas**
- GIVEN la reserva de Norte del lun anulada por el responsable
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`
- AND `anuladas --como cliente`, y `anuladas` sin `--como`, listan `Norte lun — anulada`
- AND sin ninguna anulada, `anuladas --como responsable` responde vacío

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |

---
id: 20261008-170000-feature-0019-manager-marks
feature: 0019
title: El responsable ve sus salas marcadas en libres
mode: lite
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — El responsable ve sus salas marcadas en libres

## Capacidades

- Nuevas: `rooms` — `libres` lista las salas libres de una franja y, con `--como responsable`, marca con `*` las de las que es responsable.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet), lite — señales: capacidad nueva (`rooms`), visibilidad (`--como responsable` frente a `--como cliente`) · tamaño: ~15 líneas en 2 ficheros
- Todo (sonnet): los siete puntos sobre esta spec; en especial de dónde sale «las salas de las que es responsable» y qué pasa con una sala suya ocupada (señal: visibilidad)
- Mínimo razonable: sin review — deja sin cubrir que el dato del responsable y el comando real (`libres <franja>`) no cuadraran con el código, que es lo que encontró la primera ronda

1. Capacidad nueva `rooms` en `capabilities/` (hoy no hay ninguna). Nace con cuatro requisitos: el base de `libres`, que hoy solo está en código y en un test, la marca, la sala suya ocupada y la ausencia de marcas para quien no es responsable. El nombre va en inglés porque es nombre de fichero; el contenido, en castellano.
2. El comando real es `libres <franja>` (no lleva día: hoy se ignora). La marca se añade a ese comando: `libres <franja> --como responsable`. No añado el día.
3. Quién es «el responsable»: en la herramienta no hay usuarios ni datos de responsables. Propongo una lista fija en el código, `salasDelResponsable = ['Norte']`, igual que la lista de salas. `--como responsable` significa «consulto como responsable de esas salas».
4. La marca es un `*` detrás del nombre de la sala (`Norte*`); la lista sigue separada por `, ` y en el orden de las salas, como hoy.
5. `--como cliente`, `--como` ausente o cualquier otro valor (`admin`, `Responsable` con mayúscula, `--como` sin valor): lista igual que hoy, sin marcas. No añado error ni aviso para un valor desconocido: el silencio es deliberado, porque `libres` hoy ignora lo que no entiende y no quiero cambiar eso en esta feature.
5 bis. La franja va siempre primera y `--como <valor>` después. Con `--como` primero, `--como` se toma como franja, como ocurre hoy con cualquier argumento: lista sin marcas.
6. Una sala del responsable que está ocupada en la franja no aparece, y por tanto no se marca (se queda como hoy).
7. Reglas de la capacidad: dónde vive el dato = constante en `src/app.js`, de valor fijo `['Norte']`, que los tests dan por supuesto (los GIVEN «Norte como sala del responsable» son ese dato, no un fixture que se pueda variar); idioma = castellano (`responsable`, `cliente`); avisos = ninguno, a propósito (decisión 5); límites y conflicto de nombres = no aplica (lista cerrada de dos salas). La constitución no tiene «Reglas de producto».
8. «Responsable» y «cliente» no son cuentas: son dos maneras de consultar la misma herramienta de un solo usuario.
9. Política de modelos: review de spec en sonnet (lite); la implementación, según el plan.

Prueba del delta en una copia de `.docs/sdd` fuera del repo: `capability merge` → `rooms.md`: añadidos los cuatro requisitos, sin rechazos, sin rechazos. El `capabilities/` del repo no cambia.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

### Hallazgos de la review

- **Aceptado** — (Crítico) no se dice quién es el responsable ni dónde vive el dato → decisión 3 y GIVEN con el fixture.
- **Aceptado** — (Crítico) faltan casos del complemento: sala suya ocupada → decisión 6 y escenario. «Responsable sin salas» y «varias salas» **rechazado**: solo hay un responsable fijo y no hay más datos que lo permitan; queda en «No entra».
- **Aceptado** — `libres` base sin respaldo vivo y `--como` ausente o desconocido → requisito base en la delta y decisión 5.
- **Aceptado** — un único fixture no verifica el orden → el escenario de la marca usa `Norte*, Sur` y el de sala ocupada `Sur`; el orden se declara en la decisión 4.
- **Aceptado** — decisiones sin declarar y nombre `rooms` → decisiones 1 y 4.
- **Aceptado** — reglas de producto (5 bis) → decisión 7.
- **Aceptado** — canal y formato exactos → los THEN dicen el valor que devuelve `run`, sin salto de línea.
- **Aceptado** — `rooms` con un solo requisito deja la verdad viva incompleta → decisión 1.
- **Aceptado** — otros comandos y argumentos incompletos → «No entra».
- **Ronda 2 aceptada** — nº de requisitos incoherente → decisión 1 (cuatro); AND con WHEN propio → requisito aparte con un escenario por entrada; valor desconocido sin escenario → `admin` y decisión 5; posición de `--como` → decisión 5 bis y «No entra»; bordes del base → «No entra»; silencio ante `--como` desconocido → decisión 5 y 7; constante fija → decisión 7.
- **Ronda 2 rechazada** — mover la propuesta de review fuera de ✋ (el kit la pone al abrir ese bloque); el paso de `capability merge` a una tarea del plan (es del paso de spec, no del gate); aprobador «Laura» (ver abajo). Sin tercera ronda.
- **Rechazado** — aprobador «Laura» frente a la misión de un solo usuario → viene de la plantilla del proyecto y el rol lo fija el dev-lead; lo aclaro en la decisión 8, sin tocar los aprobadores.

## Intent

El responsable de sala no ve de un vistazo cuáles de las salas libres de una franja son suyas. Hoy `libres 14:00-16:00` responde `Norte, Sur`. Con esta feature, `libres 14:00-16:00 --como responsable` responde `Norte*, Sur`.

## Scope

- Entra: el requisito base de `libres <franja>` en `rooms`, y `libres <franja> --como responsable`, que marca sus salas.
- No entra: el día en `libres`; otros comandos de listado; varios responsables o salas por responsable; error o aviso ante un `--como` desconocido; `--como` antes de la franja; el borde de todas las salas ocupadas o de una franja sin reservas (queda como hoy, sin escenario nuevo); identificar a una persona.

## Dónde se prueba

- Todo, por `run('libres', …)`, en `test/app.test.js`; el gate de cierre (`node --test` entero) lo cubre.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Libres lista las salas libres de la franja

- GIVEN Norte reservada y Sur libre en `10:00-12:00`
- WHEN `run('libres', ['10:00-12:00'])`
- THEN devuelve `Sur`

#### ADDED — El responsable ve sus salas marcadas

- GIVEN Norte y Sur libres en `14:00-16:00`, y Norte como sala del responsable
- WHEN `run('libres', ['14:00-16:00', '--como', 'responsable'])`
- THEN devuelve `Norte*, Sur`

#### ADDED — Quien no es responsable no ve marcas

- GIVEN Norte y Sur libres en `14:00-16:00`, y Norte como sala del responsable
- WHEN `run('libres', ['14:00-16:00', '--como', 'cliente'])`
- THEN devuelve `Norte, Sur`
- WHEN `run('libres', ['14:00-16:00'])`
- THEN devuelve `Norte, Sur`
- WHEN `run('libres', ['14:00-16:00', '--como', 'admin'])`
- THEN devuelve `Norte, Sur`

#### ADDED — Una sala del responsable ocupada no aparece

- GIVEN Norte reservada y Sur libre en `10:00-12:00`, y Norte como sala del responsable
- WHEN `run('libres', ['10:00-12:00', '--como', 'responsable'])`
- THEN devuelve `Sur`

### Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,2 h
- Estimación de implementación: 0,5 h
- Base de la estimación: un comando y su test
- Confianza: alta

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |

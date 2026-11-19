---
id: 20261008-190000-feature-0021-slot-check
feature: 0021
title: Franja no válida en libres
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Franja no válida en libres

## Capacidades

- Nuevas: `rooms` — las salas y su listado de libres por franja; esta spec la crea con el comportamiento vigente de `libres` y la regla nueva.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`rooms`) · tamaño: ~10 líneas en 2 ficheros
- Único (sonnet): si el escenario de `libres 10:00-12:00` y el de `10:00-10:00` pasan sin el comportamiento, y si lo que `rooms` documenta como vigente coincide con el test existente (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si el escenario vigente que la spec fija como contrato describe lo que el código hace hoy

1. El caso que reportó conserjería, `libres 10:00-10:00` (`src/app.js:5`, `freeRooms`), lista hoy `Norte, Sur` (medido) en una franja de cero minutos: es el caso que esta spec cierra, y lleva su escenario.
2. El texto de la respuesta: «franja no válida: el final va después del inicio».
3. Franja no válida = el final no es posterior al inicio, y lo son tanto la de cero minutos (`10:00-10:00`) como la invertida (`12:00-10:00`): ambas, con el mismo texto.
4. Capacidad nueva `rooms` (slug en inglés, kebab-case): `capabilities/` no existe aún y el merge rechaza `MODIFIED` sobre una capacidad sin fichero. Nace con dos requisitos: el vigente («Ver las salas libres», por el test existente) y el nuevo.
5. Una franja sin `-` o ausente no se toca y no se prueba: sigue como hoy (formato `HH:MM` es la fila de deuda). Solo se rechaza cuando hay inicio y final.
6. La comparación es de texto, sobre `HH:MM` con ceros. Consecuencia aceptada: `9:00-10:00` (sin cero) se rechazaría, porque `"9:00" > "10:00"`; arreglarlo es el formato, fuera de esta spec.
7. El rechazo es una cadena que devuelve `run` (como el resto de respuestas), no un error ni un código de salida.
- Escenario vigente de `rooms`: viene de `test/app.test.js:5-6`, que pasa hoy (4 tests, 0 fallos); el nombre «Ver las salas libres» es nuevo.
- Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → «rooms.md: añadido «Ver las salas libres»» y «rooms.md: añadido «Rechazar una franja no válida»» (exit 0); `capabilities/` del repo sin tocar.
- Política de modelos: sin revisores de la spec salvo lo que decida `sdd-spec-review` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · hasta `control.maxParallelAgents`

### Hallazgos de la review

Un revisor (sonnet, todos los puntos; spec pequeña y sin contrato público ni `MODIFIED`). Sin Críticos: sin segunda ronda.

- **Aceptado** — el escenario `Sur` pasa con un valor fijo y no fija el día → AND con `12:00-14:00` y nota de que el día no se usa.
- **Aceptado** — la decisión 5 prometía comportamiento sin escenario → pasa a «no se prueba» (decisión 5).
- **Aceptado** — comparación textual sin declarar, `9:00-10:00` falso rechazo → decisión 6.
- **Aceptado** — la regla de «no válida» no estaba en el requisito → frase en el requisito.
- **Aceptado** — escenario vigente sin fuente → citado `test/app.test.js:5-6`, pasa hoy.
- **Aceptado** — canal de salida sin declarar → decisión 7.
- **Aceptado** — «Dónde se prueba» listaba como nuevo el test existente → reutiliza.
- **Rechazado** — slug `rooms` frente a «Evitar: room» → el slug en inglés lo exige la regla 1 de la plantilla de capacidades; «Evitar» es del texto en castellano.
- **Rechazado** — constitución sin «Reglas de producto» → no hay datos nuevos salvo el texto de respuesta, ya en la decisión 2.
- **Rechazado** — Laura y conserjería no están en PRODUCT.md → el reporte y el aprobador los da el dev-lead.

## Intent

Hoy `libres` acepta cualquier franja y responde con salas libres aunque la franja no tenga sentido. Debe rechazarla.

## Scope

- Entra: `run('libres', …)` en `src/app.js:28`, que valida la franja antes de llamar a `freeRooms` (`src/app.js:5`), y su test en `test/app.test.js`.
- No entra: el formato `HH:MM`, que es la fila de deuda «Sin validación del formato de franja horaria»; `reservar`, `cancelar` y `anular`.

## Lo que se retira o cambia de forma

Nada se retira ni cambia de forma: solo se añade un rechazo. Comprobado con `git grep -niE "franja|0021"` fuera de la carpeta de la spec: `debt.md:7` (fila de formato, sigue fuera), `CHANGELOG.md:10` (entrada de la 0006, sin cambio), `PRODUCT.md:11` (término Reserva), `test/app.test.js:5-6` (el escenario vigente no cambia).

- Filas que implementa: 0021 → nada: no está en `ROADMAP.md` (`git grep -n 0021 -- ROADMAP.md` sin resultado).

## Approach

Una sola vía sensata: comparar inicio y final como texto antes de listar, porque `HH:MM` con ceros compara bien en orden alfabético. Una función con el rechazo no aporta más que dos líneas en `run`; no se crea módulo.

## Dónde se prueba

- Franja de cero minutos e invertida: por `run('libres', …)`, en `test/app.test.js`, como el test de `libres` existente (dos tests nuevos). La franja válida reutiliza el test existente (`test/app.test.js:5`); no se añade otro.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Ver las salas libres

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`
- AND `libres 12:00-14:00` responde `Norte, Sur` (la consulta no usa el día)

#### ADDED — Rechazar una franja no válida

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND `libres 12:00-10:00` responde lo mismo
- AND una franja no es válida si su final no es posterior a su inicio

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
